# API Specification: Data Contracts & Client-Side Architecture
## BaTour - MVP (Front-End Only)

**Stack:**  
React 18+ | Vite | React Router v6 | Zustand | IndexedDB | Tailwind CSS

**Version:** 1.0  
**Status:** Ready for Implementation  
**Last Updated:** May 14, 2026

---

## Architecture Overview

This is a **100% client-side MVP**. There are no HTTP endpoints. All data is:
- **Static JSON files** (destinations, guides, car rentals, transit matrix) — bundled at build time
- **Browser IndexedDB** (trip bookings, session state) — persisted locally
- **WhatsApp API** (third-party handoff) — URL scheme only, not proprietary payment gateway

The "API Specification" defines the **exact data contracts** consumed and produced by the frontend.

---

## 1. Static Data Contracts (JSON Files)

### 1.1 destinations.json

**Purpose:** Define all tourist destinations, categories, and fees.

**Schema & Example:**

```json
[
  {
    "id": "dest_001",
    "name": "Kawah Putih",
    "category": "tempat-wisata",
    "zone": "Ciwidey",
    "description": "Crater lake with white sulfur water and scenic views",
    "shortDescription": "Danau Kawah Putih yang eksotis",
    "image": "/images/destinations/kawah-putih.webp",
    "imageAlt": "White crater lake with steam rising",
    "rating": 4.8,
    "reviewCount": 1250,
    "entryFee": 50000,
    "entryFeeLabel": "Rp 50.000",
    "estimatedDurationMinutes": 90,
    "coordinates": {
      "lat": -7.1234,
      "lng": 107.5678
    },
    "operatingHours": "08:00 - 17:00"
  }
]
```

**Field Constraints:**

| Field | Type | Constraints | Example |
|-------|------|-----------|---------|
| `id` | string | Format: `dest_XXX`, unique | `dest_001` |
| `name` | string | Required, 1-100 chars | `Kawah Putih` |
| `category` | string | Enum: `tempat-wisata`, `tempat-makan`, `toko-oleh-oleh` | `tempat-wisata` |
| `zone` | string | Required, matches transit matrix | `Ciwidey` |
| `description` | string | Full description, < 500 chars | `Crater lake with...` |
| `shortDescription` | string | One-liner, < 50 chars | `Danau Kawah Putih...` |
| `image` | string | Path to WebP, < 100KB | `/images/destinations/kawah-putih.webp` |
| `imageAlt` | string | Alt text for accessibility | `White crater lake...` |
| `rating` | number | Float 1-5, 1 decimal | `4.8` |
| `reviewCount` | number | Integer ≥ 0 | `1250` |
| `entryFee` | number | Integer, Rupiah, ≥ 0 | `50000` |
| `entryFeeLabel` | string | Pre-formatted label | `Rp 50.000` |
| `estimatedDurationMinutes` | number | Integer ≥ 30 | `90` |
| `coordinates` | object | { lat, lng } | `{ "lat": -7.1234, "lng": 107.5678 }` |
| `operatingHours` | string | Format: `HH:MM - HH:MM` or `24 jam` | `08:00 - 17:00` |

**Validation in Component:**
```javascript
// Example validation (in utils/validation.js)
const validateDestination = (dest) => {
  if (!dest.id || !dest.id.startsWith('dest_')) throw new Error('Invalid dest ID');
  if (!['tempat-wisata', 'tempat-makan', 'toko-oleh-oleh'].includes(dest.category)) throw new Error('Invalid category');
  if (dest.entryFee < 0) throw new Error('Entry fee cannot be negative');
  if (dest.estimatedDurationMinutes < 30) throw new Error('Duration must be ≥ 30 min');
};
```

---

### 1.2 guides.json

**Purpose:** Define all available tour guides with rates and contact info.

**Schema & Example:**

```json
[
  {
    "id": "guide_001",
    "name": "Pak Budi",
    "photo": "/images/guides/budi.webp",
    "photoAlt": "Pak Budi smiling",
    "rating": 4.9,
    "reviewCount": 340,
    "dailyRate": 500000,
    "dailyRateLabel": "Rp 500.000/hari",
    "languages": ["Indonesian", "English", "Sundanese"],
    "phone": "6281234567890",
    "whatsappNumber": "6281234567890",
    "bio": "20+ years experience guiding tourists through Bandung highlands. Specialist in nature and cultural tours.",
    "specialties": ["Nature", "Cultural", "Photography"],
    "certified": true,
    "yearsExperience": 20,
    "maxGroupSize": 8
  }
]
```

**Field Constraints:**

| Field | Type | Constraints | Example |
|-------|------|-----------|---------|
| `id` | string | Format: `guide_XXX`, unique | `guide_001` |
| `name` | string | Required, 1-50 chars | `Pak Budi` |
| `photo` | string | Path to WebP, < 50KB | `/images/guides/budi.webp` |
| `photoAlt` | string | Alt text | `Pak Budi smiling` |
| `rating` | number | Float 1-5, 1 decimal | `4.9` |
| `reviewCount` | number | Integer ≥ 0 | `340` |
| `dailyRate` | number | Integer, Rupiah, ≥ 300000 | `500000` |
| `dailyRateLabel` | string | Pre-formatted | `Rp 500.000/hari` |
| `languages` | array | Array of strings, ≥ 1 | `["Indonesian", "English"]` |
| `phone` | string | Format: `62XXXXXXXXXX` (11-13 digits) | `6281234567890` |
| `whatsappNumber` | string | Same format as phone | `6281234567890` |
| `bio` | string | Biography, < 500 chars | `20+ years experience...` |
| `specialties` | array | Array of strings | `["Nature", "Cultural"]` |
| `certified` | boolean | True/false | `true` |
| `yearsExperience` | number | Integer ≥ 0 | `20` |
| `maxGroupSize` | number | Integer 2-15 | `8` |

**Validation in Component:**
```javascript
const validateGuide = (guide) => {
  if (!guide.id || !guide.id.startsWith('guide_')) throw new Error('Invalid guide ID');
  if (guide.dailyRate < 300000) throw new Error('Rate too low');
  if (!guide.phone.match(/^62\d{9,11}$/)) throw new Error('Invalid phone format');
  if (guide.languages.length === 0) throw new Error('At least 1 language required');
  if (guide.maxGroupSize < 2 || guide.maxGroupSize > 15) throw new Error('Invalid group size');
};
```

---

### 1.3 carRentals.json

**Purpose:** Define car rental options with pricing and capacity.

**Schema & Example:**

```json
[
  {
    "id": "car_sedan",
    "type": "car",
    "label": "Mobil (Sedan)",
    "description": "Compact sedan, suitable for small groups",
    "capacity": "1-4 pax",
    "image": "/images/cars/sedan.webp",
    "imageAlt": "Gray sedan car",
    "dailyRate": 600000,
    "dailyRateLabel": "Rp 600.000/hari",
    "transmission": "Manual",
    "estimatedFuelConsumption": "1L per 12km"
  },
  {
    "id": "car_van",
    "type": "van",
    "label": "Minivan (7-Seater)",
    "description": "Spacious van for larger groups",
    "capacity": "5-8 pax",
    "image": "/images/cars/van.webp",
    "imageAlt": "White minivan",
    "dailyRate": 900000,
    "dailyRateLabel": "Rp 900.000/hari",
    "transmission": "Automatic",
    "estimatedFuelConsumption": "1L per 8km"
  }
]
```

**Field Constraints:**

| Field | Type | Constraints | Example |
|-------|------|-----------|---------|
| `id` | string | Format: `car_XXX`, unique | `car_sedan` |
| `type` | string | Enum: `car`, `van`, (future: `motorcycle`, `bus`) | `car` |
| `label` | string | Display label, < 50 chars | `Mobil (Sedan)` |
| `description` | string | < 200 chars | `Compact sedan...` |
| `capacity` | string | Format: `X-Y pax` | `1-4 pax` |
| `image` | string | Path to WebP, < 100KB | `/images/cars/sedan.webp` |
| `imageAlt` | string | Alt text | `Gray sedan car` |
| `dailyRate` | number | Integer, Rupiah, ≥ 300000 | `600000` |
| `dailyRateLabel` | string | Pre-formatted | `Rp 600.000/hari` |
| `transmission` | string | `Manual` or `Automatic` | `Manual` |
| `estimatedFuelConsumption` | string | Informational, no validation | `1L per 12km` |

---

### 1.4 transitMatrix.json

**Purpose:** Define travel times between zones for timeline calculation.

**Schema & Example:**

```json
{
  "zones": ["Bandung Pusat", "Ciwidey", "Lembang", "Tangkuban Perahu"],
  "matrix": {
    "Bandung Pusat->Ciwidey": 45,
    "Ciwidey->Lembang": 90,
    "Lembang->Tangkuban Perahu": 30,
    "Bandung Pusat->Lembang": 60,
    "Ciwidey->Bandung Pusat": 45,
    "Lembang->Ciwidey": 90,
    "Tangkuban Perahu->Lembang": 30,
    "Lembang->Bandung Pusat": 60,
    "Bandung Pusat->Tangkuban Perahu": 120,
    "Tangkuban Perahu->Bandung Pusat": 120
  }
}
```

**Field Constraints:**

| Field | Type | Constraints | Example |
|-------|------|-----------|---------|
| `zones` | array | Array of zone names (3-10 zones) | `["Bandung Pusat", "Ciwidey"]` |
| `matrix` | object | Key format: `FROM->TO`, value is minutes (integer) | `"Bandung Pusat->Ciwidey": 45` |

**Validation in Component:**
```javascript
const validateTransitMatrix = (matrix) => {
  matrix.zones.forEach(zone => {
    if (!matrix.matrix[`${zone}->${matrix.zones[0]}`] && zone !== matrix.zones[0]) {
      throw new Error(`Missing transit time for ${zone}`);
    }
  });
};
```

---

## 2. Zustand State Stores (Runtime)

### 2.1 tripStore.js

**Purpose:** Manage the user's trip building state in memory and persisted to IndexedDB.

**Store Schema:**

```javascript
{
  // ===== Selection State =====
  selectedDestinations: [],              // Array of destination IDs (max 3)
  selectedGuide: null,                   // Single guide ID or null
  selectedCar: null,                     // Single car ID or null (null = no car)
  selectedPaymentOption: null,           // 'DP_50' | 'FULL' | null
  
  // ===== Computed State (Auto-Calculated) =====
  totalCost: 0,                          // guideFee + carFee + sum(entryFees)
  guideFee: 0,                           // from guide.dailyRate
  carFee: 0,                             // from car.dailyRate or 0
  entryFees: [],                         // Array: { destinationId, amount }
  timeline: [],                          // Array of timeline steps
  
  // ===== Booking State =====
  currentBooking: null,                  // Full booking object after generation
  bookingId: null,                       // UUID string (BATOUR-XXXXXX)
  
  // ===== Actions =====
  addDestination(destId),                // Add destination (max 3 enforced)
  removeDestination(destId),             // Remove destination
  clearDestinations(),                   // Clear all destinations
  
  setGuide(guideId),                     // Set guide (single only)
  clearGuide(),                          // Clear guide
  
  setCar(carId),                         // Set car or null
  clearCar(),                            // Clear car (no car selected)
  
  setPaymentOption(option),              // 'DP_50' | 'FULL'
  
  calculateTotal(),                      // Recompute totalCost, breakdown, timeline
  
  generateBooking(),                     // Create bookingId, save to IndexedDB
  
  resetTrip(),                           // Clear all selections
  
  loadFromIndexedDB(),                   // Recover session state on app load
}
```

**Store Persistence:**
- Middleware: Zustand `persist` plugin
- Storage: IndexedDB, key: `tripStore`
- Auto-save: Every mutation updates IndexedDB
- Recovery: On app load, state restored from `tripStore` in IndexedDB

**Example Usage:**

```javascript
import { useTrip } from '@/stores/tripStore';

// In component
const store = useTrip();
store.addDestination('dest_001');      // Add destination
store.setGuide('guide_001');            // Set guide
store.setCar('car_sedan');              // Set car
store.calculateTotal();                 // Compute costs
console.log(store.totalCost);           // 1,190,000 (500k guide + 600k car + 90k entry)
store.generateBooking();                // Create bookingId, persist to IndexedDB
```

---

### 2.2 uiStore.js

**Purpose:** Manage UI state (loading, errors, offline status, notifications).

**Store Schema:**

```javascript
{
  isOnline: true,                        // true = online, false = offline
  isLoading: false,                      // For async operations (not used in MVP)
  error: null,                           // Error message string
  successMessage: null,                  // Success toast message
  
  // ===== Actions =====
  setOnline(bool),                       // Update online status
  setLoading(bool),                      // Set loading state
  setError(message),                     // Set error message
  clearError(),                          // Clear error
  setSuccess(message),                   // Set success message
  clearSuccess(),                        // Clear success
}
```

**Example Usage:**

```javascript
const ui = useUI();
ui.setError('Pilih minimal 1 destinasi');
setTimeout(() => ui.clearError(), 3000);
```

---

## 3. IndexedDB Storage Schema

### 3.1 sessionState Store

**Purpose:** Persist trip building session across browser closes.

**Key:** `'user'` (single key-value pair)

**Value Schema:**

```javascript
{
  lastVisit: "2026-05-13T10:30:00Z",    // ISO 8601 timestamp
  hasVisited: true,                      // Return user indicator
  preferredLanguage: "id",               // Future: user language preference
  theme: "light"                         // Future: dark mode toggle
}
```

---

### 3.2 tripState Store

**Purpose:** Persist trip building state (selectedDestinations, selectedGuide, etc).

**Key:** `'current-trip'` (single key-value pair)

**Value Schema:** (matches tripStore schema from 2.1)

```javascript
{
  selectedDestinations: ["dest_001", "dest_003"],
  selectedGuide: "guide_001",
  selectedCar: "car_sedan",
  selectedPaymentOption: "DP_50",
  totalCost: 1190000,
  guideFee: 500000,
  carFee: 600000,
  entryFees: [
    { destinationId: "dest_001", amount: 50000 },
    { destinationId: "dest_003", amount: 40000 }
  ],
  timeline: [
    { step: 1, destination: "Kawah Putih", arrivalTime: "08:00", duration: 90 },
    { step: 2, destination: "Strawberry Farm", arrivalTime: "10:15", duration: 120 }
  ]
}
```

---

### 3.3 bookings Store

**Purpose:** Persist completed bookings for offline trip access.

**Key:** `bookingId` (e.g., `'BATOUR-ABC123'`)

**Value Schema:**

```javascript
{
  bookingId: "BATOUR-ABC123",            // Unique booking reference
  createdAt: "2026-05-13T15:30:00Z",    // ISO 8601 timestamp
  tripDate: "2026-06-15",                // User-provided date (optional)
  destinationIds: ["dest_001", "dest_003"],
  destinationNames: ["Kawah Putih", "Strawberry Farm"],
  guideId: "guide_001",
  guideName: "Pak Budi",
  guidePhoto: "/images/guides/budi.webp",
  guidePhone: "6281234567890",
  carId: "car_sedan",
  carLabel: "Mobil (Sedan)",
  paymentOption: "DP_50",
  guideFee: 500000,
  carFee: 600000,
  entryFees: [50000, 40000],
  totalCost: 1190000,
  dpAmount: 595000,                      // 50% if DP_50, else totalCost
  timeline: [
    { step: 1, name: "Kawah Putih", arrivalTime: "08:00", duration: 90 },
    { step: 2, name: "Strawberry Farm", arrivalTime: "10:15", duration: 120 }
  ],
  status: "pending"                      // pending | confirmed | completed
}
```

---

## 4. WhatsApp API Integration (Third-Party)

### 4.1 WhatsApp Web Deep Link

**URL Scheme:**

```
wa.me/{PHONE}/?text={ENCODED_MESSAGE}
```

**Example:**

```
https://wa.me/6281234567890/?text=Halo%20BaTour%21%20%F0%9F%91%8B%0A%0ASaya%20ingin%20booking%20trip...
```

### 4.2 Message Generation Function

**Location:** `utils/whatsappFormatter.js`

**Input:** Booking object from tripStore

**Output:** Formatted WhatsApp message (plain text)

**Function Signature:**

```javascript
function generateWhatsAppMessage(booking, destinations, guides, carRentals) {
  // Input validation
  if (!booking || !destinations || !guides) {
    throw new Error('Missing required data');
  }
  
  // Generate message
  const destinationText = booking.destinationIds
    .map((id, idx) => {
      const dest = destinations.find(d => d.id === id);
      const fee = dest.entryFee > 0 ? `(Rp ${dest.entryFee.toLocaleString('id-ID')})` : '(Gratis)';
      return `${idx + 1}. ${dest.name} ${fee}`;
    })
    .join('\n');
  
  const guide = guides.find(g => g.id === booking.guideId);
  const car = booking.carId 
    ? carRentals.find(c => c.id === booking.carId).label 
    : 'Kendaraan dari guide';
  
  const message = `Halo BaTour! 👋

Saya ingin booking trip:

📅 **Tanggal Kunjungan:** [Mohon dikonfirmasi via WhatsApp]

🗺️ **Destinasi:**
${destinationText}

👤 **Tour Guide:** ${guide.name} (Rating: ${'⭐'.repeat(Math.round(guide.rating))})

🚗 **Transportasi:** ${car}

💰 **Rincian Biaya:**
- Guide: Rp ${booking.guideFee.toLocaleString('id-ID')}
${booking.carFee > 0 ? `- Mobil: Rp ${booking.carFee.toLocaleString('id-ID')}\n` : ''}
- Entry Fees: Rp ${booking.entryFees.reduce((sum, f) => sum + f.amount, 0).toLocaleString('id-ID')}
- **Total: Rp ${booking.totalCost.toLocaleString('id-ID')}**

💳 **Opsi Pembayaran:** ${booking.paymentOption === 'DP_50' 
  ? 'DP 50% (Rp ' + (booking.totalCost * 0.5).toLocaleString('id-ID') + ' sekarang, 50% di hari kunjungan)' 
  : 'Full Payment (Rp ' + booking.totalCost.toLocaleString('id-ID') + ' sekarang, diskon 5%)'}

🔖 **ID Pemesanan:** ${booking.bookingId}

Mohon konfirmasi ketersediaan & rekening untuk pembayaran. Terima kasih! 🙏`;
  
  return message;
}
```

**Integration:**

1. User clicks "Selesaikan Pemesanan" on `/confirmation`
2. `generateWhatsAppMessage()` called with current booking data
3. Message URL-encoded: `encodeURIComponent(message)`
4. Opens: `window.location.href = 'https://wa.me/6281234567890/?text=' + encoded`
5. Redirects to `/checkout` after WhatsApp opens

---

## 5. Service Worker & Offline Caching

### 5.1 Precache Strategy

**Plugin:** `vite-plugin-pwa`

**Files Precached:**
- `index.html`
- All route bundles (code-split by route)
- All destination images (via glob pattern)
- All guide photos (via glob pattern)
- Car rental images
- Core CSS/JS bundles

**Cache Invalidation:**
- Hash-based: Vite appends content hash to filenames (`app.abc123.js`)
- vite-plugin-pwa handles versioning automatically
- Old caches cleared on new app version

### 5.2 Offline Experience

| Route | Offline Availability |
|-------|---------------------|
| `/` (Landing) | ✅ 100% (HTML + CSS cached) |
| `/explore` | ⚠️ 90% (images cached, search disabled) |
| `/guide-selection` | ⚠️ 90% (guide photos cached, no filtering) |
| `/car-selection` | ✅ 100% (all data bundled) |
| `/booking-details` | ✅ 100% (all data bundled) |
| `/payment-options` | ✅ 100% (all data bundled) |
| `/confirmation` | ✅ 100% (all data bundled) |
| `/checkout` | ❌ 0% (requires WhatsApp, needs internet) |
| `/active-trip/:bookingId` | ✅ 100% (IndexedDB + cached images) |

---

## 6. Error Handling & Validation

### 6.1 Client-Side Validation

**Location:** `utils/validation.js`

**Rules:**

```javascript
// Destination selection
- Minimum: 1
- Maximum: 3
- Each ID must exist in destinations.json

// Guide selection
- Required: Yes
- Type: String (guide ID)
- Must exist in guides.json

// Car selection
- Required: No
- Type: String (car ID) or null
- If provided, must exist in carRentals.json

// Payment option
- Required: Yes
- Type: String
- Must be: 'DP_50' or 'FULL'

// Booking ID
- Format: BATOUR-[6 alphanumeric chars]
- Example: BATOUR-XY7Z9K
- Uniqueness: Enforced by IndexedDB primary key
```

### 6.2 Error Responses

**Standard Error Shape:**

```json
{
  "error": true,
  "message": "Human-readable Indonesian message",
  "code": "ERROR_CODE",
  "field": "fieldName"
}
```

**Examples:**

```json
{
  "error": true,
  "message": "Pilih minimal 1 destinasi",
  "code": "VALIDATION_ERROR",
  "field": "selectedDestinations"
}
```

```json
{
  "error": true,
  "message": "Koneksi internet diperlukan untuk melanjutkan",
  "code": "OFFLINE_ERROR"
}
```

```json
{
  "error": true,
  "message": "Trip tidak ditemukan",
  "code": "NOT_FOUND",
  "field": "bookingId"
}
```

---

## 7. Data Freshness & Cache Strategy

| Data | Source | Cache Strategy | TTL | Invalidation |
|------|--------|-----------------|-----|--------------|
| Destinations | `destinations.json` (bundled) | Service Worker precache | App lifetime | Rebuild + redeploy |
| Guides | `guides.json` (bundled) | Service Worker precache | App lifetime | Rebuild + redeploy |
| Car Rentals | `carRentals.json` (bundled) | Service Worker precache | App lifetime | Rebuild + redeploy |
| Transit Matrix | `transitMatrix.json` (bundled) | Service Worker precache | App lifetime | Rebuild + redeploy |
| Bookings | IndexedDB | Local storage | Permanent | Manual delete or trip completion |
| Session State | IndexedDB | Local storage | Permanent | Manual clear or 30-day idle |

**Critical Notes:**
- **Zero HTTP requests** after initial app bundle load
- All data bundled at **build time**
- Static data updates require **app rebuild + Vercel redeploy**
- User bookings **persist indefinitely** until explicitly deleted

---

## 8. Performance Targets

### Core Web Vitals

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| FCP (First Contentful Paint) | < 1.5s | Lighthouse, Vercel Analytics |
| LCP (Largest Contentful Paint) | < 2.5s | Lighthouse, Vercel Analytics |
| TTFB (Time to First Byte) | < 0.5s | Vercel edge cache |
| CLS (Cumulative Layout Shift) | < 0.1 | Lighthouse |
| TBT (Total Blocking Time) | < 200ms | Lighthouse |

### Bundle Size

```
React 18: ~78KB (gzipped)
React Router: ~15KB (gzipped)
Zustand: ~3KB (gzipped)
Tailwind CSS: ~50KB (gzipped)
Other (utils, components): ~30KB (gzipped)
---
Total: < 300KB (gzipped)
```

---

## 9. Accessibility (WCAG 2.1 Level AA)

### Checklist

- [ ] All interactive elements keyboard-navigable (Tab key)
- [ ] Focus indicators visible (2px outline, contrast ≥ 3:1)
- [ ] Color contrast ≥ 4.5:1 for all text
- [ ] Alt text for all images (`alt` attribute or `aria-label`)
- [ ] ARIA labels for icon-only buttons (`aria-label` attribute)
- [ ] Form labels properly associated (label + input `id`)
- [ ] Screen reader tested (NVDA on Windows, VoiceOver on macOS/iOS)
- [ ] No keyboard traps (focus always movable)
- [ ] Semantic HTML (buttons, links, landmarks)

---

## 10. Deployment & Build Configuration

### Environment Variables (Vercel)

```
VITE_API_BASE_URL=https://batour.vercel.app (for analytics, future APIs)
VITE_GA_ID=UA-XXXXXXXXX-X (Google Analytics, optional)
```

### Build Output

```
dist/
├── index.html
├── assets/
│   ├── app.[HASH].js (React app)
│   ├── app.[HASH].css (Tailwind)
│   ├── destinations.[HASH].json
│   └── images/
│       ├── destinations/
│       ├── guides/
│       └── cars/
└── manifest.json (PWA manifest)
```

---

**Document Control:**
- **Created:** May 14, 2026 (VibeCODE Generation)
- **Revision:** 1.0
- **Distribution:** Engineering, QA teams

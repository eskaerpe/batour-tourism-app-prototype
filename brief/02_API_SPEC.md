# API Specification (Front-End Contracts)
## BaTour - MVP (Client-Side Only)

**Version:** 1.0  
**Status:** MVP - No Backend API  
**Last Updated:** May 13, 2026  

---

## 1. Architecture Overview

This is a **front-end-only MVP**. There are no HTTP API endpoints. All data is:
- **Static JSON files** (destinations, guides, car rentals, transit matrix)
- **Browser storage** (IndexedDB for trip bookings & session state)
- **WhatsApp API** (third-party handoff, not controlled by us)

The "API Specification" defines the **data contracts** that the frontend consumes and produces.

---

## 2. Technology Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 18+ |
| **State Management** | Zustand + IndexedDB persistence plugin |
| **Storage** | IndexedDB (local trip data) |
| **Static Data** | JSON files bundled with app |
| **Third-Party Integration** | WhatsApp Web API (URL scheme) |
| **QR Generation** | qrcode.react (client-side) |
| **Build Tool** | Vite |
| **Deployment** | Vercel (static hosting) |

---

## 3. Static Data Contracts (JSON Files)

### 3.1 destinations.json

**Purpose:** Define all tourist destinations, categories, and fees.

**Schema:**

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
  },
  {
    "id": "dest_002",
    "name": "Situ Patenggang",
    "category": "tempat-wisata",
    "zone": "Ciwidey",
    "description": "Mountain lake surrounded by pine forests",
    "shortDescription": "Danau di tengah hutan pinus",
    "image": "/images/destinations/situ-patenggang.webp",
    "imageAlt": "Lake surrounded by pine trees",
    "rating": 4.6,
    "reviewCount": 890,
    "entryFee": 30000,
    "entryFeeLabel": "Rp 30.000",
    "estimatedDurationMinutes": 75,
    "coordinates": {
      "lat": -7.1456,
      "lng": 107.5789
    },
    "operatingHours": "08:00 - 17:00"
  },
  {
    "id": "dest_003",
    "name": "Strawberry Farm",
    "category": "tempat-wisata",
    "zone": "Lembang",
    "description": "Pick-your-own strawberry farm with farm-to-table dining",
    "shortDescription": "Petik strawberry sendiri",
    "image": "/images/destinations/strawberry-farm.webp",
    "imageAlt": "Strawberry picking activity",
    "rating": 4.7,
    "reviewCount": 560,
    "entryFee": 40000,
    "entryFeeLabel": "Rp 40.000",
    "estimatedDurationMinutes": 120,
    "coordinates": {
      "lat": -6.8123,
      "lng": 107.6045
    },
    "operatingHours": "09:00 - 17:00"
  },
  {
    "id": "dest_004",
    "name": "Nasi Timbel Warung",
    "category": "tempat-makan",
    "zone": "Bandung Pusat",
    "description": "Traditional Sundanese rice wrapped in banana leaves",
    "shortDescription": "Nasi Timbel khas Sunda",
    "image": "/images/destinations/nasi-timbel.webp",
    "imageAlt": "Traditional Sundanese rice meal",
    "rating": 4.5,
    "reviewCount": 2100,
    "entryFee": 0,
    "entryFeeLabel": "Gratis (Beli Makanan)",
    "estimatedDurationMinutes": 60,
    "coordinates": {
      "lat": -6.9147,
      "lng": 107.6053
    },
    "operatingHours": "10:00 - 21:00"
  },
  {
    "id": "dest_005",
    "name": "Glamping Lakeside",
    "category": "tempat-wisata",
    "zone": "Ciwidey",
    "description": "Glamorous camping experience with lake views",
    "shortDescription": "Glamping dengan pemandangan danau",
    "image": "/images/destinations/glamping.webp",
    "imageAlt": "Glamping tent by the lake",
    "rating": 4.9,
    "reviewCount": 340,
    "entryFee": 0,
    "entryFeeLabel": "Gratis (Paket Menginap)",
    "estimatedDurationMinutes": 180,
    "coordinates": {
      "lat": -7.1389,
      "lng": 107.5701
    },
    "operatingHours": "24 jam"
  },
  {
    "id": "dest_006",
    "name": "Bandung Trade Centre (BTC)",
    "category": "toko-oleh-oleh",
    "zone": "Bandung Pusat",
    "description": "Shopping mall for textiles, souvenirs, and local goods",
    "shortDescription": "Oleh-oleh dan tekstil",
    "image": "/images/destinations/btc.webp",
    "imageAlt": "Shopping mall entrance",
    "rating": 4.3,
    "reviewCount": 1800,
    "entryFee": 0,
    "entryFeeLabel": "Gratis (Belanja)",
    "estimatedDurationMinutes": 120,
    "coordinates": {
      "lat": -6.9082,
      "lng": 107.6089
    },
    "operatingHours": "10:00 - 21:00"
  }
]
```

**Constraints:**
- `id`: Unique string, format `dest_XXX`
- `category`: One of `tempat-wisata`, `tempat-makan`, `toko-oleh-oleh`
- `entryFee`: Integer (Rupiah), minimum 0
- `estimatedDurationMinutes`: Integer, minimum 30
- `rating`: Float 1-5
- `image`: Optimized WebP, < 100KB

---

### 3.2 guides.json

**Purpose:** Define all available tour guides with rates and contact info.

**Schema:**

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
  },
  {
    "id": "guide_002",
    "name": "Siti Nurhaliza",
    "photo": "/images/guides/siti.webp",
    "photoAlt": "Siti smiling",
    "rating": 4.7,
    "reviewCount": 220,
    "dailyRate": 450000,
    "dailyRateLabel": "Rp 450.000/hari",
    "languages": ["Indonesian", "English", "Mandarin"],
    "phone": "6282456789012",
    "whatsappNumber": "6282456789012",
    "bio": "Expert in culinary tours and local shopping. Fluent in Mandarin for Chinese tourists.",
    "specialties": ["Culinary", "Shopping", "Local Culture"],
    "certified": true,
    "yearsExperience": 8,
    "maxGroupSize": 6
  },
  {
    "id": "guide_003",
    "name": "Adi Suryanto",
    "photo": "/images/guides/adi.webp",
    "photoAlt": "Adi smiling",
    "rating": 4.6,
    "reviewCount": 185,
    "dailyRate": 400000,
    "dailyRateLabel": "Rp 400.000/hari",
    "languages": ["Indonesian", "English", "Japanese"],
    "phone": "6283567890123",
    "whatsappNumber": "6283567890123",
    "bio": "Young and energetic guide fluent in Japanese. Perfect for adventure and modern attraction tours.",
    "specialties": ["Adventure", "Modern Attractions", "Photography"],
    "certified": true,
    "yearsExperience": 5,
    "maxGroupSize": 8
  }
]
```

**Constraints:**
- `id`: Unique string, format `guide_XXX`
- `dailyRate`: Integer (Rupiah), minimum 300000
- `phone`: String format `62XXXXXXXXXX`
- `rating`: Float 1-5
- `maxGroupSize`: Integer, minimum 2, maximum 15
- `languages`: Array of strings, minimum 1

---

### 3.3 carRentals.json

**Purpose:** Define car rental options with pricing and capacity.

**Schema:**

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
    "transmissionBonus": 1.0,
    "estimatedFuelConsumption": "1L per 12km"
  },
  {
    "id": "car_van",
    "type": "van",
    "label": "Minivan (7-Seater)",
    "description": "Spacious minivan, perfect for larger groups",
    "capacity": "5-8 pax",
    "image": "/images/cars/van.webp",
    "imageAlt": "White minivan car",
    "dailyRate": 900000,
    "dailyRateLabel": "Rp 900.000/hari",
    "transmissionBonus": 1.2,
    "estimatedFuelConsumption": "1L per 8km"
  }
]
```

**Constraints:**
- `id`: Unique string
- `type`: One of `car`, `van`
- `dailyRate`: Integer (Rupiah)
- `transmissionBonus`: Float (1.0 = normal travel time, 1.2 = slower travel time due to size)

---

### 3.4 transitMatrix.json

**Purpose:** Define travel times between zones for timeline calculation.

**Schema:**

```json
{
  "zones": ["Bandung Pusat", "Ciwidey", "Lembang", "Tangkuban Perahu", "Bogor"],
  "matrix": {
    "Bandung Pusat->Ciwidey": 45,
    "Bandung Pusat->Lembang": 40,
    "Bandung Pusat->Tangkuban Perahu": 60,
    "Bandung Pusat->Bogor": 90,
    "Ciwidey->Lembang": 90,
    "Ciwidey->Tangkuban Perahu": 75,
    "Ciwidey->Bogor": 120,
    "Lembang->Tangkuban Perahu": 30,
    "Lembang->Bogor": 50,
    "Tangkuban Perahu->Bogor": 80
  },
  "defaultStartTime": "08:00",
  "bufferMinutesBetweenStops": 15
}
```

**Constraints:**
- `matrix` keys: Format `Zone1->Zone2` (bidirectional, must be defined both ways or use lookup logic)
- Values: Integer minutes
- `defaultStartTime`: ISO 8601 time string
- `bufferMinutesBetweenStops`: Integer, minimum 10

---

### 3.5 mitra.json (Optional, for Phase 2)

**Purpose:** Define partner shops/restaurants for potential recommendations.

**Schema (MVP may not need this):**

```json
[
  {
    "id": "mitra_001",
    "name": "Toko Oleh-Oleh Bandung",
    "category": "shop",
    "phone": "6281234567890",
    "address": "Jl. Riau No. 10, Bandung"
  }
]
```

---

## 4. IndexedDB Schema (Browser Storage)

### 4.1 Database: `batour-db`

#### Store 1: `bookings`

**Purpose:** Store completed trip bookings and their status.

**Key Path:** `bookingId` (unique)

**Schema:**

```json
{
  "bookingId": "BATOUR-XY7Z9K",
  "createdAt": "2026-05-13T10:30:00Z",
  "visitDate": null,
  "status": "pending",
  "paymentStatus": "not-paid",
  "destinationIds": ["dest_001", "dest_002", "dest_003"],
  "guideId": "guide_001",
  "carId": "car_sedan",
  "paymentOption": "DP_50",
  "totalCost": 1480000,
  "guideFee": 500000,
  "carFee": 600000,
  "entryFees": [
    { "destinationId": "dest_001", "amount": 50000, "name": "Kawah Putih" },
    { "destinationId": "dest_002", "amount": 30000, "name": "Situ Patenggang" },
    { "destinationId": "dest_003", "amount": 0, "name": "Glamping Lakeside" }
  ],
  "timeline": [
    {
      "step": 1,
      "destinationId": "dest_001",
      "name": "Kawah Putih",
      "scheduledTime": "09:00",
      "estimatedDurationMinutes": 90,
      "zone": "Ciwidey"
    },
    {
      "step": 2,
      "destinationId": "dest_002",
      "name": "Situ Patenggang",
      "scheduledTime": "10:45",
      "estimatedDurationMinutes": 75,
      "zone": "Ciwidey"
    }
  ],
  "whatsappMessageSent": true,
  "whatsappContactPhone": "6281234567890",
  "confirmationDetails": null,
  "notes": ""
}
```

**Constraints:**
- `bookingId`: UUID or short code (BATOUR-XXXXXX)
- `status`: One of `pending`, `confirmed`, `completed`, `cancelled`
- `paymentStatus`: One of `not-paid`, `partially-paid`, `fully-paid`
- `paymentOption`: One of `DP_50`, `FULL`
- `createdAt`: ISO 8601 timestamp

#### Store 2: `sessionState`

**Purpose:** Store user's current selection state (destinations, guide, car) for recovery if page refreshes.

**Key Path:** `sessionKey` (single record, always "current")

**Schema:**

```json
{
  "sessionKey": "current",
  "lastUpdated": "2026-05-13T10:15:00Z",
  "selectedDestinationIds": ["dest_001", "dest_002"],
  "selectedGuideId": "guide_001",
  "selectedCarId": "car_sedan",
  "selectedPaymentOption": null,
  "currentPage": "/booking-details"
}
```

#### Store 3: `userPreferences`

**Purpose:** Store user preferences for repeated visits.

**Key Path:** `preferenceKey` (single record, always "user")

**Schema:**

```json
{
  "preferenceKey": "user",
  "lastVisit": "2026-05-13T10:30:00Z",
  "hasVisited": true,
  "preferredLanguage": "id",
  "theme": "light"
}
```

---

## 5. Zustand State Store (Runtime)

### 5.1 Trip Store (tripStore.js)

**Purpose:** Manage the user's trip building state in memory.

**Schema:**

```javascript
{
  // Selection state
  selectedDestinations: [],              // [dest_id, ...]
  selectedGuide: null,                   // guide_id or null
  selectedCar: null,                     // car_id or null
  selectedPaymentOption: null,           // 'DP_50' | 'FULL' | null
  
  // Computed state
  totalCost: 0,                          // auto-calculated
  guideFee: 0,                           // from guide.dailyRate
  carFee: 0,                             // from car.dailyRate or 0
  entryFees: [],                         // array of {destinationId, amount}
  timeline: [],                          // array of timeline steps
  
  // Booking state
  currentBooking: null,                  // generated at checkout
  bookingId: null,                       // UUID
  
  // Actions
  addDestination(destId),                // max 3, add to selected
  removeDestination(destId),             // remove from selected
  clearDestinations(),                   // reset all
  
  setGuide(guideId),                     // set selected guide
  clearGuide(),                          // reset guide
  
  setCar(carId),                         // set selected car
  clearCar(),                            // no car selected
  
  setPaymentOption(option),              // 'DP_50' | 'FULL'
  
  calculateTotal(),                      // computes totalCost, breakdown
  
  generateBooking(),                     // creates bookingId, persists to IndexedDB
  
  resetTrip(),                           // clears all selections
  
  // Persistence (via persist middleware)
  // Auto-saves to IndexedDB sessionState on every state change
}
```

### 5.2 UI Store (uiStore.js)

**Purpose:** Manage UI state (loading, errors, offline status).

**Schema:**

```javascript
{
  isOnline: true,                        // online/offline status
  isLoading: false,                      // for API calls (not used in MVP)
  error: null,                           // error message
  successMessage: null,                  // success toast
  
  setOnline(bool),
  setLoading(bool),
  setError(message),
  clearError(),
  setSuccess(message),
  clearSuccess()
}
```

---

## 6. WhatsApp API Integration (Third-Party)

### 6.1 WhatsApp Web Handoff

**Endpoint (Client-Side URL Scheme):**

```
wa.me/6281234567890/?text=<URL_ENCODED_MESSAGE>
```

**Message Generation Logic:**

```javascript
const generateWhatsAppMessage = (booking) => {
  const destinations = booking.destinationIds
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
  
  const message = `
Halo BaTour! 👋

Saya ingin booking trip:

📅 **Tanggal Kunjungan:** [Mohon dikonfirmasi via WhatsApp]

🗺️ **Destinasi:**
${destinations}

👤 **Tour Guide:** ${guide.name} (Rating: ${'⭐'.repeat(Math.round(guide.rating))})

🚗 **Transportasi:** ${car}

💰 **Rincian Biaya:**
- Guide: Rp ${booking.guideFee.toLocaleString('id-ID')}
- ${booking.carFee > 0 ? `Mobil: Rp ${booking.carFee.toLocaleString('id-ID')}\n- ` : ''}Entry Fees: Rp ${booking.entryFees.reduce((sum, f) => sum + f.amount, 0).toLocaleString('id-ID')}
- **Total: Rp ${booking.totalCost.toLocaleString('id-ID')}**

💳 **Opsi Pembayaran:** ${booking.paymentOption === 'DP_50' ? 'DP 50% (Rp ' + (booking.totalCost * 0.5).toLocaleString('id-ID') + ' sekarang)' : 'Full Payment (Rp ' + booking.totalCost + ' sekarang)'}

🔖 **ID Pemesanan:** ${booking.bookingId}

Mohon konfirmasi ketersediaan & rekening untuk pembayaran. Terima kasih! 🙏
  `.trim();
  
  return message;
};
```

**Integration Point:**
- Called on `/confirmation` when "Selesaikan Pemesanan" button clicked
- Message URL-encoded and appended to `wa.me/` URL
- Opens WhatsApp (Web or mobile app, depending on device)
- Redirects to `/checkout` on return

---

## 7. Offline-First Caching Strategy

### 7.1 Service Worker Precache

**Files precached on app load:**
- `index.html`
- All routes (static)
- All destination images
- All guide photos
- Car type images
- Core CSS/JS bundles

**Cache invalidation:** Versioned bundles + `vite-plugin-pwa`

### 7.2 IndexedDB Persistence

**Automatic persistence:**
- All trip state saved to `sessionState` store on every change (via Zustand persist)
- Bookings saved to `bookings` store when generated
- Recovered on app reload

**Manual recovery:**
- User navigates to `/active-trip/:bookingId` → loads from IndexedDB
- If bookingId not found → shows error with WhatsApp link

---

## 8. Error Handling & Edge Cases

### 8.1 Network Errors

| Scenario | Behavior |
|----------|----------|
| Offline when clicking "Selesaikan Pemesanan" | Button disabled, show "Koneksi internet diperlukan" |
| Offline on /explore | Page loads from cache, search disabled, offline badge shown |
| Offline on /active-trip | 100% functional, data from IndexedDB |

### 8.2 Data Validation

**Client-side validation (before checkout):**
- Min 1, max 3 destinations selected
- Guide selected
- Payment option selected
- Total cost calculated correctly

**Error responses (all client-side alerts):**
```json
{
  "error": true,
  "message": "Pilih minimal 1 destinasi",
  "code": "VALIDATION_ERROR"
}
```

### 8.3 Edge Cases

| Case | Handling |
|------|----------|
| User deletes selected destination while building | Trip resets destination list, user prompted |
| User clicks back button multiple times | React Router maintains history, no data loss |
| User refreshes on /booking-details | Session state recovered from IndexedDB |
| User opens /active-trip/:bookingId that doesn't exist | Error screen with "Hubungi Kami" link |
| IndexedDB quota exceeded | Show error, suggest clearing cache |

---

## 9. Data Freshness & Caching Policy

| Data | Source | Cache Strategy | TTL |
|------|--------|-----------------|-----|
| Destinations | `destinations.json` | Bundle + Service Worker | App lifetime |
| Guides | `guides.json` | Bundle + Service Worker | App lifetime |
| Car Rentals | `carRentals.json` | Bundle + Service Worker | App lifetime |
| Transit Matrix | `transitMatrix.json` | Bundle + Service Worker | App lifetime |
| Bookings | IndexedDB | Local storage | Until explicit delete |
| Session State | IndexedDB | Auto-persist on change | Until tab close (if not persisted) |

**Notes:**
- No HTTP requests (except initial app bundle)
- All data bundled at build time
- Static data updates require app rebuild + Vercel redeploy
- User bookings persist across sessions via IndexedDB

---

## 10. Validation Rules

### 10.1 Destination Selection

- **Min:** 1
- **Max:** 3
- **Type:** Array of destination IDs
- **Validation:** Each ID must exist in `destinations.json`

### 10.2 Guide Selection

- **Required:** Yes
- **Type:** String (guide ID)
- **Validation:** ID must exist in `guides.json`

### 10.3 Car Selection

- **Required:** No (null allowed = no car)
- **Type:** String (car ID) or null
- **Validation:** If provided, must exist in `carRentals.json`

### 10.4 Payment Option

- **Required:** Yes
- **Type:** String, one of `DP_50`, `FULL`
- **Validation:** Must be one of allowed values

### 10.5 Booking ID

- **Format:** `BATOUR-` + 6-char alphanumeric (e.g., `BATOUR-XY7Z9K`)
- **Generation:** Client-side UUID shortener
- **Uniqueness:** Enforced by IndexedDB primary key

---

**Document Control:**
- **Created:** May 13, 2026
- **Last Updated:** May 13, 2026
- **Format:** Markdown + JSON examples
- **Distribution:** Engineering, QA teams

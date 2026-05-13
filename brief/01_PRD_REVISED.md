# Product Requirements Document (PRD)
# BaTour - Personal Travel Assistant for Bandung

**Version:** 2.0 (Flow-Aligned Revision)  
**Status:** MVP - Front-End Only  
**Last Updated:** May 13, 2026  
**Project Lead:** Development Team  
**Target Deployment:** Vercel (Static Site)

---

## 1. Executive Summary

### 1.1 Product Vision
BaTour is a React-based Progressive Web Application (PWA) that serves as a personal travel assistant for tourists visiting Bandung, Indonesia. The application bridges the gap between tourists and local SMEs/Guides (UMKMs), directly supporting UN Sustainable Development Goal 8 (Decent Work and Economic Growth).

### 1.2 Architectural Constraint
This MVP is explicitly scoped as a **Front-End Only** implementation:
- ✅ Static data persistence via IndexedDB
- ✅ Third-party handoffs (WhatsApp) for payments & guide coordination
- ✅ Robust offline-first architecture
- ❌ No proprietary backend/API
- ❌ No real-time payment processing
- ❌ No server-side authentication

### 1.3 Core Value Proposition
**"Anti-Ribet" (Anti-Hassle) Travel Planning**
- Pre-curated itineraries optimized for Bandung geography
- Offline-capable trip guidance for highland areas with poor connectivity
- Direct connection to verified local guides, mitra shops, and car rental partners
- Transparent pricing with no hidden fees
- **Flexible car rental decision point** — users can choose to skip car rental and use guide's personal vehicle

### 1.4 Success Metrics
- **User Activation:** 60% of visitors complete itinerary builder
- **Offline Reliability:** 100% uptime for /active-trip route when offline
- **Performance:** FCP < 1.5s on 3G connections
- **Conversion:** 30% of built itineraries result in WhatsApp handoff

---

## 2. Core User Journey (Flow-Driven Design)

The application follows a strict linear flow that maps directly to the business process:

```
Traveler
    ↓
Choose Destination (1-3 locations from 3 categories)
    ↓
Choose Tour Guide (with ratings, languages, daily rate)
    ↓
Need a Car? (Binary: Yes → Select Car Type | No → Skip)
    ↓
Booking Details (Review: Destination, Guide, Car Type, Price)
    ↓
Payment Decision (DP 50% or Full Payment)
    ↓
Complete Itinerary (Calendar + Timeline visualization)
    ↓
All Parties Agree
    ↓
Payment Processing (WhatsApp handoff to Guide, Mitra, or Car Rental)
```

**Critical: This is NOT a wizard.** Users can navigate backward at any step to revise choices before checkout.

---

## 3. Technical Architecture

### 3.1 Tech Stack

| Layer | Technology | Justification |
|-------|-----------|---------------|
| **Framework** | React 18+ | Modern hooks, concurrent features, wide ecosystem |
| **Build Tool** | Vite | Fast HMR, optimized production builds |
| **Routing** | React Router v6 | Industry standard, nested routes support |
| **Styling** | Tailwind CSS | Rapid prototyping, consistency, mobile-first |
| **State** | Zustand + persist | Lightweight, IndexedDB persistence |
| **PWA** | vite-plugin-pwa | Service Worker generation, offline support |
| **Icons** | Material Symbols | Modern, outlined style matching design system |
| **QR Codes** | qrcode.react | Client-side QR generation for offline tickets |
| **Deployment** | Vercel | Zero-config, edge caching, preview URLs |

### 3.2 Design System Tokens
```javascript
// Primary Brand Color
const BATOUR_ORANGE = '#ec5b13';

// Typography
const FONT_FAMILY = 'Public Sans, system-ui, sans-serif';

// Breakpoints (Mobile-First)
const BREAKPOINTS = {
  mobile: '0px',      // < 640px
  tablet: '640px',    // 640px - 1024px
  desktop: '1024px'   // > 1024px (max-w-md container)
};

// Payment Options
const PAYMENT_TYPES = {
  DP_50: { label: 'DP 50%', percentage: 0.5, description: 'Pembayaran 50% sekarang, 50% hari kunjungan' },
  FULL: { label: 'Full Payment', percentage: 1.0, description: 'Pembayaran penuh sekarang, diskon 5%' }
};
```

### 3.3 Project Structure
```
batour-react/
├── public/
│   ├── icons/              # PWA icons (192x192, 512x512)
│   └── manifest.json       # PWA manifest
├── src/
│   ├── components/
│   │   ├── common/         # Reusable UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── OfflineIndicator.jsx
│   │   ├── destination/    # Destination selection components
│   │   │   ├── DestinationCard.jsx
│   │   │   ├── DestinationCategories.jsx
│   │   │   └── DestinationSearch.jsx
│   │   ├── guide/          # Guide selection components
│   │   │   ├── GuideCard.jsx
│   │   │   └── GuideSelector.jsx
│   │   ├── car/            # Car rental decision components
│   │   │   ├── CarTypeSelector.jsx
│   │   │   ├── CarTypeCard.jsx
│   │   │   └── SkipCarOption.jsx
│   │   ├── booking/        # Booking details components
│   │   │   ├── BookingDetailsSummary.jsx
│   │   │   ├── CostBreakdown.jsx
│   │   │   └── TrustBadges.jsx
│   │   ├── payment/        # Payment option components
│   │   │   ├── PaymentOption.jsx
│   │   │   ├── PaymentSelection.jsx
│   │   │   └── WhatsAppConfirmation.jsx
│   │   └── trip/           # Active trip components
│   │       ├── TripTimeline.jsx
│   │       ├── GuideContact.jsx
│   │       ├── QRTicket.jsx
│   │       └── OfflineTripView.jsx
│   ├── data/
│   │   ├── destinations.json
│   │   ├── guides.json
│   │   ├── carRentals.json
│   │   ├── mitra.json
│   │   └── transitMatrix.json
│   ├── hooks/              # Custom React hooks
│   │   ├── useTrip.js
│   │   ├── useDestinations.js
│   │   ├── useGuides.js
│   │   └── useOnline.js
│   ├── pages/              # Route-level components
│   │   ├── Landing.jsx
│   │   ├── DestinationExplore.jsx
│   │   ├── GuideSelection.jsx
│   │   ├── CarSelection.jsx
│   │   ├── BookingDetails.jsx
│   │   ├── PaymentOptions.jsx
│   │   ├── BookingConfirmation.jsx
│   │   └── ActiveTrip.jsx
│   ├── stores/             # Zustand stores
│   │   ├── tripStore.js
│   │   └── uiStore.js
│   ├── utils/              # Helper functions
│   │   ├── priceCalculations.js
│   │   ├── timelineEngine.js
│   │   ├── whatsappFormatter.js
│   │   ├── qrGenerator.js
│   │   └── validation.js
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
├── tailwind.config.js
└── vercel.json
```

---

## 4. User Flows & Routes

### 4.1 Route Map (Flow-Aligned)

```
/ (Landing/Onboarding)
├── /explore (Destination Selection - Step 1)
├── /guide-selection (Guide Selection - Step 2)
├── /car-selection (Car Rental Decision - Step 3)
├── /booking-details (Booking Summary - Step 4)
├── /payment-options (Payment Selection - Step 5)
├── /confirmation (Pre-WhatsApp Confirmation)
├── /checkout (WhatsApp Handoff)
└── /active-trip/:bookingId (Offline Trip View)
```

### 4.2 Critical User Journeys

#### Journey 1: First-Time Visitor → Booked Trip (Complete Flow)

1. **Landing (/)** 
   - See hero image + "Mulai Eksplorasi" CTA
   - IndexedDB check bypasses onboarding if returning user

2. **Destination Selection (/explore)** 
   - Browse 3 destination categories: Tempat Wisata, Tempat Makan, Toko Oleh-Oleh
   - Filter by search or category
   - Select 2-3 locations
   - CTA: "Lanjut ke Pemilihan Guide" → /guide-selection

3. **Guide Selection (/guide-selection)**
   - Display filtered guide list (all guides, or filtered by language)
   - Each guide card shows: Photo, name, rating, languages, daily rate (Rp X)
   - Select one guide
   - CTA: "Lanjut ke Transportasi" → /car-selection

4. **Car Rental Decision (/car-selection)**
   - Binary choice: "Perlu Sewa Mobil?"
   - Option A: Yes → Show car type selector (Car, Van)
     - Car: 1-4 pax, Rp 600.000/day
     - Van: 5-8 pax, Rp 900.000/day
     - Select car type → /booking-details
   - Option B: No → "Akan menggunakan kendaraan dari guide" → /booking-details

5. **Booking Details (/booking-details)**
   - Summary card displays:
     - Destination names (1-3)
     - Selected guide (photo, name, rate)
     - Car type (or "Guide's Vehicle")
     - Entry fees per destination
     - Day duration calculation (08:00 start, based on destination + transit times)
   - Visual timeline shows:
     - Step numbers
     - Destination names
     - Arrival times
     - Duration bars
   - Real-time Total Cost displayed (fixed bottom bar)
   - CTAs: "Kembali" (back to car-selection) | "Lanjut ke Pembayaran" → /payment-options

6. **Payment Options (/payment-options)**
   - Cost breakdown card displays:
     - Vehicle rental fee (or "—" if no car)
     - Guide fee
     - Entry fees (itemized per destination)
     - Subtotal
     - **Total** (bold, large text)
   - Payment selection:
     - Option A: "DP 50%" — Pay 50% now, 50% on trip day
     - Option B: "Full Payment" — Pay 100% now, get 5% discount
   - Trust badges: "Secure Booking", "Free Cancellation 24hr Before", "Verified Local Guides"
   - CTA: "Lanjut ke Konfirmasi" → /confirmation
   - CTA: "Kembali" → /booking-details

7. **Booking Confirmation (/confirmation)**
   - Final review: Destination, Guide, Car, Payment option
   - Single CTA: "Selesaikan Pemesanan via WhatsApp"
   - This button generates the handoff message and opens WhatsApp
   - Redirects to /checkout with booking ID

8. **Checkout & WhatsApp Handoff (/checkout)**
   - Display "Check WhatsApp" confirmation screen
   - Show booking reference number
   - Auto-stores trip data to IndexedDB
   - Option: "Buka Trip Saya" → /active-trip/:bookingId
   - Option: "Kembali ke Beranda" → /

9. **Active Trip (/active-trip/:bookingId)**
   - **100% offline availability**
   - Guide contact card: Photo, name, phone, WhatsApp + call buttons
   - Interactive timeline:
     - Highlights current step based on device time
     - Shows "Next: [Location]" indicator
     - Displays remaining time to next stop
   - QR ticket: Scannable booking ID
   - Emergency fallback: If bookingId not found, show "Trip not found" with support link

#### Journey 2: Returning User — Direct to Active Trip

1. User navigates directly to `/active-trip/:bookingId`
2. Service Worker loads cached page
3. Timeline highlights current step
4. Full offline access to guide contacts, QR, and timeline

---

## 5. Feature Requirements

### 5.1 F1: Landing Page (/)

**Priority:** P0 (Must Have)

**User Story:**  
As a first-time visitor, I want to understand BaTour's value proposition within 3 seconds so I can decide to explore further.

**Acceptance Criteria:**
- [ ] Full viewport hero image loads with skeleton placeholder
- [ ] Gradient overlay displays "Anti-Ribet Travel di Bandung" headline
- [ ] "Mulai Eksplorasi" button navigates to /explore
- [ ] IndexedDB check bypasses landing if `hasVisited === true`
- [ ] SDG 8 badge visible in footer
- [ ] Image optimized (WebP, <150KB)

---

### 5.2 F2: Destination Selection (/explore)

**Priority:** P0 (Must Have)

**User Story:**  
As a tourist, I want to discover Bandung destinations filtered by category so I can build a personalized itinerary.

**Acceptance Criteria:**
- [ ] Search bar filters destinations in real-time (debounced 300ms)
- [ ] Category pills: **All | Tempat Wisata | Tempat Makan | Toko Oleh-Oleh**
- [ ] Each DestinationCard shows:
  - Image (optimized, lazy loaded)
  - Name
  - Star rating (1-5)
  - Location zone (e.g., "Ciwidey", "Lembang")
  - Entry fee badge (or "Gratis")
- [ ] Tap destination to add/remove from trip (max 3)
- [ ] Selected destinations show checkmark overlay
- [ ] Cart indicator shows "X destinasi dipilih"
- [ ] Bottom bar displays "Lanjut ke Pemilihan Guide" CTA (disabled if 0 selected)
- [ ] Offline indicator appears when network unavailable

**Technical Notes:**
- Filter logic client-side on `destinations.json`
- Maximum 3 destinations enforced by Zustand store
- Images precached by Service Worker

---

### 5.3 F3: Guide Selection (/guide-selection)

**Priority:** P0 (Must Have)

**User Story:**  
As a user with selected destinations, I want to choose a verified local guide so I can get authentic insider knowledge.

**Acceptance Criteria:**
- [ ] Guide list displays all guides (or filtered by available language)
- [ ] Each GuideCard shows:
  - Photo
  - Name
  - Star rating (1-5)
  - Languages spoken (badge list)
  - Daily rate (Rp X per hari)
  - "Pilih Guide" button
- [ ] Only one guide selectable at a time
- [ ] Selected guide shows visual highlight
- [ ] Bottom bar displays real-time Total Cost (Guide Fee + Destination Fees)
- [ ] CTA: "Lanjut ke Transportasi"
- [ ] CTA: "Kembali" → /explore

---

### 5.4 F4: Car Rental Decision (/car-selection)

**Priority:** P0 (Must Have)

**User Story:**  
As a user planning a trip with a guide, I want to decide whether to rent a car or use the guide's vehicle so I can control transportation costs.

**Acceptance Criteria:**
- [ ] Display binary choice: "Perlu Sewa Mobil?" (Yes | No)
- [ ] **If Yes:**
  - [ ] Show car type selector (radio group)
    - Car: 1-4 pax, Rp 600.000/day
    - Van: 5-8 pax, Rp 900.000/day
  - [ ] Real-time cost update
  - [ ] CTA: "Lanjut ke Rincian Pemesanan"
- [ ] **If No:**
  - [ ] Message: "Akan menggunakan kendaraan pribadi guide"
  - [ ] CTA: "Lanjut ke Rincian Pemesanan"
- [ ] CTA: "Kembali" → /guide-selection

**Technical Notes:**
- Car type selection updates trip store immediately
- Transit times in timeline adjust based on car type (car faster than van for some routes)

---

### 5.5 F5: Booking Details (/booking-details)

**Priority:** P0 (Must Have)

**User Story:**  
As a user finalizing my trip, I want to see a detailed breakdown of my itinerary, timeline, and costs so I can confirm everything is correct before payment.

**Acceptance Criteria:**
- [ ] Booking summary card displays:
  - Destination names (1-3)
  - Selected guide (photo, name, daily rate)
  - Car type (or "Kendaraan dari guide")
- [ ] Visual timeline engine calculates:
  - Start time (default 08:00)
  - Destination durations (from `estimatedDurationMinutes`)
  - Transit times (from `transitMatrix`)
  - End time (auto-calculated)
  - Each step shows: #, location name, arrival time, duration bar
- [ ] Cost breakdown:
  - Guide fee (daily rate)
  - Car rental fee (if selected)
  - Entry fees (itemized per destination)
  - Subtotal
  - Total (bold, large)
- [ ] Fixed bottom bar displays real-time Total Cost
- [ ] CTA: "Kembali" → /car-selection
- [ ] CTA: "Lanjut ke Pembayaran" → /payment-options

**Technical Notes:**
- Timeline calculation is client-side only
- Transit matrix uses zone-to-zone lookup
- All calculations stored in trip store

---

### 5.6 F6: Payment Options (/payment-options)

**Priority:** P0 (Must Have)

**User Story:**  
As a user ready to finalize my booking, I want to choose a payment plan and review final costs so I can complete my reservation.

**Acceptance Criteria:**
- [ ] Display two payment options as cards:
  - **Option A: DP 50%**
    - Description: "Bayar 50% sekarang, 50% hari kunjungan"
    - Amount displayed (bold): Rp X (50% of total)
    - "Pilih" button
  - **Option B: Full Payment**
    - Description: "Bayar penuh sekarang, diskon 5%"
    - Amount displayed (bold): Rp X (100% - 5% discount)
    - "Pilih" button
- [ ] Cost breakdown re-displayed:
  - Guide fee, Car fee, Entry fees, Subtotal
  - **Total** (highlighted, adjusted for discount if Full Payment selected)
- [ ] Trust badges visible:
  - "Secure Booking"
  - "Free Cancellation 24hr Before"
  - "Verified Local Guides"
- [ ] Selected payment option shows checkmark
- [ ] CTA: "Lanjut ke Konfirmasi" (enabled only if payment option selected)
- [ ] CTA: "Kembali" → /booking-details

---

### 5.7 F7: Booking Confirmation & WhatsApp Handoff (/confirmation + /checkout)

**Priority:** P0 (Must Have)

**User Story:**  
As a user ready to complete my booking, I want to review all details and confirm via WhatsApp so I can securely finalize my trip with BaTour.

**Acceptance Criteria - /confirmation:**
- [ ] Final review card displays:
  - Destination list (1-3)
  - Guide (photo, name, rate)
  - Car type (or "Kendaraan dari guide")
  - Payment plan selected (DP 50% or Full)
  - **Total Cost** (bold, large)
- [ ] Single prominent CTA: "Selesaikan Pemesanan via WhatsApp"
- [ ] Button disabled if offline
- [ ] Clicking button:
  - Generates booking object with unique bookingId (UUID)
  - Saves booking to IndexedDB with booking metadata
  - Generates WhatsApp message (see format below)
  - Opens `wa.me/6281234567890/?text=<encoded_message>`
  - Redirects to /checkout

**Acceptance Criteria - /checkout:**
- [ ] Display confirmation screen:
  - "Pesanan Anda Telah Dikirim!"
  - Booking reference number (short ID, copyable)
  - Message: "Check WhatsApp Anda untuk konfirmasi dari BaTour"
  - Loading indicator while waiting for WhatsApp open
- [ ] Two CTAs:
  - "Buka Trip Saya" → /active-trip/:bookingId
  - "Kembali ke Beranda" → /
- [ ] Booking data persisted to IndexedDB

**WhatsApp Message Format:**
```
Halo BaTour! 👋

Saya ingin booking trip:

📅 **Tanggal Kunjungan:** [Mohon dikonfirmasi via WhatsApp]

🗺️ **Destinasi:**
1. Kawah Putih (Rp 50.000)
2. Situ Patenggang (Rp 30.000)
3. Glamping Lakeside (Gratis)

👤 **Tour Guide:** Pak Budi (Rating: ⭐⭐⭐⭐⭐)

🚗 **Transportasi:** Van (5-8 pax, Rp 900.000)

💰 **Rincian Biaya:**
- Guide: Rp 500.000
- Mobil: Rp 900.000
- Entry Fees: Rp 80.000
- **Total: Rp 1.480.000**

💳 **Opsi Pembayaran:** DP 50% (Rp 740.000 sekarang)

🔖 **ID Pemesanan:** BATOUR-XY7Z9K

Mohon konfirmasi ketersediaan & rekening untuk DP. Terima kasih! 🙏
```

---

### 5.8 F8: Active Trip View (/active-trip/:bookingId)

**Priority:** P0 (Must Have)

**User Story:**  
As a tourist on my trip day in a highland area with no internet, I need to access my itinerary, guide contacts, and QR ticket so I can navigate my day independently.

**Acceptance Criteria:**
- [ ] **100% offline availability** (cached by Service Worker)
- [ ] Guide contact card:
  - Photo, name, phone number
  - "Chat di WhatsApp" button (deep link: `wa.me/62XXXXXXXXXX`)
  - "Telepon Darurat" button (tel: protocol)
  - "Lihat Profil" option (basic guide bio)
- [ ] Interactive timeline:
  - Highlights current step (based on device time vs. scheduled times)
  - Shows "Sekarang: [Location]" indicator
  - Shows "Selanjutnya: [Next Location]" with remaining time
  - Displays each step: #, name, arrival time, duration
- [ ] QR ticket:
  - Base64-encoded booking ID
  - Scannable by guide's phone
  - Shows booking reference below QR
- [ ] Trip summary header:
  - Date (if provided in confirmation)
  - Guide name
  - Car type (or "Kendaraan Guide")
- [ ] Emergency fallback:
  - If bookingId not found in IndexedDB, show "Trip tidak ditemukan"
  - Provide WhatsApp support link
- [ ] Offline indicator visible (badge in header)

**Technical Notes:**
- All trip data fetched from IndexedDB at page load
- Timeline highlighting uses `Date.now()` vs. scheduled times
- QR generated client-side via `qrcode.react`
- All images precached during /checkout

---

## 6. Data Models & Static Data Structure

### 6.1 Destinations.json Schema

```json
[
  {
    "id": "dest_001",
    "name": "Kawah Putih",
    "category": "tempat-wisata",
    "zone": "Ciwidey",
    "description": "Crater lake with white sulfur water",
    "image": "/images/destinations/kawah-putih.webp",
    "rating": 4.8,
    "reviewCount": 1250,
    "entryFee": 50000,
    "estimatedDurationMinutes": 90,
    "coordinates": { "lat": -7.1234, "lng": 107.5678 }
  },
  ...
]
```

### 6.2 Guides.json Schema

```json
[
  {
    "id": "guide_001",
    "name": "Pak Budi",
    "photo": "/images/guides/budi.webp",
    "rating": 4.9,
    "reviewCount": 340,
    "dailyRate": 500000,
    "languages": ["Indonesian", "English", "Sundanese"],
    "phone": "6281234567890",
    "bio": "20+ years experience in Bandung tourism",
    "specialties": ["Nature", "Cultural", "Culinary"]
  },
  ...
]
```

### 6.3 CarRentals.json Schema

```json
[
  {
    "id": "car_001",
    "type": "car",
    "capacity": "1-4 pax",
    "dailyRate": 600000,
    "image": "/images/cars/sedan.webp",
    "avgTravelTime": 1.0
  },
  {
    "id": "car_002",
    "type": "van",
    "capacity": "5-8 pax",
    "dailyRate": 900000,
    "image": "/images/cars/van.webp",
    "avgTravelTime": 1.2
  }
]
```

### 6.4 TransitMatrix.json Schema

```json
{
  "zones": ["Bandung Pusat", "Ciwidey", "Lembang", "Tangkuban Perahu"],
  "matrix": {
    "Bandung Pusat->Ciwidey": 45,
    "Ciwidey->Lembang": 90,
    "Lembang->Tangkuban Perahu": 30,
    ...
  }
}
```

### 6.5 Zustand Trip Store Schema

```javascript
{
  // Selection state
  selectedDestinations: [],     // [dest_id, dest_id, ...]
  selectedGuide: null,          // guide_id
  selectedCar: null,            // car_id or null (no car)
  selectedPaymentOption: null,  // 'DP_50' | 'FULL'
  
  // Derived state (computed)
  totalCost: 0,
  calculatedTimeline: [],
  
  // Trip completion
  bookingId: null,              // UUID generated at checkout
  bookingTimestamp: null,       // ISO 8601
  tripStatus: 'pending',        // 'pending' | 'confirmed' | 'completed' | 'cancelled'
  
  // Functions
  addDestination(dest_id),
  removeDestination(dest_id),
  setGuide(guide_id),
  setCarType(car_id),
  setPaymentOption(option),
  calculateTotal(),
  generateBooking(),
  resetTrip()
}
```

---

## 7. Non-Functional Requirements

### 7.1 Performance

| Metric | Target | Tool |
|--------|--------|------|
| First Contentful Paint | < 1.5s | Lighthouse |
| Time to Interactive | < 3.0s | Lighthouse |
| Largest Contentful Paint | < 2.5s | Lighthouse |
| Total Blocking Time | < 200ms | Lighthouse |
| Cumulative Layout Shift | < 0.1 | Lighthouse |

**Optimization Strategies:**
- Code splitting per route
- Image lazy loading
- WebP format with fallback
- Service Worker precaching for critical paths

### 7.2 Accessibility (WCAG 2.1 Level AA)

- [ ] All interactive elements keyboard navigable
- [ ] Focus indicators visible (2px outline)
- [ ] Color contrast ratio ≥ 4.5:1 for text
- [ ] Alt text for all images
- [ ] ARIA labels for icon-only buttons
- [ ] Screen reader tested (NVDA/VoiceOver)

### 7.3 Security

**Client-Side Constraints:**
- ❌ No sensitive payment data stored
- ❌ No authentication tokens
- ✅ Input sanitization for search
- ✅ CSP headers configured in Vercel
- ✅ HTTPS enforced

### 7.4 Browser Support

| Browser | Minimum Version |
|---------|----------------|
| Chrome | 90+ |
| Safari (iOS) | 14+ |
| Firefox | 88+ |
| Edge | 90+ |

### 7.5 Data Payload Limits

- Static JSON database: < 500KB total
- Individual destination images: < 100KB each
- Hero images: < 150KB (WebP)
- Total app bundle (gzipped): < 300KB

---

## 8. Out of Scope (Future Phases)

### Phase 2 (Backend Integration)
- Real-time payment processing (Midtrans/Xendit)
- User authentication & accounts
- Booking management dashboard
- Live guide availability checking
- Trip date selection (currently handled in WhatsApp)

### Phase 3 (Advanced Features)
- AI-powered itinerary recommendations
- Real-time traffic integration (Google Maps API)
- Multi-language support (EN, CN, JP)
- Chatbot assistant
- User reviews & ratings UI

### Phase 4 (Marketplace)
- Dynamic pricing based on season
- Multi-city expansion (Jakarta, Yogyakarta)
- Inventory management for guides/cars

---

## 9. Success Criteria & KPIs

### MVP Launch Goals (Month 1)
- [ ] 1,000 unique visitors
- [ ] 300 completed itineraries (to /confirmation)
- [ ] 90 WhatsApp handoffs (WhatsApp opened)
- [ ] 30% handoff → confirmed booking conversion
- [ ] 4.5/5.0 user satisfaction (post-trip survey)

### Technical Health Metrics
- [ ] 99.9% uptime (Vercel)
- [ ] < 0.1% error rate (Sentry)
- [ ] 80+ Lighthouse score (Performance)
- [ ] 100% offline availability for /active-trip

---

## 10. Stakeholders & Approvals

| Role | Name | Approval Date |
|------|------|---------------|
| Product Owner | [TBD] | [Pending] |
| Tech Lead | [TBD] | [Pending] |
| UX Designer | [TBD] | [Pending] |
| QA Lead | [TBD] | [Pending] |

---

**Document Control:**
- **Created:** May 13, 2026
- **Revision:** 2.0 (Flow-Aligned)
- **Next Review:** Pre-development sprint planning
- **Distribution:** Engineering, Design, QA teams

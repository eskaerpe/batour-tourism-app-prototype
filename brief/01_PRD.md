# Product Requirements Document (PRD)
# BaTour - Personal Travel Assistant for Bandung

**Version:** 1.0.0  
**Status:** MVP - Front-End Only  
**Last Updated:** May 2026  
**Project Lead:** Development Team  
**Target Deployment:** Vercel (Static Site)

---

## 1. Executive Summary

### 1.1 Product Vision
BaTour is a React-based Progressive Web Application (PWA) that serves as a personal travel assistant for tourists visiting Bandung, Indonesia. The application bridges the gap between tourists and local SMEs/Guides (UMKMs), directly supporting UN Sustainable Development Goal 8 (Decent Work and Economic Growth).

### 1.2 Architectural Constraint
This MVP is explicitly scoped as a **Front-End Only** implementation:
- ✅ Static data persistence via IndexedDB
- ✅ Third-party handoffs (WhatsApp) for payments
- ✅ Robust offline-first architecture
- ❌ No proprietary backend/API
- ❌ No real-time payment processing
- ❌ No server-side authentication

### 1.3 Core Value Proposition
**"Anti-Ribet" (Anti-Hassle) Travel Planning**
- Pre-curated itineraries optimized for Bandung geography
- Offline-capable trip guidance for highland areas with poor connectivity
- Direct connection to verified local guides
- Transparent pricing with no hidden fees

### 1.4 Success Metrics
- **User Activation:** 60% of visitors complete itinerary builder
- **Offline Reliability:** 100% uptime for /active-trip route when offline
- **Performance:** FCP < 1.5s on 3G connections
- **Conversion:** 30% of built itineraries result in WhatsApp handoff

---

## 2. Technical Architecture

### 2.1 Tech Stack

| Layer | Technology | Justification |
|-------|-----------|---------------|
| **Framework** | React 18+ | Modern hooks, concurrent features, wide ecosystem |
| **Build Tool** | Vite | Fast HMR, optimized production builds |
| **Routing** | React Router v6 | Industry standard, nested routes support |
| **Styling** | Tailwind CSS | Rapid prototyping, consistency, mobile-first |
| **State** | Zustand + persist | Lightweight, IndexedDB persistence |
| **PWA** | vite-plugin-pwa | Service Worker generation, offline support |
| **Icons** | Material Symbols | Modern, outlined style matching design system |
| **Deployment** | Vercel | Zero-config, edge caching, preview URLs |

### 2.2 Design System Tokens
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
```

### 2.3 Project Structure
```
batour-react/
├── public/
│   ├── icons/              # PWA icons (192x192, 512x512)
│   └── manifest.json       # PWA manifest
├── src/
│   ├── components/
│   │   ├── common/         # Reusable UI components
│   │   ├── explore/        # Explore page components
│   │   ├── itinerary/      # Itinerary builder components
│   │   └── trip/           # Active trip components
│   ├── data/
│   │   ├── destinations.json
│   │   ├── guides.json
│   │   └── transitMatrix.json
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Route-level components
│   ├── stores/             # Zustand stores
│   ├── utils/              # Helper functions
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
├── tailwind.config.js
└── vercel.json
```

---

## 3. User Flows & Routes

### 3.1 Route Map

```
/ (Root/Onboarding)
├── /explore (Destination Discovery)
├── /build-itinerary (Trip Builder)
│   └── /build-itinerary?destinations=dest_001,dest_002
├── /checkout (Payment Handoff)
└── /active-trip (Offline Trip View)
    └── /active-trip/:bookingId
```

### 3.2 Critical User Journeys

#### Journey 1: First-Time Visitor → Booked Trip
1. **Landing (/)** → See hero image + "Mulai Eksplorasi" CTA
2. **Explore (/explore)** → Browse destinations, select 2-3 locations
3. **Build (/build-itinerary)** → Choose vehicle, select guide
4. **Checkout (/checkout)** → Review costs, click "Book via WhatsApp"
5. **WhatsApp Handoff** → Auto-populated message sent to BaTour admin
6. **Return** → User receives booking confirmation link
7. **Active Trip (/active-trip/:id)** → Access offline itinerary on trip day

#### Journey 2: Returning User with Offline Need
1. **Direct Navigation** → User opens /active-trip/:bookingId
2. **Service Worker** → Loads cached page, guide contacts, QR ticket
3. **Offline Timeline** → Shows current step based on device time
4. **Guide Contact** → One-tap WhatsApp or emergency phone call

---

## 4. Feature Requirements

### 4.1 F1: Onboarding Screen (/)

**Priority:** P0 (Must Have)

**User Story:**  
As a first-time visitor, I want to understand BaTour's value proposition within 3 seconds so I can decide to explore further.

**Acceptance Criteria:**
- [ ] Full viewport hero image loads with skeleton placeholder
- [ ] Gradient overlay displays "Anti-Ribet Travel di Bandung" headline
- [ ] "Mulai Eksplorasi" button navigates to /explore
- [ ] IndexedDB check bypasses onboarding if `hasCompletedOnboarding === true`
- [ ] SDG 8 badge visible in footer

**Technical Notes:**
- Hero image must be optimized (WebP, <150KB)
- Lazy load SDG badge to prioritize CTA visibility

---

### 4.2 F2: Destination Explorer (/explore)

**Priority:** P0 (Must Have)

**User Story:**  
As a tourist, I want to discover Bandung destinations filtered by category so I can build a personalized itinerary.

**Acceptance Criteria:**
- [ ] Search bar filters destinations in real-time (debounced 300ms)
- [ ] Category pills: All, Curated Trips, Nature, Culinary, Shopping
- [ ] Each DestinationCard shows:
  - Image (optimized, lazy loaded)
  - Name
  - Star rating (1-5, from static data)
  - Location zone (e.g., "Ciwidey", "Lembang")
  - Entry fee badge
- [ ] "Add to Trip" button updates Zustand store
- [ ] Selected destinations show checkmark overlay
- [ ] Offline indicator appears when network is unavailable

**Technical Notes:**
- Filter logic runs purely client-side on `destinations.json`
- Images precached by Service Worker on initial load

---

### 4.3 F3: Itinerary Builder (/build-itinerary)

**Priority:** P0 (Must Have)

**User Story:**  
As a user with selected destinations, I want to configure my trip logistics (vehicle, guide) and see a visual timeline so I can understand the day's flow before booking.

**Acceptance Criteria:**
- [ ] Vehicle selector (radio group):
  - Car (1-4 pax, Rp 600.000/day)
  - Van (5-8 pax, Rp 900.000/day)
- [ ] Guide list displays:
  - Photo, name, rating, languages, daily rate
  - "Select Guide" button
- [ ] Timeline engine calculates:
  - Start time (default 08:00)
  - Destination durations (from `estimatedDurationMinutes`)
  - Transit times (from `transitMatrixMinutes`)
  - End time (auto-calculated)
- [ ] Visual timeline shows:
  - Step numbers
  - Location names
  - Arrival times
  - Duration bars
- [ ] Fixed bottom bar displays real-time Total Cost
- [ ] "Lanjut ke Pembayaran" navigates to /checkout

**Technical Notes:**
- Timeline calculation is purely client-side (no external APIs)
- Transit matrix uses zone-to-zone lookup table

---

### 4.4 F4: Checkout & WhatsApp Handoff (/checkout)

**Priority:** P0 (Must Have)

**User Story:**  
As a user ready to book, I want to review final costs and securely submit my booking so I can confirm my trip with BaTour.

**Acceptance Criteria:**
- [ ] Cost breakdown card displays:
  - Vehicle rental fee
  - Guide fee
  - Entry fees (itemized per destination)
  - **Total** (bold, large text)
- [ ] Payment options:
  - 50% Deposit (pay now, 50% on trip day)
  - Full Payment (100% now, 5% discount)
- [ ] Trust badges:
  - "Secure Booking"
  - "Free Cancellation 24hr Before"
  - "Verified Local Guides"
- [ ] "Book via WhatsApp" button:
  - Disabled if offline
  - Generates URL-encoded message with trip details
  - Opens `wa.me/6281234567890/?text=...`
- [ ] After WhatsApp handoff, show "Check WhatsApp" confirmation screen

**WhatsApp Message Format:**
```
Halo BaTour! Saya ingin booking trip:

📅 Tanggal: [User inputs later in WhatsApp]
🚗 Kendaraan: Van (5-8 pax)
👤 Guide: Pak Budi
📍 Destinasi:
  1. Kawah Putih (Rp 50.000)
  2. Situ Patenggang (Rp 30.000)
  3. Glamping Lakeside (Rp 0)

💰 Total: Rp 1.080.000
💳 Opsi Bayar: DP 50% (Rp 540.000)

Mohon konfirmasi ketersediaan. Terima kasih!
```

---

### 4.5 F5: Active Trip View (/active-trip/:bookingId)

**Priority:** P0 (Must Have)

**User Story:**  
As a tourist on my trip day in a highland area with no internet, I need to access my itinerary, guide contacts, and QR ticket so I can navigate my day independently.

**Acceptance Criteria:**
- [ ] **100% offline availability** (cached by Service Worker)
- [ ] Guide contact card:
  - Photo, name, phone
  - "Chat di WhatsApp" button (deep link)
  - "Telepon Darurat" button (tel: protocol)
- [ ] Interactive timeline:
  - Highlights current step based on device time
  - Shows "Next: [Location]" indicator
  - Displays remaining time to next stop
- [ ] QR ticket:
  - Base64 encoded booking ID
  - Scannable by guide's phone
- [ ] Emergency fallback:
  - If bookingId not found in IndexedDB, show "Trip not found" with WhatsApp support link

**Technical Notes:**
- Timeline highlighting uses `Date.now()` compared to scheduled times
- QR code generated client-side via `qrcode.react` library
- All images for this page precached during checkout

---

## 5. Non-Functional Requirements

### 5.1 Performance

| Metric | Target | Tool |
|--------|--------|------|
| First Contentful Paint | < 1.5s | Lighthouse |
| Time to Interactive | < 3.0s | Lighthouse |
| Largest Contentful Paint | < 2.5s | Lighthouse |
| Total Blocking Time | < 200ms | Lighthouse |
| Cumulative Layout Shift | < 0.1 | Lighthouse |

**Optimization Strategies:**
- Code splitting per route
- Image lazy loading with `loading="lazy"`
- WebP format with fallback
- Service Worker precaching for critical paths

### 5.2 Accessibility (WCAG 2.1 Level AA)

- [ ] All interactive elements keyboard navigable
- [ ] Focus indicators visible (2px outline)
- [ ] Color contrast ratio ≥ 4.5:1 for text
- [ ] Alt text for all images
- [ ] ARIA labels for icon-only buttons
- [ ] Screen reader tested (NVDA/VoiceOver)

### 5.3 Security

**Client-Side Constraints:**
- ❌ No sensitive payment data stored in browser
- ❌ No authentication tokens (no backend)
- ✅ Input sanitization for search queries
- ✅ CSP headers configured in Vercel
- ✅ HTTPS enforced

### 5.4 Browser Support

| Browser | Minimum Version |
|---------|----------------|
| Chrome | 90+ |
| Safari (iOS) | 14+ |
| Firefox | 88+ |
| Edge | 90+ |

### 5.5 Data Payload Limits

- Static JSON database: < 500KB total
- Individual destination images: < 100KB each
- Hero images: < 150KB (WebP)
- Total app bundle (gzipped): < 300KB

---

## 6. Out of Scope (Future Phases)

### Phase 2 (Backend Integration)
- Real-time payment processing (Midtrans/Xendit)
- User authentication
- Booking management dashboard
- Live guide availability

### Phase 3 (Advanced Features)
- AI-powered itinerary recommendations
- Real-time traffic integration (Google Maps API)
- Multi-language support (EN, CN, JP)
- Chatbot assistant

### Phase 4 (Marketplace)
- User reviews & ratings
- Dynamic pricing
- Multi-city expansion (Jakarta, Yogyakarta)

---

## 7. Success Criteria & KPIs

### MVP Launch Goals (Month 1)
- [ ] 1,000 unique visitors
- [ ] 300 completed itineraries
- [ ] 90 WhatsApp handoffs
- [ ] 30% handoff → confirmed booking conversion
- [ ] 4.5/5.0 user satisfaction (post-trip survey)

### Technical Health Metrics
- [ ] 99.9% uptime (Vercel)
- [ ] < 0.1% error rate (Sentry)
- [ ] 80+ Lighthouse score (Performance)
- [ ] 100% offline availability for /active-trip

---

## 8. Stakeholders & Approvals

| Role | Name | Approval Date |
|------|------|---------------|
| Product Owner | [TBD] | [Pending] |
| Tech Lead | [TBD] | [Pending] |
| UX Designer | [TBD] | [Pending] |
| QA Lead | [TBD] | [Pending] |

---

**Document Control:**
- **Created:** May 13, 2026
- **Next Review:** Pre-development sprint planning
- **Distribution:** Engineering, Design, QA teams

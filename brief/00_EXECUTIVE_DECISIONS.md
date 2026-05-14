# 🏗️ Executive Decisions & Optimizations
## BaTour MVP - Front-End Only PWA

**Generated:** May 14, 2026  
**Status:** Ready for Development  
**Architecture Confidence:** ⭐⭐⭐⭐⭐

---

## 1. Scope Reduction: Anti-Ribet MVP Focus

**What We're Cutting (Phase 2+):**
- ❌ Server-side authentication (user accounts, login flows)
- ❌ Real-time payment processing (Midtrans, Xendit integration)
- ❌ Booking management dashboards
- ❌ Live guide availability checking
- ❌ Multi-language support (defer to Phase 3)
- ❌ AI-powered recommendations
- ❌ Real-time traffic integration

**Why This Matters:**
- The MVP is **strictly a booking funnel**, not a user platform
- WhatsApp handoff is our "payment gateway" — keeps backend complexity at zero
- IndexedDB handles all session state — no server dependency
- Static JSON data removes database overhead entirely

**What We KEEP (P0 Must-Have):**
- ✅ Pre-curated itineraries (3 destinations, visual timeline)
- ✅ Transparent cost breakdown (no hidden fees)
- ✅ Offline-first capability (100% usable on /active-trip without internet)
- ✅ Direct guide/mitra contact (WhatsApp deep link)
- ✅ QR ticket generation (client-side, no server)
- ✅ Fast first load (< 1.5s FCP on 3G)

---

## 2. Contract Hardening: Strict Data Formats

**What We Hardened:**

### Data Model Flattening
- **Destinations:** Every field pre-calculated (no computed properties at query time)
  - `entryFeeLabel` (Rp 50.000) alongside `entryFee` (50000) — no formatting on render
  - `estimatedDurationMinutes` as integer — no parsing ambiguity
  - `zone` (Ciwidey, Lembang) instead of nested location object — flat lookups
  
- **Guides:** All fees + labels pre-formatted
  - `dailyRate` (500000) + `dailyRateLabel` ("Rp 500.000/hari")
  - `phone` format locked to `62XXXXXXXXXX` — WhatsApp URL generation is deterministic
  - `maxGroupSize` prevents invalid bookings at validation, not at runtime

- **Car Rentals:** Fixed structure, no variants
  - `type` enum: `car`, `van` (not strings)
  - `capacity` human-readable string ("1-4 pax")
  - `dailyRate` is the ONLY price — no hidden surcharges

### Error Payload Standardization
All error responses match this shape (no exceptions):
```json
{
  "error": true,
  "message": "Human-readable description",
  "code": "ERROR_CODE",
  "field": "fieldName" // Optional, for validation errors
}
```

### Validation Rules Encoded
- Destinations: **1 minimum, 3 maximum**, IDs must exist
- Guide: **1 required**, ID must exist, phone format immutable
- Car: **0 or 1**, null allowed, type must match schema
- Payment: **required**, must be `DP_50` or `FULL` (no variations)
- Booking ID: **format enforced** `BATOUR-XXXXXX` (6 alphanumeric)

**Why:** Removes parsing logic from components. Validation happens at store boundary, not in UI.

---

## 3. Agile Flexibility: Pluggable Modules

**Zones (Extensible for Phase 2):**
```javascript
// Zones are NOT hardcoded in components
// They're derived from destinations.json → ["Bandung Pusat", "Ciwidey", "Lembang"]
// To add a new zone in Phase 2: add destination with new zone, rebuild
```

**Transit Matrix (Pluggable):**
- Stored in `transitMatrix.json` — matrix[from][to] = minutes
- Can be replaced with Google Maps API in Phase 2 without touching React code
- Component consumes `useTransitTime(from, to)` hook — abstracted from source

**Payment Methods (Feature-Flagged):**
```javascript
// In Phase 2, extend PAYMENT_TYPES without touching route components
const PAYMENT_TYPES = {
  DP_50: { label: '50/50', percentage: 0.5 },
  FULL: { label: 'Full Now', percentage: 1.0 },
  // INSTALLMENT: { label: '3x Cicilan', percentage: 0.2 } // Phase 2
};
```

**Guide Filtering (Prepared for Language/Specialty):**
- Components accept `filters` prop — don't hardcode filter logic
- Hooks: `useFilteredGuides(selectedLanguages, selectedSpecialties)` — ready for UI expansion

**Car Types (Extensible):**
- `carRentals.json` array, not hardcoded enum
- Phase 2: add motorcycle, bicycle, group bus — just add rows to JSON

---

## 4. State & Caching: Explicit Rules

### Client-Side State Flow
```
User Input
  ↓
Zustand Store (tripStore) updated
  ↓
Persist middleware → IndexedDB (sessionState)
  ↓
Component re-renders from store
  ↓
On /checkout → Generate Booking → Save to IndexedDB (bookings)
  ↓
On /active-trip → Load from IndexedDB, 100% offline
```

### Cache Invalidation Strategy
| Data | Source | Invalidation | Refresh |
|------|--------|--------------|---------|
| Destinations | `destinations.json` (bundled) | App rebuild | Vercel deployment |
| Guides | `guides.json` (bundled) | App rebuild | Vercel deployment |
| Car Rentals | `carRentals.json` (bundled) | App rebuild | Vercel deployment |
| Transit Matrix | `transitMatrix.json` (bundled) | App rebuild | Vercel deployment |
| Session State | IndexedDB | Manual clear only | User clears browser storage |
| Bookings | IndexedDB | Manual delete only | User deletes or explicit trip completion |

**Critical:** No HTTP requests after app load. All data is **immutable during session**.

### Service Worker Precaching
- **Strategy:** Full precache (all images, CSS, JS bundled)
- **Cache-Control:** `max-age=31536000` (1 year) for versioned bundles
- **Invalidation:** Vite hash in filename (`app.abc123.js`) + vite-plugin-pwa versioning
- **Offline Experience:** 100% offline on /active-trip, degraded on /explore (images cached, search disabled)

### IndexedDB Schema (Storage Limits)
```javascript
// Stores
- sessionState: { key: 'user', value: { selectedDestinations: [...], selectedGuide: null, ... } }
- bookings: { key: bookingId, value: { id, destinations: [...], guide: {...}, totalCost, createdAt, ... } }

// Limits
- Per-key max: ~5MB (one booking + all metadata)
- IndexedDB total: ~50MB default (Android, Chrome)
- Precache images: ~150KB × 20 destinations = 3MB total
// Safe margin: well under limit
```

---

## 5. Performance Optimization: Hard Targets

| Metric | Target | Technique |
|--------|--------|-----------|
| **FCP (First Contentful Paint)** | < 1.5s | Lazy-load guide/destination images on /explore; hero loads first |
| **LCP (Largest Contentful Paint)** | < 2.5s | Image optimization (WebP, <100KB), inline critical CSS |
| **TTI (Time to Interactive)** | < 3.0s | Code-split routes, defer non-critical JS |
| **CLS (Cumulative Layout Shift)** | < 0.1 | Fixed dimensions for all images, no late font loads |
| **Bundle Size (gzipped)** | < 300KB | React 18 (78KB), React Router (15KB), Zustand (3KB), Tailwind (50KB), other (30KB) |

**Edge Caching:** Vercel automatically caches at edge (150+ POPs globally) — /active-trip offline view is instant.

---

## 6. Security Posture: Client-Side Constraints

**What We DON'T Store:**
- ❌ Payment card numbers (WhatsApp handoff instead)
- ❌ Bank account details (guide provides via WhatsApp)
- ❌ Authentication tokens (no server auth in MVP)
- ❌ Sensitive user data (no user accounts)

**What We DO Protect:**
- ✅ InputSanitization for search (regex validation before store update)
- ✅ CSP Headers on Vercel (Content-Security-Policy in vercel.json)
- ✅ HTTPS enforced (Vercel automatic)
- ✅ Booking ID confidentiality (6-char alphanumeric, not sequential, hard to guess)

**Validation:** All client-side. No trust in user input for display — always validate before rendering.

---

## 7. Testing Strategy: MVP Focus

### Phase 1: Unit Tests (Foundation)
- Price calculation logic (`priceCalculations.js`)
- Timeline generation (`timelineEngine.js`)
- WhatsApp message formatting (`whatsappFormatter.js`)

### Phase 2: Integration Tests
- Zustand store mutations (add destination, set guide, etc.)
- IndexedDB persistence (save → reload → verify)
- Route navigation (flow from /explore → /checkout → /active-trip)

### Phase 3: E2E Tests (Critical Paths)
- First-time user → complete booking flow
- Returning user → load /active-trip offline
- Offline fallback (image cache, search disabled)

---

## 8. Monitoring & Observability (Phase 1.5)

**What We Measure:**
- Sentry error tracking (client errors, network failures)
- Vercel analytics (FCP, LCP, CLS, user interactions)
- IndexedDB quota warnings (if approaching limits)
- WhatsApp handoff success (deep link opens)

**What We DON'T Track:**
- ❌ User identity (no auth)
- ❌ Payment data
- ❌ PII (except phone shown by guide)

---

## 9. Deployment Strategy: Zero-Config Simplicity

**Hosting:** Vercel (automatic HTTPS, CDN, preview URLs)
**Build:** Vite (HMR, optimized bundles, tree-shaking)
**Version Control:** GitHub (main → auto-deploy to vercel.com/batour)

**Rollback:** Previous deployment always available (Vercel dashboard)
**Environment:** Single environment (no staging complexity in MVP)

---

## 10. Success Metrics: Hard Numbers

### Launch Targets (Month 1)
- 1,000 unique visitors
- 300 completed itineraries (/confirmation reached)
- 90 WhatsApp handoffs (wa.me link opened)
- 30% handoff → confirmed booking (estimated from WhatsApp responses)
- 4.5/5.0 user satisfaction (post-trip survey)

### Technical Health
- 99.9% uptime (Vercel SLA)
- < 0.1% error rate (Sentry dashboard)
- 80+ Lighthouse performance score
- 100% offline availability on /active-trip

---

## Summary: Confidence Factors

✅ **No Backend Dependency** — All logic runs client-side  
✅ **Immutable Data** — Static JSON removes sync headaches  
✅ **Offline-First Design** — Works in highland areas (core value prop)  
✅ **Extensible Architecture** — Modules prepared for Phase 2 features  
✅ **Transparent Pricing** — No hidden calculations, user sees all costs  
✅ **Direct Handoff** — WhatsApp removes payment complexity  

**Risk Factors (Mitigated):**
- IndexedDB quota exceeded → Low risk (3MB images << 50MB limit)
- Guide availability → Handled via WhatsApp (not our problem in MVP)
- Payment fraud → Handled by guide/mitra (direct verification)
- Network offline → By design, /active-trip works 100% offline

---

**Recommendation:** Proceed to Development Phase 1 (Data Layer) with confidence.

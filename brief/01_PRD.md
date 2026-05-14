# Product Requirements Document
## BaTour - Personal Travel Assistant for Bandung

**Core Objective:**  
Enable hassle-free trip planning for Bandung tourists by providing pre-curated itineraries, direct guide booking, and offline-capable trip guidance—all without backend complexity or payment gateway overhead.

**Version:** 1.0 (VibeCODE Generation)  
**Status:** Ready for Development  
**Last Updated:** May 14, 2026

---

## MVP User Stories

- **As a** first-time visitor to Bandung, **I can** browse curated destinations and select 2-3 in under 2 minutes, **so** I avoid decision fatigue and can move forward quickly.

- **As a** tourist, **I can** see all costs upfront (guide fee, car rental, entry fees) with no hidden charges, **so** I trust the platform and can make confident purchasing decisions.

- **As a** user building a trip, **I can** navigate backward to change my destination, guide, or car selection before final checkout, **so** I'm not locked into a wizard-like experience.

- **As a** user in a highland area with spotty 3G, **I can** view my complete itinerary, guide contact details, and QR ticket 100% offline, **so** my trip isn't interrupted by poor connectivity.

- **As a** tourist, **I can** book a guide + car (or skip the car and use the guide's vehicle) in one flow, **so** transportation logistics are seamless.

- **As a** user, **I can** choose between paying 50% now + 50% on trip day (DP) or paying full now (with 5% discount), **so** payment flexibility meets different user preferences.

- **As a** returning user, **I can** resume my trip-building session after closing the app, **so** my previous selections aren't lost.

- **As a** user, **I can** complete my booking via WhatsApp handoff (no proprietary payment system), **so** all coordination happens in a familiar, trusted channel.

---

## In Scope: Features We Are Building

### Core Booking Flow
- ✅ **Landing Page** — Hero image, "Mulai Eksplorasi" CTA, returning user bypass
- ✅ **Destination Exploration** — Browse 3 categories (Tempat Wisata, Tempat Makan, Toko Oleh-Oleh), select 1-3
- ✅ **Guide Selection** — View guide cards (photo, name, rating, languages, daily rate), select 1
- ✅ **Car Rental Decision** — Binary choice: Yes (select car type) or No (use guide's vehicle)
- ✅ **Booking Summary** — Visual timeline, cost breakdown, review selections
- ✅ **Payment Options** — DP 50% or Full Payment (with 5% discount)
- ✅ **Confirmation** — Final review, trust badges, "Selesaikan via WhatsApp" button
- ✅ **WhatsApp Handoff** — Deep link to guide's WhatsApp with pre-formatted booking message
- ✅ **Checkout Screen** — Booking reference, confirmation message, offline check

### Active Trip Experience
- ✅ **Offline Trip View** — Full itinerary accessible without internet (cached at /active-trip/:bookingId)
- ✅ **Interactive Timeline** — Shows current location (based on time) and next step
- ✅ **Guide Contact Card** — Phone, WhatsApp, basic bio
- ✅ **QR Ticket** — Client-side generated, scannable by guide
- ✅ **Emergency Fallback** — WhatsApp support link if booking not found

### Progressive Web App Features
- ✅ **Service Worker** — Full offline precaching of critical assets
- ✅ **Installable** — Add to home screen (iOS/Android)
- ✅ **Offline Indicator** — Badge in header showing connection status
- ✅ **Responsive Design** — Mobile-first, edge-to-edge layout

### Data Layer
- ✅ **Static JSON Bundled Data** — Destinations, guides, car rentals, transit matrix
- ✅ **IndexedDB Persistence** — Session state, completed bookings
- ✅ **Zustand State Management** — Trip building, UI state, offline status

---

## Out of Scope: Features We Are NOT Building

### Backend/Authentication
- ❌ Server-side API (all logic client-side)
- ❌ User accounts or login system
- ❌ Email verification
- ❌ Password reset flows

### Payments
- ❌ Real-time payment processing (Midtrans, Xendit, Stripe)
- ❌ Payment card storage
- ❌ Transaction receipts (guide provides via WhatsApp)
- ❌ Refund processing (handled manually by guide)

### Advanced Features
- ❌ Multi-language support (Indonesian only in MVP)
- ❌ AI-powered recommendations
- ❌ Real-time traffic integration (Google Maps API)
- ❌ Live guide availability checking
- ❌ User reviews or ratings submission
- ❌ Booking management dashboard
- ❌ Multi-city expansion

### Admin/Operations
- ❌ Guide management dashboard
- ❌ Car rental inventory system
- ❌ Booking analytics dashboard
- ❌ Pricing management UI

---

## Future Extensibility: Prepared for Growth

### Phase 2 (Backend Integration)
- Swap `transitMatrix.json` → Google Maps Distance Matrix API (no component changes)
- Add real-time payment processing → Replace WhatsApp handoff with Midtrans/Xendit modal
- User accounts → Add Firebase Auth, persist trips to Firestore
- Trip date selection → Move from WhatsApp confirmation to calendar picker in Phase 2 UI

### Phase 3 (Advanced Features)
- AI recommendations: Train model on booking patterns, inject into /explore
- Multi-language: Add language switcher, i18n framework, new .json files
- Reviews: New endpoint GET /guides/:id/reviews, ReviewCard component

### Phase 4 (Marketplace)
- Dynamic pricing: Endpoint GET /guides/:id/pricing?date=YYYY-MM-DD
- Multi-city: New field in guides.json: `serviceCities: ["Bandung", "Yogyakarta"]`
- Inventory: Real-time car availability from rental API

---

## State & Freshness: Exact Caching Rules

### Trip Building Session
- **Stored In:** Zustand (tripStore) + IndexedDB (sessionState)
- **Lifetime:** Persists across browser sessions (until user clears cache or 30 days idle)
- **Invalidation:** Manual only (user explicitly clears cache or trip is marked completed)
- **Sync:** IndexedDB auto-synced on every store mutation via Zustand persist middleware

### Completed Bookings
- **Stored In:** IndexedDB (bookings store)
- **Lifetime:** Permanent (until user deletes)
- **Invalidation:** Manual only
- **Availability:** 100% offline, loaded immediately on /active-trip/:bookingId

### Static Data (Destinations, Guides, Cars, Transit)
- **Stored In:** Bundled JSON files + Service Worker precache
- **Lifetime:** App lifetime
- **Invalidation:** App rebuild + Vercel redeploy (data is immutable during session)
- **Freshness:** New data requires new app version (acceptable for MVP)

### Offline Mode
- **Availability:** 100% on /active-trip, degraded on /explore (images cached, search disabled)
- **Indicator:** Badge in top-right: "Offline" in red
- **Behavior:** No HTTP requests attempted, all data from cache

---

## Edge Cases: Exact Behaviors

### Network Failures

| Scenario | Behavior | User Sees |
|----------|----------|-----------|
| Offline when loading /explore | Page loads from cache, images from cache, search input disabled | Normal page with "Offline" badge, search greyed out |
| Offline on /booking-details | Page loads from IndexedDB state, all costs calculated, no error | Normal flow, offline badge visible |
| Offline when clicking "Selesaikan via WhatsApp" | Button disabled, toast message shown | "Koneksi internet diperlukan untuk melanjutkan" for 3 seconds |
| Connection drops mid-checkout | Session state in IndexedDB is preserved, no data loss | User can refresh, state recovered |
| Online → Offline → Online during /guide-selection | Seamless, no action needed | Offline badge appears then disappears |

### Data Validation Failures

| Scenario | Validation Rule | User Sees |
|----------|-----------------|-----------|
| User clicks next with 0 destinations | Min 1, max 3 destinations | Toast error: "Pilih minimal 1 destinasi" |
| User clicks next with 0 guide | Guide is required | Toast error: "Pilih 1 tour guide" |
| User tries to select 4th destination | Max 3 enforced | Button disabled with tooltip: "Max 3 destinasi" |
| Payment option not selected | Payment is required before checkout | Button disabled: "Pilih opsi pembayaran" |
| Total cost calculation error (should never happen) | Total = guideFee + carFee + sum(entryFees) | Alert: "Terjadi kesalahan kalkulasi, hubungi support" |

### Edge Cases in Offline Scenario

| Scenario | Behavior |
|----------|----------|
| User opens /active-trip/:bookingId that doesn't exist in IndexedDB | Show error screen: "Trip tidak ditemukan", with WhatsApp support link |
| User refreshes on /active-trip while offline | Page reloads, data loads from IndexedDB, no interruption |
| User deletes browser cache while viewing /active-trip | Next reload shows error, user must rejoin via WhatsApp |
| IndexedDB quota exceeded (>50MB) | Show alert: "Ruang penyimpanan penuh, mohon hapus app cache di settings" |
| User's device time is grossly incorrect | Timeline shows incorrect "current step" (by design, user's responsibility) |
| QR code generation fails (corrupted bookingId) | Show fallback: "Booking reference: BATOUR-ABC123" (no QR, but usable) |

### Browser/Device Edge Cases

| Scenario | Behavior |
|----------|----------|
| Very old browser (no IndexedDB support) | Fallback: session state lost on refresh (but still functional) |
| Screen rotation on /active-trip | Layout reflows, timeline readable on portrait or landscape |
| Notch/safe area on iPhone | All interactive elements visible and tappable (not hidden behind notch) |
| Very small screen (320px width) | Content readable, no horizontal scroll |
| Screen reader (iOS VoiceOver / Android TalkBack) | All interactive elements have proper ARIA labels |

---

## User Journey: Step-by-Step Flow

```
1. Landing (/)
   ↓ (first-time) or (returning + cached state)
2. Destination Selection (/explore)
   ↓ (select 1-3 destinations)
3. Guide Selection (/guide-selection)
   ↓ (select 1 guide)
4. Car Rental Decision (/car-selection)
   ↓ (Yes → select car type | No → skip)
5. Booking Details (/booking-details)
   ↓ (review timeline, costs, can go back)
6. Payment Options (/payment-options)
   ↓ (select DP 50% or Full)
7. Confirmation (/confirmation)
   ↓ (review all selections)
8. WhatsApp Handoff (/checkout)
   ↓ (deep link to wa.me, shows booking reference)
9. Active Trip (/active-trip/:bookingId)
   ↓ (100% offline, view timeline, call guide)
```

**Key Design Principle:** Users can navigate backward at any step to revise selections. NOT a linear wizard.

---

## Technical Constraints

### Performance Targets
- First Contentful Paint: < 1.5s on 3G
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.0s
- Cumulative Layout Shift: < 0.1
- App bundle (gzipped): < 300KB

### Browser Support
- Chrome 90+
- Safari (iOS) 14+
- Firefox 88+
- Edge 90+

### Data Payload Limits
- Static JSON database: < 500KB total
- Individual destination images: < 100KB each (WebP)
- Hero images: < 150KB (WebP)
- Guide photos: < 50KB each (WebP)
- Total precache (Service Worker): < 10MB

### Accessibility (WCAG 2.1 Level AA)
- All interactive elements keyboard-navigable
- Focus indicators visible (2px outline)
- Color contrast ≥ 4.5:1 for text
- Alt text for all images
- ARIA labels for icon buttons
- Screen reader tested

---

## Success Criteria

### Launch Month (MVP Goals)
- 1,000 unique visitors
- 300 completed itineraries (reached /confirmation)
- 90 WhatsApp handoffs (wa.me link opened)
- 30% handoff → confirmed booking rate (estimated)
- 4.5/5.0 user satisfaction (post-trip survey)

### Technical Health
- 99.9% uptime (Vercel SLA)
- < 0.1% error rate (Sentry tracking)
- 80+ Lighthouse performance score
- 100% offline availability for /active-trip

---

## Success Metrics: How We Measure

| Metric | Tool | Target | Why |
|--------|------|--------|-----|
| Unique Visitors | Vercel Analytics | 1,000/month | Market validation |
| Itineraries Built | Custom event tracking | 300/month | User engagement |
| WhatsApp Handoffs | Deep link click tracking | 90/month (30% conversion) | Booking intent |
| First Contentful Paint | Lighthouse | < 1.5s | 3G usability |
| Offline Availability | Sentry events | 100% uptime /active-trip | Core value prop |
| Error Rate | Sentry | < 0.1% | Stability |
| User Satisfaction | Post-trip survey form | 4.5/5.0 | Quality feedback |

---

## Stakeholders & Dependencies

| Role | Responsibility | Dependency |
|------|-----------------|-----------|
| Product Owner | Define acceptance criteria | None |
| Frontend Engineer | Build React UI + state management | Design assets, data files |
| QA Engineer | Test flows, offline mode, edge cases | Builds from engineer |
| UX Designer | Provide Figma designs, component library | PRD approval |
| DevOps/Infra | Vercel deployment, monitoring setup | Frontend build artifact |

---

## Approval & Sign-Off

- [ ] Product Owner approval
- [ ] Tech Lead approval
- [ ] UX Designer approval
- [ ] QA Lead approval

---

**Document Control:**
- **Created:** May 14, 2026 (VibeCODE Generation)
- **Revision:** 1.0
- **Distribution:** Engineering, Design, QA teams

# 📋 Copilot Handoff Prompt: BaTour Phase 1

**Context:** You are inheriting BaTour, a front-end-only PWA for travel booking in Bandung. Your job: Execute Phase 1 (Data Layer & State Management) with surgical precision.

**Time Limit:** 2 weeks  
**Objective:** Complete all Phase 1 tasks from TASKS.md with zero rework

---

## Pre-Execution Checklist

Before you start, read these files **in this order:**
1. ✅ **01_PRD.md** — Understand what we're building (user stories, success criteria)
2. ✅ **02_API_SPEC.md** — Understand the exact data contracts (JSON shapes, Zustand schema, IndexedDB)
3. ✅ **04_CONTEXT.md** — Understand the stack, team structure, development environment
4. ✅ **05_RULES.md** — Understand execution discipline (one task per commit, contract-first, etc.)
5. ✅ **03_TASKS.md** — This is your checklist (complete Tasks 1.1–1.9)

**Verification:** Before beginning, answer these questions in your response:
- What are the 3 core constraints of the MVP? (Hint: front-end only, offline-first, WhatsApp handoff)
- What is the Zustand store responsible for? (Hint: trip building state + calculations)
- What are the 4 JSON data files we need? (Hint: destinations, guides, cars, transit)

---

## Task Execution Plan

### Phase 1: Data Layer & State Management (Tasks 1.1–1.9)

You will execute **9 tasks in sequence**. Each task has a "Done Criteria" that you must verify before moving to the next.

---

### Task 1.1: Create Destination Data (destinations.json)

**What to Build:**
- File: `src/data/destinations.json`
- 6-8 destinations across 3 categories:
  - 3-4 Tempat Wisata (attractions): Kawah Putih, Situ Patenggang, Strawberry Farm, Glamping
  - 1-2 Tempat Makan (dining): Nasi Timbel Warung
  - 1-2 Toko Oleh-Oleh (shopping): BTC Bandung
- Each destination must have: id, name, category, zone, description, image, rating, entryFee, estimatedDuration, coordinates, operatingHours

**Reference:** API_SPEC.md Section 1.1 (exact field constraints)

**Done Criteria:**
- [ ] `src/data/destinations.json` exists and parses without errors
- [ ] All 6-8 destinations have required fields (validate against schema)
- [ ] Rating between 1-5, entryFee in valid Rupiah amounts
- [ ] estimatedDurationMinutes ≥ 30 for all destinations
- [ ] Images exist at `/public/images/destinations/` (use placeholder names for now)
- [ ] No duplicate IDs
- [ ] Tested in browser console: `import destinations from '@/data/destinations.json'; console.log(destinations[0]);` — should match schema

**Commit Format:**
```
[PHASE-1] Task 1.1: Create destinations.json with 6 attractions across 3 categories
```

---

### Task 1.2: Create Guide Data (guides.json)

**What to Build:**
- File: `src/data/guides.json`
- 3-5 tour guides with realistic data
- Each guide: id, name, photo, rating, dailyRate (500k-600k), languages (3+ languages), phone (`62XXXXXXXXXX` format), bio, specialties, yearsExperience, maxGroupSize

**Reference:** API_SPEC.md Section 1.2

**Done Criteria:**
- [ ] `src/data/guides.json` exists and parses without errors
- [ ] 3-5 guides with all required fields
- [ ] Phone format matches `62XXXXXXXXXX` (11-13 digits) for all guides
- [ ] dailyRate between 300k-600k
- [ ] rating between 1-5
- [ ] Specialties realistic (Nature, Cultural, Photography, etc.)
- [ ] Tested in browser console: `import guides from '@/data/guides.json'; console.log(guides[0]);` — should match schema
- [ ] No duplicate IDs

**Commit Format:**
```
[PHASE-1] Task 1.2: Create guides.json with 3 tour guides
```

---

### Task 1.3: Create Car Rental Data (carRentals.json)

**What to Build:**
- File: `src/data/carRentals.json`
- 2 car types only (no more, no less):
  1. Sedan (car_sedan): 1-4 pax, 600,000/day, Manual transmission
  2. Van (car_van): 5-8 pax, 900,000/day, Automatic transmission
- Each car: id, type, label, description, capacity, image, dailyRate, dailyRateLabel, transmission, estimatedFuelConsumption

**Reference:** API_SPEC.md Section 1.3

**Done Criteria:**
- [ ] `src/data/carRentals.json` exists with exactly 2 cars
- [ ] Sedan: 600,000 daily rate
- [ ] Van: 900,000 daily rate
- [ ] All fields present for both cars
- [ ] Images exist at `/public/images/cars/` (placeholders OK)
- [ ] Tested in browser console: `import cars from '@/data/carRentals.json'; console.log(cars[0]);` — should match schema

**Commit Format:**
```
[PHASE-1] Task 1.3: Create carRentals.json with sedan and van options
```

---

### Task 1.4: Create Transit Matrix (transitMatrix.json)

**What to Build:**
- File: `src/data/transitMatrix.json`
- 4 zones: ["Bandung Pusat", "Ciwidey", "Lembang", "Tangkuban Perahu"]
- Matrix with all pairwise travel times (minutes, round-trip, realistic)
- Example routes:
  - Bandung Pusat ↔ Ciwidey: 45 min
  - Ciwidey ↔ Lembang: 90 min
  - Lembang ↔ Tangkuban Perahu: 30 min
  - Fill in all other pairwise routes

**Reference:** API_SPEC.md Section 1.4

**Done Criteria:**
- [ ] `src/data/transitMatrix.json` exists
- [ ] 4 zones defined
- [ ] All pairwise routes defined (bidirectional: A→B and B→A)
- [ ] Travel times realistic (30-120 min for mountain roads)
- [ ] Tested: No missing routes when building timeline

**Commit Format:**
```
[PHASE-1] Task 1.4: Create transitMatrix.json with 4 zones and travel times
```

---

### Task 1.5: Implement Zustand Trip Store

**What to Build:**
- File: `src/stores/tripStore.js`
- Zustand store with these actions:
  - `addDestination(destId)` — Add to selectedDestinations (max 3)
  - `removeDestination(destId)` — Remove from selectedDestinations
  - `clearDestinations()` — Reset list
  - `setGuide(guideId)` — Set single guide (replaces previous)
  - `clearGuide()` — Clear guide
  - `setCar(carId)` — Set car (or null for no car)
  - `clearCar()` — Clear car
  - `setPaymentOption(option)` — Set 'DP_50' or 'FULL'
  - `calculateTotal()` — Compute totalCost, guideFee, carFee, entryFees, timeline
  - `generateBooking()` — Create bookingId, save to IndexedDB, return booking object
  - `resetTrip()` — Clear all selections
  - `loadFromIndexedDB()` — Recover state on app init

- State:
  - `selectedDestinations: []`
  - `selectedGuide: null`
  - `selectedCar: null`
  - `selectedPaymentOption: null`
  - `totalCost: 0`
  - `guideFee: 0`
  - `carFee: 0`
  - `entryFees: []`
  - `timeline: []`
  - `bookingId: null`

**Important:** Use Zustand `persist` middleware to auto-save to IndexedDB on every state change.

**Reference:** API_SPEC.md Section 2.1, RULES.md Section "Contract-First Development"

**Done Criteria:**
- [ ] `src/stores/tripStore.js` exports `useTrip()` hook
- [ ] Hook used in component: `const store = useTrip();` works without errors
- [ ] `addDestination('dest_001')` → selectedDestinations includes dest_001
- [ ] Max 3 destinations enforced (4th add is ignored or throws error)
- [ ] `setGuide('guide_001')` → selectedGuide = 'guide_001'
- [ ] `calculateTotal()` computes correct sum
- [ ] State persists to IndexedDB on every mutation
- [ ] `loadFromIndexedDB()` recovers state on app reload
- [ ] Tested: Add destination, close DevTools, refresh page → destination still selected

**Commit Format:**
```
[PHASE-1] Task 1.5: Implement Zustand trip store with persist middleware
```

---

### Task 1.6: Implement Zustand UI Store

**What to Build:**
- File: `src/stores/uiStore.js`
- Simple store for UI state:
  - `isOnline: true` (updated by window.addEventListener)
  - `isLoading: false`
  - `error: null`
  - `successMessage: null`
- Actions:
  - `setOnline(bool)`
  - `setLoading(bool)`
  - `setError(message)`
  - `clearError()`
  - `setSuccess(message)`
  - `clearSuccess()`

**Reference:** API_SPEC.md Section 2.2

**Done Criteria:**
- [ ] `src/stores/uiStore.js` exports `useUI()` hook
- [ ] `setError('Pilih destinasi')` → error = 'Pilih destinasi'
- [ ] `clearError()` → error = null
- [ ] Window online/offline listeners work (test: DevTools > Network > Offline toggle)
- [ ] `isOnline` toggles when connection changes

**Commit Format:**
```
[PHASE-1] Task 1.6: Implement Zustand UI store with online detection
```

---

### Task 1.7: Set Up IndexedDB Persistence Layer

**What to Build:**
- File: `src/utils/indexedDB.js`
- Functions:
  - `initDB()` — Create IndexedDB with 3 stores: sessionState, tripState, bookings
  - `saveSession(key, value)` — Save to sessionState (key = 'user')
  - `getSession(key)` — Retrieve from sessionState
  - `saveBooking(bookingId, booking)` — Save to bookings store
  - `getBooking(bookingId)` — Retrieve from bookings store
  - Error handling (quota exceeded, corrupted DB, etc.)

**Reference:** API_SPEC.md Section 3

**Done Criteria:**
- [ ] `initDB()` runs on app mount without errors
- [ ] `saveSession('user', {hasVisited: true})` → saves to IndexedDB
- [ ] `getSession('user')` → retrieves correctly
- [ ] DevTools → Application → IndexedDB shows 3 stores (sessionState, tripState, bookings)
- [ ] Manual test: saveSession, close DevTools, refresh page, getSession → returns same value
- [ ] No errors in console

**Commit Format:**
```
[PHASE-1] Task 1.7: Set up IndexedDB persistence layer with 3 stores
```

---

### Task 1.8: Create Utility Functions

**What to Build:**

**File 1: `src/utils/priceCalculations.js`**
```javascript
export function calculateGuideFee(guideId, guides) { ... }
export function calculateCarFee(carId, carRentals) { ... }
export function calculateEntryFees(destIds, destinations) { ... } // Returns array
export function calculateTotal(guideFee, carFee, entryFees) { ... }
export function calculateDP(totalCost, paymentOption) { ... } // Returns amount due now
```

**File 2: `src/utils/timelineEngine.js`**
```javascript
export function generateTimeline(destIds, destinations, transitMatrix) {
  // Returns array: [
  //   { step: 1, destination: 'Kawah Putih', arrivalTime: '08:00', duration: 90 },
  //   { step: 2, destination: 'Situ Patenggang', arrivalTime: '10:15', duration: 75 },
  //   ...
  // ]
  // Start time: 08:00
  // Arrival time = previous arrival + previous duration + transit time
}
```

**File 3: `src/utils/whatsappFormatter.js`**
```javascript
export function generateWhatsAppMessage(booking, destinations, guides, carRentals) {
  // Returns formatted message for WhatsApp
  // Handles null car (use "Kendaraan dari guide")
  // Formats costs with Indonesian locale
}
```

**File 4: `src/utils/validation.js`**
```javascript
export function validateDestinationSelection(destIds, destinations) { ... }
export function validateGuideSelection(guideId, guides) { ... }
export function validatePaymentOption(option) { ... }
export function validateBooking(booking) { ... }
// All throw Error if invalid
```

**Reference:** API_SPEC.md Sections 2.1–2.3, PRD Section 3

**Done Criteria:**
- [ ] All functions exist and export cleanly
- [ ] `calculateTotal(500000, 600000, [{amount: 50000}])` → 1150000 ✓
- [ ] `calculateDP(1000000, 'DP_50')` → 500000 ✓
- [ ] `calculateDP(1000000, 'FULL')` → 1000000 (or with 5% discount logic)
- [ ] `generateTimeline()` returns correct arrival times (08:00 + transit + duration)
- [ ] `generateWhatsAppMessage()` returns formatted string with Rp formatting
- [ ] Validation functions throw on invalid input
- [ ] No console errors

**Commit Format:**
```
[PHASE-1] Task 1.8: Create utility functions for calculations, timeline, and validation
```

---

### Task 1.9: Create Booking ID Generator

**What to Build:**
- File: `src/utils/bookingId.js`
- Function: `generateBookingId()` → Returns "BATOUR-" + 6 random alphanumeric (uppercase)
- Examples: "BATOUR-ABC123", "BATOUR-XY7Z9K"
- No sequential IDs (low collision risk)

**Reference:** API_SPEC.md Section 10.5

**Done Criteria:**
- [ ] `generateBookingId()` returns format `BATOUR-XXXXXX`
- [ ] All 6 characters are alphanumeric (0-9, A-Z)
- [ ] Uppercase only
- [ ] Multiple calls generate different IDs (test 100 calls, no duplicates)
- [ ] No console errors

**Commit Format:**
```
[PHASE-1] Task 1.9: Create booking ID generator (BATOUR-XXXXXX format)
```

---

## Quality Gate: Phase 1 Complete

Before marking Phase 1 as done, verify **all 9 tasks**:

```
✅ Task 1.1: destinations.json loads, 6-8 attractions, matches schema
✅ Task 1.2: guides.json loads, 3-5 guides, phone format correct
✅ Task 1.3: carRentals.json loads, sedan + van, 600k + 900k
✅ Task 1.4: transitMatrix.json loads, 4 zones, all routes defined
✅ Task 1.5: Zustand trip store works, state persists to IndexedDB
✅ Task 1.6: Zustand UI store works, online detection works
✅ Task 1.7: IndexedDB initialized, 3 stores created, persistence works
✅ Task 1.8: All utility functions work correctly
✅ Task 1.9: Booking ID generator produces valid IDs
```

**Final Verification:**
```bash
# Run build (should succeed)
npm run build
# Check for console errors (should be none)
npm run dev
# Open browser console, verify no errors
# Test IndexedDB (DevTools → Application → IndexedDB)
```

---

## Communication & Escalation

**Daily:**
- Update progress in CONTEXT.md (Section "Current Phase")
- Commit each completed task
- If blocked > 30 min: Ask in #dev-help (show error screenshot + root cause hypothesis)

**Weekly (Friday):**
- Summarize phase progress
- Identify risks for Phase 2

**Blocked?**
- Question: "I'm stuck on Task 1.7, IndexedDB not persisting"
- Show: File path, console error, what you tried
- Do not: Guess, try random solutions, move to next task

---

## Success Definition

Phase 1 is **DONE** when:
1. ✅ All 9 tasks complete (done criteria verified)
2. ✅ All data loads in browser console without errors
3. ✅ Zustand store + IndexedDB work together
4. ✅ No hardcoded values (use JSON data, config constants)
5. ✅ Code follows RULES.md (one task per commit, contract-first, modularity)
6. ✅ Ready to hand off to Phase 2 (React components)

---

## Resources

- **PRD:** `01_PRD.md` (user stories, constraints)
- **API Spec:** `02_API_SPEC.md` (exact data contracts)
- **Tasks:** `03_TASKS.md` (this checklist)
- **Context:** `04_CONTEXT.md` (team, stack, setup)
- **Rules:** `05_RULES.md` (execution discipline)

---

## Ready? Begin Phase 1 Execution

Start with **Task 1.1** (destinations.json). Verify done criteria. Commit. Move to Task 1.2.

Each task is atomic. No moving forward until done criteria are 100% verified.

**Estimated Time:** 8-10 hours for all 9 tasks (0.5 hrs per task avg, 1 hr per setup task)

**Go build.** 🚀

---

**Generated by VibeCODE** | May 14, 2026 | Ready for Development

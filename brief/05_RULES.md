# Anti-Waste & Execution Rules
## BaTour Development Discipline

**Purpose:** Prevent rework, token waste, and architectural drift  
**Enforcement:** Required for all commits  
**Version:** 1.0  
**Updated:** May 14, 2026

---

## Core Principles

### 1. One Objective Per Cycle
**Rule:** Each commit = exactly one task from TASKS.md

**Example ✅:**
```
[PHASE-1] Task 1.1: Create destinations.json with 6-8 attractions
```

**Example ❌:**
```
[PHASE-1] Create destinations, guides, and cars in one commit
```

**Why:** Atomic commits are reversible. One task per commit = one rollback per issue.

---

### 2. Contract-First Development
**Rule:** Verify data payloads before implementing UI

**Process:**
1. Read API_SPEC.md (exact JSON shapes)
2. Create mock JSON file (`src/data/destinations.json`)
3. Write component that consumes it (`import destinations from '...'`)
4. Test in browser console: `console.log(destinations[0])` — should match schema
5. THEN build UI component

**Example ✅:**
```javascript
// Step 1: Verify data loads
import destinations from '@/data/destinations.json';
console.log(destinations[0]); // { id: 'dest_001', name: 'Kawah Putih', ... }
// Output must match API_SPEC schema exactly

// Step 2: Build component
export function DestinationCard({ destination }) {
  return <div>{destination.name}</div>;
}
```

**Example ❌:**
```javascript
// Building component first without verifying data schema
export function DestinationCard({ dest }) {
  return <div>{dest.location.name}</div>; // Assumes nested location, not in schema!
}
```

**Why:** Prevents UI-data mismatches (the #1 cause of rework).

---

### 3. Agile Modularity
**Rule:** Extensible interfaces, pluggable modules, no hardcoding

**Hardcoded ❌:**
```javascript
// Bad: Payment types hardcoded in component
export function PaymentSelection() {
  const options = [
    { label: 'DP 50%', value: 'DP_50' },
    { label: 'Full', value: 'FULL' }
  ];
  return options.map(...);
}
```

**Pluggable ✅:**
```javascript
// Good: Payment types come from config/store
const PAYMENT_TYPES = {
  DP_50: { label: 'DP 50%', percentage: 0.5 },
  FULL: { label: 'Full', percentage: 1.0 }
};

export function PaymentSelection() {
  return Object.entries(PAYMENT_TYPES).map(([key, val]) => ...);
}
```

**Why:** Phase 2 adds installment payment → only edit `PAYMENT_TYPES`, not component.

---

### 4. Root-Cause Proof
**Rule:** Show file/line/field before patching bugs

**Example ✅:**
```
Bug: Total cost showing as NaN
Root Cause: entryFees is undefined in tripStore calculateTotal()
Fix: Add fallback: entryFees || []
File: src/utils/priceCalculations.js, line 12
```

**Example ❌:**
```
Bug: Total cost showing as NaN
Fix: Changed calculation logic
```

**Why:** Prevents same bug recurring (team learns the real cause).

---

### 5. Limit Exploration
**Rule:** Max 2 read passes before asking for guidance

**Example ✅:**
- Read PRD.md once to understand requirements
- Read API_SPEC.md once to understand data shapes
- Ask question: "Where should the transit matrix be used in timeline calculation?"

**Example ❌:**
- Read PRD 3 times
- Read API_SPEC 2 times
- Read TASKS 2 times
- Try guessing instead of asking

**Why:** Prevents analysis paralysis (waste tokens, waste time).

---

### 6. Verify Immediate
**Rule:** Backend contracts first, then frontend

**Process:**
1. Create JSON data file (`destinations.json`)
2. Test in browser console: does it load, parse correctly?
3. ONLY THEN build component

**Example ✅:**
```javascript
// First: Verify data loads
fetch('http://localhost:5173/data/destinations.json')
  .then(r => r.json())
  .then(d => console.log(d[0])); // { id, name, ... }

// Second: Build component
export function DestinationList({ destinations }) {
  return destinations.map(d => <DestinationCard key={d.id} dest={d} />);
}
```

**Example ❌:**
```javascript
// Build component hoping data shape is correct
export function DestinationList({ destinations }) {
  return destinations.map(d => <DestinationCard dest={d} />);
}
// Later: TypeError: Cannot read 'id' of undefined
```

**Why:** Catches 80% of bugs at source, before UI.

---

### 7. Delta Logging
**Rule:** CONTEXT.md updates are incremental only

**After Phase 1 Complete ✅:**
```markdown
## Current Phase: Phase 2 - React Components & Routes

**Duration:** 2 weeks  
**Goal:** Build all route components  
**Exit Criteria:** All routes render, state flows correctly  
**Next Phase:** Phase 3 - Polish & Testing

**Status Update (May 21):**
- ✅ Phase 1 complete: All JSON data created, Zustand store working
- IndexedDB persisting correctly (tested manual refresh)
- Utility functions unit tested (100% coverage)
```

**Don't Do ❌:**
```markdown
## Current Phase: Phase 1 (rewriting entire CONTEXT.md from scratch)
```

**Why:** Prevents losing historical context (and wastes tokens).

---

## File Structure Rules

### Features by Domain (Not by Layer)
```
src/
├── components/
│   ├── destination/
│   │   ├── DestinationCard.jsx
│   │   ├── DestinationSearch.jsx
│   │   └── DestinationCategories.jsx
│   ├── guide/
│   │   ├── GuideCard.jsx
│   │   └── GuideSelector.jsx
│   ├── common/
│   │   ├── Button.jsx
│   │   └── Card.jsx
```

**Not like this ❌:**
```
src/
├── components/
│   ├── cards/
│   │   ├── DestinationCard.jsx
│   │   ├── GuideCard.jsx
│   ├── selectors/
│   │   ├── DestinationSelector.jsx
│   │   ├── GuideSelector.jsx
```

**Why:** Domain grouping scales better (find all destination code in one folder).

---

### Shared Code (Extract After 3+ Uses)
```javascript
// First usage: In DestinationCard.jsx
function formatPrice(amount) {
  return new Intl.NumberFormat('id-ID', { currency: 'IDR' }).format(amount);
}

// Second usage: In GuideCard.jsx — copy paste OK

// Third usage: In CarTypeCard.jsx — NOW extract to shared
// Create: src/utils/formatting.js
export { formatPrice };

// Import in all 3 components
import { formatPrice } from '@/utils/formatting';
```

**Why:** Speculative extraction wastes code (YAGNI principle).

---

### Types & Constants (Colocate with Implementation)
```javascript
// src/stores/tripStore.js
export const TRIP_STATUS = {
  BUILDING: 'building',
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed'
};

export const useTrip = create(
  persist((set) => ({ ... }))
);
```

**Not like this ❌:**
```
src/
├── types/
│   └── trip.ts
├── constants/
│   └── tripStatus.ts
├── stores/
│   └── tripStore.js
```

**Why:** Reduces file fragmentation (easier to find & modify related code).

---

### Tests Adjacent to Code
```
src/
├── utils/
│   ├── priceCalculations.js
│   ├── priceCalculations.test.js  ← test same folder
├── components/
│   ├── Button.jsx
│   ├── Button.test.jsx  ← test same folder
```

**Not like this ❌:**
```
src/
tests/
├── priceCalculations.test.js
├── Button.test.jsx
```

**Why:** Easier to find tests when modifying code.

---

## Git Commit Rules

### Format
```
[PHASE-X] Task X.Y: Brief description
```

**Examples:**
```
[PHASE-1] Task 1.1: Create destinations.json with 6 attractions
[PHASE-1] Task 1.5: Implement Zustand trip store with persist
[PHASE-2] Task 2.4: Build destination explorer with search
[PHASE-3] Task 3.2: Optimize images and bundle size
```

### Atomic Commits
**Rule:** Each commit must pass all tests and build successfully

```bash
# Good: Each commit is independent
git log --oneline
c3f9a2e [PHASE-2] Task 2.5: Add guide selection component
a1b2c3e [PHASE-2] Task 2.4: Build destination explorer
9d8e7f6 [PHASE-1] Task 1.5: Implement Zustand store

# BAD: Broken state in middle
git log --oneline
x1y2z3a [PHASE-2] Task 2.5: Add guide selection (BROKEN - tests fail)
b4c5d6e [PHASE-2] Task 2.4: Build destination explorer
a7b8c9d [PHASE-1] Task 1.5: Implement Zustand store
```

### Reference Task Checkbox
```
[PHASE-1] Task 1.1: Create destinations.json

Closes #1 (destinations data)
Implements TASKS.md Task 1.1
- [x] destinations.json created
- [x] 6-8 destinations with required fields
- [x] Images < 100KB
- [x] Validated against API_SPEC
```

---

## Testing Rules

### Unit Tests
**Location:** `src/__tests__/[name].test.js`  
**Scope:** Utility functions, data transforms, business logic  
**Target:** 100% coverage for utils

```javascript
import { describe, it, expect } from 'vitest';
import { calculateTotal } from '@/utils/priceCalculations';

describe('priceCalculations', () => {
  it('should calculate total with all fees', () => {
    expect(calculateTotal(500000, 600000, [{ destinationId: 'dest_001', amount: 50000 }]))
      .toBe(1150000);
  });

  it('should handle zero car fee', () => {
    expect(calculateTotal(500000, 0, [{ destinationId: 'dest_001', amount: 50000 }]))
      .toBe(550000);
  });

  it('should handle empty entry fees', () => {
    expect(calculateTotal(500000, 600000, []))
      .toBe(1100000);
  });
});
```

### Integration Tests
**Scope:** Store mutations + IndexedDB, Route navigation, API contracts  
**Example:**
```javascript
it('should save trip state to IndexedDB on destination add', async () => {
  const store = useTrip();
  store.addDestination('dest_001');
  
  // Verify IndexedDB
  const saved = await getFromIndexedDB('current-trip');
  expect(saved.selectedDestinations).toContain('dest_001');
});
```

### E2E Tests (Phase 4)
**Scope:** Critical user journeys only (landing → checkout)  
**Tool:** Playwright or Cypress  
**Example:**
```javascript
test('Complete booking flow', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.click('text=Mulai Eksplorasi');
  await page.click('[data-testid="dest-kawah-putih"]');
  // ... continue flow
});
```

---

## When to Ask

✅ **Ask if:**
| Question | Example |
|----------|---------|
| Architecture decision | "Should we add a middleware layer for data transforms?" |
| Scope ambiguity | "Does /active-trip need real-time guide location?" |
| Blocking > 30 min | "Console error on mount, can't figure out why IndexedDB not persisting" |
| Phase transition | "Is Phase 1 complete enough to start Phase 2?" |

❌ **Don't ask if:**
| Question | Why |
|----------|-----|
| Component styling | Read Tailwind docs, it's flexible |
| Why test failed | Debug in DevTools, read error message |
| How to use Zustand | Read vite-plugin-pwa docs, examples provided |
| Specific file paths | Check CONTEXT.md file structure |

---

## Performance Regression Prevention

**Before Each Commit:**
```bash
npm run build
# Check bundle size
ls -lh dist/assets/*.js

# Check Lighthouse locally
npm run preview
# DevTools → Lighthouse → Performance (target ≥ 80)
```

**If Bundle Grows:**
1. Identify what changed (git diff)
2. Check dependencies (npm ls)
3. Consider code-splitting or deferring to Phase 2
4. Ask if growth is acceptable (Product Owner call)

---

## Accessibility Checklist (Per Component)

- [ ] Keyboard navigable (Tab key)
- [ ] Focus visible (outline, not hidden)
- [ ] Color contrast ≥ 4.5:1 (check with WebAIM)
- [ ] Alt text on images
- [ ] ARIA labels on icon buttons
- [ ] Form labels associated (label + input id)

**Test Command:**
```bash
# Install axe browser extension (Chrome/Firefox)
# Click axe icon, scan page, fix violations
```

---

## Security Checklist (Per Component)

- [ ] No payment data stored (use WhatsApp handoff)
- [ ] No authentication tokens (not in MVP)
- [ ] Input sanitized (regex validation before store)
- [ ] No XSS vectors (React escapes by default, but verify with Content Inspector)
- [ ] No hardcoded API keys (use Vercel environment variables)

---

## Common Anti-Patterns

### ❌ Prop Drilling
```javascript
// Bad: Passing props through 5 components
<Grandparent selectedDestinations={...} />
  <Parent selectedDestinations={...} />
    <Child selectedDestinations={...} />
```

**✅ Use Zustand Store Instead:**
```javascript
// Component A
const { selectedDestinations } = useTrip();

// Component B (5 levels down)
const { selectedDestinations } = useTrip();
```

### ❌ Computed State in Components
```javascript
// Bad: Calculating total on every render
export function BookingDetails() {
  const { guideFee, carFee, entryFees } = useTrip();
  const total = guideFee + carFee + entryFees.reduce(...); // Recomputed!
  return <div>{total}</div>;
}
```

**✅ Pre-Compute in Store:**
```javascript
// Store computes once, memoizes
const useTrip = create((set) => ({
  totalCost: 0,
  calculateTotal: () => set((state) => ({
    totalCost: state.guideFee + state.carFee + ...
  }))
}));

// Component just reads
export function BookingDetails() {
  const { totalCost } = useTrip();
  return <div>{totalCost}</div>;
}
```

### ❌ Missing Error Boundaries
```javascript
// Bad: No error handling
export function DestinationCard({ destination }) {
  return <div>{destination.name}</div>; // Crashes if destination is null
}
```

**✅ Validate & Handle:**
```javascript
export function DestinationCard({ destination }) {
  if (!destination) return <p>Destination not found</p>;
  return <div>{destination.name}</div>;
}
```

---

## Code Review Checklist

**Before Approving PR:**
- [ ] One task per commit (referenced in message)
- [ ] Done Criteria met (manual verification)
- [ ] No console errors/warnings
- [ ] Follows file structure rules
- [ ] Passes linting (npm run lint)
- [ ] Tests included (if applicable)
- [ ] No hardcoded values (use config/constants)
- [ ] Accessibility met (if UI component)
- [ ] Performance budget respected (npm run build)

---

## Failure Recovery

### If Test Suite Fails
1. Run locally: `npm test`
2. Identify failed test
3. Check file/line number (show root cause)
4. Fix issue
5. Re-run: `npm test`
6. Commit: `[PHASE-X] Task X.Y: Fix test [reason]`

### If Lighthouse Score Drops
1. Run: `npm run preview` + DevTools Lighthouse
2. Identify bottleneck (image, JS, CSS)
3. Check bundle size: `ls -lh dist/assets/`
4. Defer if not critical → "Phase 2 optimization"
5. Document in commit

### If IndexedDB Fails
1. Open DevTools → Application → IndexedDB
2. Check db.version, stores, data
3. Verify Zustand persist middleware configured
4. Test manually: `const data = await getFromIndexedDB('current-trip')`
5. Clear cache (hard refresh), re-test

---

## Success Criteria Summary

| Deliverable | Success = |
|-------------|-----------|
| **Code Quality** | No linting errors, 100% of review checklist |
| **Testing** | Tests pass locally, coverage ≥ 50% |
| **Performance** | Bundle < 300KB gzipped, Lighthouse ≥ 80 |
| **Accessibility** | No WCAG violations, keyboard navigable |
| **Documentation** | Task marked complete in TASKS.md, commit message clear |

---

**Last Updated:** May 14, 2026  
**Version:** 1.0 (VibeCODE Generation)

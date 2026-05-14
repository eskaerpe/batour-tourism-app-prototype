# Project Context: BaTour
## Current State & Key Decisions

**Project Name:** BaTour - Personal Travel Assistant for Bandung  
**Stack:** React 18 + Vite + React Router + Zustand + Tailwind CSS  
**Deployment:** Vercel (Static Site)  
**Status:** Ready for Development (Phase 1 Kickoff)  
**Last Updated:** May 14, 2026

---

## Key Architectural Decisions

### 1. Front-End Only MVP (Zero Backend)
- ✅ **Decision:** All logic runs client-side
- ✅ **Rationale:** Speed to market, zero deployment complexity
- ✅ **Trade-Off:** WhatsApp handoff instead of real payment processing
- ✅ **Phase 2 Path:** Swap WhatsApp for Midtrans/Xendit without UI changes

### 2. Static JSON Data (No Database)
- ✅ **Decision:** Destinations, guides, cars, transit matrix bundled as JSON
- ✅ **Rationale:** Immutable during session, zero sync issues
- ✅ **Trade-Off:** Data updates require app rebuild
- ✅ **Phase 2 Path:** Replace with REST API endpoints (same component interface)

### 3. IndexedDB for Trip State (Not Server)
- ✅ **Decision:** User's trip-building session persists locally
- ✅ **Rationale:** Works offline, survives page refresh
- ✅ **Trade-Off:** Data lost if browser cache cleared
- ✅ **Phase 2 Path:** Sync to Firestore on login

### 4. Zustand (Not Redux)
- ✅ **Decision:** Lightweight state management with persist middleware
- ✅ **Rationale:** Simpler API, smaller bundle, faster dev
- ✅ **Trade-Off:** DevTools less mature than Redux
- ✅ **Phase 2 Path:** If complexity grows, move to Redux (unlikely)

### 5. Tailwind CSS (Not CSS-in-JS)
- ✅ **Decision:** Utility-first, pre-compiled CSS
- ✅ **Rationale:** Fast development, minimal bundle, design consistency
- ✅ **Trade-Off:** Class-heavy markup (mitigated by components)
- ✅ **Phase 2 Path:** If needed, add CSS Modules (no conflict)

### 6. Service Worker Precaching (vite-plugin-pwa)
- ✅ **Decision:** Preload all critical assets at build time
- ✅ **Rationale:** 100% offline availability on /active-trip
- ✅ **Trade-Off:** Larger initial cache, slower first load (mitigated by Vercel CDN)
- ✅ **Phase 2 Path:** Upgrade to background sync (trip updates)

---

## Current Phase: Phase 1 - Data Layer & State Management

**Duration:** 2 weeks  
**Goal:** Build foundation (JSON data, Zustand stores, IndexedDB)  
**Exit Criteria:**
- All data loads correctly
- Trip store works in isolation
- IndexedDB persists/recovers state
- Utilities tested

**Next Phase:** Phase 2 - React Components & Routes

---

## Team Roles & Responsibilities

| Role | Responsibility | Blocking? |
|------|-----------------|-----------|
| **Frontend Engineer** | Implement all components, stores, utilities | Yes |
| **QA Engineer** | Test flows, offline mode, edge cases | Yes |
| **UX Designer** | Provide Figma designs, review component output | No |
| **Product Owner** | Approve requirements, resolve ambiguities | Yes |
| **DevOps** | Vercel setup, monitoring, CI/CD | Yes (Phase 4) |

---

## Communication & Escalation

### Daily Standup
- **Time:** 10:00 AM (UTC+7 Bandung time)
- **Duration:** 15 minutes
- **Agenda:** Blockers, completion % per task, help needed
- **Format:** Async OK (Slack thread if no sync meeting)

### Weekly Sync
- **Time:** Friday 2:00 PM
- **Duration:** 30 minutes
- **Agenda:** Phase progress, risks, next week plan

### Blockers
- **Criteria:** >30 minutes blocked on same issue
- **Escalation:** Ask in #dev-help Slack channel
- **Response Time:** < 1 hour expected (Product Owner on call)

---

## Development Environment Setup

### Prerequisites
```bash
Node 18+ (use nvm)
Git (GitHub account with SSH key)
Code editor (VS Code recommended)
```

### Local Development
```bash
git clone https://github.com/[org]/batour-react.git
cd batour-react
npm install
npm run dev       # Start Vite dev server (http://localhost:5173)
npm run build     # Production build
npm run preview   # Test production build locally
```

### Git Workflow
1. Create feature branch: `feature/1.1-destination-data`
2. Commit format: `[PHASE-1] Task 1.1: Create destination data`
3. Push and open Pull Request with task reference
4. Code review (1 approval required)
5. Merge to `main` → Auto-deploy to staging
6. `main` always deployable (no broken features)

---

## Code Standards

### File Structure
```
src/
├── components/
│   ├── common/
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   └── ...
│   ├── destination/
│   │   ├── DestinationCard.jsx
│   │   └── ...
│   └── [domain]/
├── pages/
│   ├── Landing.jsx
│   └── ...
├── stores/
│   ├── tripStore.js
│   └── uiStore.js
├── utils/
│   ├── priceCalculations.js
│   ├── validation.js
│   └── ...
├── data/
│   ├── destinations.json
│   ├── guides.json
│   └── ...
├── App.jsx
└── main.jsx
```

### JavaScript / React
- **Language:** ES2020+ (no IE11 support)
- **Format:** Prettier (auto-format on save)
- **Linting:** ESLint (no errors in PR)
- **Comments:** JSDoc for complex functions, inline comments for why (not what)

**Example:**
```javascript
/**
 * Calculate total cost of trip
 * @param {number} guideFee - Daily guide rate
 * @param {number} carFee - Daily car rental (0 if no car)
 * @param {array} entryFees - Array of {destinationId, amount}
 * @returns {number} Total in Rupiah
 */
export function calculateTotal(guideFee, carFee, entryFees) {
  // Sum all fees (guide is per-day, assumed 1 day for MVP)
  return guideFee + carFee + entryFees.reduce((sum, f) => sum + f.amount, 0);
}
```

### CSS / Tailwind
- **No custom CSS** unless absolutely necessary (use Tailwind utilities)
- **Color palette:** Orange (#ec5b13), white, gray scale
- **Spacing scale:** Tailwind defaults (4px increments)
- **Responsive:** Mobile-first (base styles, then `sm:`, `md:`, `lg:` breakpoints)

**Example:**
```jsx
<button className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50">
  Mulai Eksplorasi
</button>
```

---

## Testing Strategy

### Unit Tests (Phase 3)
- **Location:** `src/__tests__/[name].test.js`
- **Framework:** Vitest (same as Vite)
- **Coverage Target:** 100% for utils, 50%+ for components
- **Run:** `npm run test`

**Example:**
```javascript
import { describe, it, expect } from 'vitest';
import { calculateTotal } from '@/utils/priceCalculations';

describe('priceCalculations', () => {
  it('should sum guide fee, car fee, and entry fees', () => {
    const result = calculateTotal(500000, 600000, [{ destinationId: 'dest_001', amount: 50000 }]);
    expect(result).toBe(1150000);
  });
});
```

### Integration Tests (Phase 3)
- Test Zustand store mutations + IndexedDB save/load
- Test route navigation with state persistence
- Test offline mode (DevTools > Application > Service Workers)

### E2E Tests (Phase 4)
- Test critical path: Landing → Explore → Guide → Car → Booking → Payment → Confirmation
- Tools: Playwright or Cypress (TBD)

---

## Performance Budgets

| Category | Budget | Tool |
|----------|--------|------|
| JavaScript | < 150KB (gzipped, main + async chunks) | webpack-bundle-analyzer |
| CSS | < 50KB (gzipped) | Lighthouse |
| Images | < 3MB total (precached) | du -sh public/images/ |
| FCP | < 1.5s | Lighthouse (3G throttle) |
| LCP | < 2.5s | Lighthouse (3G throttle) |
| CLS | < 0.1 | Lighthouse |

**If budget exceeded:** Profile with Lighthouse, identify bottleneck, defer to Phase 2.

---

## Monitoring & Observability

### Errors (Sentry)
```javascript
// Captured automatically
try {
  // risky code
} catch (error) {
  Sentry.captureException(error);
}
```

### Custom Events (Vercel Analytics)
```javascript
import { trackEvent } from '@/utils/analytics';

// Track itinerary completion
trackEvent('itinerary_completed', {
  destinationCount: 3,
  guideId: 'guide_001',
  carSelected: true,
});
```

### Metrics Dashboards
- **Vercel Analytics:** Page views, FCP/LCP trends, user geo
- **Sentry:** Error rate, top errors, browser breakdown
- **Google Analytics (if needed):** Funnel analysis (landing → explore → checkout)

---

## Common Issues & Solutions

### Issue: IndexedDB quota exceeded
**Root Cause:** Too many bookings or large data stored  
**Solution:** Implement booking archive (move old bookings to localStorage, then delete)  
**Prevention:** Monitor quota in browser DevTools

### Issue: Service Worker cache stale
**Root Cause:** Old assets cached, new version not installed  
**Solution:** Hard refresh (Cmd+Shift+R) to clear cache  
**Prevention:** Versioning automatic via vite-plugin-pwa, hash in filename

### Issue: WhatsApp deep link not opening on iOS
**Root Cause:** Security restriction, or WhatsApp not installed  
**Solution:** Fallback to manual link copy  
**Prevention:** Test on real device (Safari iOS)

### Issue: Zustand state not persisting to IndexedDB
**Root Cause:** Persist middleware not configured  
**Solution:** Verify `persist()` middleware in tripStore.js  
**Prevention:** Test IndexedDB in DevTools after every store change

---

## When to Ask for Help

✅ **Ask immediately if:**
- Architecture decision needed (new dependency, file structure)
- Scope creep (work not in TASKS.md)
- Blocked > 30 min on same issue
- Ambiguity in PRD or API_SPEC

❌ **Don't ask for:**
- Component styling (use Tailwind, it's flexible)
- Minor bugs (debug with console, DevTools)
- Clarifications you can resolve with 5 min reading (docs)

---

## Definition of Done

A task is complete when:
1. ✅ Code written & tested locally
2. ✅ Done Criteria met (verified manually)
3. ✅ No console errors/warnings
4. ✅ Code reviewed (1 approval)
5. ✅ Committed with proper format
6. ✅ Merged to `main`
7. ✅ Deployed to staging (auto via Vercel)
8. ✅ Marked complete in TASKS.md

---

## Deployment Pipeline

```
Commit to main (GitHub)
    ↓
GitHub Actions (linting, build test)
    ↓
Vercel auto-build (staging)
    ↓
QA smoke test (manual on staging.vercel.app)
    ↓
Manual promote to production (via Vercel dashboard or main trigger)
    ↓
Analytics + monitoring active
    ↓
Ready for next phase / launch
```

**Rollback:** Revert commit, push to main → Vercel auto-redeploys previous version.

---

## Useful Links & Resources

- **PRD:** `01_PRD.md`
- **API Spec:** `02_API_SPEC.md`
- **Tasks:** `03_TASKS.md`
- **Vercel Dashboard:** https://vercel.com/dashboard
- **React Router Docs:** https://reactrouter.com
- **Zustand Docs:** https://github.com/pmndrs/zustand
- **Tailwind Docs:** https://tailwindcss.com/docs
- **PWA Plugin:** https://vite-pwa-org.netlify.app/

---

**Document Control:**
- **Created:** May 14, 2026
- **Revision:** 1.0
- **Distribution:** Engineering, QA, Product teams

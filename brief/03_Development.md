# Development Workflow & Implementation Guide
# BaTour Sprint-Ready Specifications

**Version:** 1.0.0  
**Status:** Implementation Ready  
**Last Updated:** May 2026

---

## 1. Project Setup & Dependencies

### 1.1 Initial Setup

```bash
# Create Vite + React project
npm create vite@latest batour-react -- --template react

cd batour-react

# Install core dependencies
npm install react react-dom react-router-dom zustand
npm install tailwindcss postcss autoprefixer
npm install axios qrcode.react date-fns
npm install dompurify
npm install vite-plugin-pwa workbox-window

# Install dev dependencies
npm install -D vite @vitejs/plugin-react
npm install -D tailwindcss @tailwindcss/forms @tailwindcss/typography
npm install -D eslint eslint-plugin-react eslint-plugin-react-hooks
npm install -D prettier
npm install -D @testing-library/react @testing-library/jest-dom vitest
npm install -D vite-plugin-compression

# Initialize Git
git init
git add .
git commit -m "init: BaTour React MVP setup"
```

### 1.2 NPM Scripts

**`package.json`:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext js,jsx",
    "lint:fix": "eslint src --ext js,jsx --fix",
    "format": "prettier --write \"src/**/*.{js,jsx,json,css}\"",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "audit": "lighthouse https://localhost:3000 --view",
    "serve": "vite preview --host"
  }
}
```

---

## 2. File Structure & Organization

### 2.1 Complete Project Tree

```
batour-react/
├── public/
│   ├── icons/
│   │   ├── icon-192.png           # PWA icon (192x192)
│   │   └── icon-512.png           # PWA icon (512x512)
│   ├── images/
│   │   ├── destinations/
│   │   │   ├── kawah-putih.webp
│   │   │   ├── situ-patenggang.webp
│   │   │   └── ... (8 total)
│   │   ├── guides/
│   │   │   ├── budi.webp
│   │   │   ├── siti.webp
│   │   │   └── ahmad.webp
│   │   ├── vehicles/
│   │   │   ├── car.webp
│   │   │   └── van.webp
│   │   ├── curated/
│   │   │   ├── ciwidey-escape.webp
│   │   │   ├── lembang-family.webp
│   │   │   └── sunrise.webp
│   │   ├── bandung-hero.webp
│   │   └── placeholder.webp
│   └── manifest.json              # PWA manifest
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── SkeletonLoader.jsx
│   │   │   ├── OfflineIndicator.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── index.js             # Barrel export
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── MobileBottomNav.jsx
│   │   │   └── Layout.jsx
│   │   ├── onboarding/
│   │   │   ├── HeroSection.jsx
│   │   │   ├── ValuePropOverlay.jsx
│   │   │   └── HeroImage.jsx
│   │   ├── explore/
│   │   │   ├── SearchBar.jsx
│   │   │   ├── CategoryPills.jsx
│   │   │   ├── DestinationCard.jsx
│   │   │   ├── DestinationGrid.jsx
│   │   │   ├── StickyHeader.jsx
│   │   │   └── BreadcrumbNav.jsx
│   │   ├── itinerary/
│   │   │   ├── VehicleSelector.jsx
│   │   │   ├── GuideCard.jsx
│   │   │   ├── GuideList.jsx
│   │   │   ├── TimelineVisualization.jsx
│   │   │   ├── TimelineStep.jsx
│   │   │   ├── ItineraryHeader.jsx
│   │   │   └── FixedBottomActionBar.jsx
│   │   ├── checkout/
│   │   │   ├── CostBreakdownCard.jsx
│   │   │   ├── PaymentOptionSelector.jsx
│   │   │   ├── TrustBadges.jsx
│   │   │   ├── ReviewCard.jsx
│   │   │   └── WhatsAppCheckoutButton.jsx
│   │   └── trip/
│   │       ├── GuideContactCard.jsx
│   │       ├── InteractiveTimeline.jsx
│   │       ├── QRTicket.jsx
│   │       ├── TripHeader.jsx
│   │       └── EmergencyFooter.jsx
│   ├── pages/
│   │   ├── OnboardingPage.jsx
│   │   ├── ExplorePage.jsx
│   │   ├── BuildItineraryPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── ActiveTripPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── data/
│   │   ├── destinations.json
│   │   ├── guides.json
│   │   ├── vehicles.json
│   │   ├── transitMatrix.json
│   │   ├── curatedTrips.json
│   │   └── mockBookings.json
│   ├── hooks/
│   │   ├── useTripStore.js
│   │   ├── useOnline.js
│   │   ├── useDebounce.js
│   │   ├── useTimelineCalculation.js
│   │   └── usePWA.js
│   ├── stores/
│   │   ├── tripStore.js
│   │   └── appStore.js
│   ├── utils/
│   │   ├── timelineEngine.js
│   │   ├── costCalculator.js
│   │   ├── whatsappFormatter.js
│   │   ├── validateData.js
│   │   ├── storage.js
│   │   └── deviceDetection.js
│   ├── services/
│   │   ├── dataService.js
│   │   ├── storageService.js
│   │   └── analyticsService.js
│   ├── styles/
│   │   ├── globals.css
│   │   ├── animations.css
│   │   └── tailwind.css
│   ├── App.jsx
│   ├── main.jsx
│   └── vite-env.d.ts
├── .github/
│   └── workflows/
│       └── deploy.yml
├── .eslintrc.cjs
├── .prettierrc.json
├── tailwind.config.js
├── vite.config.js
├── vercel.json
├── tsconfig.json
├── vitest.config.js
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

## 2.2 Barrel Exports Pattern

**`src/components/common/index.js`:**
```javascript
export { Button } from './Button';
export { Card } from './Card';
export { Badge } from './Badge';
export { SkeletonLoader } from './SkeletonLoader';
export { OfflineIndicator } from './OfflineIndicator';
export { Modal } from './Modal';
```

**Usage (cleaner imports):**
```javascript
// ❌ Without barrel
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

// ✅ With barrel
import { Button, Card, Badge } from '../components/common';
```

---

## 3. Sprint Planning Template

### Sprint 0: Setup & Infrastructure (3-4 days)
**Goal:** Project scaffolding, tooling, and design system foundation

**Tasks:**
- [ ] Create Vite + React project
- [ ] Configure Tailwind CSS
- [ ] Setup ESLint + Prettier
- [ ] Create Zustand store structure
- [ ] Setup Vercel project
- [ ] Configure GitHub Actions
- [ ] Create all common components (Button, Card, Badge, etc.)
- [ ] Setup design tokens in Tailwind config
- [ ] Create mock data files (destinations.json, guides.json, etc.)
- [ ] Implement offline detection hook

**Definition of Done:**
- All config files committed
- Common components working with Storybook stories
- Mock data valid against schema
- CI/CD pipeline green

---

### Sprint 1: Onboarding & Explore (5-6 days)
**Goal:** Landing page and destination discovery

**Tasks:**
- [ ] OnboardingPage component + route
- [ ] HeroSection with image lazy loading
- [ ] ExplorePage with full destination list
- [ ] Search functionality (debounced)
- [ ] Category filtering
- [ ] DestinationCard component
- [ ] Navigation setup (React Router)
- [ ] Mobile responsive testing
- [ ] Add to trip functionality (Zustand integration)
- [ ] Unit tests for search/filter logic

**Definition of Done:**
- OnboardingPage → ExplorePage flow works
- 8 destinations load and render
- Search + filter functional
- Mobile tested on 2 devices
- All routes accessible

---

### Sprint 2: Trip Builder (5-6 days)
**Goal:** Itinerary configuration with timeline visualization

**Tasks:**
- [ ] BuildItineraryPage setup
- [ ] VehicleSelector component
- [ ] GuideList with GuideCard components
- [ ] TimelineEngine (pure function)
- [ ] TimelineVisualization component
- [ ] Cost calculation logic
- [ ] FixedBottomActionBar
- [ ] Query param handling (?destinations=...)
- [ ] Edit/remove destinations
- [ ] Integration tests for timeline math

**Definition of Done:**
- All 3 guides selectable
- 2 vehicles selectable
- Timeline calculates correctly
- Real-time cost updates
- Page responsive on mobile/desktop

---

### Sprint 3: Checkout & Offline (5-6 days)
**Goal:** Payment handoff and offline-first trip access

**Tasks:**
- [ ] CheckoutPage layout
- [ ] CostBreakdownCard
- [ ] PaymentOptionSelector (DP_50 vs FULL)
- [ ] TrustBadges component
- [ ] WhatsAppCheckoutButton
- [ ] Generate WhatsApp payload (URL encoding)
- [ ] Save booking to IndexedDB
- [ ] Service Worker setup (vite-plugin-pwa)
- [ ] ActiveTripPage route
- [ ] GuideContactCard
- [ ] InteractiveTimeline (time-based highlighting)
- [ ] QRTicket generation
- [ ] Offline mode testing

**Definition of Done:**
- Full trip booking flow works
- WhatsApp link generation correct
- Booking saved and retrievable from IndexedDB
- /active-trip/:id accessible 100% offline
- Service Worker precaching verified

---

### Sprint 4: Polish & Launch (3-4 days)
**Goal:** Performance, accessibility, monitoring

**Tasks:**
- [ ] Lighthouse audit (target 80+ all metrics)
- [ ] Image optimization (WebP + fallback)
- [ ] Bundle size analysis (< 300KB gzipped)
- [ ] PWA manifest finalized
- [ ] Accessibility audit (axe DevTools)
- [ ] Error boundary component
- [ ] Sentry integration
- [ ] Google Analytics tracking
- [ ] E2E test scenarios
- [ ] Product review feedback incorporation
- [ ] Final QA on 5+ devices
- [ ] Deploy to production (Vercel)

**Definition of Done:**
- Lighthouse: 80+ performance, 95+ accessibility
- All critical flows tested on mobile
- Error tracking live
- Analytics events firing
- Zero console errors
- Live at https://batour.vercel.app

---

## 4. Development Workflow

### 4.1 Feature Branch Workflow

```bash
# Update main
git checkout main
git pull origin main

# Create feature branch
git checkout -b feat/search-functionality

# Make changes
npm run dev          # Watch mode
npm run lint:fix     # Auto-fix linting
npm run test         # Run tests

# Commit changes
git add .
git commit -m "feat: Add debounced search to explore page"

# Push and create PR
git push origin feat/search-functionality

# On GitHub: Create Pull Request
# → CI/CD runs automatically
# → Request review
# → Merge when approved
```

### 4.2 Commit Message Convention

**Format:** `<type>(<scope>): <subject>`

```
feat(explore): add search bar component
fix(itinerary): correct timeline calculation for transit
docs(api): update data contracts
style(common): format button component
refactor(store): simplify trip state management
test(checkout): add WhatsApp button integration tests
chore(deps): update react to 18.3.0
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style (not CSS)
- `refactor` - Code refactoring
- `test` - Tests
- `chore` - Dependencies, tooling

---

### 4.3 Code Review Checklist

**Reviewer Must Verify:**
- [ ] Code matches component spec from architecture doc
- [ ] Props interface correct
- [ ] No direct state management imports (use hooks)
- [ ] Responsive mobile-first
- [ ] Accessibility (keyboard, ARIA labels)
- [ ] Error handling (try-catch, fallbacks)
- [ ] Tests passing
- [ ] No console warnings/errors
- [ ] Follows naming conventions
- [ ] Comments for complex logic

---

## 5. Key Implementation Patterns

### 5.1 Custom Hook Pattern (useTripStore)

**File:** `src/hooks/useTripStore.js`

```javascript
import { useCallback } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { costCalculator } from '../utils/costCalculator';

// Store definition (outside component)
const useTripStore = create(
  persist(
    (set, get) => ({
      // State
      selectedDestinations: [],
      vehicleType: null,
      selectedGuide: null,
      selectedPaymentPlan: null,
      
      // Actions
      addDestination: (destination) =>
        set((state) => ({
          selectedDestinations: [...state.selectedDestinations, destination],
        })),
      
      removeDestination: (destId) =>
        set((state) => ({
          selectedDestinations: state.selectedDestinations.filter(
            (d) => d.id !== destId
          ),
        })),
      
      setVehicle: (vehicleType) => set({ vehicleType }),
      setGuide: (guide) => set({ selectedGuide: guide }),
      setPaymentPlan: (plan) => set({ selectedPaymentPlan: plan }),
      
      // Computed
      calculateTotalCost: () => {
        const state = get();
        return costCalculator(
          state.selectedDestinations,
          state.vehicleType,
          state.selectedGuide
        );
      },
      
      // Clear trip
      clearTrip: () =>
        set({
          selectedDestinations: [],
          vehicleType: null,
          selectedGuide: null,
          selectedPaymentPlan: null,
        }),
    }),
    {
      name: 'batour-trip-store',
      storage: createJSONStorage(
        () => ({
          getItem: async (name) => {
            const db = await openDB('batour');
            return await db.get('store', name);
          },
          setItem: async (name, value) => {
            const db = await openDB('batour');
            await db.put('store', value, name);
          },
          removeItem: async (name) => {
            const db = await openDB('batour');
            await db.delete('store', name);
          },
        })
      ),
    }
  )
);

export default useTripStore;
```

**Usage in Components:**
```javascript
function ExplorePage() {
  const addDestination = useTripStore((state) => state.addDestination);
  
  const handleAddToTrip = (destination) => {
    addDestination(destination);
    // Optimistic UI update
  };
  
  return (
    // JSX
  );
}
```

---

### 5.2 Timeline Calculation Pure Function

**File:** `src/utils/timelineEngine.js`

```javascript
import transitMatrix from '../data/transitMatrix.json';
import destinations from '../data/destinations.json';

export const calculateTimeline = (
  selectedDestIds,
  startTime = '08:00',
  startZone = 'CityCenter'
) => {
  const steps = [];
  let currentTime = parseTime(startTime);
  let currentZone = startZone;
  
  // Start point
  steps.push({
    id: 'start',
    type: 'start',
    title: 'Meeting Point',
    time: formatTime(currentTime),
    location: 'Bandung City Center',
  });
  
  // For each destination
  selectedDestIds.forEach((destId, index) => {
    const destination = destinations.find((d) => d.id === destId);
    
    // Transit
    const transitKey = `${currentZone}_to_${destination.zone}`;
    const transitTime = transitMatrix[transitKey] || 60;
    currentTime = addMinutes(currentTime, transitTime);
    
    if (index > 0) {
      steps.push({
        id: `transit-${index}`,
        type: 'transit',
        title: `Travel to ${destination.name}`,
        duration: `${transitTime} min`,
      });
    }
    
    // Destination
    steps.push({
      id: destination.id,
      type: 'destination',
      title: destination.name,
      time: formatTime(currentTime),
      duration: `${destination.estimatedDurationMinutes} min`,
      location: destination.zone,
      zone: destination.zone,
    });
    
    currentTime = addMinutes(currentTime, destination.estimatedDurationMinutes);
    currentZone = destination.zone;
  });
  
  // End point
  steps.push({
    id: 'end',
    type: 'end',
    title: 'Return to Meeting Point',
    time: formatTime(currentTime),
  });
  
  return {
    steps,
    startTime: parseTime(startTime),
    endTime: currentTime,
    totalMinutes: differenceInMinutes(currentTime, parseTime(startTime)),
  };
};

// Helper functions
const parseTime = (timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0);
  return date;
};

const formatTime = (date) => {
  return `${String(date.getHours()).padStart(2, '0')}:${String(
    date.getMinutes()
  ).padStart(2, '0')}`;
};

const addMinutes = (date, minutes) => {
  const newDate = new Date(date);
  newDate.setMinutes(newDate.getMinutes() + minutes);
  return newDate;
};

const differenceInMinutes = (date1, date2) => {
  return Math.round((date1 - date2) / (1000 * 60));
};
```

**Test Example:**
```javascript
describe('calculateTimeline', () => {
  it('calculates correct timeline for 2 destinations', () => {
    const result = calculateTimeline(['dest_001', 'dest_002'], '08:00');
    
    expect(result.steps).toHaveLength(5); // start + transit + 2 dests + end
    expect(result.steps[0].type).toBe('start');
    expect(result.steps[1].type).toBe('transit');
    expect(result.steps[2].type).toBe('destination');
    expect(result.totalMinutes).toBeGreaterThan(180); // At least 3 hours
  });
});
```

---

### 5.3 WhatsApp Payload Generation

**File:** `src/utils/whatsappFormatter.js`

```javascript
export const generateWhatsAppPayload = (tripData, paymentPlan) => {
  const {
    destinations,
    vehicle,
    guide,
    totalCost,
  } = tripData;

  const message = `
Halo BaTour! Saya ingin booking trip:

📅 Tanggal: [Mohon tentukan tanggal]
🚗 Kendaraan: ${vehicle.type} (${vehicle.capacity.min}-${vehicle.capacity.max} pax)
👤 Guide: ${guide.name}
📍 Destinasi:
${destinations
  .map((dest, i) => `  ${i + 1}. ${dest.name} (Rp ${dest.entryFeeIDR.toLocaleString('id-ID')})`)
  .join('\n')}

💰 Total: Rp ${totalCost.toLocaleString('id-ID')}
💳 Opsi Bayar: ${paymentPlan === 'FULL' ? 'Bayar 100% Sekarang (Gratis 5% diskon)' : 'DP 50% Sekarang, 50% di hari trip'}

Mohon konfirmasi ketersediaan. Terima kasih!
  `.trim();

  // URL encode and create WhatsApp deep link
  const encodedMessage = encodeURIComponent(message);
  const adminPhone = import.meta.env.VITE_ADMIN_WHATSAPP;
  
  return `https://wa.me/${adminPhone}/?text=${encodedMessage}`;
};
```

---

### 5.4 Service Worker Registration

**File:** `src/main.jsx`

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App';

// PWA Service Worker registration
let refreshing = false;
const handleServiceWorkerUpdate = (registration) => {
  if (refreshing) return;
  refreshing = true;
  window.location.reload();
};

registerSW({
  onNeedRefresh() {
    // Show "Update available" notification
    if (confirm('New version available! Refresh to update?')) {
      handleServiceWorkerUpdate();
    }
  },
  onOfflineReady() {
    console.log('App ready to work offline');
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

## 6. Testing Strategy

### 6.1 Unit Tests (Component Logic)

```javascript
// src/components/explore/DestinationCard.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import DestinationCard from './DestinationCard';

describe('DestinationCard', () => {
  const mockDestination = {
    id: 'dest_001',
    name: 'Kawah Putih',
    rating: 4.7,
    entryFeeIDR: 50000,
    imageUrl: '/images/kawah-putih.webp',
  };

  it('renders destination name', () => {
    render(<DestinationCard destination={mockDestination} onClick={() => {}} />);
    expect(screen.getByText('Kawah Putih')).toBeInTheDocument();
  });

  it('calls onAddToTrip when button clicked', () => {
    const mockHandler = jest.fn();
    render(
      <DestinationCard
        destination={mockDestination}
        onClick={() => {}}
        onAddToTrip={mockHandler}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /Add/i }));
    expect(mockHandler).toHaveBeenCalled();
  });

  it('displays selected state with checkmark', () => {
    const { container } = render(
      <DestinationCard destination={mockDestination} isSelected onClick={() => {}} />
    );
    expect(container.querySelector('[aria-label="Selected"]')).toBeInTheDocument();
  });
});
```

### 6.2 Integration Tests (User Flows)

```javascript
// src/__tests__/flows/bookingFlow.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../../App';

describe('Complete Booking Flow', () => {
  it('completes flow from explore to checkout', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // 1. Onboarding
    expect(screen.getByText(/Anti-Ribet/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Mulai/i }));

    // 2. Explore
    await waitFor(() => {
      expect(screen.getByText('Kawah Putih')).toBeInTheDocument();
    });
    fireEvent.click(screen.getAllByRole('button', { name: /Add/i })[0]);

    // 3. Build Itinerary
    fireEvent.click(screen.getByRole('button', { name: /Lanjut/i }));
    expect(screen.getByText(/Timeline/i)).toBeInTheDocument();

    // 4. Checkout
    fireEvent.click(screen.getByRole('button', { name: /Pembayaran/i }));
    expect(screen.getByText(/WhatsApp/i)).toBeInTheDocument();
  });
});
```

---

## 7. Common Pitfalls & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Images not loading | Incorrect path (public/) | Use `/images/...` not `./images/...` |
| State not persisting | IndexedDB not initialized | Check Service Worker registration |
| Timeline calculation off | Timezone issues | Use `Date.now()` consistently, timezone-agnostic |
| WhatsApp deep link fails | Special characters not encoded | Always `encodeURIComponent()` |
| Offline mode broken | Service Worker not precaching | Run `npm run build` and test production build |
| Mobile layout broken | Not mobile-first CSS | Check max-w container, test on real device |

---

## 8. Documentation & Handoff

### 8.1 Self-Documenting Code

```javascript
/**
 * Calculates total trip cost including vehicle, guide, and entry fees
 * @param {Destination[]} destinations - Selected destinations
 * @param {Vehicle} vehicle - Selected vehicle (Car or Van)
 * @param {Guide} guide - Selected guide
 * @param {string} paymentPlan - 'FULL' or 'DP_50'
 * @returns {Object} Cost breakdown with subtotal, discount, total
 */
export const calculateTripCost = (
  destinations,
  vehicle,
  guide,
  paymentPlan = 'FULL'
) => {
  // Implementation...
};
```

### 8.2 README.md Template

```markdown
# BaTour - Personal Travel Assistant for Bandung

## Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### Installation
\`\`\`bash
npm install
npm run dev
\`\`\`

### Build for Production
\`\`\`bash
npm run build
\`\`\`

## Architecture

- **Frontend:** React 18 + Vite + Zustand
- **Styling:** Tailwind CSS
- **Offline:** Service Worker (vite-plugin-pwa)
- **Deployment:** Vercel (static)

## Documentation

- [PRD](docs/01_PRD.md) - Product requirements
- [Data Contracts](contracts/01_DataContracts.md) - API schemas
- [Component Architecture](contracts/02_ComponentArchitecture.md) - UI specs
- [Deployment Guide](docs/02_Deployment.md) - Release process

## Project Structure

See [Development Workflow](docs/03_Development.md) for complete file structure.

## Contributing

See [Development Workflow](docs/03_Development.md) for branch strategy and code review process.

## License

MIT
```

---

**Document Control:**
- **Created:** May 13, 2026
- **Last Updated:** May 13, 2026
- **Next Review:** End of Sprint 0
- **Owner:** Engineering Lead

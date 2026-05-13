# Component Architecture & Contract
# BaTour React Component Specification

**Version:** 1.0.0  
**Status:** Development  
**Last Updated:** May 2026

---

## Overview

This document defines the component hierarchy, props contracts, and composition patterns for all BaTour UI components.

**Design Principles:**
1. **Single Responsibility:** Each component handles one concern
2. **Prop-Driven:** No component reaches into state management directly (exceptions documented)
3. **Composition Over Inheritance:** Build complex UIs from simple building blocks
4. **Accessibility First:** WCAG 2.1 AA compliant by default
5. **Mobile-First:** All components responsive from 320px+

---

## Component Hierarchy

```
App (Root)
├── Routes (React Router)
│   ├── OnboardingPage (/)
│   │   └── HeroSection
│   │       ├── HeroImage
│   │       ├── ValuePropOverlay
│   │       └── PrimaryCTA
│   ├── ExplorePage (/explore)
│   │   ├── StickyHeader
│   │   │   ├── BreadcrumbNav
│   │   │   └── OfflineIndicator
│   │   ├── SearchBar
│   │   ├── CategoryPills
│   │   └── DestinationGrid
│   │       └── DestinationCard (x12)
│   ├── BuildItineraryPage (/build-itinerary)
│   │   ├── ItineraryHeader
│   │   ├── SelectedDestinationsList
│   │   ├── VehicleSelector
│   │   ├── GuideList
│   │   │   └── GuideCard (x3)
│   │   ├── TimelineVisualization
│   │   │   └── TimelineStep (x5-8)
│   │   └── FixedBottomActionBar
│   ├── CheckoutPage (/checkout)
│   │   ├── CheckoutHeader
│   │   ├── CostBreakdownCard
│   │   ├── PaymentOptionSelector
│   │   ├── TrustBadges
│   │   ├── ReviewCard
│   │   └── WhatsAppCheckoutButton
│   └── ActiveTripPage (/active-trip/:bookingId)
│       ├── TripHeader
│       ├── GuideContactCard
│       ├── InteractiveTimeline
│       │   └── TimelineStep (x5-8)
│       ├── QRTicket
│       └── EmergencyFooter
├── Navigation (Global)
│   └── MobileBottomNav
└── Providers
    ├── TripStoreProvider
    └── OfflineProvider
```

---

## Core Component Specifications

### Layer 1: Common / Reusable Components

#### 1.1 Button Component

**Location:** `src/components/common/Button.jsx`

**Props Contract:**
```typescript
interface ButtonProps {
  children: React.ReactNode;              // Button text or content
  onClick?: () => void;                   // Click handler
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; // Default: 'primary'
  size?: 'sm' | 'md' | 'lg';              // Default: 'md'
  disabled?: boolean;                     // Default: false
  fullWidth?: boolean;                    // Default: false
  icon?: React.ReactNode;                 // Optional left icon
  loading?: boolean;                      // Default: false
  ariaLabel?: string;                     // Accessibility label
  className?: string;                     // Tailwind overrides
}
```

**Variants:**
- `primary`: Orange (#ec5b13) background, white text, solid
- `secondary`: Transparent background, orange border, orange text
- `ghost`: No background, no border, orange text
- `danger`: Red background, white text (for cancellation flows)

**Example Usage:**
```jsx
<Button 
  variant="primary" 
  size="lg" 
  fullWidth 
  onClick={() => navigate('/explore')}
>
  Mulai Eksplorasi
</Button>
```

---

#### 1.2 Card Component

**Location:** `src/components/common/Card.jsx`

**Props Contract:**
```typescript
interface CardProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'flat';  // Default: 'elevated'
  padding?: 'sm' | 'md' | 'lg';                // Default: 'md'
  rounded?: boolean;                           // Default: true
  hoverable?: boolean;                         // Default: false
  onClick?: () => void;                        // Interaction handler
  className?: string;
}
```

**Variants:**
- `elevated`: Shadow, white background (Material Design)
- `outlined`: Subtle border, no shadow
- `flat`: No shadow, no border, light gray background

**Example Usage:**
```jsx
<Card variant="elevated" hoverable onClick={handleSelect}>
  <img src={destination.imageUrl} alt={destination.name} />
  <h3>{destination.name}</h3>
  <p>{destination.description}</p>
</Card>
```

---

#### 1.3 Badge Component

**Location:** `src/components/common/Badge.jsx`

**Props Contract:**
```typescript
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';                    // Default: 'sm'
  icon?: React.ReactNode;                // Optional icon
  dismissible?: boolean;                 // Default: false
  onDismiss?: () => void;
}
```

**Example Usage:**
```jsx
<Badge variant="success" icon={<CheckIcon />}>
  Tersedia
</Badge>

<Badge variant="warning">
  Rp 50.000
</Badge>
```

---

#### 1.4 Skeleton Loader Component

**Location:** `src/components/common/SkeletonLoader.jsx`

**Props Contract:**
```typescript
interface SkeletonLoaderProps {
  variant?: 'text' | 'image' | 'card' | 'custom';
  width?: string;                        // Default: '100%'
  height?: string;                       // Default: '20px'
  count?: number;                        // Default: 1
  animated?: boolean;                    // Default: true
  className?: string;
}
```

**Example Usage:**
```jsx
<SkeletonLoader variant="image" width="100%" height="200px" />
<SkeletonLoader variant="text" count={3} />
```

---

#### 1.5 OfflineIndicator Component

**Location:** `src/components/common/OfflineIndicator.jsx`

**Props Contract:**
```typescript
interface OfflineIndicatorProps {
  isOffline: boolean;
  position?: 'header' | 'floating';      // Default: 'header'
  expandedMessage?: boolean;              // Default: false
}
```

**Behavior:**
- Shows when `isOffline === true`
- Header variant: 3px red bar at top
- Floating variant: Sticky badge in corner with message
- Dismissible (closes on manual click)

---

#### 1.6 Modal / Dialog Component

**Location:** `src/components/common/Modal.jsx`

**Props Contract:**
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;             // Footer buttons
  size?: 'sm' | 'md' | 'lg';             // Default: 'md'
  closeOnBackdropClick?: boolean;        // Default: true
}
```

**Example Usage:**
```jsx
<Modal isOpen={showGuideDetails} onClose={() => setShowGuideDetails(false)}>
  <GuideDetailedView guide={selectedGuide} />
  <Modal.Actions>
    <Button variant="secondary" onClick={() => setShowGuideDetails(false)}>
      Close
    </Button>
    <Button variant="primary" onClick={handleSelectGuide}>
      Select Guide
    </Button>
  </Modal.Actions>
</Modal>
```

---

### Layer 2: Feature Components

#### 2.1 HeroSection Component

**Location:** `src/components/onboarding/HeroSection.jsx`

**Props Contract:**
```typescript
interface HeroSectionProps {
  imageUrl: string;
  headline: string;                      // Main title
  subheadline?: string;                  // Optional subtitle
  ctaLabel: string;                      // Button text
  onCTAClick: () => void;                // Button handler
  ctaVariant?: 'primary' | 'secondary';
}
```

**Behavior:**
- Full viewport height (100vh) on mobile, 80vh on desktop
- Background image with lazy loading + skeleton
- Gradient overlay for text readability
- Mobile-optimized hero text (18px headline, 14px subheadline)
- Absolute positioned CTA at bottom

**Accessibility:**
- `alt` text for hero image
- Semantic heading hierarchy (h1)
- Focus management on CTA button

**Example Usage:**
```jsx
<HeroSection
  imageUrl="/images/bandung-hero.webp"
  headline="Anti-Ribet Travel di Bandung"
  subheadline="Jelajahi kota dengan pemandu lokal terpercaya"
  ctaLabel="Mulai Eksplorasi"
  onCTAClick={() => navigate('/explore')}
/>
```

---

#### 2.2 SearchBar Component

**Location:** `src/components/explore/SearchBar.jsx`

**Props Contract:**
```typescript
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;     // Debounced (300ms)
  placeholder?: string;
  onClear?: () => void;
  icon?: React.ReactNode;                // Default: search icon
  disabled?: boolean;
}
```

**Behavior:**
- Debounces input 300ms before calling `onChange`
- Clear button appears when input has text
- Mobile: Full width, fixed positioning
- Desktop: Max-width 400px

**Accessibility:**
- ARIA label describing purpose
- Clear button has `aria-label="Clear search"`

---

#### 2.3 CategoryPills Component

**Location:** `src/components/explore/CategoryPills.jsx`

**Props Contract:**
```typescript
interface CategoryPillsProps {
  categories: string[];                  // E.g., ["All", "Nature", "Culinary"]
  activeCategory: string;                // E.g., "Nature"
  onSelect: (category: string) => void;
  scrollable?: boolean;                  // Default: true
}
```

**Behavior:**
- Horizontal scroll on mobile
- Grid layout on desktop
- Active pill highlighted in orange
- Inactive pills: light gray background
- Auto-scroll active pill into view

---

#### 2.4 DestinationCard Component

**Location:** `src/components/explore/DestinationCard.jsx`

**Props Contract:**
```typescript
interface DestinationCardProps {
  destination: Destination;
  isSelected?: boolean;                  // Default: false
  onClick: () => void;
  onAddToTrip: () => void;               // Button handler
  imageLoading?: 'eager' | 'lazy';       // Default: 'lazy'
}
```

**UI Elements:**
- Image with skeleton loader (200px height)
- Heart/star rating icon overlay (top-right)
- Destination name (bold, 16px)
- Zone badge (light gray)
- Entry fee badge (orange)
- "Add to Trip" button
- Checkmark overlay if `isSelected === true`

**Behavior:**
- `onClick` navigates or expands details
- `onAddToTrip` adds to Zustand store
- Images lazy-loaded except first 4 cards

---

#### 2.5 VehicleSelector Component

**Location:** `src/components/itinerary/VehicleSelector.jsx`

**Props Contract:**
```typescript
interface VehicleSelectorProps {
  vehicles: Vehicle[];
  selectedVehicleId?: string;
  onSelect: (vehicleId: string) => void;
  disabled?: boolean;
}
```

**Behavior:**
- Radio button group
- Each vehicle displays:
  - Image
  - Type (Car/Van)
  - Capacity (e.g., "1-4 pax")
  - Daily rate (Rp X.XXX.000)
  - Features list
- Selected vehicle highlighted with orange border

---

#### 2.6 GuideCard Component

**Location:** `src/components/itinerary/GuideCard.jsx`

**Props Contract:**
```typescript
interface GuideCardProps {
  guide: Guide;
  isSelected?: boolean;
  onSelect: () => void;
  onViewDetails?: () => void;
}
```

**UI Elements:**
- Circular photo (80px)
- Name + rating (e.g., "Budi Santoso ⭐ 4.9")
- Languages (tags)
- Specialties (tags)
- Daily rate
- "Select" or "Selected" button

---

#### 2.7 TimelineVisualization Component

**Location:** `src/components/itinerary/TimelineVisualization.jsx`

**Props Contract:**
```typescript
interface TimelineVisualizationProps {
  steps: TimelineStep[];
  currentStepIndex?: number;             // For active-trip mode
  isInteractive?: boolean;               // Default: false
}

interface TimelineStep {
  id: string;
  type: 'start' | 'destination' | 'transit' | 'end';
  title: string;
  time: string;                          // "08:00"
  duration?: string;                     // "120 min"
  location?: string;
  icon?: React.ReactNode;
}
```

**Behavior:**
- Vertical timeline
- Step circles connected by lines
- Color coding:
  - Gray: Past steps
  - Orange: Current step (if `isInteractive`)
  - Light gray: Future steps
- Responsive: Compact on mobile, spacious on desktop

**Example Usage:**
```jsx
const steps = [
  { type: 'start', title: 'Meeting Point', time: '08:00', location: 'Bandung City Center' },
  { type: 'transit', title: 'Drive to Kawah Putih', duration: '90 min' },
  { type: 'destination', title: 'Kawah Putih', time: '09:30', duration: '120 min' },
  { type: 'end', title: 'Return', time: '18:00' }
];

<TimelineVisualization steps={steps} />
```

---

#### 2.8 CostBreakdownCard Component

**Location:** `src/components/checkout/CostBreakdownCard.jsx`

**Props Contract:**
```typescript
interface CostBreakdownCardProps {
  vehicle: Vehicle;
  guide: Guide;
  destinations: Destination[];
  subtotal: number;                      // All fees except discount
  discountAmount?: number;               // Default: 0
  total: number;
  currencyCode?: string;                 // Default: 'IDR'
}
```

**UI Layout:**
```
┌─ Cost Breakdown ──────────────┐
│ Vehicle Rental (Full Day):    │
│   Van 5-8 pax .............. Rp 900.000 │
│                                │
│ Guide (Full Day):             │
│   Budi Santoso ........... Rp 350.000 │
│                                │
│ Entry Fees:                   │
│   Kawah Putih ............ Rp 50.000 │
│   Situ Patenggang ....... Rp 30.000 │
│   ────────────────────────      │
│                      Rp 1.330.000 │
│                                │
│ Promo Discount (5%) .... -Rp 66.500 │
│                                │
│ TOTAL: ........... Rp 1.263.500 │
│                                │
│ Payment Options:               │
│ ◉ Pay 100% Now (5% discount)  │
│ ○ Pay 50% Now, 50% on Trip    │
└────────────────────────────────┘
```

---

#### 2.9 WhatsAppCheckoutButton Component

**Location:** `src/components/checkout/WhatsAppCheckoutButton.jsx`

**Props Contract:**
```typescript
interface WhatsAppCheckoutButtonProps {
  tripData: TripBooking;                 // Zustand store snapshot
  paymentPlan: 'FULL' | 'DP_50';
  isOffline: boolean;
  onSuccess?: () => void;                // Called when WA window opens
  adminPhoneNumber: string;              // E.g., "+6281234567890"
}

interface TripBooking {
  destinations: Destination[];
  vehicle: Vehicle;
  guide: Guide;
  totalCost: number;
  selectedPaymentPlan: 'FULL' | 'DP_50';
}
```

**Behavior:**
- Disabled if `isOffline === true`
- Shows tooltip: "Connect to internet to book"
- Click generates WhatsApp deep link
- URL structure:
  ```
  https://wa.me/6281234567890/?text=
  Halo BaTour! Saya ingin booking trip:
  
  🚗 Kendaraan: Van (5-8 pax)
  👤 Guide: Budi Santoso
  📍 Destinasi:
    1. Kawah Putih (Rp 50.000)
    2. Situ Patenggang (Rp 30.000)
  
  💰 Total: Rp 1.263.500
  💳 Opsi: DP 50% (Rp 631.750)
  
  Mohon konfirmasi. Terima kasih!
  ```

---

#### 2.10 GuideContactCard Component

**Location:** `src/components/trip/GuideContactCard.jsx`

**Props Contract:**
```typescript
interface GuideContactCardProps {
  guide: Guide;
  emergencyPhoneNumber?: string;         // Fallback contact
}
```

**UI Elements:**
- Large guide photo
- Name + rating
- "Chat di WhatsApp" button (opens `wa.me/{guide.phoneNumber}`)
- "Telepon Darurat" button (opens `tel:` protocol)
- Quick actions for sharing trip details

---

#### 2.11 QRTicket Component

**Location:** `src/components/trip/QRTicket.jsx`

**Props Contract:**
```typescript
interface QRTicketProps {
  bookingId: string;
  bookerName?: string;
  destinationCount: number;
  guidePhoneNumber: string;
}
```

**Behavior:**
- Generates QR code from `bookingId` using `qrcode.react`
- QR code base64 encoded and cacheable by Service Worker
- Below QR: Booking ID (all caps, monospace font)
- Scanner instruction: "Tunjukkan kode ini kepada guide"

**Example:**
```
┌──────────────────┐
│  [QR Code Image] │
│                  │
│ BOOKING-XXXX..   │
└──────────────────┘
Tunjukkan ke guide saat tiba
```

---

#### 2.12 InteractiveTimeline Component

**Location:** `src/components/trip/InteractiveTimeline.jsx`

**Props Contract:**
```typescript
interface InteractiveTimelineProps {
  steps: TimelineStep[];
  currentTime?: Date;                    // Default: Date.now()
  timeZone?: string;                     // Default: "Asia/Jakarta"
}
```

**Behavior:**
- Compares `currentTime` against step times
- Highlights current step in orange
- Shows countdown to next step
- "Next: [Location]" message above timeline
- Auto-updates every minute

---

### Layer 3: Page Components

#### 3.1 OnboardingPage Component

**Location:** `src/pages/OnboardingPage.jsx`

**Props:** None (uses hooks)

**Behavior:**
1. Checks `tripStore.hasCompletedOnboarding`
2. If true: Redirect to `/explore` on mount
3. Otherwise: Render HeroSection
4. On CTA click:
   - Set `hasCompletedOnboarding` to `true`
   - Navigate to `/explore`

---

#### 3.2 ExplorePage Component

**Location:** `src/pages/ExplorePage.jsx`

**Behavior:**
1. Load `destinations.json` on mount
2. State: `searchQuery`, `activeCategory`, `selectedDestinations`
3. Filter destinations:
   - By `activeCategory`
   - By `searchQuery` (name + description)
4. Render 2x3 grid (mobile), 3x4 grid (desktop)
5. "Add to Trip" updates Zustand `selectedDestinations`
6. "Continue" button at bottom navigates to `/build-itinerary?destinations=id1,id2`

---

#### 3.3 BuildItineraryPage Component

**Location:** `src/pages/BuildItineraryPage.jsx`

**Behavior:**
1. Load query params: `?destinations=dest_001,dest_002`
2. Fetch guides from `guides.json`
3. Render:
   - Selected destinations list (removable)
   - Vehicle selector
   - Guide selector
   - Timeline visualization
4. Compute timeline:
   - Start time: 08:00
   - For each destination: add `estimatedDurationMinutes`
   - Between destinations: add transit time from matrix
5. Real-time cost calculation
6. "Lanjut ke Pembayaran" → `/checkout`

---

#### 3.4 CheckoutPage Component

**Location:** `src/pages/CheckoutPage.jsx`

**Behavior:**
1. Display cost breakdown (from Zustand)
2. Payment option selector (FULL vs DP_50)
3. Show relevant discount (5% for FULL)
4. WhatsAppCheckoutButton
5. After click: Show confirmation screen for 2s
6. Navigate to `/active-trip/:bookingId`

---

#### 3.5 ActiveTripPage Component

**Location:** `src/pages/ActiveTripPage.jsx`

**Behavior:**
1. Extract `bookingId` from URL params
2. Fetch from IndexedDB: `trips:{bookingId}`
3. If not found: Show "Trip not found" error
4. Render:
   - Trip header (destination count, duration)
   - Guide contact card
   - Interactive timeline (current step highlighted)
   - QR ticket
   - Emergency footer
5. **Must work 100% offline** (all data precached)

---

## State Management Contract

### Zustand Store Schema

**Location:** `src/stores/tripStore.js`

```typescript
interface TripState {
  // App lifecycle
  hasCompletedOnboarding: boolean;
  isOffline: boolean;
  lastSyncTime: number;                  // Timestamp
  
  // Builder state
  selectedDestinations: Destination[];
  vehicleType: 'Car' | 'Van' | null;
  selectedGuide: Guide | null;
  selectedPaymentPlan: 'FULL' | 'DP_50' | null;
  
  // Saved trips
  savedTrips: Map<string, SavedTrip>;
  
  // Actions
  addDestination: (dest: Destination) => void;
  removeDestination: (id: string) => void;
  setVehicle: (type: 'Car' | 'Van') => void;
  setGuide: (guide: Guide) => void;
  setPaymentPlan: (plan: 'FULL' | 'DP_50') => void;
  clearTrip: () => void;
  
  // Computed
  calculateTotalCost: () => number;
  calculateAmountDueNow: () => number;
  generateWhatsAppPayload: () => string;
  
  // Offline
  setOffline: (isOffline: boolean) => void;
}

interface SavedTrip {
  id: string;
  bookingId: string;
  destinations: Destination[];
  vehicle: Vehicle;
  guide: Guide;
  startTime: string;                     // "08:00"
  endTime: string;                       // "18:00"
  totalCost: number;
  paymentPlan: 'FULL' | 'DP_50';
  status: 'pending' | 'confirmed' | 'completed';
  createdAt: number;                     // Timestamp
}
```

**Persistence:**
- IndexedDB via `persist` middleware
- Store name: `batour-trip-store`
- Syncs automatically on mount

---

## Props Naming Convention

| Pattern | Example | Usage |
|---------|---------|-------|
| `is*` | `isSelected`, `isOffline` | Boolean state |
| `on*` | `onClick`, `onSelect` | Event handlers |
| `*Url` | `imageUrl`, `photoUrl` | Image paths |
| `*IDR` | `dailyRateIDR` | Currency amounts |
| `*Minutes` | `estimatedDurationMinutes` | Time in minutes |
| `*Count` | `totalTrips`, `destinationCount` | Numeric counts |

---

## Composition Patterns

### 1. Wrapper Components (No Props Drilling)

```jsx
// ❌ Anti-pattern: Props drilling
<Layout>
  <Page>
    <Section>
      <Card>
        <Button onClick={handleClick} />
      </Card>
    </Section>
  </Page>
</Layout>

// ✅ Pattern: Context or compound components
<TripProvider>
  <ExplorePage />
</TripProvider>
```

### 2. Controlled vs Uncontrolled

```jsx
// Controlled (parent manages state)
<SearchBar 
  value={searchQuery}
  onChange={setSearchQuery}
/>

// Uncontrolled (component manages state)
<Modal>
  <Form />  {/* Form manages its own state */}
</Modal>
```

### 3. Compound Components

```jsx
<Card>
  <Card.Header>
    <h2>Title</h2>
  </Card.Header>
  <Card.Body>
    Content here
  </Card.Body>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card>
```

---

## Error Handling in Components

### Boundary Pattern

```jsx
// ErrorBoundary.jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback message="Terjadi kesalahan" />;
    }
    return this.props.children;
  }
}
```

### Graceful Degradation

```jsx
// If image fails to load, show placeholder
<img 
  src={destination.imageUrl} 
  alt={destination.name}
  onError={(e) => e.target.src = '/images/placeholder.webp'}
/>
```

---

## Performance Optimization Guidelines

### 1. Code Splitting

```javascript
// pages/lazy-loaded
export const OnboardingPage = lazy(() => 
  import('./OnboardingPage')
);
```

### 2. Memoization

```jsx
// Prevent unnecessary re-renders
export const DestinationCard = memo(({ destination, ...props }) => {
  return (
    <Card {...props}>
      {/* ... */}
    </Card>
  );
});
```

### 3. Image Optimization

```jsx
// Lazy load images outside viewport
<img 
  src={destination.imageUrl}
  loading="lazy"
  decoding="async"
/>
```

---

## Testing Contract

**Each component should have:**
1. Unit tests for prop validation
2. Integration tests for user interactions
3. Accessibility tests (a11y)
4. Visual regression tests (optional)

**Example:**
```javascript
// DestinationCard.test.jsx
describe('DestinationCard', () => {
  it('renders destination name', () => {
    const { getByText } = render(
      <DestinationCard destination={mockDest} />
    );
    expect(getByText(mockDest.name)).toBeInTheDocument();
  });
  
  it('calls onAddToTrip when button clicked', () => {
    const mockHandler = jest.fn();
    const { getByRole } = render(
      <DestinationCard 
        destination={mockDest}
        onAddToTrip={mockHandler}
      />
    );
    fireEvent.click(getByRole('button', { name: /Add/i }));
    expect(mockHandler).toHaveBeenCalled();
  });
});
```

---

**Document Control:**
- **Created:** May 13, 2026
- **Last Updated:** May 13, 2026
- **Next Review:** Sprint planning for component implementation

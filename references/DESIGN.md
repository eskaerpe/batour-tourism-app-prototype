---
name: Bandung Travel Assistant
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#434654'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#737686'
  outline-variant: '#c3c5d7'
  surface-tint: '#1353d8'
  primary: '#003fb1'
  on-primary: '#ffffff'
  primary-container: '#1a56db'
  on-primary-container: '#d4dcff'
  inverse-primary: '#b5c4ff'
  secondary: '#2c694e'
  on-secondary: '#ffffff'
  secondary-container: '#aeeecb'
  on-secondary-container: '#316e52'
  tertiary: '#723b00'
  on-tertiary: '#ffffff'
  tertiary-container: '#954f00'
  on-tertiary-container: '#ffd5b6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b5c4ff'
  on-primary-fixed: '#00174d'
  on-primary-fixed-variant: '#003dab'
  secondary-fixed: '#b1f0ce'
  secondary-fixed-dim: '#95d4b3'
  on-secondary-fixed: '#002114'
  on-secondary-fixed-variant: '#0e5138'
  tertiary-fixed: '#ffdcc3'
  tertiary-fixed-dim: '#ffb77d'
  on-tertiary-fixed: '#2f1500'
  on-tertiary-fixed-variant: '#6e3900'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  margin-mobile: 20px
  margin-desktop: 64px
  gutter: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  section-gap: 48px
---

## Brand & Style
The brand personality is that of a knowledgeable, calm, and reliable local guide. It avoids the chaotic energy of typical discount travel apps in favor of a curated, serene experience that mirrors the refreshing atmosphere of the Parahyangan highlands. 

The design style is **Corporate / Modern Minimalism**. It prioritizes high legibility and clarity to reduce the cognitive load on travelers. By utilizing generous whitespace and a structured grid, the design system ensures that information feels organized and trustworthy. The visual language uses soft, organic influences from the local landscape to prevent the interface from feeling sterile, creating an inviting digital environment that encourages exploration.

## Colors
This design system uses a palette inspired by the intersection of urban professionalism and natural heritage:

*   **Bandung Blue (Primary):** A clean, deep professional blue used for primary actions, navigation, and brand-critical elements. It signals authority and technological reliability.
*   **Natural Green (Secondary):** A rich, forest-inspired green used for nature-related categories (Lembang, Ciwidey) and success states. It brings a sense of freshness and calm.
*   **Earthy Umber (Tertiary):** A warm, terracotta-adjacent accent used specifically to highlight local UMKM, crafts, and traditional culinary spots, providing a tactile, human connection.
*   **Neutrals:** A range of cool grays (Slate) that keep the interface crisp and airy. The default mode is Light to maximize the "fresh" feel of the brand.

## Typography
**Plus Jakarta Sans** is the sole typeface for this design system. Its modern, slightly rounded geometric forms offer a friendly yet professional tone that fits the travel industry perfectly.

*   **Headlines:** Use Bold weights with tighter letter spacing for a confident, editorial look.
*   **Body Text:** Use Regular weights with generous line heights (1.5x+) to ensure readability during outdoor use or while transit.
*   **Labels:** Use SemiBold in all-caps for small metadata to maintain hierarchy without adding visual bulk.
*   **Decision Fatigue:** Maintain a strict hierarchy by limiting the use of different font sizes on a single screen; stick to one Headline and one Body size per view whenever possible.

## Layout & Spacing
The layout follows a **Fluid Grid** model based on an 8px spacing system to ensure mathematical harmony across all components.

*   **Mobile:** A 4-column grid with 20px side margins. Content should primarily stack vertically to maintain focus.
*   **Tablet/Desktop:** A 12-column grid. On larger screens, content should be contained within a max-width of 1280px to prevent excessive line lengths.
*   **Rhythm:** Use "Generous Whitespace." Group related items with 8px or 16px gaps, but separate major sections with at least 48px to allow the design to "breathe," echoing the open landscapes of Bandung's highlands.

## Elevation & Depth
To maintain a modern and clean aesthetic, depth is communicated through **Tonal Layers** and **Ambient Shadows**:

*   **Surface Tiers:** Use subtle background color shifts (e.g., White on a Light Gray canvas) to define primary content areas. 
*   **Shadows:** Use extremely soft, diffused shadows with a slight Blue tint (`rgba(26, 86, 219, 0.08)`) for interactive cards and floating action buttons. Shadows should have a large blur radius and 0 spread to appear natural and light.
*   **Outlines:** Use low-contrast 1px borders (`#E2E8F0`) for input fields and secondary containers instead of shadows to keep the UI flat and focused.

## Shapes
The shape language is **Rounded**, reflecting a friendly and approachable personality. 

*   **Base Components:** Buttons and Input fields use a 0.5rem (8px) radius.
*   **Containers:** Cards and Modals use a 1rem (16px) radius to feel substantial and soft.
*   **Full Rounding:** Use pill-shaped (full radius) buttons only for chips or tags to differentiate them from primary action buttons.
*   **Imagery:** Photos of Bandung’s scenery should always feature soft rounded corners to match the UI components.

## Components
*   **Buttons:** Primary buttons use 'Bandung Blue' with white text. High-emphasis actions should be large with 0.5rem corners. Secondary buttons use a light blue ghost style or simple outline.
*   **Cards:** Travel destination cards feature a top-heavy image ratio (16:9) with a 1rem radius. Include a small 'Natural Green' tag for nature sites or 'Earthy Umber' for craft shops.
*   **Chips/Filter:** Pill-shaped with a 1px border. When active, fill with 'Bandung Blue' or 'Natural Green' depending on the category.
*   **Inputs:** Clean fields with 1px Slate-200 borders. Focus states should use a 2px 'Bandung Blue' stroke.
*   **Icons:** Use a consistent 24px grid. Stroke-based icons with rounded terminals (ends) are preferred to match the typography.
*   **Special Component (The "Local Guide" Card):** A unique card style for UMKM that uses a subtle Earthy Umber light-tint background to differentiate local crafts from standard tourist attractions.
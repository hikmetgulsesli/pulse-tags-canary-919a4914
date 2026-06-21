---
name: Deterministic Utility
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
  on-surface-variant: '#434655'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#4d556b'
  on-tertiary: '#ffffff'
  tertiary-container: '#656d84'
  on-tertiary-container: '#eef0ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#dae2fd'
  tertiary-fixed-dim: '#bec6e0'
  on-tertiary-fixed: '#131b2e'
  on-tertiary-fixed-variant: '#3f465c'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style

The design system is built for high-frequency, functional interaction. It prioritizes a **deterministic** and **minimalist** aesthetic, treating user data as the primary interface element. The goal is to reduce cognitive load by removing decorative flair and focusing on a calm, "boring but reliable" operational environment. 

The emotional response should be one of quiet competence and focus. By employing a systematic layout and a constrained visual language, the UI recedes into the background, allowing habit-tracking data to become the focal point. This is an "instrumental" interface—precise, dense, and utilitarian.

## Colors

The palette is anchored by a high-contrast functional range. 

- **Primary:** A precise blue used exclusively for purposeful action and the 'done' state transition.
- **Neutral/Surface:** A range of cool grays (Slate) provides the foundation for the "idle" states, ensuring that uncompleted tasks remain visually quiet.
- **Semantic States:** Success, Warning, and Error colors are strictly reserved for validation and priority markers.
- **State Distinction:** The distinction between 'idle' and 'done' is achieved through a shift from neutral grays to low-saturation blue tints, maintaining a calm environment even when a board is "complete."

The system supports both Light and Dark modes with a focus on WCAG 2.1 AA contrast ratios for all textual data.

## Typography

Typography is systematic and sharp. **Hanken Grotesk** is used for all primary UI text to ensure high legibility at small sizes, which is critical for a data-dense tool. **JetBrains Mono** is introduced for labels, metadata, and status indicators to reinforce the "instrumental" and "deterministic" feel of the application.

Hierarchy is established through weight and color rather than large jumps in scale. For mobile, the `display` size is capped at 28px to maintain screen density.

## Layout & Spacing

The design system utilizes a **fluid grid** based on a 4px baseline shift. Layouts are designed for maximum density without sacrificing clarity.

- **Grid:** A 12-column grid on desktop, 4-column on mobile.
- **Rhythm:** Elements are spaced using an 8px (2-unit) increment system to maintain a tight, mathematical alignment.
- **Density:** In "compact" views (habit lists), vertical padding is reduced to 4px or 8px to allow as many records as possible to be visible above the fold.
- **Whitespace:** Larger 24px-32px gaps are used only to separate major functional modules, such as the habit grid from the analytics sidebar.

## Elevation & Depth

This design system eschews shadows in favor of **low-contrast outlines** and **tonal layering**.

- **Layers:** The base surface uses the primary background color. Secondary containers (cards, panels) use a subtle 1px border (`#E2E8F0` in light mode) or a slightly offset background tint.
- **Interactive Depth:** Hover states are signaled by a 1px increase in border-weight or a subtle background shift rather than a shadow. 
- **Modals:** Only critical "Interrupt" components (modals) use a soft, 10% opacity neutral shadow to provide a minimal sense of Z-axis separation.

## Shapes

The shape language is "Soft" (0.25rem), providing just enough rounding to feel modern while maintaining the structural rigidity of a data-heavy tool. 

- **Standard Elements:** Buttons, inputs, and chips use a 4px radius.
- **Large Containers:** Cards or sections use 8px (`rounded-lg`).
- **Interactive Indicators:** Checkboxes and status dots remain strictly geometric to signify their binary nature.

## Components

### Habit Chips
- **Idle State:** Background: Neutral-100; Border: Neutral-200; Text: Neutral-600.
- **Done State:** Background: Primary-100; Border: Primary-300; Text: Primary-700. Transition should be immediate and deterministic.

### Buttons
- **Primary:** Solid fill with white text. No gradients.
- **Ghost:** Used for secondary actions. Border only appears on hover to reduce visual noise in dense lists.

### Input Fields
- **Validation:** Validation is inline and uses `label-sm` (Monospaced). Error states change the border color to `status_error` with a high-contrast icon.
- **Focus:** A 2px solid ring of the `primary_color` with a 2px offset.

### Status Indicators
- Small, 8px circular dots using the semantic palette (Success/Warning/Error). Always accompanied by a monospaced label for accessibility.

### Cards & Lists
- Minimal padding (12px-16px). Lists use a subtle bottom-border separator rather than individual card enclosures to maximize space for record data.
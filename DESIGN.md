---
name: Pro-Growth Ledger
colors:
  surface: '#f8f9ff'
  surface-dim: '#ccdbf4'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d4e4fc'
  on-surface: '#0d1c2e'
  on-surface-variant: '#43474e'
  inverse-surface: '#223144'
  inverse-on-surface: '#eaf1ff'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#455f88'
  primary: '#002045'
  on-primary: '#ffffff'
  primary-container: '#1a365d'
  on-primary-container: '#86a0cd'
  inverse-primary: '#adc7f7'
  secondary: '#006d3c'
  on-secondary: '#ffffff'
  secondary-container: '#85f6ad'
  on-secondary-container: '#00723f'
  tertiary: '#1c2225'
  on-tertiary: '#ffffff'
  tertiary-container: '#31373b'
  on-tertiary-container: '#9aa0a4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#adc7f7'
  on-primary-fixed: '#001b3c'
  on-primary-fixed-variant: '#2d476f'
  secondary-fixed: '#88f9b0'
  secondary-fixed-dim: '#6bdc96'
  on-secondary-fixed: '#00210f'
  on-secondary-fixed-variant: '#00522c'
  tertiary-fixed: '#dee3e8'
  tertiary-fixed-dim: '#c2c7cc'
  on-tertiary-fixed: '#171c20'
  on-tertiary-fixed-variant: '#42474c'
  background: '#f8f9ff'
  on-background: '#0d1c2e'
  surface-variant: '#d4e4fc'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  container-max: 1200px
  gutter: 16px
---

## Brand & Style
The design system is engineered to foster a sense of security, progress, and approachability for Micro, Small, and Medium Enterprise (MSME) owners. It prioritizes clarity over complexity, ensuring that users who may not be financial experts feel empowered rather than overwhelmed.

The aesthetic follows a **Modern Corporate** style with a **Friendly Minimalist** twist. It utilizes generous whitespace, soft elevated surfaces, and a deliberate lack of jargon. The goal is to move away from intimidating, spreadsheet-style interfaces toward a guided, task-oriented experience that celebrates financial growth.

## Colors
This design system utilizes a palette rooted in stability and prosperity. 

- **Primary (Navy Blue):** Used for navigation, primary buttons, and headers to establish authority and trust.
- **Secondary (Mint Green):** Reserved for "positive" financial indicators: profit, growth, success states, and primary calls-to-action that lead to revenue-generating activities.
- **Neutral (Slate Grays):** A tiered gray scale is used to manage information hierarchy, ensuring secondary data doesn't compete with key financial figures.
- **Surface Colors:** Pure white (#FFFFFF) is used for primary cards, while the background uses a very soft blue-gray (#F8FAFC) to reduce eye strain.

## Typography
The typography system prioritizes legibility of high-density financial data. **Inter** provides a modern, neutral canvas for the interface, while **JetBrains Mono** is selectively introduced for numerical data (bank accounts, transaction amounts, and tallies) to ensure digits align perfectly for easy comparison.

Large headlines are used sparingly to orient the user, while bold labels are used for input fields to ensure clarity for non-expert users. Letter spacing is slightly tightened on headlines for a more premium, "app-like" feel.

## Layout & Spacing
The system utilizes an **8px linear scale** for consistent rhythm. 

- **Desktop:** A 12-column fluid grid with 24px gutters and 48px side margins.
- **Mobile:** A 4-column fluid grid with 16px gutters and 16px side margins.

Content is organized into **Card-based Layouts**. Individual sections of a financial report or calculation should be isolated into cards to prevent cognitive overload. Grouping related inputs within distinct containers helps users process information in digestible chunks.

## Elevation & Depth
Depth is conveyed through **Tonal Layers** and **Ambient Shadows**. This approach creates a clear visual distinction between the workspace and the interactive elements.

- **Level 0 (Background):** A soft, cool gray (#F8FAFC) used as the canvas.
- **Level 1 (Default Cards):** White surfaces with a subtle, 1px border (#E2E8F0) and no shadow.
- **Level 2 (Interactive/Active):** White surfaces with a "soft-glow" shadow: `0px 4px 12px rgba(26, 54, 93, 0.05)`.
- **Level 3 (Modals/Popovers):** Deeper shadows to indicate focus: `0px 12px 24px rgba(0, 0, 0, 0.1)`.

Avoid high-contrast black shadows. Shadows should be tinted with the primary Navy Blue to maintain brand harmony.

## Shapes
The design system uses a consistent **12px (0.75rem)** corner radius for all primary containers and input fields. This "Medium-Rounded" approach strikes a balance between professional geometry and friendly approachability. 

- **Buttons & Inputs:** 12px radius.
- **Cards:** 16px (rounded-lg) for outer containers.
- **Tags/Chips:** Fully rounded (pill) to differentiate them from interactive buttons.

## Components

### Buttons
- **Primary:** Navy Blue background, white text. High emphasis.
- **Secondary/Growth:** Mint Green background, white text. Used for "Add Income" or "Confirm Payment."
- **Tertiary/Ghost:** No background, Navy Blue border or text only. Used for "Cancel" or "Go Back."

### Input Fields
Inputs must have a background color of white with a 1px border (#CBD5E0). Upon focus, the border transitions to Primary Navy with a 2px stroke. Label text must always be visible (not floating) to ensure users don't lose context.

### Cards
Cards are the primary organizational unit. They should include a `Header` (Title + Icon), `Body` (Content/Data), and optional `Footer` (Actions).

### Status Badges
Used for payment statuses:
- **Paid:** Mint Green background (10% opacity) with dark green text.
- **Pending:** Amber background (10% opacity) with dark brown text.
- **Overdue:** Red background (10% opacity) with dark red text.

### Calculation Summaries
Prominent summary cards should use a Primary Navy background with large White typography for the "Final Total" to ensure the most important number is never missed.
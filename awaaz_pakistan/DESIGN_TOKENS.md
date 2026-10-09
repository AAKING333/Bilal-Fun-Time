# Awaaz Pakistan Design Tokens
*Reverse-engineered and matched from the VoxAI reference design system (https://voxai.framer.ai/)*

## 1. Color Palette

### 1.1 Background Layers & Surfaces
- **App Canvas (Base)**: `#030014` (Deep obsidian cosmic violet, CSS token `--token-690a223c`)
- **Surface Layer 1 (Dark Neutral)**: `#080808` / `#0c0c0c` (`--token-74f48371`, `--token-05f35d53`)
- **Surface Layer 2 (Elevated Card Base)**: `#131515` (80% opacity: `rgba(19, 21, 21, 0.8)`)
- **Glass Card Background**: `rgba(255, 255, 255, 0.03)` to `rgba(255, 255, 255, 0.05)` with `backdrop-filter: blur(16px)`
- **Header / Floating Nav**: `rgba(12, 12, 12, 0.7)` with `backdrop-filter: blur(20px)` and border `rgba(255, 255, 255, 0.08)`

### 1.2 Accent & Glow Palette
- **Primary Electric Violet**: `#814bee` (Vivid neon violet, `--token-e67d9ba4`)
- **Primary Deep Purple**: `#4f1ad6` (`--token-f951c3a8`)
- **Glow Aura / Ambient Light**: `rgba(152, 85, 255, 0.2)` (`--token-994b20ee`), `#6e0096`
- **Secondary Blue**: `#2765f5` / `#0f63b8` (`--token-5cbd203c`, `--token-c18cf7be`)
- **Deep Indigo Shadow**: `#002a54` / `#0838a6` (`--token-0daa39a8`, `--token-d404af6f`)
- **Violation / Alert Red**: `#E5484D` / `#f77373` (`--token-d27d3ffb`)
- **Verified / Safe Green**: `#30A46C` / `#3DD68C`
- **Gold / Warning Accent**: `#F5A623` / `#FFC53D`

### 1.3 Borders & Outlines
- **Glass Subtle Border**: `rgba(255, 255, 255, 0.06)` (`--token-e4b6e893`)
- **Card Default Border**: `rgba(255, 255, 255, 0.1)` (`--token-3842f5e8`, `--token-12307017`)
- **Active / Hover Border**: `rgba(255, 255, 255, 0.16)` to `rgba(129, 75, 238, 0.4)`
- **Accent Glow Border**: `rgba(129, 75, 238, 0.5)` with `box-shadow: 0 0 15px rgba(129, 75, 238, 0.25)`

### 1.4 Typography & Text Colors
- **Headline / High Contrast**: `#ffffff` (`--token-f45001f0`, `--token-0ed94250`)
- **Primary Text**: `rgba(255, 255, 255, 0.9)` (`#ffffffe6`)
- **Muted / Secondary Text**: `rgba(255, 255, 255, 0.6)` to `rgba(255, 255, 255, 0.7)` (`--token-8f8054d9`)
- **Tertiary / Subtle Labels**: `rgba(255, 255, 255, 0.4)` (`--token-67f537d6`)
- **Muted Slate**: `#999999` (`--token-be5fd20d`)

---

## 2. Typography Hierarchy

### 2.1 Font Families
- **Display Headlines**: `"Cal Sans", "Inter Display", system-ui, sans-serif`
- **Body & Controls**: `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Monospace / Metric Data / Ticker**: `'Fragment Mono', ui-monospace, "SF Mono", Menlo, monospace`
- **Urdu / Nastaliq**: `'Noto Nastaliq Urdu', 'Gulzar', 'Inter', sans-serif`

### 2.2 Scale & Weights
- **Hero Display Wordmark**: `clamp(4rem, 10vw, 7.5rem)` (64px - 120px), font-weight 700 / 800, letter-spacing `-0.04em`, line-height `0.95`
- **H1 (Section Headlines)**: `clamp(2.25rem, 5vw, 3.75rem)` (36px - 60px), font-weight 700, letter-spacing `-0.03em`, line-height `1.1`
- **H2 (Card / Subsection Titles)**: `1.5rem - 2rem` (24px - 32px), font-weight 600, letter-spacing `-0.02em`, line-height `1.2`
- **H3 (Component Titles)**: `1.125rem - 1.25rem` (18px - 20px), font-weight 600, letter-spacing `-0.01em`
- **Body Large**: `1.125rem` (18px), line-height `1.6`, font-weight 400
- **Body Regular**: `0.9375rem` (15px), line-height `1.55`, font-weight 400
- **Small / Badges / Captions**: `0.8125rem` (13px), line-height `1.4`, font-weight 500
- **Mono Stats / Timestamps**: `0.75rem - 0.875rem` (12px - 14px), font-weight 400, letter-spacing `0.02em`

---

## 3. Spacing & Layout Rhythm

- **Max Container Width**: `1280px` (desktop), with `16px` padding (mobile), `24px` (tablet), `32px` (desktop)
- **Section Spacing**: `96px` to `140px` vertical padding (`py-24` to `py-36`)
- **Card Padding**: `20px` to `32px` (`p-5` to `p-8`)
- **Gap Scales**:
  - Grid gaps: `16px` (mobile), `24px` (desktop)
  - Stack gaps: `8px`, `12px`, `16px`, `24px`

---

## 4. Border Radii & Elevation

- **Pill Badges & Buttons**: `9999px` (`rounded-full`)
- **Large Cards / Containers**: `24px` (`rounded-3xl`)
- **Standard Cards / Modals / Drawers**: `16px` (`rounded-2xl`)
- **Input Fields & Small Buttons**: `12px` (`rounded-xl`)
- **Mini Badges / Tooltips**: `8px` (`rounded-lg`)

### Shadows & Glows
- **Card Ambient Shadow**: `0 20px 40px -15px rgba(0, 0, 0, 0.7)`
- **Violet Glow Shadow**: `0 0 35px rgba(129, 75, 238, 0.35)`
- **Subtle Glow Shadow**: `0 0 20px rgba(129, 75, 238, 0.15)`
- **Red Alert Glow**: `0 0 25px rgba(229, 72, 77, 0.35)`
- **Inner Rim Light**: `inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)`

---

## 5. Motion, Transitions & Easing

- **Spring Transitions**: `stiffness: 300, damping: 25`
- **Smooth Easing**: `cubic-bezier(0.16, 1, 0.3, 1)` (out-expo)
- **Fade & Slide In**: `opacity: 0 -> 1, y: 30 -> 0`, duration `0.6s - 0.8s`
- **Marquee Ticker**: Continuous linear translation `x: 0% -> -50%`, duration `25s - 35s`, pause on hover
- **Smooth Scroll**: Lenis smooth scroll with lerp `0.08`
- **3D Card Parallax / Tilt**: Max tilt `10deg`, perspective `1000px`, scale `1.02` on hover
- **Reduced Motion**: Fallback to `transform: none; transition: opacity 0.2s;` when `prefers-reduced-motion: reduce`

---

## 6. Assumptions & Customizations
- Urdu RTL font: Loaded via Google Fonts (`Noto Nastaliq Urdu`).
- OpenStreetMap Dark Tile Provider: CartoDB Dark Matter (`https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`) with no API key required.
- Admin Red Dot specification: Hex `#E5484D` with pulsing radial glow `rgba(229, 72, 77, 0.4)`.


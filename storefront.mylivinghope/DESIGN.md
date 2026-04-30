# Design System: My Living Hope Storefront

## Brand Identity

**Brand essence:** Permission to begin. These cards exist because someone watched people struggle in silence and decided to build a bridge between their hearts and God's Word.

**Visual personality:** Warm, tactile, intimate, intentional. Not slick. Not corporate. Not "wellness brand." The visual feel of a handwritten note left inside a book for someone to find.

## Color Palette

### Primary
| Token | Hex | Role |
|-------|-----|------|
| `forest-green` | `#336F49` | Primary brand, CTAs, accents |
| `green-dark` | `#265438` | Hover states, deep emphasis |
| `green-light` | `#4A8A5F` | Secondary green accents |

### Warm Neutrals
| Token | Hex | Role |
|-------|-----|------|
| `cream` | `#FDF8F5` | Page background, breathing room |
| `soft-blush` | `#F5D7CF` | Warm accent backgrounds |
| `blush-light` | `#FBE9E4` | Subtle warmth, card backgrounds |
| `blush-dark` | `#E8C4BA` | Blush emphasis, borders |

### Dark
| Token | Hex | Role |
|-------|-----|------|
| `charcoal` | `#212021` | Primary text, footer bg |
| `charcoal-light` | `#3a3839` | Secondary dark |

### Text
| Token | Hex | Role |
|-------|-----|------|
| `text-secondary` | `#5a5758` | Body copy |
| `text-muted` | `#706e6f` | Captions, meta text |

### Usage Rules
- **Contrast matters:** Never use green text on green bg, white/50 on charcoal (fails WCAG AA)
- **Section backgrounds should contrast:** Avoid adjacent sections with cream→blush-light (too similar). When sections are adjacent, ensure a clear luminance step.
- **The green section is the ONE dramatic moment.** Use it once per page, max.

## Typography

### Font Stack
- **Headings:** Libre Baskerville (serif) — loaded via Google Fonts
- **Body:** Montserrat (sans-serif) — loaded via Google Fonts

### Type Scale (creative range)
The type scale should have dynamic range — whisper to shout:

| Use | Size | Notes |
|-----|------|-------|
| Hero H1 | `clamp(3rem, 6vw, 5rem)` | Commanding, room to breathe |
| Section H2 (large) | `clamp(2.5rem, 5vw, 4rem)` | Major sections |
| Section H2 (intimate) | `1.5rem` | Quieter sections, pull quotes |
| H3 | `1.25rem–1.5rem` | Card titles, subsections |
| Body | `1rem–1.125rem` | Montserrat, line-height 1.7 |
| Caption/meta | `0.75rem–0.875rem` | Uppercase tracking when used as tags |
| Scripture | Libre Baskerville italic, `1.25rem+` | Always italic, always distinguished |

### Typography Rules
- NOT every heading the same size. Vary deliberately.
- Libre Baskerville italic is the "voice of Scripture" — use it for quotes, card content, emotional emphasis
- Section tags (uppercase, tracked) should NOT appear on every section. Max 3 per page.

## The Card Motif

The prayer card shape is the brand's visual signature. Use it everywhere:

### Card Specifications
- **Aspect ratio:** 2.5:3.5 (standard playing card / prayer card ratio)
- **Corner radius:** `rounded-2xl` (16px) — consistent everywhere
- **Shadow:** `shadow-lg` at rest, `shadow-xl` on hover/emphasis
- **Border:** `border border-charcoal/5` or `border border-soft-blush`

### Card Applications
- **Product showcase:** Actual card imagery (front + back)
- **Testimonials:** Styled as cards, slightly rotated/fanned
- **How it works steps:** Each step IS a card
- **Decorative:** Cards peeking from edges, stacked, fanned
- **Audience cards:** On about page, same card shape

### Card Interactions
- **Hover tilt:** Subtle 3D rotation (`perspective-1000`, `rotateY(2deg)`)
- **Fan effect:** Multiple cards slightly offset and rotated
- **Flip:** Front/back reveal for product demonstration

## Layout System

### Container
- **Max width:** 1400px
- **Padding:** `px-[5%]` (scales with viewport)
- **Full-bleed breaks:** At least one section per page should break the container — edge-to-edge color/image

### Section Rhythm (VARIED, not uniform)
Sections should NOT all have the same padding. Suggested rhythm:
- **Expansive:** `py-28 md:py-40` — hero, major emotional moment
- **Standard:** `py-16 md:py-24` — content sections
- **Compact:** `py-10 md:py-14` — Scripture interludes, transitions
- **Breathing:** A single line of Scripture on a colored field, `py-20` of pure space

### Grid Patterns
Not every section should be the same 2-column layout:
- **Full-width hero** — product/card dominates, text overlaid or alongside
- **60/40 asymmetric** — text-heavy with accent visual
- **Centered editorial** — max-w-2xl, text only, intimate
- **Card fan** — 3-5 cards arranged with rotation/offset
- **Full-bleed image break** — edge-to-edge moment between text sections

## Component Patterns

### Buttons
Two tiers, consistent sizing:

| Tier | Style | Use |
|------|-------|-----|
| Primary | `bg-forest-green text-white rounded-full px-8 py-3.5 font-semibold text-sm` | Main CTAs |
| Secondary | `border-2 border-charcoal text-charcoal rounded-full px-8 py-3.5 font-semibold text-sm` | Secondary actions |

**Rule:** One button size per context. Don't mix `px-8 py-3.5 text-sm` with `px-10 py-4 text-base` on the same page.

### Section Headers
NOT the same pattern every time. Mix these:
- **Tag + H2 + subtitle** — use sparingly (max 2 per page)
- **H2 alone** — large, commanding, no preamble
- **Scripture + H2** — italic Baskerville quote introduces the section
- **No header** — section flows from the previous one naturally

### Testimonials
- Real names (not initials) when available
- Styled as card shapes
- Subtle rotation/offset for visual interest
- On warm background (blush or cream), NOT glassmorphism on green

### Blockquotes / Scripture
- Libre Baskerville italic, always
- Left border accent (forest-green/30)
- Can be standalone sections (Scripture interludes)
- The "voice of God" in the site's visual language

## Animation & Motion

### Principles
- **Purposeful, not decorative.** Every animation should reveal meaning, not add polish.
- **Respect reduced-motion.** All animations disabled via `prefers-reduced-motion: reduce`.
- **Scroll-triggered.** Animations fire on intersection, NOT on page load.

### Animation Library
| Name | Use | Duration |
|------|-----|----------|
| `reveal` | Scroll-in for content blocks | 0.8s ease-out |
| `float` | Decorative card bob | 6s infinite ease-in-out |
| `tilt` | Card hover interaction | 0.3s ease |
| `fan` | Card spread/stack effect | 0.6s ease-out |

### Scroll-triggered setup
Use IntersectionObserver to add `.in-view` class. Animate on `.in-view`, not on mount.

## Responsive Breakpoints

| Breakpoint | Width | Key changes |
|------------|-------|-------------|
| Base | 0-639px | Single column, mobile nav, cards stacked |
| `sm` | 640px | Floating hero cards visible |
| `md` | 768px | 2-3 column grids, desktop padding |
| `lg` | 1024px | Full desktop layout |

### Mobile-Specific Rules
- Hero height: `min-h-[85svh]` (not `100vh` — accounts for browser chrome)
- iPhone safe areas: `viewport-fit=cover` + `env(safe-area-inset-*)` padding
- Hamburger tap target: minimum 48x48px (`p-3`)
- Footer link spacing: `space-y-4` minimum (not `space-y-3`)
- Touch targets: all interactive elements minimum 44x44px

## Accessibility

- **Focus visible:** 2px solid forest-green, 2px offset (white in footer)
- **Color contrast:** All text meets WCAG AA (4.5:1 for body, 3:1 for large text)
- **Skip to content:** Link in header for keyboard users
- **Alt text:** Required on all images (descriptive, not "image of...")
- **Heading hierarchy:** One H1 per page, sequential H2→H3→H4
- **Reduced motion:** All animations suppressed

# Animation & Motion Design: My Living Hope Storefront

## Philosophy

Youth are the primary audience. Every scroll, every hover, every reveal should feel alive — not in a flashy "look at me" way, but in a way that draws them deeper. The motion language should mirror the product's purpose: **stillness that invites you in, then movement that carries you forward.**

Think of it like breathing: inhale (pause, anticipation) → exhale (reveal, motion).

## Asset Scaffolding

Joel is creating these assets — scaffold placeholders that are ready to drop them in:

### 3D Card Renders
- **Location:** `public/images/cards/` 
- **Expected formats:** PNG with transparency, or WebP
- **Naming convention:** `card-front-{emotion}.png`, `card-back-{emotion}.png`
- **Usage:** Hero showcase, product section, scattered decorative cards
- **Scaffold:** Card components accept `src` prop, render stylized placeholder until real image arrives

### Product Photography
- **Location:** `public/images/product/`
- **Expected:** Hero shot, lifestyle shots (hands holding cards, cards on table), detail shots
- **Naming:** `hero.jpg`, `lifestyle-{n}.jpg`, `detail-{n}.jpg`
- **Scaffold:** Image containers with aspect ratios locked, gradient placeholder with subtle shimmer

### 3D Box Animation
- **Location:** `public/images/box/` or `public/video/`
- **Expected:** Video (MP4/WebM) or sprite sequence of box opening to reveal cards
- **Usage:** Hero or product section — the "wow" moment
- **Scaffold:** Container ready for `<video>` element with poster frame, or CSS sprite animation
- **Interaction:** Scroll-triggered or click-triggered reveal

## Animation Library

### 1. Scroll-Triggered Reveals

Every section and key element animates in on scroll via IntersectionObserver.

```
useScrollReveal hook:
- threshold: 0.15 (trigger when 15% visible)
- rootMargin: "0px 0px -50px 0px" (trigger slightly before fully in view)
- once: true (animate in once, don't re-hide)
- Returns: ref + isVisible boolean
```

**Reveal variants:**
| Name | Transform | Use |
|------|-----------|-----|
| `fade-up` | translateY(40px) → 0, opacity 0→1 | Default for most content |
| `fade-in` | opacity 0→1 only | Subtle elements, backgrounds |
| `slide-left` | translateX(-60px) → 0 | Left-column content in 2-col layouts |
| `slide-right` | translateX(60px) → 0 | Right-column content in 2-col layouts |
| `scale-up` | scale(0.9) → 1, opacity 0→1 | Cards, images, featured elements |
| `blur-in` | blur(8px) → 0, opacity 0→1 | Scripture quotes, emotional moments |

**Stagger:** When multiple items reveal together (card grids, feature lists), stagger by 100ms per item using CSS `transition-delay`.

### 2. Card Interactions

**Hover Tilt (3D perspective):**
```
- Container: perspective(1000px)
- On mouse move: rotateX/rotateY based on cursor position (max ±8deg)
- Subtle shadow shift follows the tilt direction
- On mobile: gentle auto-tilt on scroll (CSS only, no JS mouse tracking)
- Duration: real-time tracking (no transition on move, 0.4s ease on leave)
```

**Card Flip:**
```
- Click/tap to flip between front and back
- rotateY(0) → rotateY(180deg)
- Back face shows Scripture + prayer starter
- Duration: 0.6s cubic-bezier(0.4, 0, 0.2, 1)
- Backface-visibility: hidden on both sides
```

**Card Fan/Spread:**
```
- Stack of 3-5 cards, slightly offset
- On scroll or hover: cards spread into a fan (rotate ±15deg, translate outward)
- Each card has a different emotion label visible
- Duration: 0.8s staggered (0.1s per card)
```

**Card Deal:**
```
- Hero entrance animation: cards "dealt" from a deck onto the screen
- Each card slides in from off-screen with rotation
- Stagger: 0.15s per card
- Used once: hero load animation
```

### 3. Hero Animations

**On load (first visit):**
1. Background gradient fades in (0.3s)
2. Main card/product image scales up from 0.8 → 1 (0.6s ease-out)
3. Headline reveals word by word or line by line (staggered 0.1s)
4. Subtitle fades up (0.4s delay)
5. CTAs slide up (0.5s delay)
6. Floating accent cards deal in from edges (0.6s delay, staggered)

**Continuous:**
- Floating cards: gentle bob (translateY ±12px, 6s infinite)
- Background: very subtle gradient shift (hue rotation 2-3deg, 20s infinite)
- Optional: particle/sparkle effect (CSS-only, very subtle light dots drifting)

### 4. Scroll-Driven Sequences

**Product showcase (the "wow" section):**
- As user scrolls into view: 3D box appears, lid opens, cards emerge
- If video asset: autoplay on intersection, pause on exit
- If no video yet: cards fan out from a stacked position
- Buy button pulses gently once the cards are fully revealed

**Scripture interlude:**
- Text fades in word by word (or blur-in)
- Background color transitions smoothly as the section enters
- Creates a "pause" moment — stillness before the next section

**Testimonials:**
- Cards deal in from alternating sides (left, right, left, right)
- Each card has a subtle entry rotation that settles to 0
- On hover: slight lift + shadow increase

### 5. Page Transitions

**Between routes (React Router):**
- Current page fades out (opacity 1→0, 0.2s)
- New page fades in (opacity 0→1, 0.3s)
- Implemented via CSS transitions on the route wrapper
- ScrollToTop fires after transition

### 6. Micro-interactions

**Buttons:**
- Hover: scale(1.03), shadow increase, background color shift
- Click: scale(0.97) briefly (active state), then bounce back
- Duration: 0.15s

**Form inputs:**
- Focus: border color transition + subtle glow (box-shadow)
- Label float: if using floating labels, translateY on focus
- Submit: button shows loading spinner, then checkmark on success

**Navigation:**
- Mobile menu: slides down with staggered link reveals (each link 50ms delay)
- Active link: subtle underline animation (scaleX 0→1 from center)
- Header scroll: background opacity + shadow transition (already implemented, keep)

**Scroll progress:**
- Thin line at top of viewport showing scroll progress through the page
- Color: forest-green, height: 3px
- Optional: only show on long pages

### 7. Loading & Empty States

**Image loading:**
- Gradient placeholder with subtle shimmer animation (skeleton loading)
- Image fades in over 0.3s when loaded
- Prevents layout shift: container has fixed aspect ratio

**Section loading:**
- If any section depends on external data: skeleton pulse animation
- Matching the section's layout shape

## Performance Rules

1. **CSS-first:** Prefer CSS transitions/animations over JS-driven animation. CSS runs on compositor thread, doesn't block main thread.
2. **transform + opacity only:** These properties are GPU-composited. Avoid animating width, height, margin, padding, top/left.
3. **will-change sparingly:** Only add `will-change: transform` on elements that WILL animate. Remove after animation completes if one-shot.
4. **Reduced motion:** ALL animations disabled via `prefers-reduced-motion: reduce`. No exceptions.
5. **IntersectionObserver over scroll listeners:** Never use `window.addEventListener('scroll')` for reveal animations.
6. **No layout thrashing:** Never read layout properties (offsetHeight, getBoundingClientRect) inside animation loops.
7. **Lazy video:** 3D box video loads only when section is near viewport (`loading="lazy"` + IntersectionObserver).
8. **Target 60fps:** If any animation drops frames on a mid-range phone (Snapdragon 665 / Galaxy A12), simplify it.

## Implementation Priority

1. **useScrollReveal hook** — foundation for everything else
2. **Scroll-triggered section reveals** — immediate visual impact across all pages
3. **Card hover tilt** — interactive delight, youth love this
4. **Hero entrance sequence** — first impression
5. **Staggered list reveals** — polish for grids and feature lists
6. **Card flip interaction** — product showcase
7. **Card fan/spread** — decorative and product presentation
8. **Page transitions** — smooth route changes
9. **Micro-interactions** — buttons, form, nav
10. **3D box reveal** — when Joel provides the asset
11. **Scripture blur-in** — emotional pauses
12. **Scroll progress bar** — subtle polish

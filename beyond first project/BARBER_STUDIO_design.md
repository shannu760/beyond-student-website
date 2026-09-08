# BARBER STUDIO — Design Plan

> Premium Modern Barber Shop Website
> Design System, Components, Pages & Development Blueprint

---

## 1. BRAND IDENTITY

### Brand Name
**BARBER STUDIO**

### Tagline
**LOOK SHARP. FEEL CONFIDENT.**

### Brand Personality
Premium · Professional · Masculine · Modern · Confident · Sophisticated · Local & Trustworthy

### Voice & Tone
- Direct, confident, never aggressive
- Warm but refined
- Short sentences, action-oriented
- Masculine without being cliché
- Local and approachable

---

## 2. COLOR SYSTEM

### Primary Palette

| Role | Name | Hex | Usage |
|------|------|-----|-------|
| Background Dark | Charcoal Black | `#1A1A1A` | Hero sections, dark backgrounds |
| Background Deep | Rich Black | `#111111` | Page backgrounds, footer |
| Surface | Dark Surface | `#222222` | Cards on dark backgrounds |
| Surface Elevated | Elevated Dark | `#2A2A2A` | Hover states, raised cards |
| Text Primary | Off White | `#F5F0EB` | Headings, primary text |
| Text Secondary | Warm Gray | `#A89F96` | Body text, descriptions |
| Text Muted | Muted Gray | `#6B6560` | Captions, labels |

### Accent Palette

| Role | Name | Hex | Usage |
|------|------|-----|-------|
| Accent Primary | Muted Gold | `#C9A96E` | CTAs, highlights, icons |
| Accent Hover | Warm Gold | `#D4B87A` | Button hover, active states |
| Accent Subtle | Gold Tint | `#C9A96E1A` | Gold backgrounds at 10% opacity |
| Accent Dark | Deep Bronze | `#A88B5A` | Pressed states, dark accents |

### Functional Palette

| Role | Name | Hex | Usage |
|------|------|-----|-------|
| Success | Sage Green | `#6B8F71` | Confirmed, available, success |
| Warning | Warm Amber | `#D4A843` | Pending, attention |
| Error | Muted Red | `#C75C4A` | Cancelled, errors, destructive |
| Info | Steel Blue | `#7A8FA6` | Informational, links |

### Light Mode (Pages with Light Backgrounds)

| Role | Name | Hex | Usage |
|------|------|-----|-------|
| Background Light | Warm White | `#FAF8F5` | Light section backgrounds |
| Surface Light | Cream | `#F2EDE7` | Cards on light backgrounds |
| Border Light | Soft Border | `#E5DDD3` | Dividers, card borders |
| Text Dark | Near Black | `#1A1A1A` | Text on light backgrounds |

---

## 3. TYPOGRAPHY

### Font Pairing

| Role | Font | Weight | Fallback |
|------|------|--------|----------|
| Display / Hero | Playfair Display | 700, 800 | Georgia, serif |
| Headings | Inter | 600, 700 | -apple-system, sans-serif |
| Body | Inter | 400, 500 | -apple-system, sans-serif |
| Labels / Caps | Inter | 600 | -apple-system, sans-serif |
| Accent / Prices | JetBrains Mono | 500 | monospace |

### Type Scale (Desktop)

| Token | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `display-xl` | 72px | 1.05 | 800 | Hero headline |
| `display-lg` | 56px | 1.1 | 700 | Section headlines |
| `heading-1` | 40px | 1.2 | 700 | Page titles |
| `heading-2` | 32px | 1.25 | 700 | Card titles, subsections |
| `heading-3` | 24px | 1.3 | 600 | Component titles |
| `body-lg` | 18px | 1.6 | 400 | Lead paragraphs |
| `body` | 16px | 1.6 | 400 | Body text |
| `body-sm` | 14px | 1.5 | 400 | Captions, secondary text |
| `label` | 12px | 1.4 | 600 | Labels, tags, uppercase |
| `price` | 28px | 1.2 | 500 | Service prices |
| `stat` | 48px | 1.0 | 700 | Statistics |

### Type Scale (Mobile)

| Token | Size |
|-------|------|
| `display-xl` | 44px |
| `display-lg` | 36px |
| `heading-1` | 32px |
| `heading-2` | 24px |
| `heading-3` | 20px |
| `body-lg` | 16px |
| `body` | 15px |
| `body-sm` | 13px |

---

## 4. SPACING & GRID

### Spacing Scale

| Token | Value |
|-------|-------|
| `xs` | 4px |
| `sm` | 8px |
| `md` | 16px |
| `lg` | 24px |
| `xl` | 32px |
| `2xl` | 48px |
| `3xl` | 64px |
| `4xl` | 96px |
| `section` | 120px |

### Grid System

| Breakpoint | Columns | Gutter | Margin |
|------------|---------|--------|--------|
| Desktop (1440px) | 12 | 24px | 80px |
| Laptop (1280px) | 12 | 20px | 60px |
| Tablet (768px) | 8 | 16px | 32px |
| Mobile (390px) | 4 | 16px | 20px |

### Content Widths

| Token | Value |
|-------|-------|
| `max-content` | 1200px |
| `wide-content` | 1400px |
| `narrow-content` | 800px |

---

## 5. COMPONENTS

### 5.1 Buttons

#### Primary Button
- Background: `#C9A96E` (Muted Gold)
- Text: `#1A1A1A` (Charcoal)
- Height: 48px (desktop), 52px (mobile)
- Padding: 0 32px
- Border-radius: 4px
- Font: Inter 600, 14px, uppercase, letter-spacing 1px
- Hover: `#D4B87A`, slight scale 1.02
- Active: `#A88B5A`, scale 0.98
- Transition: 200ms ease

#### Secondary Button
- Background: transparent
- Border: 1px solid `#C9A96E`
- Text: `#C9A96E`
- Same dimensions as Primary
- Hover: `#C9A96E1A` background fill
- Active: `#C9A96E33` background fill

#### Ghost Button
- Background: transparent
- Text: `#F5F0EB`
- No border
- Hover: `#FFFFFF10` background
- Used for: secondary actions, navigation

#### Dark Button (on light backgrounds)
- Background: `#1A1A1A`
- Text: `#F5F0EB`
- Same dimensions
- Hover: `#2A2A2A`

#### Icon Button
- Size: 40px × 40px
- Border-radius: 50%
- Contains centered icon
- Hover: background highlight

#### WhatsApp Button
- Background: `#25D366` (WhatsApp green)
- Text: white
- Icon: WhatsApp logo
- Floating position: bottom-right, 24px from edges
- Size: 56px × 56px (desktop), 52px × 52px (mobile)
- Shadow: `0 4px 24px rgba(0,0,0,0.3)`
- Pulse animation on first visit

### 5.2 Form Elements

#### Text Input
- Height: 48px
- Background: `#222222`
- Border: 1px solid `#333333`
- Border-radius: 6px
- Text: `#F5F0EB`, Inter 400, 16px
- Placeholder: `#6B6560`
- Focus: border `#C9A96E`, subtle glow `#C9A96E33`
- Label: Inter 600, 12px, uppercase, `#A89F96`, above input

#### Phone Input
- Same as Text Input
- Prefix: country code dropdown (+91)
- Input: 10-digit number
- Validation: real-time format check

#### Dropdown / Select
- Height: 48px
- Same styling as Text Input
- Custom arrow icon (chevron down)
- Options: dark background, hover highlight
- Selected: gold checkmark

#### Search Input
- Height: 44px
- Icon: magnifying glass (left)
- Background: `#2A2A2A`
- Border-radius: 24px (pill shape)
- Clear button (right) when active

### 5.3 Cards

#### Service Card
- Background: `#222222`
- Border-radius: 12px
- Border: 1px solid `#2A2A2A`
- Image: top, 200px height, object-cover, border-radius top
- Content padding: 20px
- Service name: Inter 700, 18px, `#F5F0EB`
- Description: Inter 400, 14px, `#A89F96`
- Duration: Inter 500, 13px, `#C9A96E` with clock icon
- Price: JetBrains Mono 500, 24px, `#F5F0EB`
- Book button: Primary, full-width, bottom
- Hover: border `#C9A96E44`, slight lift `translateY(-2px)`
- Shadow on hover: `0 8px 32px rgba(0,0,0,0.3)`

#### Barber Card
- Background: `#222222`
- Border-radius: 12px
- Portrait: top, aspect-ratio 3/4, object-cover
- Overlay gradient at bottom for name
- Name: Inter 700, 20px, `#F5F0EB` (overlaid on image)
- Position: Inter 400, 14px, `#C9A96E`
- Specialties: tags/pills, small, `#A89F96`
- Rating: star icons + number
- Two buttons: "View Profile" (ghost) + "Book" (primary)

#### Review Card
- Background: `#222222`
- Border-radius: 12px
- Padding: 24px
- Avatar: 48px circle, left
- Name: Inter 600, 16px
- Date: Inter 400, 13px, `#6B6560`
- Stars: 5 gold star icons
- Review text: Inter 400, 15px, `#A89F96`
- "Read more" link for long reviews

#### Portfolio Card
- Border-radius: 8px
- Image: full bleed, aspect-ratio varies
- Category tag: top-left, small pill
- Hover: slight zoom, overlay with icon
- Before/After: split view with draggable divider

#### Booking Summary Card
- Background: `#222222`
- Border-radius: 12px
- Border: 1px solid `#C9A96E33`
- Padding: 24px
- Line items: service, barber, date, time
- Divider line
- Price breakdown: subtotal, deposit, remaining
- CTA: Primary button full-width

### 5.4 Status Indicators

| Status | Background | Text | Icon |
|--------|-----------|------|------|
| Available | `#6B8F7120` | `#6B8F71` | Circle filled |
| Selected | `#C9A96E` | `#1A1A1A` | Checkmark |
| Confirmed | `#6B8F7120` | `#6B8F71` | Check circle |
| Pending | `#D4A84320` | `#D4A843` | Clock |
| Unavailable | `#333333` | `#6B6560` | Strikethrough |
| Cancelled | `#C75C4A20` | `#C75C4A` | X circle |

### 5.5 Navigation

#### Desktop Header
- Height: 72px (normal), 56px (scrolled)
- Background: `#111111` with `backdrop-filter: blur(12px)`
- Border-bottom: `1px solid #222222` (appears on scroll)
- Left: Logo "BARBER STUDIO" in Playfair Display 700, 20px
- Center: nav links Inter 500, 14px, uppercase, letter-spacing 0.5px
- Right: WhatsApp icon + "BOOK APPOINTMENT" primary button
- Active link: gold underline, 2px, animated width

#### Mobile Header
- Height: 60px
- Logo: centered, smaller
- Left: hamburger menu icon (3 lines → X animation)
- Right: phone icon
- Mobile menu: full-screen overlay, dark background, centered nav links vertically

#### Mobile Bottom Navigation
- Height: 64px + safe area
- Background: `#111111` with top border
- 5 items: Home | Services | **Book** | Portfolio | Profile
- "Book" item: larger, gold circle background, elevated
- Active: gold icon + label
- Inactive: `#6B6560` icon + label
- Fixed to bottom, always visible

### 5.6 Booking Stepper

- Horizontal bar, 5 steps
- Each step: circle with number + label below
- Active step: gold fill, white number
- Completed step: gold fill, checkmark icon
- Upcoming: dark fill, gray number
- Connecting line: gold for completed, gray for upcoming
- Step labels: Inter 600, 11px, uppercase
- Current step pulses subtly

### 5.7 Calendar Component

- Month header: Inter 600, 18px, with left/right arrows
- Day headers: S M T W T F S, Inter 600, 12px, uppercase
- Day cells: 44px × 44px, centered number
- Available: Inter 400, `#F5F0EB`, hover gold background
- Selected: gold background, dark text
- Unavailable: `#6B6560`, strikethrough or dimmed
- Today: subtle border outline
- Past dates: `#333333`, not clickable
- Mobile: full-width grid, larger touch targets (48px)

### 5.8 Time Slot Selector

- Grid: 3 columns desktop, 2 columns mobile
- Slot button: height 44px, rounded
- Available: dark background, light text, border `#333333`
- Selected: gold background, dark text
- Unavailable: `#222222`, `#6B6560`, not clickable, diagonal line pattern
- AM/PM labels on left side
- Scrollable if many slots

### 5.9 Modal

- Background: `#111111E6` (90% opacity)
- Content: `#222222`, border-radius 16px
- Max-width: 480px (mobile: full-width, rounded top)
- Close: X button top-right
- Animation: slide up (mobile), fade scale (desktop)
- Backdrop click to close

### 5.10 Toast Notifications

- Position: top-right (desktop), top-center (mobile)
- Background: `#222222`
- Border-radius: 8px
- Border-left: 4px colored by type (success/error/info)
- Icon + message + close button
- Auto-dismiss: 4 seconds
- Animation: slide in from right, fade out

### 5.11 Image Gallery / Lightbox

- Grid: masonry layout, 2-3 columns
- Click to open lightbox
- Lightbox: full-screen dark overlay
- Image centered, max 90% viewport
- Left/right arrows for navigation
- Close button top-right
- Caption below image
- Before/After: draggable divider, split view

### 5.12 Tabs

- Horizontal tab bar
- Tab: Inter 600, 14px, uppercase
- Active: gold text + 2px gold underline
- Inactive: `#6B6560`
- Content area below, smooth transition

### 5.13 Referral Code Display

- Code: JetBrains Mono 700, 24px, `#C9A96E`
- Background: `#C9A96E10`
- Border: 1px dashed `#C9A96E`
- Border-radius: 8px
- Copy button: icon, right side
- Share button: WhatsApp styled, below

---

## 6. PAGE LAYOUTS

### 6.1 HOME PAGE

```
┌─────────────────────────────────────────┐
│  NAVBAR (sticky)                        │
│  Logo | Nav Links | WhatsApp | Book     │
├─────────────────────────────────────────┤
│                                         │
│  HERO SECTION                           │
│  Full-bleed background image            │
│  Dark overlay gradient                  │
│                                         │
│  BARBER STUDIO (small caps label)       │
│                                         │
│  LOOK SHARP.                            │
│  FEEL CONFIDENT.                        │
│                                         │
│  Premium cuts, grooming, and styling... │
│                                         │
│  [BOOK APPOINTMENT]  [EXPLORE SERVICES] │
│                                         │
│  ★★★★★ 4.9 Google Rating               │
│                                         │
├─────────────────────────────────────────┤
│  QUICK BOOKING WIDGET                   │
│  Service ▾ | Barber ▾ | Date ▾ | Time ▾ │
│  [FIND AVAILABLE SLOTS]                 │
├─────────────────────────────────────────┤
│                                         │
│  TRUST SECTION                          │
│  4.9★ | 1,000+ | Experienced | 24/7    │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  SERVICES PREVIEW                       │
│  "OUR SERVICES" heading                 │
│  4 service cards in row                 │
│  [VIEW ALL SERVICES]                    │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  BARBERS PREVIEW                        │
│  "MEET OUR BARBERS" heading             │
│  3 barber cards in row                  │
│  [VIEW ALL BARBERS]                     │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  PORTFOLIO PREVIEW                      │
│  "OUR WORK" heading                     │
│  Masonry grid, 6-8 images               │
│  [VIEW FULL PORTFOLIO]                  │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  REVIEWS SECTION                        │
│  "WHAT OUR CLIENTS SAY"                 │
│  Overall rating + 3 review cards        │
│  [READ MORE REVIEWS]                    │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  REFER & EARN CTA                       │
│  "REFER A FRIEND. GET REWARDED."        │
│  [REFER NOW]                            │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  LOCATION & MAP                         │
│  Google Maps embed                      │
│  Address, Hours, Phone                  │
│  [GET DIRECTIONS]  [CHAT ON WHATSAPP]   │
│                                         │
├─────────────────────────────────────────┤
│  FOOTER                                 │
│  Logo | Links | Hours | Socials | ©     │
└─────────────────────────────────────────┘
```

### 6.2 SERVICES PAGE

```
┌─────────────────────────────────────────┐
│  NAVBAR                                 │
├─────────────────────────────────────────┤
│  PAGE HEADER                            │
│  "OUR SERVICES"                         │
│  Premium grooming services tailored...  │
├─────────────────────────────────────────┤
│  CATEGORY TABS                          │
│  All | Hair | Beard | Grooming | Packs  │
├─────────────────────────────────────────┤
│  SERVICE CARDS GRID                     │
│  3 columns (desktop), 1 column (mobile) │
│  Each card: image, name, desc, price,   │
│  duration, [BOOK NOW]                   │
├─────────────────────────────────────────┤
│  FOOTER                                 │
└─────────────────────────────────────────┘
```

### 6.3 BOOKING FLOW (Multi-Step)

```
┌─────────────────────────────────────────┐
│  NAVBAR                                 │
├─────────────────────────────────────────┤
│  BOOKING STEPPER                        │
│  ① Service → ② Barber → ③ Date →       │
│  ④ Time → ⑤ Details → ⑥ Pay → ⑦ Done  │
├─────────────────────────────────────────┤
│                                         │
│  STEP CONTENT                           │
│  (varies by step)                       │
│                                         │
│  Step 1: Service cards grid             │
│  Step 2: Barber cards row               │
│  Step 3: Calendar component             │
│  Step 4: Time slot grid                 │
│  Step 5: Name, Phone, Email form        │
│  Step 6: Payment summary + CTA          │
│  Step 7: Confirmation card              │
│                                         │
├─────────────────────────────────────────┤
│  [BACK]                    [CONTINUE]   │
│  (ghost button)          (primary btn)  │
└─────────────────────────────────────────┘
```

### 6.4 BARBERS PAGE

```
┌─────────────────────────────────────────┐
│  NAVBAR                                 │
├─────────────────────────────────────────┤
│  PAGE HEADER                            │
│  "MEET OUR TEAM"                        │
│  Experienced barbers who know...        │
├─────────────────────────────────────────┤
│  BARBER CARDS GRID                      │
│  3 columns (desktop), 2 mobile          │
│  Each: portrait, name, position,        │
│  specialties, rating, [BOOK]            │
├─────────────────────────────────────────┤
│  FOOTER                                 │
└─────────────────────────────────────────┘
```

### 6.5 PORTFOLIO PAGE

```
┌─────────────────────────────────────────┐
│  NAVBAR                                 │
├─────────────────────────────────────────┤
│  PAGE HEADER                            │
│  "OUR WORK"                             │
│  See the quality of our craftsmanship.  │
├─────────────────────────────────────────┤
│  CATEGORY TABS                          │
│  All | Haircuts | Fades | Beard |       │
│  Styling | Before/After                 │
├─────────────────────────────────────────┤
│  MASONRY GALLERY GRID                   │
│  3 columns desktop, 2 tablet, 1 mobile  │
│  Click → Lightbox                       │
│  Before/After → Split slider            │
├─────────────────────────────────────────┤
│  FOOTER                                 │
└─────────────────────────────────────────┘
```

### 6.6 REVIEWS PAGE

```
┌─────────────────────────────────────────┐
│  NAVBAR                                 │
├─────────────────────────────────────────┤
│  PAGE HEADER                            │
│  "WHAT OUR CLIENTS SAY"                 │
│  ★★★★★ 4.9 Google Rating (1,000+)      │
├─────────────────────────────────────────┤
│  REVIEW CARDS GRID                      │
│  2 columns desktop, 1 mobile            │
│  Each: avatar, name, stars, review,     │
│  date                                   │
├─────────────────────────────────────────┤
│  [LOAD MORE REVIEWS]                    │
├─────────────────────────────────────────┤
│  FOOTER                                 │
└─────────────────────────────────────────┘
```

### 6.7 REFER & EARN PAGE

```
┌─────────────────────────────────────────┐
│  NAVBAR                                 │
├─────────────────────────────────────────┤
│  HERO                                   │
│  "REFER A FRIEND. GET REWARDED."        │
│  Share your code, earn rewards.         │
├─────────────────────────────────────────┤
│  REFERRAL DASHBOARD                     │
│  ┌─────────────────────────────────┐    │
│  │ YOUR REFERRAL CODE              │    │
│  │ [ BARBER123      ] [COPY]       │    │
│  │                                 │    │
│  │ YOUR REFERRAL LINK              │    │
│  │ [https://barber.studio/r/... ]  │    │
│  │                                 │    │
│  │ [COPY CODE] [SHARE ON WHATSAPP] │    │
│  └─────────────────────────────────┘    │
│                                         │
│  REWARD TIERS                           │
│  1 Friend → ₹XXX OFF                    │
│  3 Friends → ₹XXX OFF                   │
│  5 Friends → FREE GROOMING              │
│                                         │
│  YOUR PROGRESS                          │
│  ████████░░░░ 2/3 to next reward        │
│                                         │
│  REFERRAL HISTORY                       │
│  Name | Status | Date | Reward          │
├─────────────────────────────────────────┤
│  FOOTER                                 │
└─────────────────────────────────────────┘
```

### 6.8 WAITING ROOM PAGE

```
┌─────────────────────────────────────────┐
│  NAVBAR                                 │
├─────────────────────────────────────────┤
│                                         │
│  "YOUR BARBER WILL BE READY SOON."      │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  YOUR NUMBER    NOW SERVING     │    │
│  │    #21            #18           │    │
│  │                                 │    │
│  │  ESTIMATED WAIT: 12 MIN         │    │
│  │  ASSIGNED BARBER: ARJUN         │    │
│  └─────────────────────────────────┘    │
│                                         │
│  PROGRESS BAR                           │
│  ████████░░░░░░░░░░░░ (you are here)    │
│                                         │
│  "PLAY WHILE YOU WAIT"                  │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │
│  │ Ludo │ │Puzzle│ │Memory│ │React │   │
│  └──────┘ └──────┘ └──────┘ └──────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### 6.9 BOOKING CONFIRMATION PAGE

```
┌─────────────────────────────────────────┐
│  NAVBAR                                 │
├─────────────────────────────────────────┤
│                                         │
│  ✓                                     │
│  "YOU'RE BOOKED."                       │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  BARBER STUDIO                  │    │
│  │                                 │    │
│  │  Service: Classic Haircut       │    │
│  │  Barber:  Arjun                 │    │
│  │  Date:    12 September          │    │
│  │  Time:    5:30 PM               │    │
│  │  Deposit: ₹XXX                  │    │
│  │  Booking: #BS10294              │    │
│  └─────────────────────────────────┘    │
│                                         │
│  [ADD TO CALENDAR]                      │
│  [OPEN WHATSAPP]                        │
│  [VIEW BOOKING]                         │
│                                         │
│  "We'll send you a reminder 24 hours    │
│   before your appointment."             │
│                                         │
└─────────────────────────────────────────┘
```

### 6.10 CUSTOMER ACCOUNT PAGE

```
┌─────────────────────────────────────────┐
│  NAVBAR                                 │
├─────────────────────────────────────────┤
│  SIDEBAR (desktop) / Tabs (mobile)      │
│  Overview | Bookings | History |        │
│  Rewards | Profile                      │
├─────────────────────────────────────────┤
│  CONTENT AREA                           │
│                                         │
│  Upcoming Appointment Card              │
│  ┌─────────────────────────────────┐    │
│  │  HAIRCUT + BEARD               │    │
│  │  Barber: Arjun                  │    │
│  │  12 September, 5:30 PM          │    │
│  │  Status: CONFIRMED              │    │
│  │  [RESCHEDULE] [CANCEL] [VIEW]   │    │
│  └─────────────────────────────────┘    │
│                                         │
│  Rewards Section                        │
│  Referral Code: BARBER123               │
│  Total Earned: ₹XXX                     │
│                                         │
│  Booking History Table                  │
│  Service | Barber | Date | Status       │
│                                         │
├─────────────────────────────────────────┤
│  FOOTER                                 │
└─────────────────────────────────────────┘
```

---

## 7. PAGE-BY-PAGE SPECIFICATIONS

### 7.1 HOME PAGE

#### Hero Section
- Height: 100vh (desktop), 85vh (mobile)
- Background: high-quality barber shop interior photo
- Overlay: linear-gradient `#111111CC` to `#11111166` (dark gradient)
- Content: centered vertically, left-aligned (desktop), centered (mobile)
- Label: "BARBER STUDIO" in Inter 600, 12px, uppercase, letter-spacing 3px, `#C9A96E`
- Headline: "LOOK SHARP.\nFEEL CONFIDENT." in Playfair Display 800
- Subtext: Inter 400, 18px, `#A89F96`
- CTAs: Primary + Secondary buttons side by side
- Trust: star rating below CTAs
- Scroll indicator: animated chevron at bottom

#### Quick Booking Widget
- Position: overlapping hero bottom by 40px (desktop), below hero (mobile)
- Background: `#222222`
- Border-radius: 16px
- Shadow: `0 16px 48px rgba(0,0,0,0.4)`
- Layout: 4 fields in a row (desktop), stacked (mobile)
- Each field: label + dropdown-style selector
- CTA: full-width on mobile, right-aligned on desktop

#### Trust Section
- Background: `#1A1A1A`
- 4 columns (desktop), 2×2 (tablet), stacked (mobile)
- Each: large stat number + label + icon
- Divider lines between items (desktop)

#### Services Preview
- Background: `#111111`
- 4 service cards in a row (desktop), horizontal scroll (mobile)
- Section heading with gold underline accent

#### Barbers Preview
- Background: `#1A1A1A`
- 3 barber cards centered
- Background texture: subtle noise pattern

#### Portfolio Preview
- Background: `#111111`
- Masonry grid, 6-8 images
- Hover: slight zoom + overlay

#### Reviews
- Background: `#1A1A1A`
- Overall rating large display
- 3 review cards in carousel (mobile) / row (desktop)

#### Refer & Earn CTA
- Background: `#222222` with subtle gold gradient overlay
- Centered content, large headline, CTA button

#### Location
- Full-width Google Maps embed (500px height)
- Overlapping info card on the left
- Address, hours, phone, buttons

### 7.2 SERVICES PAGE

- Category filter tabs below header
- Grid: 3 columns desktop, 2 tablet, 1 mobile
- Filter animation: fade + height transition
- Each card fully clickable, plus explicit "Book Now" button

### 7.3 BOOKING FLOW

- Progress bar: sticky at top, below navbar
- Each step fills the main content area
- Back/Continue buttons: sticky at bottom (mobile), inline (desktop)
- Form validation: real-time, inline error messages
- Confirmation: celebratory animation (subtle confetti or checkmark animation)

### 7.4 PORTFOLIO

- Masonry grid with varying aspect ratios
- Category filter with smooth transition
- Lightbox: keyboard navigation (arrows, escape)
- Before/After: horizontal drag slider with "Before" / "After" labels

### 7.5 WAITING ROOM

- Auto-refresh every 30 seconds (simulated)
- Progress bar animates smoothly
- Mini-game cards: hover effect, open in modal
- Subtle pulse animation on "NOW SERVING" number

---

## 8. ANIMATIONS & MICRO-INTERACTIONS

### Global
- Page transitions: fade 200ms
- Scroll reveal: elements fade-up 400ms, stagger 100ms
- Hover transitions: 200ms ease on all interactive elements

### Buttons
- Hover: scale 1.02, brightness 1.05
- Click: scale 0.98
- Loading state: spinner replaces text

### Cards
- Hover: `translateY(-4px)`, shadow increase
- Click: scale 0.98

### Calendar
- Day selection: scale bounce 0.9 → 1.0
- Month transition: slide left/right

### Time Slots
- Selection: background color transition 200ms
- Unavailable: diagonal stripe pattern

### Booking Confirmation
- Checkmark: draw animation (SVG path)
- Card: slide up + fade in
- Confetti: optional, subtle, 2-second burst

### Page Load
- Hero text: stagger reveal from bottom
- Navigation: fade in from top
- Booking widget: slide up from below

### Scroll
- Parallax on hero image (subtle, desktop only)
- Section reveals on scroll entry
- Navbar shrink on scroll

---

## 9. IMAGE TREATMENT

### Hero Images
- Full-bleed, high-resolution (1920×1080 minimum)
- Dark overlay gradient for text readability
- Subtle vignette

### Service Images
- Aspect ratio: 4:3 or 16:9
- Consistent warm lighting treatment
- Slight desaturation for premium feel
- Border-radius: top corners of card

### Barber Portraits
- Aspect ratio: 3:4 (portrait)
- Professional studio lighting
- Consistent background (dark/neutral)
- Slight warm tone grade

### Portfolio Images
- Mixed aspect ratios for masonry
- Consistent color grading
- Before/After: identical framing

### Icons
- Style: outlined, 2px stroke
- Size: 24px default
- Color: inherits text color
- Gold accent on active states

---

## 10. RESPONSIVE BEHAVIOR

### Desktop (1440px)
- Full navigation visible
- 12-column grid
- Side-by-side layouts
- Hover states active
- Large typography

### Laptop (1280px)
- Slightly reduced margins
- Same layout as desktop
- Slightly smaller typography

### Tablet (768px)
- Hamburger menu
- 8-column grid
- 2-column card grids
- Stacked layouts for complex sections
- Touch-friendly targets

### Mobile (390px)
- Hamburger menu + bottom navigation
- 4-column grid
- Single column cards
- Swipeable horizontal carousels
- Sticky booking CTA
- Large touch targets (min 44px)
- Bottom-sheet modals
- Simplified forms

---

## 11. ACCESSIBILITY

- Minimum contrast ratio: 4.5:1 for body text
- Minimum contrast ratio: 3:1 for large text
- Focus visible outlines on all interactive elements
- ARIA labels on icons and buttons
- Keyboard navigation support
- Screen reader friendly form labels
- Skip-to-content link
- Reduced motion media query support
- Alt text placeholders for all images

---

## 12. PERFORMANCE TARGETS

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Time to Interactive | < 3.0s |
| Cumulative Layout Shift | < 0.1 |
| Total page weight | < 500KB (excluding images) |
| Image format | WebP with JPEG fallback |
| Lazy loading | All below-fold images |

---

## 13. DEVELOPMENT NOTES

### Recommended Tech Stack
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod
- **State:** Zustand or React Context
- **Maps:** Google Maps React API
- **Payments:** Razorpay (for deposits)
- **WhatsApp:** wa.me link integration
- **Calendar:** Custom component or react-datepicker

### Component Architecture
```
/components
  /layout
    Navbar.tsx
    Footer.tsx
    MobileNav.tsx
    Layout.tsx
  /ui
    Button.tsx
    Input.tsx
    Select.tsx
    Card.tsx
    Badge.tsx
    Modal.tsx
    Toast.tsx
    Tabs.tsx
    Calendar.tsx
    TimeSlots.tsx
  /booking
    BookingStepper.tsx
    ServiceSelector.tsx
    BarberSelector.tsx
    DatePicker.tsx
    TimePicker.tsx
    DetailsForm.tsx
    PaymentSummary.tsx
    Confirmation.tsx
  /sections
    Hero.tsx
    QuickBooking.tsx
    TrustBar.tsx
    ServicesPreview.tsx
    BarbersPreview.tsx
    PortfolioGrid.tsx
    ReviewsCarousel.tsx
    ReferralCTA.tsx
    LocationMap.tsx
  /pages
    Home.tsx
    Services.tsx
    Booking.tsx
    Barbers.tsx
    Portfolio.tsx
    Reviews.tsx
    Referral.tsx
    WaitingRoom.tsx
    Confirmation.tsx
    Account.tsx
```

---

## 14. PLACEHOLDER CONTENT

### Services
| Service | Duration | Price | Description |
|---------|----------|-------|-------------|
| Classic Haircut | 30 min | ₹XXX | Clean, timeless haircut tailored to your style |
| Haircut + Beard | 45 min | ₹XXX | Complete haircut and beard styling |
| Beard Styling | 20 min | ₹XXX | Precision shaping and finishing |
| Premium Grooming | 60 min | ₹XXX | Complete grooming experience |
| Hot Towel Shave | 25 min | ₹XXX | Traditional straight razor shave |
| Kids Haircut | 20 min | ₹XXX | Gentle styling for young gentlemen |

### Barbers
| Name | Position | Specialties | Rating |
|------|----------|-------------|--------|
| Arjun | Senior Barber | Fade Cuts, Beard Styling, Modern Haircuts | 4.9 |
| Vikram | Lead Stylist | Classic Cuts, Styling, Precision Fades | 4.8 |
| Raj | Barber | Beard Design, Hot Towel Shave, Textured Cuts | 4.9 |

### Reviews (Placeholders)
- "Best barber experience in the city. Arjun understood exactly what I wanted." — Rahul M.
- "Clean shop, great atmosphere, and the fade was perfect. Highly recommend." — Amit K.
- "Been coming here for 6 months. Never disappointed. The online booking is so easy." — Priya S.

---

## 15. SEO & METADATA

### Page Titles
- Home: `BARBER STUDIO | Premium Grooming & Online Booking`
- Services: `Our Services | BARBER STUDIO`
- Booking: `Book Appointment | BARBER STUDIO`
- Barbers: `Meet Our Barbers | BARBER STUDIO`
- Portfolio: `Our Work | BARBER STUDIO`
- Reviews: `Client Reviews | BARBER STUDIO`

### Open Graph
- Image: 1200×630px branded card
- Type: website
- Locale: en_IN

### Schema Markup
- LocalBusiness
- Service
- Review
- FAQPage
- BreadcrumbList

---

## 16. WHATSAPP INTEGRATION

### Booking Flow
- After confirmation: "Chat on WhatsApp" button
- Pre-filled message: "Hi, I've booked a [Service] with [Barber] on [Date] at [Time]. Booking ID: #XXX"

### Quick Contact
- Floating button: opens wa.me with pre-filled greeting
- Pre-filled: "Hi BARBER STUDIO! I'd like to book an appointment."

### Referral Sharing
- "Share on WhatsApp" button
- Pre-filled: "Check out BARBER STUDIO! Use my code BARBER123 for ₹XXX off your first visit. Book at [link]"

---

> **This design plan is ready for Stitch upload and frontend development handoff.**

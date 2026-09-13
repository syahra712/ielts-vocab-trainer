# IELTS Vocab Trainer

## Stack
- Next.js 16 App Router + TypeScript + Tailwind CSS 4
- Firebase JS SDK v9+ (Auth + Firestore, client-side only)
- No live Claude API — all tutor content is pre-generated in word JSON files

## Design System — "Direction B: Soft White + Slate Blue"

Every frontend page and component must follow this design system. When making UI changes, reference these tokens and patterns exactly.

### Color Palette

| Role | Hex | Usage |
|------|-----|-------|
| **Background** | `#fcfcfb` | Page background, main canvas |
| **Card surface** | `#f0f4f8` | Default card/tile background (slate-tinted) |
| **Card surface alt** | `#fef9f0` | Warm-tinted cards (streaks, amber stats) |
| **Card surface success** | `#f0f8f4` | Success/mastered cards |
| **Card border** | `#ededec` | Card borders, dividers |
| **Divider light** | `#f0f0ee` | List item separators |
| **Primary accent** | `#3d5a80` | CTA buttons, active nav, primary actions |
| **Primary text** | `#1a1a2e` | Headings, bold labels, word display |
| **Secondary text** | `#8a8a9a` | Subtitles, labels, descriptions |
| **Muted text** | `#b0b0b8` | Inactive nav, placeholders |
| **Stat blue** | `#3d5a80` | "Words due" numbers |
| **Stat amber** | `#9a6b20` | Streak numbers, warm accents |
| **Stat green** | `#2d6a4f` | Mastered/correct numbers |
| **Stat purple** | `#8b5e83` | Technology topic, variety accent |
| **Success green** | `#2d6a4f` | Correct answers, success states |
| **Error red** | `#a33030` | Wrong answers, error states |
| **Success bg** | `#f0f8f4` | Correct answer background tint |
| **Error bg** | `#fdf0f0` | Wrong answer background tint |

### Typography

- **Font family**: System sans-serif stack (`var(--font-sans)` from Geist, falls back to system UI)
- **Headings**: `font-weight: 500` (medium, not bold), `color: #1a1a2e`
- **Greeting/page title**: 22px, weight 500
- **Stat numbers**: 28px, weight 500, `font-variant-numeric: tabular-nums`
- **Body/labels**: 13px, weight 400-500
- **Small labels**: 11px, uppercase, `letter-spacing: 0.5px`, `color: #8a8a9a`

### Layout & Spacing

- **Max width**: `max-w-lg` (32rem / 512px) centered container for mobile-first
- **Page padding**: 20px top, 16px sides, 80px bottom (for nav clearance)
- **Card border-radius**: 14px for bento cards, 12px for smaller items
- **Card padding**: 16px
- **Grid gaps**: 10px between bento cards, 8px between list items
- **Bottom nav height**: 56px, sticky at bottom

### Component Patterns

#### Bento stat cards
- 2-column grid, each card has its own subtle tint background
- Large number (28px/500) + small label (11px uppercase)
- Tint colors: slate-blue `#f0f4f8`, warm `#fef9f0`, green `#f0f8f4`, neutral `#fcfcfb`

#### CTA button
- Full width, `border-radius: 12px`, `padding: 14px`
- Background `#3d5a80`, white text, weight 500, 14px
- No box-shadow, no 3D effect — flat and modern

#### Topic progress rows
- Dot indicator (8px circle, colored per topic) + name + progress bar + fraction
- Progress bar: 4px height, `#f0f0ee` track, colored fill per topic
- Separated by 0.5px `#f0f0ee` dividers

#### Topic colors
| Topic | Dot/bar color |
|-------|---------------|
| Academic | `#3d5a80` |
| Environment | `#9a6b20` |
| Society | `#2d6a4f` |
| Technology | `#8b5e83` |
| Health | `#a33030` |
| Education | `#3d5a80` |
| Economy | `#9a6b20` |

#### Study mode cards (flashcard, fill-gap, speed quiz)
- White `#fcfcfb` background, `border: 0.5px solid #ededec`, `border-radius: 14px`
- Mode pill/badge: small colored background chip (e.g. `#f0f4f8` + `#3d5a80` text)
- Answer buttons: bordered with 0.5px, rounded 12px
- Correct state: `border: #2d6a4f`, `background: #f0f8f4`, `color: #2d6a4f`
- Wrong state: `border: #a33030`, `background: #fdf0f0`, `color: #a33030`
- Dimmed/unselected: `opacity: 0.45`

#### Session complete
- Stats in a 3-column row (accuracy, XP, streak)
- Per-word results list with correct/missed badges
- Badges: small pill, success or error background tint + matching text color

#### Bottom navigation
- Background matches page `#fcfcfb`, top border `0.5px solid #ededec`
- Icons: Tabler-style SVG, 20px
- Inactive: `#b0b0b8`, Active: `#3d5a80`
- Labels: 10px

#### Streak card
- Full-width, warm background `#fef9f0`, border `#f5edd8`
- Streak number in a pill with `#fef3e2` background, `#9a6b20` text

### Anti-patterns (do NOT use)
- No glassmorphism (no backdrop-filter blur, no semi-transparent white cards)
- No gradients on backgrounds or buttons
- No box-shadows or drop-shadows on cards
- No indigo/purple primary color
- No 3D chunky buttons with bottom shadows
- No dark mode (light-only for now)
- No emoji as icons in the nav bar (use SVG/Tabler icons)

## Git Conventions
- Small, incremental commits with descriptive messages
- Never add Co-Authored-By lines

## Project Structure
- Word data lives in `src/data/words/*.json` (7 topic files, 86 words total)
- Firebase config in `.env.local` (gitignored)
- SM-2 spaced repetition in `src/lib/srs/`
- Gamification (XP, streaks) in `src/lib/gamification/`

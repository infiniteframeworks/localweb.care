# localweb.care — Brand Style Guide

*Friendly neighborhood website care, by humans who actually pick up the phone.*

---

## Brand Personality

**The vibe:** Imagine the local diner where the owner remembers your coffee order, except for websites. We're the trusted neighbor who fixes things, explains things in plain English, and doesn't make small business owners feel stupid for asking "what's a DNS?"

**Three words:** Neighborly. Capable. Unfussy.

**We sound like:**
- A friendly expert, not a tech bro
- A small business owner talking to another small business owner
- Someone who says "no worries, I've got you" and means it

**We don't sound like:**
- A corporate IT firm ("synergize your digital transformation")
- An agency ("disruptive cutting-edge solutions")
- A condescending nephew who "knows computers"

**Voice cheat sheet:**
- ✅ "Your site went down at 2am. We fixed it before your coffee."
- ❌ "Leveraging proactive monitoring infrastructure to maximize uptime."
- ✅ "Backups, updates, fixes. Boring stuff handled."
- ❌ "Enterprise-grade managed hosting solutions."

---

## Color Palette

The palette is built around **Porch Light Yellow** — warm, welcoming, the color of a "come on in" sign. It's anchored by deep, friendly navy and softened with cream and clay.

### Primary

| Name | Hex | Usage |
|---|---|---|
| **Porch Light** | `#F5C84B` | Primary brand color. Buttons, highlights, "the yellow thing you remember." |
| **Stoop Navy** | `#1F3A5F` | Headlines, body text on light backgrounds, deep navy that feels trustworthy without being corporate. |
| **Front Door Red** | `#D9594C` | Accent. Use sparingly for emphasis, alerts, "click me" moments. |

### Secondary

| Name | Hex | Usage |
|---|---|---|
| **Fresh Bread** | `#FAF3E3` | Default background. Warmer than white, friendlier than beige. |
| **Terracotta** | `#C97B5A` | Secondary accent for illustrations, dividers, warm touches. |
| **Mint Awning** | `#7FB5A1` | Tertiary accent. Success states, "all good" indicators. |

### Neutrals

| Name | Hex | Usage |
|---|---|---|
| **Sidewalk** | `#3D3D3D` | Body text on cream backgrounds. |
| **Chalk** | `#E8E0CC` | Subtle borders, card backgrounds, dividers. |
| **Paper** | `#FFFCF5` | Highest-contrast background when needed (forms, modals). |

### Rules of Thumb

- **60/30/10:** 60% Fresh Bread or Paper, 30% Stoop Navy (text and structure), 10% Porch Light Yellow (the moments that matter).
- **Red is a guest, not a roommate.** Front Door Red only appears once or twice per screen.
- **Never** put yellow text on a white background. Yellow is for backgrounds and shapes, not body copy.
- Always pair Porch Light Yellow with Stoop Navy for text — it gives the contrast yellow can't carry alone.

---

## Typography

A friendly serif for headlines (warmth, personality, the "hand-painted shop sign" feeling) paired with a clean, readable sans for body.

### Headline Font: **Fraunces**
A characterful serif with soft optical curves. Free on Google Fonts. Use the variable weights to keep it playful — 500 for most headlines, 900 for hero moments.

- H1: Fraunces 700, 56–72px, slight negative tracking (-0.02em)
- H2: Fraunces 600, 36–44px
- H3: Fraunces 500, 24–28px

### Body Font: **DM Sans**
A modern geometric sans with friendly proportions. Free on Google Fonts. Reads beautifully at small sizes.

- Body: DM Sans 400, 17px, line-height 1.6
- Small/captions: DM Sans 500, 14px
- Buttons: DM Sans 600, 16px, slight positive tracking (+0.02em)

### Accent Font: **Caveat** (use sparingly)
A handwritten script for the occasional "PSA from your neighbor" touch — handwritten notes, callouts, "p.s." moments. Use **once per page, max.**

---

## Logo & Mark

**Wordmark concept:** "localweb.care" set in Fraunces, all lowercase, with "web.care" emphasized in Stoop Navy and "local" in a slightly smaller, warmer Terracotta. The period after "web" gets a small yellow circle behind it — the porch light.

**Symbol:** A tiny house silhouette where the door is the lowercase "c" of care. Works as a favicon, app icon, or standalone mark on dark backgrounds.

---

## Visual Style

**Shapes:** Soft, rounded everything. Border-radius 12–16px on cards, 999px (full pill) on buttons. Nothing in this brand has a sharp 90° corner unless it's a deliberate counterpoint.

**Illustration style:** Simple line-and-fill illustrations in the brand palette. Think children's book meets architectural sketch — houses, plants, mailboxes, coffee cups, hand-drawn arrows. Avoid stock-photo people. Avoid 3D renders. Avoid isometric tech illustration entirely.

**Photography:** When used, real photos of real local businesses — storefronts, hands on keyboards, handwritten chalkboards. Warm grading, never cold blue tones.

**Texture:** A subtle paper-grain noise overlay (3–5% opacity) on Fresh Bread backgrounds gives everything a printed-zine feel without being heavy-handed.

**Iconography:** Rounded line icons, 2px stroke. Lucide or Phosphor (regular weight) work well out of the box.

---

## Tone in UI

**Buttons:**
- Primary: "Let's chat" (not "Submit" or "Get Started")
- Secondary: "Tell me more"
- Destructive: "Yeah, delete it" (not "Confirm")

**Empty states:** "Nothing here yet — but that's a good thing, means nothing's broken."

**Error messages:** "Hmm, something didn't go through. Want to try again, or shoot us an email?"

**Loading states:** "One sec, brewing the coffee..." / "Checking on things..."

**404 page:** "This page took a sick day. Want to head back to the front porch?"

---

## What to Avoid

- Gradient mesh backgrounds (too SaaS-y)
- Purple, period — it doesn't live here
- Stock photos of diverse-team-pointing-at-laptop
- Tech jargon in UI copy
- Sharp corners and harsh shadows
- More than 3 colors on screen at once
- "Solutions," "leverage," "empower," "unlock"
- Sans-serif headlines (we're a serif house — that's the point)

---

## Quick CSS Variables

```css
:root {
  /* Primary */
  --porch-light: #F5C84B;
  --stoop-navy: #1F3A5F;
  --front-door: #D9594C;

  /* Secondary */
  --fresh-bread: #FAF3E3;
  --terracotta: #C97B5A;
  --mint-awning: #7FB5A1;

  /* Neutrals */
  --sidewalk: #3D3D3D;
  --chalk: #E8E0CC;
  --paper: #FFFCF5;

  /* Type */
  --font-display: 'Fraunces', Georgia, serif;
  --font-body: 'DM Sans', system-ui, sans-serif;
  --font-accent: 'Caveat', cursive;

  /* Shape */
  --radius-card: 14px;
  --radius-pill: 999px;
}
```

---

*Style guide v1.0 — keep it warm, keep it weird, keep it local.*
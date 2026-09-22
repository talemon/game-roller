---
name: Game Roller
description: A dice tray for game ideas — roll facets, watch them settle, keep the sentence.
colors:
  bg: "#121417"
  surface: "#1b1f24"
  chip: "#242a31"
  tray: "#0c0e11"
  border: "#2e353d"
  text: "#e8eaed"
  muted: "#9aa3ad"
  accent: "#6ea8fe"
  accent-text: "#0b1526"
  danger: "#ff8a80"
  paper-bg: "#f3f1ec"
  paper-surface: "#ffffff"
  paper-chip: "#ebe8e1"
  paper-tray: "#e7e3d9"
  paper-border: "#d5d1c8"
  paper-text: "#1c1f24"
  paper-muted: "#5b6370"
  paper-accent: "#2a5fc4"
  paper-accent-text: "#ffffff"
  paper-danger: "#b3261e"
typography:
  display:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(1.4rem, 3.5vw, 2rem)"
    fontWeight: 600
    lineHeight: 1.3
  headline:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "2rem"
    fontWeight: 700
    lineHeight: 1.5
  title:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 600
    lineHeight: 1.5
  body:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 400
    lineHeight: 1.35
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  pill: "999px"
spacing:
  xs: "0.2rem"
  sm: "0.5rem"
  md: "0.75rem"
  lg: "1rem"
  xl: "1.5rem"
  xxl: "2rem"
components:
  button:
    backgroundColor: "{colors.chip}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "0.45rem 0.9rem"
    height: "2.5rem"
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-text}"
    rounded: "{rounded.md}"
    padding: "0.45rem 0.9rem"
    height: "2.5rem"
  button-coarse:
    backgroundColor: "{colors.chip}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "0.45rem 0.9rem"
    height: "2.75rem"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
    padding: "1rem 1.25rem"
  card-disabled:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted}"
    rounded: "{rounded.lg}"
    padding: "0.5rem 1.25rem"
  banner:
    backgroundColor: "{colors.tray}"
    textColor: "{colors.text}"
    rounded: "{rounded.xl}"
    padding: "1.5rem"
  chip:
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "0.35rem 0.8rem"
  chip-described:
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "0.5rem 0.9rem"
  input-number:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    padding: "0.25rem 0.4rem"
    height: "2.25rem"
    width: "4rem"
  segmented-option:
    backgroundColor: "{colors.chip}"
    textColor: "{colors.text}"
    rounded: "{rounded.pill}"
    padding: "0.3rem 0.8rem"
    height: "2rem"
---

# Design System: Game Roller

## Overview

**Creative North Star: "The Dice Tray"**

Game Roller is a felt-lined tray with five compartments. You arm the compartments you care about, tip the tray, and the dice rattle, slow, and settle one at a time. The sentence at the top is what the dice read when they stop. Everything in the interface is either a die, a compartment, or the reading — there is no chrome that is none of those.

The tray is quiet. Surfaces are unadorned rectangles with a single hairline border; the only saturated colour on screen is the primary action and the chips that a roll actually produced. Density is deliberate: on a wide screen each facet becomes one horizontal row — controls on the left, results pushed to the right edge — so the whole set of compartments scans as a short list rather than a page of cards to read. Motion carries weight, never decoration: a rattle that eases from 60ms to 220ms per tick, a chip that drops 0.5rem and lands with a 320ms exponential ease-out, a card that slides its controls away when you disarm it. Nothing pulses, floats, or shimmers at rest.

Dark is the room the tray sits in by default; light is a separate, composed daytime version — warm paper, white compartments, soft shadow — not the dark theme inverted. Both are first-class, and the system never assumes one.

**Key Characteristics:**
- Five facet hues, each owned by one compartment, carried into every artifact that compartment produces
- Reserved space over reflow: a landing chip never pushes the layout
- One authored motion moment (the reveal) with a first-class skip
- Flat tonal dark, softly shadowed light — both composed, neither inverted
- System sans throughout; hierarchy comes from weight, size, and colour, never from a second face

## Colors

A low-chroma neutral shell — near-black slate or warm paper — holding five saturated OKLCH facet hues that appear only where a result exists.

### Primary
- **Signal Blue** (dark `#6ea8fe`, light `#2a5fc4`): the single action colour. It fills whichever control is currently primary — the roll button before an idea exists, Copy once one does — outlines the banner while a reveal is running, draws every focus ring, and tints the caret and text selection. Nothing decorative wears it.

### Secondary
The five **facet hues**, expressed as OKLCH hue angles rather than fixed colours: **Viewpoint Green** (150), **Players Cyan** (195), **Genre Indigo** (255), **Plot Amber** (45), **Theme Magenta** (330). Each card supplies its angle via `--facet-hue`; lightness and chroma come from theme-level tokens (`--tint-bg-l/c`, `--tint-border-l/c`, `--tint-text-l/c`, `--tint-muted-l/c`, `--tint-accent-l/c`), so a hue is one number and contrast is guaranteed in both themes. The hue appears on the card's chips, its checkbox accent, and its border while that slot is rattling.

### Neutral
- **Tray Slate** (dark `#121417` page, `#1b1f24` compartment, `#242a31` chip; light `#f3f1ec` page, `#ffffff` compartment, `#ebe8e1` chip): a three-step tonal ladder. In dark it is the entire depth system.
- **Tray Floor** (dark `#0c0e11`, light `#e7e3d9`): the reading's own material, and the only surface recessed *below* the page. Compartments sit on it; nothing else uses it.
- **Hairline** (dark `#2e353d`, light `#d5d1c8`): one pixel, on every compartment. Dashed when a compartment is disarmed.
- **Reading** (dark `#e8eaed`, light `#1c1f24`) and **Aside** (dark `#9aa3ad`, light `#5b6370`): body and secondary text. Aside carries hints, counts, footer, and the reveal toggle at ≥4.5:1 in both themes.
- **Fault Red** (dark `#ff8a80`, light `#b3261e`): failure only — currently just a failed clipboard write.

### Named Rules
**The Traceability Rule.** A facet hue exists so that a result can be traced back to the compartment that produced it — in the chips, and in the words of the sentence those chips produced. A new facet earns a hue because it needs identity in the results, never because the palette wants more variety. Hues are never reused across facets and never applied to anything that is not a result, a result's control, or a live slot's edge. Connective words are not results and never take a hue.

**The One Action Rule.** Signal Blue marks the thing to press and the thing being interacted with — primary button, focus ring, live-reveal border, selection, caret. A second saturated element competing for the eye in the neutral shell is a bug.

**The Composed Theme Rule.** Light is authored, not derived. Warm paper (`#f3f1ec`), true white compartments, and real shadows; dark is cool slate, shadowless, tonal. Adding a token means choosing both values deliberately — never `invert()`, never a filter.

## Typography

**Display Font:** system-ui stack (`-apple-system`, `Segoe UI`, `Roboto`, `Helvetica Neue`, `Arial`, sans-serif)
**Body Font:** the same stack
**Label/Mono Font:** none; numeric fields use `font-variant-numeric: tabular-nums` instead of a second face

**Character:** One voice, the reader's own platform. The tray is an instrument, not a publication: a downloaded display face would be ornament competing with the dice. Hierarchy is carried entirely by weight (400/500/600/700), size, and the neutral/aside colour split.

### Hierarchy
- **Display** (600, `clamp(1.4rem, 3.5vw, 2rem)`, 1.3): the rolled sentence. `text-wrap: balance`, `overflow-wrap: anywhere`, and a reserved min-height of 2.6em (3.9em under 640px) so the banner never resizes mid-reveal.
- **Headline** (700, 2rem): the page title only.
- **Title** (600, 1.05rem): a compartment's name, sitting beside its checkbox.
- **Body** (400, 1rem): chip labels are 500; the rest of the interface is 400.
- **Label** (400, 0.85rem): card hints, the reveal toggle, segmented theme options, footer.
- **Caption** (400, 0.8rem, 1.35): chip descriptions and the count range.

### Named Rules
**The One Face Rule.** The system sans is the whole type system. No display face, no mono costume for "technical" — tabular numerals handle the only place numbers need to align.

**The Reserved Line Rule.** Any text that changes while the user watches reserves its height first. The sentence reserves two lines (three on mobile); chips reserve their rows once a roll exists. Text arriving must never move text already read.

## Layout

A single centred column, max 960px, with `2rem 1rem 3rem` padding and a 1.5rem vertical rhythm between the header, the banner, the card stack, and the footer. Cards sit 0.75rem apart — tighter than the sections they belong to, so the stack reads as one object.

Below 720px a card stacks: header, controls, chips. At 720px and up it becomes a row — `grid-template-columns: 17rem 1fr` with header and controls in the fixed left column and chips filling the rest, right-aligned and vertically centred against the controls. This is the load-bearing responsive decision: results read as the row's answer, and five facets scan in one glance instead of five.

Spacing scale in use: 0.2rem (label to hint), 0.5rem (chip gaps, control gaps), 0.75rem (card gap, control row), 1rem / 1.25rem (card padding), 1.5rem (section rhythm, banner padding, desktop column gap), 2rem (page top).

Density responds to pointer type, not width: under `@media (pointer: coarse)` buttons and number inputs grow from 2.5rem to 2.75rem, checkboxes from 1.1rem to 1.35rem, and segmented options from 2rem to 2.5rem. Desktop rhythm is untouched.

### Named Rules
**The Reserved Space Rule.** A compartment reserves exactly the height its declared count of results will occupy — `--rows × --row`, where `--row` is 2.4rem, or 5.2rem for facets whose chips carry descriptions — but only once something has been rolled. Nothing rolled means nothing can shift, and an untouched card stays closed up.

## Elevation & Depth

Depth is a light-mode dialect. Dark mode has no shadows at all (`--shadow: none`): separation comes from the three-step tonal ladder (page `#121417` → compartment `#1b1f24` → chip `#242a31`) plus a hairline border. Light mode uses one shared two-part shadow — a 1px contact shadow and a 16px ambient one, both in the text colour at 5–6% — on compartments and the banner only. Chips, buttons, and inputs are flat in both themes.

### Shadow Vocabulary
- **Compartment** (`box-shadow: 0 1px 2px rgb(28 31 36 / 0.06), 0 6px 16px rgb(28 31 36 / 0.05)`, light theme only): the card resting on paper. Offset plus soft blur, never a zero-offset halo.
- **The reading is recessed, never raised.** The banner carries no shadow in either theme; it separates by being a darker (dark) or deeper-paper (light) material than the page, with the same hairline. A dice tray's floor is below you, not floating.

### Named Rules
**The No-Lift Rule.** Nothing rises on hover. State is reported by border colour (hairline → Signal Blue), by a 0.97 scale press that resets the instant the pointer lifts, and by the facet hue appearing on a live card's edge. Elevation is a property of the theme's material, not a response to the cursor.

## Shapes

Four radii, each with a job: 6px for text inputs, 8px for buttons, 12px for compartments and for chips that grew a description, 16px for the reading — the one surface that is not a compartment gets the one radius nothing else uses. Bare chips and the theme switcher are fully round (999px), which is how a result reads as a token you could pick up rather than a box you read.

Every compartment carries a 1px border in both themes — the hairline is structural, not decorative, and it turns dashed when the compartment is disarmed so an off facet is legible at a glance without colour. Rattling decoys keep the dashed border and add a 0.6px blur: a die still moving. Nothing in the system uses a thick coloured left border, a hard offset shadow, or a gradient fill.

## Components

### Buttons
- **Shape:** softly rounded (8px), 2.5rem tall, 0.45rem/0.9rem padding, growing to 2.75rem under a coarse pointer.
- **Primary:** Signal Blue fill with its paired ink (`#0b1526` on dark, white on light), weight 600. One per screen: Roll everything.
- **Default:** chip-tone fill, hairline border, body weight. The per-card Roll and Skip.
- **Hover / Focus:** border shifts to Signal Blue (150ms); primary brightens via `filter` (1.1 dark, 0.92 light). Focus is a 2px Signal Blue outline at 2px offset, from the global `:focus-visible` rule.
- **Active:** `scale(0.97)` with the transition cut to 50ms, so the press reads as immediate and releases the moment the pointer lifts.
- **Disabled:** 0.5 opacity, `cursor: not-allowed`, no hover response.
- **Status variants:** the outlined copy button borders and tints Signal Blue on success, Fault Red on failure. While Copy is the primary it is already an accent slab, so success shows in the label alone and failure turns the slab itself Fault Red with the paired ink — an accent tint on an accent fill would paint the word in its own background. The state belongs to the idea, not to a clock: it is derived from which sentence was last copied, so the confirmation stands until that sentence changes. Its accessible name stays "Copy idea" while the visible label swaps.

### Chips
- **Style:** the facet's hue at token lightness/chroma — tinted fill, tinted 1px border, tinted text — fully round at 0.35rem/0.8rem. A chip with a description becomes a 12px-radius card (0.5rem/0.9rem) with a 0.8rem description line in the hue's muted tone.
- **No per-item glyph:** a chip is its label and its hue, nothing else. Steam's tag list carries no icon, and 320 hand-picked ones would be 320 chances to mislabel a tag.
- **Landing:** each locked chip animates `land` (320ms, `cubic-bezier(0.16, 1, 0.3, 1)`) from `translateY(-0.5rem) scale(1.06)` and 0 opacity, staggered 45ms by index. Under reduced motion this becomes a 180ms opacity-only `appear`.
- **Ghost (rattling):** neutral chip tone, dashed border, muted text, `blur(0.6px)`, fixed 7.5rem width with ellipsis so the rattle does not reflow. The blur is dropped under reduced motion.

### Cards / Containers
- **Corner Style:** 12px.
- **Background:** compartment tone (`#1b1f24` / `#ffffff`), page tone behind.
- **Shadow Strategy:** light theme only; see Elevation & Depth.
- **Border:** 1px hairline; dashed when disarmed; the facet hue while that slot is rattling.
- **Title icon:** one Lucide glyph (1.1em, `currentColor`, `aria-hidden`) before the card title, in the card's own hue — gamepad for Genre, palette for Theme, eye for Look & viewpoint, users for Players, open book for Master plot. Facet identity, not decoration: it is the only place an icon appears, and it drops to the muted tone when the card is disarmed.
- **Internal Padding:** `1rem 1.25rem`, collapsing to `0.5rem` block padding when disarmed so an off compartment becomes a single line with its title and hint side by side.
- **Stale results:** when the count no longer matches the chips on screen, the chips drop to 0.55 opacity, the card's own Roll takes a facet-hue border, and a caption reads "Roll to apply". A card never silently contradicts itself.

### Inputs / Fields
- **Number field:** page-tone fill (recessed against the compartment), hairline border, 6px radius, 4rem wide, tabular numerals, with the permitted range printed beside it as a caption. Out-of-range, empty, or decimal input is snapped back to bounds on change rather than rejected — and the rewrite is spoken through the banner's status region, because a value that changes under the cursor without a word teaches that the control is advisory.
- **Checkbox:** native, 1.1rem (1.35rem coarse), `accent-color` set to the card's facet hue when the card is armed and to the global accent otherwise. Disarming a card moves focus to its checkbox so the collapse never drops focus to the document.
- **Focus:** global 2px Signal Blue outline at 2px offset.
- **Disabled:** 0.6 opacity.

### Navigation
There is no navigation. The only persistent control is the theme switcher: a pill-shaped segmented group of three options (System / Light / Dark) built from visually hidden radios inside labels, with the active option filled in chip tone at weight 600 and the group's focus ring driven by `:has(input:focus-visible)`.

### Result Banner (signature component)
The reading, on its own material: a tray-floor panel at 16px radius holding the composed sentence at display size, the roll action, Copy, a Skip that appears only during a reveal, and the reveal toggle pushed to the right edge (dropping to its own full-width row under 640px). Below 720px the panel is `position: sticky; top: 0` at reduced padding, because per-facet re-roll happens a screen and a half further down. Its border turns Signal Blue for the duration of a reveal. Each locked slot re-keys the sentence and plays `settle` (260ms, `cubic-bezier(0.16, 1, 0.3, 1)`, from `translateY(0.18em)` at 0.4 opacity) — a settle, not an entrance, because most of the line was already there. A single visually hidden `role="status"` announces the finished idea once; the visible sentence is deliberately not a live region.

Height is reserved from the sentence the running reveal will end on, rendered into a hidden sizer stacked in the same grid cell, so the panel grows once before the rattle instead of under a cursor aiming at Skip. The two-line floor applies only once a roll exists; the empty state is as short as its placeholder.

The sentence itself is tinted: every run of text a facet rolled wears that facet's hue via `--tint-word-l/c` (dark 75%/0.128, light 49%/0.084 — the most saturated pair that stays inside sRGB for all five hues and clears 4.5:1 on the tray floor, because a clipped hue arrives as a different hue than its chip). Connective text — "A", "game", "about", "and", and the wrapper a trailing facet writes around its own phrase — stays the reading colour, which is what keeps five hues in one line legible as a sentence instead of a ransom note. `composeSentenceParts` owns the split, and `composeSentence` is its joined text, so the copied string, the `role="status"` announcement, the sizer and the settle key are all one plain sentence. While a slot rattles, its "…" placeholder carries that slot's hue.

### Named Rules
**The Skippable Reveal Rule.** The rattle is the product's one authored motion moment — ~1.5s per slot, ticks easing 60ms → 220ms, 220ms between slots — and it is always escapable: a Skip button, the Escape key, and a persisted "Reveal one by one" toggle. Motion that cannot be skipped is a cost the user did not agree to.

**The Reduced-Motion Dialect Rule.** Reduced motion swaps vocabulary, it never mutes the system: slide becomes fade, the chip landing becomes an opacity appear, the sentence settle becomes a fade, the rattle drops to a paced pending state. Hover, press, and theme cross-fade survive, because they report state. A blanket `transition-duration: 0` across the document is forbidden.

**The Shifting Weight Rule.** Primary marks the next thing worth doing, and that changes. With no idea on screen the roll button is primary and Copy is inert; the moment a settled sentence exists Copy takes the accent fill and the roll button demotes to secondary and relabels "Roll again". Success is copy-and-leave, so the loud control is whichever one gets the user there. Copy stays mounted and merely disabled during a reveal, and Skip is appended at the end of the row — nothing that was already there ever moves.

**The Nothing Silent Rule.** A control that cannot do its job says why, and a value the system rewrites is spoken. Rolling with nothing armed is not an inert button but a disabled one with "Tick a card below to roll something." beside it; a clamped count announces the value it landed on; chips that no longer match their count dim and ask to be re-rolled. The alternative teaches the user that the controls are decoration.

## Do's and Don'ts

### Do:
- **Do** give every new facet its own OKLCH hue angle via `--facet-hue`, and let the theme-level `--tint-*-l/c` tokens supply lightness and chroma so contrast holds in both themes.
- **Do** reserve space for anything that will arrive — `--rows × --row` on chips, `min-height` on the sentence — and only once the content can actually appear.
- **Do** compose both theme values deliberately when adding a colour token; dark is tonal and shadowless, light is warm paper with the two-part shadow.
- **Do** keep hierarchy in weight, size, and the reading/aside colour split, using the system sans for everything.
- **Do** give every new motion a reduced-motion counterpart that preserves the state change (fade or an instant end state), and make any sequence longer than a second escapable.
- **Do** pair every silent correction with a visible or announced consequence — a disabled reason, a status line, a dimmed result.
- **Do** report state through border colour, the 0.97 press, and hue on a live edge.
- **Do** size touch targets through `@media (pointer: coarse)` rather than by changing the desktop rhythm.

### Don't:
- **Don't** use a facet hue for anything that is not a result, a result's own control, or a live slot's edge. It is a traceability device, not a palette.
- **Don't** introduce a second saturated accent, a gradient fill, gradient text, or a second type face.
- **Don't** add a shadow to the dark theme, or a hover lift to either theme. Depth belongs to the material, not the cursor.
- **Don't** derive one theme from the other with `invert()`, a filter, or `opacity` over a light base.
- **Don't** let arriving content push read content: no unreserved chip rows, no growing banner.
- **Don't** kill all transitions under `prefers-reduced-motion`; swap the vocabulary instead.
- **Don't** let an icon stand in for a label; the facet icon is `aria-hidden` and always sits beside its title text.
- **Don't** make the rolled sentence a live region — a paced reveal in a live region reads every partial state aloud.

---
name: brand-guidelines
description: Applies tedt.org brand colors, typography, and visual styling conventions to any artifact that benefits from the site’s look-and-feel. Use it when brand colors, type, visual formatting, or design standards apply.
license: Complete terms in LICENSE.txt
---

# tedt.org Brand Styling

## Overview

This skill captures the visual system used across **tedt.org**: an editorial, high-contrast palette (deep navy + vivid orange + bright cyan accents), warm paper-like neutrals, and a modern sans + distinctive serif-heading stack. :contentReference[oaicite:0]{index=0}

**Keywords**: branding, corporate identity, visual identity, post-processing,
styling, design system, tedt.org, TedTschopp, visual formatting, visual design

## Brand Guidelines

### Color System

The site’s palette is defined via Sass variables (Bootstrap theme overrides), then emitted as Bootstrap-compatible CSS variables/classes. :contentReference[oaicite:1]{index=1}

#### Core Neutrals (warm “paper” light mode + deep dark mode)

- **Paper / Base Light**: `#F8F6F0` (rgb 248,246,240) :contentReference[oaicite:2]{index=2}
- **Ink / Near-Black**: `#07090F` (rgb 7,9,15) :contentReference[oaicite:3]{index=3}
- **Dark UI Base**: `#101820` (rgb 16,24,32) :contentReference[oaicite:4]{index=4}

#### Gray Ramp (for borders, muted text, subtle fills)

- Gray-100: `#E0DEDA` :contentReference[oaicite:5]{index=5}
- Gray-200: `#C8C7C3` :contentReference[oaicite:6]{index=6}
- Gray-300: `#B0AFAC` :contentReference[oaicite:7]{index=7}
- Gray-400: `#989796` :contentReference[oaicite:8]{index=8}
- Gray-500: `#808080` :contentReference[oaicite:9]{index=9}
- Gray-600: `#676869` :contentReference[oaicite:10]{index=10}
- Gray-700: `#4F5052` :contentReference[oaicite:11]{index=11}
- Gray-800: `#37383C` :contentReference[oaicite:12]{index=12}
- Gray-900: `#1F2126` :contentReference[oaicite:13]{index=13}

#### Primary Brand Colors (most-used)

- **Primary (Deep Navy)**: `#00446F` (rgb 0,68,111) :contentReference[oaicite:14]{index=14}
- **Secondary (Vivid Orange)**: `#E86027` (rgb 232,96,39) :contentReference[oaicite:15]{index=15}
- **Info (Bright Cyan)**: `#00A9E0` (rgb 0,169,224) :contentReference[oaicite:16]{index=16}

#### Accent Colors (utility accents and emphasis)

- **Accent 1 (Link/Action Blue)**: `#007BFF` :contentReference[oaicite:17]{index=17}
- **Accent 2 (Gold / Warm Highlight)**: `#F2BC57` :contentReference[oaicite:18]{index=18}
- **Accent 3 (Deep Rust)**: `#6F1A07` :contentReference[oaicite:19]{index=19}

#### Status Colors

- **Success**: `#00B339` :contentReference[oaicite:20]{index=20}
- **Warning**: `#F2BC57` (shared with Accent 2) :contentReference[oaicite:21]{index=21}
- **Danger**: `#F90041` :contentReference[oaicite:22]{index=22}

#### Links

- Default link color is **Accent 1** with **underlines enabled**. :contentReference[oaicite:23]{index=23}
- In dark mode, link color is a **tinted Accent 1** (computed by Sass). Approximation: `#66B0FF` (tint of `#007BFF`). :contentReference[oaicite:24]{index=24}

#### Highlight / Glow (signature styling)

- Default highlight (mark) color: `#FFFF66`
- Glow system uses global base RGB values: `255, 255, 102` (same “electric yellow” family) :contentReference[oaicite:25]{index=25}

### Typography

Typography is set via Bootstrap Sass overrides (site-specific). :contentReference[oaicite:26]{index=26}

#### Font Families

- **Body / UI (Sans-serif)**: `Inter` (primary), with fallbacks: `"Noto Sans"`, `"Helvetica Neue"`, system emoji fonts, `Roboto`, `sans-serif`. :contentReference[oaicite:27]{index=27}
- **Headings (Display/Editorial)**: `"Cal Sans"` primary, with fallbacks including `"Titillium Web"`, `Optima`, `Arsenal`, `Palatino`, `Georgia`, `serif`. :contentReference[oaicite:28]{index=28}
- **Code / Monospace**: `"Fira Code"` with standard mono fallbacks. :contentReference[oaicite:29]{index=29}

#### Type Scale Defaults

- **Root size**: 16px
- **Base body size**: `1.125rem` (18px equivalent at 16px root)
- **Base line-height**: `1.6` :contentReference[oaicite:30]{index=30}

## Features

### Smart Font Application

- Apply **Cal Sans** (or next available heading fallback) to headings and title text.
- Apply **Inter** (or next available body fallback) to paragraphs, UI labels, tables, and general copy.
- Apply **Fira Code** (or next available mono fallback) to code blocks, inline code, and technical snippets. :contentReference[oaicite:31]{index=31}

### Text Styling

- Editorial feel: readable body copy, slightly larger base size, generous line-height. :contentReference[oaicite:32]{index=32}
- Links are **underlined** by default (don’t remove underlines unless you replace with an equally clear affordance). :contentReference[oaicite:33]{index=33}

### Color Application

Use the palette with an intentional hierarchy:

- Backgrounds: **Paper** (`#F8F6F0`) or **Dark UI Base** (`#101820`)
- Primary text: **Ink** (`#07090F`) on light, and light neutrals on dark
- Calls-to-action: **Accent 1** (`#007BFF`) and/or **Secondary** (`#E86027`)
- Emphasis/notes: **Info** (`#00A9E0`) or **Accent 2** (`#F2BC57`) :contentReference[oaicite:34]{index=34}

### Signature Highlight Treatment

When highlighting key phrases, prefer the site’s **yellow mark/glow** styling:

- Highlight color: `#FFFF66`
- Glow base RGB: `255,255,102` :contentReference[oaicite:35]{index=35}

## Technical Details

### Source of Truth

Brand values come from the site’s Bootstrap Sass overrides:

- `_sass/_variables-site.scss` (palette + typography + links) :contentReference[oaicite:36]{index=36}
- `_sass/_variables-dark-site.scss` (dark-mode emphasis/link tuning) :contentReference[oaicite:37]{index=37}
- Glow/highlight variables defined in site CSS patterns for `mark`/`.glow`. :contentReference[oaicite:38]{index=38}

### Implementation Notes (for artifacts)

- Prefer **CSS-variable driven theming** (light/dark), matching Bootstrap-style token naming where possible.
- Preserve the **underlined link** convention unless you have a strong reason to diverge.
- Maintain **contrast**: the palette is designed for readable text on warm light backgrounds and high-contrast dark mode. :contentReference[oaicite:39]{index=39}


## Meta-Agent Prompt: Incremental Image & SVG Tools Builder

### Role

You are a **Senior Frontend Engineer + Toolsmith AI Agent** building a suite of
small, focused, client-side web tools for image and SVG manipulation on a single page of html + CSS + JS.

Your goal is to build these tools **incrementally**, with each step producing a
usable artifact before moving on.

You must favor **clarity, minimalism, and correctness** over cleverness.

### file structure

these instructions - tedt.org/tools/image-tools/image-tools.md
css for these tools - tedt.org/tools/image-tools/image-tools.css
js for these tools - org/tools/image-tools/image-tools.js
html for these tools - tedt.org/tools/image-tools.html

### Core Principles (Non-Negotiable)

- **Client-side only**: No backend, no server calls.
- **One job per tool**: Each page does one thing well.
- **Immediate feedback**: Every change updates the preview instantly.
- **Progressive build**: Never jump ahead—each phase must work before
  continuing.
- **Readable code**: Prioritize simple, understandable implementations.
- **Safe by default**: Especially when handling SVG input.

### Technical Constraints

- Use **plain HTML, CSS, and JavaScript** (no frameworks unless strictly
  necessary).
- Prefer **Web APIs** (`<canvas>`, `FileReader`, Clipboard API, URL fragments).
- No build step required.
- Everything should run from a static file or static hosting.
- All logic should be inspectable in the browser.

### Build Order (You MUST follow this sequence)

#### Phase 1 — Universal Image Input Foundation

Build a reusable input layer that supports:

- Drag-and-drop image upload
- Click-to-select file upload
- Paste-from-clipboard image input
- Immediate image preview
- Reset-to-default behavior

✔️ Stop and verify: image input works reliably across methods.

#### Phase 2 — Crop, Zoom, and Aspect Ratio Engine

Extend the image tool with:

- Draggable crop box
- Zoom and pan controls
- Fixed aspect ratio presets (square, portrait, landscape, avatar)
- Live preview of the cropped output

✔️ Stop and verify: user can frame an image precisely.

#### Phase 3 — Resize, Background, and Export

Add:

- Pixel-based resize controls
- Background color selection
- Transparent background support when possible
- One-click image export
- Display of output file size before download

✔️ Stop and verify: exported images match preview.

#### Phase 4 — JPEG Optimization & Comparison

Add:

- Adjustable JPEG quality slider
- Side-by-side comparison view (original vs optimized)
- Real-time file size updates

✔️ Stop and verify: quality vs size tradeoff is obvious.

#### Phase 5 — Raster ↔ SVG Tools

User override: keep these tools on the **same page** (`tools/image-tools.html`) and switch between tool collections using **tabs**.

Build tools for:

1. Raster → SVG:

   - Upload/paste raster image
   - Convert to SVG
   - Preview SVG
   - View and copy SVG source

2. SVG → Raster:

   - Paste SVG code or upload SVG file
   - Render to PNG or JPEG
   - Control background color, padding, and output size

✔️ Stop and verify: SVG inputs render safely and predictably.

#### Phase 6 — SVG Security & Sandbox

Build an SVG sandbox tool that:

- Accepts SVG input
- Sanitizes unsafe elements
- Prevents script execution
- Shows both rendered output and sanitized SVG source

✔️ Stop and verify: malicious SVGs do not execute.

#### Phase 7 — SVG Embedding Utilities

Build a tool that:

- Encodes SVGs as base64 `<img>` tags
- Displays rendered result
- Shows encoded string
- Shows decoded SVG source

✔️ Stop and verify: embedded SVGs render safely.

#### Phase 8 — Avatar Web Component

Build a reusable avatar picker that:

- Accepts image input (drop/paste/select)
- Enforces a fixed aspect ratio
- Allows crop and zoom
- Outputs a JPEG data URL
- Writes the result to a hidden form input

✔️ Stop and verify: component integrates cleanly into a form.

#### Phase 9 — State & Portability

Add:

- URL fragment or query-based state persistence
- Shareable links
- Offline functionality after initial load

✔️ Stop and verify: refreshing the page preserves state.

#### Phase 10 — Local-Only Vector Trace App (Baseline Shell)

**Objective** Introduce a **single-page, local-run vector tracing app** that can
host multiple bitmap→SVG engines.

**Build**

- `index.html` running via `file://` or static server
- Single-page layout with three panels:

  - Input & Controls (left)
  - Previews (center)
  - SVG Output & Export (right)

**Add**

- Image input (file, drop, paste)
- Canvas-based normalization pipeline:

  - Resize to max dimension (default 1024, configurable)
  - Produce `ImageData`
- Engine-agnostic controls:

  - Max dimension
  - Reset
  - Overlay opacity
- Output panel:

  - SVG preview
  - Read-only SVG text
  - Download + copy buttons
- Diagnostics:

  - Stage timings
  - Collapsible error panel

✔️ Stop and verify: placeholder SVG exports work.

#### Phase 11 — Shared Preprocessing Pipeline

**Objective** Create a reusable preprocessing stage for all engines.

**Add**

- ImageData transforms:

  - Grayscale toggle
  - Contrast slider
  - Blur slider (simple box blur OK)
  - Invert toggle
- Preview canvases:

  - Original
  - Preprocessed
- Deterministic behavior

✔️ Stop and verify.

#### Phase 12 — Engine Framework & Plugin Interface

**Objective** Allow engine swapping without UI rewrites.

**Define**

- Engine interface:

  ```js
  trace(imageData, params) → { svg, metrics, previews? }
  ```

**Add**

- Engine registry:

  - Potrace (stub)
  - ImageTracer (stub)
  - OpenCV Contours (stub)
- Engine selector dropdown
- Dynamic per-engine parameter UI
- Metrics panel (duration, size, paths)

✔️ Stop and verify: stub engines return valid SVG.

#### Phase 13 — Potrace Engine (High-Contrast)

**Objective** Enable logo/line-art tracing.

**Add**

- JS/WASM Potrace integration
- Controls:

  - Threshold slider
  - Optional Otsu
  - Speckle removal
  - Curve optimization
- Output styling:

  - Fill color
  - Optional stroke mode

✔️ Stop and verify.

#### Phase 14 — ImageTracerJS Engine (Multi-Color)

**Objective** Support flat-color posterized tracing.

**Add**

- Local ImageTracerJS dependency
- Controls:

  - Color count
  - Noise filter
  - Path fitting
  - Stroke toggle
- Palette legend with path counts

✔️ Stop and verify.

#### Phase 15 — OpenCV.js Contour Engine

**Objective** Enable edge-based contour tracing.

**Add**

- Local OpenCV.js loading
- Controls:

  - Blur kernel
  - Canny thresholds
  - Contour mode
  - Approximation epsilon
- SVG path generation per contour

✔️ Stop and verify.

### Phase 16 — Comparison & Overlay Tools

**Objective** Make tuning visually obvious.

**Add**

- SVG-over-bitmap overlay
- Opacity slider
- Show/hide toggle
- Zoom controls (fit / 100%)
- Pan/drag

✔️ Stop and verify.

#### Phase 17 — Export & Reproducibility

**Objective** Enable sharing and re-running traces.

**Add**

- Export options:

  - SVG download
  - Copy SVG
  - Data URL (optional)
  - Trace bundle JSON:

    - engine
    - params
    - input metadata
    - SVG
- SVG minification:

  - Whitespace stripping
  - Decimal rounding

✔️ Stop and verify.

#### Phase 18 — Performance Hardening

**Objective** Keep UI responsive.

**Add**

- Cancelable runs (ignore stale executions)
- Optional Web Worker (`worker.js`, no bundler)
- Safety limits:

  - Warn >2048px
  - Hard cap at 4096px

✔️ Stop and verify.

#### Phase 19 — Test Assets & Self-Test Mode

**Objective** Prevent regressions.

**Add**

- `./test-assets/`:

  - Logo
  - Handwriting
  - Flat illustration
  - Photo
- Self-test button:

  - Runs each engine
  - Reports success + metrics
- SVG validity checks:

  - XML parse
  - `<svg>` root + viewBox

✔️ Stop and verify.

#### Phase 20 — Documentation & Local Packaging

**Objective** Make the system usable and extensible.

**Add**

- `README.md`:

  - `file://` usage
  - Optional local server
  - Adding engines/libs
  - Parameter explanations
  - Known limitations
- In-app Help panel:

  - Which engine to use for which image type

✔️ Stop and verify: new user exports SVG in <5 minutes.

### Output Expectations (Per Phase)

For **each phase**, you must produce:

1. A short explanation of what was built
2. The complete HTML/CSS/JS code
3. Clear notes on limitations or tradeoffs

Do **not** proceed to the next phase until the current one is complete and
usable.

### Tone & Behavior

- Do not over-engineer.
- Do not add features early.
- Do not collapse phases.
- Do not “optimize later”—build it cleanly now.
- Treat each tool as something a human will actually use.

### Success Criteria

The final result should feel like:

- A set of **sharp, trustworthy tools**
- Something a developer would bookmark and reuse
- Easy to understand by reading the source
- Boring in the best possible way

---

## Current Status — Implemented Through Phase 5

- Phase 1: robust image input (drop/select/paste) + metadata + reset.
- Phase 2: crop/zoom/pan + fixed aspect presets + live preview.
- Phase 3: resize + background (including transparency for PNG) + one-click export + estimated output size.
- Phase 4: JPEG quality slider + baseline vs optimized side-by-side comparison with real encoded sizes.
- Phase 5: tabbed tool suite with Raster → SVG (embed wrapper, preview + source + copy/download) and SVG → Raster (sanitize + render + export/copy + size estimate).

Source of truth (authoritative):

- `tools/image-tools.html`
- `tools/image-tools/image-tools.css`
- `tools/image-tools/image-tools.js`

Notes:

- “Copy” requires a secure context (`https://`) and browser Clipboard support.
- JPEG export disables transparency by design.
- Estimated size is computed from a real encode and is debounced while you edit.

## Phase 1 — Implemented (Universal Image Input Foundation)

### What was built

- A single-page tool that accepts images via drag-and-drop, file picker, or paste.
- Immediate preview plus basic metadata (name, type, size, dimensions).
- Reset clears state, metadata, and revokes object URLs.

### Limitations / tradeoffs

- The “Paste from clipboard” button uses the Clipboard API (`navigator.clipboard.read`) which only works on secure contexts (https) and may require user permission; direct paste with Cmd/Ctrl+V is supported via the `paste` event and is generally more reliable.
- This phase intentionally does not include crop/zoom/export; those arrive in Phases 2–4.

### Complete code (Phase 1)

#### HTML — `tools/image-tools.html`

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Image Tools (Phase 1)</title>
  <link rel="stylesheet" href="/css/consolidated-fonts.css">
  <link rel="stylesheet" href="/tools/image-tools/image-tools.css">
</head>

<body>
  <main class="page" data-image-tools>
    <header class="header">
      <h1 class="title">Image Tools</h1>
      <p class="subtitle">
        Phase 1: drop, select, or paste an image to preview it.
      </p>
    </header>

    <section class="card" aria-label="Image input">
      <div class="controls">
        <input id="fileInput" class="sr-only" type="file" accept="image/*" />

        <button id="chooseBtn" type="button" class="btn btn-primary">
          Choose file
        </button>
        <button id="pasteBtn" type="button" class="btn" aria-describedby="pasteHint">
          Paste from clipboard
        </button>
        <button id="resetBtn" type="button" class="btn btn-danger" disabled>
          Reset
        </button>
      </div>

      <p id="pasteHint" class="hint">
        Tip: you can also press <kbd>⌘</kbd>+<kbd>V</kbd> (Mac) or <kbd>Ctrl</kbd>+<kbd>V</kbd> (Windows/Linux) after copying an image.
      </p>

      <div id="dropZone" class="drop-zone" tabindex="0" role="button" aria-label="Drop an image here or press Enter to choose a file">
        <div class="drop-zone-inner">
          <div class="drop-title">Drop image here</div>
          <div class="drop-subtitle">or click / press Enter to choose</div>
        </div>
      </div>

      <div class="status" aria-live="polite" aria-atomic="true">
        <span id="statusText">No image loaded.</span>
      </div>
    </section>

    <section class="card" aria-label="Preview">
      <div class="preview">
        <div id="previewPlaceholder" class="preview-placeholder">
          Preview will appear here.
        </div>
        <img id="previewImage" class="preview-image" alt="Selected image preview" />
      </div>

      <dl class="meta" aria-label="Image details">
        <div class="meta-row">
          <dt>Name</dt>
          <dd id="metaName">—</dd>
        </div>
        <div class="meta-row">
          <dt>Type</dt>
          <dd id="metaType">—</dd>
        </div>
        <div class="meta-row">
          <dt>Size</dt>
          <dd id="metaSize">—</dd>
        </div>
        <div class="meta-row">
          <dt>Dimensions</dt>
          <dd id="metaDims">—</dd>
        </div>
      </dl>
    </section>
  </main>

  <script src="/tools/image-tools/image-tools.js"></script>
</body>

</html>
```

#### CSS — `tools/image-tools/image-tools.css`

```css
:root {
  --it-bg: #0c0f14;
  --it-panel: rgba(255, 255, 255, 0.06);
  --it-panel-2: rgba(255, 255, 255, 0.09);
  --it-border: rgba(255, 255, 255, 0.12);
  --it-text: rgba(255, 255, 255, 0.92);
  --it-text-muted: rgba(255, 255, 255, 0.68);
  --it-accent: #00a9e0;
  --it-danger: #e05252;
  --it-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
  --it-radius: 16px;
}

* {
  box-sizing: border-box;
}

html,
body {
  height: 100%;
}

body {
  margin: 0;
  color: var(--it-text);
  background: radial-gradient(1200px 900px at 20% -20%, rgba(0, 169, 224, 0.18), transparent 55%),
    radial-gradient(800px 600px at 95% 10%, rgba(224, 82, 82, 0.12), transparent 55%),
    var(--it-bg);
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
}

.page {
  max-width: 980px;
  margin: 0 auto;
  padding: 26px 16px 48px;
  display: grid;
  gap: 16px;
}

.header {
  display: grid;
  gap: 6px;
  padding: 14px 2px;
}

.title {
  margin: 0;
  font-size: 28px;
  letter-spacing: -0.02em;
}

.subtitle {
  margin: 0;
  color: var(--it-text-muted);
  font-size: 14px;
  line-height: 1.45;
}

.card {
  background: var(--it-panel);
  border: 1px solid var(--it-border);
  border-radius: var(--it-radius);
  box-shadow: var(--it-shadow);
  padding: 14px;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.btn {
  appearance: none;
  border: 1px solid var(--it-border);
  background: var(--it-panel-2);
  color: var(--it-text);
  border-radius: 12px;
  padding: 10px 12px;
  font-weight: 700;
  font-size: 13px;
  line-height: 1;
  cursor: pointer;
  user-select: none;
}

.btn:hover {
  border-color: rgba(255, 255, 255, 0.22);
}

.btn:active {
  transform: translateY(1px);
}

.btn:focus-visible {
  outline: 3px solid rgba(0, 169, 224, 0.55);
  outline-offset: 2px;
}

.btn[disabled] {
  opacity: 0.55;
  cursor: not-allowed;
}

.btn-primary {
  background: rgba(0, 169, 224, 0.16);
  border-color: rgba(0, 169, 224, 0.35);
}

.btn-danger {
  background: rgba(224, 82, 82, 0.14);
  border-color: rgba(224, 82, 82, 0.32);
}

.hint {
  margin: 10px 2px 0;
  color: var(--it-text-muted);
  font-size: 12px;
  line-height: 1.35;
}

kbd {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(0, 0, 0, 0.22);
  color: rgba(255, 255, 255, 0.9);
}

.drop-zone {
  margin-top: 12px;
  border-radius: 16px;
  border: 1.5px dashed rgba(255, 255, 255, 0.20);
  background: rgba(0, 0, 0, 0.20);
  min-height: 140px;
  display: grid;
  place-items: center;
  text-align: center;
  padding: 16px;
  cursor: pointer;
}

.drop-zone:focus-visible {
  outline: 3px solid rgba(0, 169, 224, 0.55);
  outline-offset: 3px;
}

.drop-zone.is-over {
  border-color: rgba(0, 169, 224, 0.75);
  background: rgba(0, 169, 224, 0.10);
}

.drop-title {
  font-weight: 800;
  font-size: 16px;
  letter-spacing: -0.01em;
}

.drop-subtitle {
  margin-top: 4px;
  color: var(--it-text-muted);
  font-size: 12px;
}

.status {
  margin-top: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.78);
  font-size: 12px;
}

.preview {
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.22);
  overflow: hidden;
  min-height: 220px;
  display: grid;
  place-items: center;
}

.preview-placeholder {
  padding: 18px;
  text-align: center;
  color: var(--it-text-muted);
  font-size: 13px;
}

.preview-image {
  display: none;
  max-width: 100%;
  max-height: 520px;
  width: auto;
  height: auto;
}

.preview-image.is-visible {
  display: block;
}

.meta {
  margin: 12px 0 0;
  display: grid;
  gap: 8px;
}

.meta-row {
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.10);
  background: rgba(255, 255, 255, 0.04);
}

.meta dt {
  color: rgba(255, 255, 255, 0.68);
  font-size: 12px;
  font-weight: 750;
}

.meta dd {
  margin: 0;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.92);
  overflow-wrap: anywhere;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (min-width: 880px) {
  .page {
    grid-template-columns: 1fr 1.15fr;
    align-items: start;
  }

  .header {
    grid-column: 1 / -1;
  }
}
```

#### JS — `tools/image-tools/image-tools.js`

```js
/*
Phase 1 — Universal Image Input Foundation

Client-side only. No network calls.

Supported:
- Drag/drop image files

---

## Phase 2 — Implemented (Crop, Zoom, and Aspect Ratio Engine)

### What was built

- A canvas-based crop editor with a draggable, resizable crop box.
- Zoom via slider and mouse wheel; pan by dragging outside the crop box.
- Aspect presets (1:1, 4:5, 16:9, original).
- Live cropped preview canvas with output pixel dimensions.

### Limitations / tradeoffs

- This phase is a framing engine only: it does not export/download yet (Phase 3).
- The crop box is clamped to the editor canvas (not the image bounds), so you can place the crop where no image pixels exist if you pan the image away.

### Complete code (Phase 2)

Note: the canonical (authoritative) source is the checked-in files:
`tools/image-tools.html`, `tools/image-tools/image-tools.css`, and `tools/image-tools/image-tools.js`.
This section is a convenience snapshot.

#### HTML — `tools/image-tools.html`

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Image Tools (Phase 2)</title>
  <link rel="stylesheet" href="../css/consolidated-fonts.css">
  <link rel="stylesheet" href="image-tools/image-tools.css">
</head>

<body>
  <main data-image-tools>
    <div id="controls" aria-label="Controls">
      <header class="header">
        <h1 class="title">Image Tools</h1>
        <p class="subtitle">Phase 2: crop, pan, zoom, and preview your export.</p>
      </header>

      <div class="controls-row">
        <input id="fileInput" class="sr-only" type="file" accept="image/*" />

        <button id="chooseBtn" type="button" class="btn btn-primary">Choose file</button>
        <button id="pasteBtn" type="button" class="btn" aria-describedby="pasteHint">Paste</button>
        <button id="resetBtn" type="button" class="btn btn-danger" disabled>Reset</button>
      </div>

      <div class="control-grid" aria-label="Crop controls">
        <label class="field">
          <span class="label">Aspect</span>
          <select id="aspectSelect" class="select">
            <option value="1:1" selected>Square (1:1)</option>
            <option value="4:5">Portrait (4:5)</option>
            <option value="16:9">Landscape (16:9)</option>
            <option value="original">Original</option>
          </select>
        </label>

        <label class="field">
          <span class="label">Zoom</span>
          <div class="zoom-row">
            <input id="zoomRange" type="range" min="1" max="4" step="0.01" value="1" disabled />
            <span id="zoomValue" class="zoom-value">100%</span>
          </div>
        </label>

        <div class="control-actions">
          <button id="fitBtn" type="button" class="btn" disabled>Fit</button>
          <button id="centerCropBtn" type="button" class="btn" disabled>Center crop</button>
        </div>
      </div>

      <p id="pasteHint" class="hint">
        Tip: press <kbd>⌘</kbd>+<kbd>V</kbd> (Mac) or <kbd>Ctrl</kbd>+<kbd>V</kbd> after copying an image.
      </p>

      <div id="dropZone" class="drop-zone" tabindex="0" role="button" aria-label="Drop an image here or press Enter to choose a file">
        <div class="drop-zone-inner">
          <div class="drop-title">Drop image here</div>
          <div class="drop-subtitle">or click / press Enter</div>
        </div>
      </div>

      <div class="status" aria-live="polite" aria-atomic="true">
        <span id="statusText">No image loaded.</span>
      </div>
    </div>

    <div id="viewport" aria-label="Preview area">
      <section class="card" aria-label="Preview">
        <div class="editor-grid">
          <div class="editor-pane">
            <div class="editor-stage">
              <canvas id="editorCanvas" class="editor-canvas" aria-label="Crop editor"></canvas>
              <div id="previewPlaceholder" class="preview-placeholder">Drop or paste an image to begin.</div>
              <img id="previewImage" class="preview-image" alt="Selected image preview" />
            </div>
            <p class="micro-hint">
              Drag crop box to move, drag corners to resize. Drag outside crop to pan. Scroll to zoom.
            </p>
          </div>

          <div class="preview-pane" aria-label="Cropped preview">
            <div class="preview-title">Cropped preview</div>
            <canvas id="cropPreview" class="crop-canvas"></canvas>
            <div class="preview-meta" id="cropMeta">—</div>
          </div>
        </div>

        <dl class="meta" aria-label="Image details">
          <div class="meta-row">
            <dt>Name</dt>
            <dd id="metaName">—</dd>
          </div>
          <div class="meta-row">
            <dt>Type</dt>
            <dd id="metaType">—</dd>
          </div>
          <div class="meta-row">
            <dt>Size</dt>
            <dd id="metaSize">—</dd>
          </div>
          <div class="meta-row">
            <dt>Dimensions</dt>
            <dd id="metaDims">—</dd>
          </div>
        </dl>
      </section>
    </div>
  </main>

  <script src="image-tools/image-tools.js"></script>
</body>

</html>
```

#### CSS — `tools/image-tools/image-tools.css`

```css
:root {
  --it-bg: #f4f4f4;
  --it-panel: rgba(255, 255, 255, 0.82);
  --it-panel-strong: rgba(255, 255, 255, 0.92);
  --it-border: rgba(0, 0, 0, 0.12);
  --it-border-strong: rgba(0, 0, 0, 0.14);
  --it-shadow:
    0 10px 30px rgba(0, 0, 0, 0.10),
    0 2px 8px rgba(0, 0, 0, 0.08);
  --it-radius: 14px;
  --it-focus: rgba(0, 169, 224, 0.55);
  --it-controls-w: 460px;
}

* {
  box-sizing: border-box;
}

html,
body {
  height: 100%;
}

body {
  margin: 0;
  background-color: var(--it-bg);
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
  overflow: hidden;
}

#controls {
  position: fixed;
  top: 14px;
  left: 14px;
  z-index: 10;
  display: grid;
  gap: 10px;
  padding: 12px;
  box-sizing: border-box;
  width: min(var(--it-controls-w), calc(100vw - 28px));
  border-radius: var(--it-radius);
  background: var(--it-panel);
  border: 1px solid var(--it-border);
  box-shadow: var(--it-shadow);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.header {
  display: grid;
  gap: 6px;
}

.title {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: rgba(0, 0, 0, 0.88);
}

.subtitle {
  margin: 0;
  font-size: 12px;
  line-height: 1.35;
  color: rgba(0, 0, 0, 0.72);
}

.controls-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(44px, 1fr));
  gap: 8px;
}

.btn {
  height: 44px;
  appearance: none;
  border: 1px solid var(--it-border-strong);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.90);
  color: #111;
  font-size: 13px;
  font-weight: 650;
  padding: 0 12px;
  cursor: pointer;
}

.btn:hover {
  background: rgba(255, 255, 255, 1);
}

.btn:active {
  transform: translateY(1px);
}

.btn:focus-visible {
  outline: 3px solid var(--it-focus);
  outline-offset: 2px;
}

.btn[disabled] {
  cursor: not-allowed;
  opacity: 0.55;
}

.btn-primary {
  background: rgba(0, 169, 224, 0.12);
  border-color: rgba(0, 169, 224, 0.28);
}

.btn-danger {
  background: rgba(224, 82, 82, 0.10);
  border-color: rgba(224, 82, 82, 0.22);
}

.hint {
  margin: -2px 0 0;
  font-size: 11px;
  line-height: 1.25;
  color: rgba(0, 0, 0, 0.72);
}

kbd {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.14);
  background: rgba(255, 255, 255, 0.9);
}

.drop-zone {
  border-radius: 14px;
  border: 1.5px dashed rgba(0, 0, 0, 0.18);
  background: rgba(255, 255, 255, 0.72);
  min-height: 140px;
  display: grid;
  place-items: center;
  text-align: center;
  padding: 16px;
  cursor: pointer;
}

.drop-zone:focus-visible {
  outline: 3px solid var(--it-focus);
  outline-offset: 3px;
}

.drop-zone.is-over {
  border-color: rgba(0, 169, 224, 0.75);
  background: rgba(0, 169, 224, 0.10);
}

.drop-title {
  font-weight: 800;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.88);
}

.drop-subtitle {
  margin-top: 4px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.62);
}

.status {
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.10);
  background: rgba(255, 255, 255, 0.78);
  color: rgba(0, 0, 0, 0.72);
  font-size: 12px;
}

#viewport {
  position: fixed;
  inset: 0;
  overflow: auto;
  padding: 14px;
  padding-top: calc(14px + 420px);
}

@media (min-width: 920px) {
  #viewport {
    padding-top: 14px;
    padding-left: calc(28px + var(--it-controls-w));
  }
}

.card {
  max-width: 920px;
  margin: 0 auto;
  background: var(--it-panel-strong);
  border: 1px solid var(--it-border);
  border-radius: var(--it-radius);
  box-shadow: var(--it-shadow);
  padding: 14px;
}

.control-grid {
  display: grid;
  gap: 10px;
  padding: 10px;
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.10);
  background: rgba(255, 255, 255, 0.72);
}

.field {
  display: grid;
  gap: 6px;
}

.label {
  font-size: 11px;
  font-weight: 750;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.58);
}

.select {
  height: 40px;
  border-radius: 12px;
  border: 1px solid var(--it-border-strong);
  background: rgba(255, 255, 255, 0.95);
  padding: 0 12px;
  font-size: 13px;
  font-weight: 650;
}

.select:focus-visible {
  outline: 3px solid var(--it-focus);
  outline-offset: 2px;
}

.zoom-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  align-items: center;
}

#zoomRange {
  width: 100%;
}

.zoom-value {
  font-size: 12px;
  font-weight: 750;
  color: rgba(0, 0, 0, 0.72);
  min-width: 52px;
  text-align: right;
}

.control-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(44px, 1fr));
  gap: 8px;
}

.editor-grid {
  display: grid;
  gap: 14px;
}

@media (min-width: 920px) {
  .editor-grid {
    grid-template-columns: 1fr 320px;
    align-items: start;
  }
}

.editor-stage {
  position: relative;
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.10);
  background: rgba(255, 255, 255, 0.75);
  overflow: hidden;
  min-height: 360px;
}

.editor-canvas {
  display: block;
  width: 100%;
  height: min(62vh, 520px);
}

.crop-canvas {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.10);
  background: rgba(255, 255, 255, 0.85);
}

.preview-title {
  font-size: 12px;
  font-weight: 850;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.62);
  margin: 2px 0 8px;
}

.preview-meta {
  margin-top: 8px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.72);
}

.micro-hint {
  margin: 10px 4px 0;
  font-size: 11px;
  line-height: 1.25;
  color: rgba(0, 0, 0, 0.62);
}

.preview {
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.10);
  background: rgba(255, 255, 255, 0.75);
  overflow: hidden;
  min-height: 260px;
  display: grid;
  place-items: center;
}

.preview-placeholder {
  padding: 18px;
  text-align: center;
  color: rgba(0, 0, 0, 0.62);
  font-size: 13px;
}

.preview-image {
  display: none;
}

.meta {
  margin: 12px 0 0;
  display: grid;
  gap: 8px;
}

.meta-row {
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.10);
  background: rgba(255, 255, 255, 0.78);
}

.meta dt {
  color: rgba(0, 0, 0, 0.62);
  font-size: 12px;
  font-weight: 750;
}

.meta dd {
  margin: 0;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.88);
  overflow-wrap: anywhere;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

#### JS — `tools/image-tools/image-tools.js`

```js
/*
Phase 1 — Universal Image Input Foundation

Client-side only. No network calls.

Supported:
- Drag/drop image files
- Click-to-select image files
- Paste image from clipboard (Ctrl/Cmd+V)
- Optional “Paste from clipboard” button (Clipboard API; requires secure context)
- Immediate preview + basic metadata
- Reset
*/

(function () {
  "use strict";

  /** @param {number} bytes */
  function formatBytes(bytes) {
    if (!Number.isFinite(bytes) || bytes < 0) return "—";
    const units = ["B", "KB", "MB", "GB"];
    let value = bytes;
    let idx = 0;
    while (value >= 1024 && idx < units.length - 1) {
      value /= 1024;
      idx += 1;
    }
    const fixed = idx === 0 ? 0 : value >= 10 ? 1 : 2;
    return `${value.toFixed(fixed)} ${units[idx]}`;
  }

  /** @param {unknown} err */
  function toErrorMessage(err) {
    if (err instanceof Error) return err.message;
    if (typeof err === "string") return err;
    return "Unknown error";
  }

  function isImageType(mimeType) {
    return typeof mimeType === "string" && mimeType.startsWith("image/");
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function parseAspect(value) {
    if (value === "original") return null;
    const m = /^\s*(\d+(?:\.\d+)?)\s*:\s*(\d+(?:\.\d+)?)\s*$/.exec(String(value));
    if (!m) return 1;
    const a = Number(m[1]);
    const b = Number(m[2]);
    if (!Number.isFinite(a) || !Number.isFinite(b) || a <= 0 || b <= 0) return 1;
    return a / b;
  }

  class CropEditor {
    /** @param {{
     * editorCanvas: HTMLCanvasElement,
     * cropPreview: HTMLCanvasElement,
     * cropMeta: HTMLElement,
     * previewPlaceholder: HTMLElement,
     * previewImage: HTMLImageElement,
     * aspectSelect: HTMLSelectElement,
     * zoomRange: HTMLInputElement,
     * zoomValue: HTMLElement,
     * fitBtn: HTMLButtonElement,
     * centerCropBtn: HTMLButtonElement,
     * }} els */
    constructor(els) {
      this.els = els;
      this.ctx = els.editorCanvas.getContext("2d");
      this.previewCtx = els.cropPreview.getContext("2d");
      this.hasImage = false;
      this.image = null;
      this.dpr = Math.max(1, window.devicePixelRatio || 1);

      this.baseScale = 1;
      this.zoom = 1;
      this.pan = { x: 0, y: 0 };
      this.crop = { x: 0, y: 0, w: 100, h: 100 };

      this.drag = null;
      this.resizeObserver = null;
      this.raf = 0;

      this.onPointerDown = this.onPointerDown.bind(this);
      this.onPointerMove = this.onPointerMove.bind(this);
      this.onPointerUp = this.onPointerUp.bind(this);
      this.onWheel = this.onWheel.bind(this);
      this.onAspectChange = this.onAspectChange.bind(this);
      this.onZoomInput = this.onZoomInput.bind(this);
      this.onFit = this.onFit.bind(this);
      this.onCenterCrop = this.onCenterCrop.bind(this);
    }

    init() {
      const { editorCanvas, aspectSelect, zoomRange, fitBtn, centerCropBtn } = this.els;
      if (!this.ctx || !this.previewCtx) {
        console.warn("[image-tools] Canvas 2D context not available");
        return;
      }

      editorCanvas.addEventListener("pointerdown", this.onPointerDown);
      window.addEventListener("pointermove", this.onPointerMove);
      window.addEventListener("pointerup", this.onPointerUp);
      editorCanvas.addEventListener("wheel", this.onWheel, { passive: false });

      aspectSelect.addEventListener("change", this.onAspectChange);
      zoomRange.addEventListener("input", this.onZoomInput);
      fitBtn.addEventListener("click", this.onFit);
      centerCropBtn.addEventListener("click", this.onCenterCrop);

      this.resizeObserver = new ResizeObserver(() => this.scheduleRender());
      this.resizeObserver.observe(editorCanvas);
      this.resizeObserver.observe(this.els.cropPreview);
      this.scheduleRender();
    }

    setEnabled(enabled) {
      this.els.zoomRange.disabled = !enabled;
      this.els.fitBtn.disabled = !enabled;
      this.els.centerCropBtn.disabled = !enabled;
      this.els.aspectSelect.disabled = !enabled;
    }

    clear() {
      this.hasImage = false;
      this.image = null;
      this.els.cropMeta.textContent = "—";
      this.setEnabled(false);
      this.scheduleRender();
    }

    /** @param {HTMLImageElement} img */
    setImage(img) {
      this.image = img;
      this.hasImage = true;
      this.setEnabled(true);
      this.fit();
      this.centerCrop();
      this.scheduleRender();
    }

    getAspectRatio() {
      const v = this.els.aspectSelect.value;
      const parsed = parseAspect(v);
      if (parsed) return parsed;
      if (this.image) return this.image.naturalWidth / this.image.naturalHeight;
      return 1;
    }

    onAspectChange() {
      if (!this.hasImage) return;
      this.centerCrop();
      this.scheduleRender();
    }

    onZoomInput() {
      this.setZoom(Number(this.els.zoomRange.value));
    }

    setZoom(z) {
      this.zoom = clamp(Number.isFinite(z) ? z : 1, 1, 4);
      this.els.zoomRange.value = String(this.zoom);
      this.els.zoomValue.textContent = `${Math.round(this.zoom * 100)}%`;
      this.scheduleRender();
    }

    onFit() {
      if (!this.hasImage) return;
      this.fit();
      this.scheduleRender();
    }

    onCenterCrop() {
      if (!this.hasImage) return;
      this.centerCrop();
      this.scheduleRender();
    }

    fit() {
      const { cw, ch } = this.getCanvasCssSize(this.els.editorCanvas);
      if (!this.image || cw <= 0 || ch <= 0) return;
      const iw = this.image.naturalWidth;
      const ih = this.image.naturalHeight;
      const pad = 24;
      const availableW = Math.max(1, cw - pad * 2);
      const availableH = Math.max(1, ch - pad * 2);
      this.baseScale = Math.min(availableW / iw, availableH / ih);
      this.pan = { x: 0, y: 0 };
      this.setZoom(1);
    }

    centerCrop() {
      const { cw, ch } = this.getCanvasCssSize(this.els.editorCanvas);
      if (cw <= 0 || ch <= 0) return;
      const aspect = this.getAspectRatio();
      const margin = 24;
      const maxW = Math.max(1, cw - margin * 2);
      const maxH = Math.max(1, ch - margin * 2);

      let w = maxW;
      let h = w / aspect;
      if (h > maxH) {
        h = maxH;
        w = h * aspect;
      }

      w = Math.max(60, w * 0.75);
      h = Math.max(60, h * 0.75);

      this.crop = {
        x: (cw - w) / 2,
        y: (ch - h) / 2,
        w,
        h,
      };
      this.clampCropToCanvas();
    }

    getCanvasCssSize(canvas) {
      const rect = canvas.getBoundingClientRect();
      return { cw: rect.width, ch: rect.height };
    }

    ensureCanvasResolution(canvas, ctx) {
      const { cw, ch } = this.getCanvasCssSize(canvas);
      const w = Math.max(1, Math.round(cw * this.dpr));
      const h = Math.max(1, Math.round(ch * this.dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      return { cw, ch };
    }

    scheduleRender() {
      if (this.raf) return;
      this.raf = window.requestAnimationFrame(() => {
        this.raf = 0;
        this.render();
      });
    }

    render() {
      if (!this.ctx || !this.previewCtx) return;
      const { editorCanvas, cropPreview } = this.els;
      const { cw, ch } = this.ensureCanvasResolution(editorCanvas, this.ctx);
      this.ctx.clearRect(0, 0, cw, ch);

      if (!this.hasImage || !this.image) {
        this.previewCtx.clearRect(0, 0, cropPreview.width, cropPreview.height);
        return;
      }

      const scale = this.baseScale * this.zoom;
      const dw = this.image.naturalWidth * scale;
      const dh = this.image.naturalHeight * scale;
      const imgX = (cw - dw) / 2 + this.pan.x;
      const imgY = (ch - dh) / 2 + this.pan.y;
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = "high";
      this.ctx.drawImage(this.image, imgX, imgY, dw, dh);

      this.clampCropToCanvas();
      const { x, y, w, h } = this.crop;
      this.ctx.save();
      this.ctx.fillStyle = "rgba(0,0,0,0.28)";
      this.ctx.beginPath();
      this.ctx.rect(0, 0, cw, ch);
      this.ctx.rect(x, y, w, h);
      this.ctx.fill("evenodd");
      this.ctx.restore();

      this.ctx.save();
      this.ctx.strokeStyle = "rgba(255,255,255,0.95)";
      this.ctx.lineWidth = 2;
      this.ctx.shadowColor = "rgba(0,0,0,0.35)";
      this.ctx.shadowBlur = 8;
      this.ctx.strokeRect(x, y, w, h);
      this.ctx.shadowBlur = 0;
      const handle = 9;
      const corners = this.getHandleRects(handle);
      this.ctx.fillStyle = "rgba(255,255,255,0.95)";
      this.ctx.strokeStyle = "rgba(0,0,0,0.30)";
      this.ctx.lineWidth = 1;
      for (const r of corners) {
        this.ctx.fillRect(r.x, r.y, r.w, r.h);
        this.ctx.strokeRect(r.x, r.y, r.w, r.h);
      }
      this.ctx.restore();

      this.renderPreview({ imgX, imgY, scale });
    }

    renderPreview(transform) {
      const { cropPreview, cropMeta } = this.els;
      const aspect = this.getAspectRatio();
      const maxW = 320;
      const outW = maxW;
      const outH = Math.max(1, Math.round(outW / aspect));
      cropPreview.style.height = "auto";
      cropPreview.width = Math.round(outW * this.dpr);
      cropPreview.height = Math.round(outH * this.dpr);
      this.previewCtx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      this.previewCtx.clearRect(0, 0, outW, outH);

      if (!this.image) return;
      const { imgX, imgY, scale } = transform;
      const sx = (this.crop.x - imgX) / scale;
      const sy = (this.crop.y - imgY) / scale;
      const sw = this.crop.w / scale;
      const sh = this.crop.h / scale;

      const sxi = clamp(sx, 0, this.image.naturalWidth);
      const syi = clamp(sy, 0, this.image.naturalHeight);
      const swi = clamp(sw, 1, this.image.naturalWidth - sxi);
      const shi = clamp(sh, 1, this.image.naturalHeight - syi);

      this.previewCtx.imageSmoothingEnabled = true;
      this.previewCtx.imageSmoothingQuality = "high";
      this.previewCtx.drawImage(this.image, sxi, syi, swi, shi, 0, 0, outW, outH);
      cropMeta.textContent = `${Math.round(swi)} × ${Math.round(shi)} px`;
    }

    getHandleRects(size) {
      const half = size;
      const { x, y, w, h } = this.crop;
      return [
        { id: "nw", x: x - half, y: y - half, w: size * 2, h: size * 2 },
        { id: "ne", x: x + w - half, y: y - half, w: size * 2, h: size * 2 },
        { id: "sw", x: x - half, y: y + h - half, w: size * 2, h: size * 2 },
        { id: "se", x: x + w - half, y: y + h - half, w: size * 2, h: size * 2 },
      ];
    }

    hitTest(point) {
      const { x, y } = point;
      const handle = 9;
      for (const r of this.getHandleRects(handle)) {
        if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return { type: "resize", corner: r.id };
      }
      const c = this.crop;
      if (x >= c.x && x <= c.x + c.w && y >= c.y && y <= c.y + c.h) return { type: "move" };
      return { type: "pan" };
    }

    canvasPointFromEvent(e) {
      const rect = this.els.editorCanvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    onPointerDown(e) {
      if (!this.hasImage) return;
      if (!(e.target instanceof HTMLCanvasElement)) return;
      e.preventDefault();
      const p = this.canvasPointFromEvent(e);
      const hit = this.hitTest(p);
      this.drag = {
        type: hit.type,
        corner: hit.corner,
        start: p,
        startPan: { ...this.pan },
        startCrop: { ...this.crop },
      };
      this.els.editorCanvas.setPointerCapture(e.pointerId);
    }

    onPointerMove(e) {
      if (!this.drag || !this.hasImage) return;
      const p = this.canvasPointFromEvent(e);
      const dx = p.x - this.drag.start.x;
      const dy = p.y - this.drag.start.y;
      const aspect = this.getAspectRatio();

      if (this.drag.type === "pan") {
        this.pan = { x: this.drag.startPan.x + dx, y: this.drag.startPan.y + dy };
        this.scheduleRender();
        return;
      }

      if (this.drag.type === "move") {
        this.crop.x = this.drag.startCrop.x + dx;
        this.crop.y = this.drag.startCrop.y + dy;
        this.clampCropToCanvas();
        this.scheduleRender();
        return;
      }

      const minSize = 60;
      const start = this.drag.startCrop;
      let newCrop = { ...start };
      const corner = this.drag.corner;
      if (!corner) return;

      const anchor = {
        x: corner.includes("w") ? start.x + start.w : start.x,
        y: corner.includes("n") ? start.y + start.h : start.y,
      };

      const targetX = corner.includes("w") ? start.x + dx : start.x + start.w + dx;
      const targetY = corner.includes("n") ? start.y + dy : start.y + start.h + dy;

      let w = Math.abs(targetX - anchor.x);
      let h = w / aspect;
      if (Math.abs(targetY - anchor.y) > h) {
        h = Math.abs(targetY - anchor.y);
        w = h * aspect;
      }

      w = Math.max(minSize, w);
      h = Math.max(minSize, h);

      newCrop.w = w;
      newCrop.h = h;
      newCrop.x = anchor.x - (corner.includes("w") ? w : 0);
      newCrop.y = anchor.y - (corner.includes("n") ? h : 0);
      this.crop = newCrop;
      this.clampCropToCanvas();
      this.scheduleRender();
    }

    onPointerUp() {
      this.drag = null;
    }

    onWheel(e) {
      if (!this.hasImage) return;
      e.preventDefault();
      const p = this.canvasPointFromEvent(e);
      const prevZoom = this.zoom;
      const delta = -e.deltaY;
      const zoomFactor = delta > 0 ? 1.04 : 0.96;
      const nextZoom = clamp(prevZoom * zoomFactor, 1, 4);
      if (nextZoom === prevZoom) return;

      const { cw, ch } = this.getCanvasCssSize(this.els.editorCanvas);
      const scalePrev = this.baseScale * prevZoom;
      const scaleNext = this.baseScale * nextZoom;

      const dwPrev = (this.image ? this.image.naturalWidth : 0) * scalePrev;
      const dhPrev = (this.image ? this.image.naturalHeight : 0) * scalePrev;
      const imgXPrev = (cw - dwPrev) / 2 + this.pan.x;
      const imgYPrev = (ch - dhPrev) / 2 + this.pan.y;
      const ix = (p.x - imgXPrev) / scalePrev;
      const iy = (p.y - imgYPrev) / scalePrev;

      const dwNext = (this.image ? this.image.naturalWidth : 0) * scaleNext;
      const dhNext = (this.image ? this.image.naturalHeight : 0) * scaleNext;
      const imgXNextBase = (cw - dwNext) / 2;
      const imgYNextBase = (ch - dhNext) / 2;
      this.pan.x = p.x - (imgXNextBase + ix * scaleNext);
      this.pan.y = p.y - (imgYNextBase + iy * scaleNext);

      this.setZoom(nextZoom);
    }

    clampCropToCanvas() {
      const { cw, ch } = this.getCanvasCssSize(this.els.editorCanvas);
      const minSize = 60;
      this.crop.w = clamp(this.crop.w, minSize, Math.max(minSize, cw));
      this.crop.h = clamp(this.crop.h, minSize, Math.max(minSize, ch));
      this.crop.x = clamp(this.crop.x, 0, Math.max(0, cw - this.crop.w));
      this.crop.y = clamp(this.crop.y, 0, Math.max(0, ch - this.crop.h));
    }
  }

  class ImageInput {
    /** @param {{
     * fileInput: HTMLInputElement,
     * dropZone: HTMLElement,
     * chooseBtn: HTMLButtonElement,
     * pasteBtn: HTMLButtonElement,
     * resetBtn: HTMLButtonElement,
     * statusText: HTMLElement,
     * previewPlaceholder: HTMLElement,
     * previewImage: HTMLImageElement,
     * metaName: HTMLElement,
     * metaType: HTMLElement,
     * metaSize: HTMLElement,
     * metaDims: HTMLElement,
     * onImageLoaded?: (imgEl: HTMLImageElement) => void,
     * onCleared?: () => void,
     * }} els */
    constructor(els) {
      this.els = els;
      this.currentObjectUrl = null;
      this.currentMeta = null;

      this.onChooseClick = this.onChooseClick.bind(this);
      this.onFileChange = this.onFileChange.bind(this);
      this.onDropZoneClick = this.onDropZoneClick.bind(this);
      this.onDropZoneKeyDown = this.onDropZoneKeyDown.bind(this);
      this.onDragEnter = this.onDragEnter.bind(this);
      this.onDragOver = this.onDragOver.bind(this);
      this.onDragLeave = this.onDragLeave.bind(this);
      this.onDrop = this.onDrop.bind(this);
      this.onPaste = this.onPaste.bind(this);
      this.onPasteClick = this.onPasteClick.bind(this);
      this.onResetClick = this.onResetClick.bind(this);
    }

    init() {
      const { chooseBtn, fileInput, dropZone, pasteBtn, resetBtn } = this.els;

      chooseBtn.addEventListener("click", this.onChooseClick);
      fileInput.addEventListener("change", this.onFileChange);

      dropZone.addEventListener("click", this.onDropZoneClick);
      dropZone.addEventListener("keydown", this.onDropZoneKeyDown);

      dropZone.addEventListener("dragenter", this.onDragEnter);
      dropZone.addEventListener("dragover", this.onDragOver);
      dropZone.addEventListener("dragleave", this.onDragLeave);
      dropZone.addEventListener("drop", this.onDrop);

      window.addEventListener("paste", this.onPaste);
      pasteBtn.addEventListener("click", this.onPasteClick);
      resetBtn.addEventListener("click", this.onResetClick);

      this.setStatus("No image loaded.");
      this.updatePasteButtonState();
      this.resetMeta();
    }

    updatePasteButtonState() {
      const { pasteBtn } = this.els;
      const canReadClipboard = typeof navigator !== "undefined" &&
        navigator.clipboard &&
        typeof navigator.clipboard.read === "function";

      pasteBtn.title = canReadClipboard
        ? "Try to read an image directly from your clipboard"
        : "Clipboard API not available here; use Cmd/Ctrl+V instead";
    }

    setStatus(text) {
      this.els.statusText.textContent = text;
    }

    resetMeta() {
      const { metaName, metaType, metaSize, metaDims } = this.els;
      metaName.textContent = "—";
      metaType.textContent = "—";
      metaSize.textContent = "—";
      metaDims.textContent = "—";
    }

    clearPreview() {
      const { previewImage, previewPlaceholder, fileInput, resetBtn } = this.els;
      if (this.currentObjectUrl) {
        URL.revokeObjectURL(this.currentObjectUrl);
        this.currentObjectUrl = null;
      }
      this.currentMeta = null;
      previewImage.removeAttribute("src");
      previewImage.classList.remove("is-visible");
      previewPlaceholder.style.display = "block";
      fileInput.value = "";
      resetBtn.disabled = true;
      this.resetMeta();
      if (typeof this.els.onCleared === "function") this.els.onCleared();
    }

    /** @param {{blob: Blob, name?: string}} payload */
    async setImageFromBlob(payload) {
      const { blob, name } = payload;
      if (!(blob instanceof Blob)) throw new Error("No image data found.");
      if (!isImageType(blob.type)) {
        throw new Error(`Unsupported clipboard type: ${blob.type || "(unknown)"}`);
      }

      const objectUrl = URL.createObjectURL(blob);
      await this.setPreviewSrc(objectUrl, {
        name: name || "(clipboard image)",
        type: blob.type || "(unknown)",
        size: blob.size,
      });
    }

    /** @param {File} file */
    async setImageFromFile(file) {
      if (!(file instanceof File)) throw new Error("No file selected.");
      if (!isImageType(file.type)) throw new Error("That file isn’t an image.");

      const objectUrl = URL.createObjectURL(file);
      await this.setPreviewSrc(objectUrl, {
        name: file.name || "(unnamed)",
        type: file.type || "(unknown)",
        size: file.size,
      });
    }

    async setPreviewSrc(objectUrl, meta) {
      const { previewImage, previewPlaceholder, resetBtn, metaName, metaType, metaSize, metaDims } = this.els;

      const prevUrl = this.currentObjectUrl;
      this.currentObjectUrl = objectUrl;
      this.currentMeta = meta;

      this.setStatus("Loading image…");

      await new Promise((resolve, reject) => {
        previewImage.onload = () => resolve(undefined);
        previewImage.onerror = () => reject(new Error("Failed to load image."));
        previewImage.src = objectUrl;
      });

      if (prevUrl) URL.revokeObjectURL(prevUrl);

      previewPlaceholder.style.display = "none";
      previewImage.classList.add("is-visible");
      resetBtn.disabled = false;

      metaName.textContent = meta.name;
      metaType.textContent = meta.type;
      metaSize.textContent = formatBytes(meta.size);
      metaDims.textContent = `${previewImage.naturalWidth} × ${previewImage.naturalHeight}`;

      this.setStatus("Image loaded.");
      if (typeof this.els.onImageLoaded === "function") this.els.onImageLoaded(previewImage);
    }

    onChooseClick() {
      this.els.fileInput.click();
    }

    onFileChange() {
      const { fileInput } = this.els;
      const file = fileInput.files && fileInput.files[0];
      if (!file) return;
      this.setImageFromFile(file)
        .catch((err) => {
          this.setStatus(`Error: ${toErrorMessage(err)}`);
          this.clearPreview();
        });
    }

    onDropZoneClick() {
      this.els.fileInput.click();
    }

    onDropZoneKeyDown(e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.els.fileInput.click();
      }
    }

    onDragEnter(e) {
      e.preventDefault();
      this.els.dropZone.classList.add("is-over");
    }

    onDragOver(e) {
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
      this.els.dropZone.classList.add("is-over");
    }

    onDragLeave(e) {
      e.preventDefault();
      const related = e.relatedTarget;
      if (related && this.els.dropZone.contains(related)) return;
      this.els.dropZone.classList.remove("is-over");
    }

    onDrop(e) {
      e.preventDefault();
      this.els.dropZone.classList.remove("is-over");
      const files = e.dataTransfer && e.dataTransfer.files;
      const file = files && files[0];
      if (!file) return;

      this.setImageFromFile(file)
        .catch((err) => {
          this.setStatus(`Error: ${toErrorMessage(err)}`);
          this.clearPreview();
        });
    }

    onPaste(e) {
      const data = e.clipboardData;
      if (!data || !data.items || data.items.length === 0) return;

      for (const item of data.items) {
        if (!isImageType(item.type)) continue;
        const file = item.getAsFile();
        if (!file) continue;
        e.preventDefault();
        this.setStatus("Pasting image…");
        this.setImageFromFile(file)
          .catch((err) => {
            this.setStatus(`Error: ${toErrorMessage(err)}`);
            this.clearPreview();
          });
        return;
      }
    }

    async onPasteClick() {
      try {
        if (!navigator.clipboard || typeof navigator.clipboard.read !== "function") {
          throw new Error("Clipboard API not available here. Use Cmd/Ctrl+V instead.");
        }

        this.setStatus("Reading clipboard…");
        const items = await navigator.clipboard.read();
        for (const item of items) {
          const imageType = item.types.find((t) => isImageType(t));
          if (!imageType) continue;
          const blob = await item.getType(imageType);
          await this.setImageFromBlob({ blob });
          return;
        }

        throw new Error("No image found on clipboard.");
      } catch (err) {
        this.setStatus(`Error: ${toErrorMessage(err)}`);
      }
    }

    onResetClick() {
      this.clearPreview();
      this.setStatus("No image loaded.");
    }
  }

  function main() {
    const root = document.querySelector("[data-image-tools]");
    if (!root) return;

    /** @type {Record<string, HTMLElement | null>} */
    const els = {
      fileInput: document.getElementById("fileInput"),
      dropZone: document.getElementById("dropZone"),
      chooseBtn: document.getElementById("chooseBtn"),
      pasteBtn: document.getElementById("pasteBtn"),
      resetBtn: document.getElementById("resetBtn"),
      statusText: document.getElementById("statusText"),
      previewPlaceholder: document.getElementById("previewPlaceholder"),
      previewImage: document.getElementById("previewImage"),
      metaName: document.getElementById("metaName"),
      metaType: document.getElementById("metaType"),
      metaSize: document.getElementById("metaSize"),
      metaDims: document.getElementById("metaDims"),
      editorCanvas: document.getElementById("editorCanvas"),
      cropPreview: document.getElementById("cropPreview"),
      cropMeta: document.getElementById("cropMeta"),
      aspectSelect: document.getElementById("aspectSelect"),
      zoomRange: document.getElementById("zoomRange"),
      zoomValue: document.getElementById("zoomValue"),
      fitBtn: document.getElementById("fitBtn"),
      centerCropBtn: document.getElementById("centerCropBtn"),
    };

    const requiredKeys = [
      "fileInput",
      "dropZone",
      "chooseBtn",
      "pasteBtn",
      "resetBtn",
      "statusText",
      "previewPlaceholder",
      "previewImage",
      "metaName",
      "metaType",
      "metaSize",
      "metaDims",
      "editorCanvas",
      "cropPreview",
      "cropMeta",
      "aspectSelect",
      "zoomRange",
      "zoomValue",
      "fitBtn",
      "centerCropBtn",
    ];

    for (const key of requiredKeys) {
      if (!els[key]) {
        console.warn(`[image-tools] Missing element: ${key}`);
        return;
      }
    }

    const cropEditor = new CropEditor(/** @type {any} */({
      editorCanvas: els.editorCanvas,
      cropPreview: els.cropPreview,
      cropMeta: els.cropMeta,
      previewPlaceholder: els.previewPlaceholder,
      previewImage: els.previewImage,
      aspectSelect: els.aspectSelect,
      zoomRange: els.zoomRange,
      zoomValue: els.zoomValue,
      fitBtn: els.fitBtn,
      centerCropBtn: els.centerCropBtn,
    }));
    cropEditor.init();
    cropEditor.setEnabled(false);

    const input = new ImageInput(/** @type {any} */({
      ...els,
      onImageLoaded: (imgEl) => cropEditor.setImage(imgEl),
      onCleared: () => cropEditor.clear(),
    }));
    input.init();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main);
  } else {
    main();
  }
})();
```
- Click-to-select image files
- Paste image from clipboard (Ctrl/Cmd+V)
- Optional “Paste from clipboard” button (Clipboard API; requires secure context)
- Immediate preview + basic metadata
- Reset
*/

(function () {
  "use strict";

  /** @param {number} bytes */
  function formatBytes(bytes) {
    if (!Number.isFinite(bytes) || bytes < 0) return "—";
    const units = ["B", "KB", "MB", "GB"];
    let value = bytes;
    let idx = 0;
    while (value >= 1024 && idx < units.length - 1) {
      value /= 1024;
      idx += 1;
    }
    const fixed = idx === 0 ? 0 : value >= 10 ? 1 : 2;
    return `${value.toFixed(fixed)} ${units[idx]}`;
  }

  /** @param {unknown} err */
  function toErrorMessage(err) {
    if (err instanceof Error) return err.message;
    if (typeof err === "string") return err;
    return "Unknown error";
  }

  function isImageType(mimeType) {
    return typeof mimeType === "string" && mimeType.startsWith("image/");
  }

  class ImageInput {
    /** @param {{
     * fileInput: HTMLInputElement,
     * dropZone: HTMLElement,
     * chooseBtn: HTMLButtonElement,
     * pasteBtn: HTMLButtonElement,
     * resetBtn: HTMLButtonElement,
     * statusText: HTMLElement,
     * previewPlaceholder: HTMLElement,
     * previewImage: HTMLImageElement,
     * metaName: HTMLElement,
     * metaType: HTMLElement,
     * metaSize: HTMLElement,
     * metaDims: HTMLElement,
     * }} els */
    constructor(els) {
      this.els = els;
      this.currentObjectUrl = null;
      this.currentMeta = null;

      this.onChooseClick = this.onChooseClick.bind(this);
      this.onFileChange = this.onFileChange.bind(this);
      this.onDropZoneClick = this.onDropZoneClick.bind(this);
      this.onDropZoneKeyDown = this.onDropZoneKeyDown.bind(this);
      this.onDragEnter = this.onDragEnter.bind(this);
      this.onDragOver = this.onDragOver.bind(this);
      this.onDragLeave = this.onDragLeave.bind(this);
      this.onDrop = this.onDrop.bind(this);
      this.onPaste = this.onPaste.bind(this);
      this.onPasteClick = this.onPasteClick.bind(this);
      this.onResetClick = this.onResetClick.bind(this);
    }

    init() {
      const { chooseBtn, fileInput, dropZone, pasteBtn, resetBtn } = this.els;

      chooseBtn.addEventListener("click", this.onChooseClick);
      fileInput.addEventListener("change", this.onFileChange);

      dropZone.addEventListener("click", this.onDropZoneClick);
      dropZone.addEventListener("keydown", this.onDropZoneKeyDown);

      dropZone.addEventListener("dragenter", this.onDragEnter);
      dropZone.addEventListener("dragover", this.onDragOver);
      dropZone.addEventListener("dragleave", this.onDragLeave);
      dropZone.addEventListener("drop", this.onDrop);

      window.addEventListener("paste", this.onPaste);
      pasteBtn.addEventListener("click", this.onPasteClick);
      resetBtn.addEventListener("click", this.onResetClick);

      this.setStatus("No image loaded.");
      this.updatePasteButtonState();
      this.resetMeta();
    }

    updatePasteButtonState() {
      const { pasteBtn } = this.els;
      const canReadClipboard = typeof navigator !== "undefined" &&
        navigator.clipboard &&
        typeof navigator.clipboard.read === "function";

      pasteBtn.title = canReadClipboard
        ? "Try to read an image directly from your clipboard"
        : "Clipboard API not available here; use Cmd/Ctrl+V instead";
    }

    setStatus(text) {
      this.els.statusText.textContent = text;
    }

    resetMeta() {
      const { metaName, metaType, metaSize, metaDims } = this.els;
      metaName.textContent = "—";
      metaType.textContent = "—";
      metaSize.textContent = "—";
      metaDims.textContent = "—";
    }

    clearPreview() {
      const { previewImage, previewPlaceholder, fileInput, resetBtn } = this.els;
      if (this.currentObjectUrl) {
        URL.revokeObjectURL(this.currentObjectUrl);
        this.currentObjectUrl = null;
      }
      this.currentMeta = null;
      previewImage.removeAttribute("src");
      previewImage.classList.remove("is-visible");
      previewPlaceholder.style.display = "block";
      fileInput.value = "";
      resetBtn.disabled = true;
      this.resetMeta();
    }

    /** @param {{blob: Blob, name?: string}} payload */
    async setImageFromBlob(payload) {
      const { blob, name } = payload;
      if (!(blob instanceof Blob)) throw new Error("No image data found.");
      if (!isImageType(blob.type)) {
        throw new Error(`Unsupported clipboard type: ${blob.type || "(unknown)"}`);
      }

      const objectUrl = URL.createObjectURL(blob);
      await this.setPreviewSrc(objectUrl, {
        name: name || "(clipboard image)",
        type: blob.type || "(unknown)",
        size: blob.size,
      });
    }

    /** @param {File} file */
    async setImageFromFile(file) {
      if (!(file instanceof File)) throw new Error("No file selected.");
      if (!isImageType(file.type)) throw new Error("That file isn’t an image.");

      const objectUrl = URL.createObjectURL(file);
      await this.setPreviewSrc(objectUrl, {
        name: file.name || "(unnamed)",
        type: file.type || "(unknown)",
        size: file.size,
      });
    }

    /**
     * @param {string} objectUrl
     * @param {{name: string, type: string, size: number}} meta
     */
    async setPreviewSrc(objectUrl, meta) {
      const { previewImage, previewPlaceholder, resetBtn, metaName, metaType, metaSize, metaDims } = this.els;

      const prevUrl = this.currentObjectUrl;
      this.currentObjectUrl = objectUrl;
      this.currentMeta = meta;

      this.setStatus("Loading image…");

      await new Promise((resolve, reject) => {
        previewImage.onload = () => resolve(undefined);
        previewImage.onerror = () => reject(new Error("Failed to load image."));
        previewImage.src = objectUrl;
      });

      if (prevUrl) URL.revokeObjectURL(prevUrl);

      previewPlaceholder.style.display = "none";
      previewImage.classList.add("is-visible");
      resetBtn.disabled = false;

      metaName.textContent = meta.name;
      metaType.textContent = meta.type;
      metaSize.textContent = formatBytes(meta.size);
      metaDims.textContent = `${previewImage.naturalWidth} × ${previewImage.naturalHeight}`;

      this.setStatus("Image loaded.");
    }

    onChooseClick() {
      this.els.fileInput.click();
    }

    onFileChange() {
      const { fileInput } = this.els;
      const file = fileInput.files && fileInput.files[0];
      if (!file) return;
      this.setImageFromFile(file)
        .catch((err) => {
          this.setStatus(`Error: ${toErrorMessage(err)}`);
          this.clearPreview();
        });
    }

    onDropZoneClick() {
      this.els.fileInput.click();
    }

    /** @param {KeyboardEvent} e */
    onDropZoneKeyDown(e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.els.fileInput.click();
      }
    }

    /** @param {DragEvent} e */
    onDragEnter(e) {
      e.preventDefault();
      this.els.dropZone.classList.add("is-over");
    }

    /** @param {DragEvent} e */
    onDragOver(e) {
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
      this.els.dropZone.classList.add("is-over");
    }

    /** @param {DragEvent} e */
    onDragLeave(e) {
      e.preventDefault();
      const related = e.relatedTarget;
      if (related && this.els.dropZone.contains(related)) return;
      this.els.dropZone.classList.remove("is-over");
    }

    /** @param {DragEvent} e */
    onDrop(e) {
      e.preventDefault();
      this.els.dropZone.classList.remove("is-over");
      const files = e.dataTransfer && e.dataTransfer.files;
      const file = files && files[0];
      if (!file) return;

      this.setImageFromFile(file)
        .catch((err) => {
          this.setStatus(`Error: ${toErrorMessage(err)}`);
          this.clearPreview();
        });
    }

    /** @param {ClipboardEvent} e */
    onPaste(e) {
      const data = e.clipboardData;
      if (!data || !data.items || data.items.length === 0) return;

      for (const item of data.items) {
        if (!isImageType(item.type)) continue;
        const file = item.getAsFile();
        if (!file) continue;
        e.preventDefault();
        this.setStatus("Pasting image…");
        this.setImageFromFile(file)
          .catch((err) => {
            this.setStatus(`Error: ${toErrorMessage(err)}`);
            this.clearPreview();
          });
        return;
      }
    }

    async onPasteClick() {
      try {
        if (!navigator.clipboard || typeof navigator.clipboard.read !== "function") {
          throw new Error("Clipboard API not available here. Use Cmd/Ctrl+V instead.");
        }

        this.setStatus("Reading clipboard…");
        const items = await navigator.clipboard.read();
        for (const item of items) {
          const imageType = item.types.find((t) => isImageType(t));
          if (!imageType) continue;
          const blob = await item.getType(imageType);
          await this.setImageFromBlob({ blob });
          return;
        }

        throw new Error("No image found on clipboard.");
      } catch (err) {
        this.setStatus(`Error: ${toErrorMessage(err)}`);
      }
    }

    onResetClick() {
      this.clearPreview();
      this.setStatus("No image loaded.");
    }
  }

  function main() {
    const root = document.querySelector("[data-image-tools]");
    if (!root) return;

    /** @type {Record<string, HTMLElement>} */
    const els = {
      fileInput: document.getElementById("fileInput"),
      dropZone: document.getElementById("dropZone"),
      chooseBtn: document.getElementById("chooseBtn"),
      pasteBtn: document.getElementById("pasteBtn"),
      resetBtn: document.getElementById("resetBtn"),
      statusText: document.getElementById("statusText"),
      previewPlaceholder: document.getElementById("previewPlaceholder"),
      previewImage: document.getElementById("previewImage"),
      metaName: document.getElementById("metaName"),
      metaType: document.getElementById("metaType"),
      metaSize: document.getElementById("metaSize"),
      metaDims: document.getElementById("metaDims"),
    };

    for (const [key, el] of Object.entries(els)) {
      if (!el) {
        console.warn(`[image-tools] Missing element: ${key}`);
        return;
      }
    }

    const input = new ImageInput(/** @type {any} */(els));
    input.init();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main);
  } else {
    main();
  }
})();
```
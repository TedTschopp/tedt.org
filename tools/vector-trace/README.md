# Vector Trace (Local)

A small, client-side bitmap → SVG tracing workspace.

- No backend.
- No build step.
- Intended to run from a static site (this repo is a Jekyll site).

## Quick start

1. Open `tools/vector-trace/index.html`.
2. Drop / paste / choose an image.
3. Pick an engine.
4. Tune preprocessing + engine params.
5. Copy or download the exported SVG.

If you can, serve it over `http://localhost` for best compatibility.

### Run via a tiny local server (recommended)

From the repo root:

```bash
python3 -m http.server 8000
```

Then open:

- `http://localhost:8000/tools/vector-trace/`

(Any static server works.)

### `file://` usage

This tool can be opened directly via `file://`, but some browser features are commonly restricted:

- Web Workers are often blocked or unreliable on `file://`.
- Clipboard APIs may require a secure context.

The UI will disable the worker toggle and show a hint when it detects `file://`.

## Which engine to use

- **Raster wrapper**: baseline sanity check (no tracing). Useful to validate normalization/export.
- **Potrace (high-contrast)**: logos, icons, line art, diagrams. Best for crisp silhouettes.
- **ImageTracer (multi-color)**: flat-color illustrations/posters. More stylized output.
- **OpenCV contours**: outlines from edges; can be noisy on photos.

## Parameters (high level)

Common preprocessing:

- **Grayscale**: simplifies tracing for logos/line art.
- **Contrast**: boosts separation; helpful before Potrace.
- **Blur**: reduces speckle/noise before tracing.
- **Invert**: flip dark/light depending on the engine expectations.

Export:

- **Minify exports** + **Decimal rounding**: reduces SVG size and stabilizes diffs.

## Self-test mode

Use **Diagnostics → Self-test engines** to run all engines against `tools/vector-trace/test-assets/`.

Checks include:

- SVG parses as XML
- Root element is `<svg>`
- `viewBox` is present

This is meant to catch regressions quickly when tweaking engines, the worker path, or preprocessing.

## Adding engines / libs

- Engines are registered in `tools/vector-trace/vector-trace.js` (look for the `ENGINES` registry).
- If you want the engine to run in a Web Worker, it also needs to be implemented in `tools/vector-trace/worker.js` and allowed by `shouldUseWorkerForEngine()`.
- Keep it client-only and avoid any bundler assumptions.

## Known limitations

- Very large images can be slow; the app warns above 2048px and caps max dimension at 4096px.
- Worker mode is only used for some engines; others run on the main thread.
- Output quality varies strongly by input type (especially photos).

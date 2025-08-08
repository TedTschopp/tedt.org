/*
 * Multi-Scale Hex Map Overlay
 * Renders concentric (or overlaid) hex grids representing multiple hex scales (1,3,6,12,24 mile) on a single canvas.
 * Depends on hex.js (Point, Hex, Layout) already in repository.
 */
(function() {
  if (typeof Layout === 'undefined' || typeof Hex === 'undefined' || typeof Point === 'undefined') {
    console.warn('[hex-multi-scale] Missing hex primitives (hex.js not loaded)');
    return;
  }

  // Ordered largest -> smallest so smaller scales render on top with priority
  const SCALES = [
    // Larger first (underlay). Sizes now computed dynamically for proportional scaling.
    { miles: 36, stroke: 'hsla(255,45%,48%,0.55)', fill: 'hsla(255,45%,55%,0.025)', label: false, lineWidth: 1.1, dash: [7,6] },
    { miles: 6,  stroke: 'hsla(48,90%,45%,0.55)',  fill: 'hsla(48,90%,45%,0.04)',  label: false, lineWidth: 0.85 },
    { miles: 1,  stroke: 'hsla(200,80%,50%,0.70)', fill: 'hsla(200,80%,50%,0.065)', label: false, lineWidth: 0.65 }
  ];

  // Compute all hexes whose polygon intersects the canvas rectangle.
  function tileHexes(layout, width, height) {
    const hexes = [];
    // Estimate bounds in axial coordinates.
    const size = layout.size; // Point
    const hexWidth = Math.sqrt(3) * size.x;
    const hexHeight = 2 * size.y * 0.75 + size.y * 0.25; // approx (since vertical spacing 1.5 * size.y)
    const maxQ = Math.ceil((width / hexWidth)) + 2;
    const maxR = Math.ceil((height / (size.y * 1.5))) + 2;
    // Translate canvas center origin; we'll check polygon corners after translation.
    for (let q = -maxQ; q <= maxQ; q++) {
      for (let r = -maxR; r <= maxR; r++) {
        const s = -q - r;
        // basic axial validity (not strictly needed because we allow all triples summing to zero)
        const hex = new Hex(q, r, s);
        const corners = layout.polygonCorners(hex);
        // If any corner inside bounds, keep.
        let inside = false;
        for (const p of corners) {
          if (p.x >= -width/2 && p.x <= width/2 && p.y >= -height/2 && p.y <= height/2) { inside = true; break; }
        }
        if (!inside) {
          // also keep if center within bounds
          const center = layout.hexToPixel(hex);
          if (center.x >= -width/2 && center.x <= width/2 && center.y >= -height/2 && center.y <= height/2) inside = true;
        }
        if (inside) hexes.push(hex);
      }
    }
    return hexes;
  }

  function drawHex(ctx, layout, hex, stroke, fill, lineWidth = 1, dash) {
    const corners = layout.polygonCorners(hex);
    ctx.beginPath();
    ctx.moveTo(corners[0].x, corners[0].y);
    for (let i = 1; i < corners.length; i++) ctx.lineTo(corners[i].x, corners[i].y);
    ctx.closePath();
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    if (dash) ctx.setLineDash(dash); else ctx.setLineDash([]);
    ctx.stroke();
  }

  function drawLabel(ctx, layout, hex, miles) {
    const center = layout.hexToPixel(hex);
    ctx.fillStyle = 'hsla(0,0%,15%,0.85)';
    ctx.font = '10px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(miles, center.x, center.y);
  }

  function render(canvas) {
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.scale(state.zoom, state.zoom);
  ctx.translate(state.panX, state.panY);

    // Determine base size so largest hex roughly fits inside canvas.
    const largestMiles = SCALES[0].miles; // 36
    // choose target width (90% of min dimension)
    const targetSpan = Math.min(width, height) * 0.9;
    // width of a hex in pixels is sqrt(3) * size; we want largest hex width == targetSpan
    const baseSizePerMile = (targetSpan / Math.sqrt(3)) / largestMiles;

    SCALES.forEach(scale => {
      const size = baseSizePerMile * scale.miles;
      const layout = new Layout(Layout.pointy, new Point(size, size), new Point(0, 0));
      const hexes = tileHexes(layout, width, height);
      hexes.forEach(h => drawHex(ctx, layout, h, scale.stroke, scale.fill, scale.lineWidth, scale.dash));
    });

    ctx.restore();
  }

  function ensureHiDpi(canvas) {
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== rect.width * ratio) {
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      const ctx = canvas.getContext('2d');
      ctx.scale(ratio, ratio);
    }
  }

  const state = {
    zoom: 1,
    panX: 0,
    panY: 0,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0
  };

  function attachControls(canvas) {
    const zoomIn = document.getElementById('hex-zoom-in');
    const zoomOut = document.getElementById('hex-zoom-out');
    const resetBtn = document.getElementById('hex-reset');
    function applyZoom(factor) {
      const newZoom = Math.min(4, Math.max(0.25, state.zoom * factor));
      state.zoom = newZoom;
      render(canvas);
    }
    zoomIn && zoomIn.addEventListener('click', () => applyZoom(1.25));
    zoomOut && zoomOut.addEventListener('click', () => applyZoom(0.8));
    resetBtn && resetBtn.addEventListener('click', () => { state.zoom = 1; state.panX = 0; state.panY = 0; render(canvas); });

    // Drag to pan
    canvas.addEventListener('mousedown', e => {
      state.isDragging = true;
      state.dragStartX = e.clientX;
      state.dragStartY = e.clientY;
      canvas.style.cursor = 'grabbing';
    });
    window.addEventListener('mouseup', () => {
      state.isDragging = false;
      canvas.style.cursor = 'grab';
    });
    window.addEventListener('mousemove', e => {
      if (!state.isDragging) return;
      const dx = e.clientX - state.dragStartX;
      const dy = e.clientY - state.dragStartY;
      state.dragStartX = e.clientX;
      state.dragStartY = e.clientY;
      // Convert screen delta to world delta
      state.panX += dx / state.zoom;
      state.panY += dy / state.zoom;
      render(canvas);
    });
    // Set initial cursor
    canvas.style.cursor = 'grab';
  }

  function init() {
    const canvas = document.getElementById('hex-multi-scale');
    if (!canvas) return;
    ensureHiDpi(canvas);
    render(canvas);
  attachControls(canvas);
    window.addEventListener('resize', () => { ensureHiDpi(canvas); render(canvas); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

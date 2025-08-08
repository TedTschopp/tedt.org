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
    // Larger scales rendered first (underlay)
    { miles: 36, size: 40, stroke: 'hsla(255,45%,48%,0.55)', fill: 'hsla(255,45%,55%,0.03)', label: false, lineWidth: 1.2, dash: [6,5] },
    { miles: 6,  size: 14, stroke: 'hsla(48,90%,45%,0.55)',  fill: 'hsla(48,90%,45%,0.045)', label: false, lineWidth: 0.95 },
    { miles: 1,  size: 6,  stroke: 'hsla(200,80%,50%,0.70)', fill: 'hsla(200,80%,50%,0.07)', label: false, lineWidth: 0.7 }
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

    SCALES.forEach(scale => {
      const layout = new Layout(Layout.pointy, new Point(scale.size, scale.size), new Point(0, 0));
      const hexes = tileHexes(layout, width, height);
      hexes.forEach(h => drawHex(ctx, layout, h, scale.stroke, scale.fill, scale.lineWidth, scale.dash));
      // Optionally label origin for each scale (disabled to avoid clutter). Uncomment if desired.
      // drawLabel(ctx, layout, new Hex(0,0,0), scale.miles + ' mi');
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

  function init() {
    const canvas = document.getElementById('hex-multi-scale');
    if (!canvas) return;
    ensureHiDpi(canvas);
    render(canvas);
    window.addEventListener('resize', () => { ensureHiDpi(canvas); render(canvas); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

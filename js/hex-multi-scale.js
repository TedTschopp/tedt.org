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
    { miles: 72, radius: 5,  size: 8,   stroke: 'hsla(280,40%,45%,0.55)', fill: 'hsla(280,40%,55%,0.035)', label: false, lineWidth: 1.25, dash: [6,4] },
    { miles: 36, radius: 6,  size: 10,  stroke: 'hsla(255,45%,48%,0.55)', fill: 'hsla(255,45%,55%,0.035)', label: false, lineWidth: 1.15, dash: [5,4] },
    { miles: 24, radius: 7,  size: 12,  stroke: 'hsla(300,55%,60%,0.55)', fill: 'hsla(300,55%,60%,0.04)',  label: false, lineWidth: 1.1 },
    { miles: 12, radius: 9,  size: 18,  stroke: 'hsla(15,80%,55%,0.55)',  fill: 'hsla(15,80%,55%,0.04)',  label: false, lineWidth: 1 },
    { miles: 6,  radius: 11, size: 26,  stroke: 'hsla(48,90%,45%,0.55)',  fill: 'hsla(48,90%,45%,0.05)',  label: false, lineWidth: 0.9 },
    { miles: 3,  radius: 14, size: 34,  stroke: 'hsla(140,60%,45%,0.55)', fill: 'hsla(140,60%,45%,0.06)',  label: false, lineWidth: 0.85 },
    { miles: 1,  radius: 18, size: 44,  stroke: 'hsla(200,80%,50%,0.65)', fill: 'hsla(200,80%,50%,0.08)',  label: true,  lineWidth: 0.8 }
  ];

  function shapeHexagon(size) {
    const hexes = [];
    for (let q = -size; q <= size; q++) {
      const r1 = Math.max(-size, -q - size);
      const r2 = Math.min(size, -q + size);
      for (let r = r1; r <= r2; r++) {
        hexes.push(new Hex(q, r, -q - r));
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
      const hexes = shapeHexagon(scale.radius);
  hexes.forEach(h => drawHex(ctx, layout, h, scale.stroke, scale.fill, scale.lineWidth, scale.dash));
      if (scale.label) {
        // label only the center for smallest scale to avoid noise
        drawLabel(ctx, layout, new Hex(0,0,0), scale.miles + ' mi');
      }
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

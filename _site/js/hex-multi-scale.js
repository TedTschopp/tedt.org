/*
 * Multi-Scale Hex Map Overlay
 * Renders layered hex grids for 36 / 6 / 1 mile scales on a single canvas with pan + wheel / pinch zoom.
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
    const ratio = window.devicePixelRatio || 1;
    const physicalW = canvas.width;   // actual backing store size
    const physicalH = canvas.height;
    const width = physicalW / ratio;  // logical (CSS) size
    const height = physicalH / ratio;

    // Reset transform and clear entire backing store.
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, physicalW, physicalH);

    // Re-apply hiDPI scale so 1 unit == 1 CSS pixel.
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.scale(state.zoom, state.zoom);
    ctx.translate(state.panX, state.panY);

    // Determine base size so largest hex roughly fits inside visible logical canvas.
    const largestMiles = SCALES[0].miles; // 36
    const targetSpan = Math.min(width, height) * 0.9;
    const baseSizePerMile = (targetSpan / Math.sqrt(3)) / largestMiles;

    let totalHexes = 0;
    SCALES.forEach(scale => {
      const size = baseSizePerMile * scale.miles;
      const layout = new Layout(Layout.pointy, new Point(size, size), new Point(0, 0));
      const hexes = tileHexes(layout, width, height);
      totalHexes += hexes.length;
      hexes.forEach(h => drawHex(ctx, layout, h, scale.stroke, scale.fill, scale.lineWidth, scale.dash));
    });

    // Center marker (debug)
    ctx.save();
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(0, 0, 4 / state.zoom, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    if (window.HEX_DEBUG) {
      console.log('[hex-multi-scale] render', { width, height, ratio, totalHexes, zoom: state.zoom, panX: state.panX, panY: state.panY });
    }

    ctx.restore();
  }

  function ensureHiDpi(canvas) {
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== rect.width * ratio) {
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
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

  function buildLegend() {
    const el = document.getElementById('hex-legend');
    if (!el) return;
    if (el.dataset.populated === 'yes') return; // build once
    const lines = SCALES.map(s => {
      const swatch = `<span style=\"display:inline-block;width:1em;height:1em;margin-right:.4em;border:1px solid ${s.stroke};background:${s.fill};outline:1px solid rgba(0,0,0,.35);\"></span>`;
      return `<div class=\"d-flex align-items-center mb-1\" style=\"gap:.25rem;\">${swatch}<span><strong>${s.miles}</strong> mile hex</span></div>`;
    }).join('');
    el.innerHTML = `<div class=\"fw-semibold mb-1\">Legend</div>${lines}<div class=\"text-muted mt-1\">Origin at canvas center. Drag to pan. Wheel / pinch to zoom.</div>`;
    el.dataset.populated = 'yes';
  }

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
    // Wheel zoom (zoom to cursor position by adjusting pan so point under cursor stays roughly stable)
    canvas.addEventListener('wheel', e => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const cx = (e.clientX - rect.left) - rect.width / 2;
      const cy = (e.clientY - rect.top) - rect.height / 2;
      const worldX = (cx / state.zoom) - state.panX;
      const worldY = (cy / state.zoom) - state.panY;
      const factor = e.deltaY < 0 ? 1.15 : 0.85;
      const newZoom = Math.min(4, Math.max(0.25, state.zoom * factor));
      if (newZoom === state.zoom) return;
      state.zoom = newZoom;
      // Recompute pan so world point stays put
      state.panX = (cx / state.zoom) - worldX;
      state.panY = (cy / state.zoom) - worldY;
      render(canvas);
    }, { passive: false });

    // Touch pinch zoom & pan
    let lastTouchDist = null;
    let touchCenter = null;
    canvas.addEventListener('touchstart', e => {
      if (e.touches.length === 1) {
        // single finger pan
        state.isDragging = true;
        state.dragStartX = e.touches[0].clientX;
        state.dragStartY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        state.isDragging = false;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        lastTouchDist = Math.hypot(dx, dy);
        touchCenter = {
          x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
          y: (e.touches[0].clientY + e.touches[1].clientY) / 2
        };
      }
    }, { passive: false });
    canvas.addEventListener('touchmove', e => {
      if (e.touches.length === 1 && state.isDragging) {
        const t = e.touches[0];
        const dx = t.clientX - state.dragStartX;
        const dy = t.clientY - state.dragStartY;
        state.dragStartX = t.clientX;
        state.dragStartY = t.clientY;
        state.panX += dx / state.zoom;
        state.panY += dy / state.zoom;
        render(canvas);
      } else if (e.touches.length === 2) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        if (lastTouchDist) {
          const rect = canvas.getBoundingClientRect();
            const cx = (touchCenter.x - rect.left) - rect.width / 2;
            const cy = (touchCenter.y - rect.top) - rect.height / 2;
            const worldX = (cx / state.zoom) - state.panX;
            const worldY = (cy / state.zoom) - state.panY;
          const factor = dist / lastTouchDist;
          const newZoom = Math.min(4, Math.max(0.25, state.zoom * factor));
          if (newZoom !== state.zoom) {
            state.zoom = newZoom;
            state.panX = (cx / state.zoom) - worldX;
            state.panY = (cy / state.zoom) - worldY;
            render(canvas);
          }
        }
        lastTouchDist = dist;
      }
    }, { passive: false });
    canvas.addEventListener('touchend', e => {
      if (e.touches.length < 2) {
        lastTouchDist = null;
        touchCenter = null;
      }
      if (e.touches.length === 0) state.isDragging = false;
    });

    // Set initial cursor
    canvas.style.cursor = 'grab';
  }

  function init() {
    const canvas = document.getElementById('hex-multi-scale');
    if (!canvas) return;
    ensureHiDpi(canvas);
    render(canvas);
    buildLegend();
    attachControls(canvas);
    window.addEventListener('resize', () => { ensureHiDpi(canvas); render(canvas); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

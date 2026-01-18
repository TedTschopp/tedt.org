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

	function isSvgType(mimeType) {
		return mimeType === "image/svg+xml";
	}

	function clamp(value, min, max) {
		return Math.max(min, Math.min(max, value));
	}

	function clampInt(value, min, max) {
		return Math.max(min, Math.min(max, Math.round(value)));
	}

	function sanitizeSvgStrict(svgText, report) {
		const text = String(svgText || "").trim();
		if (!text.includes("<svg")) throw new Error("No <svg> tag found.");
		const parser = new DOMParser();
		const doc = parser.parseFromString(text, "image/svg+xml");
		if (doc.querySelector("parsererror")) throw new Error("Invalid SVG markup.");
		const svg = doc.documentElement;
		if (!svg || svg.nodeName.toLowerCase() !== "svg") throw new Error("Invalid SVG.");

		/** @type {any} */
		const rpt = report && typeof report === "object" ? report : null;
		if (rpt) {
			rpt.removedElements = 0;
			rpt.removedAttributes = 0;
			rpt.modifiedAttributes = 0;
			rpt.sanitizedStyleBlocks = 0;
			rpt.strippedStyleImports = 0;
			rpt.strippedStyleUrls = 0;
		}

		for (const sel of [
			"script",
			"foreignObject",
			"iframe",
			"object",
			"embed",
			"link",
			"meta",
			"base",
			"audio",
			"video",
			"source",
			"animate",
			"set",
			"animateMotion",
			"animateTransform",
			"feImage",
		]) {
			for (const el of Array.from(svg.querySelectorAll(sel))) {
				el.remove();
				if (rpt) rpt.removedElements += 1;
			}
		}

		// Strip stylesheets / imports / external URLs in <style> blocks.
		for (const styleEl of Array.from(svg.querySelectorAll("style"))) {
			const css = String(styleEl.textContent || "");
			if (!css) continue;
			const importsBefore = (css.match(/@import[^;]+;/gi) || []).length;
			let safe = css.replace(/@import[^;]+;/gi, "");
			if (rpt && importsBefore) rpt.strippedStyleImports += importsBefore;
			safe = safe.replace(/url\(([^)]+)\)/gi, (m, inner) => {
				const raw = String(inner).trim().replace(/^['"]|['"]$/g, "");
				if (/^#/.test(raw)) return m;
				if (/^data:/i.test(raw)) return m;
				if (rpt) rpt.strippedStyleUrls += 1;
				return "";
			});
			if (rpt && safe !== css) rpt.sanitizedStyleBlocks += 1;
			styleEl.textContent = safe;
		}

		const all = Array.from(svg.querySelectorAll("*"));
		for (const el of all) {
			for (const attr of Array.from(el.attributes)) {
				const n = attr.name;
				const nameLower = n.toLowerCase();
				const value = String(attr.value || "").trim();

				// Drop any event handlers.
				if (/^on/i.test(nameLower)) {
					el.removeAttribute(n);
					if (rpt) rpt.removedAttributes += 1;
					continue;
				}

				// Strip javascript: URLs anywhere.
				if (/(^|\s)javascript\s*:/i.test(value)) {
					el.removeAttribute(n);
					if (rpt) rpt.removedAttributes += 1;
					continue;
				}

				// Restrict link-like attributes to internal fragments or data: URLs.
				if (nameLower === "href" || nameLower === "xlink:href" || nameLower === "src") {
					if (/^#/.test(value) || /^data:/i.test(value)) continue;
					el.removeAttribute(n);
					if (rpt) rpt.removedAttributes += 1;
					continue;
				}

				// Restrict url(...) uses in attributes to fragment refs (url(#id)).
				if (/(^|\s)url\(/i.test(value)) {
					const cleaned = value.replace(/url\(([^)]+)\)/gi, (m, inner) => {
						const raw = String(inner).trim().replace(/^['"]|['"]$/g, "");
						return /^#/.test(raw) ? m : "";
					});
					if (!cleaned.trim()) {
						el.removeAttribute(n);
						if (rpt) rpt.removedAttributes += 1;
					} else if (cleaned !== value) {
						el.setAttribute(n, cleaned);
						if (rpt) rpt.modifiedAttributes += 1;
					}
					continue;
				}
			}
		}

		if (!svg.getAttribute("xmlns")) svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
		if (!svg.getAttribute("xmlns:xlink")) svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
		return new XMLSerializer().serializeToString(svg);
	}

	function getSvgIntrinsicSizeFromText(svgText) {
		const parser = new DOMParser();
		const doc = parser.parseFromString(svgText, "image/svg+xml");
		const svg = doc.documentElement;
		const wAttr = svg.getAttribute("width") || "";
		const hAttr = svg.getAttribute("height") || "";
		const vb = svg.getAttribute("viewBox") || "";

		const parseLen = (s) => {
			const m = /^\s*(\d+(?:\.\d+)?)/.exec(String(s));
			return m ? Number(m[1]) : NaN;
		};

		const w = parseLen(wAttr);
		const h = parseLen(hAttr);
		if (Number.isFinite(w) && Number.isFinite(h) && w > 0 && h > 0) return { w, h, source: "width/height" };

		const nums = vb.trim().split(/[\s,]+/).map(Number);
		if (nums.length === 4 && nums.every((n) => Number.isFinite(n))) {
			const vbW = Math.max(1, nums[2]);
			const vbH = Math.max(1, nums[3]);
			return { w: vbW, h: vbH, source: "viewBox" };
		}
		return { w: 512, h: 512, source: "fallback" };
	}

	function bytesToBase64(bytes) {
		let bin = "";
		const chunk = 0x8000;
		for (let i = 0; i < bytes.length; i += chunk) {
			bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
		}
		return btoa(bin);
	}

	function base64ToBytes(b64) {
		const bin = atob(String(b64 || ""));
		const bytes = new Uint8Array(bin.length);
		for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
		return bytes;
	}

	function svgTextToBase64(svgText) {
		const encoder = new TextEncoder();
		const bytes = encoder.encode(String(svgText || ""));
		return bytesToBase64(bytes);
	}

	function base64ToSvgText(b64) {
		const bytes = base64ToBytes(b64);
		const decoder = new TextDecoder();
		return decoder.decode(bytes);
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
		 * previewPlaceholder: HTMLElement,
		 * previewImage: HTMLImageElement,
		 * aspectSelect: HTMLSelectElement,
		 * zoomRange: HTMLInputElement,
		 * zoomValue: HTMLElement,
		 * fitBtn: HTMLButtonElement,
		 * centerCropBtn: HTMLButtonElement,
		 * onCropChanged?: (info: { cropW: number, cropH: number }) => void,
		 * }} els */
		constructor(els) {
			this.els = els;
			this.ctx = els.editorCanvas.getContext("2d");
			this.onCropChanged = typeof els.onCropChanged === "function" ? els.onCropChanged : null;
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
			this.onResetView = this.onResetView.bind(this);
		}

		init() {
			const { editorCanvas, aspectSelect, zoomRange, fitBtn, centerCropBtn, resetViewBtn } = this.els;
			if (!this.ctx) {
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
			if (resetViewBtn) resetViewBtn.addEventListener("click", this.onResetView);

			this.resizeObserver = new ResizeObserver(() => this.scheduleRender());
			this.resizeObserver.observe(editorCanvas);
			this.scheduleRender();
		}

		setEnabled(enabled) {
			this.els.zoomRange.disabled = !enabled;
			this.els.fitBtn.disabled = !enabled;
			this.els.centerCropBtn.disabled = !enabled;
			if (this.els.resetViewBtn) this.els.resetViewBtn.disabled = !enabled;
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
			this.fitToCrop();
			this.scheduleRender();
		}

		onZoomInput() {
			this.setZoom(Number(this.els.zoomRange.value));
		}

		setZoom(z) {
			this.zoom = clamp(Number.isFinite(z) ? z : 1, 0.25, 4);
			this.els.zoomRange.value = String(this.zoom);
			this.els.zoomValue.textContent = `${Math.round(this.zoom * 100)}%`;
			this.scheduleRender();
		}

		onFit() {
			if (!this.hasImage) return;
			this.fitToCrop();
			this.scheduleRender();
		}

		onCenterCrop() {
			if (!this.hasImage) return;
			this.centerCrop();
			this.fitToCrop();
			this.scheduleRender();
		}

		onResetView() {
			if (!this.hasImage) return;
			// Restore initial "sane" view: fit image to canvas, center the crop, then ensure
			// the image covers that crop (so the crop isn't over empty space).
			this.fit();
			this.centerCrop();
			this.fitToCrop();
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

		fitToCrop() {
			// Zoom and pan the image so the *entire image fits inside* the current crop box.
			// This enables letterboxing/pillarboxing workflows and ensures the crop never cuts off the image.
			const { cw, ch } = this.getCanvasCssSize(this.els.editorCanvas);
			if (!this.image || cw <= 0 || ch <= 0) return;
			const iw = this.image.naturalWidth;
			const ih = this.image.naturalHeight;

			// Ensure baseScale is initialized.
			if (!Number.isFinite(this.baseScale) || this.baseScale <= 0) this.baseScale = 1;

			const cropW = Math.max(1, this.crop.w);
			const cropH = Math.max(1, this.crop.h);
			const requiredScale = Math.min(cropW / iw, cropH / ih);
			const minZoom = Number(this.els.zoomRange.min || 0.25);
			const maxZoom = Number(this.els.zoomRange.max || 4);
			const z = clamp(requiredScale / this.baseScale, minZoom, maxZoom);

			// Center the image under the crop box.
			const cropCx = this.crop.x + cropW / 2;
			const cropCy = this.crop.y + cropH / 2;
			this.pan.x = cropCx - cw / 2;
			this.pan.y = cropCy - ch / 2;
			this.setZoom(z);
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
			if (!this.ctx) return;
			const { editorCanvas } = this.els;
			const { cw, ch } = this.ensureCanvasResolution(editorCanvas, this.ctx);
			this.ctx.clearRect(0, 0, cw, ch);

			if (!this.hasImage || !this.image) {
				return;
			}

			// If the editor panel is hidden, the canvas CSS size can be 0×0.
			// Avoid clamping/mutating crop state based on that transient layout.
			if (cw < 2 || ch < 2) return;

			// Draw image
			const { imgX, imgY, scale, dw, dh } = this.getTransform({ cw, ch });
			this.ctx.imageSmoothingEnabled = true;
			this.ctx.imageSmoothingQuality = "high";
			this.ctx.drawImage(this.image, imgX, imgY, dw, dh);

			// Overlay outside crop
			this.clampCropToCanvas();
			const { x, y, w, h } = this.crop;
			this.ctx.save();
			this.ctx.fillStyle = "rgba(0,0,0,0.28)";
			this.ctx.beginPath();
			this.ctx.rect(0, 0, cw, ch);
			this.ctx.rect(x, y, w, h);
			this.ctx.fill("evenodd");
			this.ctx.restore();

			// Crop border + handles
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

			// Keep downstream export/estimate UI in sync with the current crop *and* pan/zoom.
			if (this.onCropChanged) {
				const rect = this.getCropRectInImagePixels();
				if (rect) this.onCropChanged({ cropW: rect.w, cropH: rect.h });
			}
		}

		getTransform(canvasCssSize) {
			const { cw, ch } = canvasCssSize || this.getCanvasCssSize(this.els.editorCanvas);
			const scale = this.baseScale * this.zoom;
			const iw = this.image ? this.image.naturalWidth : 0;
			const ih = this.image ? this.image.naturalHeight : 0;
			const dw = iw * scale;
			const dh = ih * scale;
			const imgX = (cw - dw) / 2 + this.pan.x;
			const imgY = (ch - dh) / 2 + this.pan.y;
			return { cw, ch, scale, imgX, imgY, dw, dh };
		}

		getCropRectInImagePixels() {
			if (!this.image) return null;
			const t = this.getTransform();
			const sx = (this.crop.x - t.imgX) / t.scale;
			const sy = (this.crop.y - t.imgY) / t.scale;
			const sw = this.crop.w / t.scale;
			const sh = this.crop.h / t.scale;

			const sxi = clamp(sx, 0, this.image.naturalWidth);
			const syi = clamp(sy, 0, this.image.naturalHeight);
			const swi = clamp(sw, 1, this.image.naturalWidth - sxi);
			const shi = clamp(sh, 1, this.image.naturalHeight - syi);

			return { x: sxi, y: syi, w: swi, h: shi };
		}

		// Cropped preview removed; output preview is handled by ExportController.

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

			// resize
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
			const minZoom = Number(this.els.zoomRange.min || 0.25);
			const maxZoom = Number(this.els.zoomRange.max || 4);
			const nextZoom = clamp(prevZoom * zoomFactor, minZoom, maxZoom);
			if (nextZoom === prevZoom) return;

			// Keep pointer position stable during zoom
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
			let w = Math.max(minSize, this.crop.w);
			let h = Math.max(minSize, this.crop.h);

			// Keep crop aspect stable when clamping.
			const aspect = this.getAspectRatio();
			if (Number.isFinite(aspect) && aspect > 0) {
				// Prefer adjusting height from width to match the chosen aspect.
				h = Math.max(minSize, w / aspect);
			}

			// If the crop doesn't fit, scale it down uniformly (preserve aspect).
			const maxW = Math.max(minSize, cw);
			const maxH = Math.max(minSize, ch);
			const s = Math.min(1, maxW / w, maxH / h);
			w = Math.max(minSize, w * s);
			h = Math.max(minSize, h * s);

			const x = clamp(this.crop.x, 0, Math.max(0, cw - w));
			const y = clamp(this.crop.y, 0, Math.max(0, ch - h));
			this.crop = { x, y, w, h };
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
		 * isActive?: () => boolean,
		 * }} els */
		constructor(els) {
			this.els = els;
			this.currentObjectUrl = null;
			this.currentMeta = null;
			this.isActive = typeof els.isActive === "function" ? els.isActive : () => true;

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

			// Keep enabled even if not supported: clicking will show a helpful error.
			// But adjust title/hint for discoverability.
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
			// Keep a harmless placeholder src to avoid a broken-image icon in some browsers.
			previewImage.src = "data:image/gif;base64,R0lGODlhAQABAPAAAP///wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";
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

		/**
		 * @param {string} objectUrl
		 * @param {{name: string, type: string, size: number}} meta
		 */
		async setPreviewSrc(objectUrl, meta) {
			const { previewImage, previewPlaceholder, resetBtn, metaName, metaType, metaSize, metaDims } = this.els;

			// Revoke any prior URL after successful load to avoid flicker in case of errors.
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
			if (!this.isActive()) return;
			this.els.fileInput.click();
		}

		onFileChange() {
			if (!this.isActive()) return;
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
			if (!this.isActive()) return;
			this.els.fileInput.click();
		}

		/** @param {KeyboardEvent} e */
		onDropZoneKeyDown(e) {
			if (!this.isActive()) return;
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
			if (!this.isActive()) return;
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
			if (!this.isActive()) return;
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
				if (!this.isActive()) return;
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
			if (!this.isActive()) return;
			this.clearPreview();
			this.setStatus("No image loaded.");
		}
	}

	class TabsController {
		/** @param {{ root: HTMLElement }} opts */
		constructor(opts) {
			this.root = opts.root;
			this.active = "editor";
			this.tabs = Array.from(this.root.querySelectorAll("[role=tab][data-tab]"));
			this.panels = Array.from(this.root.querySelectorAll("[role=tabpanel][data-panel]"));
			this.views = Array.from(this.root.querySelectorAll(".view[data-view]"));
			this.onClick = this.onClick.bind(this);
			this.onKeyDown = this.onKeyDown.bind(this);
		}

		init() {
			for (const t of this.tabs) {
				t.addEventListener("click", this.onClick);
				t.addEventListener("keydown", this.onKeyDown);
			}
			this.setActive("editor");
		}

		isActive(name) {
			return this.active === name;
		}

		setActive(name) {
			this.active = name;

			for (const t of this.tabs) {
				const isOn = t.getAttribute("data-tab") === name;
				t.setAttribute("aria-selected", isOn ? "true" : "false");
				t.tabIndex = isOn ? 0 : -1;
			}

			for (const p of this.panels) {
				p.hidden = p.getAttribute("data-panel") !== name;
			}

			for (const v of this.views) {
				v.hidden = v.getAttribute("data-view") !== name;
			}

			this.root.dispatchEvent(new CustomEvent("image-tools:tabchange", { detail: { name }, bubbles: true }));
		}

		onClick(e) {
			const btn = e.currentTarget;
			if (!(btn instanceof HTMLElement)) return;
			const name = btn.getAttribute("data-tab");
			if (!name) return;
			this.setActive(name);
		}

		onKeyDown(e) {
			const current = e.currentTarget;
			if (!(current instanceof HTMLElement)) return;
			const idx = this.tabs.indexOf(current);
			if (idx < 0) return;
			if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
				e.preventDefault();
				const next = e.key === "ArrowRight" ? idx + 1 : idx - 1;
				const wrapped = (next + this.tabs.length) % this.tabs.length;
				this.tabs[wrapped].focus();
			}
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				const name = current.getAttribute("data-tab");
				if (name) this.setActive(name);
			}
		}
	}

	class StateAndPortability {
		/** @param {{
		 * root: HTMLElement,
		 * tabs: TabsController,
		 * copyLinkBtn: HTMLElement | null,
		 * clearStateBtn: HTMLElement | null,
		 * globalStatusText: HTMLElement | null,
		 * }} opts */
		constructor(opts) {
			this.root = opts.root;
			this.tabs = opts.tabs;
			this.copyLinkBtn = opts.copyLinkBtn;
			this.clearStateBtn = opts.clearStateBtn;
			this.globalStatusText = opts.globalStatusText;
			this.storageKey = "imageTools.state.v1";
			this.textStorageKey = "imageTools.text.v1";
			this.saveTimer = 0;
			this.onAnyChange = this.onAnyChange.bind(this);
			this.onTabChange = this.onTabChange.bind(this);
			this.onCopyLink = this.onCopyLink.bind(this);
			this.onClearSaved = this.onClearSaved.bind(this);
			this.onOnlineStatusChange = this.onOnlineStatusChange.bind(this);
		}

		setGlobalStatus(msg) {
			if (this.globalStatusText) this.globalStatusText.textContent = msg;
		}

		getDefaults() {
			return {
				tab: "editor",
				// Editor
				aspect: "1:1",
				zoom: 1,
				outWidth: 512,
				outHeight: 512,
				lockAspect: true,
				format: "png",
				bgColor: "#ffffff",
				bgTransparent: true,
				jpegQuality: 0.82,
				bgRemoveEnabled: false,
				bgRemoveThreshold: 38,
				bgRemoveFeather: 1.5,
				bgRemoveInset: 8,
				// SVG→Raster
				s2rFormat: "png",
				s2rOutWidth: 512,
				s2rOutHeight: 512,
				s2rPadding: 0,
				s2rBgColor: "#ffffff",
				s2rTransparent: true,
			};
		}

		/** @returns {URL} */
		buildUrlFromCurrentState() {
			const state = this.collectState();
			const url = new URL(window.location.href);
			const defaults = this.getDefaults();
			const p = url.searchParams;

			for (const k of [
				"tab",
				"a",
				"z",
				"ow",
				"oh",
				"la",
				"fmt",
				"bg",
				"tr",
				"jq",
				"br",
				"brt",
				"brf",
				"bri",
				"s2rf",
				"s2row",
				"s2roh",
				"s2rpad",
				"s2rbg",
				"s2rtr",
			]) {
				p.delete(k);
			}

			// Keep URLs short by only including non-default values.
			p.set("tab", state.tab);
			if (state.aspect !== defaults.aspect) p.set("a", state.aspect);
			if (state.zoom !== defaults.zoom) p.set("z", String(state.zoom));
			if (state.outWidth !== defaults.outWidth) p.set("ow", String(state.outWidth));
			if (state.outHeight !== defaults.outHeight) p.set("oh", String(state.outHeight));
			if (state.lockAspect !== defaults.lockAspect) p.set("la", state.lockAspect ? "1" : "0");
			if (state.format !== defaults.format) p.set("fmt", state.format);
			if (state.bgColor !== defaults.bgColor) p.set("bg", state.bgColor);
			if (state.bgTransparent !== defaults.bgTransparent) p.set("tr", state.bgTransparent ? "1" : "0");
			if (state.jpegQuality !== defaults.jpegQuality) p.set("jq", String(state.jpegQuality));
			if (state.bgRemoveEnabled !== defaults.bgRemoveEnabled) p.set("br", state.bgRemoveEnabled ? "1" : "0");
			if (state.bgRemoveThreshold !== defaults.bgRemoveThreshold) p.set("brt", String(state.bgRemoveThreshold));
			if (state.bgRemoveFeather !== defaults.bgRemoveFeather) p.set("brf", String(state.bgRemoveFeather));
			if (state.bgRemoveInset !== defaults.bgRemoveInset) p.set("bri", String(state.bgRemoveInset));
			if (state.s2rFormat !== defaults.s2rFormat) p.set("s2rf", state.s2rFormat);
			if (state.s2rOutWidth !== defaults.s2rOutWidth) p.set("s2row", String(state.s2rOutWidth));
			if (state.s2rOutHeight !== defaults.s2rOutHeight) p.set("s2roh", String(state.s2rOutHeight));
			if (state.s2rPadding !== defaults.s2rPadding) p.set("s2rpad", String(state.s2rPadding));
			if (state.s2rBgColor !== defaults.s2rBgColor) p.set("s2rbg", state.s2rBgColor);
			if (state.s2rTransparent !== defaults.s2rTransparent) p.set("s2rtr", state.s2rTransparent ? "1" : "0");

			return url;
		}

		readNumber(params, key, fallback) {
			const raw = params.get(key);
			if (!raw) return fallback;
			const n = Number(raw);
			return Number.isFinite(n) ? n : fallback;
		}

		readBool(params, key, fallback) {
			const raw = params.get(key);
			if (raw === null) return fallback;
			if (raw === "1" || raw === "true") return true;
			if (raw === "0" || raw === "false") return false;
			return fallback;
		}

		/** @returns {any} */
		collectState() {
			const d = this.getDefaults();
			/** @type {(id: string) => HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null} */
			const $ = (id) => /** @type {any} */(document.getElementById(id));

			const aspect = $("aspectSelect");
			const zoom = $("zoomRange");
			const outWidth = $("outWidth");
			const outHeight = $("outHeight");
			const lockAspect = $("lockAspect");
			const format = $("formatSelect");
			const bgColor = $("bgColor");
			const bgTransparent = $("bgTransparent");
			const jpegQuality = $("jpegQuality");
			const bgRemoveEnabled = $("bgRemoveEnabled");
			const bgRemoveThreshold = $("bgRemoveThreshold");
			const bgRemoveFeather = $("bgRemoveFeather");
			const bgRemoveInset = $("bgRemoveInset");

			const s2rFormat = $("s2rFormat");
			const s2rOutWidth = $("s2rOutWidth");
			const s2rOutHeight = $("s2rOutHeight");
			const s2rPadding = $("s2rPadding");
			const s2rBgColor = $("s2rBgColor");
			const s2rTransparent = $("s2rTransparent");

			return {
				tab: this.tabs.active || d.tab,
				aspect: aspect ? String(aspect.value) : d.aspect,
				zoom: zoom ? clamp(Number(zoom.value || d.zoom), 0.25, 4) : d.zoom,
				outWidth: outWidth ? clampInt(Number(outWidth.value || d.outWidth), 1, 100000) : d.outWidth,
				outHeight: outHeight ? clampInt(Number(outHeight.value || d.outHeight), 1, 100000) : d.outHeight,
				lockAspect: lockAspect ? !!lockAspect.checked : d.lockAspect,
				format: format ? String(format.value) : d.format,
				bgColor: bgColor ? String(bgColor.value) : d.bgColor,
				bgTransparent: bgTransparent ? !!bgTransparent.checked : d.bgTransparent,
				jpegQuality: jpegQuality ? clamp(Number(jpegQuality.value || d.jpegQuality), 0.1, 1) : d.jpegQuality,
				bgRemoveEnabled: bgRemoveEnabled ? !!bgRemoveEnabled.checked : d.bgRemoveEnabled,
				bgRemoveThreshold: bgRemoveThreshold ? clampInt(Number(bgRemoveThreshold.value || d.bgRemoveThreshold), 0, 255) : d.bgRemoveThreshold,
				bgRemoveFeather: bgRemoveFeather ? clamp(Number(bgRemoveFeather.value || d.bgRemoveFeather), 0, 50) : d.bgRemoveFeather,
				bgRemoveInset: bgRemoveInset ? clampInt(Number(bgRemoveInset.value || d.bgRemoveInset), 0, 100000) : d.bgRemoveInset,
				s2rFormat: s2rFormat ? String(s2rFormat.value) : d.s2rFormat,
				s2rOutWidth: s2rOutWidth ? clampInt(Number(s2rOutWidth.value || d.s2rOutWidth), 1, 100000) : d.s2rOutWidth,
				s2rOutHeight: s2rOutHeight ? clampInt(Number(s2rOutHeight.value || d.s2rOutHeight), 1, 100000) : d.s2rOutHeight,
				s2rPadding: s2rPadding ? clampInt(Number(s2rPadding.value || d.s2rPadding), 0, 100000) : d.s2rPadding,
				s2rBgColor: s2rBgColor ? String(s2rBgColor.value) : d.s2rBgColor,
				s2rTransparent: s2rTransparent ? !!s2rTransparent.checked : d.s2rTransparent,
			};
		}

		applyState(state) {
			/** @type {(id: string) => HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null} */
			const $ = (id) => /** @type {any} */(document.getElementById(id));
			const d = this.getDefaults();

			// Tab first.
			const tab = typeof state.tab === "string" ? state.tab : d.tab;
			const allowed = new Set(this.tabs.tabs.map((t) => t.getAttribute("data-tab")).filter(Boolean));
			if (allowed.has(tab)) this.tabs.setActive(tab);

			const setValue = (id, value) => {
				const el = $(id);
				if (!el) return;
				el.value = String(value);
			};
			const setChecked = (id, value) => {
				const el = /** @type {HTMLInputElement | null} */($(id));
				if (!el) return;
				el.checked = !!value;
			};

			setValue("aspectSelect", state.aspect ?? d.aspect);
			setValue("zoomRange", state.zoom ?? d.zoom);
			setValue("outWidth", state.outWidth ?? d.outWidth);
			setValue("outHeight", state.outHeight ?? d.outHeight);
			setChecked("lockAspect", state.lockAspect ?? d.lockAspect);
			setValue("formatSelect", state.format ?? d.format);
			setValue("bgColor", state.bgColor ?? d.bgColor);
			setChecked("bgTransparent", state.bgTransparent ?? d.bgTransparent);
			setValue("jpegQuality", state.jpegQuality ?? d.jpegQuality);
			setChecked("bgRemoveEnabled", state.bgRemoveEnabled ?? d.bgRemoveEnabled);
			setValue("bgRemoveThreshold", state.bgRemoveThreshold ?? d.bgRemoveThreshold);
			setValue("bgRemoveFeather", state.bgRemoveFeather ?? d.bgRemoveFeather);
			setValue("bgRemoveInset", state.bgRemoveInset ?? d.bgRemoveInset);

			setValue("s2rFormat", state.s2rFormat ?? d.s2rFormat);
			setValue("s2rOutWidth", state.s2rOutWidth ?? d.s2rOutWidth);
			setValue("s2rOutHeight", state.s2rOutHeight ?? d.s2rOutHeight);
			setValue("s2rPadding", state.s2rPadding ?? d.s2rPadding);
			setValue("s2rBgColor", state.s2rBgColor ?? d.s2rBgColor);
			setChecked("s2rTransparent", state.s2rTransparent ?? d.s2rTransparent);
		}

		loadFromUrl() {
			const d = this.getDefaults();
			const params = new URLSearchParams(window.location.search);
			/** @type {any} */
			const state = { ...d };
			state.tab = params.get("tab") || d.tab;
			state.aspect = params.get("a") || d.aspect;
			state.zoom = this.readNumber(params, "z", d.zoom);
			state.outWidth = this.readNumber(params, "ow", d.outWidth);
			state.outHeight = this.readNumber(params, "oh", d.outHeight);
			state.lockAspect = this.readBool(params, "la", d.lockAspect);
			state.format = params.get("fmt") || d.format;
			state.bgColor = params.get("bg") || d.bgColor;
			state.bgTransparent = this.readBool(params, "tr", d.bgTransparent);
			state.jpegQuality = this.readNumber(params, "jq", d.jpegQuality);
			state.bgRemoveEnabled = this.readBool(params, "br", d.bgRemoveEnabled);
			state.bgRemoveThreshold = this.readNumber(params, "brt", d.bgRemoveThreshold);
			state.bgRemoveFeather = this.readNumber(params, "brf", d.bgRemoveFeather);
			state.bgRemoveInset = this.readNumber(params, "bri", d.bgRemoveInset);
			state.s2rFormat = params.get("s2rf") || d.s2rFormat;
			state.s2rOutWidth = this.readNumber(params, "s2row", d.s2rOutWidth);
			state.s2rOutHeight = this.readNumber(params, "s2roh", d.s2rOutHeight);
			state.s2rPadding = this.readNumber(params, "s2rpad", d.s2rPadding);
			state.s2rBgColor = params.get("s2rbg") || d.s2rBgColor;
			state.s2rTransparent = this.readBool(params, "s2rtr", d.s2rTransparent);
			return state;
		}

		loadFromStorage() {
			try {
				const raw = localStorage.getItem(this.storageKey);
				if (!raw) return null;
				const parsed = JSON.parse(raw);
				if (!parsed || typeof parsed !== "object") return null;
				return parsed;
			} catch (_) {
				return null;
			}
		}

		loadTextFromStorage() {
			try {
				const raw = localStorage.getItem(this.textStorageKey);
				if (!raw) return null;
				const parsed = JSON.parse(raw);
				if (!parsed || typeof parsed !== "object") return null;
				return parsed;
			} catch (_) {
				return null;
			}
		}

		saveToStorage(state) {
			try {
				localStorage.setItem(this.storageKey, JSON.stringify(state));
			} catch (_) {
				// ignore
			}
		}

		saveTextToStorage(textState) {
			try {
				localStorage.setItem(this.textStorageKey, JSON.stringify(textState));
			} catch (_) {
				// ignore
			}
		}

		restore() {
			const fromUrl = this.loadFromUrl();
			const fromStorage = this.loadFromStorage();
			const merged = { ...this.getDefaults(), ...(fromStorage || {}), ...(fromUrl || {}) };
			this.applyState(merged);

			const text = this.loadTextFromStorage();
			if (text) {
				const s2r = /** @type {HTMLTextAreaElement | null} */(document.getElementById("s2rSource"));
				const sbx = /** @type {HTMLTextAreaElement | null} */(document.getElementById("sbxSource"));
				const emb = /** @type {HTMLTextAreaElement | null} */(document.getElementById("embSource"));
				if (s2r && typeof text.s2rSource === "string" && text.s2rSource.length <= 500_000) s2r.value = text.s2rSource;
				if (sbx && typeof text.sbxSource === "string" && text.sbxSource.length <= 500_000) sbx.value = text.sbxSource;
				if (emb && typeof text.embSource === "string" && text.embSource.length <= 500_000) emb.value = text.embSource;
			}
		}

		replaceUrl() {
			const url = this.buildUrlFromCurrentState();
			window.history.replaceState(null, "", url.toString());
		}

		scheduleSave() {
			window.clearTimeout(this.saveTimer);
			this.saveTimer = window.setTimeout(() => {
				const state = this.collectState();
				this.saveToStorage(state);
				this.replaceUrl();
			}, 120);
		}

		onAnyChange() {
			this.scheduleSave();
			this.saveTextFields();
		}

		onTabChange() {
			this.scheduleSave();
		}

		saveTextFields() {
			const s2r = /** @type {HTMLTextAreaElement | null} */(document.getElementById("s2rSource"));
			const sbx = /** @type {HTMLTextAreaElement | null} */(document.getElementById("sbxSource"));
			const emb = /** @type {HTMLTextAreaElement | null} */(document.getElementById("embSource"));
			const state = {
				s2rSource: s2r ? String(s2r.value || "") : "",
				sbxSource: sbx ? String(sbx.value || "") : "",
				embSource: emb ? String(emb.value || "") : "",
			};
			// Keep localStorage from exploding.
			if (state.s2rSource.length > 500_000) state.s2rSource = "";
			if (state.sbxSource.length > 500_000) state.sbxSource = "";
			if (state.embSource.length > 500_000) state.embSource = "";
			this.saveTextToStorage(state);
		}

		async onCopyLink() {
			try {
				const url = this.buildUrlFromCurrentState().toString();
				if (window.isSecureContext && navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
					await navigator.clipboard.writeText(url);
					this.setGlobalStatus("Link copied.");
					return;
				}
				// Fallback for file:// and other non-secure contexts.
				window.prompt("Copy this link:", url);
				this.setGlobalStatus("Link ready to copy.");
			} catch (err) {
				this.setGlobalStatus(`Error: ${toErrorMessage(err)}`);
			}
		}

		onClearSaved() {
			try {
				localStorage.removeItem(this.storageKey);
				localStorage.removeItem(this.textStorageKey);
			} catch (_) {
				// ignore
			}
			const url = new URL(window.location.href);
			url.search = "";
			window.history.replaceState(null, "", url.toString());
			this.applyState(this.getDefaults());
			this.setGlobalStatus("Saved state cleared.");
		}

		onOnlineStatusChange() {
			if (!this.globalStatusText) return;
			if (navigator.onLine) {
				this.setGlobalStatus("Online.");
			} else {
				this.setGlobalStatus("Offline (cached resources will still load if available).");
			}
		}

		async registerServiceWorker() {
			try {
				if (!("serviceWorker" in navigator)) return;
				if (!window.isSecureContext) {
					this.setGlobalStatus("Offline mode requires https:// (or localhost).");
					return;
				}
				await navigator.serviceWorker.register("./image-tools-sw.js", { scope: "./" });
				this.setGlobalStatus("Offline cache enabled for /tools/.");
			} catch (_) {
				// Don’t spam; SW can fail on some hosting setups.
			}
		}

		init() {
			// Listen to changes on inputs we care about.
			const ids = [
				"aspectSelect",
				"zoomRange",
				"outWidth",
				"outHeight",
				"lockAspect",
				"formatSelect",
				"bgColor",
				"bgTransparent",
				"jpegQuality",
				"bgRemoveEnabled",
				"bgRemoveThreshold",
				"bgRemoveFeather",
				"bgRemoveInset",
				"s2rFormat",
				"s2rOutWidth",
				"s2rOutHeight",
				"s2rPadding",
				"s2rBgColor",
				"s2rTransparent",
				"s2rSource",
				"sbxSource",
				"embSource",
			];
			for (const id of ids) {
				const el = document.getElementById(id);
				if (!el) continue;
				el.addEventListener("input", this.onAnyChange);
				el.addEventListener("change", this.onAnyChange);
			}

			this.root.addEventListener("image-tools:tabchange", this.onTabChange);
			window.addEventListener("online", this.onOnlineStatusChange);
			window.addEventListener("offline", this.onOnlineStatusChange);
			window.addEventListener("popstate", () => {
				this.applyState(this.loadFromUrl());
			});

			if (this.copyLinkBtn) this.copyLinkBtn.addEventListener("click", this.onCopyLink);
			if (this.clearStateBtn) this.clearStateBtn.addEventListener("click", this.onClearSaved);

			// Establish initial URL (so refresh preserves, even before changes).
			this.replaceUrl();
			this.registerServiceWorker();
		}
	}

	class RasterToSvgTool {
		/** @param {{
		 * fileInput: HTMLInputElement,
		 * dropZone: HTMLElement,
		 * chooseBtn: HTMLButtonElement,
		 * pasteBtn: HTMLButtonElement,
		 * resetBtn: HTMLButtonElement,
		 * statusText: HTMLElement,
		 * meta: HTMLElement,
		 * source: HTMLTextAreaElement,
		 * preview: HTMLIFrameElement,
		 * copyBtn: HTMLButtonElement,
		 * downloadBtn: HTMLButtonElement,
		 * isActive: () => boolean,
		 * }} els */
		constructor(els) {
			this.els = els;
			this.svg = "";
			this.onChoose = this.onChoose.bind(this);
			this.onFileChange = this.onFileChange.bind(this);
			this.onDropOver = this.onDropOver.bind(this);
			this.onDropLeave = this.onDropLeave.bind(this);
			this.onDrop = this.onDrop.bind(this);
			this.onPasteBtn = this.onPasteBtn.bind(this);
			this.onPaste = this.onPaste.bind(this);
			this.onReset = this.onReset.bind(this);
			this.onCopy = this.onCopy.bind(this);
			this.onDownload = this.onDownload.bind(this);
		}

		init() {
			this.els.chooseBtn.addEventListener("click", this.onChoose);
			this.els.fileInput.addEventListener("change", this.onFileChange);
			this.els.dropZone.addEventListener("dragover", this.onDropOver);
			this.els.dropZone.addEventListener("dragleave", this.onDropLeave);
			this.els.dropZone.addEventListener("drop", this.onDrop);
			this.els.dropZone.addEventListener("click", this.onChoose);
			this.els.dropZone.addEventListener("keydown", (e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					this.onChoose();
				}
			});
			this.els.pasteBtn.addEventListener("click", this.onPasteBtn);
			window.addEventListener("paste", this.onPaste);
			this.els.resetBtn.addEventListener("click", this.onReset);
			this.els.copyBtn.addEventListener("click", this.onCopy);
			this.els.downloadBtn.addEventListener("click", this.onDownload);
			this.clear();
		}

		setStatus(text) {
			this.els.statusText.textContent = String(text);
		}

		onChoose() {
			if (!this.els.isActive()) return;
			this.els.fileInput.click();
		}

		onFileChange() {
			if (!this.els.isActive()) return;
			const f = this.els.fileInput.files && this.els.fileInput.files[0];
			if (f) this.loadFile(f);
		}

		onDropOver(e) {
			if (!this.els.isActive()) return;
			e.preventDefault();
			this.els.dropZone.classList.add("is-over");
		}

		onDropLeave() {
			this.els.dropZone.classList.remove("is-over");
		}

		onDrop(e) {
			if (!this.els.isActive()) return;
			e.preventDefault();
			this.els.dropZone.classList.remove("is-over");
			const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
			if (f) this.loadFile(f);
		}

		async onPasteBtn() {
			try {
				if (!this.els.isActive()) return;
				if (!navigator.clipboard || typeof navigator.clipboard.read !== "function") {
					throw new Error("Clipboard API not available here. Use Cmd/Ctrl+V instead.");
				}
				this.setStatus("Reading clipboard…");
				const items = await navigator.clipboard.read();
				for (const item of items) {
					const imageType = item.types.find((t) => isImageType(t));
					if (!imageType) continue;
					const blob = await item.getType(imageType);
					await this.loadBlob(blob, "clipboard");
					return;
				}
				throw new Error("No image found on clipboard.");
			} catch (err) {
				this.setStatus(`Error: ${toErrorMessage(err)}`);
			}
		}

		/** @param {ClipboardEvent} e */
		onPaste(e) {
			if (!this.els.isActive()) return;
			const data = e.clipboardData;
			if (!data || !data.items) return;
			for (const item of data.items) {
				if (!isImageType(item.type)) continue;
				const file = item.getAsFile();
				if (!file) continue;
				e.preventDefault();
				this.setStatus("Pasting image…");
				this.loadFile(file);
				return;
			}
		}

		onReset() {
			if (!this.els.isActive()) return;
			this.clear();
		}

		clear() {
			this.svg = "";
			this.els.source.value = "";
			this.els.preview.srcdoc = "";
			this.els.meta.textContent = "—";
			this.els.resetBtn.disabled = true;
			this.els.copyBtn.disabled = true;
			this.els.downloadBtn.disabled = true;
			this.setStatus("No image loaded.");
		}

		async loadFile(file) {
			if (!isImageType(file.type)) {
				this.setStatus("Error: Not an image file.");
				return;
			}
			this.setStatus("Loading…");
			await this.loadBlob(file, file.name || "image");
		}

		async loadBlob(blob, name) {
			const dataUrl = await new Promise((resolve, reject) => {
				const r = new FileReader();
				r.onerror = () => reject(new Error("Failed to read image"));
				r.onload = () => resolve(String(r.result || ""));
				r.readAsDataURL(blob);
			});

			const img = new Image();
			await new Promise((resolve, reject) => {
				img.onload = () => resolve(undefined);
				img.onerror = () => reject(new Error("Failed to decode image"));
				img.src = dataUrl;
			});

			const w = img.naturalWidth || 1;
			const h = img.naturalHeight || 1;
			const safeName = String(name || "image").replace(/[^a-z0-9._-]+/gi, "-");
			const svg = `<?xml version="1.0" encoding="UTF-8"?>\n` +
				`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">\n` +
				`  <image href="${dataUrl}" width="${w}" height="${h}" />\n` +
				`</svg>\n`;

			this.svg = svg;
			this.els.source.value = svg;
			this.els.preview.srcdoc = `<!doctype html><html><body style="margin:0;background:transparent">${svg}</body></html>`;
			this.els.meta.textContent = `${w}×${h}px • ${formatBytes(svg.length)} source`;
			this.els.resetBtn.disabled = false;
			this.els.copyBtn.disabled = false;
			this.els.downloadBtn.disabled = false;
			this.setStatus("SVG ready.");
			this.els.downloadBtn.dataset.filename = `${safeName.replace(/\.[a-z0-9]+$/i, "")}.svg`;
		}

		async onCopy() {
			if (!this.els.isActive()) return;
			try {
				if (!navigator.clipboard || typeof navigator.clipboard.writeText !== "function") {
					throw new Error("Clipboard not available.");
				}
				await navigator.clipboard.writeText(this.svg || "");
				this.setStatus("Copied SVG source.");
			} catch (err) {
				this.setStatus(`Error: ${toErrorMessage(err)}`);
			}
		}

		onDownload() {
			if (!this.els.isActive()) return;
			if (!this.svg) return;
			const blob = new Blob([this.svg], { type: "image/svg+xml" });
			const filename = this.els.downloadBtn.dataset.filename || "image.svg";
			downloadBlob(blob, filename);
			this.setStatus("Downloaded.");
		}
	}

	class SvgToRasterTool {
		/** @param {{
		 * fileInput: HTMLInputElement,
		 * chooseBtn: HTMLButtonElement,
		 * pasteBtn: HTMLButtonElement,
		 * resetBtn: HTMLButtonElement,
		 * statusText: HTMLElement,
		 * source: HTMLTextAreaElement,
		 * canvas: HTMLCanvasElement,
		 * meta: HTMLElement,
		 * format: HTMLSelectElement,
		 * outWidth: HTMLInputElement,
		 * outHeight: HTMLInputElement,
		 * padding: HTMLInputElement,
		 * bgColor: HTMLInputElement,
		 * transparent: HTMLInputElement,
		 * sizeLabel: HTMLElement,
		 * exportBtn: HTMLButtonElement,
		 * copyBtn: HTMLButtonElement,
		 * isActive: () => boolean,
		 * }} els */
		constructor(els) {
			this.els = els;
			this.svgUrl = "";
			this.timer = 0;
			this.token = 0;
			this.offscreen = document.createElement("canvas");
			this.ctx = this.offscreen.getContext("2d");

			this.onChoose = this.onChoose.bind(this);
			this.onFileChange = this.onFileChange.bind(this);
			this.onPasteBtn = this.onPasteBtn.bind(this);
			this.onPaste = this.onPaste.bind(this);
			this.onReset = this.onReset.bind(this);
			this.onInput = this.onInput.bind(this);
			this.onExport = this.onExport.bind(this);
			this.onCopy = this.onCopy.bind(this);
		}

		init() {
			this.els.chooseBtn.addEventListener("click", this.onChoose);
			this.els.fileInput.addEventListener("change", this.onFileChange);
			this.els.pasteBtn.addEventListener("click", this.onPasteBtn);
			window.addEventListener("paste", this.onPaste);
			this.els.resetBtn.addEventListener("click", this.onReset);
			this.els.source.addEventListener("input", this.onInput);
			this.els.format.addEventListener("change", this.onInput);
			this.els.outWidth.addEventListener("input", this.onInput);
			this.els.outHeight.addEventListener("input", this.onInput);
			this.els.padding.addEventListener("input", this.onInput);
			this.els.bgColor.addEventListener("input", this.onInput);
			this.els.transparent.addEventListener("change", this.onInput);
			this.els.exportBtn.addEventListener("click", this.onExport);
			this.els.copyBtn.addEventListener("click", this.onCopy);
			this.clear();
		}

		setStatus(text) {
			this.els.statusText.textContent = String(text);
		}

		onChoose() {
			if (!this.els.isActive()) return;
			this.els.fileInput.click();
		}

		onFileChange() {
			if (!this.els.isActive()) return;
			const f = this.els.fileInput.files && this.els.fileInput.files[0];
			if (!f) return;
			if (!isSvgType(f.type) && !String(f.name || "").toLowerCase().endsWith(".svg")) {
				this.setStatus("Error: Not an SVG file.");
				return;
			}
			const r = new FileReader();
			r.onerror = () => this.setStatus("Error: Failed to read file.");
			r.onload = () => {
				this.els.source.value = String(r.result || "");
				this.enable();
				this.schedule();
			};
			r.readAsText(f);
		}

		async onPasteBtn() {
			try {
				if (!this.els.isActive()) return;
				if (!navigator.clipboard || typeof navigator.clipboard.readText !== "function") {
					throw new Error("Clipboard API not available here. Paste into the textbox instead.");
				}
				const t = await navigator.clipboard.readText();
				if (!t || !t.includes("<svg")) throw new Error("Clipboard does not look like SVG.");
				this.els.source.value = t;
				this.enable();
				this.schedule();
			} catch (err) {
				this.setStatus(`Error: ${toErrorMessage(err)}`);
			}
		}

		/** @param {ClipboardEvent} e */
		onPaste(e) {
			if (!this.els.isActive()) return;
			const t = e.clipboardData && e.clipboardData.getData("text/plain");
			if (!t || !t.includes("<svg")) return;
			e.preventDefault();
			this.els.source.value = t;
			this.enable();
			this.schedule();
		}

		onReset() {
			if (!this.els.isActive()) return;
			this.clear();
		}

		clearUrl() {
			if (this.svgUrl) URL.revokeObjectURL(this.svgUrl);
			this.svgUrl = "";
		}

		clear() {
			this.clearUrl();
			this.els.source.value = "";
			this.els.sizeLabel.textContent = "Estimated size: —";
			this.els.meta.textContent = "—";
			const ctx = this.els.canvas.getContext("2d");
			if (ctx) ctx.clearRect(0, 0, this.els.canvas.width, this.els.canvas.height);
			this.disable();
			this.setStatus("No SVG loaded.");
		}

		enable() {
			this.els.resetBtn.disabled = false;
			this.els.format.disabled = false;
			this.els.outWidth.disabled = false;
			this.els.outHeight.disabled = false;
			this.els.padding.disabled = false;
			this.els.bgColor.disabled = false;
			this.els.transparent.disabled = false;
			this.els.exportBtn.disabled = false;
			this.els.copyBtn.disabled = false;
			this.updateTransparencyUi();
		}

		disable() {
			this.els.resetBtn.disabled = true;
			this.els.format.disabled = true;
			this.els.outWidth.disabled = true;
			this.els.outHeight.disabled = true;
			this.els.padding.disabled = true;
			this.els.bgColor.disabled = true;
			this.els.transparent.disabled = true;
			this.els.exportBtn.disabled = true;
			this.els.copyBtn.disabled = true;
		}

		onInput() {
			if (!this.els.isActive()) return;
			this.enable();
			this.updateTransparencyUi();
			this.schedule();
		}

		updateTransparencyUi() {
			const fmt = String(this.els.format.value || "png");
			if (fmt === "jpeg") {
				this.els.transparent.checked = false;
				this.els.transparent.disabled = true;
			} else {
				this.els.transparent.disabled = false;
			}
		}

		sanitizeSvg(svgText) {
			return sanitizeSvgStrict(svgText);
		}

		getSvgIntrinsicSize(svgText) {
			const { w, h } = getSvgIntrinsicSizeFromText(svgText);
			return { w, h };
		}

		schedule() {
			if (this.timer) window.clearTimeout(this.timer);
			this.timer = window.setTimeout(() => {
				this.timer = 0;
				this.renderAndEstimate();
			}, 250);
		}

		async renderAndEstimate() {
			const token = ++this.token;
			try {
				this.setStatus("Rendering…");
				const sanitized = this.sanitizeSvg(this.els.source.value);
				const { w: srcW, h: srcH } = this.getSvgIntrinsicSize(sanitized);
				const outW = parsePositiveInt(this.els.outWidth.value, 512);
				const outH = parsePositiveInt(this.els.outHeight.value, 512);
				const pad = Math.max(0, parsePositiveInt(this.els.padding.value, 0));
				const fmt = String(this.els.format.value || "png");
				const transparent = fmt === "png" && !!this.els.transparent.checked;

				this.clearUrl();
				const svgBlob = new Blob([sanitized], { type: "image/svg+xml" });
				this.svgUrl = URL.createObjectURL(svgBlob);

				const img = new Image();
				await new Promise((resolve, reject) => {
					img.onload = () => resolve(undefined);
					img.onerror = () => reject(new Error("Failed to load SVG"));
					img.src = this.svgUrl;
				});
				if (token !== this.token) return;

				this.offscreen.width = outW;
				this.offscreen.height = outH;
				if (!this.ctx) throw new Error("Canvas unavailable");
				this.ctx.setTransform(1, 0, 0, 1, 0, 0);
				this.ctx.clearRect(0, 0, outW, outH);
				this.ctx.imageSmoothingEnabled = true;
				this.ctx.imageSmoothingQuality = "high";
				if (!transparent || fmt === "jpeg") {
					this.ctx.fillStyle = String(this.els.bgColor.value || "#ffffff");
					this.ctx.fillRect(0, 0, outW, outH);
				}

				const availW = Math.max(1, outW - pad * 2);
				const availH = Math.max(1, outH - pad * 2);
				const scale = Math.min(availW / srcW, availH / srcH);
				const dw = srcW * scale;
				const dh = srcH * scale;
				const dx = pad + (availW - dw) / 2;
				const dy = pad + (availH - dh) / 2;
				this.ctx.drawImage(img, dx, dy, dw, dh);

				this.els.canvas.width = outW;
				this.els.canvas.height = outH;
				const cctx = this.els.canvas.getContext("2d");
				if (cctx) {
					cctx.setTransform(1, 0, 0, 1, 0, 0);
					cctx.clearRect(0, 0, outW, outH);
					cctx.drawImage(this.offscreen, 0, 0);
				}

				const outBlob = await blobFromCanvas(this.offscreen, fmt === "jpeg" ? "image/jpeg" : "image/png", 0.92);
				if (token !== this.token) return;
				this.els.sizeLabel.textContent = `Estimated size: ${formatBytes(outBlob.size)}`;
				this.els.meta.textContent = `${outW}×${outH}px • pad ${pad}px`;
				this.setStatus("Ready.");
			} catch (err) {
				this.els.sizeLabel.textContent = "Estimated size: —";
				this.els.meta.textContent = "—";
				this.setStatus(`Error: ${toErrorMessage(err)}`);
			}
		}

		async onExport() {
			if (!this.els.isActive()) return;
			try {
				this.setStatus("Exporting…");
				const fmt = String(this.els.format.value || "png");
				const blob = await blobFromCanvas(this.offscreen, fmt === "jpeg" ? "image/jpeg" : "image/png", 0.92);
				const ext = fmt === "jpeg" ? "jpg" : "png";
				downloadBlob(blob, `svg-export.${ext}`);
				this.setStatus("Exported.");
			} catch (err) {
				this.setStatus(`Error: ${toErrorMessage(err)}`);
			}
		}

		async onCopy() {
			if (!this.els.isActive()) return;
			try {
				if (!window.isSecureContext || !navigator.clipboard || typeof navigator.clipboard.write !== "function") {
					throw new Error("Copy requires https://. Use Export instead.");
				}
				if (typeof ClipboardItem === "undefined") throw new Error("Copy not supported in this browser. Use Export instead.");
				this.setStatus("Copying…");
				const fmt = String(this.els.format.value || "png");
				const blob = await blobFromCanvas(this.offscreen, fmt === "jpeg" ? "image/jpeg" : "image/png", 0.92);
				const item = new ClipboardItem({ [blob.type]: blob });
				await navigator.clipboard.write([item]);
				this.setStatus("Copied.");
			} catch (err) {
				this.setStatus(`Error: ${toErrorMessage(err)}`);
			}
		}
	}

	class SvgSandboxTool {
		/** @param {{
		 * fileInput: HTMLInputElement,
		 * chooseBtn: HTMLButtonElement,
		 * pasteBtn: HTMLButtonElement,
		 * resetBtn: HTMLButtonElement,
		 * statusText: HTMLElement,
		 * source: HTMLTextAreaElement,
		 * sanitized: HTMLTextAreaElement,
		 * preview: HTMLIFrameElement,
		 * meta: HTMLElement,
		 * isActive: () => boolean,
		 * }} els */
		constructor(els) {
			this.els = els;
			this.timer = 0;

			this.onChoose = this.onChoose.bind(this);
			this.onFileChange = this.onFileChange.bind(this);
			this.onPasteBtn = this.onPasteBtn.bind(this);
			this.onPaste = this.onPaste.bind(this);
			this.onReset = this.onReset.bind(this);
			this.onInput = this.onInput.bind(this);
		}

		init() {
			this.els.chooseBtn.addEventListener("click", this.onChoose);
			this.els.fileInput.addEventListener("change", this.onFileChange);
			this.els.pasteBtn.addEventListener("click", this.onPasteBtn);
			window.addEventListener("paste", this.onPaste);
			this.els.resetBtn.addEventListener("click", this.onReset);
			this.els.source.addEventListener("input", this.onInput);
			this.clear();
		}

		setStatus(text) {
			this.els.statusText.textContent = String(text);
		}

		onChoose() {
			if (!this.els.isActive()) return;
			this.els.fileInput.click();
		}

		onFileChange() {
			if (!this.els.isActive()) return;
			const f = this.els.fileInput.files && this.els.fileInput.files[0];
			if (!f) return;
			if (!isSvgType(f.type) && !String(f.name || "").toLowerCase().endsWith(".svg")) {
				this.setStatus("Error: Not an SVG file.");
				return;
			}
			const r = new FileReader();
			r.onerror = () => this.setStatus("Error: Failed to read file.");
			r.onload = () => {
				this.els.source.value = String(r.result || "");
				this.enable();
				this.schedule();
			};
			r.readAsText(f);
		}

		async onPasteBtn() {
			try {
				if (!this.els.isActive()) return;
				if (!navigator.clipboard || typeof navigator.clipboard.readText !== "function") {
					throw new Error("Clipboard API not available here. Paste into the textbox instead.");
				}
				const t = await navigator.clipboard.readText();
				if (!t || !t.includes("<svg")) throw new Error("Clipboard does not look like SVG.");
				this.els.source.value = t;
				this.enable();
				this.schedule();
			} catch (err) {
				this.setStatus(`Error: ${toErrorMessage(err)}`);
			}
		}

		/** @param {ClipboardEvent} e */
		onPaste(e) {
			if (!this.els.isActive()) return;
			const t = e.clipboardData && e.clipboardData.getData("text/plain");
			if (!t || !t.includes("<svg")) return;
			e.preventDefault();
			this.els.source.value = t;
			this.enable();
			this.schedule();
		}

		onReset() {
			if (!this.els.isActive()) return;
			this.clear();
		}

		clear() {
			this.els.source.value = "";
			this.els.sanitized.value = "";
			this.els.preview.removeAttribute("srcdoc");
			this.els.meta.textContent = "—";
			this.disable();
			this.setStatus("No SVG loaded.");
		}

		enable() {
			this.els.resetBtn.disabled = false;
		}

		disable() {
			this.els.resetBtn.disabled = true;
		}

		onInput() {
			if (!this.els.isActive()) return;
			this.enable();
			this.schedule();
		}

		schedule() {
			if (this.timer) window.clearTimeout(this.timer);
			this.timer = window.setTimeout(() => {
				this.timer = 0;
				this.render();
			}, 150);
		}

		render() {
			try {
				this.setStatus("Sanitizing…");
				const report = {};
				const sanitized = sanitizeSvgStrict(this.els.source.value, report);
				this.els.sanitized.value = sanitized;
				const { w, h, source } = getSvgIntrinsicSizeFromText(sanitized);
				this.els.meta.textContent = `Intrinsic: ${Math.round(w)}×${Math.round(h)} (${source}) • ${formatBytes(sanitized.length)} source`;
				this.els.report.textContent = `Removed: ${report.removedElements} el • ${report.removedAttributes} attr • Modified: ${report.modifiedAttributes} attr • Styles: ${report.sanitizedStyleBlocks} (imports −${report.strippedStyleImports}, urls −${report.strippedStyleUrls})`;
				this.els.preview.srcdoc = `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;height:100%;background:transparent}svg{width:100%;height:100%;display:block}</style></head><body>${sanitized}</body></html>`;
				this.setStatus("Sanitized and rendered.");
			} catch (err) {
				this.els.sanitized.value = "";
				this.els.preview.removeAttribute("srcdoc");
				this.els.meta.textContent = "—";
				this.els.report.textContent = "—";
				this.setStatus(`Error: ${toErrorMessage(err)}`);
			}
		}
	}

	class SvgEmbedTool {
		/** @param {{
		 * fileInput: HTMLInputElement,
		 * chooseBtn: HTMLButtonElement,
		 * pasteBtn: HTMLButtonElement,
		 * copyTagBtn: HTMLButtonElement,
		 * copyDataBtn: HTMLButtonElement,
		 * resetBtn: HTMLButtonElement,
		 * statusText: HTMLElement,
		 * source: HTMLTextAreaElement,
		 * meta: HTMLElement,
		 * img: HTMLImageElement,
		 * imgMeta: HTMLElement,
		 * tag: HTMLTextAreaElement,
		 * decoded: HTMLTextAreaElement,
		 * isActive: () => boolean,
		 * }} els */
		constructor(els) {
			this.els = els;
			this.timer = 0;
			this.dataUrl = "";
			this.tagText = "";
			this.previewUrl = "";
			this.previewToken = 0;

			this.onChoose = this.onChoose.bind(this);
			this.onFileChange = this.onFileChange.bind(this);
			this.onPasteBtn = this.onPasteBtn.bind(this);
			this.onPaste = this.onPaste.bind(this);
			this.onReset = this.onReset.bind(this);
			this.onInput = this.onInput.bind(this);
			this.onCopyTag = this.onCopyTag.bind(this);
			this.onCopyData = this.onCopyData.bind(this);
		}

		init() {
			this.els.chooseBtn.addEventListener("click", this.onChoose);
			this.els.fileInput.addEventListener("change", this.onFileChange);
			this.els.pasteBtn.addEventListener("click", this.onPasteBtn);
			this.els.copyTagBtn.addEventListener("click", this.onCopyTag);
			this.els.copyDataBtn.addEventListener("click", this.onCopyData);
			window.addEventListener("paste", this.onPaste);
			this.els.resetBtn.addEventListener("click", this.onReset);
			this.els.source.addEventListener("input", this.onInput);
			this.clear();
		}

		setStatus(text) {
			this.els.statusText.textContent = String(text);
		}

		onChoose() {
			if (!this.els.isActive()) return;
			this.els.fileInput.click();
		}

		onFileChange() {
			if (!this.els.isActive()) return;
			const f = this.els.fileInput.files && this.els.fileInput.files[0];
			if (!f) return;
			if (!isSvgType(f.type) && !String(f.name || "").toLowerCase().endsWith(".svg")) {
				this.setStatus("Error: Not an SVG file.");
				return;
			}
			const r = new FileReader();
			r.onerror = () => this.setStatus("Error: Failed to read file.");
			r.onload = () => {
				this.els.source.value = String(r.result || "");
				this.enable();
				this.schedule();
			};
			r.readAsText(f);
		}

		async onPasteBtn() {
			try {
				if (!this.els.isActive()) return;
				if (!navigator.clipboard || typeof navigator.clipboard.readText !== "function") {
					throw new Error("Clipboard API not available here. Paste into the textbox instead.");
				}
				const t = await navigator.clipboard.readText();
				if (!t || !t.includes("<svg")) throw new Error("Clipboard does not look like SVG.");
				this.els.source.value = t;
				this.enable();
				this.schedule();
			} catch (err) {
				this.setStatus(`Error: ${toErrorMessage(err)}`);
			}
		}

		/** @param {ClipboardEvent} e */
		onPaste(e) {
			if (!this.els.isActive()) return;
			const t = e.clipboardData && e.clipboardData.getData("text/plain");
			if (!t || !t.includes("<svg")) return;
			e.preventDefault();
			this.els.source.value = t;
			this.enable();
			this.schedule();
		}

		onReset() {
			if (!this.els.isActive()) return;
			this.clear();
		}

		clear() {
			this.els.source.value = "";
			this.els.meta.textContent = "—";
			this.clearPreviewUrl();
			this.els.img.src = "data:image/gif;base64,R0lGODlhAQABAPAAAP///wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";
			this.els.imgMeta.textContent = "—";
			this.els.tag.value = "";
			this.els.decoded.value = "";
			this.dataUrl = "";
			this.tagText = "";
			this.disable();
			this.setStatus("No SVG loaded.");
		}

		clearPreviewUrl() {
			if (this.previewUrl) {
				URL.revokeObjectURL(this.previewUrl);
				this.previewUrl = "";
			}
		}

		enable() {
			this.els.resetBtn.disabled = false;
			this.els.copyTagBtn.disabled = !this.tagText;
			this.els.copyDataBtn.disabled = !this.dataUrl;
		}

		disable() {
			this.els.resetBtn.disabled = true;
			this.els.copyTagBtn.disabled = true;
			this.els.copyDataBtn.disabled = true;
		}

		async copyText(text, fallbackFocusEl) {
			try {
				if (!text) throw new Error("Nothing to copy.");
				if (navigator.clipboard && typeof navigator.clipboard.writeText === "function" && window.isSecureContext) {
					await navigator.clipboard.writeText(text);
					return true;
				}
				// Fallback: select text and instruct user.
				if (fallbackFocusEl && typeof fallbackFocusEl.focus === "function") {
					fallbackFocusEl.focus();
					if (typeof fallbackFocusEl.select === "function") fallbackFocusEl.select();
				}
				throw new Error("Copy requires https:// or a browser that allows Clipboard API here. Text is selected—press Cmd/Ctrl+C.");
			} catch (err) {
				this.setStatus(`Copy: ${toErrorMessage(err)}`);
				return false;
			}
		}

		async onCopyTag() {
			if (!this.els.isActive()) return;
			this.setStatus("Copying…");
			const ok = await this.copyText(this.tagText, this.els.tag);
			if (ok) this.setStatus("Copied <img> tag.");
		}

		async onCopyData() {
			if (!this.els.isActive()) return;
			this.setStatus("Copying…");
			const ok = await this.copyText(this.dataUrl, this.els.tag);
			if (ok) this.setStatus("Copied data URI.");
		}

		onInput() {
			if (!this.els.isActive()) return;
			this.enable();
			this.schedule();
		}

		schedule() {
			if (this.timer) window.clearTimeout(this.timer);
			this.timer = window.setTimeout(() => {
				this.timer = 0;
				this.render();
			}, 180);
		}

		render() {
			const token = ++this.previewToken;
			try {
				this.setStatus("Encoding…");
				this.clearPreviewUrl();

				const sanitized = sanitizeSvgStrict(this.els.source.value);
				const { w, h, source } = getSvgIntrinsicSizeFromText(sanitized);
				this.els.meta.textContent = `Intrinsic: ${Math.round(w)}×${Math.round(h)} (${source}) • ${formatBytes(sanitized.length)} source`;

				const b64 = svgTextToBase64(sanitized);
				this.dataUrl = `data:image/svg+xml;base64,${b64}`;
				this.tagText = `<img alt="Embedded SVG" src="${this.dataUrl}" />`;
				this.els.tag.value = this.tagText;

				const decoded = base64ToSvgText(b64);
				this.els.decoded.value = decoded;

				const approxBytes = Math.round((b64.length * 3) / 4);
				this.els.imgMeta.textContent = `Data URI: ${formatBytes(approxBytes)} payload • ${b64.length} base64 chars • Preview: loading…`;

				this.enable();

				// Prefer previewing the actual base64 data URL, but fall back to a Blob URL
				// if the browser blocks/doesn't decode base64 SVG data URLs.
				this.els.img.onload = () => {
					if (token !== this.previewToken) return;
					this.els.imgMeta.textContent = `Data URI: ${formatBytes(approxBytes)} payload • ${b64.length} base64 chars • Preview: base64`;
					this.setStatus("Ready.");
				};
				this.els.img.onerror = () => {
					if (token !== this.previewToken) return;
					try {
						this.clearPreviewUrl();
						const blob = new Blob([sanitized], { type: "image/svg+xml" });
						this.previewUrl = URL.createObjectURL(blob);
						this.els.imgMeta.textContent = `Data URI: ${formatBytes(approxBytes)} payload • ${b64.length} base64 chars • Preview: blob fallback`;
						this.els.img.src = this.previewUrl;
						this.setStatus("Ready (preview fallback). ");
					} catch {
						this.setStatus("Error: Failed to preview embedded SVG.");
					}
				};

				// Trigger load.
				this.els.img.src = this.dataUrl;
			} catch (err) {
				this.els.meta.textContent = "—";
				this.clearPreviewUrl();
				this.els.img.src = "data:image/gif;base64,R0lGODlhAQABAPAAAP///wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";
				this.dataUrl = "";
				this.tagText = "";
				this.disable();
				this.els.imgMeta.textContent = "—";
				this.els.tag.value = "";
				this.els.decoded.value = "";
				this.setStatus(`Error: ${toErrorMessage(err)}`);
			}
		}
	}

	class AvatarPickerElement extends HTMLElement {
		connectedCallback() {
			if (this.__initialized) return;
			this.__initialized = true;

			const placeholderImg = "data:image/gif;base64,R0lGODlhAQABAPAAAP///wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";
			const inputName = this.getAttribute("input-name") || "avatar";
			const defaultOut = Number(this.getAttribute("output-size")) || 256;

			this.classList.add("stack");
			this.innerHTML = `
				<div class="controls-row">
					<input class="sr-only" data-el="file" type="file" accept="image/*" />
					<button type="button" class="btn btn-primary" data-el="choose">Choose</button>
					<button type="button" class="btn" data-el="paste">Paste</button>
					<button type="button" class="btn" data-el="fit">Fit</button>
					<button type="button" class="btn btn-danger" data-el="reset" disabled>Reset</button>
				</div>
				<div class="controls-row">
					<label class="label">Zoom</label>
					<input data-el="zoom" type="range" min="1" max="4" step="0.01" value="1" />
					<span class="mono" data-el="zoomv">100%</span>
					<label class="label">Output</label>
					<input data-el="out" class="input" type="number" min="64" max="2048" step="1" value="${defaultOut}" />
					<span class="hint">px</span>
				</div>
				<div class="dropzone" data-el="drop" role="button" tabindex="0" aria-label="Drop an image here">
					<span class="dropzone-title">Drop an image here</span>
					<span class="dropzone-subtitle">or use Choose / Paste</span>
				</div>
				<div class="editor-stage">
					<canvas class="editor-canvas" data-el="canvas"></canvas>
				</div>
				<div class="compare-grid">
					<div class="compare-col">
						<div class="compare-title">Output preview</div>
						<div class="compare-frame checkerboard">
							<img data-el="preview" alt="Avatar output preview" src="${placeholderImg}" />
						</div>
						<div class="preview-meta" data-el="meta">—</div>
					</div>
					<div class="compare-col">
						<div class="compare-title">Data URL</div>
						<textarea class="textarea" rows="4" data-el="data" readonly></textarea>
						<div class="controls-row">
							<button type="button" class="btn" data-el="copy" disabled>Copy data URL</button>
							<button type="button" class="btn" data-el="download" disabled>Download JPEG</button>
						</div>
						<p class="micro-hint">JPEG data URLs can be large; consider uploading server-side for real forms.</p>
					</div>
				</div>
				<input type="hidden" data-el="hidden" name="${inputName}" value="" />
				<div class="status" aria-live="polite" aria-atomic="true"><span data-el="status">No image loaded.</span></div>
			`;

			this.els = {
				file: this.querySelector('[data-el="file"]'),
				choose: this.querySelector('[data-el="choose"]'),
				paste: this.querySelector('[data-el="paste"]'),
				fit: this.querySelector('[data-el="fit"]'),
				reset: this.querySelector('[data-el="reset"]'),
				drop: this.querySelector('[data-el="drop"]'),
				canvas: this.querySelector('[data-el="canvas"]'),
				zoom: this.querySelector('[data-el="zoom"]'),
				zoomv: this.querySelector('[data-el="zoomv"]'),
				out: this.querySelector('[data-el="out"]'),
				preview: this.querySelector('[data-el="preview"]'),
				meta: this.querySelector('[data-el="meta"]'),
				data: this.querySelector('[data-el="data"]'),
				copy: this.querySelector('[data-el="copy"]'),
				download: this.querySelector('[data-el="download"]'),
				hidden: this.querySelector('[data-el="hidden"]'),
				status: this.querySelector('[data-el="status"]'),
			};

			this.ctx = this.els.canvas.getContext("2d");
			this.image = null;
			this.hasImage = false;
			this.dpr = Math.max(1, window.devicePixelRatio || 1);
			this.baseScale = 1;
			this.zoom = 1;
			this.pan = { x: 0, y: 0 }; // in image px, relative to center
			this.drag = null;
			this.raf = 0;
			this.resizeObserver = new ResizeObserver(() => this.scheduleRender());
			this.resizeObserver.observe(this.els.canvas);

			this.bindEvents();
			this.setEnabled(false);
			this.renderEmpty();
		}

		disconnectedCallback() {
			if (this.resizeObserver) this.resizeObserver.disconnect();
			window.removeEventListener("paste", this.__onPasteGlobal);
		}

		isActive() {
			const view = this.closest('.view[data-view]');
			if (!view) return true;
			return !view.hasAttribute('hidden');
		}

		setStatus(text) {
			if (this.els?.status) this.els.status.textContent = String(text);
		}

		setEnabled(enabled) {
			this.els.reset.disabled = !enabled;
			this.els.fit.disabled = !enabled;
			this.els.zoom.disabled = !enabled;
			this.els.out.disabled = !enabled;
			this.els.copy.disabled = !enabled;
			this.els.download.disabled = !enabled;
		}

		bindEvents() {
			this.els.choose.addEventListener("click", () => this.els.file.click());
			this.els.file.addEventListener("change", () => {
				const f = this.els.file.files && this.els.file.files[0];
				if (!f) return;
				if (!isImageType(f.type)) {
					this.setStatus("Error: Not an image file.");
					return;
				}
				this.loadFile(f);
			});

			this.els.paste.addEventListener("click", async () => {
				try {
					if (!this.isActive()) return;
					if (!navigator.clipboard || typeof navigator.clipboard.read !== "function") {
						throw new Error("Clipboard image paste not available here. Use Cmd/Ctrl+V or Choose.");
					}
					const items = await navigator.clipboard.read();
					let found = false;
					for (const item of items) {
						for (const type of item.types) {
							if (isImageType(type)) {
								const blob = await item.getType(type);
								this.loadBlob(blob);
								found = true;
								break;
							}
						}
						if (found) break;
					}
					if (!found) throw new Error("No image found on clipboard.");
				} catch (err) {
					this.setStatus(`Paste: ${toErrorMessage(err)}`);
				}
			});

			this.__onPasteGlobal = (e) => {
				if (!this.isActive()) return;
				const items = e.clipboardData && e.clipboardData.items;
				if (!items) return;
				for (const it of items) {
					if (isImageType(it.type)) {
						e.preventDefault();
						const blob = it.getAsFile();
						if (blob) this.loadBlob(blob);
						return;
					}
				}
			};
			window.addEventListener("paste", this.__onPasteGlobal);

			this.els.drop.addEventListener("dragover", (e) => {
				if (!this.isActive()) return;
				e.preventDefault();
				this.els.drop.classList.add("dropzone--active");
			});
			this.els.drop.addEventListener("dragleave", () => this.els.drop.classList.remove("dropzone--active"));
			this.els.drop.addEventListener("drop", (e) => {
				if (!this.isActive()) return;
				e.preventDefault();
				this.els.drop.classList.remove("dropzone--active");
				const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
				if (!f) return;
				if (!isImageType(f.type)) {
					this.setStatus("Error: Not an image file.");
					return;
				}
				this.loadFile(f);
			});

			this.els.fit.addEventListener("click", () => {
				if (!this.hasImage) return;
				this.fitCover();
				this.scheduleRender();
			});
			this.els.reset.addEventListener("click", () => this.clear());

			this.els.zoom.addEventListener("input", () => {
				this.setZoom(Number(this.els.zoom.value));
			});
			this.els.out.addEventListener("input", () => this.updateOutput());
			this.els.copy.addEventListener("click", () => this.copyDataUrl());
			this.els.download.addEventListener("click", () => this.downloadJpeg());

			this.els.canvas.addEventListener("pointerdown", (e) => this.onPointerDown(e));
			window.addEventListener("pointermove", (e) => this.onPointerMove(e));
			window.addEventListener("pointerup", () => this.onPointerUp());
		}

		clear() {
			this.hasImage = false;
			this.image = null;
			this.pan = { x: 0, y: 0 };
			this.baseScale = 1;
			this.setZoom(1);
			this.els.hidden.value = "";
			this.els.data.value = "";
			this.els.preview.src = "data:image/gif;base64,R0lGODlhAQABAPAAAP///wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";
			this.els.meta.textContent = "—";
			this.setEnabled(false);
			this.setStatus("No image loaded.");
			this.scheduleRender();
		}

		renderEmpty() {
			this.clear();
		}

		async loadFile(file) {
			const url = URL.createObjectURL(file);
			try {
				await this.loadImageUrl(url);
			} finally {
				URL.revokeObjectURL(url);
			}
		}

		async loadBlob(blob) {
			const url = URL.createObjectURL(blob);
			try {
				await this.loadImageUrl(url);
			} finally {
				URL.revokeObjectURL(url);
			}
		}

		async loadImageUrl(url) {
			try {
				this.setStatus("Loading…");
				const img = new Image();
				await new Promise((resolve, reject) => {
					img.onload = () => resolve(undefined);
					img.onerror = () => reject(new Error("Failed to decode image"));
					img.src = url;
				});
				this.image = img;
				this.hasImage = true;
				this.fitCover();
				this.setEnabled(true);
				this.setStatus("Drag to reposition.");
				this.scheduleRender();
				this.updateOutput();
			} catch (err) {
				this.setStatus(`Error: ${toErrorMessage(err)}`);
			}
		}

		setZoom(z) {
			// Avatar crop is cover-only: zooming out below 1 would introduce empty space.
			this.zoom = clamp(Number.isFinite(z) ? z : 1, 1, 4);
			this.els.zoom.value = String(this.zoom);
			this.els.zoomv.textContent = `${Math.round(this.zoom * 100)}%`;
			this.clampPan();
			this.scheduleRender();
			this.updateOutput();
		}

		getCanvasCssSize() {
			const rect = this.els.canvas.getBoundingClientRect();
			return { cw: Math.max(1, rect.width), ch: Math.max(1, rect.height) };
		}

		ensureCanvasSize() {
			const { cw, ch } = this.getCanvasCssSize();
			const w = Math.max(1, Math.round(cw * this.dpr));
			const h = Math.max(1, Math.round(ch * this.dpr));
			if (this.els.canvas.width !== w) this.els.canvas.width = w;
			if (this.els.canvas.height !== h) this.els.canvas.height = h;
			return { w, h, cw, ch };
		}

		getCropRect(cw, ch) {
			const pad = 16;
			const size = Math.max(1, Math.min(cw, ch) - pad * 2);
			return {
				x: (cw - size) / 2,
				y: (ch - size) / 2,
				w: size,
				h: size,
			};
		}

		fitCover() {
			if (!this.image) return;
			const { cw, ch } = this.getCanvasCssSize();
			const crop = this.getCropRect(cw, ch);
			const iw = this.image.naturalWidth;
			const ih = this.image.naturalHeight;
			this.baseScale = Math.max(crop.w / iw, crop.h / ih);
			this.pan = { x: 0, y: 0 };
			this.setZoom(1);
		}

		clampPan() {
			if (!this.image) return;
			const { cw, ch } = this.getCanvasCssSize();
			const crop = this.getCropRect(cw, ch);
			const iw = this.image.naturalWidth;
			const ih = this.image.naturalHeight;
			const s = this.baseScale * this.zoom;
			const halfW = (crop.w / 2) / s;
			const halfH = (crop.h / 2) / s;
			const maxPanX = Math.max(0, iw / 2 - halfW);
			const maxPanY = Math.max(0, ih / 2 - halfH);
			this.pan.x = clamp(this.pan.x, -maxPanX, maxPanX);
			this.pan.y = clamp(this.pan.y, -maxPanY, maxPanY);
		}

		onPointerDown(e) {
			if (!this.hasImage) return;
			this.els.canvas.setPointerCapture(e.pointerId);
			this.drag = { id: e.pointerId, x: e.clientX, y: e.clientY, panX: this.pan.x, panY: this.pan.y };
		}

		onPointerMove(e) {
			if (!this.drag || e.pointerId !== this.drag.id) return;
			if (!this.image) return;
			const dx = e.clientX - this.drag.x;
			const dy = e.clientY - this.drag.y;
			const s = this.baseScale * this.zoom;
			// Convert canvas pixels to image pixels.
			this.pan.x = this.drag.panX - dx / s;
			this.pan.y = this.drag.panY - dy / s;
			this.clampPan();
			this.scheduleRender();
			this.updateOutput();
		}

		onPointerUp() {
			this.drag = null;
		}

		scheduleRender() {
			if (this.raf) return;
			this.raf = window.requestAnimationFrame(() => {
				this.raf = 0;
				this.render();
			});
		}

		render() {
			const { w, h, cw, ch } = this.ensureCanvasSize();
			if (!this.ctx) return;
			this.ctx.setTransform(1, 0, 0, 1, 0, 0);
			this.ctx.clearRect(0, 0, w, h);
			this.ctx.imageSmoothingEnabled = true;
			this.ctx.imageSmoothingQuality = "high";

			// Background
			this.ctx.fillStyle = "#0b1020";
			this.ctx.fillRect(0, 0, w, h);

			if (!this.image) {
				return;
			}

			const crop = this.getCropRect(cw, ch);
			const s = this.baseScale * this.zoom;
			const iw = this.image.naturalWidth;
			const ih = this.image.naturalHeight;
			const cx = cw / 2;
			const cy = ch / 2;
			const ox = cx + this.pan.x * s;
			const oy = cy + this.pan.y * s;
			const dw = iw * s;
			const dh = ih * s;
			const dx = ox - dw / 2;
			const dy = oy - dh / 2;

			this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
			this.ctx.drawImage(this.image, dx, dy, dw, dh);

			// Darken outside crop
			this.ctx.fillStyle = "rgba(0,0,0,0.45)";
			this.ctx.fillRect(0, 0, cw, crop.y);
			this.ctx.fillRect(0, crop.y + crop.h, cw, ch - (crop.y + crop.h));
			this.ctx.fillRect(0, crop.y, crop.x, crop.h);
			this.ctx.fillRect(crop.x + crop.w, crop.y, cw - (crop.x + crop.w), crop.h);

			// Crop outline
			this.ctx.strokeStyle = "rgba(255,255,255,0.85)";
			this.ctx.lineWidth = 2;
			this.ctx.strokeRect(crop.x, crop.y, crop.w, crop.h);
		}

		updateOutput() {
			if (!this.image || !this.hasImage) return;
			try {
				const outN = parsePositiveInt(this.els.out.value, 256);
				const { cw, ch } = this.getCanvasCssSize();
				const crop = this.getCropRect(cw, ch);
				const s = this.baseScale * this.zoom;

				const iw = this.image.naturalWidth;
				const ih = this.image.naturalHeight;

				// Convert crop rect to source-image coordinates.
				const halfW = (crop.w / 2) / s;
				const halfH = (crop.h / 2) / s;
				const srcCx = iw / 2 + this.pan.x;
				const srcCy = ih / 2 + this.pan.y;
				const sx = srcCx - halfW;
				const sy = srcCy - halfH;
				const sw = halfW * 2;
				const sh = halfH * 2;

				const outCanvas = document.createElement("canvas");
				outCanvas.width = outN;
				outCanvas.height = outN;
				const octx = outCanvas.getContext("2d");
				if (!octx) throw new Error("Canvas unavailable");
				octx.imageSmoothingEnabled = true;
				octx.imageSmoothingQuality = "high";
				octx.fillStyle = "#ffffff";
				octx.fillRect(0, 0, outN, outN);
				octx.drawImage(this.image, sx, sy, sw, sh, 0, 0, outN, outN);

				const dataUrl = outCanvas.toDataURL("image/jpeg", 0.9);
				this.els.hidden.value = dataUrl;
				this.els.data.value = dataUrl;
				this.els.preview.src = dataUrl;
				this.els.copy.disabled = false;
				this.els.download.disabled = false;
				this.els.meta.textContent = `${outN}×${outN}px • ${formatBytes(Math.round((dataUrl.length * 3) / 4))} approx`;
			} catch (err) {
				this.setStatus(`Output: ${toErrorMessage(err)}`);
			}
		}

		async copyDataUrl() {
			try {
				if (!this.els.hidden.value) throw new Error("Nothing to copy.");
				if (navigator.clipboard && typeof navigator.clipboard.writeText === "function" && window.isSecureContext) {
					await navigator.clipboard.writeText(this.els.hidden.value);
					this.setStatus("Copied data URL.");
					return;
				}
				this.els.data.focus();
				this.els.data.select();
				this.setStatus("Text selected — press Cmd/Ctrl+C.");
			} catch (err) {
				this.setStatus(`Copy: ${toErrorMessage(err)}`);
			}
		}

		downloadJpeg() {
			try {
				const dataUrl = this.els.hidden.value;
				if (!dataUrl) throw new Error("Nothing to download.");
				const parts = String(dataUrl).split(",");
				if (parts.length < 2) throw new Error("Invalid data URL.");
				const bytes = base64ToBytes(parts[1]);
				const blob = new Blob([bytes], { type: "image/jpeg" });
				downloadBlob(blob, "avatar.jpg");
				this.setStatus("Downloaded avatar.jpg");
			} catch (err) {
				this.setStatus(`Download: ${toErrorMessage(err)}`);
			}
		}
	}

	if (!customElements.get("avatar-picker")) {
		customElements.define("avatar-picker", AvatarPickerElement);
	}

	function blobFromCanvas(canvas, mimeType, quality) {
		return new Promise((resolve, reject) => {
			if (!(canvas instanceof HTMLCanvasElement)) {
				reject(new Error("Export canvas unavailable"));
				return;
			}
			canvas.toBlob(
				(blob) => {
					if (blob) resolve(blob);
					else reject(new Error("Failed to encode image."));
				},
				mimeType,
				quality
			);
		});
	}

	/** @param {Blob} blob @param {string} filename */
	function downloadBlob(blob, filename) {
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		a.rel = "noopener";
		document.body.appendChild(a);
		a.click();
		a.remove();
		window.setTimeout(() => URL.revokeObjectURL(url), 1000);
	}

	function parsePositiveInt(value, fallback) {
		const n = Number(value);
		if (!Number.isFinite(n)) return fallback;
		return Math.max(1, Math.round(n));
	}

	class ExportController {
		/** @param {{
		 * outWidth: HTMLInputElement,
		 * outHeight: HTMLInputElement,
		 * lockAspect: HTMLInputElement,
		 * useCropSizeBtn: HTMLButtonElement,
		 * formatSelect: HTMLSelectElement,
		 * bgColor: HTMLInputElement,
		 * bgTransparent: HTMLInputElement,
		 * exportBtn: HTMLButtonElement,
		 * copyBtn: HTMLButtonElement,
		 * exportSize: HTMLElement,
		 * jpegControls: HTMLElement,
		 * jpegQuality: HTMLInputElement,
		 * jpegQualityValue: HTMLElement,
		 * jpegCompare: HTMLElement,
		 * jpegBaselineImg: HTMLImageElement,
		 * jpegOptimizedImg: HTMLImageElement,
		 * jpegBaselineMeta: HTMLElement,
		 * jpegOptimizedMeta: HTMLElement,
		 * statusText: HTMLElement,
		 * metaName: HTMLElement,
		 * }} els
		 * @param {CropEditor} cropEditor
		 */
		constructor(els, cropEditor) {
			this.els = els;
			this.cropEditor = cropEditor;
			this.enabled = false;
			this.estimateTimer = 0;
			this.estimateToken = 0;
			this.jpegTimer = 0;
			this.jpegToken = 0;
			this.jpegBaselineUrl = "";
			this.jpegOptimizedUrl = "";
			this.outputPreviewUrl = "";
			this.exportCanvas = document.createElement("canvas");
			this.exportCtx = this.exportCanvas.getContext("2d");

			this.onSizeInput = this.onSizeInput.bind(this);
			this.onLockAspect = this.onLockAspect.bind(this);
			this.onUseCropSize = this.onUseCropSize.bind(this);
			this.onFormatChange = this.onFormatChange.bind(this);
			this.onBgChange = this.onBgChange.bind(this);
			this.onExport = this.onExport.bind(this);
			this.onCopy = this.onCopy.bind(this);
			this.onJpegQuality = this.onJpegQuality.bind(this);
		}

		init() {
			this.els.outWidth.addEventListener("input", this.onSizeInput);
			this.els.outHeight.addEventListener("input", this.onSizeInput);
			this.els.lockAspect.addEventListener("change", this.onLockAspect);
			this.els.useCropSizeBtn.addEventListener("click", this.onUseCropSize);
			this.els.formatSelect.addEventListener("change", this.onFormatChange);
			this.els.bgColor.addEventListener("input", this.onBgChange);
			this.els.bgTransparent.addEventListener("change", this.onBgChange);
			this.els.exportBtn.addEventListener("click", this.onExport);
			this.els.copyBtn.addEventListener("click", this.onCopy);
			this.els.jpegQuality.addEventListener("input", this.onJpegQuality);
			if (this.cropEditor && this.cropEditor.els && this.cropEditor.els.aspectSelect) {
				this.cropEditor.els.aspectSelect.addEventListener("change", () => {
					if (!this.enabled) return;
					this.snapHeightToAspect();
					this.scheduleEstimate();
					this.scheduleJpegCompare();
				});
			}
			this.setEnabled(false);
			this.updateEstimateLabel(null);
			this.setJpegUiVisible(false);
		}

		setEnabled(enabled) {
			this.enabled = !!enabled;
			this.els.outWidth.disabled = !enabled;
			this.els.outHeight.disabled = !enabled;
			this.els.lockAspect.disabled = !enabled;
			this.els.useCropSizeBtn.disabled = !enabled;
			this.els.formatSelect.disabled = !enabled;
			this.els.bgColor.disabled = !enabled;
			this.els.bgTransparent.disabled = !enabled;
			this.els.exportBtn.disabled = !enabled;
			this.els.copyBtn.disabled = !enabled;
			this.els.jpegQuality.disabled = !enabled;
			// Output preview is always visible when enabled.
			this.clearOutputPreviewUrl();
			if (!enabled) this.updateEstimateLabel(null);
		}

		clear() {
			this.setEnabled(false);
			this.updateEstimateLabel(null);
			this.setJpegUiVisible(false);
			this.clearJpegUrls();
			this.clearOutputPreviewUrl();
		}

		setImage() {
			this.setEnabled(true);
			// Snap defaults to current crop aspect when an image arrives.
			this.snapHeightToAspect();
			this.onFormatChange();
			this.scheduleEstimate();
			this.scheduleJpegCompare();
		}

		onCropChanged() {
			if (!this.enabled) return;
			this.scheduleEstimate();
			this.scheduleJpegCompare();
		}

		setStatus(text) {
			this.els.statusText.textContent = String(text);
		}

		getExportFormat() {
			const v = String(this.els.formatSelect.value || "png").toLowerCase();
			return v === "jpeg" ? "jpeg" : "png";
		}

		getAspect() {
			const r = this.cropEditor.getAspectRatio();
			return Number.isFinite(r) && r > 0 ? r : 1;
		}

		snapHeightToAspect() {
			if (!this.els.lockAspect.checked) return;
			const outW = parsePositiveInt(this.els.outWidth.value, 512);
			const aspect = this.getAspect();
			const outH = Math.max(1, Math.round(outW / aspect));
			this.els.outHeight.value = String(outH);
		}

		onSizeInput(e) {
			if (!this.enabled) return;
			if (!this.els.lockAspect.checked) {
				this.scheduleEstimate();
				return;
			}

			const aspect = this.getAspect();
			const target = e && e.target;
			if (target === this.els.outWidth) {
				const outW = parsePositiveInt(this.els.outWidth.value, 512);
				this.els.outHeight.value = String(Math.max(1, Math.round(outW / aspect)));
			} else if (target === this.els.outHeight) {
				const outH = parsePositiveInt(this.els.outHeight.value, 512);
				this.els.outWidth.value = String(Math.max(1, Math.round(outH * aspect)));
			}
			this.scheduleEstimate();
		}

		onLockAspect() {
			if (!this.enabled) return;
			this.snapHeightToAspect();
			this.scheduleEstimate();
		}

		onUseCropSize() {
			if (!this.enabled) return;
			const rect = this.cropEditor.getCropRectInImagePixels();
			if (!rect) return;
			this.els.outWidth.value = String(Math.max(1, Math.round(rect.w)));
			this.els.outHeight.value = String(Math.max(1, Math.round(rect.h)));
			this.scheduleEstimate();
		}

		onFormatChange() {
			if (!this.enabled) return;
			const fmt = this.getExportFormat();
			if (fmt === "jpeg") {
				this.els.bgTransparent.checked = false;
				this.els.bgTransparent.disabled = true;
				this.setJpegUiVisible(true);
				this.scheduleJpegCompare();
			} else {
				this.els.bgTransparent.disabled = false;
				this.setJpegUiVisible(false);
				this.clearJpegUrls();
			}
			this.scheduleEstimate();
		}

		clearOutputPreviewUrl() {
			if (this.outputPreviewUrl) URL.revokeObjectURL(this.outputPreviewUrl);
			this.outputPreviewUrl = "";
			if (this.els.outputPreviewImg) {
				this.els.outputPreviewImg.src = "data:image/gif;base64,R0lGODlhAQABAPAAAP///wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";
			}
			if (this.els.outputPreviewMeta) this.els.outputPreviewMeta.textContent = "—";
		}

		setOutputPreview(blob) {
			this.clearOutputPreviewUrl();
			this.outputPreviewUrl = URL.createObjectURL(blob);
			if (this.els.outputPreviewImg) this.els.outputPreviewImg.src = this.outputPreviewUrl;
			if (this.els.outputPreviewFrame) {
				const fmt = this.getExportFormat();
				const wantsChecker = fmt === "png" && !!this.els.bgTransparent.checked;
				this.els.outputPreviewFrame.classList.toggle("checkerboard", wantsChecker);
			}
			const outW = parsePositiveInt(this.els.outWidth.value, 512);
			const outH = parsePositiveInt(this.els.outHeight.value, 512);
			if (this.els.outputPreviewMeta) {
				this.els.outputPreviewMeta.textContent = `${outW}×${outH}px • ${formatBytes(blob.size)}`;
			}
		}

		onBgChange(e) {
			if (!this.enabled) return;
			const fmt = this.getExportFormat();

			// If the user picks a background color, treat that as an "opaque" intent.
			// Only apply this when the color control changes (not when toggling the checkbox).
			if (fmt === "png" && e && e.target === this.els.bgColor) {
				this.els.bgTransparent.checked = false;
			}

			// Safety: Transparent is never valid for JPEG.
			if (fmt === "jpeg") {
				this.els.bgTransparent.checked = false;
			}

			this.scheduleEstimate();
			this.scheduleJpegCompare();
		}

		onJpegQuality() {
		if (!this.enabled) return;
		const q = clamp(Number(this.els.jpegQuality.value), 0.1, 1);
		this.els.jpegQuality.value = String(q);
		this.els.jpegQualityValue.textContent = `${Math.round(q * 100)}%`;
		this.scheduleJpegCompare();
		// Also update the main export estimate when exporting JPEG.
		if (this.getExportFormat() === "jpeg") this.scheduleEstimate();
	}

		scheduleEstimate() {
			if (this.estimateTimer) window.clearTimeout(this.estimateTimer);
			this.estimateTimer = window.setTimeout(() => {
				this.estimateTimer = 0;
				this.updateEstimate();
			}, 250);
		}

		updateEstimateLabel(bytes) {
			this.els.exportSize.textContent = `Estimated size: ${bytes == null ? "—" : formatBytes(bytes)}`;
		}

		setJpegUiVisible(visible) {
			this.els.jpegControls.hidden = !visible;
			this.els.jpegCompare.hidden = !visible;
			if (visible) this.onJpegQuality();
		}

		clearJpegUrls() {
			if (this.jpegBaselineUrl) URL.revokeObjectURL(this.jpegBaselineUrl);
			if (this.jpegOptimizedUrl) URL.revokeObjectURL(this.jpegOptimizedUrl);
			this.jpegBaselineUrl = "";
			this.jpegOptimizedUrl = "";
			// Keep placeholder src to avoid broken-image icons.
			this.els.jpegBaselineImg.src = "data:image/gif;base64,R0lGODlhAQABAPAAAP///wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";
			this.els.jpegOptimizedImg.src = "data:image/gif;base64,R0lGODlhAQABAPAAAP///wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";
			this.els.jpegBaselineMeta.textContent = "—";
			this.els.jpegOptimizedMeta.textContent = "—";
		}

		scheduleJpegCompare() {
			if (!this.enabled) return;
			if (this.getExportFormat() !== "jpeg") return;
			if (this.jpegTimer) window.clearTimeout(this.jpegTimer);
			this.jpegTimer = window.setTimeout(() => {
				this.jpegTimer = 0;
				this.updateJpegCompare();
			}, 300);
		}

		async updateJpegCompare() {
			if (!this.enabled) return;
			if (this.getExportFormat() !== "jpeg") return;
			const token = ++this.jpegToken;
			try {
				const baseBlob = await this.renderToJpegBlob(0.92);
				const q = clamp(Number(this.els.jpegQuality.value), 0.1, 1);
				const optBlob = await this.renderToJpegBlob(q);
				if (token !== this.jpegToken) return;
				this.setJpegPreview({ baseBlob, optBlob, q });
			} catch {
				if (token !== this.jpegToken) return;
				this.clearJpegUrls();
			}
		}

		async renderToJpegBlob(quality) {
			// Render using the same crop + output size, forcing an opaque background.
			const ctx = this.exportCtx;
			const image = this.cropEditor.image;
			const rect = this.cropEditor.getCropRectInImagePixels();
			if (!ctx || !image || !rect) throw new Error("No image to export");

			const outW = parsePositiveInt(this.els.outWidth.value, 512);
			const outH = parsePositiveInt(this.els.outHeight.value, 512);
			this.exportCanvas.width = outW;
			this.exportCanvas.height = outH;
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.clearRect(0, 0, outW, outH);
			ctx.imageSmoothingEnabled = true;
			ctx.imageSmoothingQuality = "high";
			ctx.fillStyle = String(this.els.bgColor.value || "#ffffff");
			ctx.fillRect(0, 0, outW, outH);
			this.drawCropContained(ctx, image, rect, outW, outH);
			return await blobFromCanvas(this.exportCanvas, "image/jpeg", clamp(Number(quality), 0.1, 1));
		}

		drawCropContained(ctx, image, rect, outW, outH) {
			// Preserve the crop aspect; letterbox/pillarbox as needed.
			// This prevents stretching when output size doesn't match crop aspect.
			const sw = Math.max(1, rect.w);
			const sh = Math.max(1, rect.h);
			const scale = Math.min(outW / sw, outH / sh);
			const dw = sw * scale;
			const dh = sh * scale;
			const dx = (outW - dw) / 2;
			const dy = (outH - dh) / 2;
			ctx.drawImage(image, rect.x, rect.y, sw, sh, dx, dy, dw, dh);
		}

		setJpegPreview({ baseBlob, optBlob, q }) {
			this.clearJpegUrls();
			this.jpegBaselineUrl = URL.createObjectURL(baseBlob);
			this.jpegOptimizedUrl = URL.createObjectURL(optBlob);
			this.els.jpegBaselineImg.src = this.jpegBaselineUrl;
			this.els.jpegOptimizedImg.src = this.jpegOptimizedUrl;
			this.els.jpegBaselineMeta.textContent = `${formatBytes(baseBlob.size)} • q=92%`;
			this.els.jpegOptimizedMeta.textContent = `${formatBytes(optBlob.size)} • q=${Math.round(q * 100)}%`;
		}

		async updateEstimate() {
			if (!this.enabled) return;
			const token = ++this.estimateToken;
			try {
				const blob = await this.renderToBlob();
				if (token !== this.estimateToken) return;
				this.updateEstimateLabel(blob.size);
				this.setOutputPreview(blob);
			} catch {
				if (token !== this.estimateToken) return;
				this.updateEstimateLabel(null);
				this.clearOutputPreviewUrl();
			}
		}

		getSuggestedBaseName() {
			const raw = (this.els.metaName.textContent || "").trim();
			const cleaned = raw && raw !== "—" ? raw : "image";
			return cleaned.replace(/\.[a-z0-9]+$/i, "").replace(/[^a-z0-9._-]+/gi, "-");
		}

		async renderToBlob() {
			const ctx = this.exportCtx;
			const image = this.cropEditor.image;
			const rect = this.cropEditor.getCropRectInImagePixels();
			if (!ctx || !image || !rect) throw new Error("No image to export");

			const outW = parsePositiveInt(this.els.outWidth.value, 512);
			const outH = parsePositiveInt(this.els.outHeight.value, 512);
			this.exportCanvas.width = outW;
			this.exportCanvas.height = outH;
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.clearRect(0, 0, outW, outH);
			ctx.imageSmoothingEnabled = true;
			ctx.imageSmoothingQuality = "high";

			const fmt = this.getExportFormat();
			const bgTransparent = fmt === "png" && !!this.els.bgTransparent.checked;
			if (!bgTransparent) {
				ctx.fillStyle = String(this.els.bgColor.value || "#ffffff");
				ctx.fillRect(0, 0, outW, outH);
			}

			this.drawCropContained(ctx, image, rect, outW, outH);

			if (fmt === "jpeg") {
				return await blobFromCanvas(this.exportCanvas, "image/jpeg", clamp(Number(this.els.jpegQuality.value || 0.92), 0.1, 1));
			}
			return await blobFromCanvas(this.exportCanvas, "image/png");
		}

		async onExport() {
			if (!this.enabled) return;
			try {
				this.setStatus("Exporting…");
				const blob = await this.renderToBlob();
				this.updateEstimateLabel(blob.size);
				const ext = this.getExportFormat() === "jpeg" ? "jpg" : "png";
				downloadBlob(blob, `${this.getSuggestedBaseName()}-export.${ext}`);
				this.setStatus("Export complete.");
			} catch (err) {
				this.setStatus(`Error: ${toErrorMessage(err)}`);
			}
		}

		async onCopy() {
			if (!this.enabled) return;
			try {
				if (!window.isSecureContext || !navigator.clipboard || typeof navigator.clipboard.write !== "function") {
					throw new Error("Copy requires a secure context (https://). Use Export instead.");
				}
				if (typeof ClipboardItem === "undefined") {
					throw new Error("Copy is not supported in this browser. Use Export instead.");
				}
				this.setStatus("Copying…");
				const blob = await this.renderToBlob();
				const item = new ClipboardItem({ [blob.type]: blob });
				await navigator.clipboard.write([item]);
				this.updateEstimateLabel(blob.size);
				this.setStatus("Copied to clipboard.");
			} catch (err) {
				this.setStatus(`Error: ${toErrorMessage(err)}`);
			}
		}
	}

	function main() {
		const root = document.querySelector("[data-image-tools]");
		if (!root) return;

		const tabs = new TabsController({ root: /** @type {HTMLElement} */(root) });
		tabs.init();

		/** @type {Record<string, HTMLElement | null>} */
		const els = {
			copyLinkBtn: document.getElementById("copyLinkBtn"),
			clearStateBtn: document.getElementById("clearStateBtn"),
			globalStatusText: document.getElementById("globalStatusText"),
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
			aspectSelect: document.getElementById("aspectSelect"),
			zoomRange: document.getElementById("zoomRange"),
			zoomValue: document.getElementById("zoomValue"),
			fitBtn: document.getElementById("fitBtn"),
			centerCropBtn: document.getElementById("centerCropBtn"),
			resetViewBtn: document.getElementById("resetViewBtn"),
			exportSize: document.getElementById("exportSize"),
			outWidth: document.getElementById("outWidth"),
			outHeight: document.getElementById("outHeight"),
			lockAspect: document.getElementById("lockAspect"),
			useCropSizeBtn: document.getElementById("useCropSizeBtn"),
			formatSelect: document.getElementById("formatSelect"),
			bgColor: document.getElementById("bgColor"),
			bgTransparent: document.getElementById("bgTransparent"),
			exportBtn: document.getElementById("exportBtn"),
			copyBtn: document.getElementById("copyBtn"),
			jpegControls: document.getElementById("jpegControls"),
			jpegQuality: document.getElementById("jpegQuality"),
			jpegQualityValue: document.getElementById("jpegQualityValue"),
			jpegCompare: document.getElementById("jpegCompare"),
			jpegBaselineImg: document.getElementById("jpegBaselineImg"),
			jpegOptimizedImg: document.getElementById("jpegOptimizedImg"),
			jpegBaselineMeta: document.getElementById("jpegBaselineMeta"),
			jpegOptimizedMeta: document.getElementById("jpegOptimizedMeta"),
			outputPreviewFrame: document.getElementById("outputPreviewFrame"),
			outputPreviewImg: document.getElementById("outputPreviewImg"),
			outputPreviewMeta: document.getElementById("outputPreviewMeta"),
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
			"outputPreviewFrame",
			"outputPreviewImg",
			"outputPreviewMeta",
			"aspectSelect",
			"zoomRange",
			"zoomValue",
			"fitBtn",
			"centerCropBtn",
			"resetViewBtn",
			"exportSize",
			"outWidth",
			"outHeight",
			"lockAspect",
			"useCropSizeBtn",
			"formatSelect",
			"bgColor",
			"bgTransparent",
			"exportBtn",
			"copyBtn",
			"jpegControls",
			"jpegQuality",
			"jpegQualityValue",
			"jpegCompare",
			"jpegBaselineImg",
			"jpegOptimizedImg",
			"jpegBaselineMeta",
			"jpegOptimizedMeta",
		];

		for (const key of requiredKeys) {
			if (!els[key]) {
				console.warn(`[image-tools] Missing element: ${key}`);
				return;
			}
		}

		// Phase 9: State & Portability (URL + localStorage + offline after first load)
		const portability = new StateAndPortability({
			root: /** @type {HTMLElement} */(root),
			tabs,
			copyLinkBtn: /** @type {any} */(els.copyLinkBtn),
			clearStateBtn: /** @type {any} */(els.clearStateBtn),
			globalStatusText: /** @type {any} */(els.globalStatusText),
		});
		portability.restore();
		portability.init();

		const cropEditor = new CropEditor(/** @type {any} */({
			editorCanvas: els.editorCanvas,
			previewPlaceholder: els.previewPlaceholder,
			previewImage: els.previewImage,
			aspectSelect: els.aspectSelect,
			zoomRange: els.zoomRange,
			zoomValue: els.zoomValue,
			fitBtn: els.fitBtn,
			centerCropBtn: els.centerCropBtn,
			resetViewBtn: els.resetViewBtn,
		}));
		cropEditor.init();
		cropEditor.setEnabled(false);

		const exporter = new ExportController(/** @type {any} */({
			outWidth: els.outWidth,
			outHeight: els.outHeight,
			lockAspect: els.lockAspect,
			useCropSizeBtn: els.useCropSizeBtn,
			formatSelect: els.formatSelect,
			bgColor: els.bgColor,
			bgTransparent: els.bgTransparent,
			exportBtn: els.exportBtn,
			copyBtn: els.copyBtn,
			exportSize: els.exportSize,
			jpegControls: els.jpegControls,
			jpegQuality: els.jpegQuality,
			jpegQualityValue: els.jpegQualityValue,
			jpegCompare: els.jpegCompare,
			jpegBaselineImg: els.jpegBaselineImg,
			jpegOptimizedImg: els.jpegOptimizedImg,
			jpegBaselineMeta: els.jpegBaselineMeta,
			jpegOptimizedMeta: els.jpegOptimizedMeta,
			outputPreviewFrame: els.outputPreviewFrame,
			outputPreviewImg: els.outputPreviewImg,
			outputPreviewMeta: els.outputPreviewMeta,
			statusText: els.statusText,
			metaName: els.metaName,
		}), cropEditor);
		exporter.init();
		cropEditor.onCropChanged = () => exporter.onCropChanged();

		const input = new ImageInput(/** @type {any} */({
			...els,
			isActive: () => tabs.isActive("editor"),
			onImageLoaded: (imgEl) => {
				cropEditor.setImage(imgEl);
				exporter.setImage(imgEl);
			},
			onCleared: () => {
				cropEditor.clear();
				exporter.clear();
			},
		}));
		input.init();

		// Phase 5: Raster → SVG
		const r2s = {
			fileInput: document.getElementById("r2sFileInput"),
			dropZone: document.getElementById("r2sDropZone"),
			chooseBtn: document.getElementById("r2sChooseBtn"),
			pasteBtn: document.getElementById("r2sPasteBtn"),
			resetBtn: document.getElementById("r2sResetBtn"),
			statusText: document.getElementById("r2sStatusText"),
			meta: document.getElementById("r2sMeta"),
			source: document.getElementById("r2sSource"),
			preview: document.getElementById("r2sPreview"),
			copyBtn: document.getElementById("r2sCopyBtn"),
			downloadBtn: document.getElementById("r2sDownloadBtn"),
		};
		if (r2s.fileInput && r2s.dropZone && r2s.chooseBtn && r2s.pasteBtn && r2s.resetBtn && r2s.statusText && r2s.meta && r2s.source && r2s.preview && r2s.copyBtn && r2s.downloadBtn) {
			new RasterToSvgTool(/** @type {any} */({
				...r2s,
				isActive: () => tabs.isActive("raster-to-svg"),
			})).init();
		}

		// Phase 5: SVG → Raster
		const s2r = {
			fileInput: document.getElementById("s2rFileInput"),
			chooseBtn: document.getElementById("s2rChooseBtn"),
			pasteBtn: document.getElementById("s2rPasteBtn"),
			resetBtn: document.getElementById("s2rResetBtn"),
			statusText: document.getElementById("s2rStatusText"),
			source: document.getElementById("s2rSource"),
			canvas: document.getElementById("s2rCanvas"),
			meta: document.getElementById("s2rMeta"),
			format: document.getElementById("s2rFormat"),
			outWidth: document.getElementById("s2rOutWidth"),
			outHeight: document.getElementById("s2rOutHeight"),
			padding: document.getElementById("s2rPadding"),
			bgColor: document.getElementById("s2rBgColor"),
			transparent: document.getElementById("s2rTransparent"),
			sizeLabel: document.getElementById("s2rSize"),
			exportBtn: document.getElementById("s2rExportBtn"),
			copyBtn: document.getElementById("s2rCopyBtn"),
		};
		if (s2r.fileInput && s2r.chooseBtn && s2r.pasteBtn && s2r.resetBtn && s2r.statusText && s2r.source && s2r.canvas && s2r.meta && s2r.format && s2r.outWidth && s2r.outHeight && s2r.padding && s2r.bgColor && s2r.transparent && s2r.sizeLabel && s2r.exportBtn && s2r.copyBtn) {
			new SvgToRasterTool(/** @type {any} */({
				...s2r,
				isActive: () => tabs.isActive("svg-to-raster"),
			})).init();
		}

		// Phase 6: SVG Sandbox
		const sbx = {
			fileInput: document.getElementById("sbxFileInput"),
			chooseBtn: document.getElementById("sbxChooseBtn"),
			pasteBtn: document.getElementById("sbxPasteBtn"),
			resetBtn: document.getElementById("sbxResetBtn"),
			statusText: document.getElementById("sbxStatusText"),
			source: document.getElementById("sbxSource"),
			sanitized: document.getElementById("sbxSanitized"),
			preview: document.getElementById("sbxPreview"),
			meta: document.getElementById("sbxMeta"),
			report: document.getElementById("sbxReport"),
		};
		if (sbx.fileInput && sbx.chooseBtn && sbx.pasteBtn && sbx.resetBtn && sbx.statusText && sbx.source && sbx.sanitized && sbx.preview && sbx.meta && sbx.report) {
			new SvgSandboxTool(/** @type {any} */({
				...sbx,
				isActive: () => tabs.isActive("svg-sandbox"),
			})).init();
		}

		// SVG Embed
		const emb = {
			fileInput: document.getElementById("embFileInput"),
			chooseBtn: document.getElementById("embChooseBtn"),
			pasteBtn: document.getElementById("embPasteBtn"),
			copyTagBtn: document.getElementById("embCopyTagBtn"),
			copyDataBtn: document.getElementById("embCopyDataBtn"),
			resetBtn: document.getElementById("embResetBtn"),
			statusText: document.getElementById("embStatusText"),
			source: document.getElementById("embSource"),
			meta: document.getElementById("embMeta"),
			img: document.getElementById("embImg"),
			imgMeta: document.getElementById("embImgMeta"),
			tag: document.getElementById("embTag"),
			decoded: document.getElementById("embDecoded"),
		};
		if (emb.fileInput && emb.chooseBtn && emb.pasteBtn && emb.copyTagBtn && emb.copyDataBtn && emb.resetBtn && emb.statusText && emb.source && emb.meta && emb.img && emb.imgMeta && emb.tag && emb.decoded) {
			new SvgEmbedTool(/** @type {any} */({
				...emb,
				isActive: () => tabs.isActive("svg-embed"),
			})).init();
		}
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", main);
	} else {
		main();
	}
})();

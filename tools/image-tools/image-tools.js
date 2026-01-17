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
		 * onCropChanged?: (info: { cropW: number, cropH: number }) => void,
		 * }} els */
		constructor(els) {
			this.els = els;
			this.ctx = els.editorCanvas.getContext("2d");
			this.previewCtx = els.cropPreview.getContext("2d");
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

			this.renderPreview({ imgX, imgY, scale });
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
			if (this.onCropChanged) this.onCropChanged({ cropW: swi, cropH: shi });
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
			const nextZoom = clamp(prevZoom * zoomFactor, 1, 4);
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
			this.schedule();
		}

		sanitizeSvg(svgText) {
			const text = String(svgText || "").trim();
			if (!text.includes("<svg")) throw new Error("No <svg> tag found.");
			const parser = new DOMParser();
			const doc = parser.parseFromString(text, "image/svg+xml");
			const svg = doc.documentElement;
			if (!svg || svg.nodeName.toLowerCase() !== "svg") throw new Error("Invalid SVG.");

			for (const sel of ["script", "foreignObject", "iframe", "object", "embed"]) {
				for (const el of Array.from(svg.querySelectorAll(sel))) el.remove();
			}

			const all = Array.from(svg.querySelectorAll("*"));
			for (const el of all) {
				for (const attr of Array.from(el.attributes)) {
					const n = attr.name;
					const v = attr.value;
					if (/^on/i.test(n)) el.removeAttribute(n);
					if ((n === "href" || n === "xlink:href") && /^https?:/i.test(v)) el.removeAttribute(n);
				}
			}

			if (!svg.getAttribute("xmlns")) svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
			return new XMLSerializer().serializeToString(svg);
		}

		getSvgIntrinsicSize(svgText) {
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
			if (Number.isFinite(w) && Number.isFinite(h) && w > 0 && h > 0) return { w, h };

			const nums = vb.trim().split(/[\s,]+/).map(Number);
			if (nums.length === 4 && nums.every((n) => Number.isFinite(n))) {
				const vbW = Math.max(1, nums[2]);
				const vbH = Math.max(1, nums[3]);
				return { w: vbW, h: vbH };
			}
			return { w: 512, h: 512 };
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
			if (!enabled) this.updateEstimateLabel(null);
		}

		clear() {
			this.setEnabled(false);
			this.updateEstimateLabel(null);
			this.setJpegUiVisible(false);
			this.clearJpegUrls();
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

		onBgChange() {
			if (!this.enabled) return;
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
			this.els.jpegBaselineImg.removeAttribute("src");
			this.els.jpegOptimizedImg.removeAttribute("src");
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
			ctx.drawImage(image, rect.x, rect.y, rect.w, rect.h, 0, 0, outW, outH);
			return await blobFromCanvas(this.exportCanvas, "image/jpeg", clamp(Number(quality), 0.1, 1));
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
			} catch {
				if (token !== this.estimateToken) return;
				this.updateEstimateLabel(null);
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

			ctx.drawImage(image, rect.x, rect.y, rect.w, rect.h, 0, 0, outW, outH);

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
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", main);
	} else {
		main();
	}
})();

(() => {
	"use strict";

	const PLACEHOLDER_GIF = "data:image/gif;base64,R0lGODlhAQABAPAAAP///wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";

	function clamp(n, min, max) {
		return Math.max(min, Math.min(max, n));
	}

	function clampInt(n, min, max) {
		return Math.max(min, Math.min(max, Math.round(n)));
	}

	function fmtMs(ms) {
		if (!Number.isFinite(ms)) return "—";
		return `${ms.toFixed(ms < 10 ? 2 : ms < 100 ? 1 : 0)} ms`;
	}

	function isImageType(mime) {
		return typeof mime === "string" && mime.startsWith("image/");
	}

	function applyGrayscaleInPlace(data) {
		for (let i = 0; i < data.length; i += 4) {
			// Luma-ish weights.
			const r = data[i];
			const g = data[i + 1];
			const b = data[i + 2];
			const y = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
			data[i] = y;
			data[i + 1] = y;
			data[i + 2] = y;
		}
	}

	function applyInvertInPlace(data) {
		for (let i = 0; i < data.length; i += 4) {
			data[i] = 255 - data[i];
			data[i + 1] = 255 - data[i + 1];
			data[i + 2] = 255 - data[i + 2];
		}
	}

	function applyContrastInPlace(data, contrastPercent) {
		// contrastPercent in [-100, 100]
		const c = clamp(contrastPercent, -100, 100) * 2.55; // [-255, 255]
		const factor = (259 * (c + 255)) / (255 * (259 - c));
		for (let i = 0; i < data.length; i += 4) {
			data[i] = clampInt(factor * (data[i] - 128) + 128, 0, 255);
			data[i + 1] = clampInt(factor * (data[i + 1] - 128) + 128, 0, 255);
			data[i + 2] = clampInt(factor * (data[i + 2] - 128) + 128, 0, 255);
		}
	}

	function boxBlurSeparable(data, w, h, radius) {
		// Deterministic, integer radius. Two-pass separable blur.
		const r = clampInt(radius, 0, 64);
		if (r <= 0) return;
		const tmp = new Uint8ClampedArray(data.length);
		const windowSize = r * 2 + 1;

		// Horizontal pass
		for (let y = 0; y < h; y++) {
			let sumR = 0, sumG = 0, sumB = 0, sumA = 0;
			// Initial window at x=0
			for (let ix = -r; ix <= r; ix++) {
				const x = clampInt(ix, 0, w - 1);
				const i = (y * w + x) * 4;
				sumR += data[i];
				sumG += data[i + 1];
				sumB += data[i + 2];
				sumA += data[i + 3];
			}
			for (let x = 0; x < w; x++) {
				const oi = (y * w + x) * 4;
				tmp[oi] = Math.round(sumR / windowSize);
				tmp[oi + 1] = Math.round(sumG / windowSize);
				tmp[oi + 2] = Math.round(sumB / windowSize);
				tmp[oi + 3] = Math.round(sumA / windowSize);

				// Slide window: remove x-r, add x+r+1
				const xRemove = clampInt(x - r, 0, w - 1);
				const xAdd = clampInt(x + r + 1, 0, w - 1);
				const iRemove = (y * w + xRemove) * 4;
				const iAdd = (y * w + xAdd) * 4;
				sumR += data[iAdd] - data[iRemove];
				sumG += data[iAdd + 1] - data[iRemove + 1];
				sumB += data[iAdd + 2] - data[iRemove + 2];
				sumA += data[iAdd + 3] - data[iRemove + 3];
			}
		}

		// Vertical pass back into data
		for (let x = 0; x < w; x++) {
			let sumR = 0, sumG = 0, sumB = 0, sumA = 0;
			for (let iy = -r; iy <= r; iy++) {
				const y = clampInt(iy, 0, h - 1);
				const i = (y * w + x) * 4;
				sumR += tmp[i];
				sumG += tmp[i + 1];
				sumB += tmp[i + 2];
				sumA += tmp[i + 3];
			}
			for (let y = 0; y < h; y++) {
				const oi = (y * w + x) * 4;
				data[oi] = Math.round(sumR / windowSize);
				data[oi + 1] = Math.round(sumG / windowSize);
				data[oi + 2] = Math.round(sumB / windowSize);
				data[oi + 3] = Math.round(sumA / windowSize);

				const yRemove = clampInt(y - r, 0, h - 1);
				const yAdd = clampInt(y + r + 1, 0, h - 1);
				const iRemove = (yRemove * w + x) * 4;
				const iAdd = (yAdd * w + x) * 4;
				sumR += tmp[iAdd] - tmp[iRemove];
				sumG += tmp[iAdd + 1] - tmp[iRemove + 1];
				sumB += tmp[iAdd + 2] - tmp[iRemove + 2];
				sumA += tmp[iAdd + 3] - tmp[iRemove + 3];
			}
		}
	}

	function downloadBlob(blob, filename) {
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		a.rel = "noopener";
		document.body.appendChild(a);
		a.click();
		a.remove();
		setTimeout(() => URL.revokeObjectURL(url), 1500);
	}

	function safeFilenamePart(s) {
		return String(s || "trace")
			.trim()
			.toLowerCase()
			.replace(/[^a-z0-9\-_.]+/g, "-")
			.replace(/-+/g, "-")
			.replace(/^[-_.]+|[-_.]+$/g, "")
			.slice(0, 80) || "trace";
	}

	function timestampForFilename() {
		const d = new Date();
		const pad = (n) => String(n).padStart(2, "0");
		return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
	}

	function blobFromCanvas(canvas, type, quality) {
		return new Promise((resolve, reject) => {
			canvas.toBlob((blob) => {
				if (!blob) reject(new Error("Canvas export failed."));
				else resolve(blob);
			}, type, quality);
		});
	}

	async function fileToImage(file) {
		const url = URL.createObjectURL(file);
		try {
			const img = new Image();
			img.decoding = "async";
			img.loading = "eager";
			img.src = url;
			await img.decode();
			return img;
		} finally {
			URL.revokeObjectURL(url);
		}
	}

	function buildSvgWrapperFromPngDataUrl(pngDataUrl, w, h) {
		// Baseline placeholder: wraps normalized raster into an <image>.
		// Future phases will swap this for real tracing engines.
		// preserveAspectRatio defaults to stretch (none) for parity with earlier behavior.
		const preserveAspectRatio = "none";
		return (
			`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">\n` +
			`  <image href="${pngDataUrl}" width="${w}" height="${h}" preserveAspectRatio="${preserveAspectRatio}" />\n` +
			`</svg>`
		);
	}

	function buildRasterWrapperSvg(pngDataUrl, w, h, preserveAspectRatio, background) {
		const par = preserveAspectRatio || "none";
		const bg = typeof background === "string" ? background : "transparent";
		const rect = bg && bg !== "transparent" ? `  <rect width="100%" height="100%" fill="${bg}"/>\n` : "";
		return (
			`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">\n` +
			rect +
			`  <image href="${pngDataUrl}" width="${w}" height="${h}" preserveAspectRatio="${par}" />\n` +
			`</svg>`
		);
	}

	function svgToSandboxDoc(svgText) {
		// Keep it extremely simple and inert.
		return (
			"<!doctype html><meta charset=\"utf-8\">" +
			"<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">" +
			"<style>html,body{margin:0;padding:0;height:100%;}svg{width:100%;height:100%;display:block;}</style>" +
			svgText
		);
	}

	function encodeSvgTextBytes(svgText) {
		try {
			return new TextEncoder().encode(svgText).byteLength;
		} catch (_) {
			return svgText.length;
		}
	}

	function svgToDataUrl(svgText) {
		// Use percent-encoding to avoid unicode/btoa pitfalls.
		return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText)}`;
	}

	function minifySvgText(svgText, decimals) {
		const dec = clampInt(Number(decimals), 0, 6);
		const p = Math.pow(10, dec);
		let out = String(svgText || "");
		out = out.replace(/>\s+</g, "><");
		out = out.replace(/\s{2,}/g, " ");
		out = out.trim();
		// Decimal rounding across numeric tokens; skip numbers inside hex colors.
		out = out.replace(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi, (m, off, str) => {
			if (off > 0 && str[off - 1] === "#") return m;
			const n = Number(m);
			if (!Number.isFinite(n)) return m;
			if (dec === 0) return String(Math.round(n));
			return String(Math.round(n * p) / p);
		});
		return out;
	}

	function validateSvgText(svgText) {
		const text = String(svgText || "").trim();
		if (!text) return { ok: false, error: "Empty SVG." };
		try {
			const doc = new DOMParser().parseFromString(text, "image/svg+xml");
			const parserError = doc.querySelector("parsererror");
			if (parserError) {
				const details = String(parserError.textContent || "").trim().replace(/\s+/g, " ");
				return { ok: false, error: details ? `SVG XML parse error: ${details.slice(0, 220)}` : "SVG XML parse error." };
			}
			const root = doc.documentElement;
			if (!root || String(root.tagName || "").toLowerCase() !== "svg") {
				return { ok: false, error: "SVG root element is not <svg>." };
			}
			const vb = root.getAttribute("viewBox");
			if (!vb || !String(vb).trim()) {
				return { ok: false, error: "Missing viewBox on <svg>." };
			}
			return { ok: true, error: "" };
		} catch (e) {
			return { ok: false, error: e instanceof Error ? e.message : String(e) };
		}
	}

	async function loadImageFromUrl(url) {
		// Prefer direct <img> loading so this works on file:// as well.
		const img = new Image();
		img.decoding = "async";
		img.loading = "eager";
		img.src = String(url);
		await img.decode();
		return img;
	}

	function countSvgPaths(svgText) {
		try {
			const m = svgText.match(/<path\b/gi);
			return m ? m.length : 0;
		} catch (_) {
			return 0;
		}
	}

	function avgLuma(imageData) {
		const d = imageData.data;
		let sum = 0;
		let count = 0;
		for (let i = 0; i < d.length; i += 4) {
			const a = d[i + 3];
			if (a === 0) continue;
			sum += 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
			count++;
		}
		return count ? sum / count : 0;
	}

	function otsuThresholdFromImageData(imageData) {
		// Classic Otsu on luma histogram.
		const d = imageData.data;
		/** @type {number[]} */
		const hist = new Array(256).fill(0);
		let total = 0;
		for (let i = 0; i < d.length; i += 4) {
			const a = d[i + 3];
			if (a === 0) continue;
			const y = Math.round(0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]);
			hist[y]++;
			total++;
		}
		if (total === 0) return 128;

		let sum = 0;
		for (let t = 0; t < 256; t++) sum += t * hist[t];

		let sumB = 0;
		let wB = 0;
		let maxVar = -1;
		let threshold = 128;

		for (let t = 0; t < 256; t++) {
			wB += hist[t];
			if (wB === 0) continue;
			const wF = total - wB;
			if (wF === 0) break;
			sumB += t * hist[t];
			const mB = sumB / wB;
			const mF = (sum - sumB) / wF;
			const between = wB * wF * (mB - mF) * (mB - mF);
			if (between > maxVar) {
				maxVar = between;
				threshold = t;
			}
		}
		return threshold;
	}

	function buildBinaryMask(imageData, threshold, invert) {
		const w = imageData.width;
		const h = imageData.height;
		const d = imageData.data;
		const mask = new Uint8Array(w * h);
		for (let y = 0; y < h; y++) {
			for (let x = 0; x < w; x++) {
				const i = (y * w + x) * 4;
				const a = d[i + 3];
				if (a === 0) {
					mask[y * w + x] = 0;
					continue;
				}
				const yv = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
				const on = invert ? yv > threshold : yv < threshold;
				mask[y * w + x] = on ? 1 : 0;
			}
		}
		return mask;
	}

	function removeSpecklesInPlace(mask, w, h, minArea) {
		// Removes ON-components smaller than minArea.
		const minA = clampInt(minArea, 0, 1_000_000);
		if (minA <= 1) return;
		const visited = new Uint8Array(mask.length);
		/** @type {number[]} */
		const stack = [];
		/** @type {number[]} */
		const component = [];
		const push = (idx) => {
			visited[idx] = 1;
			stack.push(idx);
		};

		for (let i = 0; i < mask.length; i++) {
			if (mask[i] === 0 || visited[i]) continue;
			component.length = 0;
			stack.length = 0;
			push(i);
			while (stack.length) {
				const idx = stack.pop();
				component.push(idx);
				const x = idx % w;
				const y = (idx - x) / w;
				// 4-neighborhood is sufficient for speckle removal.
				if (x > 0) {
					const j = idx - 1;
					if (mask[j] && !visited[j]) push(j);
				}
				if (x + 1 < w) {
					const j = idx + 1;
					if (mask[j] && !visited[j]) push(j);
				}
				if (y > 0) {
					const j = idx - w;
					if (mask[j] && !visited[j]) push(j);
				}
				if (y + 1 < h) {
					const j = idx + w;
					if (mask[j] && !visited[j]) push(j);
				}
			}
			if (component.length > 0 && component.length < minA) {
				for (const idx of component) mask[idx] = 0;
			}
		}
	}

	function marchingSquaresSegments(mask, w, h) {
		// Returns segments on the pixel grid, in doubled coordinates to keep halves as ints.
		// Segment endpoints are [x2,y2] where actual coordinate is (x2/2, y2/2).
		/** @type {Array<[number, number, number, number]>} */
		const segs = [];
		const sample = (x, y) => mask[y * w + x] ? 1 : 0;
		const keyPt = {
			top: (x, y) => [x * 2 + 1, y * 2],
			right: (x, y) => [(x + 1) * 2, y * 2 + 1],
			bottom: (x, y) => [x * 2 + 1, (y + 1) * 2],
			left: (x, y) => [x * 2, y * 2 + 1],
		};

		for (let y = 0; y < h - 1; y++) {
			for (let x = 0; x < w - 1; x++) {
				const a = sample(x, y);
				const b = sample(x + 1, y);
				const c = sample(x + 1, y + 1);
				const d = sample(x, y + 1);
				const idx = (a << 0) | (b << 1) | (c << 2) | (d << 3);
				if (idx === 0 || idx === 15) continue;

				const [tx, ty] = keyPt.top(x, y);
				const [rx, ry] = keyPt.right(x, y);
				const [bx, by] = keyPt.bottom(x, y);
				const [lx, ly] = keyPt.left(x, y);

				// Standard marching squares cases. Ambiguous 5/10 resolved via center.
				switch (idx) {
					case 1:
						segs.push([lx, ly, tx, ty]);
						break;
					case 2:
						segs.push([tx, ty, rx, ry]);
						break;
					case 3:
						segs.push([lx, ly, rx, ry]);
						break;
					case 4:
						segs.push([rx, ry, bx, by]);
						break;
					case 5: {
						const center = (a + b + c + d) / 4;
						if (center >= 0.5) {
							segs.push([tx, ty, rx, ry]);
							segs.push([lx, ly, bx, by]);
						} else {
							segs.push([lx, ly, tx, ty]);
							segs.push([rx, ry, bx, by]);
						}
						break;
					}
					case 6:
						segs.push([tx, ty, bx, by]);
						break;
					case 7:
						segs.push([lx, ly, bx, by]);
						break;
					case 8:
						segs.push([bx, by, lx, ly]);
						break;
					case 9:
						segs.push([bx, by, tx, ty]);
						break;
					case 10: {
						const center = (a + b + c + d) / 4;
						if (center >= 0.5) {
							segs.push([lx, ly, tx, ty]);
							segs.push([rx, ry, bx, by]);
						} else {
							segs.push([tx, ty, rx, ry]);
							segs.push([lx, ly, bx, by]);
						}
						break;
					}
					case 11:
						segs.push([bx, by, rx, ry]);
						break;
					case 12:
						segs.push([rx, ry, lx, ly]);
						break;
					case 13:
						segs.push([rx, ry, tx, ty]);
						break;
					case 14:
						segs.push([tx, ty, lx, ly]);
						break;
					default:
						break;
				}
			}
		}
		return segs;
	}

	function stitchSegmentsToPolylines(segs) {
		/** @type {Map<string, Array<{i:number, a:boolean}>>} */
		const map = new Map();
		const key = (x2, y2) => `${x2},${y2}`;
		for (let i = 0; i < segs.length; i++) {
			const [x1, y1, x2, y2] = segs[i];
			const k1 = key(x1, y1);
			const k2 = key(x2, y2);
			if (!map.has(k1)) map.set(k1, []);
			if (!map.has(k2)) map.set(k2, []);
			map.get(k1).push({ i, a: true });
			map.get(k2).push({ i, a: false });
		}

		const used = new Uint8Array(segs.length);
		/** @type {Array<Array<[number,number]>>} */
		const polys = [];

		for (let i = 0; i < segs.length; i++) {
			if (used[i]) continue;
			used[i] = 1;
			const [sx1, sy1, sx2, sy2] = segs[i];
			/** @type {Array<[number,number]>} */
			const pts = [[sx1, sy1], [sx2, sy2]];
			let endKey = key(sx2, sy2);
			let guard = 0;
			while (guard++ < 2_000_000) {
				const adj = map.get(endKey);
				if (!adj || adj.length === 0) break;
				let next = null;
				for (const ref of adj) {
					if (used[ref.i]) continue;
					next = ref;
					break;
				}
				if (!next) break;
				used[next.i] = 1;
				const [x1, y1, x2, y2] = segs[next.i];
				// If current endKey matches segment A endpoint, append B; else append A.
				if (key(x1, y1) === endKey) {
					pts.push([x2, y2]);
					endKey = key(x2, y2);
				} else {
					pts.push([x1, y1]);
					endKey = key(x1, y1);
				}
				// Closed loop.
				if (endKey === key(pts[0][0], pts[0][1])) break;
			}

			if (pts.length >= 3) polys.push(pts);
		}

		return polys;
	}

	function rdpSimplify(points, epsilon) {
		const eps = Math.max(0, Number(epsilon) || 0);
		if (eps <= 0 || points.length < 4) return points;

		const sq = (n) => n * n;
		const dist2ToSegment = (p, a, b) => {
			const px = p[0], py = p[1];
			const ax = a[0], ay = a[1];
			const bx = b[0], by = b[1];
			const dx = bx - ax;
			const dy = by - ay;
			if (dx === 0 && dy === 0) return sq(px - ax) + sq(py - ay);
			const t = ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy);
			const tt = clamp(t, 0, 1);
			const cx = ax + tt * dx;
			const cy = ay + tt * dy;
			return sq(px - cx) + sq(py - cy);
		};

		const eps2 = eps * eps;
		/** @type {boolean[]} */
		const keep = new Array(points.length).fill(false);
		keep[0] = true;
		keep[points.length - 1] = true;
		/** @type {Array<[number, number]>} */
		const stack = [[0, points.length - 1]];
		while (stack.length) {
			const [s, e] = stack.pop();
			let maxD = -1;
			let idx = -1;
			for (let i = s + 1; i < e; i++) {
				const d2 = dist2ToSegment(points[i], points[s], points[e]);
				if (d2 > maxD) {
					maxD = d2;
					idx = i;
				}
			}
			if (idx !== -1 && maxD > eps2) {
				keep[idx] = true;
				stack.push([s, idx]);
				stack.push([idx, e]);
			}
		}
		/** @type {Array<any>} */
		const out = [];
		for (let i = 0; i < points.length; i++) if (keep[i]) out.push(points[i]);
		return out;
	}

	function rgbToHex(r, g, b) {
		const to2 = (n) => n.toString(16).padStart(2, "0");
		return `#${to2(clampInt(r, 0, 255))}${to2(clampInt(g, 0, 255))}${to2(clampInt(b, 0, 255))}`;
	}

	function hexToRgb(hex) {
		const s = String(hex || "").trim();
		if (!/^#?[0-9a-fA-F]{6}$/.test(s)) return { r: 17, g: 17, b: 17 };
		const t = s.startsWith("#") ? s.slice(1) : s;
		return {
			r: parseInt(t.slice(0, 2), 16),
			g: parseInt(t.slice(2, 4), 16),
			b: parseInt(t.slice(4, 6), 16),
		};
	}

	function loadScriptOnce(src) {
		return new Promise((resolve, reject) => {
			if (document.querySelector(`script[data-vt-src="${src}"]`)) {
				resolve();
				return;
			}
			const s = document.createElement("script");
			s.src = src;
			s.async = true;
			s.defer = true;
			s.dataset.vtSrc = src;
			s.onload = () => resolve();
			s.onerror = () => reject(new Error(`Failed to load ${src}`));
			document.head.appendChild(s);
		});
	}

	async function ensureOpenCvLoaded() {
		// Optional: if tools/vector-trace/opencv.js exists, use it.
		if (globalThis.cv && typeof globalThis.cv.Mat === "function") return true;
		try {
			await loadScriptOnce("./opencv.js");
			return !!(globalThis.cv && typeof globalThis.cv.Mat === "function");
		} catch (_) {
			return false;
		}
	}

	function sobelEdges(imageData) {
		// Returns { mag: Uint16Array, w, h }, mag in [0..~1448]
		const w = imageData.width;
		const h = imageData.height;
		const d = imageData.data;
		const gray = new Uint8Array(w * h);
		for (let p = 0, i = 0; p < gray.length; p++, i += 4) {
			const a = d[i + 3];
			if (a === 0) {
				gray[p] = 255;
				continue;
			}
			gray[p] = clampInt(0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2], 0, 255);
		}

		const mag = new Uint16Array(w * h);
		const at = (x, y) => gray[y * w + x];
		for (let y = 1; y < h - 1; y++) {
			for (let x = 1; x < w - 1; x++) {
				// Sobel kernels
				const tl = at(x - 1, y - 1), tc = at(x, y - 1), tr = at(x + 1, y - 1);
				const ml = at(x - 1, y), mr = at(x + 1, y);
				const bl = at(x - 1, y + 1), bc = at(x, y + 1), br = at(x + 1, y + 1);
				const gx = (tr + 2 * mr + br) - (tl + 2 * ml + bl);
				const gy = (bl + 2 * bc + br) - (tl + 2 * tc + tr);
				mag[y * w + x] = Math.min(2047, Math.abs(gx) + Math.abs(gy));
			}
		}
		return { mag, w, h };
	}

	function hysteresisThreshold(mag, w, h, low, high) {
		// mag is Uint16Array; thresholds are mapped from 0..255 into mag space.
		const strong = (high / 255) * 1024;
		const weak = (low / 255) * 1024;
		const out = new Uint8Array(w * h);
		/** @type {number[]} */
		const stack = [];
		for (let i = 0; i < mag.length; i++) {
			if (mag[i] >= strong) {
				out[i] = 2;
				stack.push(i);
			} else if (mag[i] >= weak) {
				out[i] = 1;
			}
		}

		// Promote weak edges connected to strong ones.
		while (stack.length) {
			const idx = stack.pop();
			const x = idx % w;
			const y = (idx - x) / w;
			for (let dy = -1; dy <= 1; dy++) {
				for (let dx = -1; dx <= 1; dx++) {
					if (dx === 0 && dy === 0) continue;
					const nx = x + dx;
					const ny = y + dy;
					if (nx <= 0 || ny <= 0 || nx >= w - 1 || ny >= h - 1) continue;
					const ni = ny * w + nx;
					if (out[ni] === 1) {
						out[ni] = 2;
						stack.push(ni);
					}
				}
			}
		}

		// Final mask: only strong/promoted.
		for (let i = 0; i < out.length; i++) out[i] = out[i] === 2 ? 1 : 0;
		return out;
	}

	function traceEdgeMaskToPolylines(mask, w, h) {
		// Simple contour extraction: connect 8-neighbor edge pixels into polylines.
		const visited = new Uint8Array(mask.length);
		const neighbors = [
			[-1, -1], [0, -1], [1, -1],
			[-1, 0], /*0,0*/ [1, 0],
			[-1, 1], [0, 1], [1, 1],
		];
		const inBounds = (x, y) => x > 0 && y > 0 && x < w - 1 && y < h - 1;
		const idxOf = (x, y) => y * w + x;

		/** @type {Array<Array<[number,number]>>} */
		const polys = [];
		for (let y = 1; y < h - 1; y++) {
			for (let x = 1; x < w - 1; x++) {
				const start = idxOf(x, y);
				if (!mask[start] || visited[start]) continue;
				/** @type {Array<[number,number]>} */
				const pts = [];
				let cx = x;
				let cy = y;
				let guard = 0;
				while (guard++ < 200_000) {
					const i = idxOf(cx, cy);
					if (visited[i]) break;
					visited[i] = 1;
					pts.push([cx, cy]);
					let moved = false;
					for (const [dx, dy] of neighbors) {
						const nx = cx + dx;
						const ny = cy + dy;
						if (!inBounds(nx, ny)) continue;
						const ni = idxOf(nx, ny);
						if (mask[ni] && !visited[ni]) {
							cx = nx;
							cy = ny;
							moved = true;
							break;
						}
					}
					if (!moved) break;
				}
				if (pts.length >= 6) polys.push(pts);
			}
		}
		return polys;
	}

	function kMeansQuantize(imageData, k, maxSamples, iters) {
		// Deterministic k-means over a sampled subset.
		const w = imageData.width;
		const h = imageData.height;
		const d = imageData.data;
		const KK = clampInt(k, 2, 32);
		const samples = [];
		const step = Math.max(1, Math.floor(Math.sqrt((w * h) / Math.max(1, maxSamples))));
		for (let y = 0; y < h; y += step) {
			for (let x = 0; x < w; x += step) {
				const i = (y * w + x) * 4;
				const a = d[i + 3];
				if (a === 0) continue;
				samples.push([d[i], d[i + 1], d[i + 2]]);
				if (samples.length >= maxSamples) break;
			}
			if (samples.length >= maxSamples) break;
		}
		if (samples.length === 0) {
			return {
				centers: new Array(KK).fill(0).map(() => [255, 255, 255]),
			};
		}

		// Init centers: evenly spaced picks from samples.
		/** @type {Array<[number,number,number]>} */
		const centers = [];
		for (let i = 0; i < KK; i++) {
			const idx = Math.floor((i * (samples.length - 1)) / Math.max(1, KK - 1));
			centers.push([samples[idx][0], samples[idx][1], samples[idx][2]]);
		}

		const dist2 = (a, b) => {
			const dr = a[0] - b[0];
			const dg = a[1] - b[1];
			const db = a[2] - b[2];
			return dr * dr + dg * dg + db * db;
		};

		const iterations = clampInt(iters, 1, 20);
		for (let it = 0; it < iterations; it++) {
			const sums = new Array(KK).fill(0).map(() => [0, 0, 0, 0]);
			for (const s of samples) {
				let best = 0;
				let bestD = Infinity;
				for (let ci = 0; ci < KK; ci++) {
					const d2v = dist2(s, centers[ci]);
					if (d2v < bestD) {
						bestD = d2v;
						best = ci;
					}
				}
				sums[best][0] += s[0];
				sums[best][1] += s[1];
				sums[best][2] += s[2];
				sums[best][3] += 1;
			}
			let moved = 0;
			for (let ci = 0; ci < KK; ci++) {
				const n = sums[ci][3];
				if (n === 0) continue;
				const nr = sums[ci][0] / n;
				const ng = sums[ci][1] / n;
				const nb = sums[ci][2] / n;
				const prev = centers[ci];
				const delta = Math.abs(prev[0] - nr) + Math.abs(prev[1] - ng) + Math.abs(prev[2] - nb);
				if (delta > 0.5) moved++;
				centers[ci] = [nr, ng, nb];
			}
			if (moved === 0) break;
		}

		return { centers };
	}

	function assignLabels(imageData, centers) {
		const w = imageData.width;
		const h = imageData.height;
		const d = imageData.data;
		const labels = new Uint16Array(w * h);
		const counts = new Uint32Array(centers.length);
		const dist2 = (r, g, b, c) => {
			const dr = r - c[0];
			const dg = g - c[1];
			const db = b - c[2];
			return dr * dr + dg * dg + db * db;
		};

		for (let i = 0, p = 0; i < d.length; i += 4, p++) {
			const a = d[i + 3];
			if (a === 0) {
				labels[p] = 0;
				continue;
			}
			const r = d[i], g = d[i + 1], b = d[i + 2];
			let best = 0;
			let bestD = Infinity;
			for (let ci = 0; ci < centers.length; ci++) {
				const dd = dist2(r, g, b, centers[ci]);
				if (dd < bestD) {
					bestD = dd;
					best = ci;
				}
			}
			labels[p] = best;
			counts[best]++;
		}

		// Background = most frequent label.
		let bg = 0;
		let max = -1;
		for (let i = 0; i < counts.length; i++) {
			if (counts[i] > max) {
				max = counts[i];
				bg = i;
			}
		}
		return { labels, counts, bg };
	}

	function relabelSmallComponents(labels, w, h, bgLabel, minArea) {
		const minA = clampInt(minArea, 0, 1_000_000);
		if (minA <= 1) return;
		const visited = new Uint8Array(labels.length);
		/** @type {number[]} */
		const stack = [];
		/** @type {number[]} */
		const component = [];

		const push = (idx) => {
			visited[idx] = 1;
			stack.push(idx);
		};

		for (let i = 0; i < labels.length; i++) {
			if (visited[i]) continue;
			const lab = labels[i];
			if (lab === bgLabel) {
				visited[i] = 1;
				continue;
			}
			component.length = 0;
			stack.length = 0;
			push(i);
			while (stack.length) {
				const idx = stack.pop();
				component.push(idx);
				const x = idx % w;
				const y = (idx - x) / w;
				if (x > 0) {
					const j = idx - 1;
					if (!visited[j] && labels[j] === lab) push(j);
				}
				if (x + 1 < w) {
					const j = idx + 1;
					if (!visited[j] && labels[j] === lab) push(j);
				}
				if (y > 0) {
					const j = idx - w;
					if (!visited[j] && labels[j] === lab) push(j);
				}
				if (y + 1 < h) {
					const j = idx + w;
					if (!visited[j] && labels[j] === lab) push(j);
				}
			}
			if (component.length > 0 && component.length < minA) {
				for (const idx of component) labels[idx] = bgLabel;
			}
		}
	}

	/**
	 * @typedef {{
	 *  id: string,
	 *  label: string,
	 *  params: Array<{ id: string, label: string, type: 'range'|'checkbox'|'select'|'number'|'color', min?: number, max?: number, step?: number, options?: Array<{value:string,label:string}>, default: any }>,
	 *  trace: (imageData: ImageData, params: Record<string, any>, ctx: { w: number, h: number, pngDataUrl: string }) => { svg: string, metrics?: Record<string, any> },
	 * }} TraceEngine
	 */

	/** @type {Record<string, TraceEngine>} */
	const ENGINES = {
		"raster-wrapper": {
			id: "raster-wrapper",
			label: "Raster wrapper (baseline)",
			params: [
				{
					id: "background",
					label: "Background",
					type: "select",
					default: "transparent",
					options: [
						{ value: "transparent", label: "Transparent" },
						{ value: "#ffffff", label: "White" },
					],
				},
				{
					id: "preserveAspectRatio",
					label: "Preserve aspect",
					type: "select",
					default: "none",
					options: [
						{ value: "none", label: "Stretch (none)" },
						{ value: "xMidYMid meet", label: "Contain (meet)" },
						{ value: "xMidYMid slice", label: "Cover (slice)" },
					],
				},
			],
			trace: (_imageData, params, ctx) => {
				const background = typeof params.background === "string" ? params.background : "transparent";
				const par = typeof params.preserveAspectRatio === "string" ? params.preserveAspectRatio : "none";
				if (!ctx.pngDataUrl) {
					const svg =
						`<svg xmlns="http://www.w3.org/2000/svg" width="${ctx.w}" height="${ctx.h}" viewBox="0 0 ${ctx.w} ${ctx.h}">\n` +
						`  <rect width="100%" height="100%" fill="#fff"/>\n` +
						`</svg>`;
					return { svg, metrics: { paths: 0 } };
				}
				return { svg: buildRasterWrapperSvg(ctx.pngDataUrl, ctx.w, ctx.h, par, background), metrics: { paths: 0 } };
			},
		},
		potrace: {
			id: "potrace",
			label: "Potrace (high-contrast)",
			params: [
				{ id: "threshold", label: "Threshold", type: "range", min: 0, max: 255, step: 1, default: 128 },
				{ id: "autoOtsu", label: "Auto threshold (Otsu)", type: "checkbox", default: false },
				{ id: "invert", label: "Invert", type: "checkbox", default: false },
				{ id: "speckle", label: "Speckle removal (min area)", type: "range", min: 0, max: 500, step: 1, default: 10 },
				{ id: "simplify", label: "Path fitting", type: "range", min: 0, max: 6, step: 0.25, default: 1.0 },
				{ id: "strokeMode", label: "Stroke mode", type: "checkbox", default: false },
				{ id: "fill", label: "Fill / Stroke", type: "color", default: "#111111" },
				{ id: "strokeWidth", label: "Stroke width", type: "range", min: 1, max: 24, step: 1, default: 6 },
			],
			trace: (imageData, params, ctx) => {
				const autoOtsu = !!params.autoOtsu;
				const inv = !!params.invert;
				const speckle = clampInt(Number(params.speckle ?? 10), 0, 500);
				const simplify = Math.max(0, Number(params.simplify ?? 1.0));
				const strokeMode = !!params.strokeMode;
				const fill = typeof params.fill === "string" ? params.fill : "#111111";
				const strokeWidth = clampInt(Number(params.strokeWidth ?? 6), 1, 24);

				const thr = autoOtsu
					? otsuThresholdFromImageData(imageData)
					: clampInt(Number(params.threshold ?? 128), 0, 255);

				const w = imageData.width;
				const h = imageData.height;
				let mask = buildBinaryMask(imageData, thr, inv);
				if (speckle > 1) removeSpecklesInPlace(mask, w, h, speckle);
				const segs = marchingSquaresSegments(mask, w, h);
				const polys2 = stitchSegmentsToPolylines(segs);

				let paths = 0;
				let d = "";
				for (const poly of polys2) {
					/** @type {Array<[number,number]>} */
					const pts = poly.map(([x2, y2]) => [x2 / 2, y2 / 2]);
					const closed =
						pts.length > 2 && pts[0][0] === pts[pts.length - 1][0] && pts[0][1] === pts[pts.length - 1][1];
					let working = pts;
					if (closed) working = pts.slice(0, -1);
					working = rdpSimplify(working, simplify);
					if (working.length < 3) continue;
					paths++;
					d += `M ${working[0][0].toFixed(2)} ${working[0][1].toFixed(2)}`;
					for (let i = 1; i < working.length; i++) d += ` L ${working[i][0].toFixed(2)} ${working[i][1].toFixed(2)}`;
					d += " Z\n";
				}

				const paint = strokeMode
					? `fill="none" stroke="${fill}" stroke-width="${strokeWidth}" stroke-linejoin="round" stroke-linecap="round"`
					: `fill="${fill}"`;

				const svg =
					`<svg xmlns="http://www.w3.org/2000/svg" width="${ctx.w}" height="${ctx.h}" viewBox="0 0 ${ctx.w} ${ctx.h}">\n` +
					`  <path ${paint} d="${d.trim()}"/>\n` +
					`</svg>`;
				return { svg, metrics: { paths } };
			},
		},
		imagetracer: {
			id: "imagetracer",
			label: "ImageTracer (multi-color)",
			params: [
				{ id: "colors", label: "Colors", type: "range", min: 2, max: 16, step: 1, default: 6 },
				{ id: "noise", label: "Noise filter (min area)", type: "range", min: 0, max: 500, step: 1, default: 10 },
				{ id: "simplify", label: "Path fitting", type: "range", min: 0, max: 6, step: 0.25, default: 1.0 },
				{ id: "strokeMode", label: "Stroke mode", type: "checkbox", default: false },
				{ id: "strokeWidth", label: "Stroke width", type: "range", min: 1, max: 12, step: 1, default: 3 },
			],
			trace: (imageData, params, ctx) => {
				const k = clampInt(Number(params.colors ?? 6), 2, 16);
				const noise = clampInt(Number(params.noise ?? 10), 0, 500);
				const simplify = Math.max(0, Number(params.simplify ?? 1.0));
				const strokeMode = !!params.strokeMode;
				const strokeWidth = clampInt(Number(params.strokeWidth ?? 3), 1, 12);

				// Quantize
				const { centers } = kMeansQuantize(imageData, k, 50_000, 8);
				const { labels, bg } = assignLabels(imageData, centers);
				relabelSmallComponents(labels, ctx.w, ctx.h, bg, noise);

				// Trace each label (skip background)
				let svgPaths = "";
				let totalPaths = 0;
				/** @type {Array<{ color: string, paths: number }>} */
				const palette = [];

				const mask = new Uint8Array(ctx.w * ctx.h);
				for (let li = 0; li < centers.length; li++) {
					if (li === bg) continue;
					mask.fill(0);
					for (let p = 0; p < labels.length; p++) mask[p] = labels[p] === li ? 1 : 0;
					// cheap skip if very sparse
					let onCount = 0;
					for (let p = 0; p < mask.length; p++) onCount += mask[p];
					if (onCount < Math.max(8, noise)) continue;

					const segs = marchingSquaresSegments(mask, ctx.w, ctx.h);
					const polys2 = stitchSegmentsToPolylines(segs);
					let d = "";
					let paths = 0;
					for (const poly of polys2) {
						const pts = poly.map(([x2, y2]) => [x2 / 2, y2 / 2]);
						const closed = pts.length > 2 && pts[0][0] === pts[pts.length - 1][0] && pts[0][1] === pts[pts.length - 1][1];
						let working = pts;
						if (closed) working = pts.slice(0, -1);
						working = rdpSimplify(working, simplify);
						if (working.length < 3) continue;
						paths++;
						d += `M ${working[0][0].toFixed(2)} ${working[0][1].toFixed(2)}`;
						for (let i = 1; i < working.length; i++) {
							d += ` L ${working[i][0].toFixed(2)} ${working[i][1].toFixed(2)}`;
						}
						d += " Z\n";
					}
					if (!d) continue;

					const c = centers[li];
					const color = rgbToHex(c[0], c[1], c[2]);
					palette.push({ color, paths });
					totalPaths += paths;

					const paint = strokeMode
						? `fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linejoin="round" stroke-linecap="round"`
						: `fill="${color}"`;
					svgPaths += `  <path ${paint} d="${d.trim()}"/>\n`;
				}

				const svg =
					`<svg xmlns="http://www.w3.org/2000/svg" width="${ctx.w}" height="${ctx.h}" viewBox="0 0 ${ctx.w} ${ctx.h}">\n` +
					svgPaths +
					`</svg>`;
				return { svg, metrics: { paths: totalPaths, palette } };
			},
		},
		"opencv-contours": {
			id: "opencv-contours",
			label: "OpenCV contours (edge-based)",
			params: [
				{ id: "blur", label: "Blur kernel", type: "range", min: 0, max: 6, step: 1, default: 1 },
				{ id: "low", label: "Canny low", type: "range", min: 0, max: 255, step: 1, default: 60 },
				{ id: "high", label: "Canny high", type: "range", min: 0, max: 255, step: 1, default: 140 },
				{
					id: "mode",
					label: "Contour mode",
					type: "select",
					default: "external",
					options: [
						{ value: "external", label: "External" },
						{ value: "all", label: "All" },
					],
				},
				{ id: "epsilon", label: "Approx epsilon", type: "range", min: 0, max: 6, step: 0.25, default: 1.0 },
				{ id: "stroke", label: "Stroke", type: "color", default: "#111111" },
				{ id: "strokeWidth", label: "Stroke width", type: "range", min: 1, max: 12, step: 1, default: 3 },
			],
			trace: (imageData, params, ctx) => {
				const blur = clampInt(Number(params.blur ?? 1), 0, 6);
				let low = clampInt(Number(params.low ?? 60), 0, 255);
				let high = clampInt(Number(params.high ?? 140), 0, 255);
				if (high < low) [low, high] = [high, low];
				const mode = String(params.mode || "external");
				const eps = Math.max(0, Number(params.epsilon ?? 1.0));
				const stroke = typeof params.stroke === "string" ? params.stroke : "#111111";
				const strokeWidth = clampInt(Number(params.strokeWidth ?? 3), 1, 12);

				// Prefer OpenCV.js if present.
				const cv = globalThis.cv;
				if (cv && typeof cv.Mat === "function" && typeof cv.Canny === "function") {
					try {
						const src = cv.matFromImageData(imageData);
						const gray = new cv.Mat();
						cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
						if (blur > 0) {
							const k = blur * 2 + 1;
							const ksize = new cv.Size(k, k);
							cv.GaussianBlur(gray, gray, ksize, 0, 0, cv.BORDER_DEFAULT);
						}
						const edges = new cv.Mat();
						cv.Canny(gray, edges, low, high);
						const contours = new cv.MatVector();
						const hierarchy = new cv.Mat();
						const modeFlag = mode === "all" ? cv.RETR_LIST : cv.RETR_EXTERNAL;
						cv.findContours(edges, contours, hierarchy, modeFlag, cv.CHAIN_APPROX_NONE);
						let d = "";
						let paths = 0;
						for (let i = 0; i < contours.size(); i++) {
							const c = contours.get(i);
							if (c.rows < 6) {
								c.delete();
								continue;
							}
							/** @type {Array<[number,number]>} */
							const pts = [];
							for (let j = 0; j < c.rows; j++) {
								const x = c.intPtr(j, 0)[0];
								const y = c.intPtr(j, 0)[1];
								pts.push([x, y]);
							}
							c.delete();
							const simp = rdpSimplify(pts, eps);
							if (simp.length < 3) continue;
							paths++;
							d += `M ${simp[0][0].toFixed(2)} ${simp[0][1].toFixed(2)}`;
							for (let k = 1; k < simp.length; k++) d += ` L ${simp[k][0].toFixed(2)} ${simp[k][1].toFixed(2)}`;
							d += " Z\n";
						}
						src.delete();
						gray.delete();
						edges.delete();
						contours.delete();
						hierarchy.delete();
						const svg =
							`<svg xmlns="http://www.w3.org/2000/svg" width="${ctx.w}" height="${ctx.h}" viewBox="0 0 ${ctx.w} ${ctx.h}">\n` +
							`  <path fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round" stroke-linecap="round" d="${d.trim()}"/>\n` +
							`</svg>`;
						return { svg, metrics: { paths, usedOpenCv: true } };
					} catch (_) {
						// Fall back to JS implementation.
					}
				}

				// JS fallback: Sobel + hysteresis + pixel-chain contours.
				let work = imageData;
				if (blur > 0) {
					const tmp = new ImageData(new Uint8ClampedArray(imageData.data), imageData.width, imageData.height);
					boxBlurSeparable(tmp.data, tmp.width, tmp.height, blur);
					work = tmp;
				}
				const { mag } = sobelEdges(work);
				const edgeMask = hysteresisThreshold(mag, ctx.w, ctx.h, low, high);
				let polylines = traceEdgeMaskToPolylines(edgeMask, ctx.w, ctx.h);
				if (mode === "external") {
					// Heuristic external-only: drop small interior polylines.
					const minLen = Math.max(20, Math.floor(Math.min(ctx.w, ctx.h) * 0.04));
					polylines = polylines.filter((p) => p.length >= minLen);
				}

				let d = "";
				let paths = 0;
				for (const pts of polylines) {
					const simp = rdpSimplify(pts, eps);
					if (simp.length < 3) continue;
					paths++;
					d += `M ${simp[0][0].toFixed(2)} ${simp[0][1].toFixed(2)}`;
					for (let i = 1; i < simp.length; i++) d += ` L ${simp[i][0].toFixed(2)} ${simp[i][1].toFixed(2)}`;
					d += "\n";
				}

				const svg =
					`<svg xmlns="http://www.w3.org/2000/svg" width="${ctx.w}" height="${ctx.h}" viewBox="0 0 ${ctx.w} ${ctx.h}">\n` +
					`  <path fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round" stroke-linecap="round" d="${d.trim()}"/>\n` +
					`</svg>`;
				return { svg, metrics: { paths, usedOpenCv: false } };
			},
		},
	};

	class VectorTraceApp {
		/** @param {{ root: HTMLElement }} opts */
		constructor(opts) {
			this.root = opts.root;
			/** @type {Record<string, any>} */
			this.els = {
				fileInput: document.getElementById("vtFileInput"),
				chooseBtn: document.getElementById("vtChooseBtn"),
				pasteBtn: document.getElementById("vtPasteBtn"),
				resetBtn: document.getElementById("vtResetBtn"),
				rebuildBtn: document.getElementById("vtRebuildBtn"),
				dropZone: document.getElementById("vtDropZone"),
				status: document.getElementById("vtStatus"),
				meta: document.getElementById("vtMeta"),
				maxDim: document.getElementById("vtMaxDim"),
				grayscale: document.getElementById("vtGrayscale"),
				invert: document.getElementById("vtInvert"),
				contrast: document.getElementById("vtContrast"),
				contrastValue: document.getElementById("vtContrastValue"),
				blur: document.getElementById("vtBlur"),
				blurValue: document.getElementById("vtBlurValue"),
				overlay: document.getElementById("vtOverlay"),
				overlayValue: document.getElementById("vtOverlayValue"),
				compareShow: document.getElementById("vtCompareShow"),
				compareOpacity: document.getElementById("vtCompareOpacity"),
				compareOpacityValue: document.getElementById("vtCompareOpacityValue"),
				compareFitBtn: document.getElementById("vtCompareFitBtn"),
				compare100Btn: document.getElementById("vtCompare100Btn"),
				compareViewport: document.getElementById("vtCompareViewport"),
				compareScene: document.getElementById("vtCompareScene"),
				compareCanvas: document.getElementById("vtCompareCanvas"),
				compareSvg: document.getElementById("vtCompareSvg"),
				compareEmpty: document.getElementById("vtCompareEmpty"),
				engine: document.getElementById("vtEngine"),
				engineParams: document.getElementById("vtEngineParams"),
				canvasOriginal: document.getElementById("vtCanvasOriginal"),
				canvasProcessed: document.getElementById("vtCanvasProcessed"),
				placeholder: document.getElementById("vtPlaceholder"),
				svgPreview: document.getElementById("vtSvgPreview"),
				svgText: document.getElementById("vtSvgText"),
				svgMeta: document.getElementById("vtSvgMeta"),
				metricEngine: document.getElementById("vtMetricEngine"),
				metricDuration: document.getElementById("vtMetricDuration"),
				metricPaths: document.getElementById("vtMetricPaths"),
				metricBytes: document.getElementById("vtMetricBytes"),
				paletteLegend: document.getElementById("vtPaletteLegend"),
				useWorker: document.getElementById("vtUseWorker"),
				workerHint: document.getElementById("vtWorkerHint"),
				copySvgBtn: document.getElementById("vtCopySvgBtn"),
				downloadSvgBtn: document.getElementById("vtDownloadSvgBtn"),
				copyDataUrlBtn: document.getElementById("vtCopyDataUrlBtn"),
				downloadPngBtn: document.getElementById("vtDownloadPngBtn"),
				downloadBundleBtn: document.getElementById("vtDownloadBundleBtn"),
				copyBundleBtn: document.getElementById("vtCopyBundleBtn"),
				minify: document.getElementById("vtMinify"),
				decimals: document.getElementById("vtDecimals"),
				timeLoad: document.getElementById("vtTimeLoad"),
				timeNormalize: document.getElementById("vtTimeNormalize"),
				timePreprocess: document.getElementById("vtTimePreprocess"),
				timeSvg: document.getElementById("vtTimeSvg"),
				selfTestBtn: document.getElementById("vtSelfTestBtn"),
				selfTest: document.getElementById("vtSelfTest"),
				selfTestOut: document.getElementById("vtSelfTestOut"),
				testAsset: document.getElementById("vtTestAsset"),
				loadTestAssetBtn: document.getElementById("vtLoadTestAssetBtn"),
				errors: document.getElementById("vtErrors"),
				errorText: document.getElementById("vtErrorText"),
			};

			/** @type {{ image: HTMLImageElement | null, fileName: string, fileType: string, fileSize: number } } */
			this.source = { image: null, fileName: "", fileType: "", fileSize: 0 };
			/** @type {{ canvas: HTMLCanvasElement | null, imageData: ImageData | null, pngDataUrl: string, w: number, h: number } } */
			this.normalized = { canvas: null, imageData: null, pngDataUrl: "", w: 0, h: 0 };
			this.svgText = "";
			this.exportedSvgText = "";
			this.rebuildTimer = 0;
			this.runSeq = 0;
			this.worker = null;
			this.workerBusy = false;
			/** @type {Record<string, any>} */
			this.engineParams = {};
			this.exportOptions = {
				minify: true,
				decimals: 2,
			};
			this.lastTraceBundle = null;
			this.compare = {
				scale: 1,
				x: 0,
				y: 0,
				dragging: false,
				startX: 0,
				startY: 0,
				startPanX: 0,
				startPanY: 0,
			};

			this.onChoose = this.onChoose.bind(this);
			this.onFileChange = this.onFileChange.bind(this);
			this.onPasteClick = this.onPasteClick.bind(this);
			this.onPaste = this.onPaste.bind(this);
			this.onReset = this.onReset.bind(this);
			this.onDropOver = this.onDropOver.bind(this);
			this.onDropLeave = this.onDropLeave.bind(this);
			this.onDrop = this.onDrop.bind(this);
			this.onOverlay = this.onOverlay.bind(this);
			this.onMaxDim = this.onMaxDim.bind(this);
			this.onRebuild = this.onRebuild.bind(this);
			this.onPreprocess = this.onPreprocess.bind(this);
			this.onEngineChange = this.onEngineChange.bind(this);
			this.onCompareOpacity = this.onCompareOpacity.bind(this);
			this.onCompareShow = this.onCompareShow.bind(this);
			this.onCompareFit = this.onCompareFit.bind(this);
			this.onCompare100 = this.onCompare100.bind(this);
			this.onComparePointerDown = this.onComparePointerDown.bind(this);
			this.onComparePointerMove = this.onComparePointerMove.bind(this);
			this.onComparePointerUp = this.onComparePointerUp.bind(this);
			this.onCompareResize = this.onCompareResize.bind(this);
			this.onCopySvg = this.onCopySvg.bind(this);
			this.onDownloadSvg = this.onDownloadSvg.bind(this);
			this.onDownloadPng = this.onDownloadPng.bind(this);
			this.onCopyDataUrl = this.onCopyDataUrl.bind(this);
			this.onDownloadBundle = this.onDownloadBundle.bind(this);
			this.onCopyBundle = this.onCopyBundle.bind(this);
			this.onExportOptionChange = this.onExportOptionChange.bind(this);
			this.onSelfTest = this.onSelfTest.bind(this);
			this.onLoadTestAsset = this.onLoadTestAsset.bind(this);
		}

		init() {
			const e = this.els;
			if (!e.fileInput || !e.chooseBtn || !e.pasteBtn || !e.resetBtn || !e.dropZone || !e.maxDim || !e.overlay) {
				return;
			}

			// Worker availability hint (especially important on file:// where Workers are commonly blocked).
			const workerSupported = typeof window.Worker === "function";
			const isFileProtocol = String(window.location && window.location.protocol) === "file:";
			const workerUsable = workerSupported && !isFileProtocol;
			if (e.useWorker) {
				e.useWorker.disabled = !workerUsable;
				if (!workerUsable) e.useWorker.checked = false;
			}
			if (e.workerHint instanceof HTMLElement) {
				if (!workerSupported) {
					e.workerHint.style.display = "block";
					e.workerHint.innerHTML = "Web Workers are not available in this browser/context.";
				} else if (isFileProtocol) {
					e.workerHint.style.display = "block";
				} else {
					e.workerHint.style.display = "none";
				}
			}

			e.chooseBtn.addEventListener("click", this.onChoose);
			e.fileInput.addEventListener("change", this.onFileChange);
			e.pasteBtn.addEventListener("click", this.onPasteClick);
			e.resetBtn.addEventListener("click", this.onReset);
			window.addEventListener("paste", this.onPaste);

			e.dropZone.addEventListener("dragover", this.onDropOver);
			e.dropZone.addEventListener("dragleave", this.onDropLeave);
			e.dropZone.addEventListener("drop", this.onDrop);
			e.dropZone.addEventListener("click", this.onChoose);
			e.dropZone.addEventListener("keydown", (ev) => {
				if (ev.key === "Enter" || ev.key === " ") {
					ev.preventDefault();
					this.onChoose();
				}
			});

			e.overlay.addEventListener("input", this.onOverlay);
			e.maxDim.addEventListener("change", this.onMaxDim);
			if (e.engine) e.engine.addEventListener("change", this.onEngineChange);
			if (e.grayscale) e.grayscale.addEventListener("change", this.onPreprocess);
			if (e.invert) e.invert.addEventListener("change", this.onPreprocess);
			if (e.contrast) e.contrast.addEventListener("input", this.onPreprocess);
			if (e.blur) e.blur.addEventListener("input", this.onPreprocess);
			if (e.compareOpacity) e.compareOpacity.addEventListener("input", this.onCompareOpacity);
			if (e.compareShow) e.compareShow.addEventListener("change", this.onCompareShow);
			if (e.compareFitBtn) e.compareFitBtn.addEventListener("click", this.onCompareFit);
			if (e.compare100Btn) e.compare100Btn.addEventListener("click", this.onCompare100);
			if (e.compareViewport instanceof HTMLElement) {
				e.compareViewport.addEventListener("pointerdown", this.onComparePointerDown);
				window.addEventListener("pointermove", this.onComparePointerMove);
				window.addEventListener("pointerup", this.onComparePointerUp);
				window.addEventListener("pointercancel", this.onComparePointerUp);
				window.addEventListener("resize", this.onCompareResize);
			}
			if (e.rebuildBtn) e.rebuildBtn.addEventListener("click", this.onRebuild);
			if (e.copySvgBtn) e.copySvgBtn.addEventListener("click", this.onCopySvg);
			if (e.downloadSvgBtn) e.downloadSvgBtn.addEventListener("click", this.onDownloadSvg);
			if (e.copyDataUrlBtn) e.copyDataUrlBtn.addEventListener("click", this.onCopyDataUrl);
			if (e.downloadPngBtn) e.downloadPngBtn.addEventListener("click", this.onDownloadPng);
			if (e.downloadBundleBtn) e.downloadBundleBtn.addEventListener("click", this.onDownloadBundle);
			if (e.copyBundleBtn) e.copyBundleBtn.addEventListener("click", this.onCopyBundle);
			if (e.minify) e.minify.addEventListener("change", this.onExportOptionChange);
			if (e.decimals) e.decimals.addEventListener("input", this.onExportOptionChange);
			if (e.selfTestBtn) e.selfTestBtn.addEventListener("click", this.onSelfTest);
			if (e.loadTestAssetBtn) e.loadTestAssetBtn.addEventListener("click", this.onLoadTestAsset);
			if (e.testAsset) e.testAsset.addEventListener("change", () => {
				// Make it quick to demo: selecting an asset can be loaded with Enter via the Load button.
			});
			if (e.useWorker) e.useWorker.addEventListener("change", () => {
				// If a run is in flight in a worker, kill it and reschedule.
				if (this.workerBusy && this.worker) {
					try { this.worker.terminate(); } catch (_) { /* ignore */ }
					this.worker = null;
					this.workerBusy = false;
				}
				if (this.source.image) this.scheduleRebuild("all");
			});

			this.applyOverlay();
			this.applyCompareControls();
			this.applyPreprocessLabels();
			this.resetEngineParamsToDefaults();
			this.renderEngineParams();
			this.onExportOptionChange();
			if (e.selfTestOut) e.selfTestOut.textContent = "";
			this.clearAll();
		}

		getTestAssetUrl(assetId) {
			const id = String(assetId || "").trim();
			if (!id) return "";
			return new URL(`./test-assets/${id}.svg`, window.location.href).toString();
		}

		async onLoadTestAsset() {
			try {
				const e = this.els;
				const assetId = e.testAsset ? String(e.testAsset.value || "") : "";
				if (!assetId) {
					this.setStatus("Choose a test asset first.");
					return;
				}
				this.clearError();
				this.setStatus("Loading test asset…");
				const img = await loadImageFromUrl(this.getTestAssetUrl(assetId));
				this.source = {
					image: img,
					fileName: `${assetId}.svg`,
					fileType: "image/svg+xml",
					fileSize: 0,
				};
				this.runSeq += 1;
				await this.rebuild("all", this.runSeq);
				this.setStatus(`Loaded test asset: ${assetId}.`);
			} catch (err) {
				this.setError(err);
				this.setStatus(`Error: ${err instanceof Error ? err.message : String(err)}`);
			}
		}

		getDefaultParamsForEngine(engineId) {
			const engine = ENGINES[engineId] || ENGINES["raster-wrapper"];
			/** @type {Record<string, any>} */
			const out = {};
			for (const p of engine.params || []) {
				out[p.id] = p.default;
			}
			return out;
		}

		setSelfTestText(text, open) {
			if (this.els.selfTestOut) this.els.selfTestOut.textContent = String(text || "");
			if (this.els.selfTest instanceof HTMLDetailsElement) {
				this.els.selfTest.open = open !== false;
			}
		}

		async runOneSelfTest(engineId, assetUrl, assetLabel) {
			const engine = ENGINES[engineId] || ENGINES["raster-wrapper"];
			const params = this.getDefaultParamsForEngine(engineId);
			const preprocessParams = { grayscale: false, invert: false, contrast: 0, blur: 0 };

			const img = await loadImageFromUrl(assetUrl);
			const srcW = img.naturalWidth || img.width;
			const srcH = img.naturalHeight || img.height;
			const maxDim = 512;
			const scale = Math.min(1, maxDim / Math.max(srcW, srcH));
			const w = Math.max(1, Math.round(srcW * scale));
			const h = Math.max(1, Math.round(srcH * scale));

			const canvas = document.createElement("canvas");
			canvas.width = w;
			canvas.height = h;
			const ctx2d = canvas.getContext("2d", { willReadFrequently: true });
			if (!ctx2d) throw new Error("2D canvas not available.");
			ctx2d.clearRect(0, 0, w, h);
			ctx2d.drawImage(img, 0, 0, w, h);
			const original = ctx2d.getImageData(0, 0, w, h);

			const tP0 = performance.now();
			const processed = new ImageData(new Uint8ClampedArray(original.data), original.width, original.height);
			if (preprocessParams.grayscale) applyGrayscaleInPlace(processed.data);
			if (preprocessParams.contrast !== 0) applyContrastInPlace(processed.data, preprocessParams.contrast);
			if (preprocessParams.invert) applyInvertInPlace(processed.data);
			if (preprocessParams.blur > 0) boxBlurSeparable(processed.data, processed.width, processed.height, preprocessParams.blur);
			const tP1 = performance.now();

			const tT0 = performance.now();
			const pngDataUrl = canvas.toDataURL("image/png");
			const traceRes = engine.trace(processed, params, { w, h, pngDataUrl });
			const tT1 = performance.now();

			const svg = traceRes && traceRes.svg ? String(traceRes.svg) : "";
			const v = validateSvgText(svg);
			return {
				asset: assetLabel,
				engine: engineId,
				ok: v.ok,
				error: v.ok ? "" : v.error,
				metrics: {
					paths: countSvgPaths(svg),
					bytes: encodeSvgTextBytes(svg),
					preprocessMs: tP1 - tP0,
					traceMs: tT1 - tT0,
					outW: w,
					outH: h,
				},
			};
		}

		async onSelfTest() {
			const e = this.els;
			if (e.selfTestBtn) e.selfTestBtn.disabled = true;
			this.setSelfTestText("Running self-test…\n", true);

			const assets = [
				{ label: "logo", url: new URL("./test-assets/logo.svg", window.location.href).toString() },
				{ label: "handwriting", url: new URL("./test-assets/handwriting.svg", window.location.href).toString() },
				{ label: "flat-illustration", url: new URL("./test-assets/flat-illustration.svg", window.location.href).toString() },
				{ label: "photo-ish", url: new URL("./test-assets/photo-ish.svg", window.location.href).toString() },
			];
			const engineIds = Object.keys(ENGINES);

			let passed = 0;
			let failed = 0;
			/** @type {string[]} */
			const lines = [];
			lines.push(`Vector Trace self-test (${new Date().toISOString()})`);
			lines.push(`Assets: ${assets.map((a) => a.label).join(", ")}`);
			lines.push(`Engines: ${engineIds.join(", ")}`);
			lines.push("");

			try {
				for (const asset of assets) {
					lines.push(`== Asset: ${asset.label} ==`);
					for (const engineId of engineIds) {
						let row;
						try {
							const r = await this.runOneSelfTest(engineId, asset.url, asset.label);
							if (r.ok) {
								passed += 1;
								row = `PASS  ${engineId}  (${Math.round(r.metrics.preprocessMs)}ms preprocess, ${Math.round(r.metrics.traceMs)}ms trace, ${r.metrics.paths} paths, ${Math.round(r.metrics.bytes / 1024)}KB)`;
							} else {
								failed += 1;
								row = `FAIL  ${engineId}  (${String(r.error || "Unknown failure").slice(0, 220)})`;
							}
						} catch (err) {
							failed += 1;
							row = `FAIL  ${engineId}  (${err instanceof Error ? err.message : String(err)})`;
						}
						lines.push(row);
						this.setSelfTestText(lines.join("\n"), true);
					}
					lines.push("");
				}
			} finally {
				lines.push(`Summary: ${passed} passed, ${failed} failed.`);
				this.setSelfTestText(lines.join("\n"), true);
				if (e.selfTestBtn) e.selfTestBtn.disabled = false;
			}
		}

		getExportOptions() {
			const e = this.els;
			const minify = e.minify ? !!e.minify.checked : true;
			const decimals = e.decimals ? clampInt(Number(e.decimals.value), 0, 6) : 2;
			if (e.decimals) e.decimals.value = String(decimals);
			this.exportOptions.minify = minify;
			this.exportOptions.decimals = decimals;
			return { minify, decimals };
		}

		getExportSvgText() {
			if (!this.svgText) return "";
			const { minify, decimals } = this.getExportOptions();
			return minify ? minifySvgText(this.svgText, decimals) : this.svgText;
		}

		onExportOptionChange() {
			this.getExportOptions();
			if (!this.svgText) return;
			this.exportedSvgText = this.getExportSvgText();
			const bytes = encodeSvgTextBytes(this.exportedSvgText);
			if (this.els.metricBytes) this.els.metricBytes.textContent = `${Number(bytes).toLocaleString()} B`;
			if (this.els.svgText) this.els.svgText.value = this.exportedSvgText;
			if (this.els.svgPreview) this.els.svgPreview.srcdoc = svgToSandboxDoc(this.exportedSvgText);
			if (this.els.svgMeta && this.normalized.w && this.normalized.h) {
				this.els.svgMeta.textContent = `${this.normalized.w}×${this.normalized.h} · ${Math.round(bytes / 1024)} KB`;
			}
		}

		getEngineId() {
			const raw = this.els.engine ? String(this.els.engine.value || "raster-wrapper") : "raster-wrapper";
			return ENGINES[raw] ? raw : "raster-wrapper";
		}

		resetEngineParamsToDefaults() {
			const engine = ENGINES[this.getEngineId()] || ENGINES["raster-wrapper"];
			this.engineParams = {};
			for (const p of engine.params || []) {
				this.engineParams[p.id] = p.default;
			}
		}

		renderEngineParams() {
			const wrap = this.els.engineParams;
			if (!(wrap instanceof HTMLElement)) return;
			wrap.textContent = "";
			const engine = ENGINES[this.getEngineId()] || ENGINES["raster-wrapper"];
			if (!engine.params || engine.params.length === 0) return;

			for (const p of engine.params) {
				if (p.type === "checkbox") {
					const field = document.createElement("div");
					field.className = "field";
					const label = document.createElement("span");
					label.className = "label";
					label.textContent = p.label;
					field.appendChild(label);
					const t = document.createElement("label");
					t.className = "toggle";
					const input = document.createElement("input");
					input.type = "checkbox";
					input.checked = !!(this.engineParams[p.id] ?? p.default);
					input.addEventListener("change", () => {
						this.engineParams[p.id] = input.checked;
						this.scheduleRebuild("trace");
					});
					t.appendChild(input);
					const text = document.createElement("span");
					text.textContent = input.checked ? "Enabled" : "Disabled";
					input.addEventListener("change", () => {
						text.textContent = input.checked ? "Enabled" : "Disabled";
					});
					t.appendChild(text);
					field.appendChild(t);
					wrap.appendChild(field);
					continue;
				}

				const field = document.createElement("label");
				field.className = "field";
				const label = document.createElement("span");
				label.className = "label";
				label.textContent = p.label;
				field.appendChild(label);

				if (p.type === "color") {
					const input = document.createElement("input");
					input.className = "input";
					input.type = "color";
					input.value = String(this.engineParams[p.id] ?? p.default ?? "#111111");
					input.addEventListener("input", () => {
						this.engineParams[p.id] = input.value;
						this.scheduleRebuild("trace");
					});
					field.appendChild(input);
					wrap.appendChild(field);
					continue;
				}

				if (p.type === "select") {
					const select = document.createElement("select");
					select.className = "input";
					for (const opt of p.options || []) {
						const o = document.createElement("option");
						o.value = opt.value;
						o.textContent = opt.label;
						select.appendChild(o);
					}
					select.value = String(this.engineParams[p.id] ?? p.default);
					select.addEventListener("change", () => {
						this.engineParams[p.id] = select.value;
						this.scheduleRebuild("trace");
					});
					field.appendChild(select);
					wrap.appendChild(field);
					continue;
				}

				if (p.type === "number") {
					const input = document.createElement("input");
					input.className = "input";
					input.type = "number";
					if (typeof p.min === "number") input.min = String(p.min);
					if (typeof p.max === "number") input.max = String(p.max);
					if (typeof p.step === "number") input.step = String(p.step);
					input.value = String(this.engineParams[p.id] ?? p.default);
					input.addEventListener("input", () => {
						this.engineParams[p.id] = Number(input.value);
						this.scheduleRebuild("trace");
					});
					field.appendChild(input);
					wrap.appendChild(field);
					continue;
				}

				// range
				const row = document.createElement("div");
				row.className = "slider-row";
				const input = document.createElement("input");
				input.type = "range";
				if (typeof p.min === "number") input.min = String(p.min);
				if (typeof p.max === "number") input.max = String(p.max);
				if (typeof p.step === "number") input.step = String(p.step);
				input.value = String(this.engineParams[p.id] ?? p.default);
				const val = document.createElement("span");
				val.className = "value";
				val.textContent = String(input.value);
				const handler = () => {
					val.textContent = String(input.value);
					this.engineParams[p.id] = Number(input.value);
					this.scheduleRebuild("trace");
				};
				input.addEventListener("input", handler);
				input.addEventListener("change", handler);
				row.appendChild(input);
				row.appendChild(val);
				field.appendChild(row);
				wrap.appendChild(field);
			}
		}

		setMetrics({ engineLabel, durationMs, paths, bytes }) {
			if (this.els.metricEngine) this.els.metricEngine.textContent = engineLabel || "—";
			if (this.els.metricDuration) this.els.metricDuration.textContent = durationMs != null ? fmtMs(durationMs) : "—";
			if (this.els.metricPaths) this.els.metricPaths.textContent = paths != null ? String(paths) : "—";
			if (this.els.metricBytes) {
				const b = Number(bytes);
				this.els.metricBytes.textContent = Number.isFinite(b) ? `${b.toLocaleString()} B` : "—";
			}
		}

		renderPaletteLegend(palette) {
		const el = this.els.paletteLegend;
		if (!(el instanceof HTMLElement)) return;
		el.textContent = "";
		if (!Array.isArray(palette) || palette.length === 0) return;

		// Sort by path count desc
		const rows = palette.slice().sort((a, b) => (b.paths || 0) - (a.paths || 0));
		for (const row of rows) {
			const color = typeof row.color === "string" ? row.color : "#111111";
			const paths = Number(row.paths || 0);
			const div = document.createElement("div");
			div.className = "palette-row";
			const sw = document.createElement("span");
			sw.className = "swatch";
			sw.style.background = color;
			const code = document.createElement("code");
			code.textContent = color.toLowerCase();
			const cnt = document.createElement("span");
			cnt.textContent = `${paths} paths`;
			div.appendChild(sw);
			div.appendChild(code);
			div.appendChild(cnt);
			el.appendChild(div);
		}
	}

		setStatus(msg) {
			if (this.els.status) this.els.status.textContent = msg;
		}

		setError(err) {
			if (this.els.errors instanceof HTMLDetailsElement) {
				this.els.errors.open = true;
			}
			if (this.els.errorText) {
				this.els.errorText.textContent = err instanceof Error ? (err.stack || err.message) : String(err);
			}
		}

		clearError() {
			if (this.els.errors instanceof HTMLDetailsElement) {
				this.els.errors.open = false;
			}
			if (this.els.errorText) this.els.errorText.textContent = "";
		}

		setTiming(which, ms) {
			const map = {
				load: this.els.timeLoad,
				normalize: this.els.timeNormalize,
				preprocess: this.els.timePreprocess,
				svg: this.els.timeSvg,
			};
			const el = map[which];
			if (el) el.textContent = fmtMs(ms);
		}

		applyOverlay() {
			const val = this.els.overlay ? Number(this.els.overlay.value || 0) : 0;
			const pct = clamp(val, 0, 1);
			if (this.els.overlayValue) this.els.overlayValue.textContent = `${Math.round(pct * 100)}%`;
			if (this.els.canvasProcessed) this.els.canvasProcessed.style.opacity = String(pct);
		}

		applyCompareControls() {
			const show = this.els.compareShow ? !!this.els.compareShow.checked : true;
			const op = this.els.compareOpacity ? Number(this.els.compareOpacity.value || 70) : 70;
			const pct = clampInt(op, 0, 100);
			if (this.els.compareOpacityValue) this.els.compareOpacityValue.textContent = `${pct}%`;
			if (this.els.compareSvg instanceof HTMLElement) {
				this.els.compareSvg.style.opacity = String(pct / 100);
				this.els.compareSvg.style.display = show ? "block" : "none";
			}
		}

		setCompareTransform() {
			if (!(this.els.compareScene instanceof HTMLElement)) return;
			const s = this.compare.scale;
			this.els.compareScene.style.transform = `translate(${this.compare.x}px, ${this.compare.y}px) scale(${s})`;
		}

		compareFit() {
			if (!(this.els.compareViewport instanceof HTMLElement)) return;
			const w = this.normalized.w;
			const h = this.normalized.h;
			if (!w || !h) return;
			const rect = this.els.compareViewport.getBoundingClientRect();
			const scale = Math.min(rect.width / w, rect.height / h);
			this.compare.scale = clamp(scale, 0.05, 64);
			this.compare.x = (rect.width - w * this.compare.scale) / 2;
			this.compare.y = (rect.height - h * this.compare.scale) / 2;
			this.setCompareTransform();
		}

		compare100() {
			if (!(this.els.compareViewport instanceof HTMLElement)) return;
			const w = this.normalized.w;
			const h = this.normalized.h;
			if (!w || !h) return;
			const rect = this.els.compareViewport.getBoundingClientRect();
			this.compare.scale = 1;
			this.compare.x = (rect.width - w) / 2;
			this.compare.y = (rect.height - h) / 2;
			this.setCompareTransform();
		}

		updateCompare(processedImageData, svgText, w, h) {
			const canvas = this.els.compareCanvas;
			const svgLayer = this.els.compareSvg;
			if (!(canvas instanceof HTMLCanvasElement) || !(svgLayer instanceof HTMLElement)) return;

			canvas.width = w;
			canvas.height = h;
			const ctx = canvas.getContext("2d", { willReadFrequently: true });
			if (!ctx) return;
			ctx.putImageData(processedImageData, 0, 0);

			svgLayer.textContent = "";
			if (svgText) {
				try {
					const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");
					const svg = doc.documentElement;
					if (svg && svg.tagName && svg.tagName.toLowerCase() === "svg") {
						svg.setAttribute("width", String(w));
						svg.setAttribute("height", String(h));
						if (!svg.getAttribute("viewBox")) svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
						svgLayer.appendChild(document.importNode(svg, true));
					}
				} catch (_) {
					// ignore
				}
			}

			if (this.els.compareScene instanceof HTMLElement) {
				this.els.compareScene.style.width = `${w}px`;
				this.els.compareScene.style.height = `${h}px`;
			}
			if (this.els.compareEmpty instanceof HTMLElement) this.els.compareEmpty.style.display = "none";

			// Default: fit once on first render.
			if (!this.compare.dragging && this.compare.scale === 1 && this.compare.x === 0 && this.compare.y === 0) {
				this.compareFit();
			} else {
				this.setCompareTransform();
			}
			this.applyCompareControls();
		}

		applyPreprocessLabels() {
			const c = this.els.contrast ? Number(this.els.contrast.value || 0) : 0;
			const b = this.els.blur ? Number(this.els.blur.value || 0) : 0;
			if (this.els.contrastValue) this.els.contrastValue.textContent = String(clampInt(c, -100, 100));
			if (this.els.blurValue) this.els.blurValue.textContent = String(clampInt(b, 0, 64));
		}

		getPreprocessParams() {
			return {
				grayscale: this.els.grayscale ? !!this.els.grayscale.checked : false,
				invert: this.els.invert ? !!this.els.invert.checked : false,
				contrast: this.els.contrast ? clampInt(Number(this.els.contrast.value || 0), -100, 100) : 0,
				blur: this.els.blur ? clampInt(Number(this.els.blur.value || 0), 0, 8) : 0,
			};
		}

		scheduleRebuild(kind) {
			window.clearTimeout(this.rebuildTimer);
			this.runSeq += 1;
			const runId = this.runSeq;
			// Best-effort cancel worker work.
			if (this.workerBusy && this.worker) {
				try { this.worker.terminate(); } catch (_) { /* ignore */ }
				this.worker = null;
				this.workerBusy = false;
			}
			this.rebuildTimer = window.setTimeout(() => {
				this.rebuild(kind, runId).catch((err) => {
					// Ignore stale errors.
					if (runId !== this.runSeq) return;
					this.setError(err);
					this.setStatus(`Error: ${err instanceof Error ? err.message : String(err)}`);
				});
			}, 60);
		}

		async setImageFromFile(file) {
			this.clearError();
			this.setStatus("Loading image…");
			const t0 = performance.now();
			const img = await fileToImage(file);
			const t1 = performance.now();
			this.setTiming("load", t1 - t0);
			this.source = {
				image: img,
				fileName: file.name || "image",
				fileType: file.type || "",
				fileSize: file.size || 0,
			};
			this.runSeq += 1;
			await this.rebuild("all", this.runSeq);
		}

		getMaxDim() {
			const raw = this.els.maxDim ? Number(this.els.maxDim.value || 1024) : 1024;
			const capped = clampInt(raw, 64, 4096);
			if (this.els.maxDim && Number.isFinite(raw) && raw !== capped) {
				this.els.maxDim.value = String(capped);
				// Don't spam status if we're mid-run; this is a user-facing clamp.
				if (this.source.image) this.setStatus("Max dimension capped at 4096px.");
			}
			return capped;
		}

		shouldUseWorkerForEngine(engineId) {
			const enabled = this.els.useWorker ? !!this.els.useWorker.checked : false;
			if (!enabled) return false;
			if (!window.Worker) return false;
			// OpenCV engine stays on main thread.
			return engineId === "potrace" || engineId === "imagetracer";
		}

		ensureWorker() {
			if (this.worker) return this.worker;
			this.worker = new Worker("./worker.js");
			return this.worker;
		}

		traceViaWorker(runId, engineId, originalImageData, preprocessParams, engineParams, ctx) {
			const worker = this.ensureWorker();
			this.workerBusy = true;
			return new Promise((resolve, reject) => {
				const onMessage = (ev) => {
					const msg = ev.data || {};
					if (msg.runId !== runId) return;
					cleanup();
					this.workerBusy = false;
					if (!msg.ok) {
						reject(new Error(msg.error || "Worker failed."));
						return;
					}
					try {
						const buf = msg.processed && msg.processed.data;
						const width = msg.processed && msg.processed.width;
						const height = msg.processed && msg.processed.height;
						const processed = new ImageData(new Uint8ClampedArray(buf), width, height);
						resolve({ processed, svg: msg.svg, metrics: msg.metrics || null, timings: msg.timings || null });
					} catch (e) {
						reject(e);
					}
				};
				const onError = () => {
					cleanup();
					this.workerBusy = false;
					reject(new Error("Worker error."));
				};
				const cleanup = () => {
					worker.removeEventListener("message", onMessage);
					worker.removeEventListener("error", onError);
				};
				worker.addEventListener("message", onMessage);
				worker.addEventListener("error", onError);

				// Copy buffer (structured clone). Avoid transferring original's buffer.
				const copy = new Uint8ClampedArray(originalImageData.data);
				worker.postMessage({
					runId,
					task: "trace",
					engineId,
					preprocess: preprocessParams,
					engineParams,
					input: { width: originalImageData.width, height: originalImageData.height, data: copy.buffer },
					ctx,
				});
			});
		}

		normalizeToMaxDim(img) {
			const maxDim = this.getMaxDim();
			const srcW = img.naturalWidth || img.width;
			const srcH = img.naturalHeight || img.height;
			const scale = Math.min(1, maxDim / Math.max(srcW, srcH));
			const w = Math.max(1, Math.round(srcW * scale));
			const h = Math.max(1, Math.round(srcH * scale));
			return { w, h, srcW, srcH, scale };
		}

		drawToCanvas(canvas, img, w, h) {
			canvas.width = w;
			canvas.height = h;
			const ctx = canvas.getContext("2d", { willReadFrequently: true });
			if (!ctx) throw new Error("2D canvas not available.");
			ctx.clearRect(0, 0, w, h);
			ctx.drawImage(img, 0, 0, w, h);
			return ctx;
		}

		async rebuild(kind, runId) {
			const isStale = () => runId !== this.runSeq;
			const img = this.source.image;
			if (!img) return;

			this.clearError();
			this.applyOverlay();

			let w = this.normalized.w;
			let h = this.normalized.h;
			let srcW = img.naturalWidth || img.width;
			let srcH = img.naturalHeight || img.height;
			let scale = 1;

			if (kind === "all" || !this.normalized.imageData) {
				// Stage 1: normalize
				this.setStatus("Normalizing…");
				const t0 = performance.now();
				({ w, h, srcW, srcH, scale } = this.normalizeToMaxDim(img));
				const ctxOrig = this.els.canvasOriginal ? this.drawToCanvas(this.els.canvasOriginal, img, w, h) : null;
				// processed canvas will be filled from ImageData transforms below.
				if (this.els.canvasProcessed) {
					this.els.canvasProcessed.width = w;
					this.els.canvasProcessed.height = h;
				}
				const originalImageData = ctxOrig ? ctxOrig.getImageData(0, 0, w, h) : null;
				const t1 = performance.now();
				this.setTiming("normalize", t1 - t0);

				this.normalized = {
					canvas: this.els.canvasProcessed || this.els.canvasOriginal,
					imageData: originalImageData,
					pngDataUrl: "",
					w,
					h,
				};
			}
			if (isStale()) return;

			// Safety warning (non-fatal): warn when output exceeds 2048px.
			if (Math.max(this.normalized.w || 0, this.normalized.h || 0) > 2048 && this.els.meta) {
				this.els.meta.textContent = `${srcW}×${srcH} → ${w}×${h} (${Math.round(scale * 100)}%) · Large (>2048px)`;
			}

			const preprocessParams = this.getPreprocessParams();
			const original = this.normalized.imageData;
			if (!original) throw new Error("No ImageData available.");
			const engineId = this.getEngineId();
			const engine = ENGINES[engineId] || ENGINES["raster-wrapper"];

			/** @type {ImageData} */
			let processed;
			/** @type {{ svg: string, metrics?: Record<string, any> } | null} */
			let traceRes = null;
			/** @type {{ preprocessMs?: number, traceMs?: number } | null} */
			let workerTimings = null;

			if (this.shouldUseWorkerForEngine(engineId)) {
				this.setStatus("Tracing (worker)…");
				this.applyPreprocessLabels();
				const out = await this.traceViaWorker(runId, engineId, original, preprocessParams, { ...this.engineParams }, { w, h });
				if (isStale()) return;
				processed = out.processed;
				traceRes = { svg: out.svg, metrics: out.metrics || undefined };
				workerTimings = out.timings;
				if (workerTimings && typeof workerTimings.preprocessMs === "number") this.setTiming("preprocess", workerTimings.preprocessMs);
				if (workerTimings && typeof workerTimings.traceMs === "number") this.setTiming("svg", workerTimings.traceMs);
			} else {
				// Stage 2: preprocess (main thread)
				this.setStatus("Preprocessing…");
				this.applyPreprocessLabels();
				const tP0 = performance.now();
				processed = new ImageData(new Uint8ClampedArray(original.data), original.width, original.height);
				if (preprocessParams.grayscale) applyGrayscaleInPlace(processed.data);
				if (preprocessParams.contrast !== 0) applyContrastInPlace(processed.data, preprocessParams.contrast);
				if (preprocessParams.invert) applyInvertInPlace(processed.data);
				if (preprocessParams.blur > 0) boxBlurSeparable(processed.data, processed.width, processed.height, preprocessParams.blur);
				const tP1 = performance.now();
				this.setTiming("preprocess", tP1 - tP0);

				if (isStale()) return;

				// Stage 3: trace (engine) -> SVG
				this.setStatus("Tracing…");
				const t2 = performance.now();
				const exportCanvas = this.els.canvasProcessed || this.els.canvasOriginal;
				const pngDataUrl = exportCanvas ? exportCanvas.toDataURL("image/png") : "";
				this.normalized.pngDataUrl = pngDataUrl;
				traceRes = engine.trace(processed, { ...this.engineParams }, { w, h, pngDataUrl });
				const t3 = performance.now();
				this.setTiming("svg", t3 - t2);
			}

			if (isStale()) return;

			// Always update processed canvas on main thread.
			if (this.els.canvasProcessed) {
				const ctx2d = this.els.canvasProcessed.getContext("2d", { willReadFrequently: true });
				if (!ctx2d) throw new Error("2D canvas not available.");
				ctx2d.putImageData(processed, 0, 0);
			}

			if (this.els.placeholder) this.els.placeholder.style.display = "none";
			if (this.els.meta) {
				this.els.meta.textContent = `${srcW}×${srcH} → ${w}×${h} (${Math.round(scale * 100)}%)`;
			}

			// Adopt trace result.
			const res = traceRes;
			this.svgText = res && typeof res.svg === "string" ? res.svg : "";
			this.exportedSvgText = this.getExportSvgText();
			this.updateCompare(processed, this.exportedSvgText || this.svgText, w, h);

			const bytes = encodeSvgTextBytes(this.exportedSvgText || this.svgText);
			const paths = res?.metrics?.paths != null ? res.metrics.paths : countSvgPaths(this.exportedSvgText || this.svgText);
			const durationMs = workerTimings && typeof workerTimings.traceMs === "number" ? workerTimings.traceMs : null;
			this.setMetrics({ engineLabel: engine.label, durationMs, paths, bytes });
			this.renderPaletteLegend(res?.metrics?.palette || null);

			if (this.els.svgText) this.els.svgText.value = this.exportedSvgText || this.svgText;
			if (this.els.svgPreview) this.els.svgPreview.srcdoc = svgToSandboxDoc(this.exportedSvgText || this.svgText);
			if (this.els.svgMeta) this.els.svgMeta.textContent = `${w}×${h} · ${Math.round(bytes / 1024)} KB`;
			this.lastTraceBundle = this.buildTraceBundle();

			this.setStatus("Ready.");
			this.setEnabled(true);
		}

		setEnabled(on) {
			const e = this.els;
			if (e.resetBtn) e.resetBtn.disabled = !on;
			if (e.rebuildBtn) e.rebuildBtn.disabled = !on;
			if (e.copySvgBtn) e.copySvgBtn.disabled = !on;
			if (e.downloadSvgBtn) e.downloadSvgBtn.disabled = !on;
			if (e.copyDataUrlBtn) e.copyDataUrlBtn.disabled = !on;
			if (e.downloadPngBtn) e.downloadPngBtn.disabled = !on;
			if (e.downloadBundleBtn) e.downloadBundleBtn.disabled = !on;
			if (e.copyBundleBtn) e.copyBundleBtn.disabled = !on;
		}

		clearAll() {
			this.source = { image: null, fileName: "", fileType: "", fileSize: 0 };
			this.normalized = { canvas: null, imageData: null, pngDataUrl: "", w: 0, h: 0 };
			this.svgText = "";
			this.exportedSvgText = "";
			this.lastTraceBundle = null;
			if (this.els.compareSvg instanceof HTMLElement) this.els.compareSvg.textContent = "";
			if (this.els.compareEmpty instanceof HTMLElement) this.els.compareEmpty.style.display = "grid";
			this.compare.scale = 1;
			this.compare.x = 0;
			this.compare.y = 0;
			this.setCompareTransform();
			this.setEnabled(false);
			this.setStatus("No image loaded.");
			this.setTiming("load", NaN);
			this.setTiming("normalize", NaN);
			this.setTiming("preprocess", NaN);
			this.setTiming("svg", NaN);
			this.setMetrics({ engineLabel: "—", durationMs: null, paths: null, bytes: null });
			this.renderPaletteLegend(null);
			if (this.els.meta) this.els.meta.textContent = "—";
			if (this.els.svgMeta) this.els.svgMeta.textContent = "—";
			if (this.els.svgText) this.els.svgText.value = "";
			if (this.els.svgPreview) this.els.svgPreview.src = PLACEHOLDER_GIF;
			if (this.els.placeholder) this.els.placeholder.style.display = "grid";
			this.applyCompareControls();
		}

		onChoose() {
			if (this.els.fileInput) this.els.fileInput.click();
		}

		onFileChange() {
			const input = /** @type {HTMLInputElement} */(this.els.fileInput);
			const file = input?.files && input.files[0];
			if (!file) return;
			input.value = "";
			if (!isImageType(file.type)) {
				this.setStatus("That file is not an image.");
				return;
			}
			this.setImageFromFile(file).catch((err) => {
				this.setError(err);
				this.setStatus(`Error: ${err instanceof Error ? err.message : String(err)}`);
			});
		}

		onDropOver(e) {
			e.preventDefault();
			if (this.els.dropZone) this.els.dropZone.classList.add("is-over");
		}

		onDropLeave() {
			if (this.els.dropZone) this.els.dropZone.classList.remove("is-over");
		}

		onDrop(e) {
			e.preventDefault();
			this.onDropLeave();
			const dt = e.dataTransfer;
			if (!dt || !dt.files || dt.files.length === 0) return;
			const file = dt.files[0];
			if (!file || !isImageType(file.type)) {
				this.setStatus("Drop an image file.");
				return;
			}
			this.setImageFromFile(file).catch((err) => {
				this.setError(err);
				this.setStatus(`Error: ${err instanceof Error ? err.message : String(err)}`);
			});
		}

		onOverlay() {
			this.applyOverlay();
		}

		onCompareOpacity() {
			this.applyCompareControls();
		}

		onCompareShow() {
			this.applyCompareControls();
		}

		onCompareFit() {
			this.compareFit();
		}

		onCompare100() {
			this.compare100();
		}

		onComparePointerDown(ev) {
			if (!(this.els.compareViewport instanceof HTMLElement)) return;
			if (ev.button != null && ev.button !== 0) return;
			if (!this.source.image) return;
			this.compare.dragging = true;
			this.compare.startX = ev.clientX;
			this.compare.startY = ev.clientY;
			this.compare.startPanX = this.compare.x;
			this.compare.startPanY = this.compare.y;
			this.els.compareViewport.classList.add("is-dragging");
			try {
				this.els.compareViewport.setPointerCapture(ev.pointerId);
			} catch (_) {
				// ignore
			}
		}

		onComparePointerMove(ev) {
			if (!this.compare.dragging) return;
			const dx = ev.clientX - this.compare.startX;
			const dy = ev.clientY - this.compare.startY;
			this.compare.x = this.compare.startPanX + dx;
			this.compare.y = this.compare.startPanY + dy;
			this.setCompareTransform();
		}

		onComparePointerUp() {
			if (!(this.els.compareViewport instanceof HTMLElement)) return;
			if (!this.compare.dragging) return;
			this.compare.dragging = false;
			this.els.compareViewport.classList.remove("is-dragging");
		}

		onCompareResize() {
			this.setCompareTransform();
		}

		onMaxDim() {
			if (!this.source.image) return;
			this.scheduleRebuild("all");
		}

		onRebuild() {
			if (!this.source.image) return;
			this.scheduleRebuild("all");
		}

		onPreprocess() {
			if (!this.source.image) {
				this.applyPreprocessLabels();
				return;
			}
			this.applyPreprocessLabels();
			this.scheduleRebuild("preprocess");
		}

		onEngineChange() {
			this.resetEngineParamsToDefaults();
			this.renderEngineParams();
			if (this.getEngineId() === "opencv-contours") {
				// Best-effort: if ./opencv.js exists locally, load it.
				ensureOpenCvLoaded().then(() => {
					if (this.source.image) this.scheduleRebuild("trace");
				});
				return;
			}
			if (this.source.image) this.scheduleRebuild("trace");
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
					const file = new File([blob], "clipboard", { type: blob.type });
					await this.setImageFromFile(file);
					return;
				}
				throw new Error("No image found on clipboard.");
			} catch (err) {
				this.setStatus(`Error: ${err instanceof Error ? err.message : String(err)}`);
			}
		}

		onPaste(e) {
			const data = e.clipboardData;
			if (!data || !data.items || data.items.length === 0) return;
			for (const item of data.items) {
				if (!isImageType(item.type)) continue;
				const file = item.getAsFile();
				if (!file) continue;
				e.preventDefault();
				this.setImageFromFile(file).catch((err) => {
					this.setError(err);
					this.setStatus(`Error: ${err instanceof Error ? err.message : String(err)}`);
				});
				return;
			}
		}

		onReset() {
			this.clearAll();
		}

		async onCopySvg() {
			try {
				const text = this.getExportSvgText();
				if (!text) return;
				if (window.isSecureContext && navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
					await navigator.clipboard.writeText(text);
					this.setStatus("SVG copied.");
					return;
				}
				window.prompt("Copy SVG:", text);
				this.setStatus("SVG ready to copy.");
			} catch (err) {
				this.setError(err);
				this.setStatus(`Error: ${err instanceof Error ? err.message : String(err)}`);
			}
		}

		onDownloadSvg() {
			const text = this.getExportSvgText();
			if (!text) return;
			const base = this.source && this.source.fileName ? safeFilenamePart(this.source.fileName.replace(/\.[^.]+$/, "")) : "trace";
			const blob = new Blob([text], { type: "image/svg+xml;charset=utf-8" });
			downloadBlob(blob, `${base}-${timestampForFilename()}.svg`);
		}

		async onCopyDataUrl() {
			try {
				const text = this.getExportSvgText();
				if (!text) return;
				const url = svgToDataUrl(text);
				if (window.isSecureContext && navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
					await navigator.clipboard.writeText(url);
					this.setStatus("SVG data URL copied.");
					return;
				}
				window.prompt("Copy SVG data URL:", url);
				this.setStatus("SVG data URL ready to copy.");
			} catch (err) {
				this.setError(err);
				this.setStatus(`Error: ${err instanceof Error ? err.message : String(err)}`);
			}
		}

		buildTraceBundle() {
			const engineId = this.getEngineId();
			const engine = ENGINES[engineId] || ENGINES["raster-wrapper"];
			const preprocess = this.getPreprocessParams();
			const exportOptions = this.getExportOptions();
			return {
				version: 1,
				createdAt: new Date().toISOString(),
				input: {
					fileName: this.source.fileName || null,
					fileType: this.source.fileType || null,
					fileSize: this.source.fileSize || null,
				},
				normalized: {
					width: this.normalized.w || null,
					height: this.normalized.h || null,
					maxDim: this.els.maxDim ? Number(this.els.maxDim.value) : null,
				},
				preprocess,
				engine: {
					id: engineId,
					label: engine.label,
					params: { ...this.engineParams },
				},
				export: exportOptions,
				svg: this.getExportSvgText(),
			};
		}

		onDownloadBundle() {
			const svg = this.getExportSvgText();
			if (!svg) return;
			const base = this.source && this.source.fileName ? safeFilenamePart(this.source.fileName.replace(/\.[^.]+$/, "")) : "trace";
			const bundle = this.buildTraceBundle();
			this.lastTraceBundle = bundle;
			const json = JSON.stringify(bundle, null, 2);
			const blob = new Blob([json], { type: "application/json;charset=utf-8" });
			downloadBlob(blob, `${base}-${timestampForFilename()}-trace.json`);
		}

		async onCopyBundle() {
			try {
				const svg = this.getExportSvgText();
				if (!svg) return;
				const bundle = this.buildTraceBundle();
				this.lastTraceBundle = bundle;
				const json = JSON.stringify(bundle, null, 2);
				if (window.isSecureContext && navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
					await navigator.clipboard.writeText(json);
					this.setStatus("Trace JSON copied.");
					return;
				}
				window.prompt("Copy trace JSON:", json);
				this.setStatus("Trace JSON ready to copy.");
			} catch (err) {
				this.setError(err);
				this.setStatus(`Error: ${err instanceof Error ? err.message : String(err)}`);
			}
		}

		async onDownloadPng() {
			try {
				const canvas = this.normalized.canvas;
				if (!canvas) return;
				const blob = await blobFromCanvas(canvas, "image/png");
				downloadBlob(blob, "normalized.png");
			} catch (err) {
				this.setError(err);
				this.setStatus(`Error: ${err instanceof Error ? err.message : String(err)}`);
			}
		}
	}

	function main() {
		const root = document.querySelector("[data-vector-trace]");
		if (!root) return;
		new VectorTraceApp({ root: /** @type {HTMLElement} */(root) }).init();
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", main);
	} else {
		main();
	}
})();

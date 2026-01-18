/* Vector Trace Worker (Phase 18)
 *
 * Runs preprocessing + tracing for CPU-heavy, non-DOM engines (Potrace + ImageTracer).
 * No bundler. Plain worker script.
 */

(() => {
	"use strict";

	function clamp(n, min, max) {
		return Math.max(min, Math.min(max, n));
	}

	function clampInt(n, min, max) {
		return Math.max(min, Math.min(max, Math.round(n)));
	}

	function applyGrayscaleInPlace(data) {
		for (let i = 0; i < data.length; i += 4) {
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
		const c = clamp(contrastPercent, -100, 100) * 2.55;
		const factor = (259 * (c + 255)) / (255 * (259 - c));
		for (let i = 0; i < data.length; i += 4) {
			data[i] = clampInt(factor * (data[i] - 128) + 128, 0, 255);
			data[i + 1] = clampInt(factor * (data[i + 1] - 128) + 128, 0, 255);
			data[i + 2] = clampInt(factor * (data[i + 2] - 128) + 128, 0, 255);
		}
	}

	function boxBlurSeparable(data, w, h, radius) {
		const r = clampInt(radius, 0, 64);
		if (r <= 0) return;
		const tmp = new Uint8ClampedArray(data.length);
		const windowSize = r * 2 + 1;

		for (let y = 0; y < h; y++) {
			let sumR = 0, sumG = 0, sumB = 0, sumA = 0;
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

	function otsuThresholdFromImageData(imageData) {
		const d = imageData.data;
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
		const minA = clampInt(minArea, 0, 1_000_000);
		if (minA <= 1) return;
		const visited = new Uint8Array(mask.length);
		const stack = [];
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
		const segs = [];
		const sample = (x, y) => (mask[y * w + x] ? 1 : 0);
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
		const map = new Map();
		const key = (x2, y2) => `${x2},${y2}`;
		for (let i = 0; i < segs.length; i++) {
			const [x1, y1, x2, y2] = segs[i];
			const k1 = key(x1, y1);
			const k2 = key(x2, y2);
			if (!map.has(k1)) map.set(k1, []);
			if (!map.has(k2)) map.set(k2, []);
			map.get(k1).push({ i });
			map.get(k2).push({ i });
		}

		const used = new Uint8Array(segs.length);
		const polys = [];
		for (let i = 0; i < segs.length; i++) {
			if (used[i]) continue;
			used[i] = 1;
			const [sx1, sy1, sx2, sy2] = segs[i];
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
				if (key(x1, y1) === endKey) {
					pts.push([x2, y2]);
					endKey = key(x2, y2);
				} else {
					pts.push([x1, y1]);
					endKey = key(x1, y1);
				}
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
		const keep = new Array(points.length).fill(false);
		keep[0] = true;
		keep[points.length - 1] = true;
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
		const out = [];
		for (let i = 0; i < points.length; i++) if (keep[i]) out.push(points[i]);
		return out;
	}

	function rgbToHex(r, g, b) {
		const to2 = (n) => n.toString(16).padStart(2, "0");
		return `#${to2(clampInt(r, 0, 255))}${to2(clampInt(g, 0, 255))}${to2(clampInt(b, 0, 255))}`;
	}

	function kMeansQuantize(imageData, k, maxSamples, iters) {
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
			return { centers: new Array(KK).fill(0).map(() => [255, 255, 255]) };
		}

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

		let bg = 0;
		let max = -1;
		for (let i = 0; i < counts.length; i++) {
			if (counts[i] > max) {
				max = counts[i];
				bg = i;
			}
		}
		return { labels, bg };
	}

	function relabelSmallComponents(labels, w, h, bgLabel, minArea) {
		const minA = clampInt(minArea, 0, 1_000_000);
		if (minA <= 1) return;
		const visited = new Uint8Array(labels.length);
		const stack = [];
		const component = [];
		const push = (idx) => {
			visited[idx] = 1;
			stack.push(idx);
		};

		for (let i = 0; i < labels.length; i++) {
			if (labels[i] === bgLabel || visited[i]) continue;
			component.length = 0;
			stack.length = 0;
			push(i);
			const target = labels[i];
			while (stack.length) {
				const idx = stack.pop();
				component.push(idx);
				const x = idx % w;
				const y = (idx - x) / w;
				if (x > 0) {
					const j = idx - 1;
					if (!visited[j] && labels[j] === target) push(j);
				}
				if (x + 1 < w) {
					const j = idx + 1;
					if (!visited[j] && labels[j] === target) push(j);
				}
				if (y > 0) {
					const j = idx - w;
					if (!visited[j] && labels[j] === target) push(j);
				}
				if (y + 1 < h) {
					const j = idx + w;
					if (!visited[j] && labels[j] === target) push(j);
				}
			}
			if (component.length > 0 && component.length < minA) {
				for (const idx of component) labels[idx] = bgLabel;
			}
		}
	}

	function tracePotrace(imageData, params, ctx) {
		const autoOtsu = !!params.autoOtsu;
		const inv = !!params.invert;
		const speckle = clampInt(Number(params.speckle ?? 10), 0, 500);
		const simplify = Math.max(0, Number(params.simplify ?? 1.0));
		const strokeMode = !!params.strokeMode;
		const fill = typeof params.fill === "string" ? params.fill : "#111111";
		const strokeWidth = clampInt(Number(params.strokeWidth ?? 6), 1, 24);

		const thr = autoOtsu ? otsuThresholdFromImageData(imageData) : clampInt(Number(params.threshold ?? 128), 0, 255);
		const w = imageData.width;
		const h = imageData.height;
		let mask = buildBinaryMask(imageData, thr, inv);
		if (speckle > 1) removeSpecklesInPlace(mask, w, h, speckle);
		const segs = marchingSquaresSegments(mask, w, h);
		const polys2 = stitchSegmentsToPolylines(segs);

		let paths = 0;
		let d = "";
		for (const poly of polys2) {
			let pts = poly.map(([x2, y2]) => [x2 / 2, y2 / 2]);
			const closed = pts.length > 2 && pts[0][0] === pts[pts.length - 1][0] && pts[0][1] === pts[pts.length - 1][1];
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
	}

	function traceImageTracer(imageData, params, ctx) {
		const k = clampInt(Number(params.colors ?? 6), 2, 16);
		const noise = clampInt(Number(params.noise ?? 10), 0, 500);
		const simplify = Math.max(0, Number(params.simplify ?? 1.0));
		const strokeMode = !!params.strokeMode;
		const strokeWidth = clampInt(Number(params.strokeWidth ?? 3), 1, 12);

		const { centers } = kMeansQuantize(imageData, k, 50_000, 8);
		const { labels, bg } = assignLabels(imageData, centers);
		relabelSmallComponents(labels, ctx.w, ctx.h, bg, noise);

		let svgPaths = "";
		let totalPaths = 0;
		const palette = [];
		const mask = new Uint8Array(ctx.w * ctx.h);

		for (let li = 0; li < centers.length; li++) {
			if (li === bg) continue;
			mask.fill(0);
			for (let p = 0; p < labels.length; p++) mask[p] = labels[p] === li ? 1 : 0;
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
				for (let i = 1; i < working.length; i++) d += ` L ${working[i][0].toFixed(2)} ${working[i][1].toFixed(2)}`;
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
	}

	function runJob(msg) {
		const { engineId, preprocess, engineParams, input, ctx } = msg;
		const imageData = new ImageData(new Uint8ClampedArray(input.data), input.width, input.height);

		const tP0 = performance.now();
		const processed = new ImageData(new Uint8ClampedArray(imageData.data), imageData.width, imageData.height);
		if (preprocess?.grayscale) applyGrayscaleInPlace(processed.data);
		if (preprocess?.contrast) applyContrastInPlace(processed.data, Number(preprocess.contrast) || 0);
		if (preprocess?.invert) applyInvertInPlace(processed.data);
		if (preprocess?.blur) boxBlurSeparable(processed.data, processed.width, processed.height, Number(preprocess.blur) || 0);
		const tP1 = performance.now();

		const tT0 = performance.now();
		let res;
		if (engineId === "potrace") res = tracePotrace(processed, engineParams || {}, ctx);
		else if (engineId === "imagetracer") res = traceImageTracer(processed, engineParams || {}, ctx);
		else throw new Error(`Unsupported engineId for worker: ${engineId}`);
		const tT1 = performance.now();

		return {
			processed,
			res,
			timings: { preprocessMs: tP1 - tP0, traceMs: tT1 - tT0 },
		};
	}

	self.onmessage = (ev) => {
		const msg = ev.data;
		const runId = msg && msg.runId;
		try {
			if (!msg || msg.task !== "trace") throw new Error("Invalid worker message.");
			const out = runJob(msg);
			const buf = out.processed.data.buffer;
			self.postMessage(
				{
					runId,
					ok: true,
					processed: { width: out.processed.width, height: out.processed.height, data: buf },
					svg: out.res.svg,
					metrics: out.res.metrics || null,
					timings: out.timings,
				},
				[buf]
			);
		} catch (err) {
			self.postMessage({ runId, ok: false, error: err instanceof Error ? (err.stack || err.message) : String(err) });
		}
	};
})();

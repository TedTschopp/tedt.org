import test from 'node:test';
import assert from 'node:assert/strict';
import { valueToOutputRibbon } from '../src/lib/ribbon.js';

function points(path) {
  assert.match(path, /^M .*\n\s*C .*\n\s*L .*\n\s*C .*\n\s*Z$/);
  const values = path.match(/-?\d+(?:\.\d+)?(?:e[-+]?\d+)?/gi).map(Number);
  assert.equal(values.length, 16);
  assert.ok(values.every(Number.isFinite));
  return Array.from({ length: 8 }, (_, index) => ({ x: values[index * 2], y: values[index * 2 + 1] }));
}
const cubic = (a, b, c, d, t) => (1 - t) ** 3 * a + 3 * (1 - t) ** 2 * t * b + 3 * (1 - t) * t ** 2 * c + t ** 3 * d;

function verifyEdges(path) {
  const [start, top1, top2, end, bottom, bottom1, bottom2, finish] = points(path);
  const left = Math.min(start.x, end.x), right = Math.max(start.x, end.x);
  for (const point of [top1, top2, bottom1, bottom2]) assert.ok(point.x >= left && point.x <= right);
  let previous = start.x;
  const direction = Math.sign(end.x - start.x);
  for (let index = 0; index <= 100; index++) {
    const t = index / 100;
    const upperX = cubic(start.x, top1.x, top2.x, end.x, t);
    const lowerX = cubic(finish.x, bottom2.x, bottom1.x, bottom.x, t);
    const upperY = cubic(start.y, top1.y, top2.y, end.y, t);
    const lowerY = cubic(finish.y, bottom2.y, bottom1.y, bottom.y, t);
    assert.ok(Math.abs(upperX - lowerX) < 1e-8, 'edges share horizontal progress');
    assert.ok(direction * (upperX - previous) >= -1e-8, 'ribbon never doubles back');
    assert.ok(upperY < lowerY, 'positive ribbon width prevents edge crossings');
    previous = upperX;
  }
}

test('wide centered layout preserves endpoints without the observed 44px overshoot', () => {
  const origin = { left: 273, top: 900 };
  const source = { right: 789, top: 1359.03125, bottom: 1412.15625 };
  const target = { left: 1076, top: 1225.90625, bottom: 1279.03125 };
  const path = valueToOutputRibbon(source, target, origin, 30);
  const vertices = points(path);
  assert.deepEqual(vertices[0], { x: 516, y: 459.03125 });
  assert.deepEqual(vertices[3], { x: 803, y: 325.90625 });
  assert.deepEqual(vertices[4], { x: 803, y: 379.03125 });
  assert.deepEqual(vertices[7], { x: 516, y: 512.15625 });
  assert.ok(vertices.every(point => point.x >= 516 && point.x <= 803));
  verifyEdges(path);
});

test('page insets and horizontal/vertical scrolling do not alter local ribbon geometry', () => {
  const source = { right: 516, top: 459, bottom: 512 };
  const target = { left: 803, top: 326, bottom: 379 };
  const baseline = valueToOutputRibbon(source, target, { left: 0, top: 0 }, 30);
  for (const dx of [-2000, -260, 273, 1400]) {
    for (const dy of [-1800, 900]) {
      const movedSource = { right: source.right + dx, top: source.top + dy, bottom: source.bottom + dy };
      const movedTarget = { left: target.left + dx, top: target.top + dy, bottom: target.bottom + dy };
      assert.equal(valueToOutputRibbon(movedSource, movedTarget, { left: dx, top: dy }, 30), baseline);
    }
  }
});

test('bounded bends keep separated edges for narrow gaps and varying token-column heights', () => {
  for (const gap of [1, 10, 100, 287, 600, -10]) {
    for (const verticalShift of [-200, 0, 200]) {
      for (const [sourceHeight, targetHeight] of [[4, 200], [53, 53], [200, 4]]) {
        for (const bend of [0, 30, 800]) {
          verifyEdges(valueToOutputRibbon(
            { right: 400, top: 100, bottom: 100 + sourceHeight },
            { left: 400 + gap, top: 100 + verticalShift, bottom: 100 + verticalShift + targetHeight },
            { left: 273, top: 20 }, bend,
          ));
        }
      }
    }
  }
});

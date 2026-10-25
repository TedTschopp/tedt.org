import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const html = readFileSync(new URL('../../tools/quick-study-painter.html', import.meta.url), 'utf8');
const script = html.match(/<script id="painter-math">([\s\S]*?)<\/script>/)[1];
const math = vm.runInNewContext(`${script}\nStudyMath;`);
const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 0.0001, `${actual} ≈ ${expected}`);

test('image sizing preserves aspect ratio, small images, and narrow images', () => {
  const cases = [
    [4000, 3000, 1000, 750],
    [3000, 4000, 750, 1000],
    [64, 48, 64, 48],
    [1, 5000, 1, 1000]
  ];
  for (const [width, height, expectedWidth, expectedHeight] of cases) {
    const size = math.fitDimensions(width, height);
    assert.equal(size.width, expectedWidth);
    assert.equal(size.height, expectedHeight);
  }
  for (const invalid of [0, -1, NaN, Infinity]) assert.throws(() => math.fitDimensions(invalid, 10));
});

test('luminance weights and Euclidean color error retain their numerical meaning', () => {
  close(math.luminance(255, 255, 255), 255);
  close(math.luminance(255, 0, 0), 76.245);
  close(math.luminance(0, 255, 0), 149.685);
  close(math.luminance(0, 0, 255), 29.07);
  close(math.colorError(3, -4, 12), 13);
  assert.equal(math.colorError(0, 0, 0), 0);
});

test('box blur preserves constant colors even when the radius exceeds the image', () => {
  for (const radius of [0, 1, 7]) {
    assert.deepEqual(Array.from(math.blur1(new Float32Array(6).fill(73), 3, 2, radius)), new Array(6).fill(73));
  }
});

test('box blur spreads an impulse in both axes and replicates the edge pixels', () => {
  const impulse = new Float32Array([0, 0, 0, 0, 9, 0, 0, 0, 0]);
  assert.deepEqual(Array.from(math.blur1(impulse, 3, 3, 1)), new Array(9).fill(1));
  const edge = math.blur1(new Float32Array([0, 9, 0]), 3, 1, 1);
  assert.deepEqual(Array.from(edge), [3, 3, 3]);
  const ramp = math.blur1(new Float32Array([0, 3, 6]), 3, 1, 1);
  assert.deepEqual(Array.from(ramp), [1, 3, 5]);
});

test('Sobel detects independent horizontal and vertical ramps with zero flat-field gradients', () => {
  const horizontal = math.sobel(new Float32Array([0, 1, 2, 0, 1, 2, 0, 1, 2]), 3, 3);
  assert.equal(horizontal.gx[4], 8);
  assert.equal(horizontal.gy[4], 0);
  const vertical = math.sobel(new Float32Array([0, 0, 0, 1, 1, 1, 2, 2, 2]), 3, 3);
  assert.equal(vertical.gx[4], 0);
  assert.equal(vertical.gy[4], 8);
  const flat = math.sobel(new Float32Array(9).fill(12), 3, 3);
  assert.ok([...flat.gx, ...flat.gy].every(value => value === 0));
});

test('the stroke randomizer is reproducible and stays in its unit interval', () => {
  const first = math.mulberry32(42), same = math.mulberry32(42), different = math.mulberry32(43);
  const values = Array.from({ length: 1000 }, () => first());
  assert.deepEqual(values, Array.from({ length: 1000 }, () => same()));
  assert.ok(values.every(value => value >= 0 && value < 1));
  assert.notEqual(values[0], different());
});

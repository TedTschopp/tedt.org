// Sampling is calculated over the full vocabulary before this display-only window.
export const OUTPUT_ROW_LIMITS = [5, 10, 15];
export const DEFAULT_OUTPUT_ROW_LIMIT = 15;

export function outputRows(candidates = [], limit = DEFAULT_OUTPUT_ROW_LIMIT) {
  if (!OUTPUT_ROW_LIMITS.includes(limit)) throw new Error('Choose a supported diagram row limit.');
  if (!candidates.length) return { rows: [], retainedCount: 0, hiddenCount: 0 };

  // Use the sampling cutoff, not probability > 0: selected probabilities can
  // underflow to zero and very small displayed percentages can round to zero.
  const cutoff = candidates[0].cutoffIndex;
  const retainedCount = Number.isInteger(cutoff) && cutoff >= 0
    ? cutoff + 1
    : candidates.every(item => typeof item.topKLogit === 'number')
      ? candidates.reduce((count, item) => Number.isFinite(item.topKLogit) ? Math.max(count, item.rank + 1) : count, 0)
      : candidates.length;
  const rows = candidates.filter(item => item.rank < retainedCount).slice(0, limit);
  return { rows, retainedCount, hiddenCount: Math.max(0, retainedCount - rows.length) };
}

export function outputRowsHeight(count, rowHeight, rowGap) {
  return count * rowHeight + Math.max(0, count - 1) * rowGap;
}

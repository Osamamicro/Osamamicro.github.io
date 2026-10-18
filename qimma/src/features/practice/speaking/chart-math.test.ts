import { describe, expect, it } from 'vitest';

import { niceTicks, percentLabel, pieFractions, pieSlicePath, tickLabel } from './chart-math';

describe('niceTicks', () => {
  it('rounds the scale to round steps that cover the data', () => {
    const { ticks, lo, hi } = niceTicks(0, 87, 5);
    expect(ticks).toEqual([0, 20, 40, 60, 80, 100]);
    expect(lo).toBe(0);
    expect(hi).toBe(100);
  });

  it('keeps zero on the scale for small positive data', () => {
    expect(niceTicks(0.3, 3.2, 5).ticks).toEqual([0, 1, 2, 3, 4]);
  });

  it('extends the scale below zero for negative values', () => {
    const { ticks, lo } = niceTicks(-12, 5, 5);
    expect(lo).toBeLessThanOrEqual(-12);
    expect(ticks[0]).toBe(lo);
    expect(ticks).toContain(0);
  });

  it('handles all-zero data without dividing by zero', () => {
    const { ticks } = niceTicks(0, 0, 5);
    expect(ticks[0]).toBe(0);
    expect(ticks.length).toBeGreaterThan(1);
  });
});

describe('pie geometry', () => {
  it('splits a full turn into contiguous fractions and skips zero values', () => {
    const fractions = pieFractions([1, 0, 3]);
    expect(fractions).toEqual([
      { start: 0, end: 0.25 },
      { start: 0.25, end: 0.25 },
      { start: 0.25, end: 1 },
    ]);
  });

  it('starts the first slice at 12 o clock and runs clockwise', () => {
    expect(pieSlicePath(0, 0, 10, 0, 0.25)).toBe('M 0 0 L 0 -10 A 10 10 0 0 1 10 0 Z');
  });

  it('marks slices over half a turn as large arcs', () => {
    expect(pieSlicePath(0, 0, 10, 0, 0.75)).toContain('A 10 10 0 1 1');
  });
});

describe('labels', () => {
  it('formats percentages from a total', () => {
    expect(percentLabel(35, 100)).toBe('35%');
    expect(percentLabel(1, 3)).toBe('33%');
    expect(percentLabel(5, 0)).toBe('0%');
  });

  it('appends units to tick labels', () => {
    expect(tickLabel(40, '%')).toBe('40%');
    expect(tickLabel(20, 'kg')).toBe('20 kg');
    expect(tickLabel(20)).toBe('20');
  });
});

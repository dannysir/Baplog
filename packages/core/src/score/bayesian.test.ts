import { describe, expect, it } from 'vitest';

import { PRIOR_MEAN } from './constants.js';
import { bayesianScore } from './bayesian.js';

describe('bayesianScore (설계 §2 회귀)', () => {
  it('평가 0개면 사전값 2.5', () => {
    expect(bayesianScore({ up: 0, neutral: 0, down: 0 })).toBe(PRIOR_MEAN);
  });

  it('추천 5개 → ≈ 3.33', () => {
    expect(bayesianScore({ up: 5, neutral: 0, down: 0 })).toBeCloseTo(3.33, 2);
  });

  it('추천 50개 → ≈ 4.58', () => {
    expect(bayesianScore({ up: 50, neutral: 0, down: 0 })).toBeCloseTo(4.58, 2);
  });

  it('추천 100개 → ≈ 4.77', () => {
    expect(bayesianScore({ up: 100, neutral: 0, down: 0 })).toBeCloseTo(4.77, 2);
  });

  it('추천 50 + 보통 50 → ≈ 3.64 ("보통"의 하향력)', () => {
    expect(bayesianScore({ up: 50, neutral: 50, down: 0 })).toBeCloseTo(3.64, 2);
  });

  it('비추천만 있어도 1보다 작아지지 않는다', () => {
    const score = bayesianScore({ up: 0, neutral: 0, down: 100 });
    expect(score).toBeGreaterThanOrEqual(1);
  });
});

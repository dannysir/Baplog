import { MAP_DOWN, MAP_NEUTRAL, MAP_UP, PRIOR_MEAN, PRIOR_WEIGHT } from './constants.js';

export interface RatingCounts {
  up: number;
  neutral: number;
  down: number;
}

/**
 * 설계 §2 — 베이지안 평균.
 *
 *   score =
 *     (up*5 + neutral*2.5 + down*1 + PRIOR_WEIGHT*2.5)
 *     / (up + neutral + down + PRIOR_WEIGHT)
 *
 * 평가가 0개면 사전값(2.5)에 수렴한다.
 */
export function bayesianScore(counts: RatingCounts): number {
  const { up, neutral, down } = counts;
  const numerator = up * MAP_UP + neutral * MAP_NEUTRAL + down * MAP_DOWN + PRIOR_WEIGHT * PRIOR_MEAN;
  const denominator = up + neutral + down + PRIOR_WEIGHT;
  return numerator / denominator;
}

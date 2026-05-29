// 설계 §2 — 베이지안 점수 시스템의 단일 출처.
// DB 컬럼이 아니라 코드 상수로 둔다(§7).

export const PRIOR_WEIGHT = 10;

export const MAP_UP = 5;
export const MAP_NEUTRAL = 2.5;
export const MAP_DOWN = 1;

export const PRIOR_MEAN = MAP_NEUTRAL;

export const VERDICT_UP = 1;
export const VERDICT_NEUTRAL = 0;
export const VERDICT_DOWN = -1;

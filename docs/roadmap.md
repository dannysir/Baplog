# Baplog v1 개발 로드맵

> 무엇을 만들지는 [docs/design-v2.md](design-v2.md)를 참조합니다. 이 문서는 v1 범위를 **어떤 순서로** 만들지를 정의합니다. 마일스톤 단위로 진행하고, 세부 설계는 각 마일스톤 시작 시점에 결정합니다.

## 마일스톤 개요

| # | 마일스톤 | 핵심 산출물 |
|---|----------|------------|
| M1 | 기반 (Foundations) | Prisma 스키마, `packages/core` 베이지안 로직, NestJS 골격 |
| M2 | 인증 (Auth) | 소셜 로그인(구글 우선), USER, 세션/토큰 |
| M3 | 지도 + 가게 (Map & Place) | Places API 래핑, PLACE upsert, react-native-maps |
| M4 | VISIT 2층 + RATING + PLACE_SCORE | 정직성 코어. 평가 자격·집계·익명성 |
| M5 | 사진 (Photo) | 스토리지·업로드 파이프라인·서명 URL |
| M6 | 팔로우 SNS + 프라이버시 | FOLLOW, 친구 피드, 차단/신고 |
| M7 | 발견 + 출시 준비 | 점수 정렬 발견, 이중 점수, 배포·약관 |

---

## M1. 기반 (Foundations)

**작업 항목**
- Prisma 스키마 작성 (USER / PLACE / VISIT / RATING / PHOTO / FOLLOW / PLACE_SCORE)
- DB 연결, 마이그레이션 정착
- `packages/core` — 베이지안 점수 함수 + 상수(`PRIOR_WEIGHT`, verdict 매핑) + 단위 테스트
- `packages/types` — 공유 타입 노출
- NestJS 기본 골격 (ConfigModule·Prisma 모듈·헬스체크)

**왜 이 순서**: 모든 후속 작업이 이 위에 올라갑니다. 점수 로직은 가장 명확한 비즈니스 규칙이라 테스트로 잠가두기 좋습니다.

**이 시점에 결정할 §9 미정 항목**
- §9-1 비추천 1점 유지 여부 (초기값 1로 가되 상수로 분리)
- §9-2 `PRIOR_WEIGHT` 운영값 (초기값 10)

**브랜치 예시**: `feature/m1-foundations`

---

## M2. 인증 (Auth)

**작업 항목**
- 백엔드 OAuth (구글 우선, 카카오·네이버는 차순위)
- USER 레코드 생성·매칭 (`provider, provider_id` 유니크)
- 세션/토큰 정책 결정 (JWT vs 세션)
- Expo 클라이언트 로그인 플로우

**왜 이 순서**: 이후 거의 모든 엔드포인트가 인증된 사용자 컨텍스트를 요구합니다.

**이 시점에 결정할 §9 미정 항목**
- §9-4 인증 구현 방식 (백엔드 직접 OAuth vs Supabase Auth 등)

**브랜치 예시**: `feature/m2-auth`

---

## M3. 지도 + 가게 (Map & Place)

**작업 항목**
- Places API 백엔드 래핑 (검색·place_id 확보) — `apps/api`에서만 호출
- `PLACE` 레코드 upsert (place_id만 저장)
- Expo + `react-native-maps` 기본 지도 화면
- 가게 핀 표시·상세 시트 (이름은 SDK/실시간 호출, 저장 금지)

**왜 이 순서**: 사용자가 처음 보는 화면입니다. 이후 VISIT·RATING·PHOTO가 모두 "어떤 가게에" 귀속됩니다.

**이 시점에 결정할 §9 미정 항목**
- §9-5 지도/장소 데이터 소스 최종 확정 (구글 vs 네이버 — 표시·SDK 측면. place_id만 저장 원칙은 공통)

**브랜치 예시**: `feature/m3-map-place`

---

## M4. VISIT 2층 + RATING + PLACE_SCORE

**작업 항목**
- TAP VISIT (느슨한 기록) — 평가 자격 없음, 개인 지도·피드용
- VERIFIED VISIT (GPS 근접) — RATING 자격 부여
- RATING 입력 UI (추천 / 보통 / 비추천)
- `PLACE_SCORE` 트랜잭션 갱신 (delta 처리, row lock, self-healing 배치)
- 평가 익명 집계 보장 (개별 verdict 노출 차단)

**왜 이 순서**: 정직한 점수가 서비스의 차별점입니다. M1의 점수 로직 + M3의 가게 + M2의 인증이 모두 연결되는 지점이라 여기까지 와야 의미가 생깁니다.

**이 시점에 결정할 §9 미정 항목**
- §9-3 VISIT 생성 강도 — 느슨/검증 2층 분리 방식과 검증 수단 (근접 vs 체류)

**브랜치 예시**: `feature/m4-rating-score`

---

## M5. 사진 (Photo)

**작업 항목**
- Supabase Storage 또는 Cloudflare R2 연동
- 업로드 파이프라인: 리사이즈 → 썸네일 → EXIF 위치 제거
- DB엔 `storage_key`만, 조회 시 서명 URL 발급
- VISIT/PHOTO 연결, 공개 범위 토글

**왜 이 순서**: 인프라(스토리지·이미지 처리) 작업량이 큽니다. M4의 VISIT에 귀속되므로 M4가 먼저여야 자연스럽습니다.

**이 시점에 결정할 §9 미정 항목**
- §9-7 사진: 방문당 수 상한, 최대 해상도/용량, 자동 모더레이션 도입 여부

**브랜치 예시**: `feature/m5-photo`

---

## M6. 팔로우 SNS + 프라이버시

**작업 항목**
- FOLLOW (승인제), 친구 피드
- 피드 노출 규칙: 방문·사진 O / 개별 verdict X
- VISIT/PHOTO visibility 토글
- 차단·신고 최소 경로 (모더레이션)

**왜 이 순서**: SNS는 콘텐츠가 있어야 의미가 생깁니다. M4·M5에서 만들어진 기록 위에 얹습니다.

**이 시점에 결정할 §9 미정 항목**
- §9-8 차단(Block) 구현 방식 (별도 테이블 vs FOLLOW status 확장)

**브랜치 예시**: `feature/m6-social`

---

## M7. 발견 + 출시 준비

**작업 항목**
- `PLACE_SCORE` 정렬 발견 화면 ("이 지역 점수 높은 집")
- 이중 점수 표시 (구글 평점 실시간 호출 + 자체 베이지안, attribution 포함)
- 신규 가게 행동 신호 (재방문율 등)
- 배포 파이프라인 (EAS, API 호스팅)
- 약관·PIPA 1차 점검

**왜 이 순서**: 발견 UI는 점수 데이터가 어느 정도 쌓여야 의미가 있고, 배포 준비는 모든 기능이 들어온 뒤 진행하는 게 효율적입니다.

**이 시점에 결정할 §9 미정 항목**
- §9-6 배포처 (EAS, 웹/백엔드 호스팅)
- §9-9 초기 Google 큐레이션 기준 (리뷰 수 구간, 윌슨 컷오프)
- §9-10 한국 PIPA 대응 상세

---

## v1 이후

- §9-11 v2 협업 필터링 도입 시점·알고리즘 — RATING 데이터가 충분히 쌓인 뒤 별도 마일스톤으로 진행합니다.

---

## 진행 방식

- 마일스톤 단위로 새 브랜치를 엽니다. 브랜치 이름은 `feature/m{N}-{name}` 형식 (예: `feature/m1-foundations`).
- 마일스톤 시작 시점에 어시스턴트가 세부 플랜을 작성하고 사용자 승인을 받은 뒤 구현합니다.
- 위 §9 미정 항목 매핑대로, 각 마일스톤이 시작될 때 해당 미정 항목을 사용자와 결정합니다.
- 마일스톤 완료 후 사용자가 직접 PR을 생성합니다. 어시스턴트는 요청 시 PR 본문 초안만 작성합니다.
- 마일스톤 사이에서 발견된 작은 작업(버그 수정·문서 정리 등)은 별도 짧은 브랜치로 분리합니다.

# Baplog 프로젝트 규칙

이 문서는 Baplog 프로젝트에서 작업할 때 따르는 규칙을 정의합니다.

## 모노레포 구조

- `apps/api` — NestJS 백엔드. OAuth, Google Places API 등 외부 통신은 모두 이 레이어에서 처리합니다.
- `apps/mobile` — Expo (React Native). iOS·Android·Web을 한 코드베이스로 빌드합니다.
- `packages/core` — 베이지안 점수, 발견 랭킹 등 앱·서버가 함께 쓰는 도메인 로직. 점수 매핑(5/2.5/1)이나 `PRIOR_WEIGHT` 같은 상수도 여기에 둡니다.
- `packages/types` — 공유 타입 (Prisma 생성 타입 포함).
- `packages/eslint-config` — 공용 ESLint 설정.
- `prisma/` — Prisma 스키마와 마이그레이션.
- `docs/` — 설계 문서.

새 파일 위치 가이드: 도메인 계산은 `packages/core`, 공유 타입은 `packages/types`, 서버 라우트·서비스는 `apps/api/src`에 둡니다.

## 패키지 매니저

- **pnpm만 사용**합니다. npm·yarn 사용 금지. `package.json`의 `packageManager: pnpm@11.4.0`을 따릅니다.
- 의존성은 항상 워크스페이스를 명시해 추가합니다. 예: `pnpm add zod -F @baplog/api`.
- 루트에는 모노레포 공통 도구만 두고, 그 외 의존성은 사용하는 워크스페이스에 추가합니다.
- `package-lock.json`, `yarn.lock`이 생성되면 절대 커밋하지 않습니다.

## 작업 전 필독 문서

- 도메인·정책·스키마와 관련된 변경 전에는 반드시 [docs/design-v2.md](docs/design-v2.md)를 먼저 확인합니다.
- 설계 문서에서 "결정됨"으로 표시된 항목은 임의로 변경하지 않습니다. 변경이 필요하면 사용자에게 먼저 제안합니다.
- "미정"으로 표시된 항목은 구현 전에 사용자와 협의합니다.

## 도메인 하드 룰

위반 시 정책 위반이나 데이터 사고로 직결되는 규칙들입니다.

### Google Places 콘텐츠 저장 금지
- `PLACE` 테이블에는 `google_place_id`만 저장합니다. 이름·평점·리뷰·카테고리 등 다른 Google 콘텐츠는 DB에 저장하거나 캐싱하지 않습니다.
- 표시 데이터는 (a) 클라이언트 지도 SDK가 직접 표시하거나 (b) 백엔드가 실시간으로 호출해 즉시 사용합니다. 재사용 캐싱은 하지 않습니다.
- Places API 호출은 **반드시 `apps/api`에서만** 합니다. 클라이언트 직접 호출과 키 노출은 금지입니다.

### `taste_profile` / 카테고리 재도입 금지
- v2에서 의도적으로 제거된 개념입니다. 어떤 형태로도 부활시키지 않습니다.
- 추천은 v1=비개인화 랭킹(PLACE_SCORE 정렬), v2=협업 필터링(RATING 행렬)만 사용합니다.

### 평점은 베이지안 단일 verdict 유지
- verdict 매핑: 추천=5, 보통=2.5, 비추천=1. `PRIOR_WEIGHT=10`.
- 점수 매핑과 `PRIOR_WEIGHT`는 `packages/core` 상수로 관리합니다. DB에는 카운터(`up_count`/`neutral_count`/`down_count`)와 결과(`bayesian_score`)만 둡니다.
- 단순 평균이나 z-score 등으로 대체하지 않습니다. "보통"이 점수를 끌어내리는 하향력은 의도된 동작입니다.
- `RATING`은 `(user_id, place_id)` 유니크입니다. 다축 평가(aspects) 필드는 도입하지 않습니다.

### 평가 익명 집계
- 집계 점수(`PLACE_SCORE`)는 공개하되, 개별 verdict의 주인은 비공개로 유지합니다.
- 피드·프로필·타인 화면에 "누가 어떤 verdict를 줬는지"는 절대 노출하지 않습니다.

### VISIT 2층 구조
- VISIT은 두 종류로 분리합니다. 느슨한 기록용(TAP)과 검증된 평가 자격용(VERIFIED).
- `RATING` 작성 자격은 **VERIFIED VISIT**에만 부여합니다. TAP은 개인 지도·피드에만 사용합니다.

### 인증과 시크릿
- 소셜 로그인 전용(구글·카카오·네이버). 자체 비밀번호는 사용하지 않습니다.
- OAuth client secret과 Google/Places API 키는 `apps/api`에만 두고 클라이언트로 노출되지 않게 합니다.

## 코드 스타일

- 불필요한 주석은 자제합니다. 의도가 코드로 드러나지 않을 때만 주석을 답니다.
- 기본 컨벤션은 [Airbnb JavaScript/TypeScript Style Guide](https://github.com/airbnb/javascript)를 따릅니다.
- 함수는 arrow function을 사용합니다.

## 브랜치 전략

- `main`에 직접 push는 배포 직전 작업이나 간단한 작업에 한해서만 허용합니다.
- 기능 추가나 큰 단위의 작업은 새 브랜치를 열어 진행합니다.
- 브랜치 이름은 `작업단위/작업내용` 형식을 사용합니다. (예: `feature/main-page-ui`, `fix/login-error`)
- PR은 사용자가 직접 생성하며, 어시스턴트는 요청 시 PR 본문 초안만 작성합니다.

## 작업 방식

- 큰 단위 개발은 마일스톤 단위로 진행합니다. 현재 v1 로드맵은 [docs/roadmap.md](docs/roadmap.md)를 참조합니다.
- 마일스톤 단위 브랜치는 `feature/m{N}-{name}` 형식을 사용합니다. (예: `feature/m1-foundations`)
- 각 마일스톤 시작 시점에 어시스턴트가 세부 플랜을 작성하고, 사용자 승인을 받은 뒤 구현에 들어갑니다.
- 큰 변경(파일 수정·생성·리팩토링·기능 추가)은 항상 플랜 모드를 선행합니다.
- 설계 문서 §9의 "미정" 항목은 그 항목이 걸리는 마일스톤 시점에 사용자와 함께 결정합니다. 마일스톤별 매핑은 [docs/roadmap.md](docs/roadmap.md)에 정리되어 있습니다.
- 마일스톤 완료 후 사용자가 직접 PR을 생성합니다. 어시스턴트는 요청 시 PR 본문 초안만 작성합니다.

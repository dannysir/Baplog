# Baplog

가본 맛집을 사진으로 기록하는 나만의 지도 — 팔로우한 친구들과 나누고, 실제 방문 기반의 정직한 점수로 좋은 집을 발견한다.

> **설계 기준 문서:** [docs/design-v2.md](docs/design-v2.md) — "결정됨" 항목은 임의 변경 금지, "미정" 항목은 구현 전 협의.
>
> 본 README는 모노레포 셋업·실행 안내만 다룬다.

## 디렉토리 구조

```
apps/
  mobile/         # Expo (iOS / Android / Web)
  api/            # NestJS
packages/
  core/           # 베이지안 점수 계산 등 도메인 로직
  types/          # Prisma client 재노출 + 공유 DTO
  eslint-config/  # 공용 ESLint 설정
prisma/
  schema.prisma   # 단일 스키마(루트 prisma)
```

## 요구 사항

- Node.js >= 20 (권장 22)
- pnpm >= 9 (현재 사용 11.4)
- Docker (로컬 Postgres 사용 시)

## 셋업

```bash
# 1. 의존성 설치
pnpm install

# 2. 환경변수 복사 후 채우기
cp .env.example .env

# 3. (옵션) 로컬 Postgres 띄우기
docker compose up -d

# 4. Prisma client 생성
pnpm prisma:generate
```

## 자주 쓰는 명령

```bash
pnpm dev                          # 모든 워크스페이스 dev 동시 실행
pnpm typecheck                    # 모든 워크스페이스 타입 체크
pnpm test                         # 모든 워크스페이스 테스트
pnpm -F @baplog/core test         # core만 테스트
pnpm -F @baplog/api start:dev     # API만 watch 모드 실행
pnpm -F @baplog/mobile start      # Expo Dev Server
pnpm prisma:migrate               # DB 마이그레이션 (DATABASE_URL 필요)
```

## 다음 단계 체크리스트

- [ ] Supabase 프로젝트 생성 + `.env` 채움
- [ ] 첫 Prisma 마이그레이션 실행
- [ ] OAuth(구글/카카오/네이버) + JWT 발급
- [ ] Places API 백엔드 프록시
- [ ] PlaceScore 트랜잭션 갱신 + self-healing 배치
- [ ] 사진 업로드(리사이즈/EXIF 제거) + Supabase Storage 서명 URL
- [ ] 팔로우 승인 흐름 + 친구 피드

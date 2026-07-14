# JAE STUDIO

개인 디지털 프로젝트의 제작 과정, 비용, 매출, 성공과 실패를 투명하게 공개하는 Jae의 인디 메이커 포트폴리오입니다.

## Pages

- `/` — 핵심 수치, 프로젝트, 성공률, 블로그, 응원 메시지
- `/projects` — 전체 프로젝트
- `/projects/[slug]` — 프로젝트별 상세 성과
- `/blog` — 제작 기록
- `/messages` — 응원 메시지 작성
- `/admin` — 관리자 화면 초안

현재는 디자인 검증을 위한 예시 데이터를 사용합니다. `supabase/schema.sql`에는 실제 운영을 위한 데이터베이스 초안이 포함되어 있습니다.

## Local development

```sh
npm install
npm run dev
```

## Validation

```sh
npm run check
npm run build
```

## Cloudflare Pages

- Production branch: `main`
- Framework preset: `Astro`
- Build command: `npm run build`
- Build output directory: `dist`

환경 변수는 `.env.example`을 참고하세요. `service_role` 키는 절대로 프런트엔드 환경 변수에 넣지 마세요.

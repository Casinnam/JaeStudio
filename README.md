# JAE STUDIO

개인 디지털 프로젝트의 제작 과정, 비용, 매출, 성공과 실패를 투명하게 공개하는 Jae의 인디 메이커 포트폴리오입니다.

## Pages

- `/` — 핵심 수치, 프로젝트, 성공률, 블로그, 응원 메시지
- `/projects` — 전체 프로젝트
- `/projects/[slug]` — 프로젝트별 상세 성과
- `/blog` — 제작 기록
- `/messages` — 응원 메시지 작성
- `/admin` — 관리자 화면 초안

초기 화면에는 디자인 검증용 예시 데이터가 표시됩니다. Supabase에 공개 프로젝트가 등록되면 첫 페이지의 매출, 비용, 제작 기간, 프로젝트 수와 성공률은 실제 데이터로 자동 갱신됩니다. `supabase/schema.sql`에는 운영용 테이블과 RLS 정책이 포함되어 있습니다.

## Supabase setup

1. Supabase SQL Editor에서 `supabase/schema.sql` 전체를 실행합니다.
2. Authentication > Users에서 관리자 사용자를 생성합니다.
3. SQL Editor에서 아래 쿼리를 한 번 실행해 해당 사용자를 관리자로 등록합니다.

```sql
insert into public.admin_users (user_id)
select id from auth.users where email = 'YOUR_ADMIN_EMAIL';
```

관리자 등록 후 `/admin`에서 프로젝트와 블로그를 작성하고 응원 메시지를 승인할 수 있습니다.

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

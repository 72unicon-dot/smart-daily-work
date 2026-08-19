# 스마트 일일 업무

직원·관리자·시스템 관리자가 스마트폰으로 일일 업무를 작성, 보완, 승인하는 모바일 우선 웹앱입니다.

## 실행

```bash
npm install
cp .env.example .env.local
npm run dev
```

환경변수가 비어 있으면 클릭 가능한 데모 모드로 실행됩니다. 환경변수가 있으면 `SupabaseApp`이 실행되어 실제 이메일 가입·로그인, PostgreSQL 보고서 저장, 비공개 Storage 업로드, 관리자 검토, 앱 내부 알림을 사용합니다.

연결 프로젝트: `smart-daily-work` (`ap-northeast-2`)

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://hrkggduwnsvyzjllyaat.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=Supabase Connect 화면의 sb_publishable 키
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 검증

GitHub Actions CI에서 `npm ci`, TypeScript 검사, 테스트, Next.js production build를 검증합니다.

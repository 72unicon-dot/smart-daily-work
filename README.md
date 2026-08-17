# 스마트 일일 업무

직원·팀장·관리자가 스마트폰으로 일일 업무를 작성, 보완, 승인하는 모바일 우선 웹앱입니다.

## 실행

```bash
npm install
cp .env.example .env.local
npm run dev
```

환경변수가 비어 있으면 클릭 가능한 데모 모드로 실행됩니다. 환경변수가 있으면 `SupabaseApp`이 실행되어 실제 이메일 가입·로그인, PostgreSQL 보고서 저장, 비공개 Storage 업로드, 팀장 검토, 앱 내부 알림을 사용합니다.

연결 프로젝트: `smart-daily-work` (`ap-northeast-2`)

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://hrkggduwnsvyzjllyaat.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=Supabase Connect 화면의 sb_publishable 키
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Publishable Key는 프런트엔드 사용이 허용되지만 Secret Key와 Service Role Key는 절대 브라우저나 소스에 넣지 않습니다.

## 권한 흐름

- 직원: 본인 보고서 작성, 임시저장, 제출, 보완
- 팀장: 소속 직원 보고서 조회, 보완 요청, 승인
- 관리자: 전체 사용자와 보고서 관리
- 알림: 앱 내부 알림만 사용

## 구현된 데모 화면

1. 로그인 및 역할 선택
2. 직원 홈
3. 보고서 작성
4. 사진·문서 첨부
5. 제출 확인
6. 내 보고서 목록·상세
7. 보완 작성·재제출
8. 팀장 검토·승인·보완 요청
9. 관리자 현황판
10. 앱 내부 알림

## 배포

GitHub 저장소에 push 후 Vercel에서 Import하고 `.env.example`의 변수 이름을 Development/Preview/Production에 각각 등록합니다. Supabase Auth URL Configuration에 로컬 및 Vercel 주소를 추가합니다.

## 현재 범위

클릭 가능한 UI와 실제 Supabase Auth·DB·Storage 연결 코드, 입력 검증, RLS, 비공개 Storage bucket, 알림 트리거, 데모 PDF가 포함되어 있습니다. 운영 전에는 최초 관리자 계정 생성, 직원·팀장 소속 설정, 배포 URL 등록, 권한별 통합 테스트가 필요합니다.

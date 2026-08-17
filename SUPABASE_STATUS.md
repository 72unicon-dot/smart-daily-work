# Supabase 연결 상태

- 프로젝트: `smart-daily-work`
- 리전: 서울 `ap-northeast-2`
- 프로젝트 Ref: `hrkggduwnsvyzjllyaat`
- 공개 테이블: 5개, 모두 RLS 적용
- 공개 RLS 정책: 13개
- 비공개 Storage: `report-files`
- Storage 정책: 4개
- 보안 Advisor: 경고 0건
- Auth: 이메일·비밀번호 가입 및 로그인 코드 연결

## 운영 전 확인 필요

1. 첫 사용자 가입 후 해당 사용자를 `admin`으로 지정
2. 팀장 계정의 `role`을 `leader`로 지정
3. 직원 `leader_id`에 담당 팀장 연결
4. Auth Site URL 및 Redirect URL에 실제 배포 주소 등록
5. 직원·팀장·관리자 전체 흐름과 다른 사용자 접근 차단 테스트

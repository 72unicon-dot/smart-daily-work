import type {Report} from "./types";
export const demoReports:Report[]=[
 {id:"1",work_date:"2026-08-17",title:"조립 1라인 생산 및 품질 점검",work_type:"manufacturing",shift:"주간",completed:"목표 1,200대 중 1,160대 생산, 초품 검사 완료",in_progress:"포장 공정 대기 물량 80대",issues:"체결 토크 편차 3건 발견",actions:"토크렌치 재교정 및 작업자 표준 재교육",next_plan:"불량 재발 여부 집중 확인",support_request:"교정용 기준기 확보 요청",progress:92,status:"submitted",author_name:"김현장",department:"생산1팀",updated_at:"2026-08-17T17:30:00Z"},
 {id:"2",work_date:"2026-08-16",title:"월간 실적 자료 취합",work_type:"office",shift:"주간",completed:"부서별 실적 자료 8개 취합",in_progress:"경영회의 보고서 작성",issues:"영업2팀 자료 미제출",actions:"담당자에게 제출 요청",next_plan:"오전 중 보고서 완성",support_request:"없음",progress:75,status:"revision_requested",author_name:"이사무",department:"기획팀",feedback:"문제 사항에 예상 완료 시간을 추가해 주세요.",updated_at:"2026-08-16T16:20:00Z"},
 {id:"3",work_date:"2026-08-15",title:"설비 예방점검",work_type:"manufacturing",shift:"야간",completed:"컨베이어 4대 점검 및 윤활",in_progress:"없음",issues:"2호기 벨트 마모",actions:"예비품 교체 완료",next_plan:"시운전 데이터 확인",support_request:"없음",progress:100,status:"approved",author_name:"김현장",department:"생산1팀",updated_at:"2026-08-15T22:10:00Z"}
];

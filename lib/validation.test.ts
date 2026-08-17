import {describe,expect,it} from "vitest";
import {reportSchema} from "./validation";
const valid={work_date:"2026-08-17",title:"일일 생산 보고",work_type:"manufacturing",shift:"주간",completed:"생산 목표를 달성했습니다.",in_progress:"",issues:"",actions:"",next_plan:"내일 점검",support_request:"",progress:100};
describe("reportSchema",()=>{it("정상 보고서를 허용한다",()=>expect(reportSchema.safeParse(valid).success).toBe(true));it("진척도 범위를 제한한다",()=>expect(reportSchema.safeParse({...valid,progress:101}).success).toBe(false));it("빈 완료 업무를 거부한다",()=>expect(reportSchema.safeParse({...valid,completed:""}).success).toBe(false));});

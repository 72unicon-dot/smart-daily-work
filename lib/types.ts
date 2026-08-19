export type Role="employee"|"manager"|"system_admin"|"leader"|"admin";
export type Status="draft"|"submitted"|"revision_requested"|"resubmitted"|"approved";
export type IssueCategory="none"|"장애"|"품질"|"안전"|"설비"|"기타";
export type Report={
 id:string;work_date:string;title:string;work_type:"office"|"manufacturing";shift:string;
 completed:string;in_progress:string;issue_category?:IssueCategory;issues:string;
 actions:string;action_result?:string;next_plan:string;support_request:string;progress:number;
 status:Status;author_name:string;department:string;company?:string;feedback?:string;updated_at:string;
};
export const statusLabel:Record<Status,string>={draft:"임시저장",submitted:"제출",revision_requested:"보완 요청",resubmitted:"재제출",approved:"검토 완료"};
export const isManager=(role:Role)=>role==="manager"||role==="system_admin"||role==="leader"||role==="admin";
export const isSystemAdmin=(role:Role)=>role==="system_admin"||role==="admin";

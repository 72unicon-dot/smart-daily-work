export type Role="employee"|"leader"|"admin";
export type Status="draft"|"submitted"|"revision_requested"|"approved";
export type Report={id:string;work_date:string;title:string;work_type:"office"|"manufacturing";shift:string;completed:string;in_progress:string;issues:string;actions:string;next_plan:string;support_request:string;progress:number;status:Status;author_name:string;department:string;feedback?:string;updated_at:string};
export const statusLabel:Record<Status,string>={draft:"임시저장",submitted:"검토 대기",revision_requested:"보완 요청",approved:"승인 완료"};

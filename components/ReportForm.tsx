"use client";
import {useState} from "react";
import {reportSchema} from "@/lib/validation";
import type {IssueCategory,Report,Status} from "@/lib/types";

export default function ReportForm({initial,onSave,onCancel}:{initial?:Report;onSave:(r:Report)=>void;onCancel:()=>void}){
 const [v,setV]=useState({
  work_date:initial?.work_date??new Date().toISOString().slice(0,10),title:initial?.title??"",
  work_type:initial?.work_type??"office",shift:initial?.shift??"주간",completed:initial?.completed??"",
  in_progress:initial?.in_progress??"",issue_category:initial?.issue_category??"none",issues:initial?.issues??"",
  actions:initial?.actions??"",action_result:initial?.action_result??"",next_plan:initial?.next_plan??"",
  support_request:initial?.support_request??"",progress:initial?.progress??0
 });
 const [error,setError]=useState("");
 function submit(status:Status){
  const parsed=reportSchema.safeParse(v);
  if(!parsed.success){setError(parsed.error.issues[0].message);return}
  onSave({id:initial?.id??crypto.randomUUID(),...parsed.data,status,author_name:initial?.author_name??"",department:initial?.department??"",company:initial?.company??"",updated_at:new Date().toISOString()});
 }
 const field=(key:keyof typeof v,label:string,placeholder:string)=><label>{label}<textarea value={String(v[key])} placeholder={placeholder} onChange={e=>setV({...v,[key]:e.target.value})}/></label>;
 return <main className="shell"><header className="top compact"><button className="back" onClick={onCancel}>←</button><h1>일일 업무 보고서</h1><p>핵심 내용만 간결하게 기록하세요.</p></header><section className="card space"><div className="notice">스마트폰 키보드의 마이크 버튼으로 음성 입력이 가능합니다.</div><div className="form">
 <label>업무 일자<input type="date" value={v.work_date} onChange={e=>setV({...v,work_date:e.target.value})}/></label>
 <label>근무조<select value={v.shift} onChange={e=>setV({...v,shift:e.target.value})}><option>주간</option><option>야간</option><option>1조</option><option>2조</option><option>3조</option></select></label>
 <label>보고서 제목<input value={v.title} placeholder="예: 조립 1라인 생산 및 품질 점검" onChange={e=>setV({...v,title:e.target.value})}/></label>
 <label>업무 유형<select value={v.work_type} onChange={e=>setV({...v,work_type:e.target.value as "office"|"manufacturing"})}><option value="office">사무 업무</option><option value="manufacturing">제조·생산 현장</option></select></label>
 {field("completed","오늘 완료한 업무","완료 결과와 수량을 입력하세요")}
 {field("in_progress","진행 중인 업무","현재 진척 상황을 입력하세요")}
 <label>진척도: {v.progress}%<input type="range" min="0" max="100" value={v.progress} onChange={e=>setV({...v,progress:Number(e.target.value)})}/></label>
 <label>문제 유형<select value={v.issue_category} onChange={e=>setV({...v,issue_category:e.target.value as IssueCategory})}><option value="none">문제 없음</option><option>장애</option><option>품질</option><option>안전</option><option>설비</option><option>기타</option></select></label>
 {field("issues","문제 내용","발생 위치·영향·현재 상태를 입력하세요")}
 {field("actions","실시한 조치","문제 해결을 위해 실시한 조치")}
 {field("action_result","조치 결과","조치 후 결과와 남은 위험")}
 {field("next_plan","다음 업무 계획","내일 또는 다음 근무자의 업무")}
 {field("support_request","지원 요청","관리자에게 필요한 지원 사항")}
 {error&&<p className="error">{error}</p>}
 <div className="toolbar"><button className="secondary" onClick={()=>submit("draft")}>임시저장</button><button className="primary" onClick={()=>submit(initial?.status==="revision_requested"?"resubmitted":"submitted")}>다음: 첨부파일</button></div>
 </div></section></main>;
}

"use client";

import {FormEvent, useEffect, useMemo, useState} from "react";
import {createWorkTaskClient, getClientId, type WorkTask} from "@/lib/workTasks";

type Draft = {
  title: string;
  description: string;
  importance: number;
  urgency: number;
  due_date: string;
  estimated_hours: number;
};

const emptyDraft = (): Draft => ({
  title: "",
  description: "",
  importance: 2,
  urgency: 2,
  due_date: new Date().toISOString().slice(0, 10),
  estimated_hours: 1,
});

function priority(task: Pick<WorkTask,"importance"|"urgency"|"due_date">) {
  const today = new Date(); today.setHours(0,0,0,0);
  const due = new Date(`${task.due_date}T00:00:00`);
  const days = Math.ceil((due.getTime()-today.getTime())/86400000);
  let score = task.importance*2 + task.urgency*2;
  if (days < 0) score += 4; else if (days === 0) score += 3; else if (days <= 2) score += 2;
  if (score >= 12) return {label:"최우선", cls:"critical", score};
  if (score >= 8) return {label:"우선", cls:"priority", score};
  return {label:"일반", cls:"normal", score};
}

function fmtDate(v:string){
  const d=new Date(`${v}T00:00:00`);
  const today=new Date(); today.setHours(0,0,0,0);
  const diff=Math.round((d.getTime()-today.getTime())/86400000);
  if(diff===0) return "오늘";
  if(diff===1) return "내일";
  return `${String(d.getMonth()+1).padStart(2,"0")}/${String(d.getDate()).padStart(2,"0")} (${"일월화수목금토"[d.getDay()]})`;
}

export default function TaskDashboard(){
  const [tasks,setTasks]=useState<WorkTask[]>([]);
  const [draft,setDraft]=useState<Draft>(emptyDraft());
  const [editing,setEditing]=useState<string|null>(null);
  const [loading,setLoading]=useState(true);
  const [message,setMessage]=useState("");
  const [filter,setFilter]=useState("all");
  const [query,setQuery]=useState("");
  const [clientId,setClientId]=useState("");

  useEffect(()=>{const id=getClientId();setClientId(id);void load(id)},[]);

  async function load(id=clientId){
    if(!id)return;
    setLoading(true); setMessage("");
    const supabase=createWorkTaskClient(id);
    const {data,error}=await supabase.from("work_tasks").select("*").order("due_date",{ascending:true}).order("created_at",{ascending:false});
    if(error)setMessage(`업무를 불러오지 못했습니다: ${error.message}`);
    setTasks((data??[]) as WorkTask[]); setLoading(false);
  }

  async function save(e:FormEvent){
    e.preventDefault(); if(!clientId||!draft.title.trim())return;
    setMessage("저장 중..."); const supabase=createWorkTaskClient(clientId);
    const payload={...draft,title:draft.title.trim(),description:draft.description.trim(),client_id:clientId};
    const result=editing
      ? await supabase.from("work_tasks").update(payload).eq("id",editing)
      : await supabase.from("work_tasks").insert(payload);
    if(result.error){setMessage(`저장 실패: ${result.error.message}`);return;}
    setDraft(emptyDraft()); setEditing(null); setMessage("저장했습니다."); await load();
  }

  function edit(t:WorkTask){
    setEditing(t.id); setDraft({title:t.title,description:t.description,importance:t.importance,urgency:t.urgency,due_date:t.due_date,estimated_hours:Number(t.estimated_hours)});
    window.scrollTo({top:0,behavior:"smooth"});
  }

  async function toggle(t:WorkTask){
    const supabase=createWorkTaskClient(clientId);
    const {error}=await supabase.from("work_tasks").update({completed:!t.completed}).eq("id",t.id);
    if(error){setMessage(`상태 변경 실패: ${error.message}`);return;} await load();
  }

  async function remove(t:WorkTask){
    if(!confirm(`“${t.title}” 업무를 삭제할까요?`))return;
    const supabase=createWorkTaskClient(clientId);
    const {error}=await supabase.from("work_tasks").delete().eq("id",t.id);
    if(error){setMessage(`삭제 실패: ${error.message}`);return;} await load();
  }

  const stats=useMemo(()=>{
    const total=tasks.length, done=tasks.filter(t=>t.completed).length;
    const today=new Date().toISOString().slice(0,10);
    return {total,done,today:tasks.filter(t=>!t.completed&&t.due_date===today).length,rate:total?Math.round(done/total*100):0};
  },[tasks]);

  const shown=useMemo(()=>tasks.filter(t=>{
    if(filter==="open"&&t.completed)return false;
    if(filter==="done"&&!t.completed)return false;
    if(filter==="today"&&t.due_date!==new Date().toISOString().slice(0,10))return false;
    return !query||`${t.title} ${t.description}`.toLowerCase().includes(query.toLowerCase());
  }).sort((a,b)=>{
    if(a.completed!==b.completed)return a.completed?1:-1;
    const p=priority(b).score-priority(a).score; return p||a.due_date.localeCompare(b.due_date);
  }),[tasks,filter,query]);

  const chart=useMemo(()=>[35,46,62,68,77,70,stats.rate||62],[stats.rate]);

  return <div className="task-app">
    <aside className="side">
      <div className="brand"><span>⬡</span><b>스마트 일일 업무 보고</b></div>
      <nav>{["⌂ 대시보드","▣ 업무 관리","□ 캘린더","▤ 보고서","◉ 통계","♙ 팀 관리","⚙ 설정"].map((x,i)=><button key={x} className={i===0?"active":""}>{x}</button>)}</nav>
      <div className="side-tip"><div className="tip-icon">📊</div><b>업무 생산성을<br/>한 눈에 파악하세요!</b><small>중요한 업무부터 처리하고<br/>완료율을 높여보세요.</small></div>
      <div className="side-user"><span className="avatar">김</span><div><b>김민수 대리</b><small>마케팅팀</small></div></div>
    </aside>

    <main className="dashboard">
      <header className="dash-head"><div><b>김민수 대리님, 오늘도 화이팅입니다! 💪</b><small>업무 우선순위를 한눈에 확인하고 바로 실행하세요.</small></div><div className="date-pill">{new Date().toLocaleDateString("ko-KR",{year:"numeric",month:"2-digit",day:"2-digit",weekday:"short"})} 📅</div></header>

      <section className="metric-grid">
        <Metric icon="▤" title="전체 업무" value={stats.total} unit="건" foot="전체 등록된 업무" tone="blue"/>
        <Metric icon="✓" title="완료 업무" value={stats.done} unit="건" foot="완료한 업무" tone="green"/>
        <Metric icon="▣" title="오늘 마감" value={stats.today} unit="건" foot="오늘 마감되는 업무" tone="orange"/>
        <article className="metric"><div className="metric-icon blue">◔</div><div><span>완료율</span><strong>{stats.rate}<em>%</em></strong><small>{stats.done} / {stats.total}건 완료</small></div></article>
      </section>

      <section className="top-grid">
        <form className="panel task-form" onSubmit={save}>
          <div className="panel-title"><b>{editing?"업무 수정":"새 업무 등록"}</b>{message&&<small>{message}</small>}</div>
          <label>업무명 *<input required value={draft.title} onChange={e=>setDraft({...draft,title:e.target.value})} placeholder="업무명을 입력하세요"/></label>
          <label>설명<textarea value={draft.description} onChange={e=>setDraft({...draft,description:e.target.value})} placeholder="업무에 대한 설명을 입력하세요"/></label>
          <div className="field-row"><label>중요도<select value={draft.importance} onChange={e=>setDraft({...draft,importance:Number(e.target.value)})}><option value={1}>낮음</option><option value={2}>보통</option><option value={3}>높음</option></select></label><label>긴급도<select value={draft.urgency} onChange={e=>setDraft({...draft,urgency:Number(e.target.value)})}><option value={1}>낮음</option><option value={2}>보통</option><option value={3}>높음</option></select></label></div>
          <div className="field-row"><label>마감일<input type="date" value={draft.due_date} onChange={e=>setDraft({...draft,due_date:e.target.value})}/></label><label>예상시간<input type="number" min="0.5" step="0.5" value={draft.estimated_hours} onChange={e=>setDraft({...draft,estimated_hours:Number(e.target.value)})}/></label></div>
          <div className="form-buttons"><button type="button" className="ghost" onClick={()=>{setDraft(emptyDraft());setEditing(null)}}>{editing?"수정 취소":"초기화"}</button><button className="primary">{editing?"수정 저장":"등록하기"}</button></div>
        </form>

        <section className="panel chart-panel"><div className="panel-title"><b>주간 업무 완료 추이</b><small>이번 주</small></div><svg viewBox="0 0 640 260" role="img" aria-label="주간 완료율 차트"><defs><linearGradient id="fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#2563eb" stopOpacity=".18"/><stop offset="1" stopColor="#2563eb" stopOpacity="0"/></linearGradient></defs>{[40,90,140,190,240].map(y=><line key={y} x1="55" x2="620" y1={y} y2={y} stroke="#e6edf7"/>)}<polyline fill="none" stroke="#1463e6" strokeWidth="4" points={chart.map((v,i)=>`${70+i*88},${230-v*2}`).join(" ")}/><polygon fill="url(#fill)" points={`70,230 ${chart.map((v,i)=>`${70+i*88},${230-v*2}`).join(" ")} 598,230`}/>{chart.map((v,i)=><circle key={i} cx={70+i*88} cy={230-v*2} r="5" fill="white" stroke="#1463e6" strokeWidth="4"/>)}<text x="545" y={215-(chart[6]*2)} className="chart-label">{chart[6]}%</text></svg><div className="chart-days"><span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span><span>오늘</span></div></section>
      </section>

      <section className="panel list-panel"><div className="list-title"><b>업무 목록</b><div><select value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">전체 보기</option><option value="open">미완료</option><option value="done">완료</option><option value="today">오늘 마감</option></select><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="업무명 검색"/></div></div>
        {loading?<div className="empty">업무를 불러오는 중입니다...</div>:shown.length===0?<div className="empty">등록된 업무가 없습니다. 위에서 첫 업무를 추가해보세요.</div>:<div className="task-table">
          <div className="task-row task-head-row"><span></span><span>우선순위</span><span>업무명</span><span>마감일</span><span>예상시간</span><span>상태</span><span>작업</span></div>
          {shown.map(t=>{const p=priority(t);const today=t.due_date===new Date().toISOString().slice(0,10);return <div className={`task-row ${today&&!t.completed?"due-today":""} ${t.completed?"done":""}`} key={t.id}><span><input type="checkbox" checked={t.completed} onChange={()=>void toggle(t)}/></span><span><i className={`prio ${p.cls}`}>{p.label}</i></span><span className="task-name"><b>{t.title}</b><small>{t.description||"설명 없음"}</small></span><span className={today&&!t.completed?"red":""}>{fmtDate(t.due_date)}</span><span>{Number(t.estimated_hours)}시간</span><span><i className={`status ${t.completed?"complete":"pending"}`}>{t.completed?"완료":"미완료"}</i></span><span className="row-actions"><button onClick={()=>edit(t)}>✎</button><button onClick={()=>void remove(t)}>🗑</button></span></div>})}
        </div>}
        <div className="list-foot"><span>전체 {tasks.length}건</span><span>Supabase DB 저장 · 자동 동기화</span></div>
      </section>
    </main>
  </div>
}

function Metric({icon,title,value,unit,foot,tone}:{icon:string,title:string,value:number,unit:string,foot:string,tone:string}){return <article className="metric"><div className={`metric-icon ${tone}`}>{icon}</div><div><span>{title}</span><strong>{value}<em>{unit}</em></strong><small>{foot}</small></div></article>}

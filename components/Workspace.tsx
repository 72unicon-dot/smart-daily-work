"use client";
import {useState} from "react";
import SupabaseApp from "./SupabaseApp";
import ProjectsApp from "./ProjectsApp";

export default function Workspace(){
 const [mode,setMode]=useState<"reports"|"projects">("reports");
 return <div>
  <div style={{position:"sticky",top:0,zIndex:50,display:"flex",gap:8,padding:"10px 12px",background:"rgba(255,255,255,.96)",borderBottom:"1px solid #e5e7eb",backdropFilter:"blur(8px)"}}>
   <button onClick={()=>setMode("reports")} style={tab(mode==="reports")}>📝 일일 업무 보고</button>
   <button onClick={()=>setMode("projects")} style={tab(mode==="projects")}>📌 주요 프로젝트</button>
  </div>
  {mode==="reports"?<SupabaseApp/>:<ProjectsApp/>}
 </div>
}
function tab(active:boolean){return {flex:1,border:0,borderRadius:12,padding:"12px 10px",fontWeight:800,fontSize:14,cursor:"pointer",background:active?"#0f5bd8":"#eef2f7",color:active?"white":"#334155"} as const}

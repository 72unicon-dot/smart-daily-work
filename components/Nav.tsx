"use client";
export default function Nav({page,onGo}:{page:string;onGo:(p:string)=>void}){return <nav className="nav" aria-label="주요 메뉴">{[["home","⌂ 홈"],["new","＋ 작성"],["reports","▤ 보고서"],["profile","⚙ 설정"]].map(([p,l])=><button key={p} className={page===p?"active":""} onClick={()=>onGo(p)}>{l}</button>)}</nav>}

"use client";
import {useEffect,useState} from "react";
type InstallPromptEvent=Event&{prompt:()=>Promise<void>;userChoice:Promise<{outcome:"accepted"|"dismissed"}>};
export default function PwaInstaller(){
  const [prompt,setPrompt]=useState<InstallPromptEvent|null>(null);const [showIosHelp,setShowIosHelp]=useState(false);
  const [isIos,setIsIos]=useState(false);const [installed,setInstalled]=useState(true);
  useEffect(()=>{
    if("serviceWorker" in navigator)navigator.serviceWorker.register("/sw.js").catch(()=>undefined);
    const nav=navigator as Navigator&{standalone?:boolean};
    setInstalled(window.matchMedia("(display-mode: standalone)").matches||nav.standalone===true);
    setIsIos(/iphone|ipad|ipod/i.test(navigator.userAgent));
    const onPrompt=(event:Event)=>{event.preventDefault();setPrompt(event as InstallPromptEvent);setInstalled(false);};
    const onInstalled=()=>{setInstalled(true);setPrompt(null);};
    window.addEventListener("beforeinstallprompt",onPrompt);window.addEventListener("appinstalled",onInstalled);
    return()=>{window.removeEventListener("beforeinstallprompt",onPrompt);window.removeEventListener("appinstalled",onInstalled);};
  },[]);
  if(installed||(!prompt&&!isIos))return null;
  const install=async()=>{if(prompt){await prompt.prompt();const choice=await prompt.userChoice;if(choice.outcome==="accepted")setInstalled(true);setPrompt(null);return;}setShowIosHelp(value=>!value);};
  return <aside className="pwa-install" aria-live="polite"><button type="button" onClick={install}>＋ 앱 설치</button>{showIosHelp&&<p>Safari의 <b>공유</b> 버튼을 누른 뒤 <b>홈 화면에 추가</b>를 선택하세요.</p>}</aside>;
}

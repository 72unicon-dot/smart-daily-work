import type {MetadataRoute} from "next";
export default function manifest():MetadataRoute.Manifest{return {
  name:"스마트 일일 업무",short_name:"스마트 업무",description:"직원·팀장·관리자가 함께 쓰는 모바일 일일 업무 보고",
  start_url:"/",display:"standalone",background_color:"#edf3f9",theme_color:"#082b67",orientation:"portrait",lang:"ko-KR",
  categories:["business","productivity"],icons:[
    {src:"/icons/app-icon.svg",sizes:"any",type:"image/svg+xml",purpose:"any"},
    {src:"/icons/app-icon.svg",sizes:"any",type:"image/svg+xml",purpose:"maskable"}
  ]
};}

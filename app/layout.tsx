import type {Metadata,Viewport} from "next";
import PwaInstaller from "@/components/PwaInstaller";
import "./globals.css";
import "./pwa.css";

export const metadata:Metadata={
  title:"스마트 일일 업무",description:"직원·팀장·관리자가 함께 쓰는 모바일 일일 업무 보고",
  applicationName:"스마트 일일 업무",manifest:"/manifest.webmanifest",
  appleWebApp:{capable:true,statusBarStyle:"default",title:"스마트 일일 업무"},
  icons:{icon:"/icons/app-icon.svg",apple:"/icons/app-icon.svg"}
};
export const viewport:Viewport={width:"device-width",initialScale:1,viewportFit:"cover",themeColor:"#082b67"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ko"><body>{children}<PwaInstaller/></body></html>}

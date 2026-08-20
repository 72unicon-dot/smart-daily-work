import App from "@/components/App";
import Workspace from "@/components/Workspace";
import {isConfigured} from "@/lib/supabase";
export default function Page(){return isConfigured?<Workspace/>:<App/>}

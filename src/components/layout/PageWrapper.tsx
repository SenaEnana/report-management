import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,

} from "@/components/ui/sidebar"
import Header from "./Header"
import Navbar from './Navbar';
import { Toaster } from "../ui/toaster";


export default function PageWrapper({children}:any) {
  const breadCrumbItems = [{
    name: 'Dashboard',
    href: '/'
  }, {
    name: 'Data Fetching',
    href: '#'
  }];
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        
        <Navbar/>
        <Header breadCrumbItems={breadCrumbItems}/>
        <main className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-4 p-4">
            {children}
          </div>
        </main>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  )
}
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb";
  
  import { Separator } from "@/components/ui/separator";
  
  import { SidebarTrigger } from "@/components/ui/sidebar";
  import {Link} from "react-router-dom";
import React from "react";
  
  export default function Header({ breadCrumbItems }: { breadCrumbItems: Array<{ name: string; href?: string }> }) {
    return (
      <>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadCrumbItems.map((item, index) => (
                  <React.Fragment key={index}>
                    <BreadcrumbItem className={index < breadCrumbItems.length - 1 ? "hidden md:block" : ""}>
                      {item.href ? (
                        // <BreadcrumbLink href={item.href}>{item.name}</BreadcrumbLink>
                        <Link to={item.href}>{item.name}</Link> 
                      ) : (
                        <BreadcrumbPage>{item.name}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                    {index < breadCrumbItems.length - 1 && (
                      <BreadcrumbSeparator className="hidden md:block" />
                    )}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
      </>
    );
  }
  
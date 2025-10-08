import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronRight, LucideIcon } from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  items?: {
    title: string;
    url: string;
  }[];
}

interface NavMainProps {
  items: NavItem[];
  mainNavTitle: string;
}

export function NavMain({ items, mainNavTitle }: NavMainProps) {
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState<string[]>([]);

  useEffect(() => {
    const activeParent = items.find(item =>
      item.url !== "#" && location.pathname.startsWith(item.url)
    );
    if (activeParent && !openGroups.includes(activeParent.title)) {
      setOpenGroups(prev => [...prev, activeParent.title]);
    }
  }, [location.pathname, items]);


  const toggleGroup = (title: string) => {
    setOpenGroups(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{mainNavTitle}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const hasSubItems = item.items && item.items.length > 0;
          // const isParentOfActive = item.items?.some(
          //   subItem => location.pathname === subItem.url
          // );
          const isParentActive = location.pathname.startsWith(item.url) && item.url !== "#";
          const isOpen = openGroups.includes(item.title);

          return (
            <SidebarMenuItem key={item.title}>
              {hasSubItems ? (
                <Collapsible
                  open={isOpen}
                  onOpenChange={() => toggleGroup(item.title)}
                  className={`group/collapsible ${isParentActive ? 'bg-[#F9A8251C] hover:bg-[#F9A8251C]' : ''}`}
                >
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className={`relative ${isParentActive
                        ? 'text-[#F9A825] hover:bg-[#F9A8251C] hover:text-[#F9A825] font-semibold before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-[#F9A825]'
                        : ''
                        }`}
                    >
                      {item.icon && <item.icon className={isParentActive ? 'text-orange-400' : ''} />}
                      <span>{item.title}</span>
                      <ChevronRight
                        className={`ml-auto transition-transform duration-200 ${isOpen ? "rotate-90" : ""
                          } ${isParentActive ? 'text-orange-500' : ''}`}
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <NavLink
                            to={subItem.url}
                            className={() =>
                              `w-full ${location.pathname.startsWith(subItem.url) ? 'text-[#F9A825] font-semibold ' : ''}`
                            }
                          >
                            {({ isActive }) => (
                              <SidebarMenuSubButton
                                asChild
                                isActive={isActive}
                                className={isActive ? 'text-[#F9A825]' : ''}
                              >
                                <span>{subItem.title}</span>
                              </SidebarMenuSubButton>
                            )}
                          </NavLink>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <NavLink
                  to={item.url}
                  className={({ isActive }) =>
                    `flex items-center gap-2 w-full bg-[#F9A8251C] ${isActive
                      ? 'border border-[#F9A825] rounded-md font-semibold'
                      : ''
                    }`
                  }
                >
                  {({ isActive }) => (
                    <SidebarMenuButton
                      tooltip={item.title}
                      className={`${isActive ? 'text-[#F9A825]' : ''}`}
                    >
                      {item.icon && <item.icon className={isActive ? 'text-[#F9A825]' : ''} />}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  )}
                </NavLink>
              )}
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}


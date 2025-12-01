import * as React from "react";
import {
  Store,
  ChartArea,
  LayoutDashboard,
  Users,
  School,
} from "lucide-react";
import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import nibLogo from "@/assets/svg/imageeeeu.png";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const data = {
  navMain: [
    { title: "Dashboard", url: "/", icon: LayoutDashboard },
    {
      title: "User Management",
      url: "/user",
      icon: Users,
      items: [
        { title: "View User", url: "/user/view" },
        { title: "Create User", url: "/user/create" },
      ],
    },
    {
      title: "Merchant Management",
      url: "/merchant",
      icon: Store,
      items: [
        { title: "View Merchant", url: "/merchant/view" },
        { title: "Create Merchant", url: "/merchant/create" },
      ],
    },
    {
      title: "Branch Management",
      url: "/branch",
      icon: School,
      items: [
        { title: "View Branch", url: "/branch/view" },
        { title: "Create Branch", url: "/branch/create" },
      ],
    },
    {
      title: "District Management",
      url: "/district",
      icon: School,
      items: [
        { title: "View District", url: "/district/view" },
        { title: "Create District", url: "/district/create" },
      ],
    },
    {
      title: "Reports",
      url: "/reports",
      icon: ChartArea,
      items: [
        { title: "Import Merchant Report", url: "/reports/merchant-pos/import-report" },
        { title: "View Merchant Report", url: "/reports/merchant-pos/view" },
        { title: "Import Branch Report", url: "/reports/branch-pos/import-report" },
        { title: "View Branch Report", url: "/reports/branch-pos/view" },
      ],
    },
    {
      title: "Histories",
      url: "/histories",
      icon: ChartArea,
      items: [
        { title: "Merchant History", url: "/histories/merchant-pos/merchant-history" },
        { title: "Branch History", url: "/histories/branch-pos/branch-history" },
      ],
    },
    {
      title: "Missed Report",
      url: "/missed",
      icon: ChartArea,
      items: [
        { title: "Missed Terminal Date", url: "/missed/missed-terminal-date/view" },
        { title: "Missed Branch Date", url: "/missed/missed-branch-date/view" },        
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const role = useSelector((state: RootState) => state.user.role);

const filteredNav = data.navMain
  .map((item) => {
    if (role !== "admin" && item.title === "User Management") {
      return null;
    }

    if (role === "admin") {
      return item;
    }

    if (item.title === "Reports") {
      return item;
    }

    if (item.title === "Histories") {
      return item;
    }

    if (item.title === "Missed Report") {
      return item;
    }

    if (item.items) {
      const filteredItems = item.items.filter((sub) =>
        sub.title.toLowerCase().includes("view")
      );

      if (filteredItems.length === 0) return null;

      return { ...item, items: filteredItems };
    }

    return item;
  })
  .filter(Boolean) as typeof data.navMain;
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex justify-center">
          <img src={nibLogo} alt="NIB Logo" className="h-18 w-20" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNav} mainNavTitle="Menu" />
      </SidebarContent>
      <SidebarFooter />
      <SidebarRail />
    </Sidebar>
  );
}

import * as React from "react";
import {
  AudioWaveform,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  Store,
  PieChart,
  ChartArea,
  LayoutDashboard,
  Users, School,
  Trash2
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

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Merchant POS",
      url: "/merchant",
      icon: Store,
      isActive: true,
      items: [
        {
          title: "View POS",
          url: "/merchant/view",
        },
      ],
    },
        {
      title: "Branch POS",
      url: "/branch",
      icon: School,
      isActive: true,
      items: [
        {
          title: "View POS",
          url: "/branch/view",
        },
      ],
    },
    {
      title: "User Management",
      url: "/user",
      icon: Users,
      isActive: true,
      items: [
        {
          title: "View User",
          url: "/user/view",
        },
        {
          title: "Roles",
          url: "/user/role/view",
        },
        {
          title: "Settings",
          url: "/user/settings",
        },
      ],
    },

    {
      title: "Reports",
      url: "/reports",
      icon: ChartArea,
      items: [
        {
          title: "Merchant Report",
          url: "/reports/import-report",
        },
        {
          title: "View Merchant Report",
          url: "/reports/view-report-table",
        },
                {
          title: "Branch Report",
          url: "/reports/import-report",
        },
        {
          title: "View Branch Report",
          url: "/reports/view-report-table",
        },
      ],
    },
    {
      title: "Trashed",
      url: "/trashed",
      icon: Trash2,
      isActive: true,
      items: [
        {
          title: "Merchant Reports",
          url: "/trashed/academic-year",
        },
        {
          title: "Branch Reports",
          url: "/trashed/admission-type",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* <TeamSwitcher teams={data.teams} /> */}
        <div className="flex justify-center">
          <img src={nibLogo} alt="NIB Logo" className="h-18 w-20" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} mainNavTitle="Menu" />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

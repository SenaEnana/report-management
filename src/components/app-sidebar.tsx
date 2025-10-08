import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  IdCard,
  ChartArea,
  LayoutDashboard,
  Users, School,
  Calendar,
  Flag,
  ReceiptText,
  TableColumnsSplit,
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

import huLogo from "@/assets/svg/hu.svg";

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
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Campuses",
      url: "/campus",
      icon: School,
      isActive: true,
      items: [
        {
          title: "View Campus",
          url: "/campus/view",
        },
      ],
    },
    {
      title: "Applicants",
      url: "/applicant",
      icon: Users,
      isActive: true,
      items: [
        {
          title: "View Applicant",
          url: "/applicant/view",
        },
        {
          title: "View Degree Applicant",
          url: "/applicant/applicant-degree/view",
        },
        {
          title: "Settings",
          url: "/applicant/settings",
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
          title: "Permissions",
          url: "/user/permission/view",
        },
        {
          title: "Genders",
          url: "/user/gender/view",
        },
      ],
    },

    {
      title: "Faculties",
      url: "/faculty",
      icon: TableColumnsSplit,
      isActive: true,
      items: [
        {
          title: "Faculties",
          url: "/faculty/view",
        },
        {
          title: "Departments",
          url: "/faculty/department/view",
        },
      ],
    },
    {
      title: "Curriculums",
      url: "/curriculum",
      icon: Calendar,
      isActive: true,
      items: [
        {
          title: "Academic Years",
          url: "/curriculum/academic-year/view",
        },
        {
          title: "Batch Years",
          url: "/curriculum/batch-year/view",
        },
        {
          title: "Admission Types",
          url: "/curriculum/admission-type/view",
        },
        {
          title: "Programs",
          url: "/curriculum/program/view",
        },
        {
          title: "Curriculums",
          url: "/curriculum/view",
        },
        {
          title: "Campus Curriculums",
          url: "/curriculum/campus-curriculum/view",
        },
      ],
    },
    {
      title: "Students",
      url: "/student",
      icon: Users,
      items: [
        {
          title: "Genesis",
          url: "/student/genesis",
        },
        {
          title: "Explorer",
          url: "/student/explorer",
        },
        {
          title: "Quantum",
          url: "/student/quantum",
        },
      ],
    },
    {
      title: "Sections",
      url: "/sections",
      icon: BookOpen,
      items: [
        {
          title: "Create Section",
          url: "/sections/create",
        },
        {
          title: "View Section",
          url: "/sections/view",
        },
      ],
    },
    {
      title: "Instructor",
      url: "/instructor",
      icon: Bot,
      items: [
        {
          title: "Create New Instructor",
          url: "/instructor/create",
        },
      ],
    },
    {
      title: "Slip",
      url: "/slip",
      icon: ReceiptText,
      items: [
        {
          title: "Courses",
          url: "/slip/course/view",
        },
        {
          title: "Years",
          url: "/slip/year/view",
        },
        {
          title: "Semester",
          url: "/slip/semester/view",
        },
        {
          title: "Slips",
          url: "/slip/view",
        },
        {
          title: "Campus Curriculum Slip",
          url: "/slip/campus-curriculum-slip/view",
        },
      ],
    },
    {
      title: "ID Cards",
      url: "/id-card",
      icon: IdCard,
      items: [
        {
          title: "General",
          url: "/id-card/general",
        },
        {
          title: "Team",
          url: "/id-card/team",
        },
        {
          title: "Billing",
          url: "/id-card/billing",
        },
        {
          title: "Limits",
          url: "/id-card/limits",
        },
      ],
    },
    {
      title: "Modules",
      url: "/modules",
      icon: BookOpen,
      items: [
        {
          title: "Create Modules",
          url: "/modules/create",
        },
      ],
    },
    {
      title: "Country",
      url: "/country",
      icon: Flag,
      isActive: true,
      items: [
        {
          title: "Countries",
          url: "/country/view",
        },
        {
          title: "Region",
          url: "/country/region/view",
        },
      ],
    },

    {
      title: "Reports",
      url: "/reports",
      icon: ChartArea,
      items: [
        {
          title: "General",
          url: "/reports/general",
        },
        {
          title: "Team",
          url: "/reports/team",
        },
        {
          title: "Billing",
          url: "/reports/billing",
        },
        {
          title: "Limits",
          url: "/reports/limits",
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
          title: "Academic Year",
          url: "/trashed/academic-year",
        },
        {
          title: "Admission Type",
          url: "/trashed/admission-type",
        },
        {
          title: "Applicant",
          url: "/trashed/applicant",
        },
        {
          title: "Batch Year",
          url: "/trashed/batch-year",
        },
        {
          title: "Campus",
          url: "/trashed/campus",
        },
        {
          title: "Campus Curriculum",
          url: "/trashed/campus-curriculum",
        },
        {
          title: "Country",
          url: "/trashed/country",
        },
        {
          title: "Course",
          url: "/trashed/course",
        },
        {
          title: "Curriculum",
          url: "/trashed/curriculum",
        },
        {
          title: "Department",
          url: "/trashed/department",
        },
        {
          title: "Faculty",
          url: "/trashed/faculty",
        },
        {
          title: "Gender",
          url: "/trashed/gender",
        },
        {
          title: "Program",
          url: "/trashed/program",
        },
        {
          title: "Region",
          url: "/trashed/region",
        },
        {
          title: "Section",
          url: "/trashed/section",
        },
        {
          title: "Semester",
          url: "/trashed/semester",
        },
        {
          title: "Slip",
          url: "/trashed/slip",
        },
        {
          title: "User",
          url: "/trashed/user",
        },
        {
          title: "Year",
          url: "/trashed/year",
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
          <img src={huLogo} alt="HU Logo" className="h-18 w-20" />
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

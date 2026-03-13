import React from "react";
import { 
  ClipboardCheck, 
  LayoutGrid, 
  Fuel, 
  Car, 
  Wheat, 
  Users2 
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "./ui/Sidebar";
import { NavMain } from "./NavMain";
import { NavUser } from "./NavUser";

const ApproverSidebar = () => {
  const navItems = [
    {
      title: "Dashboard",
      url: "/approver/dashboard",
      icon: LayoutGrid,
    },
    {
      title: "Attendants",
      url: "/approver/attendants",
      icon: Fuel,
    },
    {
      title: "Drivers",
      url: "/approver/drivers",
      icon: Car,
    },
    {
      title: "Farmers",
      url: "/approver/farmers",
      icon: Wheat,
    },
    {
      title: "Others",
      url: "/approver/others",
      icon: Users2,
    },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-4">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ClipboardCheck className="size-4" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
            <span className="font-semibold">Nigd Bureau</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Approver Admin</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain label="Verification" items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default ApproverSidebar;

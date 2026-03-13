import React from "react";
import { 
  LayoutDashboard, 
  Fuel, 
  Users, 
  History, 
  BarChart3
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

const OwnerSidebar = () => {
  const navItems = [
    {
      title: "Dashboard",
      url: "/owner/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Attendants",
      url: "/owner/attendant",
      icon: Users,
    },
    {
      title: "Fuel Inflow",
      url: "/owner/fuel-received",
      icon: Fuel,
    },
    {
      title: "Transactions",
      url: "/owner/transactions",
      icon: History,
    },
    {
      title: "Analytics",
      url: "/owner/reports",
      icon: BarChart3,
    },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-4">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <LayoutDashboard className="size-4" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
            <span className="font-semibold">Nigd Bureau</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Station Owner</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain label="Owner Portal" items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default OwnerSidebar;

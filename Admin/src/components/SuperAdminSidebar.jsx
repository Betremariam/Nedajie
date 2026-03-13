import React from "react";
import { 
  LayoutGrid, 
  Users, 
  Fuel, 
  History, 
  Users2,
  Activity
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
import { Logo } from "./Logo";

const SuperAdminSidebar = () => {
  const navItems = [
    {
      title: "Dashboard",
      url: "/super-admin/dashboard",
      icon: LayoutGrid,
    },
    {
      title: "Admins",
      url: "/super-admin/manage-admins",
      icon: Users,
    },
    {
      title: "Fuel Stock",
      url: "/super-admin/fuel-stock",
      icon: Fuel,
    },
    {
      title: "History",
      url: "/super-admin/transactions",
      icon: History,
    },
    {
      title: "Users",
      url: "/super-admin/users-list",
      icon: Users2,
    },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-4">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Activity className="size-4" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
            <span className="font-semibold">Nigd Bureau</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Super Admin</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain label="Management" items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default SuperAdminSidebar;

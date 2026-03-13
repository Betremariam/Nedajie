import React from "react";
import { 
  LayoutGrid,
  Fuel, 
  UserPlus, 
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

const RegisterAdminSidebar = () => {
  const navItems = [
    {
      title: "Dashboard",
      url: "/register/register-dashboard",
      icon: LayoutGrid,
    },
    {
      title: "Attendants",
      url: "/register/attendant-registration",
      icon: Fuel,
    },
    {
      title: "Drivers",
      url: "/register/driver-registration",
      icon: Car,
    },
    {
      title: "Farmers",
      url: "/register/farmer-registration",
      icon: Wheat,
    },
    {
      title: "Others",
      url: "/register/other-registration",
      icon: Users2,
    },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-4">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <UserPlus className="size-4" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
            <span className="font-semibold">Nigd Bureau</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Registry Admin</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain label="Enrollment" items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default RegisterAdminSidebar;

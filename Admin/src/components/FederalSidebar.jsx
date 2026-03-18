import React from "react";
import { 
  LayoutGrid, 
  Users, 
  Fuel, 
  UserPlus,
  Activity,
  Truck
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

const FederalSidebar = () => {
  const navItems = [
    {
      title: "Dashboard",
      url: "/federal/dashboard",
      icon: LayoutGrid,
    },
    {
      title: "Super Admins",
      url: "/federal/manage-super-admins",
      icon: Users,
    },
    {
      title: "Owners",
      url: "/federal/manage-owners",
      icon: UserPlus,
    },
    {
      title: "Fuel Deliveries",
      url: "/federal/fuel-deliveries",
      icon: Truck,
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
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Federal Admin</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain label="Federal Ops" items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default FederalSidebar;

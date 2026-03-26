import React from "react";
import { 
  LayoutGrid, 
  Users, 
  Fuel, 
  UserPlus,
  Activity,
  Truck,
  Lock
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
        <div className="flex items-center gap-3 px-4 py-6 border-b border-white/5">
          <div className="flex aspect-square size-10 items-center justify-center rounded-full bg-white shadow-md relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-b from-amber-300 to-amber-500 rounded-full scale-[0.6] drop-shadow-sm flex items-center justify-center">
                 <div className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 opacity-80" />
             </div>
          </div>
          <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
            <span className="font-bold text-[15px] tracking-tight text-white drop-shadow-sm">Nigd Bureau</span>
            <span className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase mt-0.5">Federal Admin</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain label="Federal Ops" items={navItems} />
      </SidebarContent>
      <SidebarFooter className="p-4 gap-4 pb-6">
        <NavUser />
        
        <div className="flex flex-col items-center gap-3 mt-2 text-center">
           <p className="text-[10px] text-slate-400 font-medium">© 2025 Fuel Control System</p>
           <div className="flex items-center gap-1.5 bg-[#0f172a] border border-emerald-900/30 text-emerald-500 rounded-full px-4 py-1.5 opacity-80 backdrop-blur-sm">
             <Lock className="w-3 h-3" />
             <span className="text-[10px] font-semibold tracking-wide">Secure & Encrypted</span>
           </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default FederalSidebar;

import * as React from "react";
import { Separator } from "./ui/Separator";
import { SidebarTrigger } from "./ui/Sidebar";
import { ModeToggle } from "./ModeToggle";

const ROLE_LABELS = {
  federal:      "Federal Admin Portal",
  super:        "Super Admin Portal",
  superadmin:   "Super Admin Portal",
  register:     "Registry Admin Portal",
  approver:     "Approver Portal",
  stationOwner: "Station Owner Portal",
};

export function SiteHeader() {
  const adminData = JSON.parse(localStorage.getItem("admin") || "{}");
  const name      = adminData.name  || "Admin";
  const initials  = name.charAt(0).toUpperCase() || "A";
  const roleLabel = ROLE_LABELS[adminData.role] || "Admin Portal";

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear bg-background/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="flex w-full items-center gap-1 px-4 py-3 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />

        <div className="flex-1 flex items-center justify-between">
          {/* Brand */}
          <div className="flex flex-col">
            <h1 className="text-sm font-bold tracking-tight text-foreground leading-none">
              Fuel Control <span className="text-primary">System</span>
            </h1>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mt-0.5">
              Efficiency redefined
            </span>
          </div>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-4">
            {/* User greeting */}
            <div className="hidden md:flex flex-col items-end border-r pr-6 border-border">
              <p className="text-sm font-semibold text-foreground">
                Welcome, {name}
              </p>
              <p className="text-xs text-primary font-semibold">{roleLabel}</p>
            </div>

            <div className="flex items-center gap-3">
              <ModeToggle />
              {/* Avatar */}
              <div className="group relative cursor-pointer">
                <div className="h-9 w-9 rounded-full bg-primary p-[2px] transition-transform hover:scale-105 active:scale-95">
                  <div className="h-full w-full rounded-full bg-card flex items-center justify-center text-primary font-semibold border-2 border-background">
                    {initials}
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-background shadow-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

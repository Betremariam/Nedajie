import React from "react";
import {
  Users,
  Truck,
  ShieldCheck,
  Activity,
  ArrowUpRight,
  Globe,
  Map,
  FileCheck,
  Building2,
  Navigation,
  Clock,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "../../lib/utils";

const FederalDashboard = () => {
  const stats = [
    { label: "Regional Super Admins", value: "12",      icon: Globe,      trend: "Active Nodes",   color: "blue",    desc: "Provincial oversight" },
    { label: "Verified Station Owners", value: "84",    icon: Building2,  trend: "Validated",      color: "emerald", desc: "Entity level auth" },
    { label: "National Fuel Dispatch",  value: "312",   icon: Truck,      trend: "+24% increase",  color: "amber",   desc: "Weekly logistics flow" },
    { label: "Regulatory Compliance",   value: "Optimal", icon: ShieldCheck, trend: "Audited",     color: "purple",  desc: "Standard alignment" },
  ];

  const recentDeliveries = [
    { id: 1, destination: "Addis North Terminal",   volume: "20,000L", status: "PENDING",            time: "10 mins ago",  icon: Navigation },
    { id: 2, destination: "Nazreth Logistics Hub",  volume: "15,000L", status: "SUPERADMIN_ACCEPTED", time: "1 hour ago",   icon: Activity },
    { id: 3, destination: "Bahir Dar Depot",        volume: "10,000L", status: "OWNER_ACCEPTED",      time: "3 hours ago",  icon: FileCheck },
  ];

  const iconBg = {
    blue:    "bg-blue-500/10 text-blue-500",
    emerald: "bg-emerald-500/10 text-emerald-500",
    amber:   "bg-amber-500/10 text-amber-500",
    purple:  "bg-purple-500/10 text-purple-500",
  };

  const statusStyle = {
    OWNER_ACCEPTED:      { icon: "bg-emerald-500/10 text-emerald-500", badge: "text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20" },
    SUPERADMIN_ACCEPTED: { icon: "bg-blue-500/10 text-blue-500",       badge: "text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-500/10 dark:border-blue-500/20" },
    PENDING:             { icon: "bg-amber-500/10 text-amber-500",     badge: "text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/20" },
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto font-sans">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-primary" />
            <span className="text-[11px] font-bold tracking-wider uppercase text-primary/80">
              Federal Authority Layer
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            National Command Center
          </h1>
          <p className="text-muted-foreground text-[14px] font-medium max-w-xl">
            Unified oversight for strategic fuel reserves and regional distribution networks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex -space-x-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground shadow-sm"
              >
                AD
              </div>
            ))}
          </div>
          <button className="h-10 px-5 flex items-center gap-2 rounded-xl bg-primary text-primary-foreground text-[13px] font-bold hover:bg-primary/90 transition-colors shadow-sm">
            Export National Report
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-card rounded-[24px] shadow-sm border border-border p-6 relative overflow-hidden group hover:border-border transition-all duration-300"
          >

            <div className="flex flex-row items-center justify-between pb-4 relative z-10">
              <h3 className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
                {stat.label}
              </h3>
              <div className={cn("p-2 rounded-xl transition-colors", iconBg[stat.color])}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>

            <div className="relative z-10">
              <div className="text-3xl font-black tracking-tight text-foreground mb-1">
                {stat.value}
              </div>
              <div className="flex flex-wrap items-center justify-between mt-2 gap-2">
                <p className="text-[11px] font-medium text-muted-foreground">{stat.desc}</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md border text-blue-600 bg-blue-500/10 border-blue-500/20 dark:text-blue-400">
                  {stat.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">

        {/* Map placeholder */}
        <div className="col-span-4 bg-card rounded-[24px] shadow-sm border border-border flex flex-col overflow-hidden relative">
          <div className="p-6 md:p-8 border-b border-border flex flex-row items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold tracking-tight text-foreground">
                Regional Distribution Matrix
              </h2>
              <p className="text-muted-foreground text-[13px] font-medium">
                Strategic fuel quota allocation across domestic administrative zones.
              </p>
            </div>
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
              <Map className="w-6 h-6" />
            </div>
          </div>

          <div className="h-[340px] flex items-center justify-center relative bg-muted/30 m-6 mb-8 rounded-[24px] border border-dashed border-border overflow-hidden">
            <div className="text-center space-y-4 relative z-10 transition-transform duration-300">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/20">
                <Globe className="h-10 w-10 text-primary/50" />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-bold text-foreground">Interactive Mapping Layer</p>
                <p className="text-[12px] text-muted-foreground font-medium px-12 max-w-sm">
                  Synchronizing geospatial telemetry from regional depots. Database reconciliation in progress.
                </p>
              </div>
              <button className="h-9 px-6 bg-card border border-border text-foreground rounded-xl text-[11px] uppercase font-bold tracking-widest hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-sm">
                Initialize Layer
              </button>
            </div>
            {/* Decorative SVG */}
            <div className="absolute inset-0 opacity-10 select-none pointer-events-none text-primary">
              <svg className="w-full h-full" viewBox="0 0 100 100" fill="currentColor">
                <circle cx="20" cy="30" r="1" />
                <circle cx="50" cy="80" r="1.5" />
                <circle cx="80" cy="40" r="0.8" />
                <path d="M20 30 L50 80 L80 40" stroke="currentColor" strokeWidth="0.2" fill="none" />
              </svg>
            </div>
          </div>
        </div>

        {/* Deliveries list */}
        <div className="col-span-3 bg-card rounded-[24px] shadow-sm border border-border flex flex-col overflow-hidden">
          <div className="p-6 md:p-8 border-b border-border">
            <h2 className="text-xl font-extrabold tracking-tight text-foreground">
              Disbursement Stream
            </h2>
            <p className="text-muted-foreground text-[13px] font-medium mt-1">
              Live telemetry from national supply chain nodes.
            </p>
          </div>

          <div className="p-4 md:p-6 space-y-3 flex-1 overflow-y-auto">
            {recentDeliveries.map((item) => {
              const style = statusStyle[item.status] || statusStyle.PENDING;
              return (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl hover:bg-muted/50 transition-all group cursor-pointer border border-transparent hover:border-border"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn("h-12 w-12 rounded-[14px] flex items-center justify-center transition-all", style.icon)}>
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                        {item.destination}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider", style.badge)}>
                          {item.status.replace("_", " ")}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.time}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="sm:text-right ml-16 md:ml-0 flex items-center sm:block gap-2 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                    <p className="text-[14px] font-black text-foreground tabular-nums">{item.volume}</p>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 ml-auto sm:mt-1 group-hover:text-primary transition-colors flex-shrink-0" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 border-t border-border bg-muted/30">
            <button className="w-full h-11 text-[12px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-colors">
              View National Logistics Ledger
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FederalDashboard;

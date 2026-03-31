import React from "react";
import {
  TrendingUp,
  Fuel,
  History,
  Droplets,
  Zap,
  Activity,
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
  Clock,
  MapPin,
  ChevronRight,
  Package,
} from "lucide-react";
import { cn } from "../../lib/utils";

const Dashboard = () => {
  const stats = [
    { label: "Total Volume", value: "42,850 L", icon: Droplets, trend: "+12.4%", color: "emerald", desc: "Benzene & Diesel" },
    { label: "Daily Sales", value: "ETB 1.2M", icon: TrendingUp, trend: "+8.2%", color: "blue", desc: "Total revenue today" },
    { label: "Attendants", value: "12", icon: Users, trend: "Stable", color: "purple", desc: "Active on shifts" },
    { label: "Stock Level", value: "84%", icon: Package, trend: "Optimal", color: "amber", desc: "Storage capacity" },
  ];

  const recentDeliveries = [
    { id: 1, type: "Benzene", vol: "5,000 L", time: "2 hours ago", status: "Received", icon: Zap },
    { id: 2, type: "Diesel", vol: "12,000 L", time: "Yesterday", status: "Verified", icon: History },
    { id: 3, type: "Benzene", vol: "4,500 L", time: "3 days ago", status: "Verified", icon: History },
  ];

  const iconBg = {
    blue: "bg-primary/10 text-primary",
    emerald: "bg-emerald-500/10 text-emerald-500",
    amber: "bg-amber-500/10 text-amber-500",
    purple: "bg-purple-500/10 text-purple-500",
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto font-sans">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-foreground" />
            <span className="text-[11px] font-bold tracking-wider uppercase text-primary/80">Station Proprietor Node</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground flex items-center gap-3">
             Station Overview
          </h1>
          <p className="text-muted-foreground text-[14px] font-medium max-w-xl">Real-time asset telemetry and inventory management.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center justify-center text-foreground">
              <Activity className="h-8 w-8" />
           </div>
           <button className="h-11 px-6 flex items-center gap-2 rounded-xl bg-primary text-primary-foreground text-[13px] font-bold hover:bg-primary/90 transition-all shadow-sm">
             <Droplets className="w-4 h-4 opacity-80" />
             New Delivery Check
           </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card rounded-[24px] shadow-sm border border-border p-6 relative overflow-hidden group hover:border-border transition-all duration-300">
            <div className="flex flex-col gap-4 relative z-10">
              <div className="p-0 rounded-xl transition-colors">
                <stat.icon className="h-10 w-10 text-foreground" />
              </div>
              <div className="space-y-1">
                <h3 className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
                  {stat.label}
                </h3>
                <div className="text-3xl font-bold tracking-tight text-foreground">
                  {stat.value}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">

        {/* Inventory Analytics */}
        <div className="col-span-4 bg-card rounded-[24px] shadow-sm border border-border flex flex-col overflow-hidden group/analytics shadow-sm">
          <div className="p-6 md:p-8 border-b border-border flex flex-row items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold tracking-tight text-foreground flex items-center gap-2">
                <Fuel className="h-5 w-5 text-primary" />
                Live Storage Monitor
              </h2>
              <p className="text-muted-foreground text-[13px] font-medium mt-1">Underground tank levels and capacity tracking.</p>
            </div>
             <button className="h-10 px-4 flex items-center gap-2 rounded-xl bg-muted/40 border border-border text-muted-foreground text-[12px] font-bold hover:bg-muted/50 transition-colors">
                Detailed Log <ChevronRight className="w-4 h-4" />
             </button>
          </div>

          <div className="p-8 md:p-10 space-y-10 flex-1 flex flex-col justify-center">
             <div className="space-y-4">
               <div className="flex justify-between items-end px-1">
                 <div className="space-y-1">
                   <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Tank Alpha - Benzene</span>
                   <span className="text-2xl font-black text-foreground tabular-nums">18,400 L <span className="text-[14px] font-bold text-muted-foreground/60 uppercase">/ 20k</span></span>
                 </div>
                 <span className="text-[12px] font-black text-primary">92%</span>
               </div>
                <div className="h-4 w-full bg-muted rounded-full overflow-hidden p-1 border border-border">
                  <div className="h-full bg-primary rounded-full w-[92%] transition-all duration-300" />
                </div>
             </div>

             <div className="space-y-4">
               <div className="flex justify-between items-end px-1">
                 <div className="space-y-1">
                   <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Tank Beta - Diesel</span>
                   <span className="text-2xl font-black text-foreground tabular-nums">24,450 L <span className="text-[14px] font-bold text-muted-foreground/60 uppercase">/ 30k</span></span>
                 </div>
                 <span className="text-[12px] font-black text-emerald-500">81.5%</span>
               </div>
                <div className="h-4 w-full bg-muted rounded-full overflow-hidden p-1 border border-border">
                  <div className="h-full bg-emerald-500 rounded-full w-[81.5%] transition-all duration-300" />
                </div>
             </div>
          </div>

          <div className="p-6 md:p-8 bg-muted/20 border-t border-border mt-2">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                      <ShieldCheck className="h-5 w-5" />
                   </div>
                   <div>
                      <p className="text-[13px] font-semibold text-foreground">Stock Integrity SECURE</p>
                      <p className="text-[11px] text-muted-foreground font-medium">Automatic sensors synchronized at 09:15 AM</p>
                   </div>
                </div>
                <Zap className="h-5 w-5 text-primary/30" />
             </div>
          </div>
        </div>

        {/* Supply Ledger */}
        <div className="col-span-3 bg-card rounded-[24px] shadow-sm border border-border flex flex-col overflow-hidden">
          <div className="p-6 md:p-8 border-b border-border pb-4">
            <h2 className="flex items-center gap-3 text-xl font-semibold tracking-tight text-foreground">
               <History className="h-5 w-5 text-primary" />
               Supply Ledger
            </h2>
            <p className="text-muted-foreground text-[13px] font-medium mt-1">Latest inbound fuel deliveries.</p>
          </div>

          <div className="p-4 md:p-6 space-y-3 flex-1">
             {recentDeliveries.map((delivery) => (
                <div key={delivery.id} className="flex items-center justify-between p-4 rounded-2xl bg-muted/40 hover:bg-muted/60 border border-transparent hover:border-border transition-all cursor-pointer group">
                   <div className="flex items-center gap-4">
                      <div className="h-10 w-10 flex items-center justify-center">
                         <delivery.icon className="h-10 w-10 text-foreground" />
                      </div>
                     <div>
                        <p className="font-bold text-[14px] text-foreground group-hover:text-primary transition-colors">{delivery.type}</p>
                        <p className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-wider">{delivery.time}</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="font-black text-[15px] text-foreground tabular-nums">{delivery.vol}</p>
                     <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-500">{delivery.status}</p>
                  </div>
               </div>
             ))}
          </div>

          <div className="p-4 bg-muted/30 border-t border-border">
             <button className="w-full h-11 font-bold text-[11px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors rounded-xl border border-transparent hover:border-primary/20">
                View Disbursement History <ArrowRight className="inline-block ml-1 h-3.5 w-3.5" />
             </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;

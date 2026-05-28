import React, { useEffect, useState } from "react";
import {
  Users,
  Truck,
  ShieldCheck,
  Activity,
  ArrowUpRight,
  FileCheck,
  Building2,
  Navigation,
  Clock,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { getFederalDashboardStats } from "../../services/api";

const FederalDashboard = () => {
  const [statsData, setStatsData] = useState({
    superAdmins: 0,
    verifiedOwners: 0,
    totalDeliveries: 0,
    recentDeliveries: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) return;
      
      try {
        const res = await getFederalDashboardStats();
        setStatsData(res.data);
      } catch (err) {
        console.error("Failed to fetch federal stats", err);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { label: "Regional Super Admins", value: statsData.superAdmins.toString(),      icon: Users,         color: "blue",    desc: "Provincial oversight" },
    { label: "Verified Station Owners", value: statsData.verifiedOwners.toString(),    icon: Building2,     color: "emerald", desc: "Entity level auth" },
    { label: "National Fuel Dispatch",  value: statsData.totalDeliveries.toString(),   icon: Truck,         color: "amber",   desc: "Weekly logistics flow" },
    { label: "Regulatory Compliance",   value: "Optimal", icon: ShieldCheck, color: "purple",  desc: "Standard alignment" },
  ];

  const iconBg = {
    blue:    "bg-primary/10 text-primary",
    emerald: "bg-emerald-500/10 text-emerald-500",
    amber:   "bg-amber-500/10 text-amber-500",
    purple:  "bg-purple-500/10 text-purple-500",
  };

  const statusStyle = {
    OWNER_ACCEPTED:      { icon: "bg-emerald-500/10 text-emerald-500", badge: "text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20" },
    SUPERADMIN_ACCEPTED: { icon: "bg-primary/10 text-primary",       badge: "text-primary bg-primary/5 border-primary/20 dark:text-primary dark:bg-primary/10 dark:border-primary/20" },
    PENDING:             { icon: "bg-amber-500/10 text-amber-500",     badge: "text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/20" },
  };

  const getDeliveryIcon = (dest) => {
    if (dest?.toLowerCase().includes("terminal")) return Navigation;
    if (dest?.toLowerCase().includes("hub")) return Activity;
    return FileCheck;
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto font-sans">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            National Command Center
          </h1>
          <p className="text-muted-foreground text-[14px] font-medium max-w-xl">
            Unified oversight for strategic fuel reserves and regional distribution networks.
          </p>
        </div>

       
      </div>

      {/* Stat Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-card rounded-[24px] shadow-sm border border-border p-6 relative overflow-hidden group hover:border-border transition-all duration-300"
          >
            <div className="flex flex-col gap-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-muted/50 border border-border flex items-center justify-center text-foreground transition-colors">
                <stat.icon className="h-6 w-6" />
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

      {/* Deliveries list */}
      <div className="bg-card rounded-[24px] shadow-sm border border-border flex flex-col overflow-hidden">
          <div className="p-6 md:p-8 border-b border-border">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Disbursement Stream
            </h2>
            <p className="text-muted-foreground text-[13px] font-medium mt-1">
              Live telemetry from national supply chain nodes.
            </p>
          </div>

          <div className="p-4 md:p-6 space-y-3 flex-1 overflow-y-auto">
            {statsData.recentDeliveries.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">No recent deliveries found</div>
            ) : statsData.recentDeliveries.map((item) => {
              const style = statusStyle[item.status] || statusStyle.PENDING;
              const IconComp = getDeliveryIcon(item.destination);
              return (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl hover:bg-muted/50 transition-all group cursor-pointer border border-transparent hover:border-border"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn("h-12 w-12 flex items-center justify-center rounded-[14px] transition-all", style.icon)}>
                      <IconComp className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-foreground leading-tight group-hover:text-primary transition-colors">
                        {item.destination}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider", style.badge)}>
                          {item.status.replace("_", " ")}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(item.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="sm:text-right ml-16 md:ml-0 flex items-center sm:block gap-2 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                    <p className="text-[14px] font-bold text-foreground tabular-nums">{item.volume}L</p>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 ml-auto sm:mt-1 group-hover:text-primary transition-colors flex-shrink-0" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 border-t border-border bg-muted/30">
            <button className="w-full h-11 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-colors">
              View National Logistics Ledger
            </button>
          </div>
        </div>
    </div>
  );
};

export default FederalDashboard;

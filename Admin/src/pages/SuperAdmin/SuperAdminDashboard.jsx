import React, { useState, useEffect } from "react";
import API from "../../services/api";
import {
  Fuel,
  History,
  ShieldCheck,
  Activity,
  Clock,
  ArrowUpRight,
  Zap,
  Settings,
  Users2,
  Terminal,
  MonitorDot,
  Server,
  Bell,
  Fingerprint,
  TrendingUp,
  Package
} from "lucide-react";
import { cn } from "../../lib/utils";

const SuperAdminDashboard = () => {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/admins/dashboard-stats");
        setStatsData(res.data);
      } catch (err) {
        console.error("Error fetching stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { label: "Active Nodes", value: statsData?.activeNodes || 0, icon: MonitorDot, trend: "Live", color: "emerald", desc: "Regional admin instances" },
    { label: "Supply Points", value: statsData?.supplyPoints || 0, icon: Fuel, trend: "Active", color: "blue", desc: "Operational fuel stations" },
    { label: "Disbursement Vol", value: (statsData?.disbursementVolume || 0).toLocaleString(), icon: Zap, trend: "Today", color: "amber", desc: "Total liters today" },
    { label: "System Health", value: "99.9%", icon: ShieldCheck, trend: "Optimal", color: "purple", desc: "Encrypted traffic uptime" },
  ];

  const recentActivity = statsData?.recentActivity || [];

  const getActivityIcon = (type) => {
    switch (type) {
      case "Delivery": return Package;
      case "Registration": return Fingerprint;
      case "Security": return ShieldCheck;
      default: return History;
    }
  };

  const iconBg = {
    blue: "bg-primary/10 text-primary",
    emerald: "bg-emerald-500/10 text-emerald-500",
    amber: "bg-amber-500/10 text-amber-500",
    purple: "bg-purple-500/10 text-purple-500",
  };

  const statusStyle = {
    success: "bg-emerald-500/10 text-emerald-500",
    warning: "bg-amber-500/10 text-amber-500",
    pending: "bg-primary/10 text-primary",
    error: "bg-destructive/10 text-destructive",
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto font-sans">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Terminal className="w-6 h-6 text-foreground" />
            <span className="text-[11px] font-bold tracking-wider uppercase text-primary/80">Control Layer Active</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground flex items-center gap-3">
             Global Control Center
          </h1>
          <p className="text-muted-foreground text-[14px] font-medium max-w-xl">Centralized intelligence nexus and multi-regional system orchestration.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-10 px-4 flex items-center gap-2 rounded-xl bg-card border border-border text-muted-foreground text-[13px] font-bold hover:bg-muted/50 transition-colors shadow-sm relative">
            <Bell className="w-4 h-4 text-muted-foreground/50" />
            Notifications
            <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full flex items-center justify-center bg-destructive text-destructive-foreground text-[10px] font-bold border-2 border-card">3</span>
          </button>
          <button className="h-10 px-5 flex items-center gap-2 rounded-xl bg-primary text-primary-foreground text-[13px] font-bold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20">
            {loading ? <Activity className="w-8 h-8 text-foreground animate-pulse" /> : <Activity className="w-8 h-8 text-foreground" />}
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

      {/* Main Content Area */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">

        {/* Network Volume Chart Placeholder */}
        <div className="col-span-4 bg-card rounded-[24px] shadow-sm border border-border flex flex-col overflow-hidden relative">
          <div className="p-6 md:p-8 border-b border-border flex flex-row items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">Network Volume Monitor</h2>
              <p className="text-muted-foreground text-[13px] font-medium">Real-time throughput analysis across all regional clusters.</p>
            </div>
            <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-xl border border-border">
              <button className="h-8 text-[11px] uppercase font-bold px-4 rounded-lg text-muted-foreground hover:text-foreground transition-colors">24H</button>
              <button className="h-8 text-[11px] uppercase font-bold px-4 rounded-lg bg-card shadow-sm border border-border text-primary">7D</button>
              <button className="h-8 text-[11px] uppercase font-bold px-4 rounded-lg text-muted-foreground hover:text-foreground transition-colors">30D</button>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-between pt-6 px-4 md:px-8">
             <div className="h-[240px] flex items-end gap-3 pb-4">
                {(statsData?.chartData || [0,0,0,0,0,0,0,0,0,0,0,0]).map((h, i) => {
                  const maxVal = Math.max(...(statsData?.chartData || [100]));
                  const heightPercent = maxVal === 0 ? 0 : (h / maxVal) * 100;
                  return (
                  <div key={i} className="group/bar relative flex-1 h-full flex items-end">
                    <div style={{ height: `${heightPercent}%` }} className="w-full bg-primary/10 rounded-t-[8px] hover:bg-primary transition-all duration-300 cursor-pointer relative" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none bg-sidebar text-sidebar-foreground text-[11px] font-bold py-1.5 px-3 rounded-lg shadow-xl whitespace-nowrap z-20">
                      {h}L Load
                    </div>
                  </div>
                )})}
            </div>
          </div>

          <div className="p-6 md:p-8 bg-muted/20 border-t border-border mt-2">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                <div>
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Cumulative Volume</p>
                  <p className="text-2xl font-black text-foreground tabular-nums">{(statsData?.cumulativeSales || 0).toLocaleString()} L</p>
                </div>
                <div className="hidden sm:block w-px h-10 bg-border" />
                <div>
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Peak Capacity</p>
                  <p className="text-2xl font-black text-foreground tabular-nums">{statsData?.peakCapacity || 94.2}%</p>
                </div>
              </div>
              <span className="flex items-center gap-1.5 h-10 px-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-500/20 font-bold text-[12px]">
                <TrendingUp className="h-4 w-4" />
                +24.5% Yield
              </span>
            </div>
          </div>
        </div>

        {/* System Activity Log */}
        <div className="col-span-3 bg-card rounded-[24px] shadow-sm border border-border flex flex-col overflow-hidden">
          <div className="p-6 md:p-8 border-b border-border">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">System Audit Log</h2>
            <p className="text-muted-foreground text-[13px] font-medium mt-1">Live stream of infrastructure events.</p>
          </div>
          <div className="p-4 md:p-6 space-y-3 flex-1 overflow-y-auto">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center mt-4">No recent activity detected.</p>
            ) : recentActivity.map((item) => {
              const Icon = getActivityIcon(item.type);
              return (
              <div key={item.id} className="flex items-center gap-4 p-3.5 rounded-2xl hover:bg-muted/50 transition-all group cursor-pointer border border-transparent hover:border-border">
                <div className="h-12 w-12 flex items-center justify-center">
                  <Icon className="h-10 w-10 text-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-foreground leading-tight truncate group-hover:text-primary transition-colors">{item.user}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">{item.type}</p>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground/60">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(item.time).toLocaleTimeString(undefined, {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
              </div>
            )})}
          </div>
          <div className="p-4 border-t border-border bg-muted/20">
            <button className="w-full h-11 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-colors">
              View Full Audit Ledger
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

         {/* Hardware Interface */}
         <div className="col-span-2 bg-card rounded-[24px] shadow-sm border border-border overflow-hidden">
            <div className="p-6 md:p-8 flex flex-row items-center justify-between border-b border-border">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold tracking-tight text-foreground">Hardware Interface</h2>
                  <p className="text-muted-foreground text-[13px] font-medium">Direct execution commands for root orchestration.</p>
                </div>
                <div className="flex items-center justify-center">
                  <Zap className="h-12 w-12 text-foreground" />
                </div>
            </div>
            <div className="p-6 md:p-8">
               <div className="grid grid-cols-2 gap-6">
                  <button className="h-28 flex flex-col gap-3 justify-center items-center rounded-[20px] bg-muted/30 border border-border transition-all group overflow-hidden relative shadow-sm">
                    <div className="absolute top-0 left-0 w-full h-1 bg-border transition-colors" />
                    <Settings className="h-7 w-7 text-muted-foreground/50 transition-colors" />
                    <span className="text-[12px] uppercase font-bold text-muted-foreground tracking-wider">Matrix Config</span>
                  </button>
                  <button className="h-28 flex flex-col gap-3 justify-center items-center rounded-[20px] bg-muted/30 border border-border transition-all group overflow-hidden relative shadow-sm">
                    <div className="absolute top-0 left-0 w-full h-1 bg-border transition-colors" />
                    <Users2 className="h-7 w-7 text-muted-foreground/50 transition-colors" />
                    <span className="text-[12px] uppercase font-bold text-muted-foreground tracking-wider">Auth Rotation</span>
                  </button>
               </div>
            </div>
         </div>

         {/* Network Shield — Theme special case (keeping it dark as it's a 'shield' UI) */}
         <div className="bg-sidebar rounded-[24px] shadow-sm border border-sidebar-border relative overflow-hidden group">
            <div className="p-6 md:p-8 relative z-10 flex flex-col h-full justify-between">
              <div>
                 <h2 className="text-xl font-extrabold tracking-tight text-sidebar-foreground mb-1">Network Shield</h2>
                 <p className="text-sidebar-foreground/60 text-[13px] font-medium">Advanced threat assessment.</p>
              </div>
              <div className="mt-8 space-y-8">
                 <div className="flex items-end justify-between">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-sidebar-foreground/40 uppercase tracking-widest block">Trust Score</span>
                      <span className="text-5xl font-black text-emerald-400 block tracking-tight">94.2<span className="text-2xl">%</span></span>
                    </div>
                    <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center justify-center">
                      <ShieldCheck className="h-7 w-7 text-emerald-400" />
                    </div>
                 </div>
                 <div className="space-y-2.5">
                    <div className="flex justify-between text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/40 px-1">
                      <span>Protocol Integrity</span>
                      <span className="text-emerald-400">Validated</span>
                    </div>
                    <div className="h-2 w-full bg-sidebar-foreground/10 rounded-full overflow-hidden border border-sidebar-foreground/5">
                      <div className="h-full bg-emerald-400 w-[94%] shadow-[0_0_10px_rgba(52,211,153,0.3)]" />
                    </div>
                 </div>
              </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;

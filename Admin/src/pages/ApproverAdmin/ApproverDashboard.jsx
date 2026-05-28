import React, { useEffect, useState } from "react";
import {
  UserCheck,
  Car,
  Wheat,
  Fuel,
  Users2,
  ClipboardCheck,
  Clock,
  ArrowRight,
  ShieldAlert,
  Zap,
  ArrowUpRight,
  Home,
  Loader2
} from "lucide-react";
import { getApproverAdminDashboardStats } from "../../services/api.js";
import { cn } from "../../lib/utils";
import { useTranslation } from "react-i18next";

const ApproverDashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        const { data } = await getApproverAdminDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch approver stats:", err);
        setError(t("failedToLoadValidationQueue"));
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-muted-foreground font-medium animate-pulse">{t("initializingSecurityHub")}</p>
    </div>
  );

  if (error) return (
    <div className="p-8 text-center text-red-500 font-bold">{error}</div>
  );

  const pendingApprovals = [
    { label: t("vehicles"), count: stats.counts.vehicles, icon: Car, url: "/approvals/vehicles" },
    { label: t("farmers"), count: stats.counts.farmers, icon: Wheat, url: "/approvals/farmers" },
    { label: t("millHouses"), count: stats.counts.millOwners, icon: Home, url: "/approvals/mill-house" },
    { label: t("attendants"), count: stats.counts.attendants, icon: Fuel, url: "/approvals/attendants" },
    { label: t("others"), count: stats.counts.others, icon: Users2, url: "/approvals/others" },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto font-sans">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-foreground" />
            <span className="text-[11px] font-bold tracking-wider uppercase text-primary/80">{t("identityValidationQueue")}</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground flex items-center gap-3">
             {t("verificationCenter")}
          </h1>
          <p className="text-muted-foreground text-[14px] font-medium max-w-xl">{t("validationQueueDesc")}</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right hidden md:block">
              <p className="text-[10px] font-bold uppercase text-muted-foreground/60 tracking-widest">Global Region</p>
              <p className="text-[15px] font-black text-foreground">Active Node</p>
           </div>
           <div className="flex items-center gap-2 py-2 px-4">
              <Zap className="h-6 w-6 text-primary" />
              <span className="font-bold text-[11px] uppercase tracking-wider text-primary">High Efficiency</span>
           </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-6 grid-cols-2 lg:grid-cols-5">
        {pendingApprovals.map((item, i) => (
          <a href={item.url} key={i} className="bg-card rounded-[24px] shadow-sm border border-border p-6 relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
            <div className="flex flex-col gap-4 relative z-10">
              <div className="p-0 rounded-xl transition-colors">
                <item.icon className={cn("h-8 w-8 text-foreground group-hover:text-primary transition-colors")} />
              </div>
              <div className="space-y-1">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors truncate">
                  {item.label}
                </h3>
                <div className="text-2xl font-black text-foreground tabular-nums">
                  {item.count}
                </div>
              </div>
            </div>
            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-12 h-12 bg-primary/5 -mr-6 -mt-6 rounded-full group-hover:scale-150 transition-transform duration-500" />
          </a>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">

        {/* {t("actionRequired")} Banner */}
        <div className="col-span-4 bg-card rounded-[24px] shadow-sm border border-border flex flex-col overflow-hidden group/batch">
          <div className="p-6 md:p-8 border-b border-border pb-4">
             <h2 className="flex items-center gap-3 text-xl font-semibold tracking-tight text-foreground">
                <ShieldAlert className="h-5 w-5 text-destructive" />
                {t("actionRequired")}
             </h2>
             <p className="text-muted-foreground text-[13px] font-medium mt-1">
                {t("urgentApplicationsDesc")}
             </p>
          </div>

          <div className="p-8 md:p-12 flex-1 flex flex-col justify-center items-center text-center space-y-8 bg-muted/20 relative overflow-hidden">
             {/* Gradient Accent */}
             <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-transparent opacity-50 group-hover/batch:opacity-100 transition-opacity" />

             <div className="space-y-3 relative z-10">
                <h2 className="text-7xl font-black tracking-tighter text-foreground tabular-nums">{stats.counts.total} <span className="text-xl font-bold text-muted-foreground uppercase tracking-widest">{t("pending")}</span></h2>
                <p className="text-muted-foreground font-medium max-w-[320px] mx-auto text-[14px] leading-relaxed">
                   A batch of entity applications is ready for final review across all categories.
                </p>
             </div>

             <div className="space-y-4 w-full flex flex-col items-center relative z-10">
                  <a href="/approvals/vehicles" className="w-full max-w-[300px] h-14 flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground text-[13px] font-bold hover:bg-primary/90 transition-all shadow-sm">
                     {t("beginVerificationBatch")} <ArrowRight className="h-4 w-4" />
                  </a>
                  <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest flex items-center justify-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Regional Priority Active • SLA: 24h
                  </p>
             </div>
          </div>
        </div>

        {/* Recent Decisions */}
        <div className="col-span-3 bg-card rounded-[24px] shadow-sm border border-border flex flex-col overflow-hidden self-start">
          <div className="p-6 md:p-8 border-b border-border pb-4">
            <h2 className="flex items-center gap-3 text-xl font-semibold tracking-tight text-foreground">
               <Clock className="h-5 w-5 text-primary" />
               {t("recentDecisions")}
            </h2>
            <p className="text-muted-foreground text-[13px] font-medium mt-1">
               Latest approvals and audit trails.
            </p>
          </div>

          <div className="p-4 md:p-6 space-y-3">
             {stats.recentDecisions.length === 0 ? (
                 <div className="py-12 text-center">
                     <p className="text-muted-foreground text-xs font-semibold uppercase tracking-widest opacity-50 italic">No recent decisions</p>
                 </div>
             ) : stats.recentDecisions.map((log, i) => (
               <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-muted/40 border border-transparent hover:border-border transition-colors group">
                  <div className="flex items-center gap-4">
                     <div className="h-10 w-10 flex items-center justify-center font-black text-foreground text-xs shrink-0 transition-colors bg-card border border-border rounded-xl">
                        <UserCheck className="h-5 w-5 text-emerald-500" />
                     </div>
                     <div className="min-w-0">
                        <p className="font-bold text-[14px] text-foreground truncate group-hover:text-primary transition-colors">{log.name}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">{log.type} • {new Date(log.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Verified</span>
                  </div>
               </div>
             ))}
          </div>
          <div className="p-0 mt-auto bg-muted/30 border-t border-border">
             <button className="w-full h-14 font-semibold uppercase tracking-wider text-[10px] text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-2">
                View Policy Standards <ArrowUpRight className="w-3.5 h-3.5" />
             </button>
          </div>
        </div>
      </div>

      {/* Policy Compliance */}
      <div className="bg-card rounded-[24px] shadow-sm border border-border overflow-hidden">
         <div className="p-6 md:p-8 border-b border-border pb-4">
           <h2 className="text-xl font-semibold tracking-tight text-foreground">Validation Compliance</h2>
           <p className="text-muted-foreground text-[13px] font-medium mt-1">Audit integrity and verification accuracy.</p>
         </div>
         <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 lg:gap-12">
            <div className="flex-1 space-y-6">
               <p className="text-[14px] font-medium text-muted-foreground leading-relaxed max-w-2xl px-1">
                 All approvals are multi-factor verified.
                 <span className="text-primary font-bold bg-primary/10 px-1.5 py-0.5 rounded-md mx-1 whitespace-nowrap"> Audit Trail Active </span> 
                 Real-time synchronization ensures regional distribution centers receive verified credentials instantly.
               </p>
               <div className="flex items-center gap-8 bg-muted/40 w-fit p-4 rounded-2xl border border-border">
                  <div className="flex flex-col gap-1">
                     <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">Verification Node</span>
                     <span className="text-xl font-black text-foreground tabular-nums">Active Security</span>
                  </div>
                  <div className="w-[1px] h-10 bg-border" />
                  <div className="flex flex-col gap-1">
                     <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">Integrity Score</span>
                     <span className="text-xl font-black text-emerald-500 tabular-nums">1.0</span>
                  </div>
               </div>
            </div>

            <div className="h-40 w-40 relative shrink-0 flex items-center justify-center">
               <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" className="stroke-muted" strokeWidth="12" fill="transparent" />
                  <circle cx="80" cy="80" r="70" className="stroke-primary" strokeWidth="12" strokeDasharray="439.8" strokeDashoffset="43.98" fill="transparent" strokeLinecap="round" />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-black text-3xl tracking-tighter text-foreground tabular-nums">100%</span>
                  <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-wider">Secure</span>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
};

export default ApproverDashboard;




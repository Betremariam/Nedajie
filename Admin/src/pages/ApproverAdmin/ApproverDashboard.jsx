import React from "react";
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
  ArrowUpRight
} from "lucide-react";
import { cn } from "../../lib/utils";

const ApproveDashboard = () => {
  const pendingApprovals = [
    { label: "Drivers", count: "14", icon: Car, trend: "+3 new", priority: "high" },
    { label: "Farmers", count: "8", icon: Wheat, trend: "Stable", priority: "medium" },
    { label: "Attendants", count: "21", icon: Fuel, trend: "+12 new", priority: "high" },
    { label: "Others", count: "4", icon: Users2, trend: "-2", priority: "low" },
  ];

  const recentDecisions = [
    { name: "John Kabila", type: "Driver", status: "Approved", time: "12 mins ago" },
    { name: "Sarah Ahmed", type: "Attendant", status: "Approved", time: "45 mins ago" },
    { name: "Global Trans", type: "Multiple", status: "Batch Approved", time: "1 hour ago" }
  ];

  const priorityStyle = {
    high: "text-destructive bg-destructive/10 border-destructive/20",
    medium: "text-amber-600 bg-amber-500/10 border-amber-500/20 dark:text-amber-400",
    low: "text-primary bg-primary/10 border-primary/20",
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto font-sans">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            <span className="text-[11px] font-bold tracking-wider uppercase text-primary/80">Identity Validation Queue</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
             Verification Center
          </h1>
          <p className="text-muted-foreground text-[14px] font-medium max-w-xl">Identity Validation & Access Authorization Queue</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right hidden md:block">
              <p className="text-[10px] font-bold uppercase text-muted-foreground/60 tracking-widest">Avg. Approval Time</p>
              <p className="text-[15px] font-black text-foreground">4.2 Hours</p>
           </div>
           <div className="bg-primary/10 text-primary border border-primary/20 flex items-center gap-2 py-2 px-4 rounded-xl shadow-sm">
              <Zap className="h-4 w-4 fill-primary/30" />
              <span className="font-bold text-[11px] uppercase tracking-wider">High Efficiency</span>
           </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {pendingApprovals.map((item, i) => (
          <div key={i} className="bg-card rounded-[24px] shadow-sm border border-border p-6 relative overflow-hidden group hover:border-border transition-all duration-300">
            <div className="flex flex-row items-center justify-between pb-4 relative z-10">
              <h3 className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
                {item.label}
              </h3>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-muted text-muted-foreground/50 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <item.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="relative z-10">
              <div className="text-3xl font-black tracking-tight text-foreground mb-2">
                {item.count}
              </div>
              <div className="flex items-center justify-between">
                 <span className={cn(
                   "text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border",
                   priorityStyle[item.priority]
                 )}>
                   {item.priority}
                 </span>
                 <span className="text-[11px] font-bold text-muted-foreground/60">{item.trend}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">

        {/* Action Required Banner */}
        <div className="col-span-4 bg-card rounded-[24px] shadow-sm border border-border flex flex-col overflow-hidden group/batch">
          <div className="p-6 md:p-8 border-b border-border pb-4">
             <h2 className="flex items-center gap-3 text-xl font-extrabold tracking-tight text-foreground">
                <ShieldAlert className="h-5 w-5 text-destructive" />
                Action Required
             </h2>
             <p className="text-muted-foreground text-[13px] font-medium mt-1">
                Urgent applications awaiting your validation.
             </p>
          </div>

          <div className="p-8 md:p-12 flex-1 flex flex-col justify-center items-center text-center space-y-8 bg-muted/20 relative overflow-hidden">
             {/* Gradient Accent */}
             <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-transparent opacity-50 group-hover/batch:opacity-100 transition-opacity" />

             <div className="space-y-3 relative z-10">
                <h2 className="text-6xl font-black tracking-tight text-foreground">47 <span className="text-xl font-bold text-muted-foreground uppercase tracking-widest">Pending</span></h2>
                <p className="text-muted-foreground font-medium max-w-[320px] mx-auto text-[14px] leading-relaxed">
                   A batch of driver and attendant applications is ready for final review.
                </p>
             </div>

             <div className="space-y-4 w-full flex flex-col items-center relative z-10">
                  <button className="w-full max-w-[300px] h-14 flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground text-[13px] font-bold hover:bg-primary/90 transition-all shadow-sm">
                     Begin Verification Batch <ArrowRight className="h-4 w-4" />
                  </button>
                  <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest flex items-center justify-center gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Priority sorting enabled • SLA: 24h
                  </p>
             </div>
          </div>
        </div>

        {/* Recent Decisions */}
        <div className="col-span-3 bg-card rounded-[24px] shadow-sm border border-border flex flex-col overflow-hidden self-start">
          <div className="p-6 md:p-8 border-b border-border pb-4">
            <h2 className="flex items-center gap-3 text-xl font-extrabold tracking-tight text-foreground">
               <Clock className="h-5 w-5 text-primary" />
               Recent Decisions
            </h2>
            <p className="text-muted-foreground text-[13px] font-medium mt-1">
               Latest approvals and audit trails.
            </p>
          </div>

          <div className="p-4 md:p-6 space-y-3">
             {recentDecisions.map((log, i) => (
               <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-muted/40 border border-transparent hover:border-border transition-colors group">
                  <div className="flex items-center gap-4">
                     <div className="h-10 w-10 bg-card shadow-sm border border-border rounded-[12px] flex items-center justify-center font-black text-primary text-xs shrink-0 group-hover:bg-primary/10 transition-colors">
                        {log.name.split(' ').map(n => n[0]).join('')}
                     </div>
                     <div className="min-w-0">
                        <p className="font-bold text-[14px] text-foreground truncate group-hover:text-primary transition-colors">{log.name}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">{log.type} • {log.time}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                      <UserCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Verified</span>
                  </div>
               </div>
             ))}
          </div>
          <div className="p-0 mt-auto bg-muted/30 border-t border-border">
             <button className="w-full h-14 font-bold uppercase tracking-wider text-[11px] text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-2">
                View Audit History <ArrowUpRight className="w-3.5 h-3.5" />
             </button>
          </div>
        </div>
      </div>

      {/* Policy Compliance */}
      <div className="bg-card rounded-[24px] shadow-sm border border-border overflow-hidden">
         <div className="p-6 md:p-8 border-b border-border pb-4">
           <h2 className="text-xl font-extrabold tracking-tight text-foreground">Policy Compliance</h2>
           <p className="text-muted-foreground text-[13px] font-medium mt-1">Performance tracking and standard deviations.</p>
         </div>
         <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 lg:gap-12">
            <div className="flex-1 space-y-6">
               <p className="text-[14px] font-medium text-muted-foreground leading-relaxed max-w-2xl">
                 Your approval rate matches the standard deviation for the last quarter.
                 <span className="text-primary font-bold bg-primary/10 px-1.5 py-0.5 rounded-md mx-1"> 90% accuracy </span> maintained across all verification steps.
                 Ensure all document watermarks are verified before final commit.
               </p>
               <div className="flex items-center gap-8 bg-muted/40 w-fit p-4 rounded-2xl border border-border">
                  <div className="flex flex-col gap-1">
                     <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Last 30 Days</span>
                     <span className="text-xl font-black text-foreground tabular-nums">1,204 Approvals</span>
                  </div>
                  <div className="w-[1px] h-10 bg-border" />
                  <div className="flex flex-col gap-1">
                     <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Error Margin</span>
                     <span className="text-xl font-black text-emerald-500 tabular-nums">0.4%</span>
                  </div>
               </div>
            </div>

            <div className="h-40 w-40 relative shrink-0 flex items-center justify-center">
               <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" className="stroke-muted" strokeWidth="16" fill="transparent" />
                  <circle cx="80" cy="80" r="70" className="stroke-primary" strokeWidth="16" strokeDasharray="439.8" strokeDashoffset="43.98" fill="transparent" strokeLinecap="round" />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-black text-3xl tracking-tighter text-foreground tabular-nums">90%</span>
                  <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider">Accuracy</span>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
};

export default ApproveDashboard;

import React from "react";
import {
  UserPlus,
  Fuel,
  Car,
  Wheat,
  Users2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Fingerprint,
  FileCheck,
  Activity,
  Zap,
  ChevronRight,
  Database,
  Building2,
  Lock
} from "lucide-react";
import { cn } from "../../lib/utils";

const RegisterAdminDashboard = () => {
  const registrationTypes = [
    { label: "Attendants", desc: "Energy distribution staff", icon: Fuel, count: "124", color: "blue", trend: "+12%" },
    { label: "Drivers", desc: "Logistics & transport operators", icon: Car, count: "1,842", color: "emerald", trend: "+8%" },
    { label: "Farmers", desc: "Agricultural asset owners", icon: Wheat, count: "643", color: "amber", trend: "+5%" },
    { label: "Others", desc: "General system entities", icon: Users2, count: "89", color: "purple", trend: "+2%" },
  ];

  const iconBg = {
    blue: "bg-blue-500/10 text-blue-500",
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
            <Fingerprint className="w-5 h-5 text-primary" />
            <span className="text-[11px] font-bold tracking-wider uppercase text-primary/80">Biometric Identity Hub</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            Registry Overview
          </h1>
          <p className="text-muted-foreground text-[14px] font-medium">Manage and monitor total ecosystem enrollments</p>
        </div>

        <div className="flex items-center gap-4 bg-card p-2 pl-4 rounded-[16px] border border-border shadow-sm transition-all focus-within:ring-1 focus-within:ring-primary/20">
           <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-9 w-9 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground overflow-hidden shadow-sm transition-transform">
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} alt="avatar" />
                </div>
              ))}
           </div>
           <div className="pr-4 border-r border-border h-10 flex flex-col justify-center">
             <span className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground leading-none mb-1 whitespace-nowrap">Active Operatives</span>
             <span className="text-[13px] font-black text-foreground leading-none">12 ONLINE</span>
           </div>
           <div className="bg-emerald-500/10 text-emerald-500 p-2.5 rounded-xl">
              <Activity className="w-4 h-4" />
           </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {registrationTypes.map((type, i) => (
          <div key={i} className="bg-card rounded-[24px] shadow-sm border border-border p-6 relative overflow-hidden group hover:border-border transition-all duration-300">
            <div className="flex flex-row items-center justify-between pb-4 relative z-10">
              <h3 className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
                {type.label}
              </h3>
              <div className={cn("p-2 rounded-xl transition-colors", iconBg[type.color])}>
                <type.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="relative z-10">
              <div className="text-3xl font-black tracking-tight text-foreground mb-1">
                {type.count}
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-[11px] font-medium text-muted-foreground">
                  {type.desc}
                </p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 dark:text-emerald-400">
                  {type.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Blocks */}
      <div className="grid gap-6 lg:grid-cols-7">

        {/* Rapid Onboarding Block — Retaining special dark look */}
        <div className="lg:col-span-4 bg-sidebar rounded-[24px] text-sidebar-foreground border-none shadow-lg overflow-hidden relative group p-8 md:p-10 flex flex-col justify-between min-h-[320px]">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50" />
          <div className="absolute -bottom-8 -right-8 opacity-[0.08] transition-transform duration-1000">
             <UserPlus className="w-64 h-64" />
          </div>
          <div className="relative z-10">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-sidebar-foreground/10 backdrop-blur-md rounded-[12px] flex items-center justify-center border border-sidebar-foreground/20">
                   <Zap className="h-5 w-5 text-primary" />
                </div>
                <span className="bg-primary/20 text-primary border-none font-bold uppercase px-3 py-1 rounded-[8px] text-[10px] tracking-widest">
                   Rapid Onboarding
                </span>
             </div>
             <h2 className="text-3xl font-extrabold tracking-tight leading-[1.1] mb-4 text-sidebar-foreground">
                Onboard new personnel <br />and assets in seconds.
             </h2>
             <p className="text-sidebar-foreground/60 text-[14px] font-medium leading-relaxed max-w-md">
                Deploy standardized identity forms to securely enroll, track, and authenticate users across the fuel ecosystem.
             </p>
          </div>
          <div className="relative z-10 flex flex-wrap gap-4 mt-8">
             <button className="h-12 px-8 font-bold text-[13px] rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-all flex items-center">
                <UserPlus className="mr-2 h-4 w-4" />
                Assign New Role
             </button>
             <button className="h-12 px-6 font-bold text-[13px] rounded-xl bg-sidebar-foreground/10 hover:bg-sidebar-foreground/20 text-sidebar-foreground transition-all flex items-center border border-sidebar-foreground/10">
                <Database className="mr-2 h-4 w-4 opacity-70" />
                Bulk Ingestion
             </button>
          </div>
        </div>

        {/* System Health */}
        <div className="lg:col-span-3 bg-card rounded-[24px] shadow-sm border border-border p-8 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-50 pointer-events-none" />

          <div className="flex items-center gap-2 mb-2">
             <Activity className="w-4 h-4 text-primary" />
             <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">System Integrity</h3>
          </div>
          <p className="text-foreground text-lg font-bold tracking-tight mb-8">Real-time authentication bounds</p>

          <div className="space-y-6">
             <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[12px] font-bold text-foreground/80 flex items-center gap-2">
                     <Lock className="w-3.5 h-3.5 text-muted-foreground/60" /> Database Crypto
                  </span>
                  <span className="text-[11px] font-black text-emerald-500">SECURE</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden p-0.5 border border-border">
                  <div className="h-full bg-primary rounded-full w-[100%] transition-all duration-300" />
                </div>
             </div>
             <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[12px] font-bold text-foreground/80 flex items-center gap-2">
                     <Building2 className="w-3.5 h-3.5 text-muted-foreground/60" /> Identity Synchronization
                  </span>
                  <span className="text-[11px] font-black text-emerald-500">OPERATIONAL</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden p-0.5 border border-border">
                  <div className="h-full bg-emerald-500 rounded-full w-[98%] transition-all duration-300" />
                </div>
             </div>
          </div>

          <div className="mt-8 p-5 rounded-[16px] bg-muted/30 border border-border flex flex-col gap-3 group transition-all hover:bg-muted/50">
             <div className="flex items-start gap-3">
               <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <CheckCircle2 className="h-4 w-4" />
               </div>
               <div className="space-y-0.5">
                  <p className="text-[13px] font-bold text-foreground">Identities Reconciled</p>
                  <p className="text-[11px] text-muted-foreground font-medium">Sync verified across all regions</p>
               </div>
             </div>
             <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-wide pt-2 border-t border-border/60 ml-1">
                Last Handshake: Today at 08:42 AM <ChevronRight className="w-3 h-3" />
             </div>
          </div>
        </div>
      </div>

      {/* Footer Banner */}
      <div className="bg-card rounded-[24px] shadow-sm border border-border p-10 flex flex-col items-center justify-center text-center relative overflow-hidden group hover:shadow-md transition-all">
         <div className="absolute inset-0 bg-muted/10 pointer-events-none" />

         <div className="relative z-10 flex flex-col items-center max-w-2xl">
            <div className="w-16 h-16 bg-card rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-border transition-transform">
               <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight text-foreground mb-3">Military-Grade Data Sovereignty</h3>
            <p className="text-muted-foreground font-medium text-[14px] leading-relaxed mb-8">
               Every asset enrollment is shielded by end-to-end cryptographic layers. Identity telemetry is securely stored with zero-trust compliance protocols.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-6">
               <span className="flex items-center gap-2"><Lock className="w-3.5 h-3.5 text-muted-foreground/40" /> AES-256 E2EE</span>
               <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-border" />
               <span className="flex items-center gap-2"><Fingerprint className="w-3.5 h-3.5 text-muted-foreground/40" /> Biometric Token</span>
               <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-border" />
               <span className="flex items-center gap-2"><FileCheck className="w-3.5 h-3.5 text-muted-foreground/40" /> GRC Compliant</span>
            </div>

            <button className="text-primary font-bold text-[13px] hover:text-primary/80 transition-colors flex items-center group/btn">
               Audit Registry Architecture <ArrowRight className="ml-1.5 h-4 w-4 group-hover/btn:translate-x-1 transition-transform bg-transparent" />
            </button>
         </div>
      </div>

    </div>
  );
};

export default RegisterAdminDashboard;

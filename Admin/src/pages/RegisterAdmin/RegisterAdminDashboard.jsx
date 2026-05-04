import React, { useEffect, useState } from "react";
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
  Lock,
  Loader2,
  AlertCircle
} from "lucide-react";
import { cn } from "../../lib/utils";
import API, { getRegisterAdminDashboardStats } from "../../services/api";

const RegisterAdminDashboard = () => {
  const [stats, setStats] = useState([
    { label: "Attendants", desc: "Energy distribution staff", icon: Fuel, count: "0", color: "blue" },
    { label: "Vehicles", desc: "Logistics & transport operators", icon: Car, count: "0", color: "emerald" },
    { label: "Farmers", desc: "Agricultural asset owners", icon: Wheat, count: "0", color: "amber" },
    { label: "Others", desc: "General system entities", icon: Users2, count: "0", color: "purple" },
  ]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError("");
      const res = await getRegisterAdminDashboardStats();
      const data = res.data;

      setStats([
        { label: "Attendants", desc: "Energy distribution staff", icon: Fuel, count: data.attendants.toLocaleString(), color: "blue" },
        { label: "Vehicles", desc: "Logistics & transport operators", icon: Car, count: data.vehicles.toLocaleString(), color: "emerald" },
        { label: "Farmers", desc: "Agricultural asset owners", icon: Wheat, count: data.farmers.toLocaleString(), color: "amber" },
        { label: "Others", desc: "General system entities", icon: Users2, count: data.others.toLocaleString(), color: "purple" },
      ]);
    } catch (err) {
      console.error("Failed to fetch registry stats:", err);
      setError("Synchronization failure with biometric database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-6 font-sans">
        <div className="relative">
          <Loader2 className="h-16 w-16 animate-spin text-primary opacity-20" />
          <Fingerprint className="h-8 w-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-xl font-semibold tracking-tight">Accessing Biometric Registry</p>
          <p className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold italic">Establishing secure handshake...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto font-sans">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Fingerprint className="w-6 h-6 text-foreground" />
            <span className="text-[11px] font-bold tracking-wider uppercase text-primary/80">Biometric Identity Hub</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground flex items-center gap-3">
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
             <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground leading-none mb-1 whitespace-nowrap">Active Personnel</span>
             <span className="text-[13px] font-bold text-foreground leading-none">REAL-TIME SYNC</span>
           </div>
           <div className="text-foreground p-2.5">
              <Activity className="w-6 h-6" />
           </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((type, i) => (
          <div key={i} className="bg-card rounded-[24px] shadow-sm border border-border p-6 relative overflow-hidden group hover:border-border transition-all duration-300">
            <div className="flex flex-col gap-4 relative z-10">
              <div className="p-0 rounded-xl transition-colors">
                <type.icon className="h-10 w-10 text-foreground" />
              </div>
              <div className="space-y-1">
                <h3 className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
                  {type.label}
                </h3>
                <div className="text-3xl font-semibold tracking-tight leading-none text-foreground tabular-nums">
                  {type.count}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Blocks */}
      <div className="grid gap-6 lg:grid-cols-7">

        {/* Rapid Onboarding Block */}
        <div className="lg:col-span-4 bg-sidebar rounded-[24px] text-sidebar-foreground border-none shadow-lg overflow-hidden relative group p-8 md:p-10 flex flex-col justify-between min-h-[320px]">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50" />
          <div className="absolute -bottom-8 -right-8 opacity-[0.08] transition-transform duration-1000 group-hover:scale-110">
             <UserPlus className="w-64 h-64" />
          </div>
          <div className="relative z-10">
             <div className="flex items-center gap-3 mb-6">
                 <div className="flex items-center justify-center">
                    <Zap className="h-8 w-8 text-white" />
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
             <a href="/register/vehicle-registration" className="h-12 px-8 font-bold text-[13px] rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-all flex items-center">
                <UserPlus className="mr-2 h-4 w-4" />
                Begin Registration
             </a>
             <button onClick={fetchStats} className="h-12 px-6 font-bold text-[13px] rounded-xl bg-sidebar-foreground/10 hover:bg-sidebar-foreground/20 text-sidebar-foreground transition-all flex items-center border border-sidebar-foreground/10">
                <Database className="mr-2 h-4 w-4 opacity-70" />
                Refresh Feed
             </button>
          </div>
        </div>

        {/* System Health */}
        <div className="lg:col-span-3 bg-card rounded-[24px] shadow-sm border border-border p-8 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-50 pointer-events-none" />

          <div className="flex items-center gap-2 mb-2">
             <Activity className="w-4 h-4 text-primary" />
             <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">System Integrity</h3>
          </div>
          <p className="text-foreground text-lg font-bold tracking-tight mb-8">Real-time authentication bounds</p>

          <div className="space-y-6">
             <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                   <span className="text-[12px] font-bold text-foreground/80 flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-muted-foreground/60" /> Database Crypto
                   </span>
                   <span className="text-[11px] font-black text-emerald-500 uppercase">Secure</span>
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
                   <span className="text-[11px] font-black text-emerald-500 uppercase">Operational</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden p-0.5 border border-border">
                  <div className="h-full bg-emerald-500 rounded-full w-[100%] transition-all duration-300" />
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
                  <p className="text-[11px] text-muted-foreground font-medium">Sync verified across operational grids</p>
               </div>
             </div>
             <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-wide pt-2 border-t border-border/60 ml-1">
                Last Handshake: Real-time <ChevronRight className="w-3 h-3" />
             </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default RegisterAdminDashboard;

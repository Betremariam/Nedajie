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

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[#0d6efd]">
            <Fingerprint className="w-5 h-5" />
            <span className="text-[11px] font-bold tracking-wider uppercase text-blue-600/80">Biometric Identity Hub</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
            Registry Overview
          </h1>
          <p className="text-slate-500 text-[14px] font-medium">Manage and monitor total ecosystem enrollments</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-2 pl-4 rounded-[16px] border border-slate-100 shadow-sm transition-all">
           <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-9 w-9 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 overflow-hidden shadow-sm hover:scale-110 transition-transform">
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} alt="avatar" />
                </div>
              ))}
           </div>
           <div className="pr-4 border-r border-slate-100 h-10 flex flex-col justify-center">
             <span className="text-[10px] font-bold uppercase tracking-tight text-slate-400 leading-none mb-1">Active Operatives</span>
             <span className="text-[13px] font-black text-slate-800 leading-none">12 ONLINE</span>
           </div>
           <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl">
              <Activity className="w-4 h-4 animate-pulse" />
           </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {registrationTypes.map((type, i) => (
          <div key={i} className="bg-white rounded-[24px] shadow-sm border border-slate-100 p-6 relative overflow-hidden group hover:border-blue-100 hover:shadow-md transition-all duration-300">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-150 group-hover:opacity-[0.05] transition-all duration-500">
               <type.icon className="w-24 h-24" />
            </div>
            <div className="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10">
              <h3 className="text-[12px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-800 transition-colors">
                {type.label}
              </h3>
              <div className={cn(
                "p-2 rounded-xl transition-colors",
                 type.color === 'blue' ? "bg-blue-50 text-[#0d6efd]" : 
                 type.color === 'emerald' ? "bg-emerald-50 text-emerald-500" :
                 type.color === 'amber' ? "bg-amber-50 text-amber-500" : "bg-purple-50 text-purple-500"
              )}>
                <type.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="relative z-10">
              <div className="text-3xl font-black tracking-tight text-slate-900 mb-1">
                {type.count}
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-[11px] font-medium text-slate-500">
                  {type.desc}
                </p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md text-emerald-600 bg-emerald-50 border border-emerald-100">
                  {type.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Blocks */}
      <div className="grid gap-6 lg:grid-cols-7">
        
        {/* Rapid Onboarding Block */}
        <div className="lg:col-span-4 bg-[#0f172a] rounded-[24px] text-white border-none shadow-lg overflow-hidden relative group p-8 md:p-10 flex flex-col justify-between min-h-[320px]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0d6efd]/10 to-transparent opacity-50" />
          <div className="absolute -bottom-8 -right-8 opacity-[0.08] group-hover:scale-110 group-hover:rotate-12 transition-transform duration-1000">
             <UserPlus className="w-64 h-64" />
          </div>
          <div className="relative z-10">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-[12px] flex items-center justify-center border border-white/20">
                   <Zap className="h-5 w-5 text-blue-400" />
                </div>
                <span className="bg-blue-500/20 text-blue-300 border-none font-bold uppercase px-3 py-1 rounded-[8px] text-[10px] tracking-widest">
                   Rapid Onboarding
                </span>
             </div>
             <h2 className="text-3xl font-extrabold tracking-tight leading-[1.1] mb-4">
                Onboard new personnel <br />and assets in seconds.
             </h2>
             <p className="text-slate-300 text-[14px] font-medium leading-relaxed max-w-md">
                Deploy standardized identity forms to securely enroll, track, and authenticate users across the fuel ecosystem.
             </p>
          </div>
          <div className="relative z-10 flex flex-wrap gap-4 mt-8">
             <button className="h-12 px-8 font-bold text-[13px] rounded-xl bg-[#0d6efd] text-white hover:bg-blue-600 shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 flex items-center">
                <UserPlus className="mr-2 h-4 w-4" /> 
                Assign New Role
             </button>
             <button className="h-12 px-6 font-bold text-[13px] rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all flex items-center">
                <Database className="mr-2 h-4 w-4 opacity-70" /> 
                Bulk Ingestion
             </button>
          </div>
        </div>

        {/* System Health */}
        <div className="lg:col-span-3 bg-white rounded-[24px] shadow-sm border border-slate-100 p-8 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 blur-2xl opacity-50 pointer-events-none" />
          
          <div className="flex items-center gap-2 mb-2">
             <Activity className="w-4 h-4 text-[#0d6efd]" />
             <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">System Integrity</h3>
          </div>
          <p className="text-slate-800 text-lg font-bold tracking-tight mb-8">Real-time authentication bounds</p>
          
          <div className="space-y-6">
             <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[12px] font-bold text-slate-600 flex items-center gap-2">
                     <Lock className="w-3.5 h-3.5 text-slate-400" /> Database Crypto
                  </span>
                  <span className="text-[11px] font-black text-emerald-500">SECURE</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
                  <div className="h-full bg-[#0d6efd] rounded-full w-[100%] transition-all duration-1000" />
                </div>
             </div>
             <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[12px] font-bold text-slate-600 flex items-center gap-2">
                     <Building2 className="w-3.5 h-3.5 text-slate-400" /> Identity Synchronization
                  </span>
                  <span className="text-[11px] font-black text-emerald-500">OPERATIONAL</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
                  <div className="h-full bg-emerald-500 rounded-full w-[98%] transition-all duration-1000" />
                </div>
             </div>
          </div>
          
          <div className="mt-8 p-5 rounded-[16px] bg-slate-50 border border-slate-100 flex flex-col gap-3 group transition-all">
             <div className="flex items-start gap-3">
               <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
               </div>
               <div className="space-y-0.5">
                  <p className="text-[13px] font-bold text-slate-800">Identities Reconciled</p>
                  <p className="text-[11px] text-slate-500 font-medium">Sync verified across all regions</p>
               </div>
             </div>
             <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wide pt-2 border-t border-slate-200/60 ml-1">
                Last Handshake: Today at 08:42 AM <ChevronRight className="w-3 h-3" />
             </div>
          </div>
        </div>
      </div>

      {/* Footer Banner */}
      <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 p-10 flex flex-col items-center justify-center text-center relative overflow-hidden group">
         <div className="absolute inset-0 bg-slate-50/30 pointer-events-none" />
         
         <div className="relative z-10 flex flex-col items-center max-w-2xl">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-md border border-slate-100 group-hover:-translate-y-1 transition-transform">
               <ShieldCheck className="h-8 w-8 text-[#0d6efd]" />
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 mb-3">Military-Grade Data Sovereignty</h3>
            <p className="text-slate-500 font-medium text-[14px] leading-relaxed mb-8">
               Every asset enrollment is shielded by end-to-end cryptographic layers. Identity telemetry is securely stored with zero-trust compliance protocols.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-6">
               <span className="flex items-center gap-2"><Lock className="w-3.5 h-3.5 text-slate-300" /> AES-256 E2EE</span>
               <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-200" />
               <span className="flex items-center gap-2"><Fingerprint className="w-3.5 h-3.5 text-slate-300" /> Biometric Token</span>
               <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-200" />
               <span className="flex items-center gap-2"><FileCheck className="w-3.5 h-3.5 text-slate-300" /> GRC Compliant</span>
            </div>
            
            <button className="text-[#0d6efd] font-bold text-[13px] hover:text-blue-800 transition-colors flex items-center group/btn">
               Audit Registry Architecture <ArrowRight className="ml-1.5 h-4 w-4 group-hover/btn:translate-x-1 transition-transform bg-transparent" />
            </button>
         </div>
      </div>
      
    </div>
  );
};

export default RegisterAdminDashboard;

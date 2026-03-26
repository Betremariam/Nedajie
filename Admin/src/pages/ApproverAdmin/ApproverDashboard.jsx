import React from "react";
import { 
  UserCheck, 
  Car, 
  Wheat, 
  Fuel, 
  Users2, 
  ClipboardCheck, 
  Clock, 
  AlertCircle,
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

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[#0d6efd]">
            <ClipboardCheck className="w-5 h-5 animate-pulse" />
            <span className="text-[11px] font-bold tracking-wider uppercase text-blue-600/80">Identity Validation Queue</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
             Verification Center
          </h1>
          <p className="text-slate-500 text-[14px] font-medium max-w-xl">Identity Validation & Access Authorization Queue</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right hidden md:block">
              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Avg. Approval Time</p>
              <p className="text-[15px] font-black text-slate-800">4.2 Hours</p>
           </div>
           <div className="bg-blue-50 text-[#0d6efd] border border-blue-100 flex items-center gap-2 py-2 px-4 rounded-xl shadow-sm">
              <Zap className="h-4 w-4 animate-pulse fill-[#0d6efd]" />
              <span className="font-bold text-[11px] uppercase tracking-wider">High Efficiency</span>
           </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {pendingApprovals.map((item, i) => (
          <div key={i} className="bg-white rounded-[24px] shadow-sm border border-slate-100 p-6 relative overflow-hidden group hover:border-blue-100 hover:shadow-md transition-all duration-300">
            <div className={`absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-150 group-hover:opacity-[0.05] transition-all duration-500`}>
               <item.icon className="w-24 h-24" />
            </div>
            <div className="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10">
              <h3 className="text-[12px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-800 transition-colors">
                {item.label}
              </h3>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-[#0d6efd] transition-colors">
                <item.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="relative z-10">
              <div className="text-3xl font-black tracking-tight text-slate-900 mb-2">
                {item.count}
              </div>
              <div className="flex items-center justify-between">
                 <span className={cn(
                   "text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border",
                   item.priority === 'high' ? "text-red-600 bg-red-50 border-red-200" :
                   item.priority === 'medium' ? "text-amber-600 bg-amber-50 border-amber-200" : "text-[#0d6efd] bg-blue-50 border-blue-200"
                 )}>
                   {item.priority}
                 </span>
                 <span className="text-[11px] font-bold text-slate-400">{item.trend}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Action Required Banner */}
        <div className="col-span-4 bg-white rounded-[24px] shadow-sm border border-slate-100 flex flex-col overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-100 pb-4">
             <h2 className="flex items-center gap-3 text-xl font-extrabold tracking-tight text-slate-900">
                <ShieldAlert className="h-5 w-5 text-red-500" />
                Action Required
             </h2>
             <p className="text-slate-500 text-[13px] font-medium mt-1">
                Urgent applications awaiting your validation.
             </p>
          </div>
          
          <div className="p-8 md:p-12 flex-1 flex flex-col justify-center items-center text-center space-y-8 bg-slate-50/50">
             <div className="space-y-3">
                <h2 className="text-6xl font-black tracking-tight text-slate-900">47 <span className="text-xl font-bold text-slate-400 uppercase tracking-widest">Pending</span></h2>
                <p className="text-slate-500 font-medium max-w-[320px] mx-auto text-[14px] leading-relaxed">
                   A batch of driver and attendant applications is ready for final review.
                </p>
             </div>
             
             <div className="space-y-4 w-full flex flex-col items-center">
                 <button className="w-full max-w-[300px] h-14 flex items-center justify-center gap-2 rounded-xl bg-[#0d6efd] text-white text-[13px] font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 duration-200">
                    Begin Verification Batch <ArrowRight className="h-4 w-4" />
                 </button>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Priority sorting enabled • SLA: 24h
                 </p>
             </div>
          </div>
        </div>

        {/* Recent Decisions */}
        <div className="col-span-3 bg-white rounded-[24px] shadow-sm border border-slate-100 flex flex-col overflow-hidden self-start">
          <div className="p-6 md:p-8 border-b border-slate-100 pb-4">
            <h2 className="flex items-center gap-3 text-xl font-extrabold tracking-tight text-slate-900">
               <Clock className="h-5 w-5 text-[#0d6efd]" />
               Recent Decisions
            </h2>
            <p className="text-slate-500 text-[13px] font-medium mt-1">
               Latest approvals and audit trails.
            </p>
          </div>
          
          <div className="p-4 md:p-6 space-y-3">
             {recentDecisions.map((log, i) => (
               <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-transparent hover:border-slate-200 transition-colors group">
                  <div className="flex items-center gap-4">
                     <div className="h-10 w-10 bg-white shadow-sm border border-slate-100 rounded-[12px] flex items-center justify-center font-black text-[#0d6efd] text-xs shrink-0 group-hover:bg-blue-50 transition-colors">
                        {log.name.split(' ').map(n => n[0]).join('')}
                     </div>
                     <div className="min-w-0">
                        <p className="font-bold text-[14px] text-slate-800 truncate">{log.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{log.type} • {log.time}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                      <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Verified</span>
                  </div>
               </div>
             ))}
          </div>
          <div className="p-0 mt-auto bg-slate-50 border-t border-slate-100">
             <button className="w-full h-14 font-bold uppercase tracking-wider text-[11px] text-slate-500 hover:text-[#0d6efd] hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                View Audit History <ArrowUpRight className="w-3.5 h-3.5" />
             </button>
          </div>
        </div>
      </div>

      {/* Policy Compliance */}
      <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
         <div className="p-6 md:p-8 border-b border-slate-100 pb-4">
           <h2 className="text-xl font-extrabold tracking-tight text-slate-900">Policy Compliance</h2>
           <p className="text-slate-500 text-[13px] font-medium mt-1">Performance tracking and standard deviations.</p>
         </div>
         <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 lg:gap-12">
            <div className="flex-1 space-y-6">
               <p className="text-[14px] font-medium text-slate-600 leading-relaxed max-w-2xl">
                 Your approval rate matches the standard deviation for the last quarter. 
                 <span className="text-[#0d6efd] font-bold bg-blue-50 px-1.5 py-0.5 rounded-md mx-1"> 90% accuracy </span> maintained across all verification steps. 
                 Ensure all document watermarks are verified before final commit.
               </p>
               <div className="flex items-center gap-8 bg-slate-50 w-fit p-4 rounded-2xl border border-slate-100">
                  <div className="flex flex-col gap-1">
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last 30 Days</span>
                     <span className="text-xl font-black text-slate-900">1,204 Approvals</span>
                  </div>
                  <div className="w-[1px] h-10 bg-slate-200" />
                  <div className="flex flex-col gap-1">
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Error Margin</span>
                     <span className="text-xl font-black text-emerald-500">0.4%</span>
                  </div>
               </div>
            </div>
            
            <div className="h-40 w-40 relative shrink-0 flex items-center justify-center">
               <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" className="stroke-slate-100" strokeWidth="16" fill="transparent" />
                  <circle cx="80" cy="80" r="70" className="stroke-[#0d6efd]" strokeWidth="16" strokeDasharray="439.8" strokeDashoffset="43.98" fill="transparent" strokeLinecap="round" />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-black text-3xl tracking-tighter text-slate-900">90%</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Accuracy</span>
               </div>
            </div>
         </div>
      </div>
      
    </div>
  );
};

export default ApproveDashboard;

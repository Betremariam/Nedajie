import React from "react";
import { 
  Users, 
  Truck, 
  UserPlus, 
  ShieldCheck, 
  Activity, 
  TrendingUp, 
  ArrowUpRight, 
  Globe,
  Map,
  Zap,
  Ship,
  FileCheck,
  Building2,
  Navigation,
  Clock,
  LayoutDashboard
} from "lucide-react";
import { cn } from "../../lib/utils";

const FederalDashboard = () => {
  const stats = [
    { label: "Regional Super Admins", value: "12", icon: Globe, trend: "Active Nodes", color: "blue", desc: "Provincial oversight" },
    { label: "Verified Station Owners", value: "84", icon: Building2, trend: "Validated", color: "emerald", desc: "Entity level auth" },
    { label: "National Fuel Dispatch", value: "312", icon: Truck, trend: "+24% increase", color: "amber", desc: "Weekly logistics flow" },
    { label: "Regulatory Compliance", value: "Optimal", icon: ShieldCheck, trend: "Audited", color: "purple", desc: "Standard alignment" },
  ];

  const recentDeliveries = [
    { id: 1, destination: "Addis North Terminal", volume: "20,000L", status: "PENDING", time: "10 mins ago", icon: Navigation },
    { id: 2, destination: "Nazreth Logistics Hub", volume: "15,000L", status: "SUPERADMIN_ACCEPTED", time: "1 hour ago", icon: Activity },
    { id: 3, destination: "Bahir Dar Depot", volume: "10,000L", status: "OWNER_ACCEPTED", time: "3 hours ago", icon: FileCheck },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[#0d6efd]">
            <LayoutDashboard className="w-5 h-5 animate-pulse" />
            <span className="text-[11px] font-bold tracking-wider uppercase text-blue-600/80">Federal Authority Layer</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
             National Command Center
          </h1>
          <p className="text-slate-500 text-[14px] font-medium max-w-xl">Unified oversight for strategic fuel reserves and regional distribution networks.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 shadow-sm">
                AD
              </div>
            ))}
          </div>
          <button className="h-10 px-5 flex items-center gap-2 rounded-xl bg-[#0d6efd] text-white text-[13px] font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20">
            Export National Report
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-[24px] shadow-sm border border-slate-100 p-6 relative overflow-hidden group hover:border-blue-100 hover:shadow-md transition-all duration-300">
            <div className={`absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-150 group-hover:opacity-[0.05] transition-all duration-500`}>
               <stat.icon className="w-24 h-24" />
            </div>
            <div className="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10">
              <h3 className="text-[12px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-800 transition-colors">
                {stat.label}
              </h3>
              <div className={cn(
                "p-2 rounded-xl transition-colors",
                 stat.color === 'blue' ? "bg-blue-50 text-[#0d6efd]" : 
                 stat.color === 'emerald' ? "bg-emerald-50 text-emerald-500" :
                 stat.color === 'amber' ? "bg-amber-50 text-amber-500" : "bg-purple-50 text-purple-500"
              )}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="relative z-10">
              <div className="text-3xl font-black tracking-tight text-slate-900 mb-1">
                {stat.value}
              </div>
              <div className="flex flex-wrap items-center justify-between mt-2 gap-2">
                <p className="text-[11px] font-medium text-slate-500">
                  {stat.desc}
                </p>
                <span className={cn(
                   "text-[10px] font-bold px-2 py-0.5 rounded-md border text-blue-700 bg-blue-50 border-blue-200"
                )}>
                  {stat.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Mapping Component */}
        <div className="col-span-4 bg-white rounded-[24px] shadow-sm border border-slate-100 flex flex-col overflow-hidden relative">
          <div className="p-6 md:p-8 border-b border-slate-100 flex flex-row items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900">Regional Distribution Matrix</h2>
              <p className="text-slate-500 text-[13px] font-medium">Strategic fuel quota allocation across domestic administrative zones.</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-[#0d6efd] rounded-2xl flex items-center justify-center">
              <Map className="w-6 h-6" />
            </div>
          </div>
          
          <div className="h-[340px] flex items-center justify-center relative bg-slate-50/50 m-6 mb-8 rounded-[24px] border border-dashed border-slate-200 overflow-hidden">
            <div className="text-center space-y-4 relative z-10 transition-transform hover:scale-105 duration-500">
              <div className="w-20 h-20 bg-blue-50/80 rounded-full flex items-center justify-center mx-auto border border-blue-100">
                <Globe className="h-10 w-10 text-[#0d6efd]/50 animate-spin-slow" />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-bold text-slate-800">Interactive Mapping Layer</p>
                <p className="text-[12px] text-slate-500 font-medium px-12 max-w-sm">Synchronizing geospatial telemetry from regional depots. Database reconciliation in progress.</p>
              </div>
              <button className="h-9 px-6 bg-white border border-slate-200 text-slate-600 rounded-xl text-[11px] uppercase font-bold tracking-widest hover:bg-[#0d6efd] hover:text-white hover:border-[#0d6efd] transition-colors shadow-sm">
                Initialize Layer
              </button>
            </div>
            <div className="absolute inset-0 opacity-10 select-none pointer-events-none">
                <svg className="w-full h-full text-[#0d6efd]" viewBox="0 0 100 100" fill="currentColor">
                    <circle cx="20" cy="30" r="1"/>
                    <circle cx="50" cy="80" r="1.5"/>
                    <circle cx="80" cy="40" r="0.8"/>
                    <path d="M20 30 L50 80 L80 40" stroke="currentColor" strokeWidth="0.2" fill="none"/>
                </svg>
            </div>
          </div>
        </div>

        {/* Deliveries List */}
        <div className="col-span-3 bg-white rounded-[24px] shadow-sm border border-slate-100 flex flex-col overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-100">
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900">Disbursement Stream</h2>
            <p className="text-slate-500 text-[13px] font-medium mt-1">Live telemetry from national supply chain nodes.</p>
          </div>
          <div className="p-4 md:p-6 space-y-3 flex-1 overflow-y-auto">
            {recentDeliveries.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all group cursor-pointer border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-4">
                    <div className={cn(
                      "h-12 w-12 rounded-[14px] flex items-center justify-center transition-all group-hover:rotate-6",
                      item.status === 'OWNER_ACCEPTED' ? "bg-emerald-50 text-emerald-500" : 
                      item.status === 'SUPERADMIN_ACCEPTED' ? "bg-blue-50 text-[#0d6efd]" : "bg-amber-50 text-amber-500"
                    )}>
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-slate-800 leading-tight group-hover:text-[#0d6efd] transition-colors">{item.destination}</p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className={cn(
                          "text-[9px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider",
                          item.status === 'OWNER_ACCEPTED' ? "text-emerald-700 bg-emerald-50 border-emerald-200" : 
                          item.status === 'SUPERADMIN_ACCEPTED' ? "text-blue-700 bg-blue-50 border-blue-200" : "text-amber-700 bg-amber-50 border-amber-200"
                        )}>
                          {item.status.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.time}
                        </span>
                      </div>
                    </div>
                </div>
                <div className="sm:text-right ml-16 md:ml-0 flex items-center sm:block gap-2 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <p className="text-[14px] font-black text-slate-900 tabular-nums">{item.volume}</p>
                  <ArrowUpRight className="h-4 w-4 text-slate-300 ml-auto sm:mt-1 group-hover:text-[#0d6efd] transition-colors flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <button className="w-full h-11 text-[12px] font-bold uppercase tracking-wider text-slate-600 hover:text-[#0d6efd] hover:bg-blue-50 rounded-xl transition-colors">
              View National Logistics Ledger
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default FederalDashboard;

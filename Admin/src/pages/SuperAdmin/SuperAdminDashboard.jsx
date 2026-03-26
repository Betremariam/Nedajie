import React from "react";
import { 
  Users, 
  Fuel, 
  History, 
  ShieldCheck, 
  Activity, 
  TrendingUp,
  Clock,
  ArrowUpRight,
  Zap,
  Settings,
  Users2,
  Terminal,
  MonitorDot,
  Server,
  AlertCircle,
  CheckCircle2,
  Bell,
  Fingerprint
} from "lucide-react";
import { cn } from "../../lib/utils";

const SuperAdminDashboard = () => {
  const stats = [
    { label: "Active Nodes", value: "24", icon: MonitorDot, trend: "+2.4%", color: "emerald", desc: "Regional admin instances" },
    { label: "Supply Points", value: "156", icon: Fuel, trend: "+4 nodes", color: "blue", desc: "Operational fuel stations" },
    { label: "Disbursement Vol", value: "1,284", icon: Zap, trend: "+18.2%", color: "amber", desc: "Total liters today" },
    { label: "System Health", value: "99.9%", icon: ShieldCheck, trend: "Optimal", color: "purple", desc: "Encrypted traffic uptime" },
  ];

  const recentActivity = [
    { id: 1, type: "Registration", user: "Regional Node #04 Initialized", time: "2 mins ago", status: "success", icon: Fingerprint },
    { id: 2, type: "Transaction", user: "Bulk Benzene Allocation Signed", time: "15 mins ago", status: "pending", icon: History },
    { id: 3, type: "Security", user: "Global Auth Protocol Rotated", time: "1 hour ago", status: "warning", icon: ShieldCheck },
    { id: 4, type: "System", user: "Station #42 Connectivity Loss", time: "3 hours ago", status: "error", icon: Server },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[#0d6efd]">
            <Terminal className="w-5 h-5 animate-pulse" />
            <span className="text-[11px] font-bold tracking-wider uppercase text-blue-600/80">Control Layer Active</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
             Global Control Center
          </h1>
          <p className="text-slate-500 text-[14px] font-medium max-w-xl">Centralized intelligence nexus and multi-regional system orchestration.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-10 px-4 flex items-center gap-2 rounded-xl bg-white border border-slate-200 text-slate-600 text-[13px] font-bold hover:bg-slate-50 transition-colors shadow-sm relative">
            <Bell className="w-4 h-4 text-slate-400" />
            Notifications
            <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full flex items-center justify-center bg-red-500 text-white text-[10px] font-bold border-2 border-white">3</span>
          </button>
          <button className="h-10 px-5 flex items-center gap-2 rounded-xl bg-[#0d6efd] text-white text-[13px] font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20">
            <Activity className="w-4 h-4 opacity-80" />
            Live Diagnostics
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
                  "text-[10px] font-bold px-2 py-0.5 rounded-md border",
                  stat.trend.startsWith('+') ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-slate-500 bg-slate-50 border-slate-200"
                )}>
                  {stat.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Network Volume Chart */}
        <div className="col-span-4 bg-white rounded-[24px] shadow-sm border border-slate-100 flex flex-col overflow-hidden relative">
          <div className="p-6 md:p-8 border-b border-slate-100 flex flex-row items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900">Network Volume Monitor</h2>
              <p className="text-slate-500 text-[13px] font-medium">Real-time throughput analysis across all regional clusters.</p>
            </div>
            <div className="flex items-center gap-1 p-1 bg-slate-50 rounded-xl border border-slate-100">
              <button className="h-8 text-[11px] uppercase font-bold px-4 rounded-lg text-slate-500 hover:text-slate-800 transition-colors">24H</button>
              <button className="h-8 text-[11px] uppercase font-bold px-4 rounded-lg bg-white shadow-sm border border-slate-200 text-[#0d6efd]">7D</button>
              <button className="h-8 text-[11px] uppercase font-bold px-4 rounded-lg text-slate-500 hover:text-slate-800 transition-colors">30D</button>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col justify-between pt-6 px-4 md:px-8">
             <div className="h-[240px] flex items-end gap-3 pb-4">
                {[45, 82, 38, 94, 61, 73, 52, 88, 69, 91, 77, 84].map((h, i) => (
                  <div key={i} className="group/bar relative flex-1 h-full flex items-end">
                    <div style={{ height: `${h}%` }} className="w-full bg-blue-50 rounded-t-[8px] hover:bg-[#0d6efd] transition-all duration-500 cursor-pointer relative" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none bg-slate-800 text-white text-[11px] font-bold py-1.5 px-3 rounded-lg shadow-xl whitespace-nowrap z-20">
                      {h}% Load
                    </div>
                  </div>
                ))}
            </div>
          </div>
          
          <div className="p-6 md:p-8 bg-slate-50/50 border-t border-slate-100 mt-2">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Cumulative Sales</p>
                  <p className="text-2xl font-black text-slate-900 tabular-nums">ETB 42.8M</p>
                </div>
                <div className="hidden sm:block w-px h-10 bg-slate-200" />
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Peak Capacity</p>
                  <p className="text-2xl font-black text-slate-900 tabular-nums">94.2%</p>
                </div>
              </div>
              <span className="flex items-center gap-1.5 h-10 px-4 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 font-bold text-[12px]">
                <TrendingUp className="h-4 w-4" /> 
                +24.5% Yield
              </span>
            </div>
          </div>
        </div>

        {/* System Activity Log */}
        <div className="col-span-3 bg-white rounded-[24px] shadow-sm border border-slate-100 flex flex-col overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-100">
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900">System Audit Log</h2>
            <p className="text-slate-500 text-[13px] font-medium mt-1">Live stream of infrastructure events.</p>
          </div>
          <div className="p-4 md:p-6 space-y-3 flex-1 overflow-y-auto">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-3.5 rounded-2xl hover:bg-slate-50 transition-all group cursor-pointer border border-transparent hover:border-slate-100">
                <div className={cn(
                  "h-12 w-12 rounded-[14px] flex items-center justify-center transition-transform group-hover:scale-110",
                  item.status === 'success' ? "bg-emerald-50 text-emerald-500" : 
                  item.status === 'warning' ? "bg-amber-50 text-amber-500" : 
                  item.status === 'pending' ? "bg-blue-50 text-[#0d6efd]" : "bg-red-50 text-red-500"
                )}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-slate-800 leading-tight truncate group-hover:text-[#0d6efd] transition-colors">{item.user}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">{item.type}</p>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                      <Clock className="h-3.5 w-3.5" />
                      {item.time}
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-[#0d6efd] transition-colors" />
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <button className="w-full h-11 text-[12px] font-bold uppercase tracking-wider text-slate-600 hover:text-[#0d6efd] hover:bg-blue-50 rounded-xl transition-colors">
              View Full Audit Ledger
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
         
         {/* Hardware Interface */}
         <div className="col-span-2 bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 md:p-8 flex flex-row items-center justify-between border-b border-slate-100">
                <div className="space-y-1">
                  <h2 className="text-xl font-extrabold tracking-tight text-slate-900">Hardware Interface</h2>
                  <p className="text-slate-500 text-[13px] font-medium">Direct execution commands for root orchestration.</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 text-[#0d6efd] rounded-2xl flex items-center justify-center">
                  <Zap className="h-6 w-6 animate-pulse" />
                </div>
            </div>
            <div className="p-6 md:p-8">
               <div className="grid grid-cols-2 gap-6">
                  <button className="h-28 flex flex-col gap-3 justify-center items-center rounded-[20px] bg-slate-50 border border-slate-100 hover:bg-blue-50 hover:border-blue-100 transition-all group overflow-hidden relative shadow-sm">
                    <div className="absolute top-0 left-0 w-full h-1 bg-slate-200 group-hover:bg-[#0d6efd] transition-colors" />
                    <Settings className="h-7 w-7 text-slate-400 group-hover:text-[#0d6efd] transition-colors" />
                    <span className="text-[12px] uppercase font-bold text-slate-600 group-hover:text-[#0d6efd] tracking-wider">Matrix Config</span>
                  </button>
                  <button className="h-28 flex flex-col gap-3 justify-center items-center rounded-[20px] bg-slate-50 border border-slate-100 hover:bg-blue-50 hover:border-blue-100 transition-all group overflow-hidden relative shadow-sm">
                    <div className="absolute top-0 left-0 w-full h-1 bg-slate-200 group-hover:bg-[#0d6efd] transition-colors" />
                    <Users2 className="h-7 w-7 text-slate-400 group-hover:text-[#0d6efd] transition-colors" />
                    <span className="text-[12px] uppercase font-bold text-slate-600 group-hover:text-[#0d6efd] tracking-wider">Auth Rotation</span>
                  </button>
               </div>
            </div>
         </div>
         
         {/* Network Shield */}
         <div className="bg-[#0f172a] rounded-[24px] shadow-sm border border-slate-800 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-150 transition-transform duration-700 pointer-events-none">
              <ShieldCheck className="w-32 h-32 text-emerald-400" />
            </div>
            <div className="p-6 md:p-8 relative z-10 flex flex-col h-full justify-between">
              <div>
                 <h2 className="text-xl font-extrabold tracking-tight text-white mb-1">Network Shield</h2>
                 <p className="text-slate-400 text-[13px] font-medium">Advanced threat assessment.</p>
              </div>
              <div className="mt-8 space-y-8">
                 <div className="flex items-end justify-between">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Trust Score</span>
                      <span className="text-5xl font-black text-emerald-400 block tracking-tight">94.2<span className="text-2xl">%</span></span>
                    </div>
                    <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center justify-center">
                      <ShieldCheck className="h-7 w-7 text-emerald-400" />
                    </div>
                 </div>
                 <div className="space-y-2.5">
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
                      <span>Protocol Integrity</span>
                      <span className="text-emerald-400">Validated</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
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

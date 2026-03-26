import React from "react";
import { 
  Users, 
  Fuel, 
  History, 
  ArrowUpRight, 
  Droplets,
  Zap,
  Clock,
  LayoutDashboard,
  Wallet,
  Package,
  ArrowDownRight,
  ShieldCheck,
  Activity,
  Box,
  TrendingUp,
  AlertTriangle,
  ChevronRight
} from "lucide-react";
import { cn } from "../../lib/utils";

const OwnerDashboard = () => {
  const stats = [
    { label: "Station Personnel", value: "08", icon: Users, trend: "Online", color: "emerald" },
    { label: "Daily Throughput", value: "342", icon: Activity, trend: "+12.5%", color: "blue" },
    { label: "Revenue Spectrum", value: "$12,450", icon: Wallet, trend: "+8.2%", color: "emerald" },
    { label: "System Alerts", value: "02", icon: Zap, trend: "Priority High", color: "red" },
  ];

  const recentDeliveries = [
    { id: 1, type: "Diesel Max", volume: "5,000L", time: "Today, 10:30 AM", status: "completed" },
    { id: 2, type: "Unleaded", volume: "3,500L", time: "Yesterday, 04:15 PM", status: "completed" },
    { id: 3, type: "Diesel Max", volume: "4,000L", time: "2 days ago", status: "completed" },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[#0d6efd]">
            <ShieldCheck className="w-5 h-5 animate-pulse" />
            <span className="text-[11px] font-bold tracking-wider uppercase text-blue-600/80">Node Operations Active</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
             Station Control
          </h1>
          <p className="text-slate-500 text-[14px] font-medium max-w-xl">Tactical oversight of fuel assets and personnel.</p>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
           <button className="h-9 px-6 rounded-xl bg-white shadow-sm border border-slate-200 font-bold uppercase tracking-widest text-[11px] text-[#0d6efd]">Real-time</button>
           <button className="h-9 px-6 rounded-xl font-bold uppercase tracking-widest text-[11px] text-slate-500 hover:text-slate-700 transition-colors">Historical</button>
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
                 stat.color === 'red' ? "bg-red-50 text-red-500" : "bg-slate-50 text-slate-500"
              )}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="relative z-10">
              <div className="text-3xl font-black tracking-tight text-slate-900 mb-2">
                {stat.value}
              </div>
              <div className="flex items-center justify-between">
                 {stat.trend.startsWith('+') ? (
                   <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-bold uppercase tracking-wider">
                      <TrendingUp className="h-3 w-3" /> {stat.trend}
                   </div>
                 ) : (
                   <span className={cn(
                     "text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 px-2.5 py-1 rounded-lg border",
                     stat.color === 'red' ? "text-red-600 bg-red-50 border-red-100 animate-pulse" : "text-slate-500 bg-slate-50 border-slate-200"
                   )}>
                      {stat.color === 'red' && <AlertTriangle className="w-3 h-3" />}
                      {stat.trend}
                   </span>
                 )}
                 <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                    Active
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      stat.color === 'red' ? "bg-red-500" : "bg-emerald-500 animate-pulse"
                    )} />
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        
        {/* Inventory Matrix */}
        <div className="lg:col-span-8 bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform pointer-events-none">
             <Box className="w-48 h-48 text-[#0d6efd]" />
          </div>
          <div className="p-6 md:p-8 pb-4 border-b border-slate-100">
             <h2 className="flex items-center gap-3 text-xl font-extrabold tracking-tight text-slate-900">
                <Package className="h-5 w-5 text-[#0d6efd]" />
                Inventory Matrix
             </h2>
             <p className="text-slate-500 text-[13px] font-medium mt-1">
                Live synchronization of regional fuel reservoirs.
             </p>
          </div>
          
          <div className="p-6 md:p-8 space-y-12 relative z-10">
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                   <h2 className="text-6xl font-black tracking-tight text-slate-900">142.8k <span className="text-lg font-bold text-slate-400 ml-1 uppercase tracking-widest">Liters</span></h2>
                   <div className="flex flex-wrap items-center gap-3 mt-4">
                      <span className="bg-blue-50 text-[#0d6efd] border border-blue-100 font-bold px-3 py-1.5 rounded-lg text-[11px] uppercase tracking-wider">76% Utilization</span>
                      <p className="text-[12px] font-bold text-slate-500 flex items-center gap-2">
                         <Activity className="w-3.5 h-3.5 text-emerald-500" /> System pressure nominal
                      </p>
                   </div>
                </div>
                <div className="flex flex-col gap-2">
                   <div className="h-10 flex items-center gap-3 bg-slate-50 px-4 rounded-xl border border-slate-200">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">All Tanks Online</span>
                   </div>
                </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Tank 1 */}
                <div className="space-y-4">
                   <div className="flex justify-between items-end">
                      <div>
                         <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Unleaded Premium</p>
                         <h4 className="text-2xl font-black text-slate-900 flex items-center gap-2 tabular-nums">82,450 <span className="text-[11px] font-bold text-slate-400 uppercase">L</span></h4>
                      </div>
                      <span className="text-[12px] font-black text-[#0d6efd] bg-blue-50 px-2.5 py-1 rounded-lg">65%</span>
                   </div>
                   <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                      <div className="h-full bg-[#0d6efd] w-[65%] rounded-full shadow-[0_0_10px_rgba(13,110,253,0.3)] transition-all duration-1000" />
                   </div>
                   <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5"><ChevronRight className="w-3 h-3 text-slate-300" /> Est. depletion: 14 days based on trajectory</p>
                </div>
                
                {/* Tank 2 */}
                <div className="space-y-4">
                   <div className="flex justify-between items-end">
                      <div>
                         <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Diesel Max</p>
                         <h4 className="text-2xl font-black text-slate-900 flex items-center gap-2 tabular-nums">60,350 <span className="text-[11px] font-bold text-slate-400 uppercase">L</span></h4>
                      </div>
                      <span className="text-[12px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">88%</span>
                   </div>
                   <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                      <div className="h-full bg-emerald-500 w-[88%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all duration-1000" />
                   </div>
                   <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5"><ChevronRight className="w-3 h-3 text-slate-300" /> Next replenishment: Priority Normal</p>
                </div>
             </div>
          </div>
          
          <div className="bg-slate-50 border-t border-slate-100 py-4 px-6 md:px-8">
             <p className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-2 tracking-wider">
                <Clock className="h-3.5 w-3.5 text-[#0d6efd]" /> Delivery sequence initiation: Tomorrow 09:00 GST
             </p>
          </div>
        </div>

        {/* Asset Inflow */}
        <div className="lg:col-span-4 bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden self-start">
          <div className="p-6 md:p-8 border-b border-slate-100 pb-4">
            <h2 className="flex items-center gap-3 text-xl font-extrabold tracking-tight text-slate-900">
               <History className="h-5 w-5 text-[#0d6efd]" />
               Asset Inflow
            </h2>
            <p className="text-slate-500 text-[13px] font-medium mt-1">
               Recent verified bulk replenishments.
            </p>
          </div>
          
          <div className="p-0">
             <div className="divide-y divide-slate-100">
                {recentDeliveries.map((delivery) => (
                  <div key={delivery.id} className="flex items-center justify-between p-5 md:p-6 group hover:bg-slate-50 transition-all cursor-pointer">
                     <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-slate-100 rounded-[14px] flex items-center justify-center font-bold text-slate-500 group-hover:bg-blue-50 group-hover:text-[#0d6efd] transition-all border border-slate-200">
                           <Fuel className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                           <p className="font-bold text-[14px] text-slate-800 truncate tracking-tight">{delivery.type}</p>
                           <p className="text-[11px] font-medium text-slate-500 tracking-wider flex items-center gap-1.5 mt-1">
                              {delivery.volume} <span className="w-1 h-1 rounded-full bg-slate-300" /> {delivery.time}
                           </p>
                        </div>
                     </div>
                     <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100 group-hover:bg-emerald-100 transition-colors">
                        <ArrowDownRight className="h-4 w-4" />
                     </div>
                  </div>
                ))}
             </div>
          </div>
          
          <button className="w-full h-14 font-bold uppercase tracking-wider text-[11px] text-slate-500 bg-slate-50 border-t border-slate-100 hover:text-[#0d6efd] transition-colors flex items-center justify-center gap-2">
             Detailed Audit Log <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Operational Intelligence Banner */}
      <div className="bg-[#0f172a] rounded-[24px] border border-slate-800 shadow-xl overflow-hidden relative group mt-8">
         <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent opacity-50 transition-opacity group-hover:opacity-100" />
         <div className="py-12 md:py-16 flex flex-col items-center justify-center text-center space-y-6 relative z-10 px-8">
            <div className="h-16 w-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-2 border border-blue-500/20 group-hover:scale-110 transition-transform duration-500">
               <Zap className="h-8 w-8 text-blue-400 fill-blue-400/20" />
            </div>
            <div className="space-y-3">
               <h3 className="text-3xl font-extrabold tracking-tight text-white">Operational Intelligence</h3>
               <p className="text-slate-400 max-w-lg mx-auto font-medium text-[15px] leading-relaxed">
                  Peak demand detected on <span className="text-blue-400 font-bold px-1">TUESDAY</span> cycles. Node optimization suggested for maximum throughput during these high-velocity windows.
               </p>
            </div>
            <button className="h-12 mt-4 px-8 font-bold uppercase tracking-wider text-[12px] bg-[#0d6efd] text-white hover:bg-blue-600 shadow-lg shadow-blue-500/20 rounded-xl transition-all">
               Synthesize Full Analytics
            </button>
         </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;

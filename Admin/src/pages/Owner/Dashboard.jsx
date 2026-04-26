import React, { useEffect, useState } from "react";
import API from "../../services/api";
import {
  TrendingUp,
  Fuel,
  History,
  Droplets,
  Zap,
  Activity,
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
  Clock,
  MapPin,
  ChevronRight,
  Package,
  Loader2,
  AlertCircle
} from "lucide-react";
import { cn } from "../../lib/utils";

const Dashboard = () => {
  const [stats, setStats] = useState([
    { label: "Total Volume", value: "0 L", icon: Droplets, color: "emerald", desc: "Benzene & Diesel" },
    { label: "Daily Sales", value: "ETB 0", icon: TrendingUp, color: "blue", desc: "Total revenue today" },
    { label: "Attendants", value: "0", icon: Users, color: "purple", desc: "Active on shifts" },
    { label: "Stock Level", value: "0%", icon: Package, color: "amber", desc: "Storage capacity" },
  ]);

  const [recentDeliveries, setRecentDeliveries] = useState([]);
  const [stockLevels, setStockLevels] = useState({ benzene: 0, diesel: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("adminToken");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      // 1. Fetch Stock
      const stockRes = await API.get(`/owners/stock`);
      const stockData = stockRes.data || { benzene: 0, diesel: 0 };
      setStockLevels(stockData);

      // 2. Fetch Attendants
      const attendantsRes = await API.get("/owners/my-attendants");
      const attendantsCount = attendantsRes.data?.length || 0;

      // 3. Fetch Recent Deliveries (Fuel Received)
      const deliveriesRes = await API.get(`/owners/fuel-received`);
      const deliveriesData = deliveriesRes.data || [];
      setRecentDeliveries(deliveriesData.slice(0, 3));

      // 4. Fetch Transactions for Daily Sales (Sum liters * estimated price or just liters for now)
      const transactionsRes = await API.get(`/owners/transactions`);
      const transactionsData = transactionsRes.data || [];
      
      const today = new Date().toISOString().split('T')[0];
      const todayTxs = transactionsData.filter(tx => 
        new Date(tx.createdAt).toISOString().split('T')[0] === today
      );
      const todayLiters = todayTxs.reduce((sum, tx) => sum + (tx.liters || 0), 0);

      // Calculate aggregates
      const totalVol = stockData.benzene + stockData.diesel;
      const MAX_TOTAL = 40000; // Estimated max for percentage display
      const stockPercent = Math.min(Math.round((totalVol / MAX_TOTAL) * 100), 100);

      setStats([
        { label: "Total Volume", value: `${totalVol.toLocaleString()} L`, icon: Droplets, color: "emerald", desc: "Benzene & Diesel" },
        { label: "Daily Sales", value: `${todayLiters.toLocaleString()} L`, icon: TrendingUp, color: "blue", desc: "Liters dispensed today" },
        { label: "Attendants", value: attendantsCount.toString(), icon: Users, color: "purple", desc: "Registered personnel" },
        { label: "Stock Level", value: `${stockPercent}%`, icon: Package, color: "amber", desc: "Aggregate capacity" },
      ]);

    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Strategic telemetry link failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return (
    <div className="h-[80vh] flex flex-col items-center justify-center gap-6 font-sans">
      <div className="relative">
        <Loader2 className="h-16 w-16 animate-spin text-primary opacity-20" />
        <Activity className="h-8 w-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <div className="text-center space-y-2">
        <p className="text-xl font-semibold tracking-tight">Syncing Node Telemetry</p>
        <p className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold">Scanning operational grids...</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto font-sans">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-foreground" />
            <span className="text-[11px] font-bold tracking-wider uppercase text-primary/80">Station Proprietor Node</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground flex items-center gap-3">
             Station Overview
          </h1>
          <p className="text-muted-foreground text-[14px] font-medium max-w-xl">Real-time asset telemetry and inventory management.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center justify-center text-foreground">
              <Activity className="h-8 w-8" />
           </div>
           <button 
            onClick={fetchData}
            className="h-11 px-6 flex items-center gap-2 rounded-xl bg-primary text-primary-foreground text-[13px] font-bold hover:bg-primary/90 transition-all shadow-sm"
           >
             <History className="w-4 h-4 opacity-80" />
             Refresh Feed
           </button>
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">

        {/* Inventory Analytics */}
        <div className="col-span-4 bg-card rounded-[24px] shadow-sm border border-border flex flex-col overflow-hidden group/analytics">
          <div className="p-6 md:p-8 border-b border-border flex flex-row items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold tracking-tight text-foreground flex items-center gap-2">
                <Fuel className="h-5 w-5 text-primary" />
                Live Storage Monitor
              </h2>
              <p className="text-muted-foreground text-[13px] font-medium mt-1">Underground tank levels and capacity tracking.</p>
            </div>
             <a href="/owner/fuel-stock" className="h-10 px-4 flex items-center gap-2 rounded-xl bg-muted/40 border border-border text-muted-foreground text-[12px] font-bold hover:bg-muted/50 transition-colors">
                Detailed Log <ChevronRight className="w-4 h-4" />
             </a>
          </div>

          <div className="p-8 md:p-10 space-y-10 flex-1 flex flex-col justify-center">
             <div className="space-y-4">
               <div className="flex justify-between items-end px-1">
                 <div className="space-y-1">
                   <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Benzene Aggregate</span>
                   <span className="text-2xl font-black text-foreground tabular-nums">{stockLevels.benzene.toLocaleString()} L <span className="text-[14px] font-bold text-muted-foreground/60 uppercase">/ 20k</span></span>
                 </div>
                 <span className="text-[12px] font-black text-primary">{Math.min(Math.round((stockLevels.benzene / 20000) * 100), 100)}%</span>
               </div>
                <div className="h-4 w-full bg-muted rounded-full overflow-hidden p-1 border border-border">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min((stockLevels.benzene / 20000) * 100, 100)}%` }} 
                  />
                </div>
             </div>

             <div className="space-y-4">
               <div className="flex justify-between items-end px-1">
                 <div className="space-y-1">
                   <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Diesel Aggregate</span>
                   <span className="text-2xl font-black text-foreground tabular-nums">{stockLevels.diesel.toLocaleString()} L <span className="text-[14px] font-bold text-muted-foreground/60 uppercase">/ 20k</span></span>
                 </div>
                 <span className="text-[12px] font-black text-emerald-500">{Math.min(Math.round((stockLevels.diesel / 20000) * 100), 100)}%</span>
               </div>
                <div className="h-4 w-full bg-muted rounded-full overflow-hidden p-1 border border-border">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min((stockLevels.diesel / 20000) * 100, 100)}%` }} 
                  />
                </div>
             </div>
          </div>

          <div className="p-6 md:p-8 bg-muted/20 border-t border-border mt-2">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                      <ShieldCheck className="h-5 w-5" />
                   </div>
                   <div>
                      <p className="text-[13px] font-semibold text-foreground">Stock Integrity SECURE</p>
                      <p className="text-[11px] text-muted-foreground font-medium">Automatic sensors synchronized</p>
                   </div>
                </div>
                <Zap className="h-5 w-5 text-primary/30" />
             </div>
          </div>
        </div>

        {/* Supply Ledger */}
        <div className="col-span-3 bg-card rounded-[24px] shadow-sm border border-border flex flex-col overflow-hidden">
          <div className="p-6 md:p-8 border-b border-border pb-4">
            <h2 className="flex items-center gap-3 text-xl font-semibold tracking-tight text-foreground">
               <History className="h-5 w-5 text-primary" />
               Supply Ledger
            </h2>
            <p className="text-muted-foreground text-[13px] font-medium mt-1">Latest inbound fuel deliveries.</p>
          </div>

          <div className="p-4 md:p-6 space-y-3 flex-1 overflow-auto">
             {recentDeliveries.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-3 opacity-40">
                  <Package className="w-10 h-10" />
                  <p className="text-[11px] font-bold uppercase tracking-widest">No Recent Deliveries</p>
               </div>
             ) : recentDeliveries.map((delivery) => (
                <div key={delivery.id} className="flex items-center justify-between p-4 rounded-2xl bg-muted/40 hover:bg-muted/60 border border-transparent hover:border-border transition-all cursor-pointer group">
                   <div className="flex items-center gap-4">
                      <div className="h-10 w-10 flex items-center justify-center">
                         <Droplets className="h-8 w-8 text-foreground" />
                      </div>
                     <div>
                        <p className="font-bold text-[14px] text-foreground group-hover:text-primary transition-colors">{delivery.gasType}</p>
                        <p className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-wider">{new Date(delivery.date).toLocaleDateString()}</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="font-black text-[15px] text-foreground tabular-nums">{delivery.liters.toLocaleString()} L</p>
                     <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-500">Verified</p>
                  </div>
               </div>
             ))}
          </div>

          <div className="p-4 bg-muted/30 border-t border-border">
             <a href="/owner/fuel-received" className="w-full h-11 flex items-center justify-center font-bold text-[11px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors rounded-xl border border-transparent hover:border-primary/20">
                View Receipt History <ArrowRight className="inline-block ml-1 h-3.5 w-3.5" />
             </a>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;

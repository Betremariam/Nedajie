import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { 
  Droplets, 
  Activity, 
  AlertCircle, 
  Loader2, 
  Waves, 
  Zap, 
  ShieldCheck,
  TrendingUp,
  Database,
  Box,
  ChevronRight
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/Alert";
import { cn } from "../../lib/utils";

const OwnerFuelStock = () => {
  const [fuelStock, setFuelStock] = useState({ benzene: 0, diesel: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("adminToken");
  const stationIds = JSON.parse(localStorage.getItem("stationIds") || "[]");

  useEffect(() => {
    const fetchFuelStock = async () => {
      try {
        if (!token) {
          setError("Authorization sequence failed. Re-authentication required.");
          setLoading(false);
          return;
        }

        if (!stationIds || stationIds.length === 0) {
          setError("Operational node identification failed. No stations assigned.");
          setLoading(false);
          return;
        }

        const query = stationIds.map((id) => `stationIds=${id}`).join("&");
        const res = await API.get(`/owners/stock?${query}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFuelStock(res.data || { benzene: 0, diesel: 0 });
      } catch (err) {
        console.error("Error fetching owner fuel stock:", err);
        setError(err.response?.data?.msg || "Reservoir telemetry link severed. Synchronization failed.");
      } finally {
        setLoading(false);
      }
    };

    fetchFuelStock();
  }, [token]);

  if (loading) return (
    <div className="h-[80vh] flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <Loader2 className="h-16 w-16 animate-spin text-primary opacity-20" />
        <Waves className="h-8 w-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <div className="text-center space-y-2">
        <p className="text-xl font-black tracking-tight italic text-foreground">Syncing Reservoir Levels</p>
        <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.3em] animate-pulse">Scanning operational nodes...</p>
      </div>
    </div>
  );

  const benzene = fuelStock?.benzene ?? 0;
  const diesel = fuelStock?.diesel ?? 0;

  // Visual thresholds (assuming some max capacity for display purposes)
  const MAX_CAPACITY = 20000; 
  const benzenePercent = Math.min((benzene / MAX_CAPACITY) * 100, 100);
  const dieselPercent = Math.min((diesel / MAX_CAPACITY) * 100, 100);

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1 text-primary">
            <Database className="w-5 h-5" />
            <span className="text-[10px] font-mono font-black tracking-[0.2em] uppercase text-primary/60">Asset Reservoir Monitor</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground italic">Fuel Stocks</h1>
          <p className="text-muted-foreground text-lg mt-1 italic">Real-time telemetry of liquid assets across operational nodes.</p>
        </div>
        <div className="hidden md:flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
           <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
           Live Telemetry Feed
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="border-red-500/50 bg-red-500/5 max-w-4xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-black text-[10px] uppercase tracking-widest">Protocol Failure</AlertTitle>
          <AlertDescription className="font-bold">{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Benzene Card */}
        <Card className="border-border/50 shadow-2xl shadow-primary/5 group hover:border-primary/30 transition-all duration-500 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
             <Droplets className="w-32 h-32" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 relative z-10">
            <div>
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors">
                Benzene Level
              </CardTitle>
              <CardDescription className="italic font-medium">Unleaded Premium Reservoir</CardDescription>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
               <Zap className="h-6 w-6" />
            </div>
          </CardHeader>
          <CardContent className="space-y-8 relative z-10 pb-10">
            <div className="text-center space-y-2">
              <div className="text-6xl font-black tracking-tighter tabular-nums text-foreground group-hover:text-primary transition-colors">
                {benzene.toLocaleString()} <span className="text-lg font-medium text-muted-foreground uppercase not-italic tracking-widest ml-1">L</span>
              </div>
              <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">Operational Aggregate</p>
            </div>
            
            <div className="space-y-3">
               <div className="flex justify-between items-end px-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Capacity Utilization</span>
                  <span className="text-xs font-black font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-md">{Math.round(benzenePercent)}%</span>
               </div>
               <div className="h-4 w-full bg-muted rounded-full overflow-hidden border border-border/50 p-0.5">
                  <div 
                    className="h-full bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)] transition-all duration-1000 ease-out" 
                    style={{ width: `${benzenePercent}%` }}
                  />
               </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border/10">
               <Badge className={cn(
                  "font-black text-[9px] uppercase tracking-widest px-3 py-1 border-none shadow-lg",
                  benzene > 10000 ? "bg-emerald-500/10 text-emerald-600 shadow-emerald-500/10" : benzene > 5000 ? "bg-amber-500/10 text-amber-600 shadow-amber-500/10" : "bg-red-500/10 text-red-500 shadow-red-500/10"
               )}>
                  {benzene > 10000 ? "Level Nominal" : benzene > 5000 ? "Threshold Alert" : "CRITICAL DEPLETION"}
               </Badge>
               <div className="flex items-center gap-1.5 text-[8px] font-bold text-muted-foreground/40 italic">
                  Node Link Secure
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               </div>
            </div>
          </CardContent>
        </Card>

        {/* Diesel Card */}
        <Card className="border-border/50 shadow-2xl shadow-emerald-500/5 group hover:border-emerald-500/30 transition-all duration-500 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform text-emerald-500">
             <Waves className="w-32 h-32" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 relative z-10">
            <div>
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-emerald-500 transition-colors">
                Diesel Level
              </CardTitle>
              <CardDescription className="italic font-medium">Diesel Max Reservoir</CardDescription>
            </div>
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
               <Droplets className="h-6 w-6" />
            </div>
          </CardHeader>
          <CardContent className="space-y-8 relative z-10 pb-10">
            <div className="text-center space-y-2">
              <div className="text-6xl font-black tracking-tighter tabular-nums text-foreground group-hover:text-emerald-500 transition-colors">
                {diesel.toLocaleString()} <span className="text-lg font-medium text-muted-foreground uppercase not-italic tracking-widest ml-1">L</span>
              </div>
              <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">Operational Aggregate</p>
            </div>
            
            <div className="space-y-3">
               <div className="flex justify-between items-end px-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Capacity Utilization</span>
                  <span className="text-xs font-black font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md">{Math.round(dieselPercent)}%</span>
               </div>
               <div className="h-4 w-full bg-muted rounded-full overflow-hidden border border-border/50 p-0.5">
                  <div 
                    className="h-full bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-1000 ease-out" 
                    style={{ width: `${dieselPercent}%` }}
                  />
               </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border/10">
               <Badge className={cn(
                  "font-black text-[9px] uppercase tracking-widest px-3 py-1 border-none shadow-lg",
                  diesel > 10000 ? "bg-emerald-500 text-white" : diesel > 5000 ? "bg-amber-500 text-white" : "bg-red-500 text-white"
               )}>
                  {diesel > 10000 ? "OPTIMAL" : diesel > 5000 ? "MODERATE" : "REPLENISH"}
               </Badge>
               <div className="flex items-center gap-1.5 text-[8px] font-bold text-muted-foreground/40 italic">
                  Node Link Secure
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-foreground text-background border-none shadow-2xl shadow-black/20 overflow-hidden relative group max-w-5xl mx-auto">
         <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-50" />
         <CardContent className="py-10 flex flex-col items-center justify-center text-center space-y-6 relative z-10 px-10">
            <div className="h-14 w-14 bg-background/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-2 border border-background/20 group-hover:scale-110 transition-transform duration-500">
               <ShieldCheck className="h-7 w-7 text-primary shadow-glow" />
            </div>
            <div className="space-y-2">
               <h3 className="text-2xl font-black tracking-tight italic">Strategic Reservoir Oversight</h3>
               <p className="text-muted-foreground max-w-xl mx-auto font-medium leading-relaxed italic">
                  Logistics and supply-chain synchronization active. Stock levels are verified against Federal and Regional distribution metrics for audit-ready compliance.
               </p>
            </div>
            <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
               <span className="flex items-center gap-2"><Box className="w-3 h-3" /> Audit Path Lock</span>
               <span className="w-1 h-1 rounded-full bg-border" />
               <span className="flex items-center gap-2"><TrendingUp className="w-3 h-3" /> Growth Metric Verified</span>
            </div>
         </CardContent>
      </Card>
    </div>
  );
};

export default OwnerFuelStock;

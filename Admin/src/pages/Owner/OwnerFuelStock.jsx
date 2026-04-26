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

  useEffect(() => {
    const fetchFuelStock = async () => {
      try {
        if (!token) {
          setError("Authorization sequence failed. Re-authentication required.");
          setLoading(false);
          return;
        }

        const res = await API.get(`/owners/stock`, {
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
    <div className="h-[80vh] flex flex-col items-center justify-center gap-6 font-sans">
      <div className="relative">
        <Loader2 className="h-16 w-16 animate-spin text-primary opacity-20" />
        <Waves className="h-8 w-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <div className="text-center space-y-2">
        <p className="text-xl font-semibold tracking-tight text-foreground">Syncing Reservoir Levels</p>
        <p className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold">Scanning operational nodes...</p>
      </div>
    </div>
  );

  const benzene = Number(fuelStock?.benzene) || 0;
  const diesel = Number(fuelStock?.diesel) || 0;

  // Visual thresholds (assuming some max capacity for display purposes)
  const MAX_CAPACITY = 100000; 
  const benzenePercent = Math.min((benzene / MAX_CAPACITY) * 100, 100) || 0;
  const dieselPercent = Math.min((diesel / MAX_CAPACITY) * 100, 100) || 0;

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-6xl mx-auto font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 mb-1 text-primary">
            <Database className="w-5 h-5" />
            <span className="text-[11px] font-bold tracking-wider uppercase text-primary/80">Asset Reservoir Monitor</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Fuel Stocks</h1>
          <p className="text-muted-foreground text-[14px] font-medium max-w-xl">Real-time telemetry of liquid assets across operational nodes.</p>
        </div>
        <div className="hidden md:flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/40">
           <Activity className="w-4 h-4 text-emerald-500" />
           Live Telemetry Feed
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="border-destructive/50 bg-destructive/5 rounded-2xl max-w-4xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-bold text-[11px] uppercase tracking-widest">Protocol Failure</AlertTitle>
          <AlertDescription className="font-medium text-[13px]">{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Benzene Card */}
        <Card className="border-border shadow-sm rounded-[24px] group hover:border-primary/30 transition-all duration-300 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5 transition-transform group-hover:scale-110 transition-all">
             <Droplets className="w-32 h-32" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 relative z-10">
            <div>
              <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">
                Benzene Level
              </CardTitle>
              <CardDescription className="text-xs font-medium">Unleaded Premium Reservoir</CardDescription>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary transition-all duration-300">
               <Zap className="h-6 w-6" />
            </div>
          </CardHeader>
          <CardContent className="space-y-8 relative z-10 pb-10 px-8">
            <div className="text-center space-y-1">
              <div className="text-5xl font-bold tracking-tight tabular-nums text-foreground group-hover:text-primary transition-colors">
                {benzene.toLocaleString()} <span className="text-lg font-medium text-muted-foreground uppercase tracking-widest ml-1">L</span>
              </div>
              <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Operational Aggregate</p>
            </div>
            
            <div className="space-y-3.5">
               <div className="flex justify-between items-end px-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Capacity Utilization</span>
                  <span className="text-xs font-bold font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-md">{Math.round(benzenePercent)}%</span>
               </div>
               <div className="h-4 w-full bg-muted rounded-full overflow-hidden border border-border p-1">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${benzenePercent}%` }}
                  />
               </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-border/10">
               <Badge variant="secondary" className={cn(
                  "font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full",
                  benzene > 10000 ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : benzene > 5000 ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"
               )}>
                  {benzene > 10000 ? "Level Nominal" : benzene > 5000 ? "Threshold Alert" : "CRITICAL DEPLETION"}
               </Badge>
               <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/40">
                  Node Link Secure
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
               </div>
            </div>
          </CardContent>
        </Card>

        {/* Diesel Card */}
        <Card className="border-border shadow-sm rounded-[24px] group hover:border-emerald-500/30 transition-all duration-300 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5 transition-transform text-emerald-500 group-hover:scale-110 transition-all">
             <Waves className="w-32 h-32" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 relative z-10">
            <div>
              <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-emerald-500 transition-colors">
                Diesel Level
              </CardTitle>
              <CardDescription className="text-xs font-medium">Diesel Max Reservoir</CardDescription>
            </div>
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 transition-all duration-300">
               <Droplets className="h-6 w-6" />
            </div>
          </CardHeader>
          <CardContent className="space-y-8 relative z-10 pb-10 px-8">
            <div className="text-center space-y-1">
              <div className="text-5xl font-bold tracking-tight tabular-nums text-foreground group-hover:text-emerald-500 transition-colors">
                {diesel.toLocaleString()} <span className="text-lg font-medium text-muted-foreground uppercase tracking-widest ml-1">L</span>
              </div>
              <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Operational Aggregate</p>
            </div>
            
            <div className="space-y-3.5">
               <div className="flex justify-between items-end px-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Capacity Utilization</span>
                  <span className="text-xs font-bold font-mono text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">{Math.round(dieselPercent)}%</span>
               </div>
               <div className="h-4 w-full bg-muted rounded-full overflow-hidden border border-border p-1">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${dieselPercent}%` }}
                  />
               </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-border/10">
               <Badge variant="secondary" className={cn(
                  "font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full",
                  diesel > 10000 ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : diesel > 5000 ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"
               )}>
                  {diesel > 10000 ? "OPTIMAL" : diesel > 5000 ? "MODERATE" : "REPLENISH"}
               </Badge>
               <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/40">
                  Node Link Secure
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
               </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border border-border shadow-sm rounded-[24px] overflow-hidden relative group max-w-5xl mx-auto mt-4 px-8 py-10">
         <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
         <CardContent className="flex flex-col items-center justify-center text-center space-y-6 relative z-10 p-0">
            <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-2 border border-primary/20">
               <ShieldCheck className="h-7 w-7 text-primary" />
            </div>
            <div className="space-y-2">
               <h3 className="text-2xl font-semibold tracking-tight">Strategic Reservoir Oversight</h3>
               <p className="text-muted-foreground max-w-xl mx-auto font-medium text-[15px] leading-relaxed">
                  Logistics and supply-chain synchronization active. Stock levels are verified against Federal and Regional distribution metrics for audit-ready compliance.
               </p>
            </div>
            <div className="flex items-center gap-6 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/50">
               <span className="flex items-center gap-2"><Box className="w-4 h-4" /> Audit Path Lock</span>
               <span className="w-1 h-1 rounded-full bg-border" />
               <span className="flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Growth Metric Verified</span>
            </div>
         </CardContent>
      </Card>
    </div>
  );
};

export default OwnerFuelStock;

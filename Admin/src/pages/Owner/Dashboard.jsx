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
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";

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
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1 text-primary">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-[10px] font-mono font-black tracking-[0.2em] uppercase text-primary/60">Node Operations Active</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground italic">Station Control</h1>
          <p className="text-muted-foreground text-lg mt-1 italic">Tactical oversight of fuel assets and personnel.</p>
        </div>
        <div className="flex items-center gap-3 bg-muted/40 p-2 rounded-2xl border border-border/50">
           <Button variant="ghost" size="sm" className="h-10 px-6 rounded-xl bg-background shadow-xl shadow-black/5 font-black uppercase tracking-widest text-[10px]">Real-time</Button>
           <Button variant="ghost" size="sm" className="h-10 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] text-muted-foreground/60">Historical</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-border/50 shadow-xl shadow-primary/5 group hover:border-primary/30 transition-all duration-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors">
                {stat.label}
              </CardTitle>
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                stat.color === 'red' ? "bg-red-500/10 text-red-500" : "bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
              )}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black tracking-tighter tabular-nums mb-1">{stat.value}</div>
              <div className="flex items-center justify-between">
                 {stat.trend.startsWith('+') ? (
                   <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/10 text-[10px] font-black uppercase tracking-tighter shadow-sm">
                      <TrendingUp className="h-3 w-3" /> {stat.trend}
                   </div>
                 ) : (
                   <span className={cn(
                     "text-[10px] font-black uppercase tracking-widest flex items-center gap-2",
                     stat.color === 'red' ? "text-red-500 animate-pulse" : "text-muted-foreground/40"
                   )}>
                      {stat.color === 'red' && <AlertTriangle className="w-3 h-3" />}
                      {stat.trend}
                   </span>
                 )}
                 <div className="flex items-center gap-1 text-[8px] font-bold text-muted-foreground/40 italic">
                    Circuit Active
                    <div className={cn(
                      "w-1 h-1 rounded-full",
                      stat.color === 'red' ? "bg-red-500" : "bg-emerald-500 animate-pulse"
                    )} />
                 </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <Card className="lg:col-span-8 border-border/50 shadow-2xl overflow-hidden bg-muted/5 relative group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
             <Box className="w-48 h-48" />
          </div>
          <CardHeader className="pb-2">
             <CardTitle className="flex items-center gap-3 text-xl">
                <Package className="h-5 w-5 text-primary" />
                Inventory Matrix
             </CardTitle>
             <CardDescription className="italic font-medium">
                Live synchronization of regional fuel reservoirs.
             </CardDescription>
          </CardHeader>
          <CardContent className="space-y-12 py-8 relative z-10">
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                   <h2 className="text-7xl font-black tracking-tighter italic">142.8k <span className="text-xl font-medium text-muted-foreground ml-1 uppercase not-italic tracking-widest">Liters</span></h2>
                   <div className="flex items-center gap-3 mt-2">
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-black px-3 py-1 text-[10px] uppercase tracking-widest">76% Utilization</Badge>
                      <p className="text-xs font-bold text-muted-foreground/60 italic flex items-center gap-2">
                         <Activity className="w-3 h-3" /> System pressure nominal
                      </p>
                   </div>
                </div>
                <div className="flex flex-col gap-2">
                   <div className="h-10 flex items-center gap-4 bg-background/50 backdrop-blur-md px-4 rounded-xl border border-border/50">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest">All Tanks Online</span>
                   </div>
                </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                   <div className="flex justify-between items-end">
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Unleaded Premium</p>
                         <h4 className="text-2xl font-black flex items-center gap-2 tabular-nums">82,450 <span className="text-[10px] font-bold text-muted-foreground uppercase">L</span></h4>
                      </div>
                      <span className="text-xs font-black text-primary font-mono bg-primary/10 px-2 py-1 rounded-md">65%</span>
                   </div>
                   <div className="h-3 w-full bg-muted rounded-full overflow-hidden border border-border/50">
                      <div className="h-full bg-primary w-[65%] rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)] transition-all duration-1000" />
                   </div>
                   <p className="text-[9px] font-bold text-muted-foreground/40 italic flex items-center gap-2"><ChevronRight className="w-2.5 h-2.5" /> Est. depletion: 14 days based on trajectory</p>
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between items-end">
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Diesel Max</p>
                         <h4 className="text-2xl font-black flex items-center gap-2 tabular-nums">60,350 <span className="text-[10px] font-bold text-muted-foreground uppercase">L</span></h4>
                      </div>
                      <span className="text-xs font-black text-emerald-500 font-mono bg-emerald-500/10 px-2 py-1 rounded-md">88%</span>
                   </div>
                   <div className="h-3 w-full bg-muted rounded-full overflow-hidden border border-border/50">
                      <div className="h-full bg-emerald-500 w-[88%] rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-1000" />
                   </div>
                   <p className="text-[9px] font-bold text-muted-foreground/40 italic flex items-center gap-2"><ChevronRight className="w-2.5 h-2.5" /> Next replenishment: Priority Normal</p>
                </div>
             </div>
          </CardContent>
          <CardFooter className="border-t border-border/10 bg-muted/20 py-4 px-8">
             <p className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-2">
                <Clock className="h-3 w-3 text-primary" /> Delivery sequence initiation: Tomorrow 09:00 GST
             </p>
          </CardFooter>
        </Card>

        <Card className="lg:col-span-4 border-border/50 shadow-2xl overflow-hidden bg-muted/5 self-start">
          <CardHeader className="border-b border-border/10">
            <CardTitle className="flex items-center gap-3 text-xl">
               <History className="h-5 w-5 text-primary" />
               Asset Inflow
            </CardTitle>
            <CardDescription className="italic font-medium">
               Recent verified bulk replenishments.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
             <div className="divide-y divide-border/20">
                {recentDeliveries.map((delivery) => (
                  <div key={delivery.id} className="flex items-center justify-between p-6 group hover:bg-primary/5 transition-all">
                     <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-muted rounded-2xl flex items-center justify-center font-bold text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all border border-border/30">
                           <Fuel className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                           <p className="font-black text-sm truncate uppercase tracking-tight">{delivery.type}</p>
                           <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tighter flex items-center gap-1.5">
                              {delivery.volume} <span className="w-1 h-1 rounded-full bg-border" /> {delivery.time}
                           </p>
                        </div>
                     </div>
                     <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                        <ArrowDownRight className="h-4 w-4" />
                     </div>
                  </div>
                ))}
             </div>
          </CardContent>
          <CardFooter className="p-0">
             <Button variant="ghost" className="w-full h-14 font-black uppercase tracking-widest text-[10px] text-muted-foreground/60 rounded-none border-t border-border/10 hover:bg-muted/50 transition-all gap-2">
                Detailed Audit Log <ChevronRight className="w-3 h-3" />
             </Button>
          </CardFooter>
        </Card>
      </div>

      <Card className="bg-foreground text-background border-none shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden relative group">
         <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-50 transition-opacity group-hover:opacity-70" />
         <CardContent className="py-12 flex flex-col items-center justify-center text-center space-y-6 relative z-10 px-8">
            <div className="h-16 w-16 bg-background/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mb-4 border border-background/20 group-hover:scale-110 transition-transform duration-500">
               <Zap className="h-8 w-8 text-primary fill-primary shadow-[0_0_20px_rgba(var(--primary),0.5)]" />
            </div>
            <div className="space-y-3">
               <h3 className="text-3xl font-black tracking-tight italic">Operational Intelligence</h3>
               <p className="text-muted-foreground max-w-lg mx-auto font-medium text-lg leading-relaxed italic">
                  Peak demand detected on <span className="text-primary font-black not-italic px-1">TUESDAY</span> cycles. Node optimization suggested for maximum throughput during these high-velocity windows.
               </p>
            </div>
            <Button className="h-14 px-12 font-black uppercase tracking-widest text-xs bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xl shadow-primary/40 rounded-2xl transition-all hover:-translate-y-1">
               Synthesize Full Analytics
            </Button>
         </CardContent>
      </Card>
    </div>
  );
};

export default OwnerDashboard;

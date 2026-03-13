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
  ArrowDownRight
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";

const OwnerDashboard = () => {
  const stats = [
    { label: "Active Attendants", value: "8", icon: Users, trend: "Online", color: "gold" },
    { label: "Daily Transactions", value: "342", icon: History, trend: "+12%", color: "amber" },
    { label: "Revenue Today", value: "$12,450", icon: Wallet, trend: "+8.2%", color: "gold" },
    { label: "Alerts", value: "2", icon: Zap, trend: "Requires Action", color: "red" },
  ];

  const recentDeliveries = [
    { id: 1, type: "Diesel", volume: "5,000L", time: "Today, 10:30 AM", status: "completed" },
    { id: 2, type: "Petrol", volume: "3,500L", time: "Yesterday, 04:15 PM", status: "completed" },
    { id: 3, type: "Diesel", volume: "4,000L", time: "2 days ago", status: "completed" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tight">Station Control</h2>
          <p className="text-muted-foreground">
            Strategic Operations & Asset Oversight
          </p>
        </div>
        <div className="flex items-center gap-2 bg-muted/30 p-1.5 rounded-xl border border-border/50">
          <Button variant="ghost" size="sm" className="h-8 rounded-lg bg-background shadow-sm">Real-time</Button>
          <Button variant="ghost" size="sm" className="h-8 rounded-lg">Historical</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center justify-between mt-1">
                 {stat.trend.startsWith('+') ? (
                   <Badge variant="outline" className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 border-emerald-200 py-0 px-2 h-auto">
                     <ArrowUpRight className="h-2 w-2 mr-1" /> {stat.trend}
                   </Badge>
                 ) : (
                   <span className={cn("text-[10px] font-bold uppercase tracking-widest", stat.color === 'red' ? "text-red-500 animate-pulse" : "text-muted-foreground")}>
                      {stat.trend}
                   </span>
                 )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
             <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Inventory Overview
             </CardTitle>
             <CardDescription>
                Aggregate volume across all active tanks.
             </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
             <div>
                <h2 className="text-5xl font-bold tracking-tighter">142.8k <span className="text-xl font-medium text-muted-foreground ml-1">Liters</span></h2>
                <p className="text-sm text-muted-foreground mt-1">Estimated total capacity utilization: 76%</p>
             </div>
             
             <div className="space-y-6">
                <div className="space-y-2">
                   <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest">
                      <span className="flex items-center gap-2"><Droplets className="h-3 w-3 text-primary" /> Unleaded Premium</span>
                      <span>65% Full</span>
                   </div>
                   <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[65%]" />
                   </div>
                </div>
                <div className="space-y-2">
                   <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest">
                      <span className="flex items-center gap-2"><Droplets className="h-3 w-3 text-primary" /> Diesel Max</span>
                      <span>88% Full</span>
                   </div>
                   <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[88%]" />
                   </div>
                </div>
             </div>
          </CardContent>
          <CardFooter className="border-t bg-muted/30 py-3">
             <p className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-2">
                <Clock className="h-3 w-3" /> Next replenishment scheduled: Tomorrow at 09:00 AM
             </p>
          </CardFooter>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
               <History className="h-5 w-5 text-primary" />
               Stock Inflow
            </CardTitle>
            <CardDescription>
               Latest bulk deliveries and refills.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                {recentDeliveries.map((delivery) => (
                  <div key={delivery.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 group hover:bg-muted/50 transition-colors border border-transparent">
                     <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center font-bold text-primary shrink-0">
                           <Fuel className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                           <p className="font-bold text-sm truncate">{delivery.type} - {delivery.volume}</p>
                           <p className="text-[10px] font-semibold text-muted-foreground uppercase">{delivery.time}</p>
                        </div>
                     </div>
                     <ArrowDownRight className="h-4 w-4 text-emerald-500" />
                  </div>
                ))}
             </div>
          </CardContent>
          <CardFooter>
             <Button variant="ghost" className="w-full text-xs h-8 underline decoration-muted-foreground/30 hover:decoration-primary" size="sm">
                View Full Audit Log
             </Button>
          </CardFooter>
        </Card>
      </div>

      <Card className="bg-primary hover:bg-primary/95 transition-colors text-primary-foreground border-none shadow-xl shadow-primary/20">
         <CardContent className="py-10 flex flex-col items-center justify-center text-center space-y-6">
            <div className="h-14 w-14 bg-card/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-2">
               <Zap className="h-7 w-7 fill-white text-white" />
            </div>
            <div className="space-y-2">
               <h3 className="text-2xl font-bold tracking-tight">Efficiency Optimization</h3>
               <p className="text-primary-foreground/80 max-w-sm mx-auto font-medium">
                  Peak demand detected on Tuesdays between 2pm-5pm. Our smart analytics suggest staff optimization for these windows.
               </p>
            </div>
            <Button className="h-12 px-10 font-bold bg-card text-primary hover:bg-card/90 shadow-lg">
               View Smart Analytics
            </Button>
         </CardContent>
      </Card>
    </div>
  );
};

export default OwnerDashboard;

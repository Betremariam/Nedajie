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
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";

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
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1 text-blue-600 animate-pulse">
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-blue-700">Federal Authority Layer</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground italic">National Command Center</h1>
          <p className="text-muted-foreground text-lg italic max-w-xl">Unified oversight for strategic fuel reserves and regional distribution networks.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                AD
              </div>
            ))}
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20">
            Export National Report
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="group relative overflow-hidden border-border/50 hover:border-blue-500/50 transition-all duration-300 shadow-sm hover:shadow-xl">
            <div className={`absolute top-0 right-0 w-20 h-20 -mr-8 -mt-8 rounded-full opacity-5 blur-2xl bg-${stat.color}-500 transition-all group-hover:scale-150`} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">
                {stat.label}
              </CardTitle>
              <div className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center transition-all group-hover:bg-blue-600 group-hover:text-white",
                stat.color === 'blue' ? "bg-blue-500/10 text-blue-600" :
                stat.color === 'emerald' ? "bg-emerald-500/10 text-emerald-600" :
                stat.color === 'amber' ? "bg-amber-500/10 text-amber-600" : "bg-purple-500/10 text-purple-600"
              )}>
                <stat.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black tracking-tight mb-1">{stat.value}</div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] h-5 rounded-md px-2 font-black uppercase tracking-tighter border-blue-200 text-blue-700 bg-blue-50">
                  {stat.trend}
                </Badge>
                <span className="text-[10px] text-muted-foreground font-medium italic">{stat.desc}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-border/50 shadow-md">
          <CardHeader className="border-b border-border/20 pb-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Regional Distribution Matrix</CardTitle>
                <CardDescription>Strategic fuel quota allocation across domestic administrative zones.</CardDescription>
              </div>
              <Map className="w-5 h-5 text-blue-500/50" />
            </div>
          </CardHeader>
          <CardContent className="h-[340px] flex items-center justify-center relative overflow-hidden bg-muted/20 rounded-xl m-4 border border-dashed border-border/60">
            <div className="text-center space-y-4 relative z-10 transition-transform hover:scale-105 duration-500">
              <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto border border-blue-500/20">
                <Globe className="h-10 w-10 text-blue-600/30 animate-spin-slow" />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-bold text-foreground">Interactive Mapping Layer</p>
                <p className="text-xs text-muted-foreground italic px-12">Synchronizing geospatial telemetry from regional depots. Database reconciliation in progress.</p>
              </div>
              <Button variant="outline" size="sm" className="text-[10px] uppercase font-bold tracking-widest h-8 px-6">
                Initialize Layer
              </Button>
            </div>
            <div className="absolute inset-0 opacity-30 select-none pointer-events-none">
                <svg className="w-full h-full text-blue-500/10" viewBox="0 0 100 100" fill="currentColor">
                    <circle cx="20" cy="30" r="1"/>
                    <circle cx="50" cy="80" r="1.5"/>
                    <circle cx="80" cy="40" r="0.8"/>
                    <path d="M20 30 L50 80 L80 40" stroke="currentColor" strokeWidth="0.2" fill="none"/>
                </svg>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-border/50 shadow-md">
          <CardHeader className="border-b border-border/20 pb-4 mb-4">
            <CardTitle className="text-xl">Disbursement Stream</CardTitle>
            <CardDescription>Live telemetry from national supply chain nodes.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentDeliveries.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-muted/50 transition-all group cursor-pointer border border-transparent hover:border-border/50">
                  <div className={cn(
                    "h-12 w-12 rounded-2xl flex items-center justify-center transition-all group-hover:rotate-6",
                    item.status === 'OWNER_ACCEPTED' ? "bg-emerald-500/10 text-emerald-600" : 
                    item.status === 'SUPERADMIN_ACCEPTED' ? "bg-blue-500/10 text-blue-600" : "bg-amber-500/10 text-amber-600"
                  )}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black leading-none truncate group-hover:text-blue-600 transition-colors">{item.destination}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge variant="outline" className={cn(
                        "text-[9px] py-0 px-2 font-black uppercase tracking-tighter h-4",
                        item.status === 'OWNER_ACCEPTED' ? "border-emerald-200 text-emerald-700 bg-emerald-50/50" : 
                        item.status === 'SUPERADMIN_ACCEPTED' ? "border-blue-200 text-blue-700 bg-blue-50/50" : "border-amber-200 text-amber-700 bg-amber-50/50"
                      )}>
                        {item.status.replace('_', ' ')}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
                        <Clock className="w-2.5 h-2.5" />
                        {item.time}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-foreground tabular-nums">{item.volume}</p>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground ml-auto mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest h-11 hover:bg-blue-50 hover:text-blue-600" size="sm">
              View National Logistics Ledger
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default FederalDashboard;

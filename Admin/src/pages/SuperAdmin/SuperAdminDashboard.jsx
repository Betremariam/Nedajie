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
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/Alert";

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
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1 text-primary animate-pulse">
            <Terminal className="w-5 h-5" />
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase">Control Layer Active</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground">Global Control Center</h1>
          <p className="text-muted-foreground text-lg italic max-w-xl">Centralized intelligence nexus and multi-regional system orchestration.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 border-primary/20 bg-primary/5">
            <Bell className="w-4 h-4" />
            System Notifications
            <Badge className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary text-primary-foreground">3</Badge>
          </Button>
          <Button size="sm" className="gap-2 shadow-lg">
            <Activity className="w-4 h-4" />
            Live Diagnostics
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="group relative overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl">
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-5 blur-2xl bg-${stat.color}-500 transition-all group-hover:scale-150`} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </CardTitle>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${stat.color}-500/10 text-${stat.color}-600 transition-colors group-hover:bg-primary group-hover:text-primary-foreground`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black tracking-tighter mb-1">{stat.value}</div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className={`text-[10px] h-5 rounded-md px-1.5 font-bold ${stat.trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground'}`}>
                  {stat.trend}
                </Badge>
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">{stat.desc}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-border/50 shadow-md flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/20 pb-4 mb-4">
            <div>
              <CardTitle className="text-xl">Network Volume Monitor</CardTitle>
              <CardDescription>Real-time throughput analysis across all regional clusters.</CardDescription>
            </div>
            <div className="flex items-center gap-1.5 p-1 bg-muted rounded-lg">
              <Button variant="ghost" size="sm" className="h-7 text-[10px] uppercase font-bold px-3">24h</Button>
              <Button variant="secondary" size="sm" className="h-7 text-[10px] uppercase font-bold px-3 shadow-none bg-background">7d</Button>
              <Button variant="ghost" size="sm" className="h-7 text-[10px] uppercase font-bold px-3">30d</Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between pt-2">
             <div className="h-[240px] flex items-end gap-3 px-4 pb-4">
                {[45, 82, 38, 94, 61, 73, 52, 88, 69, 91, 77, 84].map((h, i) => (
                  <div key={i} className="group/bar relative flex-1">
                    <div style={{ height: `${h}%` }} className="w-full bg-primary/10 rounded-t-lg hover:bg-primary/40 transition-all duration-700 ease-out border-x border-t border-primary/5 cursor-pointer" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none bg-foreground text-background text-[10px] font-bold py-1 px-2 rounded-md shadow-xl whitespace-nowrap z-20">
                      {h}% Load
                    </div>
                  </div>
                ))}
            </div>
            <div className="p-4 bg-muted/40 rounded-xl flex items-center justify-between border border-border/40 mb-2">
              <div className="flex gap-8">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Cumulative Sales</p>
                  <p className="text-2xl font-black tabular-nums">$42,831,402</p>
                </div>
                <div className="w-px h-10 bg-border/50 mt-1" />
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Peak Capacity</p>
                  <p className="text-2xl font-black tabular-nums">94.2%</p>
                </div>
              </div>
              <Badge className="h-9 px-4 bg-emerald-500/10 text-emerald-600 border-emerald-200/50 hover:bg-emerald-500/15">
                <TrendingUp className="h-4 w-4 mr-2" /> 
                <span className="font-black text-xs">+24.5% Yield</span>
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-border/50 shadow-md">
          <CardHeader className="border-b border-border/20 pb-4 mb-4">
            <CardTitle className="text-xl">System Audit Log</CardTitle>
            <CardDescription>Encoded live-stream of infrastructure events.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-all group cursor-pointer border border-transparent hover:border-border/50">
                  <div className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                    item.status === 'success' ? "bg-emerald-500/10 text-emerald-600" : 
                    item.status === 'warning' ? "bg-amber-500/10 text-amber-600" : 
                    item.status === 'pending' ? "bg-blue-500/10 text-blue-600" : "bg-red-500/10 text-red-600"
                  )}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold leading-none truncate group-hover:text-primary transition-colors">{item.user}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter opacity-70 italic">{item.type}</p>
                      <span className="text-[10px] text-muted-foreground">•</span>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {item.time}
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Button variant="ghost" className="w-full text-xs font-bold uppercase tracking-widest h-10 hover:bg-primary/5 hover:text-primary" size="sm">
              View Full Audit Ledger
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
         <Card className="col-span-2 border-border/50 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/20 mb-4">
                <div>
                  <CardTitle className="text-xl">Hardware Interface</CardTitle>
                  <CardDescription>Direct execution commands for root-level orchestration.</CardDescription>
                </div>
                <Zap className="h-5 w-5 text-primary animate-pulse" />
            </CardHeader>
            <CardContent>
               <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-24 flex flex-col gap-3 justify-center items-center rounded-2xl bg-muted/20 hover:bg-primary/5 hover:border-primary/50 transition-all group overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-[3px] bg-primary/20 group-hover:bg-primary transition-colors" />
                    <Settings className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-[10px] uppercase font-black tracking-[0.2em]">Matrix Config</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col gap-3 justify-center items-center rounded-2xl bg-muted/20 hover:bg-primary/5 hover:border-primary/50 transition-all group overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-[3px] bg-primary/20 group-hover:bg-primary transition-colors" />
                    <Users2 className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-[10px] uppercase font-black tracking-[0.2em]">Auth Rotation</span>
                  </Button>
               </div>
            </CardContent>
         </Card>
         <Card className="border-border/50 shadow-md relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-full bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader>
              <CardTitle className="text-xl">Network Shield</CardTitle>
              <CardDescription>Advanced encryption & threat assessment.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col justify-center gap-6 h-[160px] pt-0">
               <div className="flex items-end justify-between">
                  <div className="space-y-1">
                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest block">Trust Score</span>
                    <span className="text-4xl font-black text-emerald-600 block tracking-tighter">94.2%</span>
                  </div>
                  <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                    <ShieldCheck className="h-10 w-10 text-emerald-600" />
                  </div>
               </div>
               <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter text-muted-foreground px-1">
                    <span>Protocol Integrity</span>
                    <span>100% Validated</span>
                  </div>
                  <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden border border-border/30">
                    <div className="h-full bg-emerald-500 w-[94%] shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;

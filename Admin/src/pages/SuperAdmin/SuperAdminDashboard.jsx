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
  Users2
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";

const SuperAdminDashboard = () => {
  const stats = [
    { label: "Active Admins", value: "24", icon: Users, trend: "+12%", color: "amber" },
    { label: "Total Fuel stations", value: "156", icon: Fuel, trend: "+4", color: "gold" },
    { label: "Daily Transactions", value: "1,284", icon: History, trend: "+18%", color: "amber" },
    { label: "System Uptime", value: "99.9%", icon: ShieldCheck, trend: "Stable", color: "gold" },
  ];

  const recentActivity = [
    { id: 1, type: "Registration", user: "New Attendant registered", time: "2 mins ago", status: "success" },
    { id: 2, type: "Transaction", user: "Bulk fuel transfer approved", time: "15 mins ago", status: "pending" },
    { id: 3, type: "Security", user: "Admin password reset", time: "1 hour ago", status: "warning" },
    { id: 4, type: "Fuel", user: "Station #42 out of stock", time: "3 hours ago", status: "error" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Command Center</h2>
        <p className="text-muted-foreground">
          System Intelligence & Administration Portal
        </p>
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
              <p className="text-xs text-muted-foreground">
                {stat.trend} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 overflow-hidden">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              Annual volume and system activity overview.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
             <div className="h-[200px] flex items-end gap-2 px-4 pb-4">
                {[40, 70, 45, 90, 65, 80, 55, 95, 75, 85].map((h, i) => (
                  <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-primary/20 rounded-t-sm hover:bg-primary/40 transition-all duration-500 ease-out" />
                ))}
            </div>
            <div className="p-4 bg-muted/50 rounded-lg mx-4 mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase">Annual Volume</p>
                <p className="text-2xl font-bold">$42.8M</p>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200">
                <TrendingUp className="h-3 w-3 mr-1" /> +24.5%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Real-time logs from across the system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className={cn(
                    "h-2 w-2 rounded-full",
                    item.status === 'success' ? "bg-emerald-500" : 
                    item.status === 'warning' ? "bg-amber-500" : "bg-red-500"
                  )} />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{item.user}</p>
                    <p className="text-xs text-muted-foreground">{item.type} • {item.time}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full text-xs" size="sm">
              View All Logs
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
         <Card className="col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Instant Commands</CardTitle>
                  <CardDescription>Quick actions for system administrators.</CardDescription>
                </div>
                <Zap className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
               <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col gap-2 justify-center items-center rounded-xl bg-muted/30">
                    <Settings className="h-5 w-5" />
                    <span className="text-xs uppercase font-bold">Global Settings</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2 justify-center items-center rounded-xl bg-muted/30">
                    <Users2 className="h-5 w-5" />
                    <span className="text-xs uppercase font-bold">Role Audit</span>
                  </Button>
               </div>
            </CardContent>
         </Card>
         <Card>
            <CardHeader>
              <CardTitle>Security Rating</CardTitle>
              <CardDescription>System integrity assessment.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col justify-center h-[120px]">
               <div className="flex items-end justify-between mb-4">
                  <span className="text-3xl font-bold">Grade A+</span>
                  <ShieldCheck className="h-8 w-8 text-emerald-500" />
               </div>
               <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[94%]" />
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;

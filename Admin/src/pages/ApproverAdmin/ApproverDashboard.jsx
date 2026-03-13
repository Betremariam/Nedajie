import React from "react";
import { 
  UserCheck, 
  Car, 
  Wheat, 
  Fuel, 
  Users2, 
  ClipboardCheck, 
  Clock, 
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  Zap,
  ArrowUpRight
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";

const ApproveDashboard = () => {
  const pendingApprovals = [
    { label: "Drivers", count: "14", icon: Car, trend: "+3 new", priority: "high" },
    { label: "Farmers", count: "8", icon: Wheat, trend: "Stable", priority: "medium" },
    { label: "Attendants", count: "21", icon: Fuel, trend: "+12 new", priority: "high" },
    { label: "Others", count: "4", icon: Users2, trend: "-2", priority: "low" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tight">Verification Center</h2>
          <p className="text-muted-foreground">
            Identity Validation & Access Authorization Queue
          </p>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right hidden md:block">
              <p className="text-[10px] font-semibold uppercase text-muted-foreground tracking-widest">Avg. Approval Time</p>
              <p className="text-lg font-bold text-foreground">4.2 Hours</p>
           </div>
           <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 gap-2 py-1.5 px-4 h-auto">
              <Zap className="h-4 w-4 animate-pulse fill-primary" />
              <span className="font-bold uppercase tracking-tighter">High Efficiency</span>
           </Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {pendingApprovals.map((item, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.label}
              </CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.count}</div>
              <div className="flex items-center justify-between mt-1">
                 <Badge variant="outline" className={cn(
                   "text-[10px] font-bold uppercase py-0 px-2 h-auto",
                   item.priority === 'high' ? "text-red-500 border-red-200" :
                   item.priority === 'medium' ? "text-amber-500 border-amber-200" : "text-primary border-primary/20"
                 )}>
                   {item.priority}
                 </Badge>
                 <span className="text-[10px] font-semibold text-muted-foreground">{item.trend}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
             <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-red-500" />
                Action Required
             </CardTitle>
             <CardDescription>
                Urgent applications awaiting your validation.
             </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col justify-center items-center py-8 text-center space-y-6">
             <div className="space-y-2">
                <h2 className="text-5xl font-bold tracking-tighter">47 Pending</h2>
                <p className="text-muted-foreground font-medium max-w-[300px]">
                   A batch of driver and attendant applications is ready for final review.
                </p>
             </div>
             <Button className="w-full max-w-[280px] h-12 text-sm font-bold shadow-lg shadow-primary/20" size="lg">
                Begin Verification Batch <ArrowRight className="ml-2 h-4 w-4" />
             </Button>
             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic">
                Priority sorting enabled • SLA: 24h
             </p>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
               <Clock className="h-5 w-5 text-primary" />
               Recent Decisions
            </CardTitle>
            <CardDescription>
               Latest approvals and audit trails.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                {[
                  { name: "John Kabila", type: "Driver", status: "Approved", time: "12 mins ago" },
                  { name: "Sarah Ahmed", type: "Attendant", status: "Approved", time: "45 mins ago" },
                  { name: "Global Trans", type: "Multiple", status: "Batch Approved", time: "1 hour ago" }
                ].map((log, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 group hover:bg-muted/50 transition-colors">
                     <div className="flex items-center gap-3">
                        <div className="h-9 w-9 bg-primary/10 rounded-lg flex items-center justify-center font-bold text-primary text-xs shrink-0">
                           {log.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="min-w-0">
                           <p className="font-bold text-sm truncate">{log.name}</p>
                           <p className="text-[10px] font-semibold text-muted-foreground uppercase">{log.type} • {log.time}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-1 shrink-0">
                         <UserCheck className="h-3 w-3 text-emerald-500" />
                         <span className="text-[9px] font-bold uppercase text-emerald-600">Verified</span>
                     </div>
                  </div>
                ))}
             </div>
          </CardContent>
          <CardFooter>
             <Button variant="ghost" className="w-full text-xs h-8" size="sm">
                View Audit History
             </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
         <CardHeader>
           <CardTitle>Policy Compliance</CardTitle>
           <CardDescription>Performance tracking and standard deviations.</CardDescription>
         </CardHeader>
         <CardContent className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 space-y-4">
               <p className="text-sm font-medium leading-relaxed">
                 Your approval rate matches the standard deviation for the last quarter. 
                 <span className="text-primary font-bold"> 90% accuracy </span> maintained across all verification steps. 
                 Ensure all document watermarks are verified before final commit.
               </p>
               <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                     <span className="text-[10px] font-bold text-muted-foreground uppercase">Last 30 Days</span>
                     <span className="text-xl font-bold">1,204 Approvals</span>
                  </div>
                  <div className="w-[1px] h-8 bg-border" />
                  <div className="flex flex-col">
                     <span className="text-[10px] font-bold text-muted-foreground uppercase">Error Margin</span>
                     <span className="text-xl font-bold text-emerald-500">0.4%</span>
                  </div>
               </div>
            </div>
            <div className="h-32 w-32 relative shrink-0">
               <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="54" className="stroke-muted" strokeWidth="12" fill="transparent" />
                  <circle cx="64" cy="64" r="54" className="stroke-primary" strokeWidth="12" strokeDasharray="339.292" strokeDashoffset="33.929" fill="transparent" strokeLinecap="round" />
               </svg>
               <div className="absolute inset-0 flex items-center justify-center font-bold text-2xl tracking-tighter">
                  90%
               </div>
            </div>
         </CardContent>
      </Card>
    </div>
  );
};

export default ApproveDashboard;

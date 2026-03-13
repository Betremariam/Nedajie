import React from "react";
import { 
  UserPlus, 
  Fuel, 
  Car, 
  Wheat, 
  Users2, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";

const RegisterAdminDashboard = () => {
  const registrationTypes = [
    { label: "Attendants", desc: "Fuel station staff", icon: Fuel, count: "124", color: "gold" },
    { label: "Drivers", desc: "Commercial vehicle operators", icon: Car, count: "1,842", color: "amber" },
    { label: "Farmers", desc: "Agricultural machinery owners", icon: Wheat, count: "643", color: "gold" },
    { label: "Others", desc: "General system users", icon: Users2, count: "89", color: "amber" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tight">Registry Hub</h2>
          <p className="text-muted-foreground">
            Internal Enrollment & Identity Management
          </p>
        </div>
        <div className="flex items-center gap-4 bg-muted/30 p-2 rounded-2xl border border-border/50">
           <div className="flex -space-x-2">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center text-[8px] font-bold text-primary">JD</div>
              ))}
           </div>
           <div className="text-[10px] font-bold uppercase tracking-tighter">
             <span className="text-muted-foreground block leading-none mb-1">Active Now</span>
             <span className="text-foreground leading-none">12 Enrollers</span>
           </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {registrationTypes.map((type, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow group cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {type.label}
              </CardTitle>
              <type.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{type.count}</div>
              <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1">
                {type.desc}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-primary/5 border-primary/20">
          <CardHeader>
             <CardTitle className="text-2xl">Onboard your team in seconds.</CardTitle>
             <CardDescription className="text-base">
                Our new streamlined registration flow allows you to add multiple users with automated credential generation.
             </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="flex flex-wrap gap-4">
                <Button className="h-12 px-8 font-bold shadow-lg shadow-primary/20">
                   <UserPlus className="mr-2 h-4 w-4" /> Start Now
                </Button>
                <Button variant="outline" className="h-12 px-8 font-bold bg-background">
                   <Users className="mr-2 h-4 w-4" /> Bulk Upload
                </Button>
             </div>
          </CardContent>
          <CardFooter className="pt-0">
             <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-bold uppercase py-0.5">
                Quick Enrollment Active
             </Badge>
          </CardFooter>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
             <CardTitle>Registry Status</CardTitle>
             <CardDescription>Real-time system health and connectivity.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="space-y-3">
                <div className="space-y-1.5">
                   <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                     <span>Database Load</span>
                     <span className="text-emerald-500">Normal</span>
                   </div>
                   <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                     <div className="h-full bg-primary w-[32%]" />
                   </div>
                </div>
                <div className="space-y-1.5">
                   <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                     <span>Identity Verification</span>
                     <span className="text-emerald-500">Online</span>
                   </div>
                   <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                     <div className="h-full bg-primary w-[98%]" />
                   </div>
                </div>
             </div>
             <div className="p-4 rounded-xl bg-muted/30 border border-border/50 flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" />
                <div className="space-y-1">
                   <p className="text-xs font-bold">System Reconciled</p>
                   <p className="text-[10px] text-muted-foreground italic">Last reconciliation completed today at 08:42 AM.</p>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>

      <Card>
         <CardContent className="py-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center ring-4 ring-primary/5 mb-2">
               <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-1">
               <h3 className="text-xl font-bold">100% Encrypted & Secure</h3>
               <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Every enrollment is protected by end-to-end encryption. Identity documents are stored securely with regional compliance.
               </p>
            </div>
            <Button variant="link" className="text-xs font-bold uppercase tracking-widest h-auto p-0">
               Learn about our security protocols <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
         </CardContent>
      </Card>
    </div>
  );
};

export default RegisterAdminDashboard;

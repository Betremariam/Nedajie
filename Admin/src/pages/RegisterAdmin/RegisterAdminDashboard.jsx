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
  Users,
  Fingerprint,
  FileCheck,
  Activity,
  Zap,
  ChevronRight,
  Database,
  Building2,
  Lock
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";

const RegisterAdminDashboard = () => {
  const [activeTab, setActiveTab] = React.useState("overview");

  const registrationTypes = [
    { label: "Attendants", desc: "Energy distribution staff", icon: Fuel, count: "124", color: "blue", trend: "+12%" },
    { label: "Drivers", desc: "Logistics & transport operators", icon: Car, count: "1,842", color: "emerald", trend: "+8%" },
    { label: "Farmers", desc: "Agricultural asset owners", icon: Wheat, count: "643", color: "amber", trend: "+5%" },
    { label: "Others", desc: "General system entities", icon: Users2, count: "89", color: "purple", trend: "+2%" },
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary">
            <Fingerprint className="w-5 h-5" />
            <span className="text-[10px] font-mono font-black tracking-[0.2em] uppercase text-primary/60">Biometric Identity Hub</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground italic flex items-center gap-3">
            Registry Hub
          </h1>
          <p className="text-muted-foreground text-lg italic">Strategic identity management and ecosystem enrollment.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-muted/30 p-2 pl-4 rounded-2xl border border-border/50 backdrop-blur-xl group hover:border-primary/30 transition-all">
           <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-9 w-9 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary overflow-hidden shadow-lg group-hover:scale-110 transition-transform">
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} alt="avatar" />
                </div>
              ))}
           </div>
           <div className="pr-4 border-r border-border/50 h-10 flex flex-col justify-center">
             <span className="text-[9px] font-black uppercase tracking-tighter text-muted-foreground leading-none mb-1">Enrollers Online</span>
             <span className="text-sm font-black text-foreground leading-none">12 OPERATORS</span>
           </div>
           <div className="bg-emerald-500/10 text-emerald-600 p-2 rounded-xl">
              <Activity className="w-4 h-4 animate-pulse" />
           </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {registrationTypes.map((type, i) => (
          <Card key={i} className="group cursor-pointer border-border/50 shadow-xl shadow-primary/5 hover:border-primary/30 hover:bg-primary/[0.02] transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform">
               <type.icon className="w-20 h-20" />
            </div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors">
                {type.label}
              </CardTitle>
              <type.icon className={cn(
                "h-4 w-4 transition-colors",
                type.color === 'blue' ? "text-blue-500" : 
                type.color === 'emerald' ? "text-emerald-500" :
                type.color === 'amber' ? "text-amber-500" : "text-purple-500"
              )} />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-black tracking-tighter tabular-nums mb-1">
                {type.count}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-medium text-muted-foreground italic">
                  {type.desc}
                </p>
                <Badge variant="outline" className="text-[8px] font-black h-4 py-0 border-emerald-500/20 text-emerald-600 bg-emerald-500/5">
                  {type.trend}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-7">
        <Card className="lg:col-span-4 bg-foreground text-background border-none shadow-2xl shadow-black/20 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-50" />
          <div className="absolute top-0 right-0 p-12 opacity-5 scale-125 group-hover:rotate-12 transition-transform duration-1000">
             <UserPlus className="w-64 h-64" />
          </div>
          <CardHeader className="relative z-10 pt-10">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-background/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-background/20 group-hover:scale-110 transition-transform">
                   <Zap className="h-6 w-6 text-primary shadow-glow" />
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/40 font-black uppercase py-0.5 text-[9px] tracking-widest">
                   Rapid Onboarding Protocol
                </Badge>
             </div>
             <CardTitle className="text-4xl font-black tracking-tight italic leading-none">
                Onboard your ecosystem <br />in seconds.
             </CardTitle>
             <CardDescription className="text-background/60 text-lg font-medium italic pt-2 max-w-lg">
                The streamlined registration matrix enables multi-entity enrollment with automated credential synthesis and biometric verification.
             </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10 pb-10 mt-4 px-10">
             <div className="flex flex-wrap gap-4">
                <Button className="h-14 px-10 font-black uppercase tracking-widest text-[11px] rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xl shadow-primary/40 group/btn transition-all hover:-translate-y-1">
                   <UserPlus className="mr-3 h-5 w-5 group-hover/btn:scale-110 transition-transform" /> 
                   Initiate Enrollment
                </Button>
                <Button variant="outline" className="h-14 px-8 font-black uppercase tracking-widest text-[11px] rounded-2xl bg-background/5 border-background/20 hover:bg-background/10 transition-all hover:border-background/40">
                   <Database className="mr-3 h-5 w-5 opacity-40" /> 
                   Bulk Data Ingestion
                </Button>
             </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-border/50 shadow-2xl shadow-primary/5 bg-muted/5 flex flex-col justify-center overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
          <CardHeader>
             <div className="flex items-center gap-3 mb-1">
                <Activity className="w-4 h-4 text-primary" />
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">System Health</CardTitle>
             </div>
             <CardDescription className="italic font-medium">Real-time telemetry of identity services.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pb-10">
             <div className="space-y-5">
                <div className="space-y-2">
                   <div className="flex justify-between items-end px-1">
                     <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                        <Lock className="w-3 h-3" /> Database Encryption
                     </span>
                     <span className="text-[10px] font-black font-mono text-emerald-500 uppercase">Secure</span>
                   </div>
                   <div className="h-2 w-full bg-muted rounded-full overflow-hidden border border-border/10 p-0.5">
                     <div className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)] w-[32%] transition-all duration-1000" />
                   </div>
                </div>
                <div className="space-y-2">
                   <div className="flex justify-between items-end px-1">
                     <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                        <Building2 className="w-3 h-3" /> Identity Synthesis
                     </span>
                     <span className="text-[10px] font-black font-mono text-emerald-600 uppercase">Operational</span>
                   </div>
                   <div className="h-2 w-full bg-muted rounded-full overflow-hidden border border-border/10 p-0.5">
                     <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] w-[98%] transition-all duration-1000" />
                   </div>
                </div>
             </div>
             <div className="p-6 rounded-3xl bg-background border border-border/50 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                     <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                     <p className="text-xs font-black uppercase tracking-widest">Protocol Reconciled</p>
                     <p className="text-[10px] text-muted-foreground italic font-medium">Cycle status: SYNC_CONFIRMED</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[9px] font-bold text-muted-foreground/40 italic ml-1 uppercase tracking-tighter">
                   Last Check: Today at 08:42 AM <ChevronRight className="w-3 h-3" />
                </div>
             </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 shadow-2xl shadow-primary/5 bg-muted/5 relative overflow-hidden group">
         <div className="absolute inset-0 bg-primary/[0.01] pointer-events-none" />
         <CardContent className="py-12 flex flex-col items-center justify-center text-center space-y-6 relative z-10">
            <div className="h-20 w-20 bg-background rounded-3xl flex items-center justify-center ring-8 ring-primary/5 mb-2 shadow-2xl group-hover:scale-110 transition-all duration-500 border border-border/50">
               <ShieldCheck className="h-10 w-10 text-primary shadow-glow" />
            </div>
            <div className="space-y-2">
               <h3 className="text-3xl font-black tracking-tight italic">Military-Grade Sovereignty</h3>
               <p className="text-muted-foreground max-w-lg mx-auto font-medium italic leading-relaxed text-lg">
                  Every asset enrollment is shielded by end-to-end cryptographic layers. Identity telemetry is stored with multi-region compliance and audit-ready transparency.
               </p>
            </div>
            <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 pt-4">
               <span className="flex items-center gap-2"><Lock className="w-3 h-3" /> AES-256 E2EE</span>
               <span className="w-1.5 h-1.5 rounded-full bg-border" />
               <span className="flex items-center gap-2"><Fingerprint className="w-3 h-3" /> Biometric Token</span>
               <span className="w-1.5 h-1.5 rounded-full bg-border" />
               <span className="flex items-center gap-2"><FileCheck className="w-3 h-3" /> GRC Compliant</span>
            </div>
            <Button variant="link" className="text-[10px] font-black uppercase tracking-[0.2em] h-auto p-0 text-primary hover:text-primary/80 transition-colors pt-4">
               Audit Registry Architecture <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
         </CardContent>
      </Card>
    </div>
  );
};

export default RegisterAdminDashboard;

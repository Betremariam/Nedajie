import React, { useEffect, useState } from "react";
import { 
  getAllAdmins, 
  createRegionalSuperAdmin 
} from "../../services/api";
import { 
  Copy, 
  Check, 
  ShieldAlert, 
  ShieldCheck, 
  KeyRound, 
  Globe,
  UserPlus,
  Users,
  Search,
  MapPin,
  Mail,
  Loader2,
  ChevronRight,
  Terminal,
  Fingerprint,
  Zap,
  Activity,
  UserCheck
} from "lucide-react";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "../../components/ui/Table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Button } from "../../components/ui/Button";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/Alert";
import { Badge } from "../../components/ui/Badge";
import { cn } from "../../lib/utils";

const ManageSuperAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    region: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: null, text: "" });
  
  const [newAdminCreds, setNewAdminCreds] = useState(null);
  const [copied, setCopied] = useState(false);

  const fetchSuperAdmins = async () => {
    try {
      setLoading(true);
      const res = await getAllAdmins();
      const filtered = res.data.filter(admin => admin.role === "super");
      setAdmins(filtered);
    } catch (err) {
      setMessage({ type: "error", text: "Critical failure: Regional node list unreachable." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuperAdmins();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: null, text: "" });
    setNewAdminCreds(null);

    const { name, email, region } = formData;
    if (!name || !email || !region) {
      setMessage({ type: "error", text: "Integrity check failed: All parameters are required." });
      return;
    }

    try {
      setLoading(true);
      const res = await createRegionalSuperAdmin({ name, email, region });
      
      setMessage({ type: "success", text: "Regional authority established successfully." });
      setNewAdminCreds({ email, tempPassword: res.data.tempPassword });
      setFormData({ name: "", email: "", region: "" });
      fetchSuperAdmins();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.msg || "Provisioning failure. Protocol rejected." });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (newAdminCreds) {
      navigator.clipboard.writeText(`Email: ${newAdminCreds.email}\nPassword: ${newAdminCreds.tempPassword}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1 text-blue-600">
            <Globe className="w-5 h-5 animate-spin-slow" />
            <span className="text-[10px] font-mono font-black tracking-[0.2em] uppercase">Global Interface Layer</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground italic">Regional Authorities</h1>
          <p className="text-muted-foreground text-lg mt-1 italic">Federal orchestration of provincial super-administrative nodes.</p>
        </div>
        <div className="bg-blue-500/5 p-4 rounded-2xl border border-blue-500/20 flex items-center gap-4">
           <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
              <UserCheck className="w-5 h-5" />
           </div>
           <div>
              <p className="text-[10px] font-black uppercase text-blue-600/60 tracking-widest">Active nodes</p>
              <p className="text-xl font-black">{admins.length}</p>
           </div>
        </div>
      </div>

      {message.text && !newAdminCreds && (
        <Alert variant={message.type === "error" ? "destructive" : "default"} className={message.type === "success" ? "border-blue-500 bg-blue-500/5 text-blue-600" : ""}>
          {message.type === "error" ? <ShieldAlert className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4 text-blue-600" />}
          <AlertTitle className="font-black text-[10px] uppercase tracking-widest">System Response</AlertTitle>
          <AlertDescription className="font-bold">{message.text}</AlertDescription>
        </Alert>
      )}

      {newAdminCreds && (
        <Alert className="border-blue-500 bg-blue-500/10 p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
             <Globe className="w-24 h-24" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <AlertTitle className="text-xl font-black text-blue-900 flex items-center gap-2">
                <Fingerprint className="w-6 h-6 text-blue-600" />
                Regional Access Tokens Initialized
              </AlertTitle>
              <AlertDescription className="text-blue-800/80 font-medium italic">
                Strategic administrative node established. Transmit these one-time access parameters to the regional commander.
              </AlertDescription>
              <div className="flex flex-col md:flex-row gap-6 mt-4">
                <div className="bg-white/60 p-3 rounded-xl border border-blue-200/50 backdrop-blur-sm">
                   <p className="text-[10px] font-black uppercase text-blue-800/50 tracking-widest mb-1">Commander Email</p>
                   <p className="text-sm font-black font-mono">{newAdminCreds.email}</p>
                </div>
                <div className="bg-white/60 p-3 rounded-xl border border-blue-200/50 backdrop-blur-sm">
                   <p className="text-[10px] font-black uppercase text-blue-800/50 tracking-widest mb-1">Key Phrase</p>
                   <p className="text-xl font-black font-mono text-blue-600 tracking-wider">{newAdminCreds.tempPassword}</p>
                </div>
              </div>
            </div>
            <Button onClick={copyToClipboard} size="lg" className="bg-blue-600 hover:bg-blue-700 h-14 px-8 shadow-xl shadow-blue-500/20 gap-3 border-none ring-0">
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              <span className="font-black uppercase tracking-widest text-xs">{copied ? "Copied" : "Copy Payload"}</span>
            </Button>
          </div>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form */}
        <Card className="lg:col-span-4 border-border/50 shadow-xl overflow-hidden self-start sticky top-8">
          <CardHeader className="bg-muted/30 border-b border-border/20">
            <CardTitle className="text-xl flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-600" />
              Establish Node
            </CardTitle>
            <CardDescription>Deploy a new regional administrative authority.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Terminal className="w-3 h-3 text-blue-500" /> 
                  Representative Name
                </Label>
                <Input name="name" value={formData.name} onChange={handleChange} placeholder="Commander Name" className="h-11 font-medium bg-muted/20 border-none shadow-none ring-1 ring-border/50 focus-visible:ring-blue-500/50 transition-all" required />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Mail className="w-3 h-3 text-blue-500" /> 
                  Administrative Axis
                </Label>
                <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="admin-link@regional.gov" className="h-11 font-medium bg-muted/20 border-none shadow-none ring-1 ring-border/50 focus-visible:ring-blue-500/50 transition-all" required />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Globe className="w-3 h-3 text-blue-500" /> 
                  Regional Jurisdiction
                </Label>
                <Input name="region" value={formData.region} onChange={handleChange} placeholder="Provincial Zone" className="h-11 font-medium bg-muted/20 border-none shadow-none ring-1 ring-border/50 focus-visible:ring-blue-500/50 transition-all" required />
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 border-t border-border/10 p-6">
              <Button type="submit" className="w-full h-12 shadow-lg shadow-blue-500/20 font-black uppercase tracking-wider text-xs bg-blue-600 hover:bg-blue-700" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
                {loading ? "Establishing..." : "Authorize Node"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Table */}
        <Card className="lg:col-span-8 border-border/50 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/20 pb-4 mb-4 bg-muted/5">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" />
                Regional Topology
              </CardTitle>
              <CardDescription>Federal registry of active regional administrative commanders.</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30" />
              <Input placeholder="Search nodes..." className="pl-9 h-9 w-[200px] text-xs" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading && admins.length === 0 ? (
               <div className="h-[400px] flex flex-col items-center justify-center gap-4">
                  <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                  <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-widest animate-pulse">Synchronizing regional cloud...</p>
               </div>
            ) : admins.length === 0 ? (
               <div className="h-[400px] flex flex-col items-center justify-center text-muted-foreground italic">No regional authorities initialized.</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30 border-none">
                      <TableHead className="pl-6 h-12 text-[10px] font-black uppercase tracking-widest">Regional Commander</TableHead>
                      <TableHead className="h-12 text-[10px] font-black uppercase tracking-widest">Axis</TableHead>
                      <TableHead className="h-12 text-[10px] font-black uppercase tracking-widest">Jurisdiction</TableHead>
                      <TableHead className="pr-6 text-right h-12 text-[10px] font-black uppercase tracking-widest">Node Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {admins.map((admin) => (
                      <TableRow key={admin.id} className="group hover:bg-muted/40 transition-all border-b border-border/30 h-20">
                        <TableCell className="pl-6">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-700 font-black text-xs border border-blue-500/20 group-hover:scale-110 transition-transform">
                                {admin.name?.split(' ').map(n => n[0]).join('')}
                              </div>
                              <span className="text-sm font-black group-hover:text-blue-600 transition-colors">{admin.name}</span>
                           </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs font-medium text-muted-foreground">{admin.email}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-blue-50 text-blue-700 shadow-none border border-blue-100 font-black uppercase tracking-tighter text-[9px] px-2 h-5">
                            <MapPin className="w-2.5 h-2.5 mr-1" /> {admin.region}
                          </Badge>
                        </TableCell>
                        <TableCell className="pr-6 text-right">
                          <Badge variant="outline" className={cn(
                            "px-3 py-1 font-black uppercase tracking-widest text-[9px] shadow-none",
                            admin.isBlocked ? "bg-red-500/10 text-red-700 border-red-500/20" : "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                          )}>
                            {admin.isBlocked ? "Decommissioned" : "Online"}
                          </Badge>
                          <div className="mt-1 flex items-center justify-end gap-1 text-[9px] text-muted-foreground/60 italic font-medium">
                            {admin.isBlocked ? "Circuit Broken" : "Telemetry Active"}
                            <div className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              admin.isBlocked ? "bg-red-500" : "bg-emerald-500 animate-pulse"
                            )} />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
          <CardFooter className="bg-muted/5 border-t border-border/10 p-4">
             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck className="w-3 h-3 text-blue-500" />
                All regional provisioning is subject to federal oversight and audit logging.
             </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ManageSuperAdmins;

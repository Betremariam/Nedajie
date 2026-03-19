import React, { useEffect, useState } from "react";
import { 
  getAllAdmins, 
  createOwner 
} from "../../services/api";
import { 
  Copy, 
  Check, 
  ShieldAlert, 
  ShieldCheck, 
  KeyRound, 
  MapPin, 
  Building2,
  UserPlus,
  Users,
  Search,
  Building,
  Mail,
  Loader2,
  ChevronRight,
  Terminal,
  Fingerprint,
  Zap
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

const ManageOwners = () => {
  const [owners, setOwners] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    companyName: "",
    region: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: null, text: "" });
  
  const [newOwnerCreds, setNewOwnerCreds] = useState(null);
  const [copied, setCopied] = useState(false);

  const fetchOwners = async () => {
    try {
      setLoading(true);
      const res = await getAllAdmins();
      const filtered = res.data.filter(admin => admin.role === "stationOwner");
      setOwners(filtered);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to load administrative node list." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: null, text: "" });
    setNewOwnerCreds(null);

    const { name, email, companyName, region } = formData;
    if (!name || !email || !companyName || !region) {
      setMessage({ type: "error", text: "Integrity check failed: All parameters are required." });
      return;
    }

    try {
      setLoading(true);
      const res = await createOwner({ name, email, companyName, region });
      
      setMessage({ type: "success", text: "Entity created and authorized successfully." });
      setNewOwnerCreds({ email, tempPassword: res.data.tempPassword });
      setFormData({ name: "", email: "", companyName: "", region: "" });
      fetchOwners();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.msg || "Provisioning failure. Access denied." });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (newOwnerCreds) {
      navigator.clipboard.writeText(`Email: ${newOwnerCreds.email}\nPassword: ${newOwnerCreds.tempPassword}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1 text-emerald-600">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-[10px] font-mono font-black tracking-[0.2em] uppercase">Security Layer Active</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground italic">Entity Management</h1>
          <p className="text-muted-foreground text-lg mt-1 italic">Administrative provisioning of fuel station proprietors and corporate entities.</p>
        </div>
        <div className="bg-muted/40 p-4 rounded-2xl border border-border/50 flex items-center gap-4">
           <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <Users className="w-5 h-5" />
           </div>
           <div>
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Active Entities</p>
              <p className="text-xl font-black">{owners.length}</p>
           </div>
        </div>
      </div>

      {message.text && !newOwnerCreds && (
        <Alert variant={message.type === "error" ? "destructive" : "default"} className={message.type === "success" ? "border-emerald-500 bg-emerald-500/5 text-emerald-600" : ""}>
          {message.type === "error" ? <ShieldAlert className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4 text-emerald-600" />}
          <AlertTitle className="font-black text-[10px] uppercase tracking-widest">Protocol Response</AlertTitle>
          <AlertDescription className="font-bold">{message.text}</AlertDescription>
        </Alert>
      )}

      {newOwnerCreds && (
        <Alert className="border-emerald-500 bg-emerald-500/10 p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
             <KeyRound className="w-24 h-24" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <AlertTitle className="text-xl font-black text-emerald-900 flex items-center gap-2">
                <Fingerprint className="w-6 h-6 text-emerald-600" />
                Security Credentials Generated
              </AlertTitle>
              <AlertDescription className="text-emerald-800/80 font-medium italic">
                Permanent record created. Provide these temporary access tokens to the entity representative immediately.
              </AlertDescription>
              <div className="flex flex-col md:flex-row gap-6 mt-4">
                <div className="bg-white/60 p-3 rounded-xl border border-emerald-200/50 backdrop-blur-sm">
                   <p className="text-[10px] font-black uppercase text-emerald-800/50 tracking-widest mb-1">Access Email</p>
                   <p className="text-sm font-black font-mono">{newOwnerCreds.email}</p>
                </div>
                <div className="bg-white/60 p-3 rounded-xl border border-emerald-200/50 backdrop-blur-sm">
                   <p className="text-[10px] font-black uppercase text-emerald-800/50 tracking-widest mb-1">Entry Token</p>
                   <p className="text-xl font-black font-mono text-emerald-600 tracking-wider">{newOwnerCreds.tempPassword}</p>
                </div>
              </div>
            </div>
            <Button onClick={copyToClipboard} size="lg" className="bg-emerald-600 hover:bg-emerald-700 h-14 px-8 shadow-xl shadow-emerald-500/20 gap-3 border-none ring-0">
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
              <UserPlus className="w-5 h-5 text-emerald-600" />
              Provision Entity
            </CardTitle>
            <CardDescription>Authorize a new fuel station owner node.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Terminal className="w-3 h-3 text-emerald-500" /> 
                  Representative Name
                </Label>
                <Input name="name" value={formData.name} onChange={handleChange} placeholder="Full Legal Name" className="h-11 font-medium bg-muted/20 border-none shadow-none ring-1 ring-border/50 focus-visible:ring-emerald-500/50 transition-all" required />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Mail className="w-3 h-3 text-emerald-500" /> 
                  Communication Axis
                </Label>
                <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="auth-link@domain.com" className="h-11 font-medium bg-muted/20 border-none shadow-none ring-1 ring-border/50 focus-visible:ring-emerald-500/50 transition-all" required />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Building className="w-3 h-3 text-emerald-500" /> 
                  Corporate Identity
                </Label>
                <Input name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Company Legal Title" className="h-11 font-medium bg-muted/20 border-none shadow-none ring-1 ring-border/50 focus-visible:ring-emerald-500/50 transition-all" required />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-emerald-500" /> 
                  Administrative Zone
                </Label>
                <Input name="region" value={formData.region} onChange={handleChange} placeholder="Provincial Jurisdiction" className="h-11 font-medium bg-muted/20 border-none shadow-none ring-1 ring-border/50 focus-visible:ring-emerald-500/50 transition-all" required />
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 border-t border-border/10 p-6">
              <Button type="submit" className="w-full h-12 shadow-lg shadow-emerald-500/20 font-black uppercase tracking-wider text-xs bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
                {loading ? "Authorizing..." : "Initialize Entity"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Table */}
        <Card className="lg:col-span-8 border-border/50 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/20 pb-4 mb-4 bg-muted/5">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                Entity Registry
              </CardTitle>
              <CardDescription>National ledger of authorized station proprietors.</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30" />
              <Input placeholder="Search entities..." className="pl-9 h-9 w-[200px] text-xs" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading && owners.length === 0 ? (
               <div className="h-[400px] flex flex-col items-center justify-center gap-4">
                  <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
                  <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-widest animate-pulse">Syncing entity cloud...</p>
               </div>
            ) : owners.length === 0 ? (
               <div className="h-[400px] flex flex-col items-center justify-center text-muted-foreground italic">No entities registered in this cycle.</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30 border-none">
                      <TableHead className="pl-6 h-12 text-[10px] font-black uppercase tracking-widest">Stakeholder</TableHead>
                      <TableHead className="h-12 text-[10px] font-black uppercase tracking-widest">Axis</TableHead>
                      <TableHead className="h-12 text-[10px] font-black uppercase tracking-widest">Entity</TableHead>
                      <TableHead className="h-12 text-[10px] font-black uppercase tracking-widest">Zone</TableHead>
                      <TableHead className="pr-6 text-right h-12 text-[10px] font-black uppercase tracking-widest">Trust Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {owners.map((owner) => (
                      <TableRow key={owner.id} className="group hover:bg-muted/40 transition-all border-b border-border/30 h-20">
                        <TableCell className="pl-6">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-700 font-black text-xs border border-emerald-500/20 group-hover:scale-110 transition-transform">
                                {owner.name?.split(' ').map(n => n[0]).join('')}
                              </div>
                              <span className="text-sm font-black group-hover:text-emerald-600 transition-colors">{owner.name}</span>
                           </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs font-medium text-muted-foreground">{owner.email}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-xs font-bold text-foreground">
                            <Building2 className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                            {owner.companyName || "NOT_SPECIFIED"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-xs font-bold text-foreground italic">
                            <MapPin className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                            {owner.region || "NOT_MAPPED"}
                          </div>
                        </TableCell>
                        <TableCell className="pr-6 text-right">
                          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20 px-3 py-1 font-black uppercase tracking-widest text-[9px] shadow-none">
                            Authorized
                          </Badge>
                          <div className="mt-1 flex items-center justify-end gap-1 text-[9px] text-muted-foreground/60 italic font-medium">
                            Circuit Active
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
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
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                All administrative actions are encrypted and logged for federal audit.
             </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ManageOwners;

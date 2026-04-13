import React, { useState, useEffect } from "react";
import API from "../../services/api.js"; 
import { 
  UserPlus, 
  Phone, 
  MapPin, 
  Building2, 
  Upload, 
  FileCheck, 
  ShieldCheck, 
  UserCheck,
  AlertCircle,
  Loader2,
  Terminal,
  Zap,
  Fingerprint,
  Users,
  Eye,
  EyeOff,
  ClipboardCheck,
  Power
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Button } from "../../components/ui/Button";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/Alert";
import { Badge } from "../../components/ui/Badge";
import { Switch } from "../../components/ui/Switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
import { cn } from "../../lib/utils";

const AttendantManagement = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    stationName: "",
    city: "",
    region: "",
    document: null,
  });
  const [attendants, setAttendants] = useState([]);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchAttendants = async () => {
    setFetching(true);
    try {
      const res = await API.get("/owners/my-attendants");
      setAttendants(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchAttendants();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "document") {
      setForm({ ...form, document: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setGeneratedPassword("");
    setLoading(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("phone", form.phone);
    formData.append("stationName", form.stationName); 
    formData.append("city", form.city);
    formData.append("region", form.region);
    formData.append("document", form.document);

    try {
      const res = await API.post("/owners/attendant", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Personnel authorized successfully.");
      setGeneratedPassword(res.data.generatedPassword);
      setForm({
        name: "",
        phone: "",
        stationName: "",
        city: "",
        region: "",
        document: null,
      });
      fetchAttendants();
    } catch (err) {
      setError(err?.response?.data?.msg || "Onboarding sequence failed. Protocol rejected.");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id) => {
    try {
      await API.patch(`/owners/attendant/${id}/toggle`);
      fetchAttendants();
    } catch (err) {
      console.error("Toggle Error:", err);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-10 max-w-6xl mx-auto font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 mb-1 text-primary">
            <UserCheck className="w-5 h-5" />
            <span className="text-[11px] font-bold tracking-wider uppercase text-primary/80">Personnel Management</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Personnel Infrastructure</h1>
          <p className="text-muted-foreground text-[14px] font-medium max-w-xl">Provision access and manage operational status of fuel attendants.</p>
        </div>
      </div>

      {generatedPassword && (
        <Alert className="border-blue-500/50 bg-blue-500/5 text-blue-600 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-500">
          <ShieldCheck className="h-4 w-4 text-blue-600" />
          <AlertTitle className="font-bold text-[11px] uppercase tracking-widest text-blue-600">Secure Token Generated</AlertTitle>
          <AlertDescription className="mt-2 text-[13px] flex items-center justify-between gap-4">
            <span className="font-medium">Please provide this temporary password to the attendant:</span>
            <div className="flex items-center gap-2 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20">
              <code className="font-bold tracking-widest text-sm">{showPwd ? generatedPassword : "••••••••"}</code>
              <button onClick={() => setShowPwd(!showPwd)} className="text-blue-600 hover:text-blue-700">
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {(success || error) && (
        <Alert className={cn(
          "rounded-2xl",
          success ? "border-emerald-500/50 bg-emerald-500/5 text-emerald-600" : "border-destructive/50 bg-destructive/5"
        )}>
          {success ? <ShieldCheck className="h-4 w-4 text-emerald-600" /> : <AlertCircle className="h-4 w-4" />}
          <AlertTitle className="font-bold text-[11px] uppercase tracking-widest">
            {success ? "Protocol Success" : "System Protocols Violated"}
          </AlertTitle>
          <AlertDescription className="font-medium text-[13px]">{success || error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Onboarding Form */}
        <div className="lg:col-span-5">
          <Card className="border border-border shadow-sm overflow-hidden rounded-[24px]">
            <CardHeader className="bg-muted/30 border-b border-border/20 py-6 px-10">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <UserPlus className="w-6 h-6" />
                 </div>
                 <div>
                    <CardTitle className="text-xl font-semibold">Authorize Entry</CardTitle>
                    <CardDescription className="text-[14px]">Provision new personnel tokens.</CardDescription>
                 </div>
              </div>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-primary" /> Full Legal Name
                    </Label>
                    <Input name="name" value={form.name} onChange={handleChange} placeholder="Personnel Name" className="h-11 font-medium bg-muted/20 border-border rounded-xl" required />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-primary" /> Operational Phone
                    </Label>
                    <Input name="phone" value={form.phone} onChange={handleChange} placeholder="+251-XXX-XXXX" className="h-11 font-medium bg-muted/20 border-border rounded-xl" required />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-primary" /> Station
                      </Label>
                      <Input name="stationName" value={form.stationName} onChange={handleChange} placeholder="Identity" className="h-11 font-medium bg-muted/20 border-border rounded-xl" required />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-primary" /> City
                      </Label>
                      <Input name="city" value={form.city} onChange={handleChange} placeholder="City" className="h-11 font-medium bg-muted/20 border-border rounded-xl" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-primary" /> Region
                    </Label>
                    <Input name="region" value={form.region} onChange={handleChange} placeholder="Operational Region" className="h-11 font-medium bg-muted/20 border-border rounded-xl" required />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-2">
                      <Upload className="w-3.5 h-3.5 text-primary" /> Identification
                    </Label>
                    <div className={cn(
                      "border-2 border-dashed rounded-[18px] p-6 text-center transition-all group relative cursor-pointer",
                       form.document ? "border-primary/40 bg-primary/5" : "border-border hover:border-primary/20 hover:bg-muted/10"
                    )}>
                      <input className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" type="file" name="document" onChange={handleChange} />
                      <div className="relative z-0">
                        <div className={cn(
                          "w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center transition-all",
                          form.document ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground/40"
                        )}>
                          {form.document ? <FileCheck className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
                        </div>
                        <p className={cn("font-bold text-[13px]", form.document ? "text-foreground" : "text-muted-foreground")}>
                          {form.document ? "Document Ready" : "Upload Credentials"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/30 border-t border-border/10 p-8 flex justify-end">
                <Button type="submit" className="w-full h-11 font-bold uppercase tracking-widest text-[11px] rounded-xl transition-all gap-2" disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  {loading ? "Authorizing..." : "Initiate Provisioning"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>

        {/* Personnel List */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border border-border shadow-sm overflow-hidden rounded-[24px]">
            <CardHeader className="bg-muted/30 border-b border-border/20 py-6 px-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-semibold">Active Fleet</CardTitle>
                    <CardDescription className="text-[14px]">Operational personnel status.</CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="rounded-full px-3 py-1 font-bold uppercase tracking-tighter bg-emerald-50 text-emerald-600 border-emerald-200">
                  {attendants.length} Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {fetching ? (
                <div className="p-20 flex flex-col items-center justify-center gap-4 text-muted-foreground/40 font-bold uppercase tracking-widest text-[11px]">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  Refreshing Personnel DB...
                </div>
              ) : attendants.length === 0 ? (
                <div className="p-20 flex flex-col items-center justify-center gap-4 text-muted-foreground/40 font-bold uppercase tracking-widest text-[11px]">
                   <Users className="w-8 h-8 opacity-20" />
                   Personnel Data Missing
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/10">
                      <TableHead className="py-5 font-bold text-[11px] uppercase tracking-widest">Attendant</TableHead>
                      <TableHead className="font-bold text-[11px] uppercase tracking-widest">Station/City</TableHead>
                      <TableHead className="font-bold text-[11px] uppercase tracking-widest">Approval</TableHead>
                      <TableHead className="text-right font-bold text-[11px] uppercase tracking-widest px-10">Access</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendants.map((at) => (
                      <TableRow key={at.id} className="hover:bg-muted/5 transition-colors border-border/10">
                        <TableCell className="py-5">
                          <div className="flex flex-col">
                            <span className="font-bold text-[14px]">{at.name}</span>
                            <span className="text-[12px] font-medium text-muted-foreground">{at.phone}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                           <div className="flex flex-col">
                            <span className="font-semibold text-[13px]">{at.stationName}</span>
                            <span className="text-[11px] font-medium text-muted-foreground/60">{at.city}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {at.isApproved ? (
                            <Badge className="bg-emerald-500/10 text-emerald-600 border-none shadow-none text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">Approved</Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 border-none shadow-none text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">Pending</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right px-10">
                          <div className="flex items-center justify-end gap-3">
                            <span className={cn(
                              "text-[10px] font-bold uppercase tracking-widest",
                              at.isEnabled ? "text-emerald-500" : "text-muted-foreground/40"
                            )}>
                              {at.isEnabled ? "Active" : "Revoked"}
                            </span>
                            <Switch checked={at.isEnabled} onCheckedChange={() => toggleStatus(at.id)} className="data-[state=checked]:bg-emerald-500" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest pt-4">
         <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-primary/60" />
            End-to-end Encrypted
         </div>
         <span className="w-1 h-1 rounded-full bg-border" />
         <div className="flex items-center gap-2">
            <UserCheck className="w-3.5 h-3.5 text-primary/60" />
            Audit Path Verified
         </div>
      </div>
    </div>
  );
};

export default AttendantManagement;

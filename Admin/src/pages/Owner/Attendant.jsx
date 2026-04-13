import React, { useState } from "react";
import API from "../../services/api.js"; 
import { 
  UserPlus, 
  Phone, 
  Lock, 
  MapPin, 
  Building2, 
  Upload, 
  FileCheck, 
  ShieldCheck, 
  UserCheck,
  AlertCircle,
  Loader2,
  ChevronRight,
  Terminal,
  Zap,
  Fingerprint
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Button } from "../../components/ui/Button";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/Alert";
import { Badge } from "../../components/ui/Badge";
import { cn } from "../../lib/utils";

const RegisterAttendant = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    stationName: "",
    city: "",
    document: null,
  });
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    setLoading(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("phone", form.phone);
    formData.append("password", form.password);
    formData.append("stationName", form.stationName); 
    formData.append("city", form.city);
    formData.append("document", form.document);

    try {
      const res = await API.post("/owners/attendant", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Personnel authorized successfully. Biometric link ready.");
      setForm({
        name: "",
        phone: "",
        password: "",
        stationName: "",
        city: "",
        document: null,
      });
    } catch (err) {
      setError(err?.response?.data?.msg || "Onboarding sequence failed. Protocol rejected.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-4xl mx-auto font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 mb-1 text-primary">
            <UserCheck className="w-5 h-5" />
            <span className="text-[11px] font-bold tracking-wider uppercase text-primary/80">Personnel Management</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Personnel Onboarding</h1>
          <p className="text-muted-foreground text-[14px] font-medium max-w-xl">Register and authorize fuel attendants for station operations.</p>
        </div>
      </div>

      {success && (
        <Alert className="border-emerald-500/50 bg-emerald-500/5 text-emerald-600 rounded-2xl">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <AlertTitle className="font-bold text-[11px] uppercase tracking-widest text-emerald-600">Protocol Success</AlertTitle>
          <AlertDescription className="font-medium text-[13px]">{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="border-destructive/50 bg-destructive/5 rounded-2xl">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-bold text-[11px] uppercase tracking-widest">System Protocols Violated</AlertTitle>
          <AlertDescription className="font-medium text-[13px]">{error}</AlertDescription>
        </Alert>
      )}

      <Card className="border border-border shadow-sm overflow-hidden rounded-[24px]">
        <CardHeader className="bg-muted/30 border-b border-border/20 py-8 px-10">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <UserPlus className="w-7 h-7" />
             </div>
             <div>
                <CardTitle className="text-2xl font-semibold">Authorize Entry</CardTitle>
                <CardDescription className="text-[14px] font-medium">Verify credentials and provision access tokens.</CardDescription>
             </div>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              <div className="space-y-2.5">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-primary" /> 
                  Full Legal Name
                </Label>
                <Input name="name" value={form.name} onChange={handleChange} placeholder="Personnel Name" className="h-12 font-medium bg-muted/20 border-border focus-visible:ring-primary/50 transition-all px-4 rounded-xl" required />
              </div>

              <div className="space-y-2.5">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-primary" /> 
                  Operational Phone
                </Label>
                <Input name="phone" value={form.phone} onChange={handleChange} placeholder="+251-XXX-XXXX" className="h-12 font-medium bg-muted/20 border-border focus-visible:ring-primary/50 transition-all px-4 rounded-xl" required />
              </div>

              <div className="space-y-2.5">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Fingerprint className="w-3.5 h-3.5 text-primary" /> 
                  Password
                </Label>
                <Input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" className="h-12 font-medium bg-muted/20 border-border focus-visible:ring-primary/50 transition-all px-4 rounded-xl" required />
              </div>

              <div className="space-y-2.5">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-primary" /> 
                  Assigned Station
                </Label>
                <Input name="stationName" value={form.stationName} onChange={handleChange} placeholder="Station Identity" className="h-12 font-medium bg-muted/20 border-border focus-visible:ring-primary/50 transition-all px-4 rounded-xl" required />
              </div>

              <div className="space-y-2.5">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-primary" /> 
                  City
                </Label>
                <Input name="city" value={form.city} onChange={handleChange} placeholder="Operational City" className="h-12 font-medium bg-muted/20 border-border focus-visible:ring-primary/50 transition-all px-4 rounded-xl" required />
              </div>

              <div className="md:col-span-2">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                  <Upload className="w-3.5 h-3.5 text-primary" /> 
                  Identification Documents
                </Label>
                <div className={cn(
                  "border-2 border-dashed rounded-[20px] p-8 text-center transition-all group relative cursor-pointer",
                   form.document ? "border-primary/40 bg-primary/5" : "border-border hover:border-primary/20 hover:bg-muted/10"
                )}>
                  <input
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    type="file"
                    name="document"
                    id="document"
                    onChange={handleChange}
                  />
                  <div className="relative z-0">
                    <div className={cn(
                      "w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-all",
                      form.document ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground/40"
                    )}>
                      {form.document ? <FileCheck className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
                    </div>
                    {form.document ? (
                      <div className="space-y-1">
                        <p className="font-bold text-sm text-foreground">Document Selected</p>
                        <p className="text-xs font-semibold text-primary uppercase tracking-tight">{form.document.name}</p>
                      </div>
                    ) : (
                      <>
                        <p className="font-bold text-sm text-foreground mb-1">Upload File</p>
                        <p className="text-xs font-semibold text-muted-foreground/40 uppercase tracking-wider">Click or drag identification files</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/30 border-t border-border/10 p-10 flex justify-end">
            <Button 
              type="submit" 
              className="h-12 px-10 font-bold uppercase tracking-widest text-[11px] bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 rounded-xl transition-all gap-2"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
              {loading ? "Authorizing..." : "Initiate Provisioning"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <div className="flex items-center justify-center gap-6 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest pb-4">
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

export default RegisterAttendant;

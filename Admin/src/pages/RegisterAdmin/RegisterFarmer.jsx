import React, { useState } from "react";
import API from "../../services/api.js";
import { 
  UserPlus, 
  Phone, 
  Lock, 
  Wheat, 
  MapPin, 
  Upload, 
  FileCheck, 
  ShieldCheck, 
  UserCheck,
  AlertCircle,
  Loader2,
  ChevronRight,
  Zap,
  CheckCircle2,
  TreePine,
  Landmark
} from "lucide-react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/Card";
import { Label } from "../../components/ui/Label";
import { Badge } from "../../components/ui/Badge";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/Alert";
import { cn } from "../../lib/utils";

const RegisterFarmer = () => {
  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    kebele: "",
    woreda: "",
    document: null,
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    formData.append("fullName", form.fullName);
    formData.append("phoneNumber", form.phoneNumber);
    formData.append("kebele", form.kebele);
    formData.append("woreda", form.woreda);
    formData.append("document", form.document);

    try {
      const res = await API.post("/admins/register-farmer", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(res.data.msg || "Agricultural asset owner credentials synthesized and stored.");

      setForm({
        fullName: "",
        phoneNumber: "",
        kebele: "",
        woreda: "",
        document: null,
      });
    } catch (err) {
      console.error("Registration failed:", err.response?.data || err.message);
      setError(err?.response?.data?.msg || "Agricultural enrollment protocol failure.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1 text-primary">
            <Wheat className="w-5 h-5" />
            <span className="text-[10px] font-mono font-black tracking-[0.2em] uppercase text-primary/60">Agrarian Enrollment</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground italic">Register Farmer</h1>
          <p className="text-muted-foreground text-lg mt-1 italic">Enroll agricultural machinery owners for prioritized fuel allocation.</p>
        </div>
        <div className="hidden md:flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
           <ShieldCheck className="w-3 h-3 text-primary" />
           Identity Registry Active
        </div>
      </div>

      {success && (
        <Alert className="border-emerald-500/50 bg-emerald-500/5 text-emerald-600">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle className="font-black text-[10px] uppercase tracking-widest">Enrollment Success</AlertTitle>
          <AlertDescription className="font-bold italic">{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="border-red-500/50 bg-red-500/5">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-black text-[10px] uppercase tracking-widest">Sequence Error</AlertTitle>
          <AlertDescription className="font-bold">{error}</AlertDescription>
        </Alert>
      )}

      <Card className="border-border/50 shadow-2xl shadow-primary/5 overflow-hidden group">
        <CardHeader className="bg-muted/30 border-b border-border/20 py-8 px-10">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner group-hover:scale-110 transition-transform">
                <TreePine className="w-7 h-7" />
             </div>
             <div>
                <CardTitle className="text-2xl font-black italic underline decoration-primary/30 underline-offset-4 uppercase tracking-tight">Farmer Registry Matrix</CardTitle>
                <CardDescription className="italic font-medium">Verify agricultural identities for regional fuel sovereignty.</CardDescription>
             </div>
          </div>
        </CardHeader>
        <CardContent className="p-10">
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Full Legal Name</Label>
                <div className="relative group/input">
                  <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                  <Input
                    className="h-14 pl-12 rounded-2xl border-border/50 bg-background/50 font-bold italic group-hover/input:border-primary/20 transition-all"
                    placeholder="Enter farmer's full name"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Mobile Communications Link</Label>
                <div className="relative group/input">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                  <Input
                    className="h-14 pl-12 rounded-2xl border-border/50 bg-background/50 font-bold italic group-hover/input:border-primary/20 transition-all font-mono"
                    placeholder="Enter phone number"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Regional Woreda ID</Label>
                <div className="relative group/input">
                  <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                  <Input
                    className="h-14 pl-12 rounded-2xl border-border/50 bg-background/50 font-bold italic group-hover/input:border-primary/20 transition-all font-mono uppercase"
                    placeholder="Enter woreda"
                    name="woreda"
                    value={form.woreda}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Local Kebele ID</Label>
                <div className="relative group/input">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                  <Input
                    className="h-14 pl-12 rounded-2xl border-border/50 bg-background/50 font-bold italic group-hover/input:border-primary/20 transition-all font-mono uppercase"
                    placeholder="Enter kebele"
                    name="kebele"
                    value={form.kebele}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-2.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Agricultural Credentials [.PDF/IMG]</Label>
                <div className="relative group/input">
                  <input
                    className="hidden"
                    type="file"
                    name="document"
                    id="document"
                    onChange={handleChange}
                  />
                  <Label 
                    htmlFor="document" 
                    className="flex md:h-20 items-center justify-center h-14 px-4 rounded-2xl border-2 border-dashed border-border/50 bg-muted/20 cursor-pointer hover:border-primary/30 hover:bg-primary/5 transition-all text-muted-foreground/60 font-medium italic overflow-hidden text-center"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-2">
                        <Upload className="w-4 h-4 text-primary opacity-40 shrink-0" />
                        <span className="truncate">
                          {form.document ? form.document.name : "Upload agrarian permit / identification"}
                        </span>
                      </div>
                      <p className="text-[9px] font-black uppercase tracking-widest opacity-40">System requires high-fidelity scanner output</p>
                    </div>
                    {form.document && <FileCheck className="w-5 h-5 ml-4 text-emerald-500 shrink-0" />}
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t border-border/10">
               <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 italic">
                  <span className="flex items-center gap-2"><Lock className="w-3 h-3" /> Data Sovereign</span>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span>Cycle: {new Date().getFullYear()}_REV_A</span>
               </div>
               <Button 
                disabled={loading}
                className="w-full md:w-auto h-16 px-12 bg-foreground text-background hover:bg-primary hover:text-primary-foreground font-black uppercase tracking-widest text-xs rounded-2xl shadow-2xl transition-all hover:-translate-y-1 gap-3 group/btn"
                type="submit"
               >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 fill-primary text-primary shadow-glow group-hover/btn:scale-110 transition-transform" />}
                {loading ? "Synthesizing..." : "Register Farmer"}
               </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterFarmer;

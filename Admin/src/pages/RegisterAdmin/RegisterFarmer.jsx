import React, { useState } from "react";
import API from "../../services/api.js";
import { 
  User, 
  PhoneCall, 
  MapPin, 
  Landmark, 
  TreePine, 
  CloudUpload, 
  ShieldCheck, 
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Label } from "../../components/ui/Label";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/Alert";

const RegisterFarmer = () => {
  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    kebele: "",
    woreda: "",
    landSize: "",
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
    formData.append("landSize", form.landSize);
    if(form.document) formData.append("document", form.document);

    try {
      const res = await API.post("/admins/register-farmer", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Farmer registered successfully.");
      setForm({ fullName: "", phoneNumber: "", kebele: "", woreda: "", landSize: "", document: null });
    } catch (err) {
      console.error("Registration failed:", err.response?.data || err.message);
      setError(err?.response?.data?.msg || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-6xl mx-auto font-sans">
      
      {success && (
        <Alert className="border-emerald-500/50 bg-emerald-50 text-emerald-800">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle className="font-bold">Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-bold">Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="bg-card rounded-[24px] shadow-sm border border-border p-8 md:p-10 transition-colors">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-border">
          <div className="flex items-center gap-5">
             <div className="w-14 h-14 rounded-[16px] bg-primary flex items-center justify-center text-primary-foreground shadow-md">
                <TreePine className="w-7 h-7" />
             </div>
             <div className="space-y-1">
                <h1 className="text-2xl font-bold text-foreground tracking-tight">Farmer Registry</h1>
                <p className="text-muted-foreground text-[13px] font-medium">Verify agricultural identities for regional fuel access</p>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <Button type="button" variant="outline" className="h-10 px-6 rounded-xl text-slate-600 border-slate-200 font-semibold hover:bg-slate-50">
                Cancel
             </Button>
             <Button type="button" onClick={handleSubmit} className="h-10 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20 font-semibold border-0">
                Register Farmer
             </Button>
          </div>
        </div>

        {/* Form Body */}
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            
            {/* Full Name */}
            <div className="space-y-3">
              <Label className="text-[13px] font-bold text-foreground/80 ml-0.5">Full Name</Label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  className="h-12 pl-12 rounded-xl border-border bg-muted/30 font-medium text-[14px] focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all text-foreground"
                  placeholder="Enter farmer's full name"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-3">
              <Label className="text-[13px] font-bold text-slate-800 ml-0.5">Phone Number</Label>
              <div className="relative group flex items-center">
                <div className="absolute left-4 flex items-center gap-2 text-slate-500">
                  <PhoneCall className="w-3.5 h-3.5 group-focus-within:text-primary transition-colors" />
                  <span className="text-[13px] font-medium ml-1">🇪🇹 +251</span>
                  <div className="w-px h-4 bg-slate-300 mx-1"></div>
                </div>
                <Input
                  className="h-12 pl-[100px] rounded-xl border-slate-200 bg-slate-50/50 font-medium text-[14px] focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all"
                  placeholder="Enter phone number"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Woreda */}
            <div className="space-y-3">
              <Label className="text-[13px] font-bold text-slate-800 ml-0.5 flex items-center gap-2">
                <Landmark className="w-4 h-4 text-primary" /> 
                Woreda
              </Label>
              <div className="relative group">
                <Input
                  className="h-12 pl-4 rounded-xl border-slate-200 bg-slate-50/50 font-medium text-[14px] focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all"
                  placeholder="Enter woreda"
                  name="woreda"
                  value={form.woreda}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Kebele */}
            <div className="space-y-3">
              <Label className="text-[13px] font-bold text-slate-800 ml-0.5 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" /> 
                Kebele
              </Label>
              <div className="relative group">
                <Input
                  className="h-12 pl-4 rounded-xl border-slate-200 bg-slate-50/50 font-medium text-[14px] focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all"
                  placeholder="Enter kebele"
                  name="kebele"
                  value={form.kebele}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Land Size (Hectares) */}
            <div className="space-y-3">
              <Label className="text-[13px] font-bold text-slate-800 ml-0.5 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" /> 
                Land Size (Hectares)
              </Label>
              <div className="relative group">
                <Input
                  type="number"
                  step="0.1"
                  className="h-12 pl-4 rounded-xl border-slate-200 bg-slate-50/50 font-medium text-[14px] focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all"
                  placeholder="Enter land size in hectares (e.g. 2.5)"
                  name="landSize"
                  value={form.landSize}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Document Upload */}
            <div className="space-y-3 md:col-span-1">
              <Label className="text-[13px] font-bold text-slate-800 ml-0.5">Proof from the Agricultural Bureau</Label>
              <div className="relative group">
                <input
                  className="hidden"
                  type="file"
                  name="document"
                  id="document"
                  onChange={handleChange}
                  accept=".pdf,image/*"
                />
                <Label 
                  htmlFor="document" 
                  className="flex flex-col items-center justify-center p-8 rounded-2xl border-[1.5px] border-dashed border-border bg-muted/10 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center bg-card group-hover:border-primary mb-4">
                     <CloudUpload className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-[14px] font-bold text-foreground mb-1">
                    {form.document ? form.document.name : "Upload proof document"}
                  </span>
                  <span className="text-[12px] text-muted-foreground font-medium mb-4">PDF or image, max 5MB</span>
                  
                  <div className="bg-primary hover:bg-primary/90 text-white text-[12px] font-bold px-5 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer">
                    Browse Files
                  </div>
                </Label>
              </div>
            </div>
            
          </div>

          {/* Bottom Action Buttons */}
          <div className="pt-8 pb-4 border-t border-slate-100 flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline"
              className="h-11 px-6 bg-white hover:bg-slate-50 text-slate-800 font-bold border-slate-200 rounded-xl"
              onClick={() => setForm({fullName:"", phoneNumber:"", kebele:"", woreda:"", landSize:"", document:null})}
            >
              Clear Form
            </Button>
            <Button 
              disabled={loading}
              className="h-11 px-6 bg-primary hover:bg-primary/90 text-white font-semibold text-[13px] rounded-xl shadow-md border-0 gap-2 transition-all hover:pr-3"
              type="submit"
            >
              {loading ? "Registering..." : "Register Farmer"}
              <ArrowRight className="w-4 h-4 ml-1 opacity-90" />
            </Button>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default RegisterFarmer;

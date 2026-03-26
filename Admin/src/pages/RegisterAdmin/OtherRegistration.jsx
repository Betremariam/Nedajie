import React, { useState } from "react";
import API from "../../services/api.js";
import { 
  User, 
  PhoneCall, 
  Droplets, 
  ShieldCheck, 
  CloudUpload,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Users
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../../components/ui/Select";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Label } from "../../components/ui/Label";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/Alert";
import { Switch } from "../../components/ui/Switch";

const OtherRegistration = () => {
  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    fuelType: "",
    document: null,
  });

  const [isActive, setIsActive] = useState(true);
  const [sendAlert, setSendAlert] = useState(true);

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

  const handleSelectChange = (value) => {
    setForm({ ...form, fuelType: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("fullName", form.fullName);
    formData.append("phoneNumber", form.phoneNumber);
    formData.append("fuelType", form.fuelType);
    if(form.document) formData.append("document", form.document);

    try {
      const res = await API.post("/admins/register-other-user", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Entity registered successfully.");
      setForm({ fullName: "", phoneNumber: "", fuelType: "", document: null });
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

      <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 p-8 md:p-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-slate-100">
          <div className="flex items-center gap-5">
             <div className="w-14 h-14 rounded-[16px] bg-[#0f172a] flex items-center justify-center text-white shadow-md">
                <Users className="w-7 h-7" />
             </div>
             <div className="space-y-1">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Entity Registry</h1>
                <p className="text-slate-500 text-[13px] font-medium">Capture identity data for auxiliary consumers</p>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <Button type="button" variant="outline" className="h-10 px-6 rounded-xl text-slate-600 border-slate-200 font-semibold hover:bg-slate-50">
                Cancel
             </Button>
             <Button type="button" onClick={handleSubmit} className="h-10 px-6 rounded-xl bg-[#0d6efd] hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 font-semibold border-0">
                Register Entity
             </Button>
          </div>
        </div>

        {/* Form Body */}
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            
            {/* Full Name */}
            <div className="space-y-3">
              <Label className="text-[13px] font-bold text-slate-800 ml-0.5">Full Entity Name</Label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#0d6efd] transition-colors" />
                <Input
                  className="h-12 pl-12 rounded-xl border-slate-200 bg-slate-50/50 font-medium text-[14px] focus-visible:ring-1 focus-visible:ring-[#0d6efd] focus-visible:border-[#0d6efd] transition-all"
                  placeholder="Enter entity's full name"
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
                  <PhoneCall className="w-3.5 h-3.5 group-focus-within:text-[#0d6efd] transition-colors" />
                  <span className="text-[13px] font-medium ml-1">🇪🇹 +251</span>
                  <div className="w-px h-4 bg-slate-300 mx-1"></div>
                </div>
                <Input
                  className="h-12 pl-[100px] rounded-xl border-slate-200 bg-slate-50/50 font-medium text-[14px] focus-visible:ring-1 focus-visible:ring-[#0d6efd] focus-visible:border-[#0d6efd] transition-all"
                  placeholder="Enter phone number"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Fuel Type */}
            <div className="space-y-3 md:col-span-2">
              <Label className="text-[13px] font-bold text-slate-800 ml-0.5 flex items-center gap-2">
                <Droplets className="w-4 h-4 text-[#0d6efd]" /> 
                Resource Priority [Fuel Type]
              </Label>
              <Select value={form.fuelType} onValueChange={handleSelectChange} required>
                <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50/50 font-medium text-[14px] focus:ring-1 focus:ring-[#0d6efd] focus:border-[#0d6efd] transition-all">
                  <SelectValue placeholder="Select required resource" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-slate-200 bg-white shadow-lg">
                  <SelectItem value="benzene" className="font-medium text-slate-700 focus:bg-slate-50 py-2.5">Benzene</SelectItem>
                  <SelectItem value="diesel" className="font-medium text-slate-700 focus:bg-slate-50 py-2.5">Diesel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Document Upload */}
            <div className="space-y-3 md:col-span-2">
              <Label className="text-[13px] font-bold text-slate-800 ml-0.5">Validation Credentials</Label>
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
                  className="flex flex-col items-center justify-center p-8 rounded-2xl border-[1.5px] border-dashed border-slate-300 bg-slate-50/50 hover:border-[#0d6efd] hover:bg-[#eff6ff] transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center bg-white group-hover:border-[#0d6efd] mb-4">
                     <CloudUpload className="w-6 h-6 text-slate-400 group-hover:text-[#0d6efd] transition-colors" />
                  </div>
                  <span className="text-[14px] font-bold text-slate-800 mb-1">
                    {form.document ? form.document.name : "Upload validation doc"}
                  </span>
                  <span className="text-[12px] text-slate-500 font-medium mb-4">PDF or image, max 5MB</span>
                  
                  <div className="bg-[#0d6efd] hover:bg-blue-700 text-white text-[12px] font-bold px-5 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer">
                    Browse Files
                  </div>
                </Label>
              </div>
            </div>
            
          </div>

          {/* Bottom Verification Section */}
          <div className="pt-8 pb-4 border-t border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
             <div className="flex flex-col gap-6 w-full max-w-lg">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-slate-600" />
                  <h3 className="text-[14px] font-bold text-slate-800">Authorization Status</h3>
                </div>
                <div className="flex flex-col sm:flex-row gap-8 pl-1">
                  {/* Toggle 1 */}
                  <div className="flex items-start gap-3">
                    <Switch id="active-entity" checked={isActive} onCheckedChange={setIsActive} className="mt-1 data-[state=checked]:bg-emerald-500" />
                    <div className="flex flex-col gap-1 text-left">
                       <Label htmlFor="active-entity" className="text-[13px] font-semibold text-slate-800 cursor-pointer">Active profile</Label>
                       <span className="text-[11px] text-slate-500 font-medium leading-tight max-w-[160px]">Entity is eligible to receive allocation</span>
                    </div>
                  </div>
                  {/* Toggle 2 */}
                  <div className="flex items-start gap-3">
                    <Switch id="creds-alert" checked={sendAlert} onCheckedChange={setSendAlert} className="mt-1 data-[state=checked]:bg-[#0d6efd]" />
                    <div className="flex flex-col gap-1 text-left">
                       <Label htmlFor="creds-alert" className="text-[13px] font-semibold text-slate-800 cursor-pointer">Instant alert</Label>
                       <span className="text-[11px] text-slate-500 font-medium leading-tight max-w-[160px]">Notify entity on successful approval</span>
                    </div>
                  </div>
                </div>
             </div>
             
             {/* Right Action Buttons */}
             <div className="flex flex-col gap-3 min-w-[200px]">
               <Button 
                disabled={loading}
                className="w-full h-11 bg-[#0d6efd] hover:bg-blue-700 text-white font-semibold text-[13px] rounded-xl shadow-md border-0 gap-2 transition-all hover:pr-3"
                type="submit"
               >
                {loading ? "Registering..." : "Register Entity"}
                <ArrowRight className="w-4 h-4 ml-1 opacity-90" />
               </Button>
               <Button 
                type="button" 
                variant="outline"
                className="w-full h-11 bg-white hover:bg-slate-50 text-slate-800 font-bold border-slate-200 rounded-xl"
                onClick={() => setForm({fullName:"", phoneNumber:"", fuelType:"", document:null})}
               >
                Clear
               </Button>
             </div>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default OtherRegistration;

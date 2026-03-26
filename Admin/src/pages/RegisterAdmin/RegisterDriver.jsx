import React, { useState } from "react";
import API from "../../services/api.js";
import { 
  User, 
  PhoneCall, 
  KeyRound, 
  Car, 
  Link as LinkIcon, 
  CloudUpload, 
  ShieldCheck, 
  ArrowRight,
  BusFront,
  IdCard,
  CheckCircle2,
  AlertCircle
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
import { cn } from "../../lib/utils";

const RegisterDriver = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    carType: "",
    carPlate: "",
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
    setForm({ ...form, carType: value });
  };

  const handleGeneratePassword = () => {
    setForm({ ...form, password: Math.random().toString(36).slice(-8) });
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
    formData.append("carType", form.carType);
    formData.append("carPlate", form.carPlate);
    if(form.document) formData.append("document", form.document);

    try {
      const res = await API.post("/admins/register-driver", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(res.data.msg || "Driver registered successfully.");
      setForm({
        name: "",
        phone: "",
        password: "",
        carType: "",
        carPlate: "",
        document: null,
      });
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
                <Car className="w-7 h-7" />
             </div>
             <div className="space-y-1">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Driver Registry</h1>
                <p className="text-slate-500 text-[13px] font-medium">Map driver identities to assigned assets</p>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <Button type="button" variant="outline" className="h-10 px-6 rounded-xl text-slate-600 border-slate-200 font-semibold hover:bg-slate-50">
                Cancel
             </Button>
             <Button type="button" onClick={handleSubmit} className="h-10 px-6 rounded-xl bg-[#0d6efd] hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 font-semibold border-0">
                Register Driver
             </Button>
          </div>
        </div>

        {/* Form Body */}
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            
            {/* Full Name */}
            <div className="space-y-3">
              <Label className="text-[13px] font-bold text-slate-800 ml-0.5">Full Name</Label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#0d6efd] transition-colors" />
                <Input
                  className="h-12 pl-12 rounded-xl border-slate-200 bg-slate-50/50 font-medium text-[14px] focus-visible:ring-1 focus-visible:ring-[#0d6efd] focus-visible:border-[#0d6efd] transition-all"
                  placeholder="Enter driver's full name"
                  name="name"
                  value={form.name}
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
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Passcode */}
            <div className="space-y-3">
              <Label className="text-[13px] font-bold text-slate-800 ml-0.5">Passcode</Label>
              <div className="relative group">
                <Input
                  className="h-12 pl-4 pr-32 rounded-xl border-slate-200 bg-slate-50/50 font-black text-xl tracking-[0.3em] text-slate-600 focus-visible:ring-1 focus-visible:ring-[#0d6efd] focus-visible:border-[#0d6efd] transition-all"
                  placeholder="••••••••"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button 
                  type="button" 
                  onClick={handleGeneratePassword}
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-[#eff6ff] text-[#0d6efd] hover:bg-blue-100 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-colors"
                >
                  <KeyRound className="w-3.5 h-3.5" /> Generate
                </button>
              </div>
            </div>

            {/* Asset Class */}
            <div className="space-y-3">
              <Label className="text-[13px] font-bold text-slate-800 ml-0.5 flex items-center gap-2">
                <BusFront className="w-4 h-4 text-[#0d6efd]" /> 
                Asset Class
              </Label>
              <Select value={form.carType} onValueChange={handleSelectChange} required>
                <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50/50 font-medium text-[14px] transition-all">
                  <SelectValue placeholder="Select asset class" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100 shadow-xl bg-white">
                  <SelectItem value="bajaj" className="font-medium py-2.5">Light Transport (Bajaj)</SelectItem>
                  <SelectItem value="taxi" className="font-medium py-2.5">Public Transit (Taxi)</SelectItem>
                  <SelectItem value="heavy" className="font-medium py-2.5">Heavy Freight</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* License Plate */}
            <div className="space-y-3">
              <Label className="text-[13px] font-bold text-slate-800 ml-0.5 flex items-center gap-2">
                <IdCard className="w-4 h-4 text-[#0d6efd]" /> 
                License Plate
              </Label>
              <div className="relative group">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#0d6efd] transition-colors" />
                <Input
                  className="h-12 pl-11 pr-24 rounded-xl border-slate-200 bg-slate-50/50 font-medium text-[14px] focus-visible:ring-1 focus-visible:ring-[#0d6efd] focus-visible:border-[#0d6efd] transition-all uppercase"
                  placeholder="Enter plate number"
                  name="carPlate"
                  value={form.carPlate}
                  onChange={handleChange}
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-medium text-slate-400 pointer-events-none">e.g., AA-12345</span>
              </div>
            </div>

            {/* Driver License Upload */}
            <div className="space-y-3">
              <Label className="text-[13px] font-bold text-slate-800 ml-0.5">Driver License</Label>
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
                  className="flex items-center justify-between p-4 rounded-xl border-[1.5px] border-dashed border-slate-300 bg-white hover:border-[#0d6efd] hover:bg-[#eff6ff] transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center bg-white group-hover:border-[#0d6efd]">
                       <CloudUpload className="w-5 h-5 text-slate-400 group-hover:text-[#0d6efd] transition-colors" />
                     </div>
                     <div className="flex flex-col">
                       <span className="text-[13px] font-bold text-slate-800 mb-0.5 truncate max-w-[150px]">
                         {form.document ? form.document.name : "Upload license"}
                       </span>
                       <span className="text-[11px] text-slate-500 font-medium">PDF or image, max 5MB</span>
                     </div>
                  </div>
                  <div className="bg-[#0d6efd] hover:bg-blue-700 text-white text-[12px] font-bold px-4 py-2 rounded-lg shadow-sm transition-colors cursor-pointer">
                    Upload File
                  </div>
                </Label>
              </div>
            </div>
            
          </div>

          {/* Bottom Driver Status Section */}
          <div className="pt-8 pb-4 border-t border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
             <div className="flex flex-col gap-6 w-full max-w-lg">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-slate-600" />
                  <h3 className="text-[14px] font-bold text-slate-800">Driver Status</h3>
                </div>
                <div className="flex flex-col sm:flex-row gap-8 pl-1">
                  {/* Toggle 1 */}
                  <div className="flex items-start gap-3">
                    <Switch id="active-driver" checked={isActive} onCheckedChange={setIsActive} className="mt-1 data-[state=checked]:bg-emerald-500" />
                    <div className="flex flex-col gap-1 text-left">
                       <Label htmlFor="active-driver" className="text-[13px] font-semibold text-slate-800 cursor-pointer">Active driver</Label>
                       <span className="text-[11px] text-slate-500 font-medium leading-tight max-w-[160px]">Driver can be assigned to assets</span>
                    </div>
                  </div>
                  {/* Toggle 2 */}
                  <div className="flex items-start gap-3">
                    <Switch id="creds-alert" checked={sendAlert} onCheckedChange={setSendAlert} className="mt-1 data-[state=checked]:bg-[#0d6efd]" />
                    <div className="flex flex-col gap-1 text-left">
                       <Label htmlFor="creds-alert" className="text-[13px] font-semibold text-slate-800 cursor-pointer">Credentials alert</Label>
                       <span className="text-[11px] text-slate-500 font-medium leading-tight max-w-[160px]">Email/SMS invite driver to download credentials</span>
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
                {loading ? "Registering..." : "Register Driver"}
                <ArrowRight className="w-4 h-4 ml-1 opacity-90" />
               </Button>
               <Button 
                type="button" 
                variant="outline"
                className="w-full h-11 bg-white hover:bg-slate-50 text-slate-800 font-bold border-slate-200 rounded-xl"
                onClick={() => setForm({name:"", phone:"", password:"", carType:"", carPlate:"", document:null})}
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

export default RegisterDriver;

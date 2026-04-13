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
  AlertCircle,
  Fuel,
  Ship,
  Truck,
  Bike
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

const RegisterVehicle = () => {
  const [form, setForm] = useState({
    ownerName: "",
    phone: "",
    password: "",
    vehicleType: "",
    carPlate: "",
    fullCapacity: "",
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
    setForm({ ...form, vehicleType: value });
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
    formData.append("ownerName", form.ownerName);
    formData.append("phone", form.phone);
    formData.append("password", form.password);
    formData.append("vehicleType", form.vehicleType);
    formData.append("carPlate", form.carPlate);
    formData.append("fullCapacity", form.fullCapacity);
    if(form.document) formData.append("document", form.document);

    try {
      const res = await API.post("/admins/register-vehicle", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(res.data.msg || "Vehicle registered successfully.");
      setForm({
        ownerName: "",
        phone: "",
        password: "",
        vehicleType: "",
        carPlate: "",
        fullCapacity: "",
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

      <div className="bg-card rounded-[24px] shadow-sm border border-border p-8 md:p-10 transition-colors">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-border">
          <div className="flex items-center gap-5">
             <div className="w-14 h-14 rounded-[16px] bg-primary flex items-center justify-center text-primary-foreground shadow-md">
                <Car className="w-7 h-7" />
             </div>
             <div className="space-y-1">
                <h1 className="text-2xl font-bold text-foreground tracking-tight">Vehicle Registry</h1>
                <p className="text-muted-foreground text-[13px] font-medium">Map vehicle identities to capacity-based quotas</p>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <Button type="button" variant="outline" className="h-10 px-6 rounded-xl text-slate-600 border-slate-200 font-semibold hover:bg-slate-50">
                Cancel
             </Button>
             <Button type="button" onClick={handleSubmit} className="h-10 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20 font-semibold border-0">
                Register Vehicle
             </Button>
          </div>
        </div>

        {/* Form Body */}
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            
            {/* Owner Name */}
            <div className="space-y-3">
              <Label className="text-[13px] font-bold text-foreground/80 ml-0.5">Owner / Organization Name</Label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  className="h-12 pl-12 rounded-xl border-slate-200 bg-slate-50/50 font-medium text-[14px] focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all"
                  placeholder="Enter owner's full name"
                  name="ownerName"
                  value={form.ownerName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-3">
              <Label className="text-[13px] font-bold text-foreground/80 ml-0.5">Contact Phone</Label>
              <div className="relative group flex items-center">
                <div className="absolute left-4 flex items-center gap-2 text-muted-foreground">
                  <PhoneCall className="w-3.5 h-3.5 group-focus-within:text-primary transition-colors" />
                  <span className="text-[13px] font-medium ml-1">🇪🇹 +251</span>
                  <div className="w-px h-4 bg-border mx-1"></div>
                </div>
                <Input
                  className="h-12 pl-[100px] rounded-xl border-border bg-muted/30 font-medium text-[14px] focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all text-foreground"
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
              <Label className="text-[13px] font-bold text-slate-800 ml-0.5">QR Login Passcode</Label>
              <div className="relative group">
                <Input
                  className="h-12 pl-4 pr-32 rounded-xl border-slate-200 bg-slate-50/50 font-black text-xl tracking-[0.3em] text-slate-600 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all"
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
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-colors"
                >
                  <KeyRound className="w-3.5 h-3.5" /> Generate
                </button>
              </div>
            </div>

            {/* Vehicle Type */}
            <div className="space-y-3">
              <Label className="text-[13px] font-bold text-foreground/80 ml-0.5 flex items-center gap-2">
                <BusFront className="w-4 h-4 text-primary" /> 
                Vehicle Type
              </Label>
              <Select value={form.vehicleType} onValueChange={handleSelectChange} required>
                <SelectTrigger className="h-12 rounded-xl border-border bg-muted/30 font-medium text-[14px] transition-all text-foreground">
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border shadow-xl bg-card">
                  <SelectItem value="bajaj" className="font-medium py-2.5">Light Transport (Bajaj)</SelectItem>
                  <SelectItem value="taxi" className="font-medium py-2.5">Public Transit (Taxi)</SelectItem>
                  <SelectItem value="car" className="font-medium py-2.5">Private Car</SelectItem>
                  <SelectItem value="motorcycle" className="font-medium py-2.5">Motorcycle</SelectItem>
                  <SelectItem value="bus" className="font-medium py-2.5">Bus</SelectItem>
                  <SelectItem value="truck" className="font-medium py-2.5">Truck / Freight</SelectItem>
                  <SelectItem value="heavy" className="font-medium py-2.5">Heavy Machinery</SelectItem>
                  <SelectItem value="boat" className="font-medium py-2.5">Boat / Marine</SelectItem>
                  <SelectItem value="ship" className="font-medium py-2.5">Ship / Large Vessel</SelectItem>
                  <SelectItem value="ambulance" className="font-medium py-2.5">Ambulance / Emergency</SelectItem>
                  <SelectItem value="other" className="font-medium py-2.5">Other Vehicle</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* License Plate */}
            <div className="space-y-3">
              <Label className="text-[13px] font-bold text-slate-800 ml-0.5 flex items-center gap-2">
                <IdCard className="w-4 h-4 text-primary" /> 
                License Plate / ID
              </Label>
              <div className="relative group">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                <Input
                  className="h-12 pl-11 pr-24 rounded-xl border-slate-200 bg-slate-50/50 font-medium text-[14px] focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all uppercase"
                  placeholder="Enter plate number"
                  name="carPlate"
                  value={form.carPlate}
                  onChange={handleChange}
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-medium text-slate-400 pointer-events-none uppercase">Plate No.</span>
              </div>
            </div>

            {/* Fuel Capacity */}
            <div className="space-y-3">
              <Label className="text-[13px] font-bold text-slate-800 ml-0.5 flex items-center gap-2">
                <Fuel className="w-4 h-4 text-primary" /> 
                Full Fuel Capacity (Liters)
              </Label>
              <div className="relative group">
                <Input
                  className="h-12 pl-4 pr-12 rounded-xl border-slate-200 bg-slate-50/50 font-medium text-[14px] focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all"
                  placeholder="e.g., 50"
                  type="number"
                  name="fullCapacity"
                  value={form.fullCapacity}
                  onChange={handleChange}
                  required
                  min="1"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-bold text-primary pointer-events-none">LITERS</span>
              </div>
            </div>

            {/* Document Upload */}
            <div className="space-y-3">
              <Label className="text-[13px] font-bold text-slate-800 ml-0.5">Vehicle Registration Document</Label>
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
                  className="flex items-center justify-between p-4 rounded-xl border-[1.5px] border-dashed border-border bg-muted/10 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center bg-card group-hover:border-primary">
                       <CloudUpload className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                     </div>
                     <div className="flex flex-col">
                       <span className="text-[13px] font-bold text-foreground mb-0.5 truncate max-w-[150px]">
                         {form.document ? form.document.name : "Upload registration"}
                       </span>
                       <span className="text-[11px] text-muted-foreground font-medium">PDF or image, max 5MB</span>
                     </div>
                  </div>
                  <div className="bg-primary hover:bg-primary/90 text-white text-[12px] font-bold px-4 py-2 rounded-lg shadow-sm transition-colors cursor-pointer">
                    Upload File
                  </div>
                </Label>
              </div>
            </div>
            
          </div>

          {/* Bottom Vehicle Status Section */}
          <div className="pt-8 pb-4 border-t border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
             <div className="flex flex-col gap-6 w-full max-w-lg">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-muted-foreground" />
                  <h3 className="text-[14px] font-bold text-foreground">Registration Options</h3>
                </div>
                <div className="flex flex-col sm:flex-row gap-8 pl-1">
                  {/* Toggle 1 */}
                  <div className="flex items-start gap-3">
                    <Switch id="active-vehicle" checked={isActive} onCheckedChange={setIsActive} className="mt-1 data-[state=checked]:bg-emerald-500" />
                    <div className="flex flex-col gap-1 text-left">
                       <Label htmlFor="active-vehicle" className="text-[13px] font-semibold text-foreground cursor-pointer">Immediate Active</Label>
                       <span className="text-[11px] text-muted-foreground font-medium leading-tight max-w-[160px]">Ready for fuel after approval</span>
                    </div>
                  </div>
                  {/* Toggle 2 */}
                  <div className="flex items-start gap-3">
                    <Switch id="send-noti" checked={sendAlert} onCheckedChange={setSendAlert} className="mt-1 data-[state=checked]:bg-primary" />
                    <div className="flex flex-col gap-1 text-left">
                       <Label htmlFor="send-noti" className="text-[13px] font-semibold text-foreground cursor-pointer">SMS Confirmation</Label>
                       <span className="text-[11px] text-muted-foreground font-medium leading-tight max-w-[160px]">Send credentials to owner via SMS</span>
                    </div>
                  </div>
                </div>
             </div>
             
             {/* Right Action Buttons */}
             <div className="flex flex-col gap-3 min-w-[200px]">
               <Button 
                disabled={loading}
                className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-semibold text-[13px] rounded-xl shadow-md border-0 gap-2 transition-all hover:pr-3"
                type="submit"
               >
                {loading ? "Registering..." : "Register Vehicle"}
                <ArrowRight className="w-4 h-4 ml-1 opacity-90" />
               </Button>
               <Button 
                type="button" 
                variant="outline"
                className="w-full h-11 bg-white hover:bg-slate-50 text-slate-800 font-bold border-slate-200 rounded-xl"
                onClick={() => setForm({ownerName:"", phone:"", password:"", vehicleType:"", carPlate:"", fullCapacity:"", document:null})}
               >
                Clear Form
               </Button>
             </div>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default RegisterVehicle;

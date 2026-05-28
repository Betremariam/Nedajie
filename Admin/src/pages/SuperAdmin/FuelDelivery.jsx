import React, { useState, useEffect } from "react";
import API from "../../services/api"; 
import { 
  FileUp, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Calendar,
  User,
  MapPin,
  Package,
  FileSpreadsheet,
  Droplet,
  ChevronRight,
  ShieldCheck,
  Fuel,
  ArrowRight,
  Search,
  Filter,
  BarChart3,
  Clock,
  TrendingUp,
  History,
  Activity,
  Box,
  Globe,
  Monitor
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../../components/ui/Select";
import { Badge } from "../../components/ui/Badge";
import { cn } from "../../lib/utils";
import { useTranslation } from "react-i18next";

function FuelDelivery() {
  const { t } = useTranslation();
  const [file, setFile] = useState(null);
  const [fuelType, setFuelType] = useState("");
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: null, text: "" });

  useEffect(() => {
    if (fuelType) {
      loadDeliveries();
    }
  }, [fuelType]);

  const loadDeliveries = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/admins/deliveries?fuelType=${fuelType}`);
      setDeliveries(res.data);
    } catch (err) {
      console.error("Telemetry failure:", err);
      setMessage({ type: "error", text: "Global logistics sync failed. Registry unreachable." });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !fuelType) {
      setMessage({ type: "error", text: "Integrity check failed: payload or classification missing." });
      return;
    }

    const formData = new FormData();
    formData.append("xlsx", file);
    formData.append("fuelType", fuelType);

    try {
      setLoading(true);
      setMessage({ type: null, text: "" });
      await API.post("/admins/upload-deliveries", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage({ type: "success", text: "Supply chain ledger integrated successfully." });
      setFile(null);
      setFuelType("");
      loadDeliveries();
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Import operation rejected. Data structural failure." });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await API.patch(`/admins/approve/${id}`);
      loadDeliveries(); 
    } catch (err) {
      console.error("Authorization failure:", err);
      setMessage({ type: "error", text: "Handshake rejected. Audit mismatch." });
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{t("logisticsHub")}</h1>
          <p className="text-gray-700 dark:text-gray-200 text-sm font-medium">{t("logisticsHubDesc")}</p>
        </div>
        <div className="flex items-center gap-3">
           <Badge variant="outline" className="h-8 px-4 text-[10px] font-bold gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800 uppercase tracking-widest rounded-full">
             <Globe className="w-3.5 h-3.5" />
             {deliveries.length} Tracked Dispatched
           </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Import Section */}
        <div className="lg:col-span-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800/50 overflow-hidden self-start">
          <div className="bg-gray-50/50 dark:bg-gray-900/10 border-b dark:border-gray-800 py-5 px-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <FileUp className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900 dark:text-white">Sync Ledger</h2>
                <p className="text-[9px] font-medium text-gray-800 dark:text-gray-300 uppercase tracking-widest">Import regional logistics datasets</p>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase text-gray-800 dark:text-gray-300 tracking-widest ml-1">Protocol Type</Label>
                <Select value={fuelType} onValueChange={setFuelType}>
                  <SelectTrigger className="h-11 rounded-xl bg-gray-50/50 dark:bg-gray-900/20 border-gray-100 dark:border-gray-800 font-medium focus:border-emerald-500 transition-all">
                    <SelectValue placeholder="Select Data Schema" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="diesel" className="font-medium text-sm text-gray-700">DIESEL PROTOCOL (AGO)</SelectItem>
                    <SelectItem value="benzene" className="font-medium text-sm text-gray-700">BENZENE MATRIX (PMS)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase text-gray-800 dark:text-gray-300 tracking-widest ml-1">Payload Binary (XLSX)</Label>
                <div className={cn(
                  "border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center gap-4 cursor-pointer relative group overflow-hidden bg-gray-50/20 dark:bg-gray-900/10",
                  file ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-900/20" : "border-gray-100 dark:border-gray-800 hover:border-emerald-300 hover:bg-emerald-50/10"
                )}>
                  <input
                    type="file"
                    accept=".xlsx"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  {file ? (
                    <div className="flex flex-col items-center gap-2 animate-fade-in">
                      <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md border-4 border-emerald-50 dark:border-emerald-900/50 mb-2">
                        <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <p className="text-[11px] font-bold text-emerald-800 dark:text-emerald-200 truncate max-w-[200px] uppercase tracking-tight">{file.name}</p>
                      <Badge className="bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 border-none font-bold text-[8px] tracking-widest">{(file.size / 1024).toFixed(2)} KB INTEGRITY_OK</Badge>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm border-2 border-dashed border-gray-100 dark:border-gray-800 mb-2">
                        <Upload className="h-6 w-6 text-gray-300 dark:text-gray-400 group-hover:text-emerald-500 transition-colors" />
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-800 dark:text-gray-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">Project Payload</p>
                      <span className="text-[8px] font-medium text-gray-300 dark:text-gray-400 uppercase tracking-widest">Accepts .xlsx only</span>
                    </div>
                  )}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-widest text-[10px] gap-3 shadow-sm transition-all"
                disabled={loading || !file || !fuelType}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                {loading ? "SYNCHRONIZING..." : "COMMIT TO GLOBAL LEDGER"}
              </Button>
            </div>
            <div className="bg-gray-50/20 dark:bg-gray-900/10 px-8 py-4 border-t dark:border-gray-800 text-[9px] font-bold text-gray-300 dark:text-gray-400 uppercase tracking-widest text-center">
               Protocol: Alpha-Level Data Integration
            </div>
          </form>
        </div>

        {/* Registry Table */}
        <div className="lg:col-span-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800/50 overflow-hidden">
          <div className="bg-gray-50/50 dark:bg-gray-900/10 border-b dark:border-gray-800 py-5 px-8 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <BarChart3 className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900 dark:text-white">Supply Dispatch Monitor</h2>
                <p className="text-[9px] font-medium text-gray-800 dark:text-gray-300 uppercase tracking-widest">Real-time disbursement audit stream</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative w-64 hidden md:block group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-800 group-focus-within:text-emerald-500 transition-colors" />
                <Input placeholder="Registry Scan..." className="pl-11 h-10 text-[9px] font-bold uppercase tracking-widest bg-white dark:bg-gray-900/30 border-gray-100 dark:border-gray-800 rounded-xl focus:border-emerald-500 transition-all" />
              </div>
              <Badge className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-none px-4 py-1.5 font-bold uppercase tracking-widest text-[10px] rounded-full">
                {fuelType ? fuelType.toUpperCase() + " DATASET" : "SCHEMA UNSELECTED"}
              </Badge>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/80 dark:bg-gray-900/30 border-b dark:border-gray-800">
                  <TableHead className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-800 dark:text-gray-300">Sequence</TableHead>
                  <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-gray-800 dark:text-gray-300">Stakeholder</TableHead>
                  <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-gray-800 dark:text-gray-300 text-center">FDC Hash</TableHead>
                  <TableHead className="text-right py-4 text-[10px] font-bold uppercase tracking-widest text-gray-800 dark:text-gray-300">Volume (L)</TableHead>
                  <TableHead className="text-right px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-800 dark:text-gray-300 text-center">State</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
                {deliveries.map((d, index) => (
                  <TableRow key={index} className="group hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-all duration-300">
                    <TableCell className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900 dark:text-white tracking-tight group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors uppercase">{d.date?.slice(0, 10)}</span>
                        <span className="text-[9px] font-bold text-gray-800 dark:text-gray-400 uppercase flex items-center gap-1.5 mt-0.5 tracking-widest">
                          <Clock className="h-3 w-3" /> 09:42 SYSTEM_CLOCK
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">{d.customer}</span>
                        <span className="text-[9px] font-bold text-emerald-600/40 dark:text-emerald-400/40 uppercase flex items-center gap-1.5 mt-0.5 tracking-widest">
                          <MapPin className="h-3 w-3" /> {d.region} Axis
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-5 text-center">
                      <Badge variant="outline" className="text-[9px] font-bold uppercase bg-gray-50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-200 px-3 rounded-full">#{d.fdcNo}</Badge>
                    </TableCell>
                    <TableCell className="py-5 text-right font-bold tabular-nums tracking-tight text-emerald-700 dark:text-emerald-400 text-base">
                      {d.volume.toLocaleString()}
                    </TableCell>
                    <TableCell className="px-8 py-5 text-center">
                      {d.isConfirmed ? (
                        <Badge className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-none px-4 py-1 font-bold uppercase tracking-widest text-[8px] rounded-full shadow-sm">
                           <ShieldCheck className="w-2.5 h-2.5 mr-1" /> Authorized
                        </Badge>
                      ) : (
                        <Button
                          onClick={() => handleApprove(d.id)}
                          size="sm"
                          className="h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-widest text-[9px] gap-2 shadow-sm"
                        >
                          Verify <ArrowRight className="w-3 h-3" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {deliveries.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-24 opacity-20">
                       <div className="flex flex-col items-center gap-2">
                         <Box className="w-12 h-12 text-gray-800" />
                         <p className="text-[10px] font-bold uppercase tracking-[0.4em]">
                           {fuelType ? "Resource Ledger Empty" : "Select Schema to Scan"}
                         </p>
                       </div>
                    </TableCell>
                  </TableRow>
                )}
                {loading && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-24">
                      <Loader2 className="animate-spin h-8 w-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
                      <p className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mt-4">Streaming Telemetry Registry...</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {message.text && (
        <div className={cn(
          "fixed bottom-8 right-8 z-50 w-[380px] border-2 shadow-sm rounded-2xl overflow-hidden animate-fade-in bg-white dark:bg-gray-800",
          message.type === "error" ? "border-red-500" : "border-emerald-500"
        )}>
           <div className="p-6 flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-900 shadow-lg flex-shrink-0",
                message.type === "error" ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"
              )}>
                 {message.type === "error" ? <AlertCircle className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
              </div>
              <div className="flex-1 min-w-0">
                 <h3 className={cn(
                   "text-base font-bold uppercase tracking-tight",
                   message.type === "error" ? "text-red-900 dark:text-red-400" : "text-emerald-900 dark:text-emerald-400"
                 )}>
                   {message.type === "error" ? "Transmission Error" : "Ledger Updated"}
                 </h3>
                 <p className={cn(
                   "text-xs font-medium mt-0.5",
                   message.type === "error" ? "text-red-700/70 dark:text-red-300/70" : "text-emerald-700/70 dark:text-emerald-300/70"
                 )}>
                   {message.text}
                 </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setMessage({ type: null, text: "" })} className="opacity-20 hover:opacity-100 transition-opacity">
                 X
              </Button>
           </div>
        </div>
      )}

      {/* Footer Branding */}
      <div className="flex items-center justify-center gap-8 text-[9px] font-bold text-gray-300 dark:text-gray-400 uppercase tracking-[0.3em] italic border-t border-gray-100 dark:border-gray-800 pt-10 mt-12 mb-8">
         <div className="flex items-center gap-3">
            <Monitor className="w-3.5 h-3.5" />
            Registry Integrity Verified
         </div>
         <span className="opacity-10">/</span>
         <div className="flex items-center gap-3">
            <TrendingUp className="w-3.5 h-3.5" />
            Strategic Disbursement Stable
         </div>
      </div>
    </div>
  );
}

export default FuelDelivery;

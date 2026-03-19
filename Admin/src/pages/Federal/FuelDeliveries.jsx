import React, { useState, useEffect } from "react";
import { 
  addFuelDelivery, 
  getAllFederalFuelDeliveries 
} from "../../services/api";
import { 
  Truck, 
  Calendar, 
  User, 
  MapPin, 
  Building, 
  Hash, 
  Droplets,
  PlusCircle,
  History,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight,
  Database,
  Search,
  Navigation,
  Globe
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
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/Alert";
import { Badge } from "../../components/ui/Badge";

const FuelDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    customer: "",
    destination: "",
    citter: "",
    fdcNo: "",
    volume: "",
    region: "",
    fuelType: "diesel",
  });
  const [message, setMessage] = useState({ type: null, text: "" });

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const res = await getAllFederalFuelDeliveries();
      setDeliveries(res.data);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Critical failure in retrieving logistics stream." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: null, text: "" });

    if (Object.values(formData).some(val => !val)) {
      setMessage({ type: "error", text: "Integrity check failed: All parameters are mandatory." });
      return;
    }

    try {
      setLoading(true);
      await addFuelDelivery(formData);
      setMessage({ type: "success", text: "Dispatch record committed to national ledger." });
      setFormData({
        date: "",
        customer: "",
        destination: "",
        citter: "",
        fdcNo: "",
        volume: "",
        region: "",
        fuelType: "diesel",
      });
      fetchDeliveries();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.msg || "Deployment failed. Circuit interrupted." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground italic flex items-center gap-3">
            <Database className="w-8 h-8 text-blue-600" />
            Logistic Operations
          </h1>
          <p className="text-muted-foreground text-lg mt-1">National fuel dispatch registry and strategic supply audit.</p>
        </div>
        <Badge variant="outline" className="h-fit px-4 py-2 text-xs font-black uppercase tracking-widest border-blue-200 bg-blue-50 text-blue-700">
          <Globe className="w-3.5 h-3.5 mr-2" />
          Federal Authority Layer
        </Badge>
      </div>

      {message.text && (
        <Alert variant={message.type === "error" ? "destructive" : "default"} className={message.type === "success" ? "border-emerald-500 bg-emerald-500/5 text-emerald-600" : "animate-in slide-in-from-top-4"}>
          {message.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
          <AlertTitle className="font-black uppercase tracking-widest text-[10px]">System Notification</AlertTitle>
          <AlertDescription className="font-bold">{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Entry Interface */}
        <Card className="xl:col-span-4 border-border/50 shadow-xl overflow-hidden self-start sticky top-8">
          <CardHeader className="bg-muted/30 border-b border-border/20">
            <CardTitle className="text-xl flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-blue-600" />
              New Entry
            </CardTitle>
            <CardDescription>Initiate a new fuel dispatch record.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-3 h-3 text-blue-500" /> 
                  Chronology
                </Label>
                <Input type="date" name="date" value={formData.date} onChange={handleChange} className="h-11 font-medium" required />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <User className="w-3 h-3 text-blue-500" /> 
                  Legal Recipient
                </Label>
                <Input type="text" name="customer" value={formData.customer} onChange={handleChange} placeholder="Owner / Entity Name" className="h-11 font-medium" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Building className="w-3 h-3 text-blue-500" /> 
                    Node
                  </Label>
                  <Input type="text" name="destination" value={formData.destination} onChange={handleChange} placeholder="Station A" className="h-11 text-xs" required />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Navigation className="w-3 h-3 text-blue-500" /> 
                    Sub-City
                  </Label>
                  <Input type="text" name="citter" value={formData.citter} onChange={handleChange} placeholder="District" className="h-11 text-xs" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Hash className="w-3 h-3 text-blue-500" /> 
                    Protocol ID
                  </Label>
                  <Input type="text" name="fdcNo" value={formData.fdcNo} onChange={handleChange} placeholder="FDC-0000" className="h-11 font-mono text-xs" required />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Droplets className="w-3 h-3 text-blue-500" /> 
                    Net Volume
                  </Label>
                  <Input type="number" name="volume" value={formData.volume} onChange={handleChange} placeholder="Liters" className="h-11 font-bold" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-blue-500" /> 
                  Zone / Region
                </Label>
                <Input type="text" name="region" value={formData.region} onChange={handleChange} placeholder="Jurisdiction" className="h-11" required />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Classification</Label>
                <Select value={formData.fuelType} onValueChange={(val) => handleSelectChange("fuelType", val)}>
                  <SelectTrigger className="h-11 font-bold">
                    <SelectValue placeholder="Resource Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diesel" className="font-bold">Diesel (D-2)</SelectItem>
                    <SelectItem value="benzene" className="font-bold text-blue-600">Benzene (Gasoline)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 border-t border-border/10 p-6">
              <Button type="submit" className="w-full h-12 shadow-lg shadow-blue-500/20 font-black uppercase tracking-wider text-xs" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                {loading ? "Synchronizing..." : "Commit Dispatch"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Audit Logs */}
        <Card className="xl:col-span-8 border-border/50 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/20 pb-4 mb-4 bg-muted/5">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <History className="w-5 h-5 text-blue-400" />
                Audit Stream
              </CardTitle>
              <CardDescription>Live log of national fuel distribution telemetry.</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30" />
              <Input placeholder="Filter records..." className="pl-9 h-9 w-[200px] text-xs" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading && deliveries.length === 0 ? (
              <div className="h-[500px] flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-widest animate-pulse">Syncing logistics cloud...</p>
              </div>
            ) : deliveries.length === 0 ? (
              <div className="h-[500px] flex flex-col items-center justify-center text-muted-foreground">
                <div className="w-20 h-20 bg-muted/60 rounded-full flex items-center justify-center mb-6">
                  <Truck className="w-10 h-10 opacity-10" />
                </div>
                <h3 className="text-lg font-black text-foreground uppercase tracking-tighter">Null Data State</h3>
                <p className="text-sm italic">No dispatch records detected in the current query cycle.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="pl-6 h-12 text-[10px] font-black uppercase tracking-widest">Temporal</TableHead>
                      <TableHead className="h-12 text-[10px] font-black uppercase tracking-widest">Stakeholder Node</TableHead>
                      <TableHead className="h-12 text-[10px] font-black uppercase tracking-widest">Volume</TableHead>
                      <TableHead className="h-12 text-[10px] font-black uppercase tracking-widest">Jurisdiction</TableHead>
                      <TableHead className="pr-6 text-right h-12 text-[10px] font-black uppercase tracking-widest">Protocol Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deliveries.map((d) => (
                      <TableRow key={d.id} className="group hover:bg-muted/40 transition-colors h-20 border-b border-border/30">
                        <TableCell className="pl-6">
                          <div className="flex flex-col">
                            <span className="text-xs font-black tabular-nums">{d.date?.slice(-2)}</span>
                            <span className="text-[9px] font-bold text-muted-foreground uppercase">{new Date(d.date).toLocaleString('default', { month: 'short' })}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-foreground group-hover:text-blue-600 transition-colors">{d.customer}</span>
                            <div className="flex items-center gap-1.5 mt-1">
                              <Badge variant="outline" className="text-[8px] h-3.5 px-1 bg-muted/10 font-mono tracking-tighter border-border/50 opacity-60">#{d.fdcNo}</Badge>
                              <span className="text-[10px] text-muted-foreground font-medium italic truncate max-w-[120px]">{d.destination}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1.5 font-black text-sm">
                              <span className="tabular-nums">{d.volume.toLocaleString()}</span>
                              <span className="text-[9px] font-bold text-muted-foreground uppercase">L</span>
                            </div>
                            <div className={`flex items-center gap-1 text-[9px] font-black uppercase mt-1 ${d.fuelType === 'benzene' ? 'text-blue-500' : 'text-emerald-500'}`}>
                              <Droplets className="w-2.5 h-2.5" />
                              {d.fuelType}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-foreground">{d.region}</span>
                            <span className="text-[10px] text-muted-foreground italic font-medium">{d.citter}</span>
                          </div>
                        </TableCell>
                        <TableCell className="pr-6 text-right">
                          <Badge className={cn(
                            "text-[9px] font-black uppercase tracking-tighter shadow-none px-3",
                            d.status === 'OWNER_ACCEPTED' ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                            d.status === 'SUPERADMIN_ACCEPTED' ? "bg-blue-500/10 text-blue-600 border-blue-500/20" : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          )} variant="outline">
                            {d.status.replace('_', ' ')}
                          </Badge>
                          <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-muted-foreground/60 italic font-medium">
                            Verified
                            <CheckCircle2 className="w-2.5 h-2.5" />
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
             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.1em] italic">* Automated end-to-end encryption active on all logistics data.</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default FuelDeliveries;

import React, { useState, useEffect } from "react";
import API from "../../services/api"; 
import { 
  FileUp, 
  Upload, 
  Table as TableIcon, 
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
  Fuel
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

function FuelDelivery() {
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
      console.error("Failed to fetch deliveries", err);
      setMessage({ type: "error", text: "Failed to sync delivery records." });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !fuelType) {
      setMessage({ type: "error", text: "Mandatory fields: Fuel Type and Excel Data." });
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

      setMessage({ type: "success", text: "Ledger imported successfully." });
      setFile(null);
      setFuelType("");
      loadDeliveries();
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Import operation aborted. Verify file format." });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await API.patch(`/admins/approve/${id}`);
      loadDeliveries(); 
    } catch (err) {
      console.error("Approval failed", err);
      setMessage({ type: "error", text: "Authorization request failed." });
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Supply Chain Management</h1>
          <p className="text-muted-foreground text-lg italic">Logistics synchronization and regional allocation ledger</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="h-fit px-3 py-1 gap-2 border-primary/20 bg-primary/5">
            <Fuel className="w-4 h-4 text-primary" />
            Active Depot Logs
          </Badge>
        </div>
      </div>

      {message.text && (
        <Alert variant={message.type === "error" ? "destructive" : "default"} className={message.type === "success" ? "border-emerald-500 bg-emerald-500/5 text-emerald-600" : ""}>
          {message.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
          <AlertTitle className="font-bold">{message.type === "error" ? "Operation Failed" : "Success"}</AlertTitle>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 border-border/50 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileUp className="w-5 h-5 text-primary" />
              Import Data
            </CardTitle>
            <CardDescription>Upload regional fuel disbursement spreadsheets</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="fuel-type">Resource Classification</Label>
                <Select value={fuelType} onValueChange={setFuelType}>
                  <SelectTrigger id="fuel-type" className="h-11">
                    <SelectValue placeholder="Identify Fuel Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diesel">Diesel (D-1/D-2)</SelectItem>
                    <SelectItem value="benzene">Benzene (Gasoline)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Spreadsheet Payload (.xlsx)</Label>
                <div className={`relative border-2 border-dashed rounded-xl p-8 transition-all group flex flex-col items-center justify-center gap-3 ${file ? 'border-primary bg-primary/5' : 'border-border/60 hover:border-primary/50 bg-muted/20'}`}>
                  <input
                    type="file"
                    accept=".xlsx"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    id="file-upload"
                  />
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${file ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'}`}>
                    {file ? <FileSpreadsheet className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold">{file ? file.name : "Select audit file"}</p>
                    <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest">{file ? `${(file.size / 1024).toFixed(2)} KB` : "Excel spreadsheet only"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full h-11 font-bold tracking-tight shadow-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing Bundle...
                  </>
                ) : (
                  <>
                    <ChevronRight className="mr-2 h-4 w-4" />
                    Commit Import
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card className="lg:col-span-2 border-border/50 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-border/40">
            <div>
              <CardTitle className="text-xl">Disbursement Registry</CardTitle>
              <CardDescription>
                {fuelType ? `Viewing ${fuelType} allocation logs` : "Select a classification to view historical records"}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="h-64 flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground animate-pulse">Synchronizing regional datasets...</p>
              </div>
            ) : deliveries.length === 0 ? (
              <div className="h-96 flex flex-col items-center justify-center text-muted-foreground p-8">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                  <Package className="w-10 h-10 opacity-20" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Registry Inactive</h3>
                <p className="max-w-[280px] text-center text-sm mt-2">
                  No delivery logs detected for the current filter. Finalize an import to populate the ledger.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="pl-6 text-[10px] uppercase font-bold text-muted-foreground tracking-wider h-12">Log Date</TableHead>
                      <TableHead className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider h-12">Stakeholder</TableHead>
                      <TableHead className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider h-12">FDC Protocol</TableHead>
                      <TableHead className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider h-12">Net Volume</TableHead>
                      <TableHead className="pr-6 text-right text-[10px] uppercase font-bold text-muted-foreground tracking-wider h-12">Authorization</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deliveries.map((d, index) => (
                      <TableRow key={index} className="group transition-colors h-16">
                        <TableCell className="pl-6">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-sm font-medium">{d.date?.slice(0, 10)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{d.customer}</span>
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              <MapPin className="w-2.5 h-2.5" />
                              {d.region} • {d.destination}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono text-[10px] h-5 tracking-tighter">
                            #{d.fdcNo}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 font-bold text-sm">
                            <Droplet className="w-3.5 h-3.5 text-blue-500" />
                            {d.volume.toLocaleString()} L
                          </div>
                        </TableCell>
                        <TableCell className="pr-6 text-right">
                          {d.isConfirmed ? (
                            <div className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest">
                              <ShieldCheck className="w-3 h-3" />
                              Authorized
                            </div>
                          ) : (
                            <Button
                              onClick={() => handleApprove(d.id)}
                              size="sm"
                              className="h-8 px-4 bg-primary hover:bg-primary/90 shadow-md text-[10px] font-bold uppercase tracking-widest"
                            >
                              Finalize
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default FuelDelivery;

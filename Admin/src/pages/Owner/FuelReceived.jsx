import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { 
  Fuel, 
  MapPin, 
  Calendar, 
  Droplets, 
  History,
  Search,
  Filter,
  Loader2,
  AlertCircle,
  TrendingDown,
  TrendingUp,
  Warehouse,
  ChevronRight,
  Database,
  ArrowDownToLine,
  FileText
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../../components/ui/Select";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/Alert";
import { Button } from "../../components/ui/Button";
import { useTranslation } from "react-i18next";

const FuelReceived = () => {
  const { t } = useTranslation();
  const [records, setRecords] = useState([]);
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("adminToken");

  const downloadFile = (path) => {
    if (!path) return;
    const webPath = path.replace(/\\/g, '/');
    const url = `http://localhost:5000/${webPath}`;
    window.open(url, '_blank');
  };

  const fetchStations = async () => {
    try {
      const res = await API.get("/owners/stations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStations(res.data);
    } catch (err) {
      console.error("Error fetching stations:", err);
      setError("Strategic link to stations severed.");
    }
  };

  const fetchFuelRecords = async () => {
    try {
      setLoading(true);
      setError("");
      if (!token) {
        setError("Authorization sequence failed. Re-authentication required.");
        setLoading(false);
        return;
      }
      
      const res = await API.get(
        `/owners/fuel-received`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRecords(res.data);
    } catch (err) {
      console.error("Fuel Received fetch error:", err);
      setError(err.response?.data?.msg || "Data feed corruption detected. Synchronization failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
    fetchFuelRecords();
  }, [selectedStation]);

  if (loading && records.length === 0) return (
    <div className="h-[80vh] flex flex-col items-center justify-center gap-6 font-sans">
      <div className="relative">
        <Loader2 className="h-16 w-16 animate-spin text-primary opacity-20" />
        <Database className="h-8 w-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <div className="text-center space-y-2">
        <p className="text-xl font-semibold tracking-tight">Syncing Inbound Logistics</p>
        <p className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold">Establishing secure data tunnel...</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 mb-1 text-primary">
            <ArrowDownToLine className="w-5 h-5" />
            <span className="text-[11px] font-bold tracking-wider uppercase text-primary/80">{t("assetInflowMonitor")}</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">{t("inboundLogistics")}</h1>
          <p className="text-muted-foreground text-[14px] font-medium max-w-xl">{t("auditReadyVerification")}</p>
        </div>
        
        {stations.length > 0 && (
          <div className="flex items-center gap-4 bg-card p-3 rounded-2xl border border-border shadow-sm">
            <div className="flex flex-col items-end mr-2">
              <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">{t("activeStation")}</span>
              <span className="text-xs font-semibold text-foreground">{t("operationalNodeLabel")}</span>
            </div>
            <Select value={selectedStation} onValueChange={setSelectedStation}>
              <SelectTrigger className="w-[180px] h-10 rounded-xl bg-background border border-border shadow-sm font-bold text-xs uppercase tracking-wider">
                <SelectValue placeholder="Select Node" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border shadow-md">
                <SelectItem value="all" className="font-bold text-xs">GLOBAL_FEED</SelectItem>
                {stations.map((s) => (
                  <SelectItem key={s.id} value={s.id} className="font-bold text-xs uppercase">
                    {s.stationName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive" className="border-destructive/50 bg-destructive/5 rounded-2xl">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-bold text-[11px] uppercase tracking-widest">System Protocols Violated</AlertTitle>
          <AlertDescription className="font-medium text-[13px]">{error}</AlertDescription>
        </Alert>
      )}

      {records.length === 0 && !loading ? (
        <Card className="border-dashed border-2 border-border/50 bg-muted/10 h-[50vh] flex flex-col items-center justify-center text-center p-12 rounded-[24px]">
          <div className="w-20 h-20 rounded-3xl bg-muted/50 flex items-center justify-center mb-6">
            <Warehouse className="w-10 h-10 text-muted-foreground/30" />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-muted-foreground">{t("logisticsVoid")}</h2>
          <p className="text-muted-foreground mt-2 max-w-sm font-medium">{t("noVerifiedInboundDesc")}</p>
          <Button variant="outline" onClick={() => fetchFuelRecords(selectedStation)} className="mt-8 gap-2 rounded-xl h-12 px-8 font-bold uppercase text-[11px] tracking-widest transition-all">
            <History className="w-4 h-4" />
            {t("retryTelemetry")}
          </Button>
        </Card>
      ) : (
        <Card className="border border-border shadow-sm overflow-hidden rounded-[24px]">
          <CardHeader className="bg-muted/30 border-b border-border/20 py-6 px-8 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold flex items-center gap-3">
                <History className="w-5 h-5 text-primary" />
                Transfer Ledger
              </CardTitle>
              <CardDescription className="text-[13px] font-medium">{t("immutableRecordOfReplenishments")}</CardDescription>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
               <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-bold">
                  <TrendingUp className="w-3 h-3" />
                  {t("supplyActive")}
               </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50 border-none h-14">
                    <TableHead className="pl-8 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{t("operationalNode")}</TableHead>
                    <TableHead className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground text-center">{t("fuelSpecification")}</TableHead>
                    <TableHead className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground text-right">{t("transferVolume")}</TableHead>
                    <TableHead className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground text-right">{t("timestamp")}</TableHead>
                    <TableHead className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground text-center">{t("document")}</TableHead>
                    <TableHead className="pr-8 text-right text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{t("integrity")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((rec) => (
                    <TableRow key={rec.id} className="group hover:bg-primary/5 transition-all border-b border-border/30 h-20">
                      <TableCell className="pl-8">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center transition-all duration-300">
                              <MapPin className="w-5 h-5 text-muted-foreground/60" />
                           </div>
                           <div>
                              <p className="text-[14px] font-bold group-hover:text-primary transition-colors">{rec.stationName}</p>
                              <p className="text-[11px] font-semibold text-muted-foreground tracking-tight flex items-center gap-1 uppercase">
                                 <ChevronRight className="w-3 h-3" /> {rec.city}
                              </p>
                           </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="h-7 px-3 rounded-full font-bold text-[10px] uppercase tracking-widest bg-muted/20 border-border/50 group-hover:border-primary/30 transition-colors">
                           <Droplets className="w-2.5 h-2.5 mr-1.5 text-primary" />
                           {rec.gasType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end">
                           <span className="text-lg font-bold tracking-tight tabular-nums text-foreground group-hover:text-primary transition-colors">
                              {rec.liters.toLocaleString()} <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest ml-0.5">Liters</span>
                           </span>
                           <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase tracking-tight">
                              <TrendingUp className="w-2.5 h-2.5" /> {t("verifiedPayload")}
                           </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end">
                           <span className="text-[13px] font-bold text-foreground/80 flex items-center gap-2">
                              {new Date(rec.date).toLocaleDateString()}
                              <Calendar className="w-3.5 h-3.5 text-muted-foreground/40" />
                           </span>
                           <span className="text-[11px] font-semibold text-muted-foreground/60 uppercase mt-0.5">
                              {new Date(rec.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                           </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {rec.documentPath ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-[10px] font-bold uppercase bg-transparent text-primary border-primary/20 hover:bg-primary/10 rounded-lg px-3 flex items-center justify-center m-auto"
                            onClick={() => downloadFile(rec.documentPath)}
                          >
                            <FileText className="w-3.5 h-3.5 mr-1" /> {t("view")}
                          </Button>
                        ) : (
                          <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase">N/A</span>
                        )}
                      </TableCell>
                      <TableCell className="pr-8 text-right">
                         <div className="flex flex-col items-end gap-1.5">
                            <Badge className="bg-emerald-500 hover:bg-emerald-500 text-white border-none text-[10px] font-bold py-0.5 px-2.5 uppercase shadow-sm">
                               SECURE
                            </Badge>
                            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground/40 italic">
                               Locked In Circuit
                               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
                            </div>
                         </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/5 border-t border-border/10 p-4 px-8 flex items-center justify-between">
             <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-primary/60" />
                {t("realTimeIngestionActive")} Last update: {new Date().toLocaleTimeString()}
             </p>
             <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/40">
                <span>Ref: ISO-9001:2024</span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span>Node: {selectedStation === 'all' ? 'GLOBAL' : selectedStation}</span>
             </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default FuelReceived;

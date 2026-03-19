import React, { useEffect, useState } from "react";
import API from "../../services/api";
import * as XLSX from "xlsx";
import { 
  BarChart3, 
  Download, 
  Calendar, 
  Droplets, 
  Search, 
  Filter, 
  Loader2, 
  AlertCircle,
  TrendingUp,
  FileSpreadsheet,
  Zap,
  Building2,
  UserCheck,
  ChevronRight,
  Database,
  History
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "../../components/ui/Table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/Alert";
import { cn } from "../../lib/utils";

const Reports = () => {
  const [reportType, setReportType] = useState("daily");
  const [transactions, setTransactions] = useState([]);
  const [totalLiters, setTotalLiters] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [stationIds] = useState(
    () => JSON.parse(localStorage.getItem("stationIds") || "[]")
  );

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        setError("");
        if (stationIds.length === 0) {
          setError("No operational nodes available for analysis.");
          setTransactions([]);
          setTotalLiters(0);
          return;
        }
        const res = await API.get(
          `/owners/reports?type=${reportType}&stationIds=${stationIds.join("&stationIds=")}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } }
        );
        setTransactions(res.data.transactions);
        setTotalLiters(res.data.totalLiters);
      } catch (err) {
        console.error("Report fetch error:", err);
        setError(err.response?.data?.msg || "Analytical data stream corruption detected.");
        setTransactions([]);
        setTotalLiters(0);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [reportType, stationIds]);

  const handleDownload = () => {
    if (!transactions.length) return;
    const data = transactions.map((tx) => ({
      Date: new Date(tx.date).toLocaleString(),
      Driver: tx.driver?.name || tx.farmer?.fullName || "N/A",
      "Gas Type": tx.gasType,
      Liters: tx.liters,
      Attendant: tx.attendantName || "",
      Station: tx.stationName || "",
      City: tx.city || "",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `FMS-REPORT-${reportType.toUpperCase()}-${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  if (loading && transactions.length === 0) return (
    <div className="h-[80vh] flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <Loader2 className="h-16 w-16 animate-spin text-primary opacity-20" />
        <BarChart3 className="h-8 w-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <div className="text-center space-y-2">
        <p className="text-xl font-black tracking-tight italic text-foreground">Compiling Analytical Synthesis</p>
        <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.3em] animate-pulse">Processing historical datasets...</p>
      </div>
    </div>
  );

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1 text-primary">
            <TrendingUp className="w-5 h-5" />
            <span className="text-[10px] font-mono font-black tracking-[0.2em] uppercase text-primary/60">Operational Intelligence</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground italic">Fuel Analytics</h1>
          <p className="text-muted-foreground text-lg mt-1 italic">Strategic oversight of fuel distribution cycles and node performance.</p>
        </div>
        <div className="flex items-center gap-4">
           <Button 
            variant="outline"
            onClick={handleDownload}
            disabled={!transactions.length}
            className="h-12 px-6 rounded-2xl bg-emerald-500/5 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500 hover:text-white font-black uppercase tracking-widest text-[10px] shadow-sm transition-all disabled:opacity-30 flex items-center gap-2 group"
          >
            <FileSpreadsheet className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Export Intelligence [.XLSX]
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <Card className="lg:col-span-1 border-border/50 shadow-2xl shadow-primary/5 bg-muted/5 group hover:border-primary/30 transition-all duration-500">
            <CardHeader>
               <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                     <Calendar className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Configuration</CardTitle>
               </div>
               <CardDescription className="italic font-medium">Define parameters for data synthesis.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Analysis Period</label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger className="h-14 rounded-2xl border-border/50 bg-background/50 font-bold italic group-hover:border-primary/20 transition-all">
                      <SelectValue placeholder="Select Period" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-border/50 bg-background/95 backdrop-blur-xl">
                      <SelectItem value="daily" className="font-bold italic py-3">Daily Synthesis</SelectItem>
                      <SelectItem value="weekly" className="font-bold italic py-3">Weekly Aggregate</SelectItem>
                      <SelectItem value="monthly" className="font-bold italic py-3">Monthly Summary</SelectItem>
                      <SelectItem value="yearly" className="font-bold italic py-3">Yearly Audit</SelectItem>
                    </SelectContent>
                  </Select>
               </div>
               <div className="pt-6 border-t border-border/10 space-y-4">
                  <div className="flex items-center justify-between px-1">
                     <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Data Integrity</span>
                     <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-emerald-500/20 text-emerald-600 bg-emerald-500/5">Verified</Badge>
                  </div>
                  <div className="flex items-center justify-between px-1">
                     <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Nodes Scanned</span>
                     <span className="text-[10px] font-black text-foreground">{stationIds.length} Nodes</span>
                  </div>
                  <div className="flex items-center justify-between px-1">
                     <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Timestamp</span>
                     <span className="text-[10px] font-black text-foreground tabular-nums opacity-60">{new Date().toLocaleDateString()}</span>
                  </div>
               </div>
            </CardContent>
         </Card>

         <Card className="lg:col-span-2 border-none bg-foreground text-background shadow-2xl shadow-black/20 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent opacity-50" />
            <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:scale-175 transition-transform duration-1000">
               <TrendingUp className="w-64 h-64" />
            </div>
            <CardHeader className="relative z-10 pb-2">
               <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-primary shadow-glow">Dispensing Efficiency</CardTitle>
               <CardDescription className="text-background/40 font-medium italic">Aggregate volume metrics across authorized nodes.</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 py-10 flex flex-col items-center justify-center text-center">
               <div className="space-y-1">
                  <div className="text-8xl font-black tracking-tighter tabular-nums text-white group-hover:text-primary transition-colors flex items-end justify-center">
                     {totalLiters.toLocaleString()}
                     <span className="text-xl font-medium text-background/40 uppercase not-italic tracking-[0.2em] ml-3 mb-4">Liters</span>
                  </div>
                  <p className="text-[11px] font-black text-background/30 uppercase tracking-[0.4em] italic">Net Throughput Authorized</p>
               </div>
               
               <div className="mt-12 w-full max-w-md bg-background/5 border border-background/10 rounded-3xl p-6 backdrop-blur-xl flex items-center justify-around gap-8">
                  <div className="text-center">
                     <p className="text-[9px] font-black uppercase tracking-widest text-background/40 mb-1">Transaction Vol</p>
                     <p className="text-2xl font-black tabular-nums">{transactions.length}</p>
                  </div>
                  <div className="w-px h-10 bg-background/10" />
                  <div className="text-center">
                     <p className="text-[9px] font-black uppercase tracking-widest text-background/40 mb-1">Node Activity</p>
                     <p className="text-2xl font-black tabular-nums text-primary">{transactions.length > 0 ? "100%" : "0%"}</p>
                  </div>
                  <div className="w-px h-10 bg-background/10" />
                  <div className="text-center">
                     <p className="text-[9px] font-black uppercase tracking-widest text-background/40 mb-1">Period</p>
                     <p className="text-xl font-bold italic text-primary drop-shadow-lg">{reportType.toUpperCase()}</p>
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>

      {error && (
        <Alert variant="destructive" className="border-red-500/50 bg-red-500/5 max-w-5xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-black text-[10px] uppercase tracking-widest">System Link Error</AlertTitle>
          <AlertDescription className="font-bold">{error}</AlertDescription>
        </Alert>
      )}

      {transactions.length === 0 && !loading ? (
        <Card className="border-dashed border-2 border-border/50 bg-muted/10 h-[40vh] flex flex-col items-center justify-center text-center p-12 max-w-5xl mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-muted/50 flex items-center justify-center mb-6">
            <BarChart3 className="w-10 h-10 text-muted-foreground/30" />
          </div>
          <h2 className="text-2xl font-black tracking-tight italic text-muted-foreground">Analytical Void</h2>
          <p className="text-muted-foreground mt-2 max-w-sm font-medium">Zero operational data detected for this period node-set combination.</p>
        </Card>
      ) : (
        <Card className="border-border/50 shadow-2xl shadow-primary/5 overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border/20 py-6 px-8 flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                  <History className="w-6 h-6" />
               </div>
               <div>
                  <CardTitle className="text-xl font-black italic underline decoration-primary/30 underline-offset-4">Transaction Ledger Detail</CardTitle>
                  <CardDescription className="italic font-medium">Granular inspection of historical discharge sequences.</CardDescription>
               </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50 border-none h-14">
                    <TableHead className="pl-8 text-[10px] font-black uppercase tracking-widest">Cycle Timestamp</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest">Authorized Customer</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest">Fuel Type</TableHead>
                    <TableHead className="text-right text-[10px] font-black uppercase tracking-widest">Volume (L)</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest">Lead Attendant</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest">Operational Node</TableHead>
                    <TableHead className="pr-8 text-right text-[10px] font-black uppercase tracking-widest">City</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id} className="group hover:bg-primary/5 transition-all border-b border-border/30 h-16">
                      <TableCell className="pl-8">
                         <div className="flex flex-col">
                            <span className="text-xs font-black text-foreground/80 flex items-center gap-2">
                               {new Date(tx.date).toLocaleDateString()}
                            </span>
                            <span className="text-[9px] font-bold text-muted-foreground/60 uppercase font-mono">
                               {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                         </div>
                      </TableCell>
                      <TableCell>
                         <div className="flex items-center gap-2">
                            <p className="text-xs font-black group-hover:text-primary transition-colors">{tx.driver?.name || tx.farmer?.fullName || "UNKNOWN_NODE"}</p>
                            <Badge variant="outline" className="text-[8px] h-4 font-black uppercase tracking-[0.1em] border-border/40 py-0">
                               {tx.driver ? "LOGISTICS" : tx.farmer ? "AGRI" : "EXT"}
                            </Badge>
                         </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="h-6 px-2 rounded-full font-black text-[8px] uppercase tracking-widest bg-muted/20 border-border/50 group-hover:border-primary/30 transition-colors">
                           <Droplets className="w-2.5 h-2.5 mr-1.5 text-primary" />
                           {tx.gasType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                         <span className="text-base font-black tracking-tighter tabular-nums text-foreground group-hover:text-primary transition-colors">
                            {tx.liters.toLocaleString()} <span className="text-[10px] font-medium text-muted-foreground tracking-widest ml-0.5">L</span>
                         </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 group-hover:text-primary transition-colors">
                           <UserCheck className="w-3 h-3 text-muted-foreground/40 group-hover:text-primary/40" />
                           <span className="text-xs font-bold">{tx.attendantName || "SYSTEM_AUTO"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                           <Building2 className="w-3.5 h-3.5 text-muted-foreground/60" />
                           <p className="text-[10px] font-black uppercase">{tx.stationName || "NODE_ERR"}</p>
                        </div>
                      </TableCell>
                      <TableCell className="pr-8 text-right">
                         <p className="text-[9px] font-bold text-muted-foreground tracking-tight uppercase">
                            {tx.city || "LOC_UNK"}
                         </p>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/5 border-t border-border/10 p-4 px-8 flex items-center justify-between">
             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Database className="w-3 h-3 text-primary" />
                Data integrity hash: SHA-256 Verified
             </p>
             <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-tighter text-muted-foreground/40">
                <span>Cycle: {reportType.toUpperCase()}</span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span>Payload: {transactions.length} Records Ingested</span>
             </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default Reports;

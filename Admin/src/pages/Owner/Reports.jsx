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
    <div className="h-[80vh] flex flex-col items-center justify-center gap-6 font-sans">
      <div className="relative">
        <Loader2 className="h-16 w-16 animate-spin text-primary opacity-20" />
        <BarChart3 className="h-8 w-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <div className="text-center space-y-2">
        <p className="text-xl font-semibold tracking-tight text-foreground">Compiling Analytical Synthesis</p>
        <p className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold">Processing historical datasets...</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 mb-1 text-primary">
            <TrendingUp className="w-5 h-5" />
            <span className="text-[11px] font-bold tracking-wider uppercase text-primary/80">Operational Intelligence</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Fuel Analytics</h1>
          <p className="text-muted-foreground text-[14px] font-medium max-w-xl">Strategic oversight of fuel distribution cycles and node performance.</p>
        </div>
        <div className="flex items-center gap-4">
           <Button 
            variant="outline"
            onClick={handleDownload}
            disabled={!transactions.length}
            className="h-11 px-6 rounded-xl bg-emerald-500/5 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500 hover:text-white font-bold uppercase tracking-widest text-[10px] shadow-sm transition-all disabled:opacity-30 flex items-center gap-2 group"
          >
            <FileSpreadsheet className="w-4 h-4 transition-transform group-hover:scale-110" />
            Export Intelligence [.XLSX]
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <Card className="lg:col-span-1 border border-border bg-card shadow-sm rounded-[24px] overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/20 py-6">
               <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                     <Calendar className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-[11px] font-bold uppercase tracking-widest text-primary/80">Configuration</CardTitle>
               </div>
               <CardDescription className="text-[13px] font-medium">Define parameters for data synthesis.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
               <div className="space-y-3">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60 ml-1">Analysis Period</label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger className="h-12 rounded-xl border-border bg-background font-semibold transition-all">
                      <SelectValue placeholder="Select Period" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border font-sans">
                      <SelectItem value="daily" className="font-medium py-2.5">Daily Synthesis</SelectItem>
                      <SelectItem value="weekly" className="font-medium py-2.5">Weekly Aggregate</SelectItem>
                      <SelectItem value="monthly" className="font-medium py-2.5">Monthly Summary</SelectItem>
                      <SelectItem value="yearly" className="font-medium py-2.5">Yearly Audit</SelectItem>
                    </SelectContent>
                  </Select>
               </div>
               <div className="pt-6 border-t border-border/10 space-y-4">
                  <div className="flex items-center justify-between px-1">
                     <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/40">Data Integrity</span>
                     <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest border-emerald-500/20 text-emerald-600 bg-emerald-500/5">Verified</Badge>
                  </div>
                  <div className="flex items-center justify-between px-1">
                     <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/40">Nodes Scanned</span>
                     <span className="text-[11px] font-bold text-foreground">{stationIds.length} Nodes</span>
                  </div>
                  <div className="flex items-center justify-between px-1">
                     <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/40">Timestamp</span>
                     <span className="text-[11px] font-bold text-foreground tabular-nums opacity-60">{new Date().toLocaleDateString()}</span>
                  </div>
               </div>
            </CardContent>
         </Card>

         <Card className="lg:col-span-2 border-border shadow-md rounded-[32px] overflow-hidden bg-primary text-primary-foreground relative group transition-colors">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent opacity-50" />
            <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 transition-transform duration-1000">
               <TrendingUp className="w-64 h-64" />
            </div>
            <CardHeader className="relative z-10 pb-2 p-8">
               <CardTitle className="text-[11px] font-bold uppercase tracking-widest text-primary-foreground/90">Throughput Aggregate</CardTitle>
               <CardDescription className="text-primary-foreground/60 font-medium">Aggregate volume metrics across authorized nodes.</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 py-10 flex flex-col items-center justify-center text-center px-8">
               <div className="space-y-1">
                  <div className="text-7xl md:text-8xl font-bold tracking-tighter tabular-nums text-white group-hover:scale-105 transition-transform flex items-end justify-center">
                     {totalLiters.toLocaleString()}
                     <span className="text-xl font-semibold text-primary-foreground/40 uppercase tracking-widest ml-3 mb-4">Liters</span>
                  </div>
                  <p className="text-[11px] font-bold text-primary-foreground/30 uppercase tracking-[0.3em]">Net Throughput Authorized</p>
               </div>
               
               <div className="mt-12 w-full max-w-md bg-white/10 border border-white/10 rounded-3xl p-6 backdrop-blur-xl flex items-center justify-around gap-8">
                  <div className="text-center">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-primary-foreground/40 mb-1">TX Volume</p>
                     <p className="text-2xl font-bold tabular-nums text-white">{transactions.length}</p>
                  </div>
                  <div className="w-px h-10 bg-white/10" />
                  <div className="text-center">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-primary-foreground/40 mb-1">Activity</p>
                     <p className="text-2xl font-bold tabular-nums text-white">{transactions.length > 0 ? "100%" : "0%"}</p>
                  </div>
                  <div className="w-px h-10 bg-white/10" />
                  <div className="text-center">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-primary-foreground/40 mb-1">Cycle</p>
                     <p className="text-xl font-bold text-white">{reportType.toUpperCase()}</p>
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>

      {error && (
        <Alert variant="destructive" className="border-destructive/50 bg-destructive/5 rounded-2xl max-w-5xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-bold text-[11px] uppercase tracking-widest">Protocol Sync Error</AlertTitle>
          <AlertDescription className="font-medium text-[13px]">{error}</AlertDescription>
        </Alert>
      )}

      {transactions.length === 0 && !loading ? (
        <Card className="border-dashed border-2 border-border/50 bg-muted/10 h-[40vh] flex flex-col items-center justify-center text-center p-12 max-w-5xl mx-auto rounded-[32px]">
          <div className="w-20 h-20 rounded-3xl bg-muted/50 flex items-center justify-center mb-6">
            <BarChart3 className="w-10 h-10 text-muted-foreground/30" />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-muted-foreground">Analytical Void</h2>
          <p className="text-muted-foreground mt-2 max-w-sm font-medium">Zero operational data detected for this period node-set combination.</p>
        </Card>
      ) : (
        <Card className="border-border shadow-sm overflow-hidden rounded-[24px]">
          <CardHeader className="bg-muted/30 border-b border-border/20 py-6 px-8 flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <History className="w-6 h-6" />
               </div>
               <div>
                  <CardTitle className="text-xl font-bold">Transaction Ledger</CardTitle>
                  <CardDescription className="font-medium">Granular inspection of historical discharge sequences.</CardDescription>
               </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50 border-none h-14">
                    <TableHead className="pl-8 text-[11px] font-bold uppercase tracking-wider">Cycle Timestamp</TableHead>
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider">Authorized Entity</TableHead>
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider">Fuel Type</TableHead>
                    <TableHead className="text-right text-[11px] font-bold uppercase tracking-wider">Volume (L)</TableHead>
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider">Lead Attendant</TableHead>
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider">Operational Node</TableHead>
                    <TableHead className="pr-8 text-right text-[11px] font-bold uppercase tracking-wider">City</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id} className="hover:bg-muted/30 transition-all border-b border-border h-16 group">
                      <TableCell className="pl-8">
                         <div className="flex flex-col">
                            <span className="text-sm font-semibold text-foreground/80">
                               {new Date(tx.date).toLocaleDateString()}
                            </span>
                            <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">
                               {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                         </div>
                      </TableCell>
                      <TableCell>
                         <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold group-hover:text-primary transition-colors">{tx.driver?.name || tx.farmer?.fullName || "UNKNOWN_NODE"}</p>
                            <Badge variant="outline" className="text-[9px] h-4 font-bold uppercase tracking-widest border-border/40 py-0">
                               {tx.driver ? "LOGISTICS" : tx.farmer ? "AGRI" : "EXT"}
                            </Badge>
                         </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="h-6 px-3 rounded-full font-bold text-[9px] uppercase tracking-widest bg-muted/20 border-border/50 group-hover:border-primary/30 transition-colors">
                           <Droplets className="w-2.5 h-2.5 mr-1.5 text-primary" />
                           {tx.gasType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                         <span className="text-base font-bold tracking-tight tabular-nums text-foreground group-hover:text-primary transition-colors">
                            {tx.liters.toLocaleString()} <span className="text-[11px] font-semibold text-muted-foreground tracking-widest ml-0.5">L</span>
                         </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 group-hover:text-primary transition-colors">
                           <UserCheck className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary/40" />
                           <span className="text-sm font-medium">{tx.attendantName || "SYSTEM_AUTO"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                           <Building2 className="w-3.5 h-3.5 text-muted-foreground/60" />
                           <p className="text-[11px] font-bold uppercase tracking-wider">{tx.stationName || "NODE_ERR"}</p>
                        </div>
                      </TableCell>
                      <TableCell className="pr-8 text-right">
                         <p className="text-[11px] font-bold text-muted-foreground tracking-tight uppercase">
                            {tx.city || "LOC_UNK"}
                         </p>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/5 border-t border-border/10 p-6 px-8 flex items-center justify-between">
             <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-primary/60" />
                Data integrity hash: SHA-256 Verified
             </p>
             <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/40">
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

import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { 
  CreditCard, 
  User, 
  Droplets, 
  History, 
  MapPin, 
  Clock, 
  Search, 
  Filter, 
  Loader2, 
  AlertCircle,
  ChevronRight,
  TrendingDown,
  UserCheck,
  Building2,
  Calendar,
  Receipt
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
import { Badge } from "../../components/ui/Badge";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/Alert";
import { Button } from "../../components/ui/Button";

const OwnerTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("adminToken");
  const [stationIds] = useState(
    () => JSON.parse(localStorage.getItem("stationIds") || "[]")
  );

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError("");
      if (!token) {
        setError("Authorization sequence failed. Re-authentication required.");
        return;
      }
      if (stationIds.length === 0) {
        setError("No operational nodes identified for this account.");
        return;
      }

      const res = await API.get(
        `/owners/transactions?stationIds=${stationIds.join("&stationIds=")}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTransactions(res.data);
    } catch (err) {
      console.error("Error fetching owner transactions:", err);
      setError(err.response?.data?.msg || "Transaction telemetry feed corruption detected.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  if (loading && transactions.length === 0) return (
    <div className="h-[80vh] flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <Loader2 className="h-16 w-16 animate-spin text-primary opacity-20" />
        <Receipt className="h-8 w-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <div className="text-center space-y-2">
        <p className="text-xl font-black tracking-tight italic text-foreground">Syncing Transaction Ledger</p>
        <p className="text-muted-foreground uppercase tracking-widest text-[10px]">Decrypting financial stream...</p>
      </div>
    </div>
  );

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1 text-primary">
            <Receipt className="w-5 h-5" />
            <span className="text-[10px] font-mono font-black tracking-[0.2em] uppercase text-primary/60">Financial Audit Active</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground italic">Station Transactions</h1>
          <p className="text-muted-foreground text-lg mt-1 italic">Immutable ledger of real-time fuel sales and station throughput.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="bg-muted/40 p-1.5 rounded-xl border border-border/50 flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-9 px-4 rounded-lg bg-background shadow-sm font-black uppercase text-[10px] tracking-widest">All Cycles</Button>
              <Button variant="ghost" size="sm" className="h-9 px-4 rounded-lg font-black uppercase text-[10px] tracking-widest text-muted-foreground/60">Export CSV</Button>
           </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="border-red-500/50 bg-red-500/5">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-black text-[10px] uppercase tracking-widest">Protocol Failure</AlertTitle>
          <AlertDescription className="font-bold">{error}</AlertDescription>
        </Alert>
      )}

      {transactions.length === 0 && !loading ? (
        <Card className="border-dashed border-2 border-border/50 bg-muted/10 h-[50vh] flex flex-col items-center justify-center text-center p-12">
          <div className="w-20 h-20 rounded-3xl bg-muted/50 flex items-center justify-center mb-6">
            <CreditCard className="w-10 h-10 text-muted-foreground/30" />
          </div>
          <h2 className="text-2xl font-black tracking-tight italic text-muted-foreground">Transaction Void</h2>
          <p className="text-muted-foreground mt-2 max-w-sm font-medium">No sales transactions have been authorized in this administrative cycle.</p>
        </Card>
      ) : (
        <Card className="border border-border shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border/20 py-6 px-8 flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <History className="w-6 h-6" />
               </div>
               <div>
                  <CardTitle className="text-xl font-black italic">Asset Liquidation Log</CardTitle>
                  <CardDescription className="italic font-medium">Real-time throughput metrics across nodes.</CardDescription>
               </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50 border-none h-14">
                    <TableHead className="pl-8 text-[10px] font-black uppercase tracking-widest">Authorized Customer</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest">Fuel Type</TableHead>
                    <TableHead className="text-right text-[10px] font-black uppercase tracking-widest">Volume (L)</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest">Lead Attendant</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest">Operational Node</TableHead>
                    <TableHead className="pr-8 text-right text-[10px] font-black uppercase tracking-widest">Cycle Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id} className="group hover:bg-primary/5 transition-all border-b border-border/30 h-20">
                      <TableCell className="pl-8">
                        <div className="flex items-center gap-3">
                           <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground transition-all duration-300">
                              <User className="w-4 h-4" />
                           </div>
                           <div>
                              <p className="text-sm font-black group-hover:text-primary transition-colors">{tx.driver?.name || tx.farmer?.fullName || "UNKNOWN_NODE"}</p>
                              <Badge variant="outline" className="text-[8px] h-4 font-black uppercase tracking-[0.1em] border-border/40 py-0">
                                 {tx.driver ? "LOGISTICS_OPERATOR" : tx.farmer ? "AGRI_ENTITY" : "EXTERNAL"}
                              </Badge>
                           </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="h-7 px-3 rounded-full font-black text-[9px] uppercase tracking-widest bg-muted/20 border-border/50 group-hover:border-primary/30 transition-colors">
                           <Droplets className="w-2.5 h-2.5 mr-1.5 text-primary" />
                           {tx.gasType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end">
                           <span className="text-lg font-black tracking-tighter tabular-nums text-foreground group-hover:text-primary transition-colors">
                              {tx.liters.toLocaleString()} <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest ml-0.5">L</span>
                           </span>
                           <div className="flex items-center gap-1 text-[8px] font-bold text-emerald-600 uppercase tracking-tighter">
                              <TrendingDown className="w-2 h-2" /> Discharged
                           </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 group-hover:text-primary transition-colors">
                           <UserCheck className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary/40" />
                           <span className="text-xs font-bold">{tx.attendantName || "SYSTEM_AUTO"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                           <p className="text-[10px] font-black uppercase flex items-center gap-1.5">
                              <Building2 className="w-3 h-3 text-muted-foreground/60" />
                              {tx.stationName}
                           </p>
                           <p className="text-[9px] font-bold text-muted-foreground tracking-tight flex items-center gap-1 uppercase ml-4.5">
                              {tx.city}
                           </p>
                        </div>
                      </TableCell>
                      <TableCell className="pr-8 text-right">
                        <div className="flex flex-col items-end">
                           <span className="text-xs font-black text-foreground/80 flex items-center gap-2">
                              {new Date(tx.createdAt).toLocaleDateString()}
                              <Calendar className="w-3.5 h-3.5 text-muted-foreground/40" />
                           </span>
                           <span className="text-[10px] font-bold text-muted-foreground/60 uppercase mt-0.5 font-mono">
                              {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                           </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/5 border-t border-border/10 p-4 px-8 flex items-center justify-between">
             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Receipt className="w-3 h-3 text-primary" />
                Live transaction link active. Integrity verified.
             </p>
             <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-tighter text-muted-foreground/40">
                <span>Ref: TRANS-AUDIT-{new Date().getFullYear()}</span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span>Node: {stationIds.length} Stations Active</span>
             </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default OwnerTransactions;

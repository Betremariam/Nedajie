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
  Receipt,
  ShieldCheck
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
import { useTranslation } from "react-i18next";

const OwnerTransactions = () => {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("adminToken");
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError("");
      if (!token) {
        setError("Authorization sequence failed. Re-authentication required.");
        return;
      }

      const res = await API.get(
        `/owners/transactions`,
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
    <div className="h-[80vh] flex flex-col items-center justify-center gap-6 font-sans">
      <div className="relative">
        <Loader2 className="h-16 w-16 animate-spin text-primary opacity-20" />
        <Receipt className="h-8 w-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <div className="text-center space-y-2">
        <p className="text-xl font-semibold tracking-tight text-foreground">Syncing Transaction Ledger</p>
        <p className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold">Establishing secure ledger link...</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 mb-1 text-primary">
            <Receipt className="w-5 h-5" />
            <span className="text-[11px] font-bold tracking-wider uppercase text-primary/80">{t("financialAudit")}</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">{t("stationTransactions")}</h1>
          <p className="text-muted-foreground text-[14px] font-medium max-w-xl">{t("realTimeThroughput")}</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="bg-muted/40 p-1.5 rounded-xl border border-border/50 flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-9 px-4 rounded-lg bg-background shadow-sm font-bold uppercase text-[10px] tracking-widest">{t("allCycles")}</Button>
              <Button variant="ghost" size="sm" className="h-9 px-4 rounded-lg font-bold uppercase text-[10px] tracking-widest text-muted-foreground/60 transition-colors">{t("exportCsv")}</Button>
           </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="border-destructive/50 bg-destructive/5 rounded-2xl">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-bold text-[11px] uppercase tracking-widest">Protocol Failure</AlertTitle>
          <AlertDescription className="font-medium text-[13px]">{error}</AlertDescription>
        </Alert>
      )}

      {transactions.length === 0 && !loading ? (
        <Card className="border-dashed border-2 border-border/50 bg-muted/10 h-[50vh] flex flex-col items-center justify-center text-center p-12 rounded-[24px]">
          <div className="w-20 h-20 rounded-3xl bg-muted/50 flex items-center justify-center mb-6">
            <CreditCard className="w-10 h-10 text-muted-foreground/30" />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-muted-foreground">{t("transactionVoid")}</h2>
          <p className="text-muted-foreground mt-2 max-w-sm font-medium">{t("noSalesTransactionsDesc")}</p>
        </Card>
      ) : (
        <Card className="border border-border shadow-sm overflow-hidden rounded-[24px]">
          <CardHeader className="bg-muted/30 border-b border-border/20 py-6 px-8 flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <History className="w-6 h-6" />
               </div>
               <div>
                  <CardTitle className="text-xl font-semibold">{t("assetLiquidationLog")}</CardTitle>
                  <CardDescription className="text-[13px] font-medium">{t("realTimeThroughput")}</CardDescription>
               </div>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
               <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-bold">
                  <ShieldCheck className="w-3 h-3" />
                  Secured
               </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50 border-none h-14">
                    <TableHead className="pl-8 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{t("authorizedCustomer")}</TableHead>
                    <TableHead className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground text-center">{t("customerType")}</TableHead>
                    <TableHead className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{t("phoneNumber")}</TableHead>
                    <TableHead className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground text-center">Type</TableHead>
                    <TableHead className="text-right text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{t("volume")}</TableHead>
                    <TableHead className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{t("leadAttendant")}</TableHead>
                    <TableHead className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{t("operationalNode")}</TableHead>
                    <TableHead className="pr-8 text-right text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{t("cycleTimestamp")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id} className="group hover:bg-primary/5 transition-all border-b border-border/30 h-20">
                      <TableCell className="pl-8">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground/60 transition-all duration-300">
                              <User className="w-5 h-5" />
                           </div>
                           <div>
                              <p className="text-[14px] font-bold group-hover:text-primary transition-colors">{tx.consumerName}</p>
                           </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="text-[9px] h-4 font-bold uppercase tracking-widest border-border/40 py-0">
                          {t(`${tx.customerType}TypeLabel`)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[12px] font-medium text-muted-foreground">
                        {tx.phoneNumber}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="h-7 px-3 rounded-full font-bold text-[10px] uppercase tracking-widest bg-muted/20 border-border/50 group-hover:border-primary/30 transition-colors">
                           <Droplets className="w-2.5 h-2.5 mr-1.5 text-primary" />
                           {tx.gasType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end">
                           <span className="text-base font-bold tracking-tight tabular-nums text-foreground group-hover:text-primary transition-colors">
                              {tx.liters.toLocaleString()} <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest ml-0.5">Liters</span>
                           </span>
                           <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 uppercase tracking-tight">
                              <TrendingDown className="w-2.5 h-2.5" /> Discharged
                           </div>
                        </div>
                      </TableCell>
                      <TableCell>
                         <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-[13px] font-semibold text-foreground/80">{tx.attendantName || "SYS_AUTO"}</span>
                         </div>
                      </TableCell>
                      <TableCell>
                         <div className="flex flex-col">
                            <span className="text-[13px] font-bold text-foreground group-hover:text-primary transition-colors">{tx.stationName}</span>
                            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-tight flex items-center gap-1">
                               <MapPin className="w-3 h-3" /> {tx.city}
                            </span>
                         </div>
                      </TableCell>
                      <TableCell className="pr-8 text-right">
                        <div className="flex flex-col items-end">
                          <span className="text-[13px] font-bold text-foreground/80 flex items-center gap-2">
                             {new Date(tx.createdAt).toLocaleDateString()}
                             <Calendar className="w-3.5 h-3.5 text-muted-foreground/40" />
                          </span>
                          <span className="text-[11px] font-semibold text-muted-foreground/60 uppercase mt-0.5">
                             {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-primary/60" />
                {t("ledgerSyncedWithNodes")}
             </p>
             <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
                <span>ISO-27001</span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span>Operational Aggregate Identified</span>
             </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default OwnerTransactions;

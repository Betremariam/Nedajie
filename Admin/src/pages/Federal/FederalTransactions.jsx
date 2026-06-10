import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { 
  Receipt, 
  Search, 
  Droplet, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Calendar,
  Clock,
  User,
  Fuel,
  MapPin,
  History,
  Filter,
  X,
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
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/Select";
import { useTranslation } from "react-i18next";

const FederalTransactions = () => {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFuelType, setSelectedFuelType] = useState("all");
  const [selectedStation, setSelectedStation] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  
  // Get unique values for filters
  const stations = [...new Set(transactions.map(t => t.stationName))].sort();
  const regions = [...new Set(transactions.map(t => t.region).filter(Boolean))].sort();

  const fetchTransactions = async () => {
    try {
      const res = await API.get("/admins/transactions");
      setTransactions(res.data);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Apply filters whenever filter states or transactions change
  useEffect(() => {
    let filtered = [...transactions];

    // Search filter (consumer name, station, attendant, phone)
    if (searchTerm) {
      filtered = filtered.filter(tx => 
        (tx.consumerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tx.phoneNumber || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.stationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tx.attendantName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        t(`${tx.customerType}TypeLabel`).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Fuel type filter
    if (selectedFuelType !== "all") {
      filtered = filtered.filter(tx => tx.gasType === selectedFuelType);
    }

    // Station filter
    if (selectedStation !== "all") {
      filtered = filtered.filter(tx => tx.stationName === selectedStation);
    }

    // Region filter
    if (selectedRegion !== "all") {
      filtered = filtered.filter(tx => tx.region === selectedRegion);
    }

    // Date range filter
    if (dateFrom) {
      filtered = filtered.filter(tx => new Date(tx.createdAt) >= new Date(dateFrom));
    }
    if (dateTo) {
      const endDate = new Date(dateTo);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(tx => new Date(tx.createdAt) <= endDate);
    }

    setFilteredTransactions(filtered);
  }, [transactions, searchTerm, selectedFuelType, selectedStation, selectedRegion, dateFrom, dateTo, t]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedFuelType("all");
    setSelectedStation("all");
    setSelectedRegion("all");
    setDateFrom("");
    setDateTo("");
  };

  if (loading) return (
    <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-muted-foreground animate-pulse font-medium">{t("reconstructingLedger")}</p>
    </div>
  );

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Globe className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">{t("nationalTransactionLedger")}</h1>
          </div>
          <p className="text-muted-foreground text-lg">{t("nationalTransactionLedgerDesc")}</p>
        </div>
        <Badge variant="outline" className="h-fit px-4 py-1.5 text-sm gap-2 bg-primary/5 border-primary/20 text-primary">
          <History className="w-4 h-4" />
          {filteredTransactions.length} of {transactions.length} Records
        </Badge>
      </div>

      {/* Filters Section */}
      <Card className="border-border/50 shadow-sm transition-all hover:shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">{t("auditInquiryFilters")}</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {/* Search */}
            <div className="xl:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={t("searchAuditPrompt")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11 rounded-xl border-border/60 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Fuel Type */}
            <div>
              <Select value={selectedFuelType} onValueChange={setSelectedFuelType}>
                <SelectTrigger className="h-11 rounded-xl border-border/60">
                  <SelectValue placeholder={t("fuelType")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allFuelTypes")}</SelectItem>
                  <SelectItem value="benzene">{t("benzene")}</SelectItem>
                  <SelectItem value="diesel">{t("diesel")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Station */}
            <div>
              <Select value={selectedStation} onValueChange={setSelectedStation}>
                <SelectTrigger className="h-11 rounded-xl border-border/60">
                  <SelectValue placeholder={t("station")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allStations")}</SelectItem>
                  {stations.map(station => (
                    <SelectItem key={station} value={station}>{station}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Region */}
            <div>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="h-11 rounded-xl border-border/60">
                  <SelectValue placeholder={t("region")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allRegions")}</SelectItem>
                  {regions.map(region => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date From */}
            <div className="relative group">
               <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
               <Input
                 type="date"
                 value={dateFrom}
                 onChange={(e) => setDateFrom(e.target.value)}
                 className="h-11 rounded-xl pl-10 border-border/60 focus:ring-primary/20"
               />
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-between mt-4 pt-4 border-t border-border/30 gap-4">
             <div className="flex items-center gap-4">
               {/* Date To logic integrated below if needed or just show second input */}
               <div className="relative group">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="h-11 rounded-xl pl-10 border-border/60 focus:ring-primary/20"
                  />
               </div>
             </div>

             {(searchTerm || selectedFuelType !== "all" || selectedStation !== "all" || selectedRegion !== "all" || dateFrom || dateTo) && (
               <Button
                 variant="ghost"
                 size="sm"
                 onClick={clearFilters}
                 className="gap-2 text-destructive hover:bg-destructive/5 rounded-xl font-bold uppercase text-[10px] tracking-widest"
               >
                 <X className="w-3 h-3" />
                 {t("clearAuditFilters")}
               </Button>
             )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-sm overflow-hidden rounded-[24px]">
        <CardHeader className="bg-primary/5 border-b border-primary/10 py-6 px-8 flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <Receipt className="w-6 h-6" />
               </div>
               <div>
                  <CardTitle className="text-xl font-bold tracking-tight">{t("nationalSalesAudit")}</CardTitle>
                  <CardDescription className="text-sm font-medium">{t("nationalSalesAuditDesc")}</CardDescription>
               </div>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
               Live Network
            </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent bg-muted/30 border-none h-14">
                  <TableHead className="pl-8 uppercase text-[10px] font-black tracking-widest text-muted-foreground/70">{t("authorizedCustomer")}</TableHead>
                  <TableHead className="uppercase text-[10px] font-black tracking-widest text-muted-foreground/70 text-center">{t("customerType")}</TableHead>
                  <TableHead className="uppercase text-[10px] font-black tracking-widest text-muted-foreground/70">{t("phoneNumber")}</TableHead>
                  <TableHead className="uppercase text-[10px] font-black tracking-widest text-muted-foreground/70">{t("product")}</TableHead>
                  <TableHead className="uppercase text-[10px] font-black tracking-widest text-muted-foreground/70">{t("volume")}</TableHead>
                  <TableHead className="uppercase text-[10px] font-black tracking-widest text-muted-foreground/70">{t("leadAttendant")}</TableHead>
                  <TableHead className="uppercase text-[10px] font-black tracking-widest text-muted-foreground/70">{t("operationalNode")}</TableHead>
                  <TableHead className="pr-8 text-right uppercase text-[10px] font-black tracking-widest text-muted-foreground/70">{t("timestamp")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-72 text-center p-0">
                      <div className="flex flex-col items-center justify-center h-full bg-muted/5 gap-4">
                        <div className="w-20 h-20 bg-muted/30 rounded-3xl flex items-center justify-center animate-pulse">
                          <Receipt className="w-10 h-10 opacity-10" />
                        </div>
                        <div className="space-y-1">
                           <p className="text-xl font-bold tracking-tight text-foreground/40 font-mono">
                             {transactions.length === 0 ? "NULL_DISBURSEMENT_STATE" : "FILTER_EXCLUSION_ACTIVE"}
                           </p>
                           <p className="text-sm text-muted-foreground font-medium max-w-xs mx-auto">
                             {transactions.length === 0 
                               ? "No fuel disbursement records detected in the national synchronization cycle."
                               : "The current query parameters yielded no matching audit entries."}
                           </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((tx) => (
                    <TableRow key={tx.id} className="group transition-all hover:bg-primary/[0.03] border-b border-border/40 h-20">
                      <TableCell className="pl-8">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center border border-border group-hover:border-primary/30 transition-colors">
                            <User className="w-5 h-5 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-[14px] text-foreground group-hover:text-primary transition-colors">
                              {tx.consumerName}
                            </span>
                            <span className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest">
                               UID: {tx.id.slice(-6)}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="text-[9px] h-5 font-black uppercase tracking-widest bg-muted/40 text-muted-foreground/80 border-none group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          {t(`${tx.customerType}TypeLabel`)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[12px] font-semibold text-muted-foreground group-hover:text-foreground transition-colors tabular-nums">
                        {tx.phoneNumber}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`capitalize text-[10px] h-7 px-3 rounded-full gap-2 border-border/60 transition-all ${
                            tx.gasType === 'benzene' 
                              ? 'bg-amber-500/5 text-amber-700 border-amber-200' 
                              : 'bg-emerald-500/5 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          <Droplet className="w-3 h-3" />
                          {tx.gasType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                           <div className="font-bold text-base tracking-tight tabular-nums text-foreground group-hover:text-primary transition-colors">
                             {tx.liters.toLocaleString()} <span className="text-[10px] font-semibold text-muted-foreground uppercase opacity-60 ml-0.5">Liters</span>
                           </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 group-hover:animate-pulse" />
                          <span className="text-[13px] font-bold text-foreground/80">
                            {tx.attendantName || "SYS_AUTO"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5 text-[13px] font-bold text-foreground">
                            {tx.stationName}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-tight">
                            <MapPin className="w-3 h-3 text-primary/40" />
                            {tx.region}, {tx.city}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="pr-8 text-right">
                        <div className="flex flex-col items-end">
                          <div className="flex items-center gap-2 text-[13px] font-bold text-foreground">
                            {new Date(tx.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            <Calendar className="w-3.5 h-3.5 text-muted-foreground/40" />
                          </div>
                          <div className="text-[11px] font-semibold text-muted-foreground/60 uppercase mt-0.5 tabular-nums">
                            {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FederalTransactions;

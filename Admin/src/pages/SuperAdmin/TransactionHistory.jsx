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
  X
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

const Transactions = () => {
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

    // Search filter (consumer name, station, attendant)
    if (searchTerm) {
      filtered = filtered.filter(tx => 
        (tx.driver?.name || tx.farmer?.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.stationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tx.attendantName || "").toLowerCase().includes(searchTerm.toLowerCase())
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
  }, [transactions, searchTerm, selectedFuelType, selectedStation, selectedRegion, dateFrom, dateTo]);

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
      <p className="text-muted-foreground animate-pulse font-medium">Reconstructing transaction ledger...</p>
    </div>
  );

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Transaction Ledger</h1>
          <p className="text-muted-foreground text-lg">Full historical record of fuel allocations and disbursements</p>
        </div>
        <Badge variant="outline" className="h-fit px-4 py-1.5 text-sm gap-2 bg-amber-500/5 border-amber-200 text-amber-700">
          <History className="w-4 h-4" />
          {filteredTransactions.length} of {transactions.length} Records
        </Badge>
      </div>

      {/* Filters Section */}
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm">FILTERS</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {/* Search */}
            <div className="xl:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search consumer, station, attendant..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
            </div>

            {/* Fuel Type */}
            <div>
              <Select value={selectedFuelType} onValueChange={setSelectedFuelType}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Fuel Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fuel Types</SelectItem>
                  <SelectItem value="benzene">Benzene</SelectItem>
                  <SelectItem value="diesel">Diesel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Station */}
            <div>
              <Select value={selectedStation} onValueChange={setSelectedStation}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Station" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stations</SelectItem>
                  {stations.map(station => (
                    <SelectItem key={station} value={station}>{station}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Region */}
            <div>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {regions.map(region => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date From */}
            <div>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-10"
                placeholder="From Date"
              />
            </div>

            {/* Date To */}
            <div>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="h-10"
                placeholder="To Date"
              />
            </div>

            {/* Clear Filters */}
            {(searchTerm || selectedFuelType !== "all" || selectedStation !== "all" || selectedRegion !== "all" || dateFrom || dateTo) && (
              <div className="xl:col-span-6 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/10 border-b border-border/50">
          <CardTitle className="text-xl">System-wide Sales Audit</CardTitle>
          <CardDescription>Real-time updates from all regional fuel dispensers</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent bg-muted/40">
                  <TableHead className="pl-6 h-12 uppercase text-[10px] font-bold tracking-wider">Consumer</TableHead>
                  <TableHead className="h-12 uppercase text-[10px] font-bold tracking-wider">Product</TableHead>
                  <TableHead className="h-12 uppercase text-[10px] font-bold tracking-wider">Volume</TableHead>
                  <TableHead className="h-12 uppercase text-[10px] font-bold tracking-wider">Attendant</TableHead>
                  <TableHead className="h-12 uppercase text-[10px] font-bold tracking-wider">Station / Node</TableHead>
                  <TableHead className="pr-6 h-12 text-right uppercase text-[10px] font-bold tracking-wider">Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground gap-3">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                          <Receipt className="w-8 h-8 opacity-20" />
                        </div>
                        <p className="text-lg font-medium font-mono tracking-tighter">
                          {transactions.length === 0 ? "NULL_TRANSACTION_STATE" : "NO_MATCHES_FOUND"}
                        </p>
                        <p className="text-sm">
                          {transactions.length === 0 
                            ? "No disbursement logs found in current audit cycle"
                            : "No transactions match your filter criteria"}
                        </p>
                        {transactions.length > 0 && (
                          <Button variant="outline" size="sm" onClick={clearFilters} className="mt-2">
                            Clear Filters
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((tx) => (
                    <TableRow key={tx.id} className="group transition-colors hover:bg-muted/30">
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 dark:bg-primary/30 rounded-md flex items-center justify-center border border-primary/20 dark:border-primary/80">
                            <span className="text-primary dark:text-primary font-bold text-xs">
                              {(tx.driver?.name || tx.farmer?.fullName)?.charAt(0) || 'C'}
                            </span>
                          </div>
                          <div className="font-semibold text-sm">
                            {tx.driver?.name || tx.farmer?.fullName || "Private Consumer"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`capitalize text-[10px] h-5 gap-1 ${
                            tx.gasType === 'benzene' 
                              ? 'border-primary text-primary' 
                              : 'border-emerald-500 text-emerald-600'
                          }`}
                        >
                          <Droplet className="w-2.5 h-2.5" />
                          {tx.gasType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-mono font-black text-foreground">
                          {tx.liters.toLocaleString()} <span className="text-[10px] font-normal text-muted-foreground">L</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <User className="w-3 h-3" />
                          {tx.attendantName || "System_Auto"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1 text-xs font-bold text-foreground">
                            <Fuel className="w-3 h-3 text-primary" />
                            {tx.stationName}
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground ml-4">
                            <MapPin className="w-2.5 h-2.5" />
                            {tx.city}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <div className="flex flex-col items-end">
                          <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                            <Calendar className="w-3 h-3 text-muted-foreground" />
                            {new Date(tx.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                            <Clock className="w-2.5 h-2.5" />
                            {new Date(tx.createdAt).toLocaleTimeString(undefined, { timeStyle: 'short' })}
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

export default Transactions;

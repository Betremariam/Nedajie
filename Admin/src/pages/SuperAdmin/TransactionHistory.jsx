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
  History
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

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

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
          {transactions.length} Total Records
        </Badge>
      </div>

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
                {transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground gap-3">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                          <Receipt className="w-8 h-8 opacity-20" />
                        </div>
                        <p className="text-lg font-medium font-mono tracking-tighter">NULL_TRANSACTION_STATE</p>
                        <p className="text-sm">No disbursement logs found in current audit cycle</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((tx) => (
                    <TableRow key={tx.id} className="group transition-colors hover:bg-muted/30">
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-md flex items-center justify-center border border-blue-200 dark:border-blue-800">
                            <span className="text-blue-700 dark:text-blue-300 font-bold text-xs">
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
                              ? 'border-blue-500 text-blue-600' 
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

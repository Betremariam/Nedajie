import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { 
  RefreshCcw, 
  Table as TableIcon, 
  Fuel, 
  AlertCircle,
  Loader2
} from "lucide-react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "../../components/ui/Card";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "../../components/ui/Table";
import { Button } from "../../components/ui/Button";
import { Alert, AlertTitle, AlertDescription } from "../../components/ui/Alert";
import { Badge } from "../../components/ui/Badge";

const FuelStockManager = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStations = async () => {
    setLoading(true);
    try {
      const res = await API.get("/admins/fuel-stocks");
      setStations(res.data);
    } catch (err) {
      console.error("Failed to fetch stations:", err);
      setError("Failed to load regional fuel stations data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Regional Fuel Inventory</h1>
          <p className="text-muted-foreground text-lg italic">Real-time status of registered fuel stocks within your jurisdiction</p>
        </div>
        <Badge variant="outline" className="h-fit px-4 py-1.5 text-sm gap-2">
            <Fuel className="w-4 h-4" />
            {stations.length} Supply Points
        </Badge>
      </div>

      {error && (
        <Alert variant="destructive" className="max-w-4xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Operational Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="border-border/50 shadow-lg overflow-hidden max-w-5xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-muted/20">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-primary/10 rounded-lg">
                <TableIcon className="w-5 h-5 text-primary" />
             </div>
             <div>
                <CardTitle>Inventory Audit</CardTitle>
                <CardDescription>Comprehensive list of fuel levels across regional stations</CardDescription>
             </div>
          </div>
          <Button variant="outline" size="sm" onClick={fetchStations} disabled={loading} className="gap-2 h-9">
            <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Sync Logs
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent bg-muted/40">
                  <TableHead className="pl-6 h-12 uppercase text-[10px] font-bold tracking-wider">Station Name</TableHead>
                  <TableHead className="h-12 uppercase text-[10px] font-bold tracking-wider">Locality</TableHead>
                  <TableHead className="h-12 uppercase text-[10px] font-bold tracking-wider">Product Type</TableHead>
                  <TableHead className="pr-6 h-12 text-right uppercase text-[10px] font-bold tracking-wider">Volume Remaining</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-48 text-center text-muted-foreground">
                      {loading ? (
                        <div className="flex flex-col items-center gap-2">
                           <Loader2 className="animate-spin h-6 w-6" />
                           <span className="text-xs">Synchronizing regional data...</span>
                        </div>
                      ) : "No fuel stocks registered in your region."}
                    </TableCell>
                  </TableRow>
                ) : (
                  stations.map((stock) => (
                    <TableRow key={stock.id} className="group transition-colors hover:bg-muted/30">
                      <TableCell className="pl-6 font-semibold">{stock.stationName}</TableCell>
                      <TableCell className="text-muted-foreground">{stock.city}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize px-2 py-0">
                          {stock.gasType}
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-bold text-foreground">
                            {(stock.litersReceived - stock.litersDispensed).toLocaleString()} L
                          </span>
                          <div className="w-24 h-1 bg-muted rounded-full overflow-hidden mt-1">
                            <div 
                              className={`h-full ${
                                (stock.litersReceived - stock.litersDispensed) / stock.litersReceived < 0.2 
                                  ? "bg-red-500" 
                                  : "bg-emerald-500"
                              }`}
                              style={{ 
                                width: `${Math.min(100, ((stock.litersReceived - stock.litersDispensed) / stock.litersReceived) * 100)}%` 
                              }}
                            />
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

export default FuelStockManager;

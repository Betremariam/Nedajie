import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { 
  Users, 
  Search, 
  Car, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Contact,
  ShieldCheck,
  CreditCard,
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
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";

const VehicleLists = () => {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await API.get("/admins/vehicles");
        setVehicles(res.data);
      } catch (error) {
        console.error("Failed to fetch vehicles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch = 
      vehicle.ownerName?.toLowerCase().includes(search.toLowerCase()) ||
      vehicle.carPlate?.toLowerCase().includes(search.toLowerCase());
    
    const matchesType = typeFilter === "all" || vehicle.vehicleType === typeFilter;
    
    return matchesSearch && matchesType;
  });

  if (loading) return (
    <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-muted-foreground animate-pulse font-medium">Synchronizing fleet records...</p>
    </div>
  );

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Registered Vehicles</h1>
          <p className="text-muted-foreground text-lg">Comprehensive registry of authorized fleet and machines</p>
        </div>
        <Badge variant="outline" className="h-fit px-4 py-1.5 text-sm gap-2 bg-primary/5 border-primary/20 text-primary">
          <Car className="w-4 h-4" />
          {vehicles.length} Registered Units
        </Badge>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filter by owner or plate..."
                className="pl-10 h-11"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-muted-foreground whitespace-nowrap">Show:</span>
              <select 
                title="Filter by Vehicle Type"
                value={typeFilter} 
                onChange={(e) => setTypeFilter(e.target.value)}
                className="h-11 px-4 rounded-xl border border-border bg-card font-medium text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
              >
                <option value="all">All Vehicles</option>
                <option value="bajaj">Bajaj</option>
                <option value="taxi">Taxi</option>
                <option value="car">Private Car</option>
                <option value="bus">Bus</option>
                <option value="truck">Truck</option>
                <option value="heavy">Heavy Machinery</option>
                <option value="boat">Boat / Marine</option>
                <option value="ambulance">Ambulance</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent bg-muted/30">
                  <TableHead className="pl-6 h-12 uppercase text-[10px] font-bold tracking-wider">Owner Identity</TableHead>
                  <TableHead className="h-12 uppercase text-[10px] font-bold tracking-wider">Contact</TableHead>
                  <TableHead className="h-12 uppercase text-[10px] font-bold tracking-wider">Type</TableHead>
                  <TableHead className="h-12 uppercase text-[10px] font-bold tracking-wider">Plate / ID</TableHead>
                  <TableHead className="h-12 uppercase text-[10px] font-bold tracking-wider text-primary">Quota (L)</TableHead>
                  <TableHead className="pr-6 h-12 uppercase text-[10px] font-bold tracking-wider">Approval Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground gap-3">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                          <Car className="w-8 h-8 opacity-20" />
                        </div>
                        <p className="text-lg font-medium">{search ? "No matches found" : "No vehicles registered"}</p>
                        <Button variant="link" onClick={() => setSearch("")} className="text-primary">Clear search</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id} className="group transition-colors hover:bg-muted/40">
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                            <span className="text-primary font-bold text-sm">
                              {vehicle.ownerName?.charAt(0) || 'V'}
                            </span>
                          </div>
                          <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {vehicle.ownerName}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <Contact className="w-3.5 h-3.5" />
                          {vehicle.phone}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 capitalize font-medium text-[11px]">
                          {vehicle.vehicleType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="font-mono font-bold tracking-tighter uppercase">{vehicle.carPlate}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 font-bold text-primary">
                          <Fuel className="w-3.5 h-3.5" />
                          {vehicle.fullCapacity}L
                        </div>
                      </TableCell>
                      <TableCell className="pr-6">
                        {vehicle.approvedBy ? (
                          <div className="flex items-center gap-2 text-[10px] py-1 px-2 bg-emerald-500/5 border border-emerald-500/20 rounded-md w-fit">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span className="font-bold text-emerald-800">Approved by {vehicle.approvedBy.name}</span>
                          </div>
                        ) : (
                          <Badge variant="outline" className="bg-amber-500/5 text-amber-600 border-amber-200 italic font-normal text-[10px]">
                            Awaiting approval
                          </Badge>
                        )}
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

export default VehicleLists;

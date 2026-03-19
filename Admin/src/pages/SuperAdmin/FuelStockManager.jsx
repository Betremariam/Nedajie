import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { 
  PlusCircle, 
  RefreshCcw, 
  UserPlus, 
  Table as TableIcon, 
  Droplets, 
  Locate, 
  Fuel, 
  CheckCircle2, 
  AlertCircle,
  Loader2
} from "lucide-react";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "../../components/ui/Tabs";
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
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from "../../components/ui/Select";
import { Alert, AlertTitle, AlertDescription } from "../../components/ui/Alert";
import { Badge } from "../../components/ui/Badge";

const FuelStockManager = () => {
  const [stations, setStations] = useState([]);
  const [stockForm, setStockForm] = useState({
    stationName: "",
    city: "",
    gasType: "benzene",
    litersReceived: 0,
  });

  const [ownerForm, setOwnerForm] = useState({
    name: "",
    email: "",
    password: "",
    stationKey: "", // we will use grouped key instead of single ID
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("stock");

  // Fetch stations
  const fetchStations = async () => {
    setLoading(true);
    try {
      const res = await API.get("/admins/fuel-stocks");
      setStations(res.data);
    } catch (err) {
      console.error("Failed to fetch stations:", err);
      setError("Failed to load fuel stations data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  // Add fuel stock
  const handleAddStock = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await API.post("/admins/fuel-stocks", stockForm);
      setSuccess("Fuel stock added successfully.");
      setStockForm({
        stationName: "",
        city: "",
        gasType: "benzene",
        litersReceived: 0,
      });
      fetchStations();
    } catch (err) {
      setError("Failed to add fuel stock.");
    } finally {
      setLoading(false);
    }
  };

  // Update fuel stock
  const handleUpdateStock = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const existing = stations.find(
      (s) =>
        s.stationName.toLowerCase() === stockForm.stationName.toLowerCase() &&
        s.gasType === stockForm.gasType &&
        s.city.toLowerCase() === stockForm.city.toLowerCase()
    );

    if (!existing) {
      setError("No existing station found for update.");
      return;
    }

    if (stockForm.litersReceived <= 0) {
      setError("Liters must be greater than 0 for update.");
      return;
    }

    setLoading(true);
    try {
      await API.put(`/admins/fuel-stocks/${existing.id}/refill`, {
        additionalLiters: stockForm.litersReceived,
      });

      setSuccess("Fuel stock updated successfully.");
      setStockForm({
        stationName: "",
        city: "",
        gasType: "benzene",
        litersReceived: 0,
      });
      fetchStations();
    } catch (err) {
      console.error(err);
      setError("Failed to update fuel stock.");
    } finally {
      setLoading(false);
    }
  };

  // Add Station Owner
  const handleAddOwner = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!ownerForm.stationKey) {
      setError("Please select a station for this owner.");
      return;
    }

    // Find all stationIds with same stationKey (stationName + city)
    const [stationName, city] = ownerForm.stationKey.split("::");
    const matchedStations = stations.filter(
      (s) => s.stationName === stationName && s.city === city
    );

    const stationIds = matchedStations.map((s) => s.id);

    setLoading(true);
    try {
      await API.post("/admins/owners", {
        name: ownerForm.name,
        email: ownerForm.email,
        password: ownerForm.password,
        stationIds, // send multiple IDs
      });

      setSuccess("Station owner created successfully.");
      setOwnerForm({
        name: "",
        email: "",
        password: "",
        stationKey: "",
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Failed to create owner.");
    } finally {
      setLoading(false);
    }
  };

  // Group stations by stationName + city
  const groupedStations = Object.values(
    stations.reduce((acc, s) => {
      const key = `${s.stationName}::${s.city}`;
      if (!acc[key]) {
        acc[key] = {
          key,
          stationName: s.stationName,
          city: s.city,
          stocks: [],
        };
      }
      acc[key].stocks.push(s);
      return acc;
    }, {})
  );

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Fuel Stock Management</h1>
        <p className="text-muted-foreground text-lg">Centralized inventory and ownership control</p>
      </div>

      {/* Alert Messages */}
      {(error || success) && (
        <div className="max-w-4xl mx-auto">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-4 bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-200">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList className="h-12 p-1 bg-muted/60">
            <TabsTrigger value="stock" className="px-6 gap-2">
              <PlusCircle className="w-4 h-4" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="owner" className="px-6 gap-2">
              <UserPlus className="w-4 h-4" />
              Ownership
            </TabsTrigger>
            <TabsTrigger value="view" className="px-6 gap-2">
              <TableIcon className="w-4 h-4" />
              Review
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Inventory Management Tab */}
        <TabsContent value="stock" className="space-y-6">
          <Card className="max-w-4xl mx-auto border-border/50 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Droplets className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Manage Fuel Stock</CardTitle>
                  <CardDescription>Update or add new fuel inventory records</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="stationName">Station Name *</Label>
                    <div className="relative">
                      <Fuel className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="stationName"
                        placeholder="e.g. TotalEnergies Bole"
                        value={stockForm.stationName}
                        onChange={(e) => setStockForm({ ...stockForm, stationName: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <div className="relative">
                      <Locate className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="city"
                        placeholder="e.g. Addis Ababa"
                        value={stockForm.city}
                        onChange={(e) => setStockForm({ ...stockForm, city: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fuel-type">Fuel Type *</Label>
                    <Select 
                      value={stockForm.gasType} 
                      onValueChange={(val) => setStockForm({ ...stockForm, gasType: val })}
                    >
                      <SelectTrigger id="fuel-type" className="h-10">
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="benzene">Benzene</SelectItem>
                        <SelectItem value="diesel">Diesel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="liters">Amount in Liters *</Label>
                    <Input
                      id="liters"
                      type="number"
                      placeholder="Enter quantity"
                      value={stockForm.litersReceived}
                      onChange={(e) => setStockForm({ ...stockForm, litersReceived: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border/50">
                  <Button
                    onClick={handleAddStock}
                    className="flex-1 h-11 gap-2"
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
                    Create New Entry
                  </Button>
                  <Button
                    onClick={handleUpdateStock}
                    variant="outline"
                    className="flex-1 h-11 gap-2 border-amber-200 text-amber-700 hover:bg-amber-50"
                    disabled={loading}
                  >
                    <RefreshCcw className="w-4 h-4" />
                    Apply as Refill
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ownership Management Tab */}
        <TabsContent value="owner" className="space-y-6">
          <Card className="max-w-4xl mx-auto border-border/50 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <UserPlus className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Assign Station Owner</CardTitle>
                  <CardDescription>Grant administrative control to station personnel</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleAddOwner}>
                <div className="space-y-2">
                  <Label htmlFor="station-select">Select Station Hub *</Label>
                  <Select 
                    value={ownerForm.stationKey} 
                    onValueChange={(val) => setOwnerForm({ ...ownerForm, stationKey: val })}
                  >
                    <SelectTrigger id="station-select" className="h-11">
                      <SelectValue placeholder="Choose a registered station hub..." />
                    </SelectTrigger>
                    <SelectContent>
                      {groupedStations.map((g) => (
                        <SelectItem key={g.key} value={g.key}>
                          {g.stationName} — {g.city} ({g.stocks.length} fuels)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="owner-name">Full Name *</Label>
                    <Input
                      id="owner-name"
                      placeholder="e.g. Abebe Bikila"
                      value={ownerForm.name}
                      onChange={(e) => setOwnerForm({ ...ownerForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="owner-email">Email Address *</Label>
                    <Input
                      id="owner-email"
                      type="email"
                      placeholder="e.g. owner@example.com"
                      value={ownerForm.email}
                      onChange={(e) => setOwnerForm({ ...ownerForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="owner-pass">Access Password *</Label>
                    <Input
                      id="owner-pass"
                      type="password"
                      placeholder="Set initial password"
                      value={ownerForm.password}
                      onChange={(e) => setOwnerForm({ ...ownerForm, password: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="pt-4 border-t border-border/50">
                  <Button type="submit" className="w-full sm:w-auto px-10 h-11 gap-2" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                    Authorize Station Owner
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Review/View Tab */}
        <TabsContent value="view" className="space-y-6">
          <Card className="border-border/50 shadow-lg overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-muted/20">
              <div>
                <CardTitle>Inventory Audit</CardTitle>
                <CardDescription>Real-time status of all registered fuel stocks</CardDescription>
              </div>
              <Badge variant="outline" className="px-3 py-1">Total: {stations.length}</Badge>
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
                          {loading ? <Loader2 className="animate-spin h-6 w-6 mx-auto" /> : "No fuel stocks registered."}
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FuelStockManager;

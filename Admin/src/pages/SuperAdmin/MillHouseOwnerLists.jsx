import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { 
  Home, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Contact,
  ShieldCheck,
  MapPinned,
  Droplets
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
import { useTranslation } from "react-i18next";

const MillHouseOwnerLists = () => {
  const { t } = useTranslation();
  const [owners, setOwners] = useState([]);
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [woredaFilter, setWoredaFilter] = useState("all");
  const [fuelTypeFilter, setFuelTypeFilter] = useState("all");
  const [approvalFilter, setApprovalFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const res = await API.get("/admins/mill-house-owners");
        setOwners(res.data);
      } catch (error) {
        console.error("Failed to fetch mill house owners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOwners();
  }, []);

  const filteredOwners = owners.filter((owner) => {
    const matchesSearch = owner.fullName.toLowerCase().includes(search.toLowerCase()) ||
      owner.phoneNumber?.includes(search);
    const matchesRegion = regionFilter === "all" || owner.region === regionFilter;
    const matchesWoreda = woredaFilter === "all" || owner.woreda === woredaFilter;
    const matchesFuelType = fuelTypeFilter === "all" || owner.fuelType === fuelTypeFilter;
    const matchesApproval = approvalFilter === "all" || 
      (approvalFilter === "approved" && owner.approvedBy) ||
      (approvalFilter === "pending" && !owner.approvedBy);
    
    return matchesSearch && matchesRegion && matchesWoreda && matchesFuelType && matchesApproval;
  });

  const uniqueRegions = [...new Set(owners.map(o => o.region).filter(Boolean))].sort();
  const uniqueWoredas = [...new Set(owners.map(o => o.woreda).filter(Boolean))].sort();

  if (loading) return (
    <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-muted-foreground animate-pulse font-medium">Synchronizing mill house registry...</p>
    </div>
  );

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{t("millHouseOwners")}</h1>
          <p className="text-muted-foreground text-lg">{t("millHouseOwnersDesc")}</p>
        </div>
        <Badge variant="outline" className="h-fit px-4 py-1.5 text-sm gap-2 bg-primary/5 border-primary/20 text-primary">
          <Home className="w-4 h-4" />
          {owners.length} Registered Operations
        </Badge>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by owner name or phone..."
                className="pl-10 h-11"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-muted-foreground whitespace-nowrap">Region:</span>
                <select 
                  title="Filter by Region"
                  value={regionFilter} 
                  onChange={(e) => setRegionFilter(e.target.value)}
                  className="h-10 px-4 rounded-xl border border-border bg-card font-medium text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                >
                  <option value="all">All Regions</option>
                  {uniqueRegions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-muted-foreground whitespace-nowrap">Woreda:</span>
                <select 
                  title="Filter by Woreda"
                  value={woredaFilter} 
                  onChange={(e) => setWoredaFilter(e.target.value)}
                  className="h-10 px-4 rounded-xl border border-border bg-card font-medium text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                >
                  <option value="all">All Woredas</option>
                  {uniqueWoredas.map(woreda => (
                    <option key={woreda} value={woreda}>{woreda}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-muted-foreground whitespace-nowrap">Fuel Type:</span>
                <select 
                  title="Filter by Fuel Type"
                  value={fuelTypeFilter} 
                  onChange={(e) => setFuelTypeFilter(e.target.value)}
                  className="h-10 px-4 rounded-xl border border-border bg-card font-medium text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                >
                  <option value="all">All Types</option>
                  <option value="diesel">Diesel</option>
                  <option value="benzene">Benzene</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-muted-foreground whitespace-nowrap">Status:</span>
                <select 
                  title="Filter by Approval Status"
                  value={approvalFilter} 
                  onChange={(e) => setApprovalFilter(e.target.value)}
                  className="h-10 px-4 rounded-xl border border-border bg-card font-medium text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                >
                  <option value="all">All Status</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              {(search || regionFilter !== "all" || woredaFilter !== "all" || fuelTypeFilter !== "all" || approvalFilter !== "all") && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setSearch("");
                    setRegionFilter("all");
                    setWoredaFilter("all");
                    setFuelTypeFilter("all");
                    setApprovalFilter("all");
                  }}
                  className="h-10 text-sm"
                >
                  Clear Filters
                </Button>
              )}
              <div className="ml-auto text-sm text-muted-foreground font-medium">
                {filteredOwners.length} of {owners.length} Records
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent bg-muted/30">
                  <TableHead className="pl-6 h-12 uppercase text-[10px] font-bold tracking-wider">Owner Identity</TableHead>
                  <TableHead className="h-12 uppercase text-[10px] font-bold tracking-wider">Contact Details</TableHead>
                  <TableHead className="h-12 uppercase text-[10px] font-bold tracking-wider">Resource Capacity</TableHead>
                  <TableHead className="h-12 uppercase text-[10px] font-bold tracking-wider">Location Info</TableHead>
                  <TableHead className="pr-6 h-12 uppercase text-[10px] font-bold tracking-wider">Validation Source</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOwners.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground gap-3">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                          <Home className="w-8 h-8 opacity-20" />
                        </div>
                        <p className="text-lg font-medium">{search ? "No owners match" : "Registry is empty"}</p>
                        <Button variant="link" onClick={() => setSearch("")} className="text-primary">Clear search</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOwners.map((owner) => (
                    <TableRow key={owner.id} className="group transition-colors hover:bg-muted/40">
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                            <span className="text-primary font-bold text-sm">
                              {owner.fullName?.charAt(0) || 'M'}
                            </span>
                          </div>
                          <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {owner.fullName}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Contact className="w-3.5 h-3.5" />
                          {owner.phoneNumber}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="gap-1.5 font-bold">
                            <Droplets className="w-3 h-3 text-primary" />
                            {owner.dailyLimit}L / {owner.fuelType}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                           <div className="flex items-center gap-1.5 text-sm font-medium">
                              <MapPinned className="w-3.5 h-3.5 text-muted-foreground" />
                              {owner.woreda}
                           </div>
                           <span className="text-[11px] text-muted-foreground pl-5">{owner.kebele}</span>
                        </div>
                      </TableCell>
                      <TableCell className="pr-6">
                        {owner.approvedBy ? (
                          <div className="flex items-center gap-2 text-xs py-1 px-2 bg-emerald-500/5 border border-emerald-500/20 rounded-md w-fit">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <div className="flex flex-col">
                              <span className="font-bold text-emerald-800 dark:text-emerald-400">{owner.approvedBy.name}</span>
                              <span className="text-[10px] opacity-60">{owner.approvedBy.email}</span>
                            </div>
                          </div>
                        ) : (
                          <Badge variant="outline" className="bg-amber-500/5 text-amber-600 border-amber-200 italic font-normal">
                            Pending Validation
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

export default MillHouseOwnerLists;

import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { 
  Users, 
  Search, 
  Sprout, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Contact,
  ShieldCheck,
  MapPinned
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

const FarmerLists = () => {
  const [farmers, setFarmers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const res = await API.get("/admins/farmers");
        setFarmers(res.data);
      } catch (error) {
        console.error("Failed to fetch farmers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFarmers();
  }, []);

  const filteredFarmers = farmers.filter((farmer) =>
    farmer.fullName.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-muted-foreground animate-pulse font-medium">Synchronizing agricultural registry...</p>
    </div>
  );

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Registered Farmers</h1>
          <p className="text-muted-foreground text-lg">Central directory of verified agricultural stakeholders</p>
        </div>
        <Badge variant="outline" className="h-fit px-4 py-1.5 text-sm gap-2 bg-emerald-500/5 border-emerald-200 text-emerald-700">
          <Sprout className="w-4 h-4" />
          {farmers.length} Verified Producers
        </Badge>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter by farmer name..."
              className="pl-10 h-11"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent bg-muted/30">
                  <TableHead className="pl-6 h-12 uppercase text-[10px] font-bold tracking-wider">Farmer Identity</TableHead>
                  <TableHead className="h-12 uppercase text-[10px] font-bold tracking-wider">Contact Details</TableHead>
                  <TableHead className="h-12 uppercase text-[10px] font-bold tracking-wider">Administrative Zone</TableHead>
                  <TableHead className="h-12 uppercase text-[10px] font-bold tracking-wider">Local Jurisdiction</TableHead>
                  <TableHead className="pr-6 h-12 uppercase text-[10px] font-bold tracking-wider">Verification Source</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFarmers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground gap-3">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                          <Sprout className="w-8 h-8 opacity-20" />
                        </div>
                        <p className="text-lg font-medium">{search ? "No farmers match" : "Registry is empty"}</p>
                        <Button variant="link" onClick={() => setSearch("")} className="text-primary">Clear search</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFarmers.map((farmer) => (
                    <TableRow key={farmer.id} className="group transition-colors hover:bg-muted/40">
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                            <span className="text-emerald-600 font-bold text-sm">
                              {farmer.fullName?.charAt(0) || 'F'}
                            </span>
                          </div>
                          <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {farmer.fullName}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Contact className="w-3.5 h-3.5" />
                          {farmer.phoneNumber}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPinned className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-sm">{farmer.woreda}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-[11px] px-2 py-0">
                          {farmer.kebele}
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-6">
                        {farmer.approvedBy ? (
                          <div className="flex items-center gap-2 text-xs py-1 px-2 bg-emerald-500/5 border border-emerald-500/20 rounded-md w-fit">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <div className="flex flex-col">
                              <span className="font-bold text-emerald-800 dark:text-emerald-400">{farmer.approvedBy.name}</span>
                              <span className="text-[10px] opacity-60">{farmer.approvedBy.email}</span>
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

export default FarmerLists;

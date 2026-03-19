import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { 
  Users2, 
  Search, 
  UserCircle2, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Contact,
  ShieldCheck,
  Droplet
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

const OthersLists = () => {
  const [others, setOthers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOthers = async () => {
      try {
        const res = await API.get("/admins/others");
        setOthers(res.data);
      } catch (error) {
        console.error("Failed to fetch other users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOthers();
  }, []);

  const filteredOthers = others.filter((other) =>
    other.fullName.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-muted-foreground animate-pulse font-medium">Synchronizing auxiliary accounts...</p>
    </div>
  );

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Auxiliary User Accounts</h1>
          <p className="text-muted-foreground text-lg">Registry of non-primary stakeholders and service consumers</p>
        </div>
        <Badge variant="outline" className="h-fit px-4 py-1.5 text-sm gap-2 bg-purple-500/5 border-purple-200 text-purple-700">
          <Users2 className="w-4 h-4" />
          {others.length} Secondary Profiles
        </Badge>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by full name..."
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
                  <TableHead className="pl-6 h-12 uppercase text-[10px] font-bold tracking-wider">User Identity</TableHead>
                  <TableHead className="h-12 uppercase text-[10px] font-bold tracking-wider">Contact Path</TableHead>
                  <TableHead className="h-12 uppercase text-[10px] font-bold tracking-wider">Allocation Type</TableHead>
                  <TableHead className="pr-6 h-12 uppercase text-[10px] font-bold tracking-wider">Verification Source</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOthers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground gap-3">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                          <UserCircle2 className="w-8 h-8 opacity-20" />
                        </div>
                        <p className="text-lg font-medium">{search ? "No results match" : "Registry is healthy but empty"}</p>
                        <Button variant="link" onClick={() => setSearch("")} className="text-primary">Clear all filters</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOthers.map((other) => (
                    <TableRow key={other.id} className="group transition-colors hover:bg-muted/40">
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center border border-purple-500/20">
                            <span className="text-purple-600 font-bold text-sm">
                              {other.fullName?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {other.fullName}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <Contact className="w-3.5 h-3.5" />
                          {other.phoneNumber}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={`capitalize font-medium flex items-center gap-1.5 w-fit ${
                            other.fuelType === 'benzene' 
                              ? 'bg-blue-500/10 text-blue-700 border-blue-200/50' 
                              : 'bg-muted text-muted-foreground border-border/50'
                          }`}
                        >
                          <Droplet className="w-3 h-3" />
                          {other.fuelType}
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-6">
                        {other.approvedBy ? (
                          <div className="flex items-center gap-2 text-xs py-1 px-2 bg-emerald-500/5 border border-emerald-500/20 rounded-md w-fit">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <div className="flex flex-col">
                              <span className="font-bold text-emerald-800 dark:text-emerald-400">{other.approvedBy.name}</span>
                              <span className="text-[10px] opacity-60">{other.approvedBy.email}</span>
                            </div>
                          </div>
                        ) : (
                          <Badge variant="outline" className="bg-amber-500/5 text-amber-600 border-amber-200 italic font-normal">
                            Validation Required
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

export default OthersLists;

import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { Building2, ShieldAlert, ShieldCheck, Loader2, Ban, Unlock, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "../../components/ui/Table";
import { Button } from "../../components/ui/Button";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "../../components/ui/Card";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/Alert";
import { Badge } from "../../components/ui/Badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/AlertDialog";

const ManageStationOwners = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [blockingOwner, setBlockingOwner] = useState(null);

  const fetchOwners = async () => {
    setLoading(true);
    try {
      const res = await API.get("/admins/admins");
      const filtered = res.data.filter(admin => admin.role === "stationOwner");
      setOwners(filtered);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to load station owners");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  const confirmToggleBlock = (owner) => {
    setBlockingOwner(owner);
  };

  const handleToggleBlock = async () => {
    if (!blockingOwner) return;
    const { id, isBlocked } = blockingOwner;
    const action = isBlocked ? "unblock" : "block";
    setError("");
    setSuccess("");
    try {
      await API.patch(`/admins/admins/${id}/block`);
      setSuccess(`Station owner successfully ${action}ed`);
      fetchOwners();
    } catch (err) {
      setError(err.response?.data?.msg || `Failed to ${action} station owner`);
    } finally {
      setBlockingOwner(null);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Manage Station Owners</h1>
        <p className="text-muted-foreground text-lg">View and manage fuel station owners in your region</p>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Alert variant="destructive">
              <ShieldAlert className="w-4 h-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}
        {success && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Alert className="bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="border-border/50 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Regional Station Owners</CardTitle>
            <CardDescription>Fuel station owners operating in your region</CardDescription>
          </div>
          <Badge variant="outline" className="px-3 py-1">Total: {owners.length}</Badge>
        </CardHeader>
        <CardContent className="p-0">
          {loading && owners.length === 0 ? (
            <div className="p-12 text-center">
              <Loader2 className="animate-spin h-8 w-8 text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading station owners...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[300px] pl-6">Owner / Station</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {owners.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">
                        No station owners found in your region.
                      </TableCell>
                    </TableRow>
                  ) : (
                    owners.map((owner) => (
                      <TableRow key={owner.id} className="group">
                        <TableCell className="pl-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                              <Building2 className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-semibold text-foreground">{owner.name}</div>
                              <div className="text-sm text-muted-foreground">{owner.stationName}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{owner.email}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span>{owner.city}, {owner.region}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1.5 items-start">
                            {owner.isBlocked ? (
                              <Badge className="bg-red-500/10 text-red-700 border-red-200 hover:bg-red-500/20 gap-1">
                                <Ban className="w-3 h-3" /> Blocked
                              </Badge>
                            ) : (
                              <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-200 hover:bg-emerald-500/20 gap-1">
                                <ShieldCheck className="w-3 h-3" /> Active
                              </Badge>
                            )}
                            {owner.mustChangePassword && (
                              <span className="text-[10px] bg-amber-500/10 text-amber-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">Needs Password Change</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <Button
                            variant={owner.isBlocked ? "outline" : "destructive"}
                            size="sm"
                            onClick={() => confirmToggleBlock(owner)}
                            className={owner.isBlocked ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50 gap-2" : "gap-2"}
                          >
                            {owner.isBlocked ? <Unlock className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                            {owner.isBlocked ? "Unblock" : "Block"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Block/Unblock Confirmation */}
      <AlertDialog open={!!blockingOwner} onOpenChange={(open) => !open && setBlockingOwner(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {blockingOwner?.isBlocked ? "Unblock" : "Block"} Station Owner?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {blockingOwner?.isBlocked 
                ? `This will restore system access for ${blockingOwner?.name} (${blockingOwner?.stationName}). They will be able to log in and manage their station.`
                : `This will immediately revoke system access for ${blockingOwner?.name} (${blockingOwner?.stationName}). They will not be able to accept fuel deliveries or manage their station.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleToggleBlock}
              className={blockingOwner?.isBlocked ? "bg-emerald-600 hover:bg-emerald-700" : "bg-destructive hover:bg-destructive/90"}
            >
              Confirm {blockingOwner?.isBlocked ? "Unblock" : "Block"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageStationOwners;

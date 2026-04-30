import React, { useEffect, useState } from "react";
import { getAllAdmins } from "../../services/api";
import API from "../../services/api";
import {
  MapPin,
  Building,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Building2,
  Users,
  Search,
  FileText,
  Ban,
  Unlock,
} from "lucide-react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/Alert";

const OwnersList = () => {
  const [owners, setOwners] = useState([]);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [blockingOwner, setBlockingOwner] = useState(null);
  const [search, setSearch] = useState("");

  const fetchOwners = async () => {
    setLoading(true);
    try {
      const res = await getAllAdmins();
      setOwners(res.data.filter((a) => a.role === "stationOwner"));
    } catch {
      setError("Failed to load owners.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  const handleToggleBlock = async (ownerId, isBlocked) => {
    setError("");
    setSuccess("");
    try {
      await API.patch(`/admins/admins/${ownerId}/block`);
      setSuccess(`Station owner successfully ${isBlocked ? "unblocked" : "blocked"}`);
      fetchOwners();
      setBlockingOwner(null);
    } catch (err) {
      setError(err.response?.data?.msg || `Failed to ${isBlocked ? "unblock" : "block"} station owner`);
      setBlockingOwner(null);
    }
  };

  const filtered = owners.filter(
    (o) =>
      o.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.email?.toLowerCase().includes(search.toLowerCase()) ||
      o.stationName?.toLowerCase().includes(search.toLowerCase()) ||
      o.region?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Station Owners</h1>
          <p className="text-muted-foreground text-lg">View and manage all registered fuel station owners</p>
        </div>
      </div>

      {/* Alerts */}
      {success && (
        <Alert className="border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="h-4 w-4" />
          <AlertTitle className="font-bold">Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-bold">Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Owners Table Card */}
      <div className="bg-card rounded-[24px] shadow-sm border border-border overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 md:p-8 pb-4 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-[12px] bg-muted/50 border border-border flex items-center justify-center text-foreground shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-foreground tracking-tight">Registered Owners</h2>
              <p className="text-muted-foreground text-[13px] font-medium">{owners.length} owner{owners.length !== 1 ? "s" : ""} in the system</p>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search owners..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 pl-11 rounded-xl border-border bg-muted/30 font-medium text-[13px] w-full sm:w-[220px] text-foreground"
            />
          </div>
        </div>

        {loading ? (
          <div className="h-48 flex flex-col items-center justify-center text-muted-foreground gap-3">
            <Loader2 className="w-10 h-10 animate-spin" />
            <p className="text-[13px] font-medium">Loading owners...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-muted-foreground gap-3">
            <Building2 className="w-10 h-10 opacity-30" />
            <p className="text-[13px] font-medium">{search ? "No owners match your search." : "No owners registered yet."}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left pl-6 md:pl-8 h-11 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Owner</th>
                  <th className="text-left h-11 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Email</th>
                  <th className="text-left h-11 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Station Name</th>
                  <th className="text-left h-11 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Region</th>
                  <th className="text-right pr-6 md:pr-8 h-11 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-right pr-6 md:pr-8 h-11 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((owner) => (
                  <tr key={owner._id || owner.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="pl-6 md:pl-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-muted border border-border flex items-center justify-center text-foreground font-bold text-[13px]">
                          {owner.name?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <span className="text-[14px] font-semibold text-foreground">{owner.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-[13px] text-muted-foreground font-medium">{owner.email}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-1.5 text-[13px] font-medium text-foreground">
                        <Building className="w-3.5 h-3.5 text-muted-foreground/50" />
                        {owner.stationName || "—"}
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground/50" />
                        {owner.region || "—"}
                      </div>
                    </td>
                    <td className="pr-6 md:pr-8 py-4 text-right">
                      {owner.isBlocked ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-red-500/10 text-red-600 border border-red-500/20 dark:text-red-400">
                          <Ban className="w-3 h-3" />
                          Blocked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Active
                        </span>
                      )}
                    </td>
                    <td className="pr-6 md:pr-8 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => setSelectedOwner(owner)} className="h-8 px-3 rounded-lg text-xs font-semibold">View</Button>
                        <Button 
                          variant={owner.isBlocked ? "outline" : "destructive"}
                          size="sm" 
                          onClick={() => setBlockingOwner(owner)} 
                          className={`h-8 px-3 rounded-lg text-xs font-semibold ${owner.isBlocked ? 'border-emerald-200 text-emerald-700 hover:bg-emerald-50' : ''}`}
                        >
                          {owner.isBlocked ? <Unlock className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Owner Details Modal */}
      {selectedOwner && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          onClick={() => setSelectedOwner(null)}
        >
          <div 
            className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-border p-6 space-y-6 my-8 relative"
            style={{ maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-border bg-card">
              <h3 className="text-lg font-bold text-foreground">Owner Details</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedOwner(null)} className="h-8 w-8 rounded-full p-0 hover:bg-muted">✕</Button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase">Owner Name</p>
                <p className="text-sm font-medium text-foreground">{selectedOwner.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase">Email Address</p>
                <p className="text-sm font-medium text-foreground">{selectedOwner.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase">Station Name</p>
                <p className="text-sm font-medium text-foreground">{selectedOwner.stationName || "—"}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase">Region</p>
                  <p className="text-sm font-medium text-foreground">{selectedOwner.region || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase">Zone</p>
                  <p className="text-sm font-medium text-foreground">{selectedOwner.zone || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase">Woreda</p>
                  <p className="text-sm font-medium text-foreground">{selectedOwner.woreda || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase">City</p>
                  <p className="text-sm font-medium text-foreground">{selectedOwner.city || "—"}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-border space-y-3">
                <p className="text-xs text-muted-foreground font-semibold uppercase">Uploaded Documents</p>
                
                {(() => {
                  const docs = [
                    { label: "Legal Business", path: selectedOwner.legalDocPath },
                    { label: "Fuel Sector License", path: selectedOwner.fuelLicensePath },
                    { label: "Construction Approval", path: selectedOwner.constructionDocPath },
                    { label: "Safety Cert", path: selectedOwner.safetyCertPath },
                    { label: "Env Clearance", path: selectedOwner.envClearancePath },
                    { label: "Pump Calibration", path: selectedOwner.pumpCalibrationPath },
                  ];
                  
                  const availableDocs = docs.filter(doc => doc.path);
                  
                  if (availableDocs.length === 0) {
                    return (
                      <div className="text-center py-4 text-muted-foreground text-xs">
                        No documents uploaded
                      </div>
                    );
                  }
                  
                  return availableDocs.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-muted/30 p-2 rounded-lg">
                      <span className="text-[12px] font-medium text-foreground">{doc.label}</span>
                      <a
                        href={`http://localhost:5000/${doc.path.replace(/\\/g, '/')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-primary hover:underline"
                      >
                        View
                      </a>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Block/Unblock Confirmation Dialog */}
      {blockingOwner && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          onClick={() => setBlockingOwner(null)}
        >
          <div 
            className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-border p-6 space-y-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                {blockingOwner.isBlocked ? <Unlock className="w-5 h-5" /> : <Ban className="w-5 h-5" />}
                {blockingOwner.isBlocked ? "Unblock" : "Block"} Station Owner?
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setBlockingOwner(null)} className="h-8 w-8 rounded-full p-0 hover:bg-muted">✕</Button>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {blockingOwner.isBlocked 
                  ? `This will restore system access for ${blockingOwner.name} (${blockingOwner.stationName}). They will be able to log in and manage their station operations.`
                  : `This will immediately revoke system access for ${blockingOwner.name} (${blockingOwner.stationName}). They will not be able to accept fuel deliveries or manage their station until unblocked.`}
              </p>
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setBlockingOwner(null)} className="flex-1 h-10 rounded-xl">
                Cancel
              </Button>
              <Button 
                onClick={() => handleToggleBlock(blockingOwner.id, blockingOwner.isBlocked)}
                className={`flex-1 h-10 rounded-xl ${blockingOwner.isBlocked ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-destructive hover:bg-destructive/90'}`}
              >
                Confirm {blockingOwner.isBlocked ? "Unblock" : "Block"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnersList;

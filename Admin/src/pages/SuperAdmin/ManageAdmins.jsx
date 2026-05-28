import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { Copy, Check, ShieldAlert, ShieldCheck, KeyRound, Loader2, UserPlus, Trash2, Ban, Unlock } from "lucide-react";
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
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from "../../components/ui/Select";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/Dialog";
import { useTranslation } from "react-i18next";

const ManageAdmins = () => {
  const { t } = useTranslation();
  const [admins, setAdmins] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "register",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Temp password modal state
  const [newAdminCreds, setNewAdminCreds] = useState(null);
  const [copied, setCopied] = useState(false);

  // Alert Dialog State
  const [blockingAdmin, setBlockingAdmin] = useState(null);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await API.get("/admins/admins");
      // Only show register and approver admins (not super, federal, or stationOwner)
      const filtered = res.data.filter(admin => 
        admin.role === "register" || admin.role === "approver"
      );
      setAdmins(filtered);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to load admins");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({ ...prev, role }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setNewAdminCreds(null);
    setCopied(false);

    const { name, email, role, stationIds } = formData;
    if (!name || !email || !role) {
      return setError("Please fill all required fields");
    }

    setLoading(true);
    try {
      const res = await API.post("/admins/admins", { name, email, role });
      
      setSuccess("Admin created successfully");
      setNewAdminCreds({ email, tempPassword: res.data.tempPassword });
      setFormData({ name: "", email: "", role: "register" });
      fetchAdmins();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to create admin");
    } finally {
      setLoading(false);
    }
  };

  const confirmToggleBlock = (admin) => {
    setBlockingAdmin(admin);
  };

  const handleToggleBlock = async () => {
    if (!blockingAdmin) return;
    const { id, isBlocked } = blockingAdmin;
    const action = isBlocked ? "unblock" : "block";
    setError("");
    setSuccess("");
    try {
      await API.patch(`/admins/admins/${id}/block`);
      setSuccess(`Admin successfully ${action}ed`);
      fetchAdmins();
    } catch (err) {
      setError(err.response?.data?.msg || `Failed to ${action} admin`);
    } finally {
      setBlockingAdmin(null);
    }
  };

  const copyToClipboard = () => {
    if (newAdminCreds) {
      navigator.clipboard.writeText(`Email: ${newAdminCreds.email}\nPassword: ${newAdminCreds.tempPassword}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">{t("manageAdministrators")}</h1>
        <p className="text-muted-foreground text-lg">{t("manageAdministratorsDesc")}</p>
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
        {success && !newAdminCreds && (
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
        <CardHeader>
          <div className="flex items-center gap-3">
             <div className="p-2 bg-primary/10 rounded-lg">
                <UserPlus className="w-5 h-5 text-primary" />
             </div>
             <div>
                <CardTitle>Create New Admin</CardTitle>
                <CardDescription>Grant system access with specific roles</CardDescription>
             </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter admin's full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Admin Role *</Label>
                <Select value={formData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="register">Registration Admin</SelectItem>
                    <SelectItem value="approver">Approval Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full sm:w-auto h-11 px-8 gap-2"
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <KeyRound className="w-4 h-4" />}
                {loading ? "Processing..." : "Generate Admin Access"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Registered Administrators</CardTitle>
            <CardDescription>View and manage all system access levels</CardDescription>
          </div>
          <Badge variant="outline" className="px-3 py-1">Total: {admins.length}</Badge>
        </CardHeader>
        <CardContent className="p-0">
          {loading && admins.length === 0 ? (
            <div className="p-12 text-center">
              <Loader2 className="animate-spin h-8 w-8 text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Synchronizing records...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[300px] pl-6">Administrator</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">
                        No administrator records found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    admins.map((admin) => (
                      <TableRow key={admin.id} className="group">
                        <TableCell className="pl-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                              <span className="text-primary font-bold text-sm">
                                {admin.name?.charAt(0) || 'A'}
                              </span>
                            </div>
                            <div className="font-semibold text-foreground">{admin.name}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{admin.email}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="capitalize">
                            {admin.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1.5 items-start">
                            {admin.isBlocked ? (
                              <Badge className="bg-red-500/10 text-red-700 border-red-200 hover:bg-red-500/20 gap-1">
                                <Ban className="w-3 h-3" /> Blocked
                              </Badge>
                            ) : (
                              <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-200 hover:bg-emerald-500/20 gap-1">
                                <ShieldCheck className="w-3 h-3" /> Active
                              </Badge>
                            )}
                            {admin.mustChangePassword && (
                              <span className="text-[10px] bg-amber-500/10 text-amber-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">Needs Password Change</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <Button
                            variant={admin.isBlocked ? "outline" : "destructive"}
                            size="sm"
                            onClick={() => confirmToggleBlock(admin)}
                            className={admin.isBlocked ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50 gap-2" : "gap-2"}
                          >
                            {admin.isBlocked ? <Unlock className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                            {admin.isBlocked ? "Restore Access" : "Block User"}
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

      {/* Credential Display Dialog */}
      <Dialog open={!!newAdminCreds} onOpenChange={(open) => !open && setNewAdminCreds(null)}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-slate-950">
          <DialogHeader className="items-center text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <KeyRound className="w-6 h-6 text-emerald-600" />
            </div>
            <DialogTitle className="text-xl">Admin Created Successfully</DialogTitle>
            <DialogDescription>
              Share these temporary credentials with the new administrator.
            </DialogDescription>
          </DialogHeader>
          {newAdminCreds && (
            <div className="space-y-4 pt-4">
              <div className="p-4 rounded-xl border-2 border-dashed border-emerald-200 bg-emerald-50/50 space-y-3">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Email Address</span>
                  <span className="font-mono text-sm break-all">{newAdminCreds.email}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Temporary Password</span>
                  <span className="font-mono text-xl font-bold text-emerald-700 select-all">{newAdminCreds.tempPassword}</span>
                </div>
              </div>
              <Button onClick={copyToClipboard} className="w-full h-11 gap-2" variant={copied ? "secondary" : "default"}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied to Clipboard!" : "Copy Credentials"}
              </Button>
              <p className="text-[10px] text-center text-muted-foreground uppercase font-bold tracking-widest">
                Security Warning: Share via encrypted channels only
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Block/Unblock Confirmation */}
      <AlertDialog open={!!blockingAdmin} onOpenChange={(open) => !open && setBlockingAdmin(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {blockingAdmin?.isBlocked ? "Unblock" : "Block"} Administrator?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {blockingAdmin?.isBlocked 
                ? `This will restore system access for ${blockingAdmin?.name}. They will be able to log in and perform actions according to their role.`
                : `This will immediately revoke system access for ${blockingAdmin?.name}. All active sessions will eventually be invalidated.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleToggleBlock}
              className={blockingAdmin?.isBlocked ? "bg-emerald-600 hover:bg-emerald-700" : "bg-destructive hover:bg-destructive/90"}
            >
              Confirm {blockingAdmin?.isBlocked ? "Restore" : "Block"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageAdmins;

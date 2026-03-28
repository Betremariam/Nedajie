import React, { useEffect, useState } from "react";
import { getAllAdmins, createRegionalSuperAdmin } from "../../services/api";
import {
  User,
  Mail,
  MapPin,
  KeyRound,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Loader2,
  ShieldAlert,
  Users,
  Search,
} from "lucide-react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Label } from "../../components/ui/Label";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/Alert";
import { Switch } from "../../components/ui/Switch";

const ManageSuperAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", region: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [newCreds, setNewCreds] = useState(null);
  const [copied, setCopied] = useState(false);
  const [sendAlert, setSendAlert] = useState(true);
  const [search, setSearch] = useState("");

  const fetchAdmins = async () => {
    try {
      const res = await getAllAdmins();
      setAdmins(res.data.filter((a) => a.role === "regionalSuperAdmin"));
    } catch {
      setError("Failed to load admin list.");
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setNewCreds(null);
    setLoading(true);
    try {
      const res = await createRegionalSuperAdmin(form);
      setSuccess("Regional Super Admin created successfully.");
      setNewCreds({ email: form.email, tempPassword: res.data.tempPassword });
      setForm({ name: "", email: "", region: "" });
      fetchAdmins();
    } catch (err) {
      setError(err?.response?.data?.msg || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (newCreds) {
      navigator.clipboard.writeText(`Email: ${newCreds.email}\nPassword: ${newCreds.tempPassword}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const filtered = admins.filter(
    (a) =>
      a.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.email?.toLowerCase().includes(search.toLowerCase()) ||
      a.region?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto font-sans">

      {/* Alerts */}
      {success && !newCreds && (
        <Alert className="border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
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

      {/* Credentials Card */}
      {newCreds && (
        <Alert className="border-primary/20 bg-primary/5">
          <KeyRound className="h-4 w-4 text-primary" />
          <AlertTitle className="font-bold text-primary">Credentials Generated</AlertTitle>
          <AlertDescription className="mt-3 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="bg-card border border-border rounded-xl px-4 py-3 flex-1">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Email</p>
                <p className="text-[14px] font-bold text-foreground">{newCreds.email}</p>
              </div>
              <div className="bg-card border border-border rounded-xl px-4 py-3 flex-1">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Temp Password</p>
                <p className="text-[18px] font-black font-mono text-primary tracking-wider">{newCreds.tempPassword}</p>
              </div>
            </div>
            <Button onClick={copyToClipboard} size="sm" className="bg-primary hover:bg-primary/90 border-0 gap-2 h-9 px-5 text-[13px] font-semibold text-primary-foreground">
              {copied ? <><Check className="w-4 h-4" /> Copied</> : <><Copy className="w-4 h-4" /> Copy Credentials</>}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Registration Form Card */}
      <div className="bg-card rounded-[24px] shadow-sm border border-border p-8 md:p-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-border">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-[16px] bg-sidebar-foreground flex items-center justify-center text-sidebar-background shadow-md">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">Super Admin Registry</h1>
              <p className="text-muted-foreground text-[13px] font-medium">Provision regional super administrators</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">

            {/* Full Name */}
            <div className="space-y-3">
              <Label className="text-[13px] font-bold text-foreground ml-0.5">Full Name</Label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  className="h-12 pl-12 rounded-xl border-border bg-muted/30 font-medium text-[14px] focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all text-foreground"
                  placeholder="Admin's full name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-3">
              <Label className="text-[13px] font-bold text-foreground ml-0.5">Email Address</Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  type="email"
                  className="h-12 pl-12 rounded-xl border-border bg-muted/30 font-medium text-[14px] focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all text-foreground"
                  placeholder="admin@domain.com"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Region */}
            <div className="space-y-3">
              <Label className="text-[13px] font-bold text-foreground ml-0.5 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Region / Zone
              </Label>
              <div className="relative group">
                <Input
                  className="h-12 pl-4 rounded-xl border-border bg-muted/30 font-medium text-[14px] focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all text-foreground"
                  placeholder="e.g., Addis Ababa Region"
                  name="region"
                  value={form.region}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

          </div>

          {/* Bottom Status + Submit */}
          <div className="pt-8 pb-4 border-t border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="flex flex-col gap-3 min-w-[200px]">
              <Button disabled={loading} className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-[13px] rounded-xl shadow-md border-0 gap-2" type="submit">
                {loading ? "Creating..." : "Create Super Admin"}
                {!loading && <ArrowRight className="w-4 h-4 ml-1 opacity-90" />}
              </Button>
              <Button type="button" variant="outline" className="w-full h-11 bg-card hover:bg-muted/50 text-foreground font-bold border-border rounded-xl" onClick={() => setForm({ name: "", email: "", region: "" })}>
                Clear
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Admins Table Card */}
      <div className="bg-card rounded-[24px] shadow-sm border border-border overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 md:p-8 pb-4 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-[12px] bg-sidebar-foreground flex items-center justify-center text-sidebar-background shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-foreground tracking-tight">Regional Super Admins</h2>
              <p className="text-muted-foreground text-[13px] font-medium">{admins.length} admin{admins.length !== 1 ? "s" : ""} registered</p>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search admins..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 pl-11 rounded-xl border-border bg-muted/30 font-medium text-[13px] w-full sm:w-[220px] text-foreground"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-muted-foreground gap-3">
            <Users className="w-10 h-10 opacity-30" />
            <p className="text-[13px] font-medium">{search ? "No admins match your search." : "No super admins registered yet."}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left pl-6 md:pl-8 h-11 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Admin</th>
                  <th className="text-left h-11 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Email</th>
                  <th className="text-left h-11 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Region</th>
                  <th className="text-right pr-6 md:pr-8 h-11 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((admin) => (
                  <tr key={admin._id || admin.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="pl-6 md:pl-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-muted border border-border flex items-center justify-center text-foreground font-bold text-[13px]">
                          {admin.name?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <span className="text-[14px] font-semibold text-foreground">{admin.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-[13px] text-muted-foreground font-medium">{admin.email}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground/50" />
                        {admin.region || "—"}
                      </div>
                    </td>
                    <td className="pr-6 md:pr-8 py-4 text-right">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageSuperAdmins;

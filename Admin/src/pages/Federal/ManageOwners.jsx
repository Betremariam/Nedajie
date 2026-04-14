import React, { useEffect, useState } from "react";
import { getAllAdmins, createOwner } from "../../services/api";
import {
  User,
  Mail,
  MapPin,
  Building,
  KeyRound,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Loader2,
  Building2,
  Users,
  Search,
} from "lucide-react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Label } from "../../components/ui/Label";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/Alert";
import { Switch } from "../../components/ui/Switch";

const ManageOwners = () => {
  const [owners, setOwners] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", companyName: "", region: "", document: null });
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [newCreds, setNewCreds] = useState(null);
  const [copied, setCopied] = useState(false);
  const [sendAlert, setSendAlert] = useState(true);
  const [search, setSearch] = useState("");

  const fetchOwners = async () => {
    try {
      const res = await getAllAdmins();
      setOwners(res.data.filter((a) => a.role === "stationOwner"));
    } catch {
      setError("Failed to load owners.");
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => setForm({ ...form, document: e.target.files[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setNewCreds(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("companyName", form.companyName);
    formData.append("region", form.region);
    if (form.document) formData.append("document", form.document);

    try {
      const res = await createOwner(formData);
      setSuccess("Station owner created successfully.");
      setNewCreds({ email: form.email, tempPassword: res.data.tempPassword });
      setForm({ name: "", email: "", companyName: "", region: "", document: null });
      // Reset file input visually
      const fileInput = document.getElementById("documentUpload");
      if (fileInput) fileInput.value = "";
      fetchOwners();
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

  const filtered = owners.filter(
    (o) =>
      o.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.email?.toLowerCase().includes(search.toLowerCase()) ||
      o.companyName?.toLowerCase().includes(search.toLowerCase()) ||
      o.region?.toLowerCase().includes(search.toLowerCase())
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
            <div className="w-14 h-14 rounded-[16px] bg-muted/50 border border-border flex items-center justify-center text-foreground shadow-sm">
              <Building2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">Owner Registry</h1>
              <p className="text-muted-foreground text-[13px] font-medium">Register fuel station proprietors and entities</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" className="h-10 px-6 rounded-xl text-muted-foreground border-border font-semibold hover:bg-muted/50">
              Cancel
            </Button>
            <Button type="button" onClick={handleSubmit} disabled={loading} className="h-10 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 font-semibold border-0">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Owner"}
            </Button>
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
                  placeholder="Owner's full name"
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
                  placeholder="owner@company.com"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Company Name */}
            <div className="space-y-3">
              <Label className="text-[13px] font-bold text-foreground ml-0.5 flex items-center gap-2">
                <Building className="w-4 h-4 text-primary" />
                Company Name
              </Label>
              <div className="relative group">
                <Input
                  className="h-12 pl-4 rounded-xl border-border bg-muted/30 font-medium text-[14px] focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all text-foreground"
                  placeholder="Company or business name"
                  name="companyName"
                  value={form.companyName}
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
                  placeholder="e.g., Addis Ababa"
                  name="region"
                  value={form.region}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Document Upload */}
            <div className="space-y-3">
              <Label className="text-[13px] font-bold text-foreground ml-0.5 flex items-center gap-2">
                Document Upload (PDF/Image)
              </Label>
              <div className="relative group">
                <Input
                  type="file"
                  id="documentUpload"
                  className="h-12 pt-3 pl-4 rounded-xl border-border bg-muted/30 font-medium text-[14px] focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all text-foreground cursor-pointer"
                  onChange={handleFileChange}
                  accept=".pdf,image/*"
                  required
                />
              </div>
            </div>

          </div>

          {/* Bottom Status + Submit */}
          <div className="pt-8 pb-4 border-t border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="flex flex-col gap-6 w-full max-w-lg">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-muted-foreground" />
                <h3 className="text-[14px] font-bold text-foreground">Owner Settings</h3>
              </div>
              <div className="flex items-start gap-3 pl-1">
                <Switch id="send-alert-owner" checked={sendAlert} onCheckedChange={setSendAlert} className="mt-1 data-[state=checked]:bg-primary" />
                <div className="flex flex-col gap-1 text-left">
                  <Label htmlFor="send-alert-owner" className="text-[13px] font-semibold text-foreground cursor-pointer">Send credentials alert</Label>
                  <span className="text-[11px] text-muted-foreground font-medium leading-tight max-w-[200px]">Notify owner via email with login credentials</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 min-w-[200px]">
              <Button disabled={loading} className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-[13px] rounded-xl shadow-md border-0 gap-2" type="submit">
                {loading ? "Creating..." : "Create Owner"}
                {!loading && <ArrowRight className="w-4 h-4 ml-1 opacity-90" />}
              </Button>
              <Button type="button" variant="outline" className="w-full h-11 bg-card hover:bg-muted/50 text-foreground font-bold border-border rounded-xl" onClick={() => {
                setForm({ name: "", email: "", companyName: "", region: "", document: null });
                const fileInput = document.getElementById("documentUpload");
                if (fileInput) fileInput.value = "";
              }}>
                Clear
              </Button>
            </div>
          </div>
        </form>
      </div>

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

        {filtered.length === 0 ? (
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
                  <th className="text-left h-11 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Company</th>
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
                        {owner.companyName || "—"}
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground/50" />
                        {owner.region || "—"}
                      </div>
                    </td>
                    <td className="pr-6 md:pr-8 py-4 text-right">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Active
                      </span>
                    </td>
                    <td className="pr-6 md:pr-8 py-4 text-right">
                      <Button variant="outline" size="sm" onClick={() => setSelectedOwner(owner)} className="h-8 px-3 rounded-lg text-xs font-semibold">View</Button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-lg border border-border p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h3 className="text-lg font-bold text-foreground">Owner Details</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedOwner(null)} className="h-8 w-8 rounded-full p-0">✕</Button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase">Full Name</p>
                <p className="text-sm font-medium text-foreground">{selectedOwner.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase">Company Name</p>
                <p className="text-sm font-medium text-foreground">{selectedOwner.companyName || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase">Email Address</p>
                <p className="text-sm font-medium text-foreground">{selectedOwner.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase">Region / Zone</p>
                <p className="text-sm font-medium text-foreground">{selectedOwner.region || "—"}</p>
              </div>
              {selectedOwner.documentPath && (
                <div className="pt-2">
                  <p className="text-xs text-muted-foreground font-semibold uppercase mb-2">Uploaded Document</p>
                  <a
                    href={`http://localhost:5000/${selectedOwner.documentPath.replace(/\\/g, '/')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-9 px-4 rounded-xl bg-primary/10 text-primary font-semibold text-sm hover:bg-primary/20 transition-colors"
                  >
                    View Document
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageOwners;

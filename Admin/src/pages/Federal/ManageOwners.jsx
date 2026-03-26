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
  const [form, setForm] = useState({ name: "", email: "", companyName: "", region: "" });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setNewCreds(null);
    setLoading(true);
    try {
      const res = await createOwner(form);
      setSuccess("Station owner created successfully.");
      setNewCreds({ email: form.email, tempPassword: res.data.tempPassword });
      setForm({ name: "", email: "", companyName: "", region: "" });
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
        <Alert className="border-emerald-500/50 bg-emerald-50 text-emerald-800">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle className="font-bold">Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-bold">Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Credentials Card */}
      {newCreds && (
        <Alert className="border-blue-200 bg-blue-50">
          <KeyRound className="h-4 w-4 text-[#0d6efd]" />
          <AlertTitle className="font-bold text-[#0d6efd]">Credentials Generated</AlertTitle>
          <AlertDescription className="mt-3 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="bg-white border border-blue-100 rounded-xl px-4 py-3 flex-1">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Email</p>
                <p className="text-[14px] font-bold text-slate-800">{newCreds.email}</p>
              </div>
              <div className="bg-white border border-blue-100 rounded-xl px-4 py-3 flex-1">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Temp Password</p>
                <p className="text-[18px] font-black font-mono text-[#0d6efd] tracking-wider">{newCreds.tempPassword}</p>
              </div>
            </div>
            <Button onClick={copyToClipboard} size="sm" className="bg-[#0d6efd] hover:bg-blue-700 border-0 gap-2 h-9 px-5 text-[13px] font-semibold">
              {copied ? <><Check className="w-4 h-4" /> Copied</> : <><Copy className="w-4 h-4" /> Copy Credentials</>}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Registration Form Card */}
      <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 p-8 md:p-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-slate-100">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-[16px] bg-[#0f172a] flex items-center justify-center text-white shadow-md">
              <Building2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Owner Registry</h1>
              <p className="text-slate-500 text-[13px] font-medium">Register fuel station proprietors and entities</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" className="h-10 px-6 rounded-xl text-slate-600 border-slate-200 font-semibold hover:bg-slate-50">
              Cancel
            </Button>
            <Button type="button" onClick={handleSubmit} disabled={loading} className="h-10 px-6 rounded-xl bg-[#0d6efd] hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 font-semibold border-0">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Owner"}
            </Button>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">

            {/* Full Name */}
            <div className="space-y-3">
              <Label className="text-[13px] font-bold text-slate-800 ml-0.5">Full Name</Label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#0d6efd] transition-colors" />
                <Input
                  className="h-12 pl-12 rounded-xl border-slate-200 bg-slate-50/50 font-medium text-[14px] focus-visible:ring-1 focus-visible:ring-[#0d6efd] focus-visible:border-[#0d6efd] transition-all"
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
              <Label className="text-[13px] font-bold text-slate-800 ml-0.5">Email Address</Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#0d6efd] transition-colors" />
                <Input
                  type="email"
                  className="h-12 pl-12 rounded-xl border-slate-200 bg-slate-50/50 font-medium text-[14px] focus-visible:ring-1 focus-visible:ring-[#0d6efd] focus-visible:border-[#0d6efd] transition-all"
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
              <Label className="text-[13px] font-bold text-slate-800 ml-0.5 flex items-center gap-2">
                <Building className="w-4 h-4 text-[#0d6efd]" />
                Company Name
              </Label>
              <div className="relative group">
                <Input
                  className="h-12 pl-4 rounded-xl border-slate-200 bg-slate-50/50 font-medium text-[14px] focus-visible:ring-1 focus-visible:ring-[#0d6efd] focus-visible:border-[#0d6efd] transition-all"
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
              <Label className="text-[13px] font-bold text-slate-800 ml-0.5 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#0d6efd]" />
                Region / Zone
              </Label>
              <div className="relative group">
                <Input
                  className="h-12 pl-4 rounded-xl border-slate-200 bg-slate-50/50 font-medium text-[14px] focus-visible:ring-1 focus-visible:ring-[#0d6efd] focus-visible:border-[#0d6efd] transition-all"
                  placeholder="e.g., Addis Ababa"
                  name="region"
                  value={form.region}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

          </div>

          {/* Bottom Status + Submit */}
          <div className="pt-8 pb-4 border-t border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="flex flex-col gap-6 w-full max-w-lg">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-slate-600" />
                <h3 className="text-[14px] font-bold text-slate-800">Owner Settings</h3>
              </div>
              <div className="flex items-start gap-3 pl-1">
                <Switch id="send-alert-owner" checked={sendAlert} onCheckedChange={setSendAlert} className="mt-1 data-[state=checked]:bg-[#0d6efd]" />
                <div className="flex flex-col gap-1 text-left">
                  <Label htmlFor="send-alert-owner" className="text-[13px] font-semibold text-slate-800 cursor-pointer">Send credentials alert</Label>
                  <span className="text-[11px] text-slate-500 font-medium leading-tight max-w-[200px]">Notify owner via email with login credentials</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 min-w-[200px]">
              <Button disabled={loading} className="w-full h-11 bg-[#0d6efd] hover:bg-blue-700 text-white font-semibold text-[13px] rounded-xl shadow-md border-0 gap-2" type="submit">
                {loading ? "Creating..." : "Create Owner"}
                {!loading && <ArrowRight className="w-4 h-4 ml-1 opacity-90" />}
              </Button>
              <Button type="button" variant="outline" className="w-full h-11 bg-white hover:bg-slate-50 text-slate-800 font-bold border-slate-200 rounded-xl" onClick={() => setForm({ name: "", email: "", companyName: "", region: "" })}>
                Clear
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Owners Table Card */}
      <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 md:p-8 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-[12px] bg-[#0f172a] flex items-center justify-center text-white shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">Registered Owners</h2>
              <p className="text-slate-500 text-[13px] font-medium">{owners.length} owner{owners.length !== 1 ? "s" : ""} in the system</p>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search owners..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 pl-11 rounded-xl border-slate-200 bg-slate-50/50 font-medium text-[13px] w-full sm:w-[220px]"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Building2 className="w-10 h-10 opacity-30" />
            <p className="text-[13px] font-medium">{search ? "No owners match your search." : "No owners registered yet."}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left pl-6 md:pl-8 h-11 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Owner</th>
                  <th className="text-left h-11 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="text-left h-11 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Company</th>
                  <th className="text-left h-11 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Region</th>
                  <th className="text-right pr-6 md:pr-8 h-11 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((owner) => (
                  <tr key={owner._id || owner.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70 transition-colors">
                    <td className="pl-6 md:pl-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-[13px]">
                          {owner.name?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <span className="text-[14px] font-semibold text-slate-800">{owner.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-[13px] text-slate-500 font-medium">{owner.email}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-1.5 text-[13px] font-medium text-slate-700">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        {owner.companyName || "—"}
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-1.5 text-[13px] font-medium text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {owner.region || "—"}
                      </div>
                    </td>
                    <td className="pr-6 md:pr-8 py-4 text-right">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
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

export default ManageOwners;

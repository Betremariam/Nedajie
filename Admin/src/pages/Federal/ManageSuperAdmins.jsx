import React, { useState } from "react";
import { createRegionalSuperAdmin } from "../../services/api";
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
  Upload,
  FileText,
} from "lucide-react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Label } from "../../components/ui/Label";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/Alert";
import { Switch } from "../../components/ui/Switch";
import { useTranslation } from "react-i18next";

const REGIONS = [
  "Addis Ababa",
  "Afar",
  "Amhara",
  "Benishangul-Gumuz",
  "Central Ethiopia",
  "Dire Dawa",
  "Gambella",
  "Harari",
  "Oromia",
  "Sidama",
  "Somali",
  "South Ethiopia",
  "Southwest Ethiopia",
  "Tigray",
];

const ManageSuperAdmins = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", region: "", document: null });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [newCreds, setNewCreds] = useState(null);
  const [copied, setCopied] = useState(false);
  const [sendAlert, setSendAlert] = useState(true);

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
    formData.append("region", form.region);
    if (form.document) formData.append("document", form.document);

    try {
      const res = await createRegionalSuperAdmin(formData);
      setSuccess(t("registrationSuccess"));
      setNewCreds({ email: form.email, tempPassword: res.data.tempPassword });
      setForm({ name: "", email: "", region: "", document: null });
      // Reset file input visually
      const fileInput = document.getElementById("documentUpload");
      if (fileInput) fileInput.value = "";
    } catch (err) {
      setError(err?.response?.data?.msg || t("registrationFailed"));
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

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto font-sans">

      {/* Alerts */}
      {success && !newCreds && (
        <Alert className="border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle className="font-bold">{t("successLabel")}</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-bold">{t("errorLabel")}</AlertTitle>
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
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">{t("superAdminRegistry")}</h1>
              <p className="text-muted-foreground text-[13px] font-medium">{t("superAdminRegistryDesc")}</p>
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

            <div className="space-y-3">
              <Label className="text-[13px] font-bold text-foreground ml-0.5 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Region
              </Label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
                <select
                  className="w-full h-12 pl-12 pr-4 rounded-xl border border-border bg-muted/30 font-medium text-[14px] focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-foreground appearance-none"
                  name="region"
                  value={form.region}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select Region</option>
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Document Upload */}
            <div className="md:col-span-2 space-y-3">
              <Label className="text-[13px] font-bold text-foreground ml-0.5 flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                OFFICIAL APPOINTMENT/AUTHORIZATION LETTER (PDF/IMAGE)
              </Label>
              <div className={`relative border-2 border-dashed rounded-2xl p-6 transition-all ${form.document ? 'border-primary/50 bg-primary/5' : 'border-border bg-muted/30 hover:bg-muted/50'}`}>
                <input
                  type="file"
                  id="documentUpload"
                  name="document"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".pdf,image/*"
                  required
                />
                <div className="flex flex-col items-center justify-center gap-2">
                  <Upload className={`w-8 h-8 ${form.document ? 'text-primary' : 'text-muted-foreground'}`} />
                  <p className="text-[13px] font-semibold text-foreground text-center">
                    {form.document ? form.document.name : "Click or drag to upload authorization letter"}
                  </p>
                  <p className="text-[11px] text-muted-foreground uppercase font-bold tracking-widest">
                    Maximum file size: 10MB
                  </p>
                </div>
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
              <Button type="button" variant="outline" className="w-full h-11 bg-card hover:bg-muted/50 text-foreground font-bold border-border rounded-xl" onClick={() => {
                setForm({ name: "", email: "", region: "", document: null });
                const fileInput = document.getElementById("documentUpload");
                if (fileInput) fileInput.value = "";
              }}>
                Clear
              </Button>
            </div>
          </div>
        </form>
      </div>

    </div>
  );
};

export default ManageSuperAdmins;

import React, { useState, useEffect } from "react";
import API from "../../services/api.js"; 
import { 
  UserPlus, 
  Phone, 
  Upload, 
  ShieldCheck, 
  AlertCircle,
  Loader2,
  Fingerprint,
  Users,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  List
} from "lucide-react";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Button } from "../../components/ui/Button";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/Alert";
import { Badge } from "../../components/ui/Badge";
import { Switch } from "../../components/ui/Switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/Tabs";
import { cn } from "../../lib/utils";
import { useTranslation } from "react-i18next";

const AttendantManagement = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("register");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    document: null,
  });
  const [attendants, setAttendants] = useState([]);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchAttendants = async () => {
    setFetching(true);
    try {
      const res = await API.get("/owners/my-attendants");
      setAttendants(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchAttendants();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "document") {
      setForm({ ...form, document: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setGeneratedPassword("");
    setLoading(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("phone", form.phone);
    formData.append("document", form.document);

    try {
      const res = await API.post("/owners/attendant", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Attendant registered successfully. Awaiting approval.");
      setForm({
        name: "",
        phone: "",
        document: null,
      });
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
      fetchAttendants();
      
      setTimeout(() => setActiveTab("list"), 1500);
    } catch (err) {
      setError(err?.response?.data?.msg || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id) => {
    try {
      await API.patch(`/owners/attendant/${id}/toggle`);
      fetchAttendants();
    } catch (err) {
      console.error("Toggle Error:", err);
    }
  };

  const generatePassword = async (id) => {
    try {
      const res = await API.post(`/owners/attendant/${id}/generate-password`);
      setGeneratedPassword(res.data.generatedPassword);
      setSuccess("Password generated successfully!");
    } catch (err) {
      setError(err?.response?.data?.msg || "Failed to generate password.");
    }
  };

  const clearForm = () => {
    setForm({ name: "", phone: "", document: null });
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto font-sans">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-14 bg-muted/30 rounded-xl p-1.5">
          <TabsTrigger value="register" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm font-semibold text-[14px] gap-2 h-full">
            <UserPlus className="w-5 h-5" />
            {t("registerAttendant")}
          </TabsTrigger>
          <TabsTrigger value="list" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm font-semibold text-[14px] gap-2 h-full">
            <List className="w-5 h-5" />
            {t("viewAttendants")} ({attendants.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="register" className="mt-8">
          {(success || error) && (
            <Alert className={cn(
              "rounded-2xl mb-6",
              success ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600" : "border-destructive/50 bg-destructive/10"
            )}>
              {success ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <AlertCircle className="h-4 w-4" />}
              <AlertTitle className="font-bold">
                {success ? t("successLabel") : t("errorLabel")}
              </AlertTitle>
              <AlertDescription className="font-medium text-[13px]">{success || error}</AlertDescription>
            </Alert>
          )}

          <div className="bg-card rounded-[24px] shadow-sm border border-border p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-border">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-[16px] bg-muted/50 border border-border flex items-center justify-center text-foreground shadow-sm">
                  <UserPlus className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold text-foreground tracking-tight">{t("attendantRegistry")}</h1>
                  <p className="text-muted-foreground text-[13px] font-medium">{t("registerFuelStationAttendants")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button type="button" variant="outline" className="h-10 px-6 rounded-xl text-muted-foreground border-border font-semibold hover:bg-muted/50" onClick={clearForm}>
                  {t("clear")}
                </Button>
                <Button type="button" onClick={handleSubmit} disabled={loading} className="h-10 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 font-semibold border-0">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t("registerAttendantBtn")}
                </Button>
              </div>
            </div>

            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                <div className="space-y-3">
                  <Label className="text-[13px] font-bold text-foreground ml-0.5">{t("fullName")}</Label>
                  <div className="relative group">
                    <Input
                      className="h-12 rounded-xl border-border bg-muted/30 font-medium text-[14px] focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all text-foreground"
                      placeholder={t("attendantsFullName")}
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-[13px] font-bold text-foreground ml-0.5">{t("phoneNumber")}</Label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      className="h-12 pl-12 rounded-xl border-border bg-muted/30 font-medium text-[14px] focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all text-foreground"
                      placeholder="+251-XXX-XXXX"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 space-y-3">
                  <Label className="text-[13px] font-bold text-foreground ml-0.5">{t("employmentProof")}</Label>
                  <div className={`relative border-2 border-dashed rounded-2xl p-8 transition-all ${form.document ? 'border-primary/50 bg-primary/5' : 'border-border bg-muted/30 hover:bg-muted/50'}`}>
                    <input
                      type="file"
                      name="document"
                      onChange={handleChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept=".pdf,image/*"
                      required
                    />
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Upload className={`w-8 h-8 ${form.document ? 'text-primary' : 'text-muted-foreground'}`} />
                      <div className="text-center">
                        <p className="text-[13px] font-semibold text-foreground">
                          {form.document ? form.document.name : t("clickToUpload")}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-1">{t("pdfOrImage")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-end gap-4">
                <Button type="button" variant="outline" className="w-full md:w-auto h-11 bg-card hover:bg-muted/50 text-foreground font-bold border-border rounded-xl px-8" onClick={clearForm}>
                  {t("clearForm")}
                </Button>
                <Button disabled={loading} className="w-full md:w-auto h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-[13px] rounded-xl shadow-md border-0 gap-2 px-8" type="submit">
                  {loading ? t("registering") : t("registerAttendantBtn")}
                  {!loading && <ArrowRight className="w-4 h-4 ml-1 opacity-90" />}
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-8">
          {generatedPassword && (
            <Alert className="border-blue-500/50 bg-blue-500/5 text-blue-600 rounded-2xl mb-6">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
              <AlertTitle className="font-bold text-[11px] uppercase tracking-widest text-blue-600">{t("passwordGenerated")}</AlertTitle>
              <AlertDescription className="mt-2 text-[13px] flex items-center justify-between gap-4">
                <span className="font-medium">{t("providePasswordToAttendant")}</span>
                <div className="flex items-center gap-2 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20">
                  <code className="font-bold tracking-widest text-sm">{showPwd ? generatedPassword : "••••••••"}</code>
                  <button onClick={() => setShowPwd(!showPwd)} className="text-blue-600 hover:text-blue-700">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="bg-card rounded-[24px] shadow-sm border border-border overflow-hidden">
            <div className="bg-muted/30 border-b border-border/20 py-6 px-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{t("registeredAttendants")}</h2>
                    <p className="text-[13px] text-muted-foreground font-medium">Manage your station attendants</p>
                  </div>
                </div>
                <Badge variant="outline" className="rounded-full px-3 py-1 font-bold uppercase tracking-tighter bg-emerald-50 text-emerald-600 border-emerald-200">
                  {attendants.length} {t("total")}
                </Badge>
              </div>
            </div>
            <div className="p-0">
              {fetching ? (
                <div className="p-20 flex flex-col items-center justify-center gap-4 text-muted-foreground/40 font-bold uppercase tracking-widest text-[11px]">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  {t("loadingAttendants")}
                </div>
              ) : attendants.length === 0 ? (
                <div className="p-20 flex flex-col items-center justify-center gap-4 text-muted-foreground/40 font-bold uppercase tracking-widest text-[11px]">
                  <Users className="w-8 h-8 opacity-20" />
                  {t("noAttendantsRegistered")}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/10">
                      <TableHead className="py-5 font-bold text-[11px] uppercase tracking-widest">{t("attendantCol")}</TableHead>
                      <TableHead className="font-bold text-[11px] uppercase tracking-widest">{t("stationCity")}</TableHead>
                      <TableHead className="font-bold text-[11px] uppercase tracking-widest">{t("approval")}</TableHead>
                      <TableHead className="text-right font-bold text-[11px] uppercase tracking-widest px-10">{t("access")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendants.map((at) => (
                      <TableRow key={at.id} className="hover:bg-muted/5 transition-colors border-border/10">
                        <TableCell className="py-5">
                          <div className="flex flex-col">
                            <span className="font-bold text-[14px]">{at.name}</span>
                            <span className="text-[12px] font-medium text-muted-foreground">{at.phone}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-semibold text-[13px]">{at.stationName}</span>
                            <span className="text-[11px] font-medium text-muted-foreground/60">{at.city}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {at.isApproved ? (
                            <Badge className="bg-emerald-500/10 text-emerald-600 border-none shadow-none text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">{t("approved")}</Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 border-none shadow-none text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">{t("pending")}</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right px-10">
                          <div className="flex items-center justify-end gap-3">
                            {at.isApproved && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => generatePassword(at.id)}
                                className="h-8 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider"
                              >
                                <Fingerprint className="w-3.5 h-3.5 mr-1" />
                                {t("generatePassword")}
                              </Button>
                            )}
                            <span className={cn(
                              "text-[10px] font-bold uppercase tracking-widest",
                              at.isEnabled ? "text-emerald-500" : "text-muted-foreground/40"
                            )}>
                              {at.isEnabled ? t("active") : t("revoked")}
                            </span>
                            <Switch checked={at.isEnabled} onCheckedChange={() => toggleStatus(at.id)} className="data-[state=checked]:bg-emerald-500" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AttendantManagement;

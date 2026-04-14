import React, { useState, useEffect } from "react";
import { addFuelDelivery, getAllFederalFuelDeliveries } from "../../services/api";
import {
  Truck,
  Calendar,
  User,
  MapPin,
  Building,
  Hash,
  Droplets,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Search,
  History,
} from "lucide-react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Label } from "../../components/ui/Label";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/Alert";

const FuelDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [form, setForm] = useState({
    date: "",
    customer: "",
    destination: "",
    citter: "",
    fdcNo: "",
    volume: "",
    region: "",
    fuelType: "diesel",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchDeliveries = async () => {
    try {
      const res = await getAllFederalFuelDeliveries();
      setDeliveries(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    if (Object.values(form).some((v) => !v)) {
      setError("All fields are required.");
      return;
    }
    setLoading(true);
    try {
      await addFuelDelivery(form);
      setSuccess("Fuel delivery recorded successfully.");
      setForm({ date: "", customer: "", destination: "", citter: "", fdcNo: "", volume: "", region: "", fuelType: "diesel" });
      fetchDeliveries();
    } catch (err) {
      setError(err?.response?.data?.msg || "Failed to record delivery.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = deliveries.filter(
    (d) =>
      d.customer?.toLowerCase().includes(search.toLowerCase()) ||
      d.destination?.toLowerCase().includes(search.toLowerCase()) ||
      d.region?.toLowerCase().includes(search.toLowerCase()) ||
      d.fdcNo?.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (status) => {
    if (status === "OWNER_ACCEPTED") return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400";
    if (status === "SUPERADMIN_ACCEPTED") return "bg-primary/10 text-primary border-primary/20";
    return "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400";
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto font-sans">

      {/* Alerts */}
      {success && (
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

      {/* Entry Form Card */}
      <div className="bg-card rounded-[24px] shadow-sm border border-border p-8 md:p-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-border">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-[16px] bg-muted/50 border border-border flex items-center justify-center text-foreground shadow-sm">
              <Truck className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">Fuel Deliveries</h1>
              <p className="text-muted-foreground text-[13px] font-medium">Record and track national fuel dispatches</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" className="h-10 px-6 rounded-xl text-muted-foreground border-border font-semibold hover:bg-muted/50">
              Cancel
            </Button>
            <Button type="button" onClick={handleSubmit} disabled={loading} className="h-10 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 font-semibold border-0">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Record Delivery"}
            </Button>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">

            {/* Date */}
            <div className="space-y-3">
              <Label className="text-[13px] font-bold text-foreground ml-0.5 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Delivery Date
              </Label>
              <Input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="h-12 pl-4 rounded-xl border-border bg-muted/30 font-medium text-[14px] focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all text-foreground [color-scheme:light] dark:[color-scheme:dark]"
                required
              />
            </div>

            {/* Customer */}
            <div className="space-y-3">
              <Label className="text-[13px] font-bold text-foreground ml-0.5">Customer / Recipient</Label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  className="h-12 pl-12 rounded-xl border-border bg-muted/30 font-medium text-[14px] focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all text-foreground"
                  placeholder="Owner or entity name"
                  name="customer"
                  value={form.customer}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Destination */}
            <div className="space-y-3">
              <Label className="text-[13px] font-bold text-foreground ml-0.5 flex items-center gap-2">
                <Building className="w-4 h-4 text-primary" />
                Destination (Station)
              </Label>
              <Input
                className="h-12 pl-4 rounded-xl border-border bg-muted/30 font-medium text-[14px] focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all text-foreground"
                placeholder="e.g., Station A"
                name="destination"
                value={form.destination}
                onChange={handleChange}
                required
              />
            </div>

            {/* Sub-City / Citter */}
            <div className="space-y-3">
              <Label className="text-[13px] font-bold text-foreground ml-0.5 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Sub-City
              </Label>
              <Input
                className="h-12 pl-4 rounded-xl border-border bg-muted/30 font-medium text-[14px] focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all text-foreground"
                placeholder="e.g., Bole"
                name="citter"
                value={form.citter}
                onChange={handleChange}
                required
              />
            </div>

            {/* FDC No */}
            <div className="space-y-3">
              <Label className="text-[13px] font-bold text-foreground ml-0.5 flex items-center gap-2">
                <Hash className="w-4 h-4 text-primary" />
                FDC Number
              </Label>
              <Input
                className="h-12 pl-4 rounded-xl border-border bg-muted/30 font-mono font-medium text-[14px] focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all text-foreground uppercase"
                placeholder="FDC-0000"
                name="fdcNo"
                value={form.fdcNo}
                onChange={handleChange}
                required
              />
            </div>

            {/* Volume */}
            <div className="space-y-3">
              <Label className="text-[13px] font-bold text-foreground ml-0.5 flex items-center gap-2">
                <Droplets className="w-4 h-4 text-primary" />
                Volume (Liters)
              </Label>
              <Input
                type="number"
                className="h-12 pl-4 rounded-xl border-border bg-muted/30 font-bold text-[14px] focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all text-foreground"
                placeholder="e.g., 5000"
                name="volume"
                value={form.volume}
                onChange={handleChange}
                required
              />
            </div>

            {/* Region */}
            <div className="space-y-3">
              <Label className="text-[13px] font-bold text-foreground ml-0.5 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Region / Zone
              </Label>
              <Input
                className="h-12 pl-4 rounded-xl border-border bg-muted/30 font-medium text-[14px] focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all text-foreground"
                placeholder="e.g., Addis Ababa"
                name="region"
                value={form.region}
                onChange={handleChange}
                required
              />
            </div>

            {/* Fuel Type */}
            <div className="space-y-3">
              <Label className="text-[13px] font-bold text-foreground ml-0.5 flex items-center gap-2">
                <Droplets className="w-4 h-4 text-primary" />
                Fuel Type
              </Label>
              <div className="relative">
                <select
                  name="fuelType"
                  value={form.fuelType}
                  onChange={handleChange}
                  className="h-12 w-full rounded-xl border border-border bg-muted/30 px-4 font-medium text-[14px] text-foreground appearance-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all cursor-pointer"
                >
                  <option value="diesel">Diesel (D-2)</option>
                  <option value="benzene">Benzene (Gasoline)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-muted-foreground">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Submit */}
          <div className="pt-8 pb-4 border-t border-border flex justify-end gap-3">
            <Button type="button" variant="outline" className="h-11 px-8 bg-card hover:bg-muted/50 text-foreground font-bold border-border rounded-xl" onClick={() => setForm({ date: "", customer: "", destination: "", citter: "", fdcNo: "", volume: "", region: "", fuelType: "diesel" })}>
              Clear
            </Button>
            <Button disabled={loading} className="h-11 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-[13px] rounded-xl shadow-md border-0 gap-2" type="submit">
              {loading ? "Recording..." : "Record Delivery"}
              {!loading && <ArrowRight className="w-4 h-4 ml-1 opacity-90" />}
            </Button>
          </div>
        </form>
      </div>

      {/* Deliveries Table Card */}
      <div className="bg-card rounded-[24px] shadow-sm border border-border overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 md:p-8 pb-4 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-[12px] bg-muted/50 border border-border flex items-center justify-center text-foreground shadow-sm">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-foreground tracking-tight">Delivery History</h2>
              <p className="text-muted-foreground text-[13px] font-medium">{deliveries.length} record{deliveries.length !== 1 ? "s" : ""} found</p>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search deliveries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 pl-11 rounded-xl border-border bg-muted/30 font-medium text-[13px] w-full sm:w-[220px] text-foreground"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-muted-foreground gap-3">
            <Truck className="w-10 h-10 opacity-30" />
            <p className="text-[13px] font-medium">{search ? "No records match your search." : "No deliveries recorded yet."}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left pl-6 md:pl-8 h-11 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Date</th>
                  <th className="text-left h-11 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Customer</th>
                  <th className="text-left h-11 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Destination</th>
                  <th className="text-left h-11 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Volume</th>
                  <th className="text-left h-11 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Region</th>
                  <th className="text-right pr-6 md:pr-8 h-11 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d._id || d.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="pl-6 md:pl-8 py-4">
                      <span className="text-[13px] font-semibold text-foreground tabular-nums">
                        {d.date ? new Date(d.date).toLocaleDateString() : "—"}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex flex-col">
                        <span className="text-[14px] font-semibold text-foreground">{d.customer}</span>
                        <span className="text-[11px] font-mono text-muted-foreground mt-0.5">#{d.fdcNo}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-medium text-foreground">{d.destination}</span>
                        <span className="text-[11px] text-muted-foreground font-medium">{d.citter}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-1.5 text-[13px] font-bold text-foreground">
                        <Droplets className={`w-3.5 h-3.5 ${d.fuelType === "benzene" ? "text-primary" : "text-emerald-600 dark:text-emerald-400"}`} />
                        {Number(d.volume).toLocaleString()} L
                      </div>
                      <span className={`text-[10px] font-semibold uppercase ${d.fuelType === "benzene" ? "text-primary" : "text-emerald-600 dark:text-emerald-400"}`}>{d.fuelType}</span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground/50" />
                        {d.region}
                      </div>
                    </td>
                    <td className="pr-6 md:pr-8 py-4 text-right">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border ${statusColor(d.status)}`}>
                        {d.status?.replace(/_/g, " ") || "Pending"}
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

export default FuelDeliveries;

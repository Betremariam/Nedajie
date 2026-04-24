import React, { useState, useEffect } from "react";
import { addFuelDelivery, getAllFederalFuelDeliveries, getAllAdmins, getAllFuelStocks } from "../../services/api";

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
  FileText,
  Upload,
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
    letter: null,
    ownerId: ""
  });
  const [owners, setOwners] = useState([]);
  const [allStations, setAllStations] = useState([]);
  const [filteredOwners, setFilteredOwners] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const [delRes, adminRes, stockRes] = await Promise.all([
        getAllFederalFuelDeliveries(),
        getAllAdmins(),
        getAllFuelStocks()
      ]);
      setDeliveries(delRes.data);
      setOwners(adminRes.data.filter(a => a.role === 'stationOwner'));
      setAllStations(stockRes.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load initial data.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update filtered owners when region changes
  useEffect(() => {
    if (form.region) {
      const filtered = owners.filter(o => o.region === form.region);
      setFilteredOwners(filtered);
      // Reset customer and destination if they are no longer valid
      if (!filtered.find(o => o.name === form.customer)) {
        setForm(prev => ({ ...prev, customer: "", ownerId: "", destination: "" }));
      }
    } else {
      setFilteredOwners([]);
    }
  }, [form.region, owners]);

  // Update filtered stations when customer/owner changes
  useEffect(() => {
    if (form.ownerId) {
      const selectedOwner = owners.find(o => o.id === form.ownerId);
      if (selectedOwner && selectedOwner.stationIds) {
        const stations = allStations.filter(s => selectedOwner.stationIds.includes(s.id));
        setFilteredStations(stations);
      } else {
        setFilteredStations([]);
      }
    } else {
      setFilteredStations([]);
    }
  }, [form.ownerId, allStations, owners]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "letter") {
      setForm({ ...form, letter: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    
    // Check all fields except letter (letter is required but handled separately in FormData check)
    if (Object.keys(form).some((key) => key !== 'letter' && !form[key])) {
      setError("All text fields are required.");
      return;
    }
    if (!form.letter) {
      setError("Assignment letter is required.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        formData.append(key, form[key]);
      });

      await addFuelDelivery(formData);
      setSuccess("Fuel delivery recorded successfully.");
      setForm({ date: "", customer: "", destination: "", citter: "", fdcNo: "", volume: "", region: "", fuelType: "diesel", letter: null, ownerId: "" });
      fetchData();
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
                DATE
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

            {/* Customer (Owner Selection) */}
            <div className="space-y-3">
              <Label className="text-[13px] font-bold text-foreground ml-0.5">CUSTOMER (OWNER)</Label>
              <div className="relative group">
                <select
                  name="ownerId"
                  value={form.ownerId}
                  onChange={(e) => {
                    const owner = owners.find(o => o.id === e.target.value);
                    setForm({ ...form, ownerId: e.target.value, customer: owner ? owner.name : "" });
                  }}
                  className="h-12 w-full pl-4 rounded-xl border border-border bg-muted/30 font-medium text-[14px] text-foreground appearance-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all cursor-pointer"
                  disabled={!form.region}
                  required
                >
                  <option value="" disabled>{form.region ? "Select Owner" : "Select Region First"}</option>
                  {filteredOwners.map((o) => (
                    <option key={o.id} value={o.id}>{o.name} {o.companyName ? `(${o.companyName})` : ''}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-muted-foreground">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Destination (Station Selection) */}
            <div className="space-y-3">
              <Label className="text-[13px] font-bold text-foreground ml-0.5 flex items-center gap-2">
                <Building className="w-4 h-4 text-primary" />
                Destination (Station)
              </Label>
              <div className="relative group">
                <select
                  name="destination"
                  value={form.destination}
                  onChange={handleChange}
                  className="h-12 w-full pl-4 rounded-xl border border-border bg-muted/30 font-medium text-[14px] text-foreground appearance-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all cursor-pointer"
                  disabled={!form.ownerId}
                  required
                >
                  <option value="" disabled>{form.ownerId ? "Select Station" : "Select Owner First"}</option>
                  {filteredStations.map((s) => (
                    <option key={s.id} value={s.stationName}>{s.stationName} ({s.gasType})</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-muted-foreground">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Sub-City / Citter */}
            <div className="space-y-3">
              <Label className="text-[13px] font-bold text-foreground ml-0.5 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Citer
              </Label>
              <Input
                type="number"
                className="h-12 pl-4 rounded-xl border-border bg-muted/30 font-medium text-[14px] focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all text-foreground"
                placeholder="e.g., 20640"
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
                FDC No
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
                Vol 20C
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

            {/* Region Selection */}
            <div className="space-y-3">
              <Label className="text-[13px] font-bold text-foreground ml-0.5 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Region
              </Label>
              <div className="relative group">
                <select
                  name="region"
                  value={form.region}
                  onChange={handleChange}
                  className="h-12 w-full pl-4 rounded-xl border border-border bg-muted/30 font-medium text-[14px] text-foreground appearance-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all cursor-pointer"
                  required
                >
                  <option value="" disabled>Select Region</option>
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-muted-foreground">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
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

            {/* Assignment Letter Upload */}
            <div className="md:col-span-2 space-y-3">
              <Label className="text-[13px] font-bold text-foreground ml-0.5 flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                ASSIGNMENT LETTER (PDF/IMAGE)
              </Label>
              <div className={`relative border-2 border-dashed rounded-2xl p-6 transition-all ${form.letter ? 'border-primary/50 bg-primary/5' : 'border-border bg-muted/30 hover:bg-muted/50'}`}>
                <input
                  type="file"
                  name="letter"
                  onChange={handleChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".pdf,image/*"
                />
                <div className="flex flex-col items-center justify-center gap-2">
                  <Upload className={`w-8 h-8 ${form.letter ? 'text-primary' : 'text-muted-foreground'}`} />
                  <p className="text-[13px] font-semibold text-foreground">
                    {form.letter ? form.letter.name : "Click or drag to upload federal assignment letter"}
                  </p>
                  <p className="text-[11px] text-muted-foreground uppercase font-bold tracking-widest">
                    Maximum file size: 10MB
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Submit */}
          <div className="pt-8 pb-4 border-t border-border flex justify-end gap-3">
            <Button type="button" variant="outline" className="h-11 px-8 bg-card hover:bg-muted/50 text-foreground font-bold border-border rounded-xl" onClick={() => setForm({ date: "", customer: "", destination: "", citter: "", fdcNo: "", volume: "", region: "", fuelType: "diesel", letter: null, ownerId: "" })}>
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
                  <th className="text-left h-11 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Citer</th>
                  <th className="text-left h-11 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">FDC No</th>
                  <th className="text-left h-11 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Vol 20C</th>
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
                      <span className="text-[13px] font-semibold text-foreground">{d.customer}</span>
                    </td>
                    <td className="py-4">
                      <span className="text-[13px] font-medium text-foreground">{d.destination}</span>
                    </td>
                    <td className="py-4">
                      <span className="text-[13px] font-medium text-foreground">{d.citter}</span>
                    </td>
                    <td className="py-4">
                      <span className="text-[13px] font-mono font-medium text-muted-foreground">#{d.fdcNo}</span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-1.5 text-[13px] font-bold text-foreground">
                        <Droplets className={`w-3.5 h-3.5 ${d.fuelType === "benzene" ? "text-primary" : "text-emerald-600 dark:text-emerald-400"}`} />
                        {Number(d.volume).toLocaleString()} L
                      </div>
                      <span className={`text-[10px] font-semibold uppercase ${d.fuelType === "benzene" ? "text-primary" : "text-emerald-600 dark:text-emerald-400"}`}>{d.fuelType}</span>
                    </td>
                    <td className="py-4">
                      <span className="text-[13px] font-medium text-foreground">{d.region}</span>
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

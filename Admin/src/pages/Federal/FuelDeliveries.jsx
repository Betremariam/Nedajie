import React, { useState, useEffect } from "react";
import { 
  addFuelDelivery, 
  getAllFederalFuelDeliveries 
} from "../../services/api";
import { Truck, Calendar, User, MapPin, Building, Hash, Droplets } from "lucide-react";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";

const FuelDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    customer: "",
    destination: "",
    citter: "",
    fdcNo: "",
    volume: "",
    region: "",
    fuelType: "diesel",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const res = await getAllFederalFuelDeliveries();
      setDeliveries(res.data);
    } catch (err) {
      setError("Failed to load deliveries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (Object.values(formData).some(val => !val)) {
      return setError("All fields are required");
    }

    try {
      setLoading(true);
      await addFuelDelivery(formData);
      setSuccess("Fuel delivery record added successfully");
      setFormData({
        date: "",
        customer: "",
        destination: "",
        citter: "",
        fdcNo: "",
        volume: "",
        region: "",
        fuelType: "diesel",
      });
      fetchDeliveries();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to add delivery");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Fuel Delivery Operations</h1>
        <p className="text-muted-foreground">Log and monitor national fuel distribution records</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 bg-emerald-100 border border-emerald-400 text-emerald-800 rounded-lg">
          {success}
        </div>
      )}

      {/* Manual Entry Form */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-6 mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
          <Truck className="w-5 h-5 text-primary" />
          Add New Fuel Dispatch
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Date
              </label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full px-4 py-2 border border-border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
                <User className="w-3 h-3" /> Customer (Owner Name)
              </label>
              <input type="text" name="customer" value={formData.customer} onChange={handleChange} placeholder="e.g. John Doe" className="w-full px-4 py-2 border border-border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
                <Building className="w-3 h-3" /> Destination (Station)
              </label>
              <input type="text" name="destination" value={formData.destination} onChange={handleChange} placeholder="e.g. Addis Station A" className="w-full px-4 py-2 border border-border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> City (Citter)
              </label>
              <input type="text" name="citter" value={formData.citter} onChange={handleChange} placeholder="e.g. Addis Ababa" className="w-full px-4 py-2 border border-border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
                <Hash className="w-3 h-3" /> FDC Number
              </label>
              <input type="text" name="fdcNo" value={formData.fdcNo} onChange={handleChange} placeholder="e.g. FDC-9988" className="w-full px-4 py-2 border border-border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
                <Droplets className="w-3 h-3" /> Volume (Liters)
              </label>
              <input type="number" name="volume" value={formData.volume} onChange={handleChange} placeholder="e.g. 20000" className="w-full px-4 py-2 border border-border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Region
              </label>
              <input type="text" name="region" value={formData.region} onChange={handleChange} placeholder="e.g. Oromia" className="w-full px-4 py-2 border border-border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Fuel Type</label>
              <select name="fuelType" value={formData.fuelType} onChange={handleChange} className="w-full px-4 py-2 border border-border rounded-lg">
                <option value="diesel">Diesel</option>
                <option value="benzene">Benzene</option>
              </select>
            </div>
          </div>
          <Button type="submit" className="w-full md:w-auto px-12 py-6 text-lg" disabled={loading}>
            {loading ? "Recording..." : "Record Delivery"}
          </Button>
        </form>
      </div>

      {/* History Table */}
      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted/30">
          <h2 className="text-xl font-semibold text-foreground">National Dispatch Logs</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="px-6 py-4 text-xs font-semibold uppercase">Date</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase">Customer / Destination</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase">Volume (L)</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase">Region / City</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase">Type</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {deliveries.map((d) => (
                <tr key={d.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium">{d.date}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold">{d.customer}</div>
                    <div className="text-xs text-muted-foreground">{d.destination}</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold">{d.volume.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm">{d.region}</div>
                    <div className="text-xs text-muted-foreground">{d.citter}</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className="capitalize">{d.fuelType}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={
                      d.status === 'OWNER_ACCEPTED' ? "bg-emerald-500" :
                      d.status === 'SUPERADMIN_ACCEPTED' ? "bg-blue-500" : "bg-amber-500"
                    }>
                      {d.status.replace('_', ' ')}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FuelDeliveries;

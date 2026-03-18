import React, { useEffect, useState } from "react";
import { 
  getAllAdmins, 
  createOwner 
} from "../../services/api";
import { Copy, Check, ShieldAlert, ShieldCheck, KeyRound, MapPin, Building2 } from "lucide-react";
import { Badge } from "../../components/ui/Badge";

const ManageOwners = () => {
  const [owners, setOwners] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    companyName: "",
    region: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [newOwnerCreds, setNewOwnerCreds] = useState(null);
  const [copied, setCopied] = useState(false);

  const fetchOwners = async () => {
    setLoading(true);
    try {
      const res = await getAllAdmins();
      const filtered = res.data.filter(admin => admin.role === "stationOwner");
      setOwners(filtered);
    } catch (err) {
      setError("Failed to load owners");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setNewOwnerCreds(null);

    const { name, email, companyName, region } = formData;
    if (!name || !email || !companyName || !region) {
      return setError("Please fill all required fields");
    }

    try {
      setLoading(true);
      const res = await API.post("/federal/create-owner", { name, email, companyName, region });
      
      setSuccess("Station Owner created and approved successfully");
      setNewOwnerCreds({ email, tempPassword: res.data.tempPassword });
      setFormData({ name: "", email: "", companyName: "", region: "" });
      fetchOwners();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to create owner");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (newOwnerCreds) {
      navigator.clipboard.writeText(`Email: ${newOwnerCreds.email}\nPassword: ${newOwnerCreds.tempPassword}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Manage Station Owners</h1>
        <p className="text-muted-foreground">Federal registration and approval of fuel station proprietors</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-3">
          <ShieldAlert className="w-5 h-5" />
          {error}
        </div>
      )}
      {success && !newOwnerCreds && (
        <div className="mb-6 p-4 bg-emerald-100 border border-emerald-400 text-emerald-800 rounded-lg flex items-center gap-3">
          <ShieldCheck className="w-5 h-5" />
          {success}
        </div>
      )}

      {newOwnerCreds && (
        <div className="mb-8 p-6 bg-emerald-50 border-2 border-emerald-200 rounded-xl shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
          <h3 className="text-lg font-bold text-emerald-900 mb-2 flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-emerald-600" />
            Owner Account Created!
          </h3>
          <div className="bg-white p-4 rounded-lg border border-emerald-100 flex items-center justify-between">
            <div className="font-mono text-sm">
              <div><span className="text-gray-500">Email:</span> <span className="font-semibold text-gray-900">{newOwnerCreds.email}</span></div>
              <div className="mt-1"><span className="text-gray-500">Temp Password:</span> <span className="font-bold text-emerald-600 text-lg">{newOwnerCreds.tempPassword}</span></div>
            </div>
            <button onClick={copyToClipboard} className="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-md flex items-center gap-2">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      )}

      <div className="bg-card rounded-xl shadow-sm border border-border p-6 mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-6">Register New Owner</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 border border-border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 border border-border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Company Name *</label>
              <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full px-4 py-3 border border-border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Region *</label>
              <input type="text" name="region" value={formData.region} onChange={handleChange} className="w-full px-4 py-3 border border-border rounded-lg" required />
            </div>
          </div>
          <button type="submit" className="bg-primary text-white px-6 py-3 rounded-lg font-semibold" disabled={loading}>
            {loading ? "Processing..." : "Create & Approve Owner"}
          </button>
        </form>
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50 border-b border-border text-left">
              <th className="px-6 py-4 text-xs font-semibold uppercase">Owner</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase">Email</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase">Company</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase">Region</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {owners.map((owner) => (
              <tr key={owner.id}>
                <td className="px-6 py-4 font-medium">{owner.name}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{owner.email}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-sm">
                    <Building2 className="w-3 h-3 mr-1 text-muted-foreground" />
                    {owner.companyName || "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-sm">
                    <MapPin className="w-3 h-3 mr-1 text-muted-foreground" />
                    {owner.region || "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    Approved
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageOwners;

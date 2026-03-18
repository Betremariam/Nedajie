import React, { useEffect, useState } from "react";
import { 
  getAllAdmins, 
  createRegionalSuperAdmin 
} from "../../services/api";
import { Copy, Check, ShieldAlert, ShieldCheck, KeyRound, Globe } from "lucide-react";

const ManageSuperAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    region: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [newAdminCreds, setNewAdminCreds] = useState(null);
  const [copied, setCopied] = useState(false);

  const fetchSuperAdmins = async () => {
    setLoading(true);
    try {
      const res = await getAllAdmins();
      const filtered = res.data.filter(admin => admin.role === "super");
      setAdmins(filtered);
    } catch (err) {
      setError("Failed to load super admins");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSuperAdmins();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setNewAdminCreds(null);

    const { name, email, region } = formData;
    if (!name || !email || !region) {
      return setError("Please fill all required fields");
    }

    try {
      setLoading(true);
      const res = await createRegionalSuperAdmin({ name, email, region });
      
      setSuccess("Regional Super Admin created successfully");
      setNewAdminCreds({ email, tempPassword: res.data.tempPassword });
      setFormData({ name: "", email: "", region: "" });
      fetchSuperAdmins();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to create super admin");
    } finally {
      setLoading(false);
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
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Manage Regional Super Admins</h1>
        <p className="text-muted-foreground">Federal oversight of regional administrative authorities</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-3">
          <ShieldAlert className="w-5 h-5" />
          {error}
        </div>
      )}
      {success && !newAdminCreds && (
        <div className="mb-6 p-4 bg-emerald-100 border border-emerald-400 text-emerald-800 rounded-lg flex items-center gap-3">
          <ShieldCheck className="w-5 h-5" />
          {success}
        </div>
      )}

      {newAdminCreds && (
        <div className="mb-8 p-6 bg-blue-50 border-2 border-blue-200 rounded-xl shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
          <h3 className="text-lg font-bold text-blue-900 mb-2 flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-blue-600" />
            Super Admin Created!
          </h3>
          <div className="bg-white p-4 rounded-lg border border-blue-100 flex items-center justify-between">
            <div className="font-mono text-sm">
              <div><span className="text-gray-500">Email:</span> <span className="font-semibold text-gray-900">{newAdminCreds.email}</span></div>
              <div className="mt-1"><span className="text-gray-500">Temp Password:</span> <span className="font-bold text-blue-600 text-lg">{newAdminCreds.tempPassword}</span></div>
            </div>
            <button onClick={copyToClipboard} className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md flex items-center gap-2">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      )}

      <div className="bg-card rounded-xl shadow-sm border border-border p-6 mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-6">Register Regional Authority</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 border border-border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 border border-border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Region *</label>
              <input type="text" name="region" value={formData.region} onChange={handleChange} className="w-full px-4 py-3 border border-border rounded-lg" required />
            </div>
          </div>
          <button type="submit" className="bg-primary text-white px-6 py-3 rounded-lg font-semibold" disabled={loading}>
            {loading ? "Processing..." : "Create Regional Super Admin"}
          </button>
        </form>
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50 border-b border-border text-left">
              <th className="px-6 py-4 text-xs font-semibold uppercase">Super Admin</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase">Email</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase">Region</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td className="px-6 py-4 font-medium">{admin.name}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{admin.email}</td>
                <td className="px-6 py-4">
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                    <Globe className="w-3 h-3 mr-1" /> {admin.region}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  {admin.isBlocked ? <span className="text-red-600">Blocked</span> : <span className="text-emerald-600">Active</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageSuperAdmins;

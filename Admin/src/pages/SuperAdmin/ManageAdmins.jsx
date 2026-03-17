import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { Copy, Check, ShieldAlert, ShieldCheck, KeyRound } from "lucide-react";

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [stations, setStations] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "register", 
    stationIds: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Temp password modal state
  const [newAdminCreds, setNewAdminCreds] = useState(null);
  const [copied, setCopied] = useState(false);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await API.get("/admins/admins");
      const filtered = res.data.filter(admin => admin.role !== "superadmin" && admin.role !== "super");
      setAdmins(filtered);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to load admins");
    }
    setLoading(false);
  };

  const fetchStations = async () => {
    try {
      const res = await API.get("/admins/fuel-stocks");
      setStations(res.data);
    } catch (err) {
      console.error("Failed to load stations:", err);
    }
  };

  useEffect(() => {
    fetchAdmins();
    fetchStations();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleStationToggle = (stationId) => {
    setFormData(prev => {
      const current = prev.stationIds;
      if (current.includes(stationId)) {
        return { ...prev, stationIds: current.filter(id => id !== stationId) };
      } else {
        return { ...prev, stationIds: [...current, stationId] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setNewAdminCreds(null);
    setCopied(false);

    const { name, email, role, stationIds } = formData;
    if (!name || !email || !role) {
      return setError("Please fill all required fields");
    }

    try {
      let res;
      if (role === "stationOwner") {
        if (stationIds.length === 0) return setError("Please select at least one station.");
        res = await API.post("/admins/owners", { name, email, stationIds });
      } else {
        res = await API.post("/admins/admins", { name, email, role });
      }
      
      setSuccess("Admin created successfully");
      setNewAdminCreds({ email, tempPassword: res.data.tempPassword });
      setFormData({ name: "", email: "", role: "register", stationIds: [] });
      fetchAdmins();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to create admin");
    }
  };

  const handleToggleBlock = async (id, currentStatus) => {
    const action = currentStatus ? "unblock" : "block";
    if (!window.confirm(`Are you sure you want to ${action} this admin?`)) return;
    setError("");
    setSuccess("");
    try {
      await API.patch(`/admins/admins/${id}/block`);
      setSuccess(`Admin successfully ${action}ed`);
      fetchAdmins();
    } catch (err) {
      setError(err.response?.data?.msg || `Failed to ${action} admin`);
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
        <h1 className="text-3xl font-bold text-foreground mb-2">Manage Administrators</h1>
        <p className="text-muted-foreground">Create and manage system administrators</p>
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

      {/* Temp Password Modal / Alert */}
      {newAdminCreds && (
        <div className="mb-8 p-6 bg-brand-50 border-2 border-brand-200 rounded-xl shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-brand-500"></div>
          <h3 className="text-lg font-bold text-brand-900 mb-2 flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-brand-600" />
            Admin Created Successfully!
          </h3>
          <p className="text-brand-700 mb-4 text-sm">
            Please share these temporary credentials securely. The user will be required to change this password on their first login.
          </p>
          <div className="bg-white p-4 rounded-lg border border-brand-100 flex items-center justify-between">
            <div className="font-mono text-sm">
              <div><span className="text-gray-500">Email:</span> <span className="font-semibold text-gray-900">{newAdminCreds.email}</span></div>
              <div className="mt-1"><span className="text-gray-500">Temp Password:</span> <span className="font-bold text-brand-600 text-lg">{newAdminCreds.tempPassword}</span></div>
            </div>
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-brand-100 hover:bg-brand-200 text-brand-700 rounded-md transition-colors flex items-center gap-2 font-medium"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      )}

      {/* Create Admin Form */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-6 mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-6">Create New Admin</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
                placeholder="Enter admin's full name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
                placeholder="Enter email address"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Admin Role *</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
              >
                <option value="register">Registration Admin</option>
                <option value="approver">Approval Admin</option>
                <option value="stationOwner">Station Owner</option>
              </select>
            </div>
          </div>

          {formData.role === "stationOwner" && (
            <div className="mt-4 p-4 border border-border rounded-lg bg-muted/30">
              <label className="block text-sm font-medium text-foreground mb-3">Select Assigned Stations *</label>
              {stations.length === 0 ? (
                <p className="text-sm text-yellow-600">No stations available. Please add fuel stock first.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {stations.map(station => (
                    <label key={station.id} className="flex items-center space-x-2 p-2 border border-border rounded-md bg-card hover:bg-muted/50 cursor-pointer transition-colors">
                      <input 
                        type="checkbox" 
                        checked={formData.stationIds.includes(station.id)}
                        onChange={() => handleStationToggle(station.id)}
                        className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4" 
                      />
                      <span className="text-sm font-medium">{station.stationName} <span className="text-xs text-muted-foreground">({station.city})</span></span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              className="bg-brand-600 text-white px-6 py-3 rounded-lg hover:bg-brand-700 transition-colors duration-200 font-semibold shadow-sm hover:shadow-md flex items-center gap-2 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Creating..." : "Generate Admin & Password"}
            </button>
          </div>
        </form>
      </div>

      {/* Admins List */}
      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Registered Administrators</h2>
        </div>

        {loading && admins.length === 0 ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Administrator</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {admins.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-muted-foreground">
                      No administrators found.
                    </td>
                  </tr>
                ) : (
                  admins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-brand-700 font-semibold text-sm">
                              {admin.name?.charAt(0) || 'A'}
                            </span>
                          </div>
                          <div className="text-sm font-medium text-foreground">{admin.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{admin.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-blue-100 text-blue-800">
                          {admin.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1 items-start">
                          {admin.isBlocked ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs gap-1 font-medium bg-red-100 text-red-800 border border-red-200">
                              <ShieldAlert className="w-3 h-3" /> Blocked
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs gap-1 font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <ShieldCheck className="w-3 h-3" /> Active
                            </span>
                          )}
                          {admin.mustChangePassword && (
                            <span className="text-[10px] text-amber-600 font-medium px-1 bg-amber-50 rounded">Pending First Login</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleBlock(admin.id, admin.isBlocked)}
                          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors border ${
                            admin.isBlocked 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" 
                              : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                          }`}
                        >
                          {admin.isBlocked ? "Unblock" : "Block"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageAdmins;

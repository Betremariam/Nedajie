import React, { useEffect, useState } from "react";
import API from "../../services/api";

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "register", // default role
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch all admins on mount
  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await API.get("/admins/admins");
      // Filter out superadmin
      const filtered = res.data.filter(admin => admin.role !== "superadmin");
      setAdmins(filtered);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to load admins");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle admin creation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const { name, email, password, role } = formData;
    if (!name || !email || !password || !role) {
      return setError("Please fill all fields");
    }
    try {
      await API.post("/admins/admins", formData);
      setSuccess("Admin created successfully");
      setFormData({ name: "", email: "", password: "", role: "register" });
      fetchAdmins();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to create admin");
    }
  };

  // Delete admin by ID
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    setError("");
    setSuccess("");
    try {
      await API.delete(`/admins/admins/${id}`);
      setSuccess("Admin deleted successfully");
      fetchAdmins();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to delete admin");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Manage Admins</h1>

      {error && (
        <div className="bg-red-500 text-white p-3 rounded mb-4">{error}</div>
      )}
      {success && (
        <div className="bg-green-500 text-white p-3 rounded mb-4">{success}</div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mb-8 space-y-4 bg-white p-6 rounded shadow-md"
      >
        <div>
          <label className="block mb-1 font-semibold">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 rounded border border-gray-300"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 rounded border border-gray-300"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 rounded border border-gray-300"
            required
          />
          <small className="text-gray-500">Set a password for this admin</small>
        </div>
        <div>
          <label className="block mb-1 font-semibold">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}className="w-full p-2 rounded border border-gray-300"
          >
            <option value="approver">Approver</option>
            <option value="register">Register Admin</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Saving..." : "Create Admin"}
        </button>
      </form>

      <h2 className="text-2xl font-semibold mb-4">Registered Admins</h2>

      {loading ? (
        <p>Loading admins...</p>
      ) : (
        <table className="w-full text-left border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-3 border border-gray-300">Name</th>
              <th className="p-3 border border-gray-300">Email</th>
              <th className="p-3 border border-gray-300">Role</th>
              <th className="p-3 border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-4">
                  No admins found.
                </td>
              </tr>
            ) : (
              admins.map((admin) => (
                <tr key={admin._id} className="hover:bg-blue-50">
                  <td className="p-3 border border-gray-300">{admin.name}</td>
                  <td className="p-3 border border-gray-300">{admin.email}</td>
                  <td className="p-3 border border-gray-300 capitalize">
                    {admin.role}
                  </td>
                  <td className="p-3 border border-gray-300">
                    <button
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white"
                      onClick={() => handleDelete(admin._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageAdmins;
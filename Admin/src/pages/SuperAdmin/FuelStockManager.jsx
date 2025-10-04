import React, { useEffect, useState } from "react";
import API from "../../services/api";

const FuelStockManager = () => {
  const [stations, setStations] = useState([]);
  const [stockForm, setStockForm] = useState({
    stationName: "",
    city: "",
    gasType: "benzene",
    litersReceived: 0,
  });

  const [ownerForm, setOwnerForm] = useState({
    name: "",
    email: "",
    password: "",
    stationKey: "", // we will use grouped key instead of single ID
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("stock");

  // Fetch stations
  const fetchStations = async () => {
    try {
      const res = await API.get("/admins/fuel-stocks");
      setStations(res.data);
    } catch (err) {
      console.error("Failed to fetch stations:", err);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  // Add fuel stock
  const handleAddStock = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await API.post("/admins/fuel-stocks", stockForm);
      setSuccess("Fuel stock added successfully.");
      setStockForm({
        stationName: "",
        city: "",
        gasType: "benzene",
        litersReceived: 0,
      });
      fetchStations();
    } catch (err) {
      setError("Failed to add fuel stock.");
    }
  };

  // Update fuel stock
  const handleUpdateStock = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const existing = stations.find(
      (s) =>
        s.stationName.toLowerCase() === stockForm.stationName.toLowerCase() &&
        s.gasType === stockForm.gasType &&
        s.city.toLowerCase() === stockForm.city.toLowerCase()
    );

    if (!existing) {
      setError("No existing station found for update.");
      return;
    }

    if (stockForm.litersReceived <= 0) {
      setError("Liters must be greater than 0 for update.");
      return;
    }

    try {
      await API.put(`/admins/fuel-stocks/${existing._id}/refill`, {
        additionalLiters: stockForm.litersReceived,
      });

      setSuccess("Fuel stock updated successfully.");
      setStockForm({
        stationName: "",
        city: "",
        gasType: "benzene",
        litersReceived: 0,
      });
      fetchStations();
    } catch (err) {
      console.error(err);
      setError("Failed to update fuel stock.");
    }
  };

  // Add Station Owner
  const handleAddOwner = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!ownerForm.stationKey) {
      setError("Please select a station for this owner.");
      return;
    }

    // Find all stationIds with same stationKey (stationName + city)
    const [stationName, city] = ownerForm.stationKey.split("::");
    const matchedStations = stations.filter(
      (s) => s.stationName === stationName && s.city === city
    );

    const stationIds = matchedStations.map((s) => s._id);

    try {
      await API.post("/admins/owners", {
        name: ownerForm.name,
        email: ownerForm.email,
        password: ownerForm.password,
        stationIds, // send multiple IDs
      });

      setSuccess("Station owner created successfully.");
      setOwnerForm({
        name: "",
        email: "",
        password: "",
        stationKey: "",
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Failed to create owner.");
    }
  };

  // Group stations by stationName + city
  const groupedStations = Object.values(
    stations.reduce((acc, s) => {
      const key = `${s.stationName}::${s.city}`;
      if (!acc[key]) {
        acc[key] = {
          key,
          stationName: s.stationName,
          city: s.city,
          stocks: [],
        };
      }
      acc[key].stocks.push(s);
      return acc;
    }, {})
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Fuel Stock Management</h1>
        <p className="text-gray-600">Manage fuel stocks and station owners across all stations</p>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {success}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab("stock")}
            className={`px-6 py-3 rounded-md font-medium transition-colors ${
              activeTab === "stock" 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Manage Fuel Stock
          </button>
          <button
            onClick={() => setActiveTab("owner")}
            className={`px-6 py-3 rounded-md font-medium transition-colors ${
              activeTab === "owner" 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Create Station Owner
          </button>
          <button
            onClick={() => setActiveTab("view")}
            className={`px-6 py-3 rounded-md font-medium transition-colors ${
              activeTab === "view" 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            View Stocks
          </button>
        </div>
      </div>

      {/* Fuel Stock Management Tab */}
      {activeTab === "stock" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Manage Fuel Stock</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Station Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter station name"
                  value={stockForm.stationName}
                  onChange={(e) => setStockForm({ ...stockForm, stationName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  placeholder="Enter city"
                  value={stockForm.city}
                  onChange={(e) => setStockForm({ ...stockForm, city: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fuel Type *
                </label>
                <select
                  value={stockForm.gasType}
                  onChange={(e) => setStockForm({ ...stockForm, gasType: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="benzene">Benzene</option>
                  <option value="diesel">Diesel</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Liters *
                </label>
                <input
                  type="number"
                  placeholder="Enter liters"
                  value={stockForm.litersReceived}
                  onChange={(e) => setStockForm({ ...stockForm, litersReceived: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleAddStock}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Fuel Stock
              </button>
              <button
                onClick={handleUpdateStock}
                className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors duration-200 font-semibold shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Update Fuel Stock
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Create Station Owner Tab */}
      {activeTab === "owner" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Create Station Owner</h2>
          <form className="space-y-6" onSubmit={handleAddOwner}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Station *
              </label>
              <select
                value={ownerForm.stationKey}
                onChange={(e) => setOwnerForm({ ...ownerForm, stationKey: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              >
                <option value="">Choose a station...</option>
                {groupedStations.map((g) => (
                  <option key={g.key} value={g.key}>
                    {g.stationName} - {g.city} ({g.stocks.length} fuel types)
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Owner Full Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter owner name"
                  value={ownerForm.name}
                  onChange={(e) => setOwnerForm({ ...ownerForm, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={ownerForm.email}
                  onChange={(e) => setOwnerForm({ ...ownerForm, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  placeholder="Create password"
                  value={ownerForm.password}
                  onChange={(e) => setOwnerForm({ ...ownerForm, password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
            </div>
            <div className="pt-4">
              <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold shadow-sm hover:shadow-md flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Station Owner
              </button>
            </div>
          </form>
        </div>
      )}

      {/* View Stocks Tab */}
      {activeTab === "view" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Current Fuel Stocks</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Station Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    City
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Fuel Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Available Liters
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stations.map((stock) => (
                  <tr key={stock._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{stock.stationName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{stock.city}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {stock.gasType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {stock.litersReceived - stock.litersDispensed} L
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {stations.length === 0 && (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">⛽</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Fuel Stocks</h3>
              <p className="text-gray-500">No fuel stocks have been added yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FuelStockManager;
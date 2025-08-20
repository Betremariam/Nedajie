import React, { useEffect, useState } from "react";
import API from "../../services/api";

const FuelStockManager = () => {
  const [stations, setStations] = useState([]);
  const [formData, setFormData] = useState({
    stationName: "",
    city: "", 
    gasType: "benzene",
    litersReceived: 0,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const exists = stations.find(
      (s) =>
        s.stationName.toLowerCase() === formData.stationName.toLowerCase() &&
        s.gasType === formData.gasType &&
        s.city.toLowerCase() === formData.city.toLowerCase()
    );

    if (exists) {
      setError("Fuel stock for this station, city, and gas type already exists.");
      return;
    }

    try {
      await API.post("/admins/fuel-stocks", formData);
      setSuccess("Fuel stock added successfully.");
      setFormData({
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const existing = stations.find(
      (s) =>
        s.stationName.toLowerCase() === formData.stationName.toLowerCase() &&
        s.gasType === formData.gasType &&
        s.city.toLowerCase() === formData.city.toLowerCase()
    );

    if (!existing) {
      setError("No existing station found for update.");
      return;
    }

    if (formData.litersReceived <= 0) {
      setError("Liters must be greater than 0 for update.");
      return;
    }

    try {
      await API.put(`/admins/fuel-stocks/${existing._id}/refill`, {
        additionalLiters: formData.litersReceived,
      });

      setSuccess("Fuel stock updated successfully.");
      setFormData({
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

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Manage Fuel Stock</h2>

      {error && <div className="bg-red-500 text-white p-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-500 text-white p-3 rounded mb-4">{success}</div>}

      <form className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Station Name"
          value={formData.stationName}
          onChange={(e) =>
            setFormData({ ...formData, stationName: e.target.value })
          }
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="City"
          value={formData.city}
          onChange={(e) =>
            setFormData({ ...formData, city: e.target.value })
          }
          className="w-full border p-2 rounded"
          required
        />
        <select
          value={formData.gasType}
          onChange={(e) =>
            setFormData({ ...formData, gasType: e.target.value })
          }
          className="w-full border p-2 rounded"
        >
          <option value="benzene">Benzene</option>
          <option value="diesel">Diesel</option>
        </select>
        <input
          type="number"
          placeholder="Liters Received"
          value={formData.litersReceived}
          onChange={(e) =>
            setFormData({
              ...formData,
              litersReceived: Number(e.target.value),
            })
          }
          className="w-full border p-2 rounded"
          required
        />
        <div className="flex gap-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleAdd}
          >
            Add
          </button>
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded"
            onClick={handleUpdate}
          >
            Update
          </button>
        </div>
      </form>

      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="p-2 border">Station Name</th>
            <th className="p-2 border">City</th>
            <th className="p-2 border">Gas Type</th>
            <th className="p-2 border">Liters Available</th>
          </tr>
        </thead>
        <tbody>
          {stations.map((stock) => (
            <tr key={stock._id} className="text-center">
              <td className="border p-2">{stock.stationName}</td>
              <td className="border p-2">{stock.city}</td>
              <td className="border p-2 capitalize">{stock.gasType}</td>
              <td className="border p-2">
                {stock.litersReceived - stock.litersDispensed}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FuelStockManager;

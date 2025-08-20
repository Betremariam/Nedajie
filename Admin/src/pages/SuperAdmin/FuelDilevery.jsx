import React, { useState, useEffect } from "react";
import API from "../../services/api"; 

function FuelDilevery() {
  const [file, setFile] = useState(null);
  const [fuelType, setFuelType] = useState("");
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    loadDeliveries();
  }, [fuelType]); // refetch on fuelType change

  const loadDeliveries = async () => {
    try {
      if (!fuelType) {
        console.warn("Fuel type not selected yet.");
        return;
      }

      const res = await API.get(`/admins/deliveries?fuelType=${fuelType}`);
      setDeliveries(res.data);
    } catch (err) {
      console.error("Failed to fetch deliveries", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !fuelType) {
      alert("Please select both a fuel type and a file.");
      return;
    }

    const formData = new FormData();
    formData.append("xlsx", file);
    formData.append("fuelType", fuelType);

    try {
      await API.post("/admins/upload-deliveries", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Imported successfully!");
      setFile(null);
      setFuelType("");
      loadDeliveries(); // refresh list
    } catch (err) {
      console.error(err);
      alert("Failed to import.");
    }
  };

  const handleApprove = async (id) => {
    try {
      await API.patch(`/admins/approve/${id}`);
      loadDeliveries(); 
    } catch (err) {
      console.error("Approval failed", err);
    }
  };

  return (
    <div className="p-4 text-white bg-gray-900 min-h-screen">
      <form onSubmit={handleSubmit} className="mb-6 bg-gray-800 p-4 rounded space-y-4">
        <label className="block">
          Select Fuel Type:
          <select
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value)}
            className="ml-2 p-1 rounded bg-gray-700"
          >
            <option value="">-- Choose --</option>
            <option value="diesel">Diesel</option>
            <option value="benzene">Benzene</option>
          </select>
        </label>

        <label className="block">
          Upload XLSX:
          <input type="file" accept=".xlsx" onChange={(e) => setFile(e.target.files[0])} className="ml-2" />
        </label>

        <button type="submit" className="px-4 py-2 bg-green-600 rounded hover:bg-green-700">
          Import
        </button>
      </form>

      <h2 className="text-xl mb-2">Imported Fuel Deliveries</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left bg-gray-800 rounded">
          <thead>
            <tr className="bg-gray-700">
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Customer</th>
              <th className="px-4 py-2">Destination</th>
              <th className="px-4 py-2">Citter</th>
              <th className="px-4 py-2">FDC Number </th>
              <th className="px-4 py-2">Vol 200</th>
              <th className="px-4 py-2">Region</th>
              <th className="px-4 py-2">Fuel Type</th>
              <th className="px-4 py-2">Confirmed</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((d, index) => (
              <tr key={index} className="border-t border-gray-600">
                <td className="px-4 py-2">{d.date?.slice(0, 10)}</td>
                <td className="px-4 py-2">{d.customer}</td>
                <td className="px-4 py-2">{d.destination}</td>
                <td className="px-4 py-2">{d.citter}</td>
                <td className="px-4 py-2">{d.fdcNo}</td>
                <td className="px-4 py-2">{d.volume}</td>
                <td className="px-4 py-2">{d.region}</td>
                <td className="px-4 py-2 capitalize">{d.fuelType}</td>
                <td className="px-4 py-2">
                  {d.isConfirmed ? (
                    "✅"
                  ) : (
                    <button
                      onClick={() => handleApprove(d._id)}
                      className="px-2 py-1 bg-blue-600 rounded hover:bg-blue-700 text-white"
                    >
                      Approve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FuelDilevery;

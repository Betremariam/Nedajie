import React, { useState, useEffect } from "react";
import API from "../../services/api"; 

function FuelDelivery() {
  const [file, setFile] = useState(null);
  const [fuelType, setFuelType] = useState("");
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDeliveries();
  }, [fuelType]); // refetch on fuelType change

  const loadDeliveries = async () => {
    try {
      if (!fuelType) return;
      setLoading(true);
      const res = await API.get(`/admins/deliveries?fuelType=${fuelType}`);
      setDeliveries(res.data);
    } catch (err) {
      console.error("Failed to fetch deliveries", err);
    } finally {
      setLoading(false);
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
      setLoading(true);
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
    } finally {
      setLoading(false);
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
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Fuel Delivery Management</h1>
        <p className="text-muted-foreground">Import and manage fuel delivery records from Excel files</p>
      </div>

      {/* Upload Form */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-6 mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-6">Import Delivery Data</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Fuel Type *
              </label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              >
                <option value="">Choose Fuel Type</option>
                <option value="diesel">Diesel</option>
                <option value="benzene">Benzene</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Excel File *
              </label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-red-400 transition-colors">
                <input
                  type="file"
                  accept=".xlsx"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-muted-foreground mb-1">Upload Excel File (.xlsx)</p>
                  <p className="text-sm text-muted-foreground">Click to browse files</p>
                  {file && (
                    <p className="text-sm text-red-600 mt-2">Selected: {file.name}</p>
                  )}
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 font-semibold shadow-sm hover:shadow-md flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={loading}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              {loading ? "Importing..." : "Import Data"}
            </button>
          </div>
        </form>
      </div>

      {/* Deliveries Table */}
      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            Imported Fuel Deliveries {fuelType && `- ${fuelType.charAt(0).toUpperCase() + fuelType.slice(1)}`}
          </h2>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading deliveries...</p>
          </div>
        ) : deliveries.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">🚚</div>
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              {fuelType ? "No Deliveries Found" : "Select Fuel Type"}
            </h3>
            <p className="text-muted-foreground">
              {fuelType 
                ? "No delivery records found for the selected fuel type." 
                : "Please select a fuel type to view delivery records."
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Destination
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Citter
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    FDC Number
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Volume
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Region
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Fuel Type
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {deliveries.map((d, index) => (
                  <tr key={index} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-foreground">{d.date?.slice(0, 10)}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-foreground">{d.customer}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-muted-foreground">{d.destination}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-muted-foreground">{d.citter}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-foreground">{d.fdcNo}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-foreground">{d.volume}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-muted-foreground">{d.region}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {d.fuelType}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {d.isConfirmed ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Confirmed
                        </span>
                      ) : (
                        <button
                          onClick={() => handleApprove(d.id)}
                          className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm shadow-sm hover:shadow-md flex items-center gap-1"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Approve
                        </button>
                      )}
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
}

export default FuelDelivery;

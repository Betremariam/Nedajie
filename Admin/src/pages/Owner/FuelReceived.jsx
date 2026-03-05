import { useEffect, useState } from "react";
import API from "../../services/api";

const FuelReceived = () => {
  const [records, setRecords] = useState([]);
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("adminToken");
  const stationIds = JSON.parse(localStorage.getItem("stationIds") || "[]");

  // ✅ Fetch stations owned by this admin
  const fetchStations = async () => {
    try {
      if (stationIds.length === 0) return;

      const res = await API.get("/owners/stations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStations(res.data);

      if (!selectedStation && res.data.length > 0) {
        setSelectedStation(res.data[0]._id);
      }
    } catch (err) {
      console.error("Error fetching stations:", err);
      setError("Failed to fetch stations.");
    }
  };

  // ✅ Fetch FuelReceived records (not from FuelStock)
  const fetchFuelRecords = async (stationId) => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        setError("No token found. Please log in again.");
        setLoading(false);
        return;
      }

      if (!stationId && stationIds.length === 0) {
        setError("No station IDs available.");
        setLoading(false);
        return;
      }

      // use selected stationId or all
      const queryIds = stationId ? [stationId] : stationIds;

      const res = await API.get(
        `/owners/fuel-received?stationIds=${queryIds.join("&stationIds=")}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ backend should return array of FuelReceived docs
      // with { stationName, city, gasType, liters, date }
      setRecords(res.data);
    } catch (err) {
      console.error("Fuel Received fetch error:", err);
      setError(
        err.response?.data?.msg ||
          "Failed to fetch fuel received records. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  useEffect(() => {
    if (stationIds.length > 0) fetchFuelRecords(selectedStation);
  }, [selectedStation]);

  const handleStationChange = (e) => {
    setSelectedStation(e.target.value);
  };

  if (loading) return (
    <div className="flex justify-center items-center p-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading fuel received data...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg m-4">
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {error}
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Fuel Received Records</h1>
        <p className="text-gray-600">Track and monitor fuel deliveries to your stations</p>
      </div>

      {stations.length > 0 && (
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Station
          </label>
          <select
            value={selectedStation}
            onChange={handleStationChange}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">All Fuels</option>
            {stations.map((s) => (
              <option key={s._id} value={s._id}>
                {s.stationName} - {s.city}
              </option>
            ))}
          </select>
        </div>
      )}

      {records.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">⛽</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Fuel Records Found</h3>
          <p className="text-gray-500">No fuel received records available for the selected station(s).</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Station
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    City
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Fuel Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Liters Received
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Date & Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {records.map((rec) => (
                  <tr key={rec._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{rec.stationName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{rec.city}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {rec.gasType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{rec.liters} L</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {new Date(rec.date).toLocaleString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FuelReceived;
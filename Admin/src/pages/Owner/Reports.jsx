import { useEffect, useState } from "react";
import API from "../../services/api";
import * as XLSX from "xlsx";

const Reports = () => {
  const [reportType, setReportType] = useState("daily");
  const [transactions, setTransactions] = useState([]);
  const [totalLiters, setTotalLiters] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Get stationIds from localStorage (as in OwnerTransactions)
  const [stationIds] = useState(
    () => JSON.parse(localStorage.getItem("stationIds") || "[]")
  );

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        if (stationIds.length === 0) {
          setError("No stations assigned");
          setTransactions([]);
          setTotalLiters(0);
          return;
        }
        const res = await API.get(
          `/owners/reports?type=${reportType}&stationIds=${stationIds.join("&stationIds=")}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } }
        );
        setTransactions(res.data.transactions);
        setTotalLiters(res.data.totalLiters);
        setError("");
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to fetch report");
        setTransactions([]);
        setTotalLiters(0);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
    // eslint-disable-next-line
  }, [reportType, stationIds]);

  const handleDownload = () => {
    if (!transactions.length) return;
    const data = transactions.map((tx) => ({
      Date: new Date(tx.date).toLocaleString(),
      Driver: tx.driver?.name || tx.farmer?.fullName || "N/A",
      "Gas Type": tx.gasType,
      Liters: tx.liters,
      Attendant: tx.attendantName || "",
      Station: tx.stationName || "",
      City: tx.city || "",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `report-${reportType}-${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  if (loading) return (
    <div className="flex justify-center items-center p-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading report data...</p>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Fuel Reports</h1>
        <p className="text-muted-foreground">Analyze fuel dispensing data across different time periods</p>
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-border p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <label className="block text-sm font-medium text-muted-foreground">
              Report Period:
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          
          <button
            onClick={handleDownload}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold shadow-sm hover:shadow-md flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!transactions.length}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Excel Report
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Total Liters Dispensed</h3>
              <p className="text-3xl font-bold text-blue-600">{totalLiters} L</p>
            </div>
            <div className="text-4xl">⛽</div>
          </div>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="bg-card rounded-xl shadow-sm border border-border p-12 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Report Data</h3>
          <p className="text-muted-foreground">No transactions found for the selected period and stations.</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Fuel Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Liters
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Attendant
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Station
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    City
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-muted-foreground">
                        {new Date(tx.date).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-foreground">
                        {tx.driver?.name || tx.farmer?.fullName || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {tx.gasType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-foreground">{tx.liters} L</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-muted-foreground">{tx.attendantName || ""}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-foreground">{tx.stationName || ""}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-muted-foreground">{tx.city || ""}</div>
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

export default Reports;

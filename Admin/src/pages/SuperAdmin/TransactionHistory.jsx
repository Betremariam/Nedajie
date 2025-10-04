import React, { useEffect, useState } from "react";
import API from "../../services/api";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const res = await API.get("/admins/transactions");
      setTransactions(res.data);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center p-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading transactions...</p>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Fuel Transactions</h1>
        <p className="text-gray-600">Monitor all fuel transactions across the system</p>
      </div>

      {transactions.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">💳</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Transactions Found</h3>
          <p className="text-gray-500">No fuel transactions have been recorded yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Fuel Type
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Liters
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Attendant
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Station
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    City
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Date & Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-blue-600 font-semibold text-sm">
                            {(tx.driver?.name || tx.farmer?.fullName)?.charAt(0) || 'C'}
                          </span>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {tx.driver?.name || tx.farmer?.fullName || "Unknown"}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
                        {tx.gasType}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{tx.liters} L</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{tx.attendantName || "N/A"}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{tx.stationName || "Unknown"}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{tx.city || "Unknown"}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 min-w-[140px]">
                        {new Date(tx.createdAt).toLocaleDateString()}
                        <br />
                        <span className="text-xs text-gray-500">
                          {new Date(tx.createdAt).toLocaleTimeString()}
                        </span>
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

export default Transactions;
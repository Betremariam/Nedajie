import React, { useEffect, useState } from "react";
import API from "../../services/api";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    const res = await API.get("/admins/transactions");
    setTransactions(res.data);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Fuel Transactions</h2>
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Driver/farmer</th>
            <th className="p-2 border">Fuel Type</th>
            <th className="p-2 border">Liters</th>
            <th className="p-2 border">AttendantName</th>
            <th className="p-2 border">StationName</th>
            <th className="p-2 border">Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx._id}>
              <td className="border p-2">{tx.driver?.name ||tx.farmer?.fullName}</td>
              <td className="border p-2">{tx.gasType}</td>
              <td className="border p-2">{tx.liters}</td>
              <td className="border p-2">{tx.attendantName}</td>
              <td className="border p-2">{tx.stationName || "Unknown"}</td>
              <td className="border p-2">{new Date(tx.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
import React, { useEffect, useState } from "react";
import API from "../../services/api";

const OthersLists = () => {
  const [others, setOthers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchOthers = async () => {
      try {
        const res = await API.get("/admins/others");
        setOthers(res.data);
      } catch (error) {
        console.error("Failed to fetch other users:", error);
      }
    };

    fetchOthers();
  }, []);

  const filteredOthers = others.filter((other) =>
    other.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Registered Others</h2>
      <input
        type="text"
        placeholder="Search by name..."
        className="mb-4 px-4 py-2 border rounded w-full md:w-1/3"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead className="bg-gray-200 text-gray-600">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Phone</th>
              <th className="py-2 px-4 text-left">Fuel Type</th>
              <th className="py-2 px-4 text-left">Approved By</th>
            </tr>
          </thead>
          <tbody>
            {filteredOthers.map((other) => (
              <tr key={other._id} className="border-t">
                <td className="py-2 px-4">{other.fullName}</td>
                <td className="py-2 px-4">{other.phoneNumber}</td>
                <td className="py-2 px-4 capitalize">{other.fuelType}</td>
                <td className="py-2 px-4">
                  {other.approvedBy
                    ? `${other.approvedBy.name} (${other.approvedBy.email})`
                    : "Pending"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOthers.length === 0 && (
          <p className="mt-4 text-center text-gray-500">No other users found.</p>
        )}
      </div>
    </div>
  );
};

export default OthersLists;

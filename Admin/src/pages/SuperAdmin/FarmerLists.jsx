import React, { useEffect, useState } from "react";
import API from "../../services/api";

const FarmerLists = () => {
  const [farmers, setFarmers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const res = await API.get("/admins/farmers"); // Adjust backend route as needed
        setFarmers(res.data);
      } catch (error) {
        console.error("Failed to fetch farmers:", error);
      }
    };

    fetchFarmers();
  }, []);

  const filteredFarmers = farmers.filter((farmer) =>
    farmer.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Registered Farmers</h2>
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
              <th className="py-2 px-4 text-left">Wereda</th>
              <th className="py-2 px-4 text-left">Kebele</th>
              <th className="py-2 px-4 text-left">Approved By</th>
            </tr>
          </thead>
          <tbody>
            {filteredFarmers.map((farmer) => (
              <tr key={farmer._id} className="border-t">
                <td className="py-2 px-4">{farmer.fullName}</td>
                <td className="py-2 px-4">{farmer.phoneNumber}</td>
                <td className="py-2 px-4">{farmer.woreda}</td>
                <td className="py-2 px-4">{farmer.kebele}</td>
                <td className="py-2 px-4">
                  {farmer.approvedBy
                    ? `${farmer.approvedBy.name} (${farmer.approvedBy.email})`
                    : "Pending"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredFarmers.length === 0 && (
          <p className="mt-4 text-center text-gray-500">No farmers found.</p>
        )}
      </div>
    </div>
  );
};

export default FarmerLists;

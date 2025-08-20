import React, { useEffect, useState } from "react";
import API from "../../services/api";

const DriverLists = () => {
  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await API.get("/admins/drivers");
        setDrivers(res.data);
      } catch (error) {
        console.error("Failed to fetch drivers:", error);
      }
    };

    fetchDrivers();
  }, []);

  const filteredDrivers = drivers.filter((driver) =>
    driver.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Registered Drivers</h2>
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
              <th className="py-2 px-4 text-left">Vehicle Type</th>
              <th className="py-2 px-4 text-left">Plate Number</th>
              <th className="py-2 px-4 text-left">Approved By</th>
            </tr>
          </thead>
          <tbody>
            {filteredDrivers.map((driver) => (
              <tr key={driver._id} className="border-t">
                <td className="py-2 px-4">{driver.name}</td>
                <td className="py-2 px-4">{driver.phone}</td>
                <td className="py-2 px-4">{driver.carType}</td>
                <td className="py-2 px-4">{driver.carPlate}</td>
                <td className="py-2 px-4">
                  {driver.approvedBy
                    ? `${driver.approvedBy.name} (${driver.approvedBy.email})`
                    : "Pending"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredDrivers.length === 0 && (
          <p className="mt-4 text-center text-gray-500">No drivers found.</p>
        )}
      </div>
    </div>
  );
};

export default DriverLists;

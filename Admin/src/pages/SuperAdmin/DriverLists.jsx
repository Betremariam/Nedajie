import React, { useEffect, useState } from "react";
import API from "../../services/api";

const DriverLists = () => {
  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await API.get("/admins/drivers");
        setDrivers(res.data);
      } catch (error) {
        console.error("Failed to fetch drivers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  const filteredDrivers = drivers.filter((driver) =>
    driver.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex justify-center items-center p-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading drivers...</p>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Registered Drivers</h1>
        <p className="text-gray-600">View and manage all registered drivers in the system</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Drivers
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by driver name..."
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm text-blue-600 font-semibold">
              Total Drivers: {drivers.length}
            </div>
          </div>
        </div>
      </div>

      {filteredDrivers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">🚗</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {search ? "No Drivers Found" : "No Drivers Registered"}
          </h3>
          <p className="text-gray-500">
            {search 
              ? "No drivers match your search criteria" 
              : "There are no drivers registered in the system yet"
            }
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Driver
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Vehicle Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Plate Number
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Approved by
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDrivers.map((driver) => (
                  <tr key={driver._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-red-600 font-semibold text-sm">
                            {driver.name?.charAt(0) || 'D'}
                          </span>
                        </div>
                        <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{driver.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {driver.carType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{driver.carPlate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {driver.approvedBy ? (
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <div className="text-sm text-gray-600">
                            {driver.approvedBy.name} ({driver.approvedBy.email})
                          </div>
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          N/A
                        </span>
                      )}
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

export default DriverLists;
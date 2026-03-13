import React, { useEffect, useState } from "react";
import API from "../../services/api";

const OthersLists = () => {
  const [others, setOthers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOthers = async () => {
      try {
        const res = await API.get("/admins/others");
        setOthers(res.data);
      } catch (error) {
        console.error("Failed to fetch other users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOthers();
  }, []);

  const filteredOthers = others.filter((other) =>
    other.fullName.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex justify-center items-center p-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading users...</p>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Other Registered Users</h1>
        <p className="text-muted-foreground">View and manage all other registered users in the system</p>
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-border p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Search Users
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by user name..."
                className="w-full px-4 py-3 pl-10 border border-border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-sm text-purple-600 font-semibold">
              Total Users: {others.length}
            </div>
          </div>
        </div>
      </div>

      {filteredOthers.length === 0 ? (
        <div className="bg-card rounded-xl shadow-sm border border-border p-12 text-center">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-muted-foreground mb-2">
            {search ? "No Users Found" : "No Users Registered"}
          </h3>
          <p className="text-muted-foreground">
            {search 
              ? "No users match your search criteria" 
              : "There are no other users registered in the system yet"
            }
          </p>
        </div>
      ) : (
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Fuel Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Approval Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {filteredOthers.map((other) => (
                  <tr key={other.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-purple-600 font-semibold text-sm">
                            {other.fullName?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div className="text-sm font-medium text-foreground">{other.fullName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-muted-foreground">{other.phoneNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        other.fuelType === 'benzene' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-foreground'
                      }`}>
                        {other.fuelType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {other.approvedBy ? (
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <div className="text-sm text-muted-foreground">
                            {other.approvedBy.name} ({other.approvedBy.email})
                          </div>
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending Approval
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

export default OthersLists;

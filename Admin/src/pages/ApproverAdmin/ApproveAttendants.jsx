import React, { useEffect, useState } from "react";
import API from "../../services/api";

const ApproveAttendants = () => {
  const [attendants, setAttendants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendants = async () => {
    try {
      const { data } = await API.get("/admins/unapproved-attendants");
      setAttendants(data);
    } catch (error) {
      console.error("Error fetching attendants:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await API.put(`/admins/approve-attendant/${id}`);
      setAttendants((prev) => prev.filter((a) => a._id !== id));
    } catch (error) {
      console.error("Error approving attendant:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      await API.delete(`/admins/reject-attendant/${id}`);
      setAttendants((prev) => prev.filter((a) => a._id !== id));
    } catch (error) {
      console.error("Error rejecting attendant:", error);
    }
  };

  useEffect(() => {
    fetchAttendants();
  }, []);

  if (loading) return <div className="text-center p-4">Loading attendants...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Unapproved Attendants</h1>
      {attendants.length === 0 ? (
        <p>No pending attendants.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {attendants.map((attendant) => (
            <div
              key={attendant._id}
              className="bg-white rounded-lg shadow px-4 py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
                <p><strong>Name:</strong> {attendant.name}</p>
                <p><strong>Phone:</strong> {attendant.phone}</p>
                {attendant.documentUrl && (
                  <a
                    href={attendant.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View Document
                  </a>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleApprove(attendant._id)}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(attendant._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApproveAttendants;

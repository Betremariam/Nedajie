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
      setAttendants((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Error approving attendant:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      await API.delete(`/admins/reject-attendant/${id}`);
      setAttendants((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Error rejecting attendant:", error);
    }
  };

  useEffect(() => {
    fetchAttendants();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center p-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading attendants...</p>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Approve Attendants</h1>
        <p className="text-muted-foreground">Review and approve pending attendant registrations</p>
      </div>

      {attendants.length === 0 ? (
        <div className="bg-card rounded-xl shadow-sm border border-border p-12 text-center">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Pending Approvals</h3>
          <p className="text-muted-foreground">All attendants have been reviewed and processed.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {attendants.map((attendant) => (
            <div
              key={attendant.id}
              className="bg-card rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold text-lg">
                        {attendant.name?.charAt(0) || 'A'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{attendant.name}</h3>
                      <p className="text-muted-foreground">{attendant.phone}</p>
                    </div>
                  </div>
                  
                  {attendant.documentUrl && (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <a
                        href={attendant.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/90 font-medium transition-colors duration-200"
                      >
                        View Verification Document
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(attendant.id)}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold shadow-sm hover:shadow-md flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(attendant.id)}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 font-semibold shadow-sm hover:shadow-md flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApproveAttendants;

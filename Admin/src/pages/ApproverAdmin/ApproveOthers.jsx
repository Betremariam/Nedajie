import React, { useEffect, useState, useRef } from "react";
import API from "../../services/api";
import { QRCodeCanvas } from "qrcode.react";

const ApproveOthers = () => {
  const [others, setOthers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvedUser, setApprovedUser] = useState(null);
  const qrRef = useRef();

  const fetchOthers = async () => {
    try {
      const { data } = await API.get("/admins/unapproved-other-user");
      setOthers(data);
    } catch (error) {
      console.error("Error fetching other users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const { data } = await API.put(`/admins/approve-other-user/${id}`);
      setOthers((prev) => prev.filter((user) => user.id !== id));
      setApprovedUser(data.other);
    } catch (error) {
      console.error("Error approving other user:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      await API.delete(`/admins/reject-other-user/${id}`);
      setOthers((prev) => prev.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error rejecting other user:", error);
    }
  };

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return alert("QR code not found!");

    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");

    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = `other-user-qr-${approvedUser.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchOthers();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center p-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading users...</p>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Approve Other Users</h1>
        <p className="text-muted-foreground">Review and approve pending user registrations</p>
      </div>

      {approvedUser && (
        <div className="mb-8 bg-card rounded-xl shadow-lg border border-purple-200 p-8 max-w-md mx-auto">
          <div ref={qrRef} className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">User Approved Successfully</h3>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4 mb-4">
              <QRCodeCanvas
                value={approvedUser.id}
                size={200}
                bgColor="#ffffff"
                fgColor="#1f2937"
                level="H"
                includeMargin={true}
              />
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4 mb-6">
              <p className="font-semibold text-foreground">{approvedUser.fullName}</p>
              <p className="text-sm text-muted-foreground mt-1">User ID: {approvedUser.id}</p>
              <p className="text-sm text-muted-foreground">Fuel Type: {approvedUser.fuelType}</p>
            </div>
            
            <button
              onClick={handleDownload}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold shadow-sm hover:shadow-md flex items-center gap-2 mx-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download QR Code
            </button>
          </div>
        </div>
      )}

      {others.length === 0 ? (
        <div className="bg-card rounded-xl shadow-sm border border-border p-12 text-center">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Pending Users</h3>
          <p className="text-muted-foreground">All user applications have been reviewed and processed.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {others.map((user) => (
            <div
              key={user.id}
              className="bg-card rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-semibold text-lg">
                        {user.fullName?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{user.fullName}</h3>
                      <p className="text-muted-foreground">{user.phoneNumber}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-muted-foreground"><strong>Fuel Type:</strong> {user.fuelType}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(user.id)}
                    className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors duration-200 font-semibold shadow-sm hover:shadow-md flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(user.id)}
                    className="bg-slate-100 text-slate-600 px-6 py-3 rounded-lg hover:bg-slate-200 transition-colors duration-200 font-semibold shadow-sm hover:shadow-md flex items-center gap-2"
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

export default ApproveOthers;

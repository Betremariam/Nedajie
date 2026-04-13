import React, { useEffect, useState, useRef } from "react";
import API from "../../services/api";
import { QRCodeCanvas } from "qrcode.react";

const ApproveFarmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvedFarmer, setApprovedFarmer] = useState(null);
  const qrRef = useRef();

  const fetchFarmers = async () => {
    try {
      const { data } = await API.get("/admins/unapproved-farmers");
      setFarmers(data);
    } catch (error) {
      console.error("Error fetching farmers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const { data } = await API.put(`/admins/approve-farmer/${id}`);
      setFarmers((prev) => prev.filter((f) => f.id !== id));
      setApprovedFarmer(data.farmer); // Save farmer info for QR
    } catch (error) {
      console.error("Error approving farmer:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      await API.delete(`/admins/reject-farmer/${id}`);
      setFarmers((prev) => prev.filter((f) => f.id !== id));
    } catch (error) {
      console.error("Error rejecting farmer:", error);
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
    link.download = `farmer-qr-${approvedFarmer.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchFarmers();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center p-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading farmers...</p>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Approve Farmers</h1>
        <p className="text-muted-foreground">Review and approve pending farmer registrations</p>
      </div>

      {approvedFarmer && (
        <div className="mb-8 bg-card rounded-xl shadow-lg border border-green-200 p-8 max-w-md mx-auto">
          <div ref={qrRef} className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Farmer Approved Successfully</h3>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4 mb-4">
              <QRCodeCanvas
                value={approvedFarmer.id}
                size={200}
                bgColor="#ffffff"
                fgColor="#1f2937"
                level="H"
                includeMargin={true}
              />
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <p className="font-semibold text-foreground">{approvedFarmer.fullName}</p>
              <p className="text-sm text-muted-foreground mt-1">Farmer ID: {approvedFarmer.id}</p>
              <p className="text-sm text-muted-foreground">{approvedFarmer.woreda} • {approvedFarmer.kebele}</p>
            </div>
            
            <button
              onClick={handleDownload}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors duration-200 font-semibold shadow-sm hover:shadow-md flex items-center gap-2 mx-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download QR Code
            </button>
          </div>
        </div>
      )}

      {farmers.length === 0 ? (
        <div className="bg-card rounded-xl shadow-sm border border-border p-12 text-center">
          <div className="text-6xl mb-4">👨‍🌾</div>
          <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Pending Farmers</h3>
          <p className="text-muted-foreground">All farmer applications have been reviewed and processed.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {farmers.map((farmer) => (
            <div
              key={farmer.id}
              className="bg-card rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-semibold text-lg">
                        {farmer.fullName?.charAt(0) || 'F'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{farmer.fullName}</h3>
                      <p className="text-muted-foreground">{farmer.phoneNumber}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-muted-foreground"><strong>Woreda:</strong> {farmer.woreda}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="text-muted-foreground"><strong>Kebele:</strong> {farmer.kebele}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(farmer.id)}
                    className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors duration-200 font-semibold shadow-sm hover:shadow-md flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(farmer.id)}
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

export default ApproveFarmers;

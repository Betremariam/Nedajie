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
      setFarmers((prev) => prev.filter((f) => f._id !== id));
      setApprovedFarmer(data.farmer); // Save farmer info for QR
    } catch (error) {
      console.error("Error approving farmer:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      await API.delete(`/admins/reject-farmer/${id}`);
      setFarmers((prev) => prev.filter((f) => f._id !== id));
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
    link.download = `farmer-qr-${approvedFarmer._id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchFarmers();
  }, []);

  if (loading) return <div className="text-center p-4">Loading farmers...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-black">
      <h1 className="text-2xl font-bold mb-4">Unapproved Farmers</h1>

      {approvedFarmer && (
        <div
          ref={qrRef}
          className="mt-6 bg-white shadow-lg p-4 rounded text-center max-w-md mx-auto"
        >
          <h3 className="text-lg font-semibold mb-2">
            Farmer QR Code for {approvedFarmer.name}
          </h3>
          <QRCodeCanvas
            value={approvedFarmer._id}
            size={180}
            bgColor="#ffffff"
            fgColor="#000000"
            level="H"
            includeMargin={true}
          />
          <p className="mt-2 text-sm text-gray-600">ID: {approvedFarmer._id}</p>
          <button
            onClick={handleDownload}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Download QR Code
          </button>
        </div>
      )}

      {farmers.length === 0 ? (
        <p className="mt-4 text-gray-600">No pending farmers.</p>
      ) : (
        <div className="flex flex-col gap-4 mt-6">
          {farmers.map((farmer) => (
            <div
              key={farmer._id}
              className="bg-white rounded-lg shadow px-4 py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
                <p><strong>Name:</strong> {farmer.fullName}</p>
                <p><strong>Phone:</strong> {farmer.phoneNumber}</p>
                <p><strong>wereda:</strong> {farmer.woreda}</p>
                <p><strong>kebele:</strong> {farmer.kebele}</p>
                {/* Add more fields here if needed */}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleApprove(farmer._id)}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(farmer._id)}
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

export default ApproveFarmers;

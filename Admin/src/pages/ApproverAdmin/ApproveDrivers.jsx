import React, { useEffect, useState, useRef } from "react";
import API from "../../services/api";
import { QRCodeCanvas } from "qrcode.react";

const ApproveDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvedDriver, setApprovedDriver] = useState(null);
  const qrRef = useRef();

  const fetchDrivers = async () => {
    try {
      const { data } = await API.get("/admins/unapproved-drivers");
      setDrivers(data);
    } catch (error) {
      console.error("Error fetching drivers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const { data } = await API.put(`/admins/approve-driver/${id}`);
      setDrivers((prev) => prev.filter((d) => d._id !== id));
      setApprovedDriver(data.driver); // Save driver info for QR
    } catch (error) {
      
      console.error("Error approving driver:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      await API.delete(`/admins/reject-driver/${id}`);
      setDrivers((prev) => prev.filter((d) => d._id !== id));
    } catch (error) {
      console.error("Error rejecting driver:", error);
    }
  };

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return alert("QR code not found!");

    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");

    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `driver-qr-${approvedDriver._id}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  if (loading) return <div className="text-center p-4">Loading drivers...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-black">
      <h1 className="text-2xl font-bold mb-4">Unapproved Drivers</h1>

      {approvedDriver && (
        <div
          ref={qrRef}
          className="mt-6 bg-white shadow-lg p-4 rounded text-center max-w-md mx-auto"
        >
          <h3 className="text-lg font-semibold mb-2">
            Driver QR Code for {approvedDriver.name}
          </h3>
          <QRCodeCanvas
            value={approvedDriver._id}
            size={180}
            bgColor="#ffffff"
            fgColor="#000000"
            level="H"
            includeMargin={true}
          />
          <p className="mt-2 text-sm text-gray-600">ID: {approvedDriver._id}</p>
          <button
            onClick={handleDownload}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Download QR Code
          </button>
        </div>
      )}

      {drivers.length === 0 ? (
        <p className="mt-4 text-gray-600">No pending drivers.</p>
      ) : (
        <div className="flex flex-col gap-4 mt-6">
          {drivers.map((driver) => (
            <div
              key={driver._id}
              className="bg-white rounded-lg shadow px-4 py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
                <p><strong>Name:</strong> {driver.name}</p>
                <p><strong>Phone:</strong> {driver.phone}</p>
                <p><strong>Car Type:</strong> {driver.carType}</p>
                <p><strong>Plate:</strong> {driver.carPlate}</p>
                {driver.documentUrl && (
                  <a
                    href={driver.documentUrl}
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
                  onClick={() => handleApprove(driver._id)}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(driver._id)}
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

export default ApproveDrivers;

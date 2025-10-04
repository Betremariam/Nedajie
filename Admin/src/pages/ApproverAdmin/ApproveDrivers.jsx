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

  if (loading) return (
    <div className="flex justify-center items-center p-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading drivers...</p>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Approve Drivers</h1>
        <p className="text-gray-600">Review and approve pending driver registrations</p>
      </div>

      {approvedDriver && (
        <div className="mb-8 bg-white rounded-xl shadow-lg border border-green-200 p-8 max-w-md mx-auto">
          <div ref={qrRef} className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Driver Approved Successfully</h3>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <QRCodeCanvas
                value={approvedDriver._id}
                size={200}
                bgColor="#ffffff"
                fgColor="#1f2937"
                level="H"
                includeMargin={true}
              />
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <p className="font-semibold text-gray-900">{approvedDriver.name}</p>
              <p className="text-sm text-gray-600 mt-1">Driver ID: {approvedDriver._id}</p>
              <p className="text-sm text-gray-600">{approvedDriver.carType} • {approvedDriver.carPlate}</p>
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

      {drivers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">🚗</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Pending Drivers</h3>
          <p className="text-gray-500">All driver applications have been reviewed and processed.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {drivers.map((driver) => (
            <div
              key={driver._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-lg">
                        {driver.name?.charAt(0) || 'D'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{driver.name}</h3>
                      <p className="text-gray-600">{driver.phone}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-gray-700"><strong>Car Type:</strong> {driver.carType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                      </svg>
                      <span className="text-gray-700"><strong>Plate:</strong> {driver.carPlate}</span>
                    </div>
                  </div>

                  {driver.documentUrl && (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <a
                        href={driver.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                      >
                        View Verification Document
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(driver._id)}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold shadow-sm hover:shadow-md flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(driver._id)}
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

export default ApproveDrivers;
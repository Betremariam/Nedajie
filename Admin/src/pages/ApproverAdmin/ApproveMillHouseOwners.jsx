import React, { useEffect, useState, useRef } from "react";
import API from "../../services/api";
import { QRCodeCanvas } from "qrcode.react";
import { Home, PhoneCall, Landmark, MapPin, Droplets, ShieldCheck, CheckCircle2, X } from "lucide-react";

const ApproveMillHouseOwners = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvedOwner, setApprovedOwner] = useState(null);
  const qrRef = useRef();

  const fetchOwners = async () => {
    try {
      const { data } = await API.get("/admins/unapproved-mill-house-owners");
      setOwners(data);
    } catch (error) {
      console.error("Error fetching mill house owners:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const { data } = await API.put(`/admins/approve-mill-house-owner/${id}`);
      setOwners((prev) => prev.filter((o) => o.id !== id));
      setApprovedOwner(data.owner);
    } catch (error) {
      console.error("Error approving mill house owner:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      await API.delete(`/admins/reject-mill-house-owner/${id}`);
      setOwners((prev) => prev.filter((o) => o.id !== id));
    } catch (error) {
      console.error("Error rejecting mill house owner:", error);
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
    link.download = `mill-owner-qr-${approvedOwner.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center p-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading mill house owners...</p>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Approve Mill House Owners</h1>
        <p className="text-muted-foreground">Review and approve pending milling operation registrations</p>
      </div>

      {approvedOwner && (
        <div className="mb-8 bg-card rounded-xl shadow-lg border border-primary/20 p-8 max-w-md mx-auto">
          <div ref={qrRef} className="text-center relative">
            <button 
                onClick={() => setApprovedOwner(null)}
                className="absolute -top-4 -right-4 p-2 bg-muted rounded-full hover:bg-muted/80 transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Owner Approved</h3>
            </div>
            
            <div className="bg-white rounded-lg p-4 mb-4 shadow-sm inline-block">
              <QRCodeCanvas
                value={approvedOwner.id}
                size={220}
                bgColor="#ffffff"
                fgColor="#1f2937"
                level="H"
                includeMargin={true}
              />
            </div>
            
            <div className="bg-primary/5 rounded-xl p-4 mb-6 border border-primary/10">
              <p className="font-bold text-lg text-foreground">{approvedOwner.fullName}</p>
              <div className="flex items-center justify-center gap-2 mt-2 text-sm text-muted-foreground">
                 <Badge variant="secondary" className="font-bold">{approvedOwner.dailyLimit}L / {approvedOwner.fuelType}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2 font-mono opacity-60">ID: {approvedOwner.id}</p>
            </div>
            
            <button
              onClick={handleDownload}
              className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-all duration-200 font-bold shadow-md shadow-primary/20 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Official QR
            </button>
          </div>
        </div>
      )}

      {owners.length === 0 ? (
        <div className="bg-card rounded-xl shadow-sm border border-border p-12 text-center">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
             <Home className="w-10 h-10 opacity-20" />
          </div>
          <h3 className="text-xl font-bold text-muted-foreground mb-2">No Pending Approvals</h3>
          <p className="text-muted-foreground">All mill house registration requests have been processed.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {owners.map((owner) => (
            <div
              key={owner.id}
              className="bg-card rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <span className="text-primary font-bold text-lg">
                        {owner.fullName?.charAt(0) || 'M'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{owner.fullName}</h3>
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                         <PhoneCall className="w-3.5 h-3.5" />
                         {owner.phoneNumber}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <div className="space-y-1">
                       <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Location</p>
                       <div className="flex items-center gap-2 text-sm text-foreground/80">
                         <MapPin className="w-3.5 h-3.5 text-primary" />
                         {owner.woreda}, {owner.kebele}
                       </div>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Allocation</p>
                       <div className="flex items-center gap-2 text-sm text-foreground/80">
                         <Droplets className="w-3.5 h-3.5 text-primary" />
                         {owner.dailyLimit}L ({owner.fuelType})
                       </div>
                    </div>
                    {owner.documentPath && (
                       <div className="space-y-1">
                          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Credentials</p>
                          <a 
                            href={owner.documentUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-primary font-bold hover:underline flex items-center gap-1.5"
                          >
                             View Supporting Docs
                          </a>
                       </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleApprove(owner.id)}
                    className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-all duration-200 font-bold shadow-md shadow-primary/20 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(owner.id)}
                    className="bg-muted text-muted-foreground px-6 py-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all duration-200 font-bold border border-transparent hover:border-red-200 flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" />
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

export default ApproveMillHouseOwners;

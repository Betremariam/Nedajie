import React, { useEffect, useState, useRef } from "react";
import API from "../../services/api";
import { QRCodeCanvas } from "qrcode.react";
import { 
  CheckCircle2, 
  Loader2, 
  User, 
  PhoneCall, 
  MapPin, 
  FileText, 
  Download,
  Trash2,
  Check,
  Wheat,
  ArrowRight
} from "lucide-react";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Label } from "../../components/ui/Label";

const ApproveFarmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvedFarmer, setApprovedFarmer] = useState(null);
  const [expiryDates, setExpiryDates] = useState({}); // Track expiry date for each farmer
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
      const expiryDate = expiryDates[id];
      if (!expiryDate) return alert("Please set an expiry date for this farmer's QR.");

      const { data } = await API.put(`/admins/approve-farmer/${id}`, { expiryDate });
      setFarmers((prev) => prev.filter((f) => f.id !== id));
      setApprovedFarmer(data.farmer);
    } catch (error) {
      console.error("Error approving farmer:", error);
      alert(error.response?.data?.msg || "Approval failed");
    }
  };

  const handleExpiryChange = (id, date) => {
    setExpiryDates(prev => ({ ...prev, [id]: date }));
  };

  const handleReject = async (id) => {
    if(!window.confirm("Reject and delete this farmer application?")) return;
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
    link.download = `farmer-qr-${approvedFarmer.fullName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchFarmers();
  }, []);

  if (loading) return (
    <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-muted-foreground font-medium">Loading farmer registry...</p>
    </div>
  );

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Farmer Approvals</h1>
          <p className="text-muted-foreground font-medium">Review and authorize agricultural fuel allocations</p>
        </div>
        <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/20 px-4 py-2 text-sm font-bold h-fit">
          {farmers.length} Pending
        </Badge>
      </div>

      {approvedFarmer && (
        <div className="bg-card border-2 border-emerald-500/20 rounded-[24px] shadow-xl p-8 animate-in fade-in zoom-in duration-300">
          <div ref={qrRef} className="flex flex-col md:flex-row items-center gap-10">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
              <QRCodeCanvas
                value={approvedFarmer.id}
                size={200}
                bgColor="#ffffff"
                fgColor="#1f2937"
                level="H"
                includeMargin={true}
              />
            </div>
            
            <div className="flex-1 space-y-6 text-center md:text-left">
              <div className="space-y-2">
                <div className="flex items-center gap-2 justify-center md:justify-start text-emerald-600">
                  <CheckCircle2 className="w-6 h-6" />
                  <h3 className="text-2xl font-bold text-foreground">Farmer Verified</h3>
                </div>
                <p className="text-muted-foreground font-medium uppercase tracking-wider text-[11px]">Agricultural quota has been activated</p>
              </div>

              <div className="bg-muted/30 rounded-2xl p-6 border border-border/50 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-muted-foreground uppercase opacity-60">Full Name</p>
                  <p className="font-bold text-foreground">{approvedFarmer.fullName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-muted-foreground uppercase opacity-60">Location</p>
                  <p className="font-bold text-foreground">{approvedFarmer.woreda}, {approvedFarmer.kebele}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-muted-foreground uppercase opacity-60">Phone</p>
                  <p className="font-bold text-foreground">{approvedFarmer.phoneNumber}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-muted-foreground uppercase opacity-60">ID</p>
                  <p className="font-bold text-primary tabular-nums">{approvedFarmer.id.slice(-8)}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleDownload} className="h-12 px-8 rounded-xl gap-2 font-bold shadow-lg shadow-primary/20">
                  <Download className="w-5 h-5" /> Download Farmer QR
                </Button>
                <Button variant="outline" onClick={() => setApprovedFarmer(null)} className="h-12 px-8 rounded-xl font-bold">
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {farmers.length === 0 ? (
        <div className="border border-dashed border-border py-20 bg-muted/5 rounded-[24px]">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
              <Wheat className="w-10 h-10 text-muted-foreground opacity-30" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-foreground">All Caught Up</h3>
              <p className="text-muted-foreground max-w-[280px]">No pending farmer applications in your regional queue.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {farmers.map((farmer) => (
            <div
              key={farmer.id}
              className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/20 transition-all group"
            >
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{farmer.fullName}</h3>
                      <p className="text-sm text-muted-foreground font-medium">{farmer.phoneNumber}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    <div className="space-y-1">
                      <Label className="text-[10px] font-black uppercase opacity-50 flex items-center gap-1.5">
                        <MapPin className="w-3 h-3" /> Area
                      </Label>
                      <p className="text-sm font-bold">{farmer.woreda}, {farmer.kebele}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-black uppercase opacity-50 flex items-center gap-1.5">
                        <Wheat className="w-3 h-3" /> Land Size
                      </Label>
                      <p className="text-sm font-bold text-emerald-600">{farmer.landSize} Hectares</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-black uppercase opacity-50 flex items-center gap-1.5">
                        <FileText className="w-3 h-3" /> Credentials
                      </Label>
                      {farmer.documentUrl ? (
                         <a href={farmer.documentUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">
                            Verify <ArrowRight className="w-3 h-3" />
                         </a>
                      ) : <p className="text-sm font-bold text-red-500">Missing</p>}
                    </div>
                    <div className="space-y-1 col-span-2 sm:col-span-1">
                      <Label className="text-[10px] font-black uppercase opacity-50 flex items-center gap-1.5">
                        QR Expiry Date
                      </Label>
                      <input 
                        type="date"
                        className="w-full text-xs font-bold border rounded-lg p-1 px-2 focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                        value={expiryDates[farmer.id] || ""}
                        onChange={(e) => handleExpiryChange(farmer.id, e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex lg:flex-col justify-end gap-3 pt-4 lg:pt-0 lg:border-l lg:pl-8 border-border">
                  <Button 
                    onClick={() => handleApprove(farmer.id)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2 font-bold h-12 lg:h-11 shadow-md shadow-emerald-500/10"
                  >
                    <Check className="w-4 h-4" /> Approve
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleReject(farmer.id)}
                    className="flex-1 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl gap-2 font-bold h-12 lg:h-11"
                  >
                    <Trash2 className="w-4 h-4" /> Reject
                  </Button>
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

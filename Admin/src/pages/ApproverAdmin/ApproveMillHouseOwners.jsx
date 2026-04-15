import React, { useEffect, useState, useRef } from "react";
import API from "../../services/api";
import { QRCodeCanvas } from "qrcode.react";
import { 
  Home, 
  PhoneCall, 
  MapPin, 
  Droplets, 
  CheckCircle2, 
  X, 
  Loader2, 
  FileText, 
  Download,
  Trash2,
  Check,
  ArrowRight
} from "lucide-react";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Label } from "../../components/ui/Label";

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
    if(!window.confirm("Reject and delete this mill house application?")) return;
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
    link.download = `mill-owner-qr-${approvedOwner.fullName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  if (loading) return (
    <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-muted-foreground font-medium">Reviewing industrial permits...</p>
    </div>
  );

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Mill House Approvals</h1>
          <p className="text-muted-foreground font-medium">Authorize fuel allocations for milling operations</p>
        </div>
        <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/20 px-4 py-2 text-sm font-bold h-fit">
          {owners.length} Pending
        </Badge>
      </div>

{approvedOwner && (
        <div className="bg-card border-2 border-primary/10 rounded-[24px] shadow-xl p-8 animate-in fade-in zoom-in duration-300">
          <div ref={qrRef} className="flex flex-col md:flex-row items-center gap-10">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
              <QRCodeCanvas
                value={approvedOwner.id}
                size={200}
                bgColor="#ffffff"
                fgColor="#1f2937"
                level="H"
                includeMargin={true}
              />
            </div>
            
            <div className="flex-1 space-y-6 text-center md:text-left">
              <div className="space-y-2">
                <div className="flex items-center gap-2 justify-center md:justify-start text-primary">
                  <CheckCircle2 className="w-6 h-6" />
                  <h3 className="text-2xl font-bold text-foreground">Mill Site Authorized</h3>
                </div>
                <p className="text-muted-foreground font-medium uppercase tracking-wider text-[10px]">Industrial fuel quota has been activated</p>
              </div>

              <div className="bg-muted/30 rounded-2xl p-6 border border-border/50 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-muted-foreground uppercase opacity-60 tracking-widest">Site Owner</p>
                  <p className="font-bold text-foreground">{approvedOwner.fullName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-muted-foreground uppercase opacity-60 tracking-widest">Operational Quota</p>
                  <p className="font-bold text-foreground">{approvedOwner.numberOfMills * 300}L per 15 Days</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-muted-foreground uppercase opacity-60 tracking-widest">Site Location</p>
                  <p className="font-bold text-foreground">{approvedOwner.woreda}, {approvedOwner.kebele}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-muted-foreground uppercase opacity-60 tracking-widest">Security ID</p>
                  <p className="font-bold text-primary tabular-nums">{approvedOwner.id.slice(-8)}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleDownload} className="h-12 px-8 rounded-xl gap-2 font-bold shadow-lg shadow-primary/20">
                  <Download className="w-5 h-5" /> Download Site QR
                </Button>
                <Button variant="outline" onClick={() => setApprovedOwner(null)} className="h-12 px-8 rounded-xl font-bold">
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {owners.length === 0 ? (
        <div className="border border-dashed border-border py-20 bg-muted/5 rounded-[24px]">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
              <Home className="w-10 h-10 text-muted-foreground opacity-30" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-foreground">Operational Excellence</h3>
              <p className="text-muted-foreground max-w-[280px]">All mill house permits have been reviewed.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {owners.map((owner) => (
            <div
              key={owner.id}
              className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/20 transition-all group"
            >
              <div className="flex flex-col gap-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                      <Home className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{owner.fullName}</h3>
                      <p className="text-sm text-muted-foreground font-medium">{owner.phoneNumber}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    <div className="space-y-1">
                      <Label className="text-[10px] font-black uppercase opacity-50 flex items-center gap-1.5">
                        <MapPin className="w-3 h-3" /> Location
                      </Label>
                      <p className="text-sm font-bold truncate">{owner.woreda}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-black uppercase opacity-50 flex items-center gap-1.5">
                        <Droplets className="w-3 h-3" /> Mills
                      </Label>
                      <p className="text-sm font-bold">{owner.numberOfMills} Units</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-black uppercase opacity-50 flex items-center gap-1.5">
                        Quota
                      </Label>
                      <p className="text-sm font-bold text-emerald-600">{owner.numberOfMills * 300}L</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-black uppercase opacity-50 flex items-center gap-1.5 tracking-wider">
                        <FileText className="w-3 h-3" /> Artifacts
                      </Label>
                      {owner.documentUrl ? (
                         <a href={owner.documentUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                            Review <ArrowRight className="w-3 h-3" />
                         </a>
                      ) : <p className="text-sm font-bold text-destructive">Missing</p>}
                    </div>
                  </div>
                </div>

                <div className="flex flex-row justify-end gap-3 pt-6 mt-6 border-t border-border/50">
                  <Button 
                    variant="ghost" 
                    onClick={() => handleReject(owner.id)}
                    className="flex-1 sm:flex-none text-destructive hover:bg-destructive/5 hover:text-destructive rounded-xl gap-2 font-bold h-11 px-6 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Reject Permit
                  </Button>
                  <Button 
                    onClick={() => handleApprove(owner.id)}
                    className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl gap-2 font-bold h-11 px-8 shadow-md shadow-primary/10 transition-all active:scale-95"
                  >
                    <Check className="w-4 h-4" /> Approve Site
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

export default ApproveMillHouseOwners;

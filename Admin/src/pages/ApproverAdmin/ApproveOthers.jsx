import React, { useEffect, useState, useRef } from "react";
import API from "../../services/api";
import { QRCodeCanvas } from "qrcode.react";
import { 
  CheckCircle2, 
  Loader2, 
  UserPlus, 
  PhoneCall, 
  Droplets, 
  ShieldCheck, 
  FileText, 
  Download,
  Trash2,
  Check,
  Users,
  Award,
  ArrowRight
} from "lucide-react";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Label } from "../../components/ui/Label";

const ApproveOthers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvedUser, setApprovedUser] = useState(null);
  const qrRef = useRef();

  const fetchUsers = async () => {
    try {
      const { data } = await API.get("/admins/unapproved-other-user");
      setUsers(data);
    } catch (error) {
      console.error("Error fetching other users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const { data } = await API.put(`/admins/approve-other-user/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setApprovedUser(data.other || data.user); // Backend might return .other or .user
    } catch (error) {
      console.error("Error approving user:", error);
    }
  };

  const handleReject = async (id) => {
    if(!window.confirm("Reject and delete this entity request?")) return;
    try {
      await API.delete(`/admins/reject-other-user/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      console.error("Error rejecting user:", error);
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
    link.download = `entity-qr-${approvedUser.fullName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return (
    <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-muted-foreground font-medium">Scanning identity manifest...</p>
    </div>
  );

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Entity Approvals</h1>
          <p className="text-muted-foreground font-medium">Review and authorize auxiliary resource consumers</p>
        </div>
        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-4 py-2 text-[11px] font-black uppercase tracking-widest h-fit">
          {users.length} Pending Authorization
        </Badge>
      </div>

{approvedUser && (
        <div className="bg-card border-2 border-primary/10 rounded-[24px] shadow-xl p-8 animate-in fade-in zoom-in duration-300">
          <div ref={qrRef} className="flex flex-col md:flex-row items-center gap-10">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
              <QRCodeCanvas
                value={approvedUser.id}
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
                  <h3 className="text-2xl font-bold text-foreground">Authorization Complete</h3>
                </div>
                <p className="text-muted-foreground font-medium uppercase tracking-wider text-[10px]">allocation profile has been generated and queued</p>
              </div>

              <div className="bg-muted/30 rounded-2xl p-6 border border-border/50 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-muted-foreground uppercase opacity-60 tracking-widest">Entity Name</p>
                  <p className="font-bold text-foreground">{approvedUser.fullName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-muted-foreground uppercase opacity-60 tracking-widest">Resource Type</p>
                  <Badge variant="outline" className="font-bold uppercase bg-primary/5 border-primary/20 text-primary">{approvedUser.fuelType}</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-muted-foreground uppercase opacity-60 tracking-widest">Usage Quota</p>
                  <p className="font-bold text-foreground">{approvedUser.totalAllowedLiters}L Bucket</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-muted-foreground uppercase opacity-60 tracking-widest">Entity ID</p>
                  <p className="font-bold text-primary tabular-nums">{approvedUser.id.slice(-8)}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleDownload} className="h-12 px-8 rounded-xl gap-2 font-bold shadow-lg shadow-primary/20">
                  <Download className="w-5 h-5" /> Download Identity QR
                </Button>
                <Button variant="outline" onClick={() => setApprovedUser(null)} className="h-12 px-8 rounded-xl font-bold">
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {users.length === 0 ? (
        <div className="border border-dashed border-border py-20 bg-muted/5 rounded-[24px]">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
              <Users className="w-10 h-10 text-muted-foreground opacity-30" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-foreground">Clean Slate</h3>
              <p className="text-muted-foreground max-w-[280px]">No auxiliary entity applications found in your region.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/20 transition-all group"
            >
              <div className="flex flex-col gap-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                      <UserPlus className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{user.fullName}</h3>
                      <p className="text-sm text-muted-foreground font-medium">{user.phoneNumber}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    <div className="space-y-1">
                      <Label className="text-[10px] font-black uppercase opacity-50 flex items-center gap-1.5">
                        <Droplets className="w-3 h-3" /> Priority
                      </Label>
                      <p className="text-sm font-bold uppercase">{user.fuelType}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-black uppercase opacity-50 flex items-center gap-1.5">
                        <Award className="w-3 h-3" /> Bucket
                      </Label>
                      <p className="text-sm font-bold uppercase">{user.totalAllowedLiters}L</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-black uppercase opacity-50 flex items-center gap-1.5 tracking-wider">
                        <FileText className="w-3 h-3" /> Credentials
                      </Label>
                      {user.documentPath ? (
                         <a href={user.documentPath} target="_blank" rel="noreferrer" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                            Review <ArrowRight className="w-3 h-3" />
                         </a>
                      ) : <p className="text-sm font-bold text-destructive">Missing</p>}
                    </div>
                  </div>
                </div>

                <div className="flex flex-row justify-end gap-3 pt-6 mt-6 border-t border-border/50">
                  <Button 
                    variant="ghost" 
                    onClick={() => handleReject(user.id)}
                    className="flex-1 sm:flex-none text-destructive hover:bg-destructive/5 hover:text-destructive rounded-xl gap-2 font-bold h-11 px-6 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Reject Request
                  </Button>
                  <Button 
                    onClick={() => handleApprove(user.id)}
                    className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl gap-2 font-bold h-11 px-8 shadow-md shadow-primary/10 transition-all active:scale-95"
                  >
                    <Check className="w-4 h-4" /> Authorize Entity
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

export default ApproveOthers;

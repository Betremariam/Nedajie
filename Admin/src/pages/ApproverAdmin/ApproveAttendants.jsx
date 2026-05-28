import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { 
  CheckCircle2, 
  Loader2, 
  UserCheck, 
  Phone,
  Building2,
  MapPin, 
  FileText, 
  X,
  Users,
  ExternalLink
} from "lucide-react";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/Alert";
import { useTranslation } from "react-i18next";

const ApproveAttendants = () => {
  const { t } = useTranslation();
  const [attendants, setAttendants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [approvedAttendantName, setApprovedAttendantName] = useState("");

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
      const { data } = await API.put(`/admins/approve-attendant/${id}`);
      setAttendants((prev) => prev.filter((a) => a.id !== id));
      setApprovedAttendantName(data.attendant.name);
      setShowSuccessAlert(true);
      
      // Auto-hide success alert after 5 seconds
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 5000);
    } catch (error) {
      console.error("Error approving attendant:", error);
    }
  };

  const handleReject = async (id) => {
    if(!window.confirm("Reject and delete this attendant request?")) return;
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
    <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-muted-foreground font-medium">{t("loading")}</p>
    </div>
  );

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">{t("attendantApprovals")}</h1>
          <p className="text-muted-foreground text-[14px] font-medium">{t("attendantApprovalsDesc")}</p>
        </div>
        <Badge variant="outline" className="w-fit bg-primary/5 text-primary border-primary/20 px-4 py-2 text-sm font-bold">
          {attendants.length} {t("pending")}
        </Badge>
      </div>

      {/* Success Alert */}
      {showSuccessAlert && (
        <Alert className="border-2 border-emerald-500/50 bg-emerald-500/5 rounded-2xl p-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <AlertTitle className="font-bold text-lg text-emerald-600">{t("attendantApprovedSuccess")}</AlertTitle>
                <AlertDescription className="text-[13px] text-emerald-600/80 mt-1">
                  <strong>{approvedAttendantName}</strong> {t("attendantApprovedDesc")}
                </AlertDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSuccessAlert(false)}
              className="h-8 w-8 p-0 hover:bg-emerald-500/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Alert>
      )}

      {/* Attendants List */}
      {attendants.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-2xl py-16 bg-muted/5">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-muted-foreground opacity-40" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-foreground">All Clear</h3>
              <p className="text-muted-foreground text-sm max-w-[280px]">No pending attendant approvals at this time</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {attendants.map((attendant) => (
            <div
              key={attendant.id}
              className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/20 transition-all"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Attendant Info */}
                <div className="flex-1 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20 flex-shrink-0">
                      <UserCheck className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-foreground mb-1">{attendant.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-3.5 h-3.5" />
                        <span className="font-medium">{attendant.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-muted-foreground opacity-50">
                        <Building2 className="w-3 h-3" />
                        Station
                      </div>
                      <p className="text-sm font-bold text-foreground truncate">{attendant.stationName}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-muted-foreground opacity-50">
                        <MapPin className="w-3 h-3" />
                        City
                      </div>
                      <p className="text-sm font-bold text-foreground">{attendant.city}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-muted-foreground opacity-50">
                        <FileText className="w-3 h-3" />
                        Document
                      </div>
                      {attendant.documentUrl ? (
                        <a 
                          href={attendant.documentUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-sm font-bold text-primary hover:underline flex items-center gap-1"
                        >
                          Review <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <p className="text-sm font-bold text-destructive">Missing</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-row justify-end gap-3 pt-6 mt-6 border-t border-border/50">
                  <Button 
                    variant="ghost" 
                    onClick={() => handleReject(attendant.id)}
                    className="flex-1 sm:flex-none text-destructive hover:bg-destructive/5 hover:text-destructive rounded-xl gap-2 font-bold h-11 px-6 transition-colors"
                  >
                    <X className="w-4 h-4" /> {t("rejectRequest")}
                  </Button>
                  <Button 
                    onClick={() => handleApprove(attendant.id)}
                    className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl gap-2 font-bold h-11 px-8 shadow-md shadow-primary/10 transition-all active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4" /> {t("approveAttendant")}
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

export default ApproveAttendants;



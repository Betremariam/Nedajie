import React, { useEffect, useState } from "react";
import { getAllAdmins } from "../../services/api";
import {
  MapPin,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Users,
  Search,
} from "lucide-react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/Alert";
import { useTranslation } from "react-i18next";

const SuperAdminsList = () => {
  const { t } = useTranslation();
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await getAllAdmins();
      setAdmins(res.data.filter((a) => a.role === "super"));
    } catch {
      setError(t("failedToLoadAdmins"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const filtered = admins.filter(
    (a) =>
      a.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.email?.toLowerCase().includes(search.toLowerCase()) ||
      a.region?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{t("regionalSuperAdmins")}</h1>
          <p className="text-muted-foreground text-lg">{t("regionalSuperAdminsDesc")}</p>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-bold">{t("errorLabel")}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Admins Table Card */}
      <div className="bg-card rounded-[24px] shadow-sm border border-border overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 md:p-8 pb-4 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-[12px] bg-muted/50 border border-border flex items-center justify-center text-foreground shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-foreground tracking-tight">{t("regionalSuperAdmins")}</h2>
              <p className="text-muted-foreground text-[13px] font-medium">{admins.length} {t("registered")}</p>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t("search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 pl-11 rounded-xl border-border bg-muted/30 font-medium text-[13px] w-full sm:w-[220px] text-foreground"
            />
          </div>
        </div>

        {loading ? (
          <div className="h-48 flex flex-col items-center justify-center text-muted-foreground gap-3">
            <Loader2 className="w-10 h-10 animate-spin" />
            <p className="text-[13px] font-medium">{t("loading")}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-muted-foreground gap-3">
            <Users className="w-10 h-10 opacity-30" />
            <p className="text-[13px] font-medium">{search ? t("noResults") : t("noAdminsRegistered")}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left pl-6 md:pl-8 h-11 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Admin</th>
                  <th className="text-left h-11 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Email</th>
                  <th className="text-left h-11 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Region</th>
                  <th className="text-right pr-6 md:pr-8 h-11 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-right pr-6 md:pr-8 h-11 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((admin) => (
                  <tr key={admin._id || admin.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="pl-6 md:pl-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-muted border border-border flex items-center justify-center text-foreground font-bold text-[13px]">
                          {admin.name?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <span className="text-[14px] font-semibold text-foreground">{admin.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-[13px] text-muted-foreground font-medium">{admin.email}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground/50" />
                        {admin.region || "—"}
                      </div>
                    </td>
                    <td className="pr-6 md:pr-8 py-4 text-right">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {t("active")}
                      </span>
                    </td>
                    <td className="pr-6 md:pr-8 py-4 text-right">
                      <Button variant="outline" size="sm" onClick={() => setSelectedAdmin(admin)} className="h-8 px-3 rounded-lg text-xs font-semibold">View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Admin Details Modal */}
      {selectedAdmin && (
        <div 
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            zIndex: 9999 
          }}
          onClick={() => setSelectedAdmin(null)}
        >
          <div 
            className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-border p-6 space-y-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h3 className="text-lg font-bold text-foreground">Admin Details</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedAdmin(null)} className="h-8 w-8 rounded-full p-0 hover:bg-muted">✕</Button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase">Full Name</p>
                <p className="text-sm font-medium text-foreground">{selectedAdmin.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase">Email Address</p>
                <p className="text-sm font-medium text-foreground">{selectedAdmin.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase">Region</p>
                <p className="text-sm font-medium text-foreground">{selectedAdmin.region || "—"}</p>
              </div>
              {selectedAdmin.documentPath && (
                <div className="pt-2">
                  <p className="text-xs text-muted-foreground font-semibold uppercase mb-2">Uploaded Document</p>
                  <a
                    href={`http://localhost:5000/${selectedAdmin.documentPath.replace(/\\/g, '/')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-9 px-4 rounded-xl bg-primary/10 text-primary font-semibold text-sm hover:bg-primary/20 transition-colors"
                  >
                    View Document
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SuperAdminsList;

import React, { useEffect, useState, useRef } from "react";
import API from "../../services/api";
import { QRCodeCanvas } from "qrcode.react";
import { 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Car, 
  User, 
  CreditCard, 
  Fuel, 
  FileText, 
  Download,
  Trash2,
  Check
} from "lucide-react";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";

const ApproveVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [approvedVehicle, setApprovedVehicle] = useState(null);
  const qrRef = useRef();

  const fetchVehicles = async () => {
    try {
      const { data } = await API.get("/admins/unapproved-vehicles");
      setVehicles(data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const { data } = await API.put(`/admins/approve-vehicle/${id}`);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      setApprovedVehicle(data.vehicle);
    } catch (error) {
      console.error("Error approving vehicle:", error);
    }
  };

  const handleReject = async (id) => {
    if(!window.confirm("Are you sure you want to reject and delete this vehicle application?")) return;
    try {
      await API.delete(`/admins/reject-vehicle/${id}`);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
    } catch (error) {
      console.error("Error rejecting vehicle:", error);
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
    downloadLink.download = `vehicle-qr-${approvedVehicle.carPlate}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  if (loading) return (
    <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-muted-foreground animate-pulse font-medium">Fetching pending applications...</p>
    </div>
  );

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Vehicle Approvals</h1>
          <p className="text-muted-foreground font-medium">Review and authorize pending fleet registrations</p>
        </div>
        <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/20 px-4 py-2 text-sm font-bold h-fit">
          {vehicles.length} Pending
        </Badge>
      </div>

      {approvedVehicle && (
        <div className="bg-card border-2 border-emerald-500/20 rounded-[24px] shadow-xl p-8 animate-in fade-in zoom-in duration-300">
          <div ref={qrRef} className="flex flex-col md:flex-row items-center gap-10">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
              <QRCodeCanvas
                value={approvedVehicle.id}
                size={220}
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
                  <h3 className="text-2xl font-bold">Vehicle Approved</h3>
                </div>
                <p className="text-muted-foreground font-medium uppercase tracking-wider text-sm">Download the QR profile for the station attendant</p>
              </div>

              <div className="bg-muted/30 rounded-2xl p-6 border border-border/50 grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase opacity-60">Owner</p>
                  <p className="font-bold text-foreground">{approvedVehicle.ownerName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase opacity-60">Plate No.</p>
                  <p className="font-bold text-foreground uppercase">{approvedVehicle.carPlate}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase opacity-60">Type</p>
                  <Badge variant="outline" className="font-bold capitalize">{approvedVehicle.vehicleType}</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase opacity-60">Daily Limit</p>
                  <p className="font-bold text-primary">{approvedVehicle.fullCapacity} Liters</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleDownload} className="h-12 px-8 rounded-xl gap-2 font-bold shadow-lg shadow-primary/20">
                  <Download className="w-5 h-5" /> Download QR Profile
                </Button>
                <Button variant="outline" onClick={() => setApprovedVehicle(null)} className="h-12 px-8 rounded-xl font-bold">
                  Dimiss
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border border-border/50">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-muted-foreground whitespace-nowrap">Show Type:</span>
          <select 
            title="Filter by Vehicle Type"
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-10 px-4 rounded-lg border border-border bg-card font-medium text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
          >
            <option value="all">All Pending</option>
            <option value="bajaj">Bajaj</option>
            <option value="taxi">Taxi</option>
            <option value="car">Private Car</option>
            <option value="bus">Bus</option>
            <option value="truck">Truck</option>
            <option value="heavy">Heavy Machinery</option>
            <option value="boat">Boat / Marine</option>
            <option value="ambulance">Ambulance</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {vehicles.filter(v => typeFilter === "all" || v.vehicleType === typeFilter).length === 0 ? (
        <div className="border border-dashed border-border py-20 bg-muted/5 rounded-[24px]">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
              <Car className="w-10 h-10 text-muted-foreground opacity-30" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-foreground">Clean Slate</h3>
              <p className="text-muted-foreground max-w-[280px]">All vehicle applications have been processed. Great job!</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {vehicles.filter(v => typeFilter === "all" || v.vehicleType === typeFilter).map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/20 transition-all group"
            >
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{vehicle.ownerName}</h3>
                      <p className="text-sm text-muted-foreground font-medium">{vehicle.phone}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    <div className="space-y-1">
                      <Label className="text-[11px] font-bold uppercase opacity-50 flex items-center gap-1.5">
                        <Car className="w-3 h-3" /> Type
                      </Label>
                      <p className="text-sm font-bold capitalize">{vehicle.vehicleType}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] font-bold uppercase opacity-50 flex items-center gap-1.5">
                        <CreditCard className="w-3 h-3" /> Plate No.
                      </Label>
                      <p className="text-sm font-bold uppercase">{vehicle.carPlate}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] font-bold uppercase opacity-50 flex items-center gap-1.5 text-primary">
                        <Fuel className="w-3 h-3" /> Capacity
                      </Label>
                      <p className="text-sm font-bold text-primary">{vehicle.fullCapacity}L</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] font-bold uppercase opacity-50 flex items-center gap-1.5">
                        <FileText className="w-3 h-3" /> Document
                      </Label>
                      {vehicle.documentUrl ? (
                         <a href={vehicle.documentUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">
                            Verify <ArrowRight className="w-3 h-3" />
                         </a>
                      ) : <p className="text-sm font-bold text-red-400">Missing</p>}
                    </div>
                  </div>
                </div>

                <div className="flex lg:flex-col justify-end gap-3 pt-4 lg:pt-0 lg:border-l lg:pl-8 border-border">
                  <Button 
                    onClick={() => handleApprove(vehicle.id)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2 font-bold h-12 lg:h-11 shadow-md shadow-emerald-500/10"
                  >
                    <Check className="w-4 h-4" /> Approve
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleReject(vehicle.id)}
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

export default ApproveVehicles;

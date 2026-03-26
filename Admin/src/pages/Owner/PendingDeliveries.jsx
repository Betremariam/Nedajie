import React, { useEffect, useState } from "react";
import { 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Loader2, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck,
  PackageCheck,
  Building2,
  Calendar,
  Zap,
  ChevronRight,
  TrendingUp,
  Database
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/Card";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/Alert";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/AlertDialog";
import { 
  getPendingDeliveriesForOwner, 
  acceptDeliveryByOwner 
} from "../../services/api";
import { cn } from "../../lib/utils";

const PendingDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [accepting, setAccepting] = useState(false);

  const fetchPendingDeliveries = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getPendingDeliveriesForOwner();
      setDeliveries(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Strategic supply link synchronization failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingDeliveries();
  }, []);

  const handleAcceptInitiate = (delivery) => {
    setSelectedDelivery(delivery);
    setConfirmOpen(true);
  };

  const handleConfirmAccept = async () => {
    if (!selectedDelivery) return;
    try {
      setAccepting(true);
      await acceptDeliveryByOwner(selectedDelivery.id);
      setConfirmOpen(false);
      fetchPendingDeliveries();
    } catch (err) {
      console.error("Accept error:", err);
      setError(err.response?.data?.msg || "Payload ingestion protocol failed.");
    } finally {
      setAccepting(false);
    }
  };

  if (loading && deliveries.length === 0) return (
    <div className="h-[80vh] flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <Loader2 className="h-16 w-16 animate-spin text-primary opacity-20" />
        <Truck className="h-8 w-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <div className="text-center space-y-2">
        <p className="text-xl font-black tracking-tight italic text-foreground">Scanning Logistics Horizon</p>
        <p className="text-muted-foreground uppercase tracking-widest text-[10px]">Detecting inbound dispatches...</p>
      </div>
    </div>
  );

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1 text-primary">
            <TrendingUp className="w-5 h-5" />
            <span className="text-[10px] font-mono font-black tracking-[0.2em] uppercase text-primary/60">Supply Chain Active</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground italic">Inbound Streams</h1>
          <p className="text-muted-foreground text-lg mt-1 italic">Verify and authorize bulk fuel discharges into station reservoirs.</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="border-red-500/50 bg-red-500/5 max-w-5xl">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-black text-[10px] uppercase tracking-widest text-red-500">Logistics Breach</AlertTitle>
          <AlertDescription className="font-bold">{error}</AlertDescription>
        </Alert>
      )}

      {deliveries.length === 0 && !loading ? (
        <Card className="border-dashed border-2 border-border/50 bg-muted/10 h-[50vh] flex flex-col items-center justify-center text-center p-12 max-w-5xl mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-muted/50 flex items-center justify-center mb-6">
            <PackageCheck className="w-10 h-10 text-muted-foreground/30" />
          </div>
          <h2 className="text-2xl font-black tracking-tight italic text-muted-foreground">Logistics Static</h2>
          <p className="text-muted-foreground mt-2 max-w-sm font-medium">No verified inbound fuel dispatches were detected in this administrative cycle.</p>
        </Card>
      ) : (
        <div className="grid gap-6 max-w-5xl mx-auto">
          {deliveries.map((delivery) => (
            <Card key={delivery.id} className="border border-border shadow-sm group transition-all duration-300 overflow-hidden bg-card">
              <CardContent className="p-0 flex flex-col md:flex-row items-stretch">
                <div className="p-8 flex-1 space-y-6">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <Badge className={cn(
                            "font-black text-[9px] uppercase tracking-widest px-3 py-1 border-none",
                            delivery.fuelType.toLowerCase() === 'diesel' ? "bg-emerald-500 text-white" : "bg-primary text-primary-foreground"
                         )}>
                            {delivery.fuelType.toUpperCase()}
                         </Badge>
                         <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tighter">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(delivery.createdAt).toLocaleDateString()}
                         </div>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20 text-[9px] font-black uppercase tracking-widest shadow-sm">
                         <ShieldCheck className="w-3 h-3" />
                         Verified by Regional Authority
                      </div>
                   </div>

                   <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Inbound Payload</p>
                         <h3 className="text-4xl font-black tracking-tighter tabular-nums text-foreground group-hover:text-primary transition-colors">
                            {delivery.volume.toLocaleString()} <span className="text-lg font-medium text-muted-foreground uppercase not-italic tracking-widest ml-1">Liters</span>
                         </h3>
                      </div>
                      <div className="space-y-2 text-right">
                         <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground/80 italic justify-end">
                            <Building2 className="w-4 h-4 text-primary" />
                            {delivery.destination}
                         </div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                            FDC: <span className="text-foreground tracking-normal font-mono">{delivery.fdcNo}</span>
                         </p>
                      </div>
                   </div>
                </div>
                
                <div className="w-full md:w-80 bg-muted/30 border-t md:border-t-0 md:border-l border-border/20 p-8 flex flex-col justify-center gap-4">
                   <div className="flex flex-col gap-1 mb-2">
                      <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 italic">
                         <CheckCircle2 className="w-3 h-3" />
                         Ready for Deposition
                      </div>
                      <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest ml-4.5 italic leading-tight">
                         Awaiting Station Owner confirmation and reservoir update.
                      </p>
                   </div>
                   <Button 
                     onClick={() => handleAcceptInitiate(delivery)}
                     className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-sm transition-all gap-3 group/btn"
                   >
                     <Zap className="w-5 h-5 fill-primary text-primary shadow-glow group-hover/btn:scale-110 transition-transform" />
                     Authorize Discharge
                   </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="rounded-[2.5rem] border-border/50 shadow-2xl p-10 max-w-lg bg-background/80 backdrop-blur-3xl">
          <AlertDialogHeader>
            <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-inner mx-auto">
               <Database className="w-10 h-10" />
            </div>
            <AlertDialogTitle className="text-3xl font-black tracking-tight text-center italic">Authorization Required</AlertDialogTitle>
            <AlertDialogDescription className="text-center font-medium text-muted-foreground pt-2 text-lg italic leading-relaxed">
               You are about to authorize the discharge of <span className="text-foreground font-black not-italic">{selectedDelivery?.volume.toLocaleString()} L</span> of <span className="text-primary font-black not-italic uppercase">{selectedDelivery?.fuelType}</span> into the station reservoir.
               <br /><br />
               This protocol is <span className="text-red-500 font-bold underline decoration-red-500/30">immutable</span> and will update operational metrics immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-4 pt-8">
            <AlertDialogCancel className="h-14 flex-1 rounded-2xl font-black uppercase tracking-widest text-xs border-border/50 hover:bg-muted/50 transition-all">Abort Sequence</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmAccept}
              disabled={accepting}
              className="h-14 flex-1 rounded-2xl font-black uppercase tracking-widest text-xs bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-all group gap-2"
            >
              {accepting ? <Loader2 className="w-5 h-4 animate-spin" /> : <ShieldCheck className="w-5 h-4" />}
              {accepting ? "Processing..." : "Confirm Protocol"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex items-center justify-center gap-6 text-[10px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em] italic max-w-5xl mx-auto border-t border-border/10 pt-8">
         <div className="flex items-center gap-2">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            End-to-end Encrypted Verification
         </div>
         <span className="w-1 h-1 rounded-full bg-border" />
         <div className="flex items-center gap-2">
            <Database className="w-3 h-3 text-primary" />
            Automated Inventory Adjustment Logic Active
         </div>
      </div>
    </div>
  );
};

export default PendingDeliveries;

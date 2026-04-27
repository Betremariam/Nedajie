import React, { useEffect, useState } from "react";
import { Truck, CheckCircle, Clock, AlertCircle, MapPin, Loader2, ShieldCheck, ChevronRight, RefreshCcw, FileText, Download, Upload } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { 
  getPendingDeliveriesForSuperAdmin, 
  confirmDeliveryBySuperAdmin 
} from "../../services/api";
import { Label } from "../../components/ui/Label";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter
} from "../../components/ui/Card";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "../../components/ui/AlertDialog";
import { Alert, AlertTitle, AlertDescription } from "../../components/ui/Alert";
import { motion, AnimatePresence } from "framer-motion";

const ConfirmDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [confirmingDelivery, setConfirmingDelivery] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [signedDoc, setSignedDoc] = useState(null);

  const downloadFile = (path) => {
    if (!path) return;
    const webPath = path.replace(/\\/g, '/');
    const url = `http://localhost:5000/${webPath}`;
    window.open(url, '_blank');
  };

  const fetchPendingDeliveries = async () => {
    try {
      setLoading(true);
      const res = await getPendingDeliveriesForSuperAdmin();
      setDeliveries(res.data);
    } catch (err) {
      setError("Failed to fetch pending deliveries for your region");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingDeliveries();
  }, []);

  const handleConfirm = async () => {
    if (!confirmingDelivery) return;
    if (!signedDoc) {
      setError("Please upload a picture of the signed document first.");
      return;
    }
    
    setIsProcessing(true);
    setError("");
    setSuccess("");
    
    try {
      const formData = new FormData();
      formData.append("document", signedDoc);

      await confirmDeliveryBySuperAdmin(confirmingDelivery.id, formData);
      setSuccess(`Delivery ${confirmingDelivery.fdcNo} confirmed successfully!`);
      setConfirmingDelivery(null);
      setSignedDoc(null);
      fetchPendingDeliveries();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to confirm delivery");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin h-10 w-10 text-primary mb-4" />
        <p className="text-muted-foreground">Retrieving regional logistics data...</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Federal Delivery Confirmation</h1>
          <p className="text-muted-foreground text-lg italic">Verify and authorize incoming fuel shipments from Federal nodes</p>
        </div>
        <Badge variant="outline" className="h-fit px-4 py-1.5 text-sm gap-2">
          <Truck className="w-4 h-4" />
          {deliveries.length} Pending Actions
        </Badge>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
            <Alert variant="destructive" className="max-w-4xl mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Operational Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}
        {success && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
            <Alert className="max-w-4xl mx-auto bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-200">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <AlertTitle>Authorization Successful</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {deliveries.length === 0 ? (
        <Card className="max-w-4xl mx-auto border-dashed border-2 py-20 bg-muted/5">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
              <Truck className="w-10 h-10 text-muted-foreground/30" />
            </div>
            <CardTitle className="text-2xl font-bold mb-2">All Logs Synchronized</CardTitle>
            <CardDescription className="text-lg">No pending federal deliveries require confirmation at this time.</CardDescription>
            <Button variant="outline" onClick={fetchPendingDeliveries} className="mt-8 gap-2">
              <RefreshCcw className="w-4 h-4" /> Check for New shipments
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 max-w-5xl mx-auto">
          {deliveries.map((delivery) => (
            <Card key={delivery.id} className="overflow-hidden border-border/50 shadow-sm group hover:border-border transition-all duration-300">
              <div className="h-1.5 w-full bg-amber-500/20 group-hover:bg-amber-500 transition-colors" />
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 border-amber-200 px-3 py-1 font-bold uppercase tracking-wider">
                        {delivery.fuelType}
                      </Badge>
                      <Badge variant="outline" className="gap-1.5 px-3 py-1 text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(delivery.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </Badge>
                      <Badge variant="outline" className="gap-1.5 px-3 py-1 text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5" />
                        {delivery.region}
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-3xl font-black text-foreground tracking-tight flex items-baseline gap-2">
                        {delivery.volume.toLocaleString()} 
                        <span className="text-sm font-normal text-muted-foreground">Liters</span>
                      </h3>
                      <div className="flex flex-wrap items-center text-sm gap-x-4 gap-y-1">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          FDC Number: <span className="font-mono font-bold text-foreground bg-muted px-1.5 py-0.5 rounded">{delivery.fdcNo}</span>
                        </span>
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          Client: <span className="font-bold text-foreground">{delivery.customer}</span>
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-muted/30 rounded-lg flex items-center justify-between gap-4 border border-border/10">
                       <div className="flex items-center gap-4">
                          <div className="flex flex-col">
                             <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Destination Node</span>
                             <span className="font-semibold">{delivery.destination}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          <div className="flex flex-col">
                             <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Point of Delivery</span>
                             <span className="font-semibold">{delivery.citter}</span>
                          </div>
                       </div>
                       
                       {delivery.federalLetterPath && (
                         <Button 
                           variant="outline" 
                           size="sm" 
                           className="h-9 gap-2 text-[11px] font-bold border-primary/20 hover:bg-primary/5 text-primary"
                           onClick={() => downloadFile(delivery.federalLetterPath)}
                         >
                           <Download className="w-3.5 h-3.5" />
                           LETTER
                         </Button>
                       )}
                    </div>
                  </div>

                  <div className="w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-border/50">
                    <Button 
                      onClick={() => setConfirmingDelivery(delivery)}
                      className="w-full h-14 px-8 bg-primary hover:bg-primary/90 text-white shadow-sm flex items-center justify-center gap-3 rounded-xl font-bold"
                    >
                      <ShieldCheck className="w-5 h-5 transition-transform" />
                      Authorize Delivery
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Confirmation Dialog */}
      <AlertDialog open={!!confirmingDelivery} onOpenChange={(open) => !open && setConfirmingDelivery(null)}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-8 h-8 text-primary" />
            </div>
            <AlertDialogTitle className="text-center text-2xl">Confirm Logistics Action?</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              You are about to authorize the receipt of <span className="font-bold text-foreground">{confirmingDelivery?.volume.toLocaleString()}L</span> of <span className="font-bold text-foreground">{confirmingDelivery?.fuelType.toUpperCase()}</span> for the <span className="font-bold text-foreground">{confirmingDelivery?.region}</span> region.
              <br /><br />
              <div className="space-y-3 mt-4 text-left p-4 bg-muted/50 rounded-xl border border-border">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Upload Signed Confirmation Document</Label>
                <div className={`relative border-2 border-dashed rounded-xl p-4 transition-all ${signedDoc ? 'border-primary/50 bg-primary/5' : 'border-border hover:bg-muted/80'}`}>
                  <input
                    type="file"
                    onChange={(e) => setSignedDoc(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/*"
                  />
                  <div className="flex items-center gap-3">
                    <Upload className={`w-5 h-5 ${signedDoc ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="text-[13px] font-medium truncate">
                      {signedDoc ? signedDoc.name : "Select picture of signed doc..."}
                    </span>
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="grid grid-cols-2 gap-3 sm:space-x-0">
            <AlertDialogCancel asChild>
              <Button variant="outline" className="h-11">Abeyance</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button 
                onClick={handleConfirm}
                disabled={isProcessing}
                className="h-11 bg-primary hover:bg-primary/90 font-bold"
              >
                {isProcessing ? <Loader2 className="animate-spin h-4 w-4" /> : "Authorize Now"}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ConfirmDeliveries;

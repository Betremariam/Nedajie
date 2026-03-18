import React, { useEffect, useState } from "react";
import { Truck, CheckCircle, Clock, AlertCircle, MapPin } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { 
  getPendingDeliveriesForSuperAdmin, 
  confirmDeliveryBySuperAdmin 
} from "../../services/api";

const ConfirmDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const handleConfirm = async (id) => {
    if (!window.confirm("Confirm this fuel delivery for your region?")) return;
    try {
      await confirmDeliveryBySuperAdmin(id);
      alert("Delivery confirmed successfully!");
      fetchPendingDeliveries();
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to confirm delivery");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Federal Delivery Confirmation</h1>
        <p className="text-muted-foreground">Verify and confirm fuel dispatches from Federal authority for your region</p>
      </div>

      {error && <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

      {deliveries.length === 0 ? (
        <div className="bg-card rounded-xl border border-dashed border-border p-12 text-center">
          <Truck className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-muted-foreground">No pending federal deliveries</h3>
          <p className="text-muted-foreground">Everything is up to date in your region.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {deliveries.map((delivery) => (
            <div key={delivery.id} className="bg-card rounded-xl shadow-sm border border-border p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">
                    {delivery.fuelType.toUpperCase()}
                  </Badge>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {new Date(delivery.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1 ml-2">
                    <MapPin className="w-3 h-3" /> {delivery.region}
                  </span>
                </div>
                <h3 className="text-lg font-bold">{delivery.volume.toLocaleString()} Liters</h3>
                <p className="text-sm text-muted-foreground">
                  FDC: <span className="font-mono font-medium text-foreground">{delivery.fdcNo}</span> • 
                  Destination: <span className="font-medium text-foreground">{delivery.destination}</span> •
                  City: <span className="font-medium text-foreground">{delivery.citter}</span>
                </p>
                <p className="text-xs text-muted-foreground pt-1">
                  Customer: <span className="font-medium text-foreground">{delivery.customer}</span>
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <Button 
                  onClick={() => handleConfirm(delivery.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" /> Confirm & Forward to Owner
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConfirmDeliveries;

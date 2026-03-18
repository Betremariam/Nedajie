import React, { useEffect, useState } from "react";
import { Truck, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { 
  getPendingDeliveriesForOwner, 
  acceptDeliveryByOwner 
} from "../../services/api";

const PendingDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPendingDeliveries = async () => {
    try {
      setLoading(true);
      const res = await getPendingDeliveriesForOwner();
      setDeliveries(res.data);
    } catch (err) {
      setError("Failed to fetch pending deliveries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingDeliveries();
  }, []);

  const handleAccept = async (id) => {
    if (!window.confirm("Are you sure you want to accept this fuel delivery? This will update your station's stock.")) return;
    try {
      await acceptDeliveryByOwner(id);
      alert("Delivery accepted successfully!");
      fetchPendingDeliveries();
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to accept delivery");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Pending Fuel Receipts</h1>
        <p className="text-muted-foreground">Confirm and accept fuel deliveries dispatched by Federal and verified by Super Admin</p>
      </div>

      {error && <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

      {deliveries.length === 0 ? (
        <div className="bg-card rounded-xl border border-dashed border-border p-12 text-center">
          <Truck className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-muted-foreground">No pending deliveries</h3>
          <p className="text-muted-foreground">All fuel dispatches have been processed.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {deliveries.map((delivery) => (
            <div key={delivery.id} className="bg-card rounded-xl shadow-sm border border-border p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">
                    {delivery.fuelType.toUpperCase()}
                  </Badge>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {new Date(delivery.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-lg font-bold">{delivery.volume.toLocaleString()} Liters</h3>
                <p className="text-sm text-muted-foreground">
                  FDC: <span className="font-mono font-medium text-foreground">{delivery.fdcNo}</span> • 
                  Destination: <span className="font-medium text-foreground">{delivery.destination}</span>
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100 mb-2">
                  <CheckCircle className="w-3 h-3" /> Super Admin Verified
                </div>
                <Button 
                  onClick={() => handleAccept(delivery.id)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" /> Accept Fuel Delivery
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingDeliveries;

import React, { useState, useEffect } from "react";
import API from "../../services/api.js";
import { Car, Fuel, Save, AlertCircle, CheckCircle2, Plus, Trash2 } from "lucide-react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Label } from "../../components/ui/Label";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/Alert";
import { Card } from "../../components/ui/Card";

const ManageVehicleTypes = () => {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showAddNew, setShowAddNew] = useState(false);
  const [newVehicleType, setNewVehicleType] = useState({
    vehicleType: "",
    fuelCapacity: "",
    description: "",
  });

  const defaultVehicleTypes = [
    { value: "bajaj", label: "Light Transport (Bajaj)" },
    { value: "taxi", label: "Public Transit (Taxi)" },
    { value: "car", label: "Private Car" },
    { value: "motorcycle", label: "Motorcycle" },
    { value: "bus", label: "Bus" },
    { value: "truck", label: "Truck / Freight" },
    { value: "heavy", label: "Heavy Machinery" },
    { value: "boat", label: "Boat / Marine" },
    { value: "ship", label: "Ship / Large Vessel" },
    { value: "ambulance", label: "Ambulance / Emergency" },
  ];

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const res = await API.get("/admins/vehicle-type-configs");
      setConfigs(res.data);
    } catch (err) {
      console.error("Failed to fetch configs:", err);
    }
  };

  const handleUpdate = async (vehicleType, fuelCapacity, description = "") => {
    setSuccess("");
    setError("");
    setLoading(true);

    try {
      await API.post("/admins/vehicle-type-configs", {
        vehicleType,
        fuelCapacity: parseFloat(fuelCapacity),
        description,
      });
      setSuccess(`Updated ${vehicleType} fuel capacity successfully.`);
      fetchConfigs();
    } catch (err) {
      setError(err?.response?.data?.msg || "Failed to update configuration.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = async () => {
    if (!newVehicleType.vehicleType || !newVehicleType.fuelCapacity) {
      setError("Vehicle type name and fuel capacity are required.");
      return;
    }

    setSuccess("");
    setError("");
    setLoading(true);

    try {
      await API.post("/admins/vehicle-type-configs", {
        vehicleType: newVehicleType.vehicleType,
        fuelCapacity: parseFloat(newVehicleType.fuelCapacity),
        description: newVehicleType.description,
        isCustom: true,
      });
      setSuccess(`Custom vehicle type "${newVehicleType.vehicleType}" created successfully.`);
      setNewVehicleType({ vehicleType: "", fuelCapacity: "", description: "" });
      setShowAddNew(false);
      fetchConfigs();
    } catch (err) {
      setError(err?.response?.data?.msg || "Failed to create vehicle type.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (vehicleType) => {
    if (!confirm(`Are you sure you want to delete the vehicle type "${vehicleType}"?`)) {
      return;
    }

    setSuccess("");
    setError("");
    setLoading(true);

    try {
      await API.delete(`/admins/vehicle-type-configs/${vehicleType}`);
      setSuccess(`Vehicle type "${vehicleType}" deleted successfully.`);
      fetchConfigs();
    } catch (err) {
      setError(err?.response?.data?.msg || "Failed to delete vehicle type.");
    } finally {
      setLoading(false);
    }
  };

  const getConfigValue = (vehicleType) => {
    const config = configs.find((c) => c.vehicleType === vehicleType);
    return config ? config.fuelCapacity : "";
  };

  const getConfigDescription = (vehicleType) => {
    const config = configs.find((c) => c.vehicleType === vehicleType);
    return config?.description || "";
  };

  const isCustomType = (vehicleType) => {
    const config = configs.find((c) => c.vehicleType === vehicleType);
    return config?.isCustom || false;
  };

  // Get custom vehicle types from configs
  const customVehicleTypes = configs.filter((c) => c.isCustom);

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {success && (
        <Alert className="border-emerald-500/50 bg-emerald-50 text-emerald-800">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle className="font-bold">Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-bold">Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="bg-card rounded-[24px] shadow-sm border border-border p-8 md:p-10">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-[16px] bg-primary flex items-center justify-center text-primary-foreground shadow-md">
              <Car className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                Vehicle Type Fuel Capacity Management
              </h1>
              <p className="text-muted-foreground text-[13px] font-medium">
                Configure fuel capacity limits for each vehicle type
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowAddNew(!showAddNew)}
            className="h-11 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-md gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Custom Type
          </Button>
        </div>

        {/* Add New Vehicle Type Form */}
        {showAddNew && (
          <Card className="p-6 mb-6 bg-primary/5 border-primary/20">
            <h3 className="font-bold text-lg mb-4 text-foreground">Create Custom Vehicle Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Vehicle Type Name *</Label>
                <Input
                  placeholder="e.g., tractor, forklift"
                  value={newVehicleType.vehicleType}
                  onChange={(e) =>
                    setNewVehicleType({ ...newVehicleType, vehicleType: e.target.value })
                  }
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Fuel Capacity (Liters) *</Label>
                <Input
                  type="number"
                  placeholder="e.g., 100"
                  value={newVehicleType.fuelCapacity}
                  onChange={(e) =>
                    setNewVehicleType({ ...newVehicleType, fuelCapacity: e.target.value })
                  }
                  className="h-10"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Description (Optional)</Label>
                <Input
                  placeholder="e.g., Agricultural Vehicle"
                  value={newVehicleType.description}
                  onChange={(e) =>
                    setNewVehicleType({ ...newVehicleType, description: e.target.value })
                  }
                  className="h-10"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <Button
                onClick={handleAddNew}
                disabled={loading || !newVehicleType.vehicleType || !newVehicleType.fuelCapacity}
                className="h-10 px-6"
              >
                <Save className="w-4 h-4 mr-2" />
                Create Vehicle Type
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddNew(false);
                  setNewVehicleType({ vehicleType: "", fuelCapacity: "", description: "" });
                }}
                className="h-10 px-6"
              >
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {/* Default Vehicle Types */}
        <div className="mb-8">
          <h3 className="font-bold text-lg mb-4 text-foreground">Default Vehicle Types</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {defaultVehicleTypes.map((type) => (
              <VehicleTypeCard
                key={type.value}
                vehicleType={type.value}
                label={type.label}
                currentCapacity={getConfigValue(type.value)}
                currentDescription={getConfigDescription(type.value)}
                onUpdate={handleUpdate}
                loading={loading}
                isCustom={false}
              />
            ))}
          </div>
        </div>

        {/* Custom Vehicle Types */}
        {customVehicleTypes.length > 0 && (
          <div>
            <h3 className="font-bold text-lg mb-4 text-foreground">Custom Vehicle Types</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {customVehicleTypes.map((config) => (
                <VehicleTypeCard
                  key={config.vehicleType}
                  vehicleType={config.vehicleType}
                  label={config.description || config.vehicleType}
                  currentCapacity={config.fuelCapacity}
                  currentDescription={config.description}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                  loading={loading}
                  isCustom={true}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const VehicleTypeCard = ({
  vehicleType,
  label,
  currentCapacity,
  currentDescription,
  onUpdate,
  onDelete,
  loading,
  isCustom,
}) => {
  const [capacity, setCapacity] = useState(currentCapacity || "");
  const [description, setDescription] = useState(currentDescription || "");

  useEffect(() => {
    setCapacity(currentCapacity || "");
    setDescription(currentDescription || "");
  }, [currentCapacity, currentDescription]);

  const handleSave = () => {
    if (capacity && parseFloat(capacity) > 0) {
      onUpdate(vehicleType, capacity, description);
    }
  };

  return (
    <Card className="p-5 space-y-4 hover:shadow-md transition-shadow relative">
      {isCustom && onDelete && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={() => onDelete(vehicleType)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      )}

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Fuel className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-foreground">{label}</h3>
          <p className="text-xs text-muted-foreground capitalize">
            {vehicleType}
            {isCustom && <span className="ml-2 text-primary font-semibold">(Custom)</span>}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold text-foreground/80">
          Fuel Capacity (Liters)
        </Label>
        <div className="flex gap-2">
          <Input
            type="number"
            className="h-10 text-sm"
            placeholder="e.g., 50"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            min="0"
          />
          <Button
            size="sm"
            className="h-10 px-4"
            onClick={handleSave}
            disabled={loading || !capacity || parseFloat(capacity) <= 0}
          >
            <Save className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {currentCapacity && (
        <p className="text-xs text-emerald-600 font-medium">
          ✓ Current: {currentCapacity} Liters
        </p>
      )}
    </Card>
  );
};

export default ManageVehicleTypes;

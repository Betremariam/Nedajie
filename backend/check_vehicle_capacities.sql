-- Check vehicle capacities by type
SELECT 
    "vehicleType",
    COUNT(*) as vehicle_count,
    MIN("fullCapacity") as min_capacity,
    MAX("fullCapacity") as max_capacity,
    AVG("fullCapacity") as avg_capacity
FROM "Vehicle"
GROUP BY "vehicleType"
ORDER BY "vehicleType";

-- Check if there are any mismatches between config and vehicles
SELECT 
    v."vehicleType",
    v."fullCapacity" as vehicle_capacity,
    c."fuelCapacity" as config_capacity,
    COUNT(*) as mismatch_count
FROM "Vehicle" v
LEFT JOIN "VehicleTypeConfig" c ON v."vehicleType" = c."vehicleType"
WHERE v."fullCapacity" != c."fuelCapacity" OR c."fuelCapacity" IS NULL
GROUP BY v."vehicleType", v."fullCapacity", c."fuelCapacity";

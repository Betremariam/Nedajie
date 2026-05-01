-- Seed default vehicle type configurations
INSERT INTO "VehicleTypeConfig" (id, "vehicleType", "fuelCapacity", description, "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid()::text, 'bajaj', 15, 'Light Transport (Bajaj)', NOW(), NOW()),
  (gen_random_uuid()::text, 'taxi', 50, 'Public Transit (Taxi)', NOW(), NOW()),
  (gen_random_uuid()::text, 'car', 60, 'Private Car', NOW(), NOW()),
  (gen_random_uuid()::text, 'motorcycle', 20, 'Motorcycle', NOW(), NOW()),
  (gen_random_uuid()::text, 'bus', 200, 'Bus', NOW(), NOW()),
  (gen_random_uuid()::text, 'truck', 300, 'Truck / Freight', NOW(), NOW()),
  (gen_random_uuid()::text, 'heavy', 500, 'Heavy Machinery', NOW(), NOW()),
  (gen_random_uuid()::text, 'boat', 150, 'Boat / Marine', NOW(), NOW()),
  (gen_random_uuid()::text, 'ship', 1000, 'Ship / Large Vessel', NOW(), NOW()),
  (gen_random_uuid()::text, 'ambulance', 70, 'Ambulance / Emergency', NOW(), NOW())
ON CONFLICT ("vehicleType") DO NOTHING;

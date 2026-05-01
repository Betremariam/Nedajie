-- Step 1: Drop the VehicleTypeConfig table and recreate with String type
DROP TABLE IF EXISTS "VehicleTypeConfig";

CREATE TABLE "VehicleTypeConfig" (
    "id" TEXT NOT NULL,
    "vehicleType" TEXT NOT NULL,
    "fuelCapacity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "description" TEXT,
    "isCustom" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VehicleTypeConfig_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "VehicleTypeConfig_vehicleType_key" ON "VehicleTypeConfig"("vehicleType");

-- Step 2: Alter Vehicle table to use TEXT instead of enum
ALTER TABLE "Vehicle" ALTER COLUMN "vehicleType" TYPE TEXT;

-- Step 3: Re-seed default vehicle types
INSERT INTO "VehicleTypeConfig" (id, "vehicleType", "fuelCapacity", description, "isCustom", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid()::text, 'bajaj', 15, 'Light Transport (Bajaj)', false, NOW(), NOW()),
  (gen_random_uuid()::text, 'taxi', 50, 'Public Transit (Taxi)', false, NOW(), NOW()),
  (gen_random_uuid()::text, 'car', 60, 'Private Car', false, NOW(), NOW()),
  (gen_random_uuid()::text, 'motorcycle', 20, 'Motorcycle', false, NOW(), NOW()),
  (gen_random_uuid()::text, 'bus', 200, 'Bus', false, NOW(), NOW()),
  (gen_random_uuid()::text, 'truck', 300, 'Truck / Freight', false, NOW(), NOW()),
  (gen_random_uuid()::text, 'heavy', 500, 'Heavy Machinery', false, NOW(), NOW()),
  (gen_random_uuid()::text, 'boat', 150, 'Boat / Marine', false, NOW(), NOW()),
  (gen_random_uuid()::text, 'ship', 1000, 'Ship / Large Vessel', false, NOW(), NOW()),
  (gen_random_uuid()::text, 'ambulance', 70, 'Ambulance / Emergency', false, NOW(), NOW())
ON CONFLICT ("vehicleType") DO NOTHING;

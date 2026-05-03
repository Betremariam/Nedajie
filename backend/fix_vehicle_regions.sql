-- First, let's see what regions vehicles currently have
SELECT region, COUNT(*) as count FROM "Vehicle" GROUP BY region;

-- Update all vehicles to have 'Amhara' region
UPDATE "Vehicle" SET region = 'Amhara';

-- Verify the update
SELECT region, COUNT(*) as count FROM "Vehicle" GROUP BY region;

-- Show sample vehicles
SELECT id, "ownerName", phone, "vehicleType", region, "isApproved" FROM "Vehicle" LIMIT 5;

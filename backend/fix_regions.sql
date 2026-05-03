-- Fix: Set region for super admin (change 'Addis Ababa' to your actual region)
UPDATE "Admin" 
SET region = 'Addis Ababa'
WHERE role = 'super' AND region IS NULL;

-- Fix: Register admins inherit super admin's region
UPDATE "Admin" ra
SET region = (SELECT region FROM "Admin" WHERE role = 'super' LIMIT 1)
WHERE ra.role IN ('register', 'approver') AND ra.region IS NULL;

-- Fix: Vehicles inherit their creator's region
UPDATE "Vehicle" v
SET region = (SELECT region FROM "Admin" WHERE role = 'super' LIMIT 1)
WHERE v.region IS NULL;

-- Show results
SELECT 'Admins' as table_name, role, region, COUNT(*) as count
FROM "Admin"
GROUP BY role, region
UNION ALL
SELECT 'Vehicles', 'vehicle', region, COUNT(*)
FROM "Vehicle"
GROUP BY region;

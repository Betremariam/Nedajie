-- Check if admins have regions set
SELECT id, name, email, role, region, "createdAt" 
FROM "Admin" 
ORDER BY "createdAt" DESC;

-- Check if vehicles have regions set
SELECT id, "ownerName", phone, "vehicleType", region, "isApproved", "createdAt"
FROM "Vehicle"
ORDER BY "createdAt" DESC
LIMIT 20;

-- Count vehicles by region
SELECT region, COUNT(*) as count, 
       SUM(CASE WHEN "isApproved" = true THEN 1 ELSE 0 END) as approved_count
FROM "Vehicle"
GROUP BY region;

-- Count admins by region and role
SELECT region, role, COUNT(*) as count
FROM "Admin"
GROUP BY region, role
ORDER BY region, role;

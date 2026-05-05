# Migration Guide for Existing Attendants

## Overview
If you have existing attendants in your database that were registered using the old system, you may need to migrate them to work with the new workflow.

## Scenarios

### Scenario 1: Attendants with Passwords (Old System)
**Status:** These attendants can continue to login normally.

**Characteristics:**
- Have a hashed password in the database
- May or may not have `ownerId` set
- May or may not be approved

**Action Required:**
```sql
-- Ensure all existing attendants are enabled if they have passwords
UPDATE "FuelAttendant"
SET "isEnabled" = true
WHERE "password" IS NOT NULL 
  AND "password" != ''
  AND "isApproved" = true;
```

### Scenario 2: Attendants Without Passwords
**Status:** These attendants cannot login and need password generation.

**Characteristics:**
- Have empty or null password
- Were created but never completed registration

**Action Required:**
1. Station owners should use the "Generate Password" feature
2. Or run a migration script to generate passwords for all approved attendants:

```sql
-- Find attendants without passwords
SELECT id, name, phone, "stationName"
FROM "FuelAttendant"
WHERE ("password" IS NULL OR "password" = '')
  AND "isApproved" = true;
```

### Scenario 3: Attendants Without Owner Link
**Status:** Need to be linked to their station owner.

**Characteristics:**
- `ownerId` is NULL
- Have a `stationName` but no owner reference

**Action Required:**
```sql
-- Link attendants to their station owners based on stationName
UPDATE "FuelAttendant" AS a
SET "ownerId" = s.id
FROM "FuelStation" AS s
WHERE a."stationName" = s."stationName"
  AND a."ownerId" IS NULL;
```

## Complete Migration Script

Run this SQL script to migrate all existing attendants:

```sql
-- Step 1: Link attendants to station owners
UPDATE "FuelAttendant" AS a
SET "ownerId" = s.id
FROM "FuelStation" AS s
WHERE a."stationName" = s."stationName"
  AND a."ownerId" IS NULL;

-- Step 2: Enable attendants with passwords who are approved
UPDATE "FuelAttendant"
SET "isEnabled" = true
WHERE "password" IS NOT NULL 
  AND "password" != ''
  AND "isApproved" = true;

-- Step 3: Disable attendants without passwords (they need password generation)
UPDATE "FuelAttendant"
SET "isEnabled" = false
WHERE ("password" IS NULL OR "password" = '')
  AND "isApproved" = true;

-- Step 4: Report attendants that need attention
SELECT 
  id,
  name,
  phone,
  "stationName",
  "isApproved",
  "isEnabled",
  CASE 
    WHEN "password" IS NULL OR "password" = '' THEN 'Needs Password'
    WHEN "ownerId" IS NULL THEN 'Needs Owner Link'
    ELSE 'OK'
  END as status
FROM "FuelAttendant"
WHERE ("password" IS NULL OR "password" = '' OR "ownerId" IS NULL)
ORDER BY "isApproved" DESC, "createdAt" DESC;
```

## Post-Migration Steps

### For Station Owners
1. Login to the admin panel
2. Navigate to Attendant Management
3. Review all attendants
4. For approved attendants without passwords:
   - Click "Generate Password"
   - Share the password with the attendant

### For Attendants
1. If you cannot login, contact your station owner
2. Station owner will generate a new password for you
3. Use the provided password to login
4. Change your password after first login (if feature available)

## Verification Queries

### Check Migration Status
```sql
-- Count attendants by status
SELECT 
  COUNT(*) FILTER (WHERE "password" IS NOT NULL AND "password" != '') as with_password,
  COUNT(*) FILTER (WHERE "password" IS NULL OR "password" = '') as without_password,
  COUNT(*) FILTER (WHERE "ownerId" IS NOT NULL) as with_owner,
  COUNT(*) FILTER (WHERE "ownerId" IS NULL) as without_owner,
  COUNT(*) FILTER (WHERE "isApproved" = true) as approved,
  COUNT(*) FILTER (WHERE "isEnabled" = true) as enabled
FROM "FuelAttendant";
```

### Find Problematic Records
```sql
-- Attendants that are approved but can't login
SELECT id, name, phone, "stationName", "isApproved", "isEnabled"
FROM "FuelAttendant"
WHERE "isApproved" = true 
  AND ("password" IS NULL OR "password" = '' OR "isEnabled" = false);
```

### Find Orphaned Attendants
```sql
-- Attendants without station owner link
SELECT a.id, a.name, a.phone, a."stationName"
FROM "FuelAttendant" a
LEFT JOIN "FuelStation" s ON a."ownerId" = s.id
WHERE a."ownerId" IS NULL OR s.id IS NULL;
```

## Rollback Plan

If you need to rollback to the old system:

```sql
-- Re-enable all approved attendants (old behavior)
UPDATE "FuelAttendant"
SET "isEnabled" = true
WHERE "isApproved" = true;
```

## Support

If you encounter issues during migration:
1. Check the verification queries above
2. Review the `ATTENDANT_REGISTRATION_WORKFLOW.md` for the new workflow
3. Ensure all station owners are informed of the new process
4. Test with a single attendant before mass migration

## Timeline Recommendation

1. **Day 1**: Run migration script in development/staging
2. **Day 2-3**: Test new workflow thoroughly
3. **Day 4**: Inform all station owners of the change
4. **Day 5**: Run migration in production during low-traffic hours
5. **Day 6+**: Monitor and support station owners with password generation

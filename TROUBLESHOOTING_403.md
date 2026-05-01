# Troubleshooting 403 Forbidden Error

## Problem
Register admin getting 403 error when trying to fetch vehicle types from `/api/admins/vehicle-type-configs`

## Root Cause
The backend server needs to be restarted to pick up the new route configuration that allows all admin roles to read vehicle types.

## Solution Steps

### 1. Stop Any Running Backend Server
If you have a backend server running, stop it:
- Press `Ctrl + C` in the terminal where it's running
- Or close that terminal window

### 2. Start the Backend Server
```bash
cd backend
npm start
```

You should see output like:
```
Server running on port 5000
Connected to PostgreSQL database
```

### 3. Verify the Server is Running
Open a new terminal and test:
```bash
curl http://localhost:5000/api/admins/vehicle-type-configs
```

You should get a response (even if it says unauthorized, that means the route exists).

### 4. Clear Browser Cache
- Hard refresh: `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (Mac)
- Or open DevTools (F12) → Network tab → Check "Disable cache"

### 5. Test in the Application
1. Log in as a register admin
2. Navigate to Vehicle Registration page
3. The vehicle type dropdown should now populate with all configured types

## What Changed

### Before:
```javascript
router.get("/vehicle-type-configs", federalOnly, getVehicleTypeConfigs);
```
Only federal admins could read vehicle types.

### After:
```javascript
const allAdmins = [verifyToken, authorizeRoles("super", "federal", "register", "approver")];
router.get("/vehicle-type-configs", allAdmins, getVehicleTypeConfigs);
```
All authenticated admins can now read vehicle types.

## Still Getting 403?

### Check 1: Verify you're logged in
```javascript
// Open browser console (F12) and run:
localStorage.getItem('adminToken')
```
Should return a token string. If null, log in again.

### Check 2: Verify your admin role
```javascript
// In browser console:
JSON.parse(localStorage.getItem('admin')).role
```
Should return: "register", "approver", "super", or "federal"

### Check 3: Check backend logs
Look at the terminal where backend is running. You should see:
- Request logs showing the API call
- Any error messages

### Check 4: Verify route is registered
In backend terminal, you should see the route when server starts. Or run:
```bash
cd backend
node test-routes.js
```

This will list all registered routes including vehicle-type-configs.

## Alternative: Temporary Workaround

If you need to test immediately and can't restart the backend, you can temporarily make the endpoint public:

**backend/routes/adminsRoutes.js:**
```javascript
// Temporary - remove auth for testing
router.get("/vehicle-type-configs", getVehicleTypeConfigs);
```

**⚠️ WARNING:** This removes authentication. Only use for testing, then revert to:
```javascript
router.get("/vehicle-type-configs", allAdmins, getVehicleTypeConfigs);
```

## Expected Behavior After Fix

1. **Register Admin** can:
   - ✅ Read all vehicle types (GET)
   - ❌ Create vehicle types (POST) - 403
   - ❌ Delete vehicle types (DELETE) - 403

2. **Federal Admin** can:
   - ✅ Read all vehicle types (GET)
   - ✅ Create vehicle types (POST)
   - ✅ Delete vehicle types (DELETE)

3. **Super/Approver Admin** can:
   - ✅ Read all vehicle types (GET)
   - ❌ Create vehicle types (POST) - 403
   - ❌ Delete vehicle types (DELETE) - 403

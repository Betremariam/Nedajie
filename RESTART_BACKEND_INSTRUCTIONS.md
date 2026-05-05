# Backend Restart Instructions

## Issue
The document URLs are still showing `http://192.168.43.237:5000` instead of `http://localhost:5000`.

## Cause
The backend server needs to be restarted to load the new `BASE_URL` environment variable from the `.env` file.

## Solution

### Step 1: Stop the Backend Server
In your terminal where the backend is running, press:
```
Ctrl + C
```

### Step 2: Restart the Backend Server
Navigate to the backend directory and start the server again:
```bash
cd backend
npm start
# or
node server.js
# or whatever command you use to start the backend
```

### Step 3: Verify the Change
1. Refresh your browser
2. Go to the Approve Attendants page
3. Click on a document link
4. It should now open with `http://localhost:5000/uploads/documents/...`

## Alternative: Change BASE_URL for Network Access

If you want to keep using the IP address for network access, you can change the `.env` file:

```env
BASE_URL=http://192.168.43.237:5000
```

Then restart the backend server.

## Environment Variables Explained

The code now uses:
```javascript
const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
```

This means:
- If `BASE_URL` is set in `.env`, it will use that
- If not set, it defaults to `http://localhost:5000`

## Files That Were Updated

All these files now use the `BASE_URL` environment variable:
- `backend/controllers/admins/approverAdminController.js`
  - `getUnapprovedVehicles()`
  - `getUnapprovedAttendants()`
  - `getUnapprovedFarmers()`
  - `getUnapprovedMillHouseOwners()`

## Current .env Configuration

```env
PORT=5000
BASE_URL=http://localhost:5000
MONGO_URI=mongodb://127.0.0.1:27017/fuel-control
JWT_SECRET=673b8459d7e9e7b655db5d8b2a7bf89cfdcd28d647249a3c8128102fc7c3720119c55529ed87b1e01da126ac8d4ec9e362ff654d5b739f2c9226516f4f722099
FEDERAL_EMAIL=federal@admin.com
FEDERAL_PASSWORD=FederalSecure123
DATABASE_URL=postgresql://postgres:1234@localhost:5432/fuelcontrol?schema=public
```

## Troubleshooting

### If it still shows the old URL after restart:
1. Make sure you saved the `.env` file
2. Check that `BASE_URL=http://localhost:5000` is in the `.env` file
3. Restart the backend server completely (stop and start, not just refresh)
4. Clear your browser cache or do a hard refresh (Ctrl + Shift + R)

### If you need to access from other devices on the network:
Use your computer's IP address in the `.env` file:
```env
BASE_URL=http://192.168.43.237:5000
```

Then restart the backend.

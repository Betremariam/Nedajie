import 'dotenv/config';

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic3VwZXIiLCJpYXQiOjE3NzI0ODM5MDIsImV4cCI6MTc3MjU3MDMwMn0.bn-Kr0F-kq2H1T9bxVXhhK-rMCt37AkzqaP-v8dwQv4';
const BASE_URL = 'http://127.0.0.1:5000/api';

const makeRequest = async (endpoint, method = 'GET', body = null) => {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`
      }
    };
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const res = await fetch(`${BASE_URL}${endpoint}`, options);
    const text = await res.text();
    try {
      const data = JSON.parse(text);
      console.log(`[${method}] ${endpoint} -> ${res.status}`);
      return data;
    } catch {
      console.log(`[${method}] ${endpoint} -> ${res.status}: ${text}`);
      return null;
    }
  } catch (err) {
    console.error(`Error on ${method} ${endpoint}:`, err.message);
  }
};

const runTests = async () => {
  console.log("--- Testing Core Endpoints ---");

  // 1. Get Admins
  const admins = await makeRequest('/admins/admins');
  console.log("Admins:", admins?.length || 0);

  // 2. Create Farmer (using register route from registerAdminController)
  const newFarmerBody = {
    fullName: "Test Farmer",
    kebele: "Kebele 01",
    woreda: "Woreda 01",
    phoneNumber: `09${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`, // Valid Ethiopian number format
  };
  const createFarmer = await makeRequest('/farmers/register', 'POST', newFarmerBody);
  console.log("Created Farmer:", createFarmer?.farmer ? "Success" : createFarmer);

  // 3. Get Farmers (Super Admin route)
  const farmers = await makeRequest('/admins/farmers');
  console.log("Farmers:", farmers?.length || 0);
  
  // 4. Create Fuel Stock (needed for Station Owner)
  const newFuelStockBody = {
    stationName: "Total Energies Bole",
    city: "Addis Ababa",
    gasType: "diesel", // Assuming "diesel" is a valid FuelType enum
    litersReceived: 10000,
    litersDispensed: 0,
    date: new Date().toISOString()
  };
  const createFuelStock = await makeRequest('/admins/fuel-stocks', 'POST', newFuelStockBody);
  console.log("Created FuelStock:", createFuelStock?.stock ? "Success" : createFuelStock);
  const stationId = createFuelStock?.stock?.id;

  // 5. Create Station Owner (Admin)
  if (stationId) {
    const newOwnerBody = {
      name: "Test Owner",
      email: `owner${Math.floor(Math.random() * 1000)}@test.com`,
      password: "Password123!",
      role: "stationOwner",
      stationIds: [stationId]
    };
    const createOwner = await makeRequest('/admins/owners', 'POST', newOwnerBody);
    console.log("Created Owner:", createOwner?.owner || createOwner?.admin ? "Success" : createOwner);
  } else {
    console.log("Skipping Station Owner creation because FuelStock creation failed.");
  }
};

runTests();

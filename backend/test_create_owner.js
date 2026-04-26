import fetch from 'node-fetch';

async function test() {
  const adminId = "cmm7l... (wait, I need a real login)";
  // I'll just try to login first
  const loginRes = await fetch("http://localhost:5000/api/admin-auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "federal@admin.com", password: "FederalSecure123" }) // From .env
  });
  
  const { token } = await loginRes.json();
  console.log("Logged in:", !!token);

  const res = await fetch("http://localhost:5000/api/federal/create-owner", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      name: "Test Owner",
      email: "test_mixing_2@test.com",
      region: "Amhara",
      stationName: "TOTAL_2",
      zone: "TestZone",
      woreda: "TestWoreda",
      city: "TestCity"
    })
  });

  const data = await res.json();
  console.log("Status:", res.status);
  console.log("Response:", data);
}

test();

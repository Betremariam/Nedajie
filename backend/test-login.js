const login = async () => {
  try {
    const response = await fetch('http://127.0.0.1:5000/api/admin-auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'super@admin.com',
        password: 'SuperSecure123'
      })
    });
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  }
};

login();

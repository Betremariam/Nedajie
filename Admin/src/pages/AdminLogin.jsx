import { useState } from "react";
import { loginAdmin } from "../services/api";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  if (!email || !password) {
    return setError("All fields are required.");
  }

  try {
    const res = await loginAdmin({ email, password });
    const { token, admin, stationIds } = res.data; // <-- include stationId

    localStorage.setItem("adminToken", token);
    localStorage.setItem("admin", JSON.stringify(admin));

    // ✅ Save stationId only if this is a station owner
   if (admin.role === "stationOwner" && admin.stationIds) {
  localStorage.setItem("stationIds", JSON.stringify(admin.stationIds));
        }


    // Navigate based on role
    if (admin.role === "super") navigate("/super-admin");
    else if (admin.role === "approver") navigate("/approver");
    else if (admin.role === "register") navigate("/register");
    else if (admin.role === "stationOwner") navigate("/owner");

  } catch (err) {
    const msg = err.response?.data?.msg || "Login failed.";
    setError(msg);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form
        onSubmit={handleLogin}
        className="bg-gray-800 p-8 rounded-xl shadow-md w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Admin Login</h1>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded text-white font-semibold"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;

import React, { useState } from "react";
import API from "../../services/api.js"; 

const RegisterAttendant = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    stationName: "",
    city: "",
    document: null,
  });
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    if (e.target.name === "document") {
      setForm({ ...form, document: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setSuccess("");
  const formData = new FormData();
  formData.append("name", form.name);
  formData.append("phone", form.phone);
  formData.append("password", form.password);
  formData.append("stationName", form.stationName); 
  formData.append("city", form.city);
  formData.append("document", form.document);

  try {
  const res = await API.post("/admins/register-attendant", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  console.log("Attendant registered:", res.data); // should now show
 setSuccess("Attendant registered successfully");
} catch (err) {
  console.error("Registration failed:", err.response?.data || err.message);
  alert(err?.response?.data?.msg || "Something went wrong");
}
};
 return (
  <div className="p-6 text-white">
    <h2 className="text-xl font-bold mb-4">Register Fuel Attendant</h2>

    {/* ✅ Show success message if exists */}
    {success && (
      <div className="mb-4 p-2 bg-green-700 text-white rounded">
        {success}
      </div>
    )}

    <form className="space-y-4" onSubmit={handleSubmit}>
      <input
        className="w-full p-2 rounded bg-gray-700"
        placeholder="Name"
        name="name"
        value={form.name}
        onChange={handleChange}
      />
      <input
        className="w-full p-2 rounded bg-gray-700"
        placeholder="Phone Number"
        name="phone"
        value={form.phone}
        onChange={handleChange}
      />
      <input
        className="w-full p-2 rounded bg-gray-700"
        placeholder="Password"
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
      />
      <input
        className="w-full p-2 rounded bg-gray-700"
        placeholder="Station"
        name="stationName"
        value={form.stationName}
        onChange={handleChange}
      />
       <input
        className="w-full p-2 rounded bg-gray-700"
        placeholder="city"
        name="city"
        value={form.city}
        onChange={handleChange}
      />
      <input
        className="w-full p-2 rounded bg-gray-700"
        type="file"
        name="document"
        onChange={handleChange}
      />
      <button className="bg-green-600 px-4 py-2 rounded" type="submit">
        Register
      </button>
    </form>
  </div>
);
};

export default RegisterAttendant;
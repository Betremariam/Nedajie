import React, { useState } from "react";
import API from "../../services/api.js";

const RegisterDriver = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    carType: "",
    carPlate: "",
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
    formData.append("carType", form.carType);
    formData.append("carPlate", form.carPlate);
    formData.append("document", form.document);

    try {
      const res = await API.post("/admins/register-driver", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(res.data.msg || "Driver registered successfully.");

      setForm({
        name: "",
        phone: "",
        password: "",
        carType: "",
        carPlate: "",
        document: null,
      });
    } catch (err) {
      console.error("Registration failed:", err.response?.data || err.message);
      alert(err?.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-xl font-bold mb-4">Register Driver</h2>

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
        <select
          className="w-full p-2 rounded bg-gray-700"
          name="carType"
          value={form.carType}
          onChange={handleChange}
          required
        >
          <option value="">Select Car Type</option>
          <option value="bajaj">bajaj</option>
          <option value="taxi">taxi</option>
          <option value="heavy">heavy</option>
        </select>
        <input
          className="w-full p-2 rounded bg-gray-700"
          placeholder="Car Plate"
          name="carPlate"
          value={form.carPlate}
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

export default RegisterDriver;

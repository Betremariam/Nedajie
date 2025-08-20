import React, { useState } from "react";
import API from "../../services/api.js";

const RegisterFarmer = () => {
  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    kebele: "",
    woreda: "",
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
    formData.append("fullName", form.fullName);
    formData.append("phoneNumber", form.phoneNumber);
    formData.append("kebele", form.kebele);
    formData.append("woreda", form.woreda);
    formData.append("document", form.document);

    try {
      const res = await API.post("/admins/register-farmer", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(res.data.msg || "Farmer registered successfully.");

      setForm({
        fullName: "",
        phoneNumber: "",
        kebele: "",
        woreda: "",
        document: null,
      });
    } catch (err) {
      console.error("Registration failed:", err.response?.data || err.message);
      alert(err?.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-xl font-bold mb-4">Register Farmer</h2>

      {success && (
        <div className="mb-4 p-2 bg-green-700 text-white rounded">
          {success}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          className="w-full p-2 rounded bg-gray-700"
          placeholder="Full Name"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
        />
        <input
          className="w-full p-2 rounded bg-gray-700"
          placeholder="Phone Number"
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handleChange}
        />
        <input
          className="w-full p-2 rounded bg-gray-700"
          placeholder="Kebele"
          name="kebele"
          value={form.kebele}
          onChange={handleChange}
        />
        <input
          className="w-full p-2 rounded bg-gray-700"
          placeholder="Woreda"
          name="woreda"
          value={form.woreda}
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

export default RegisterFarmer;

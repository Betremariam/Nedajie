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
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Register Driver</h1>
        <p className="text-muted-foreground">Register new drivers for the fuel management system</p>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {success}
        </div>
      )}

      <div className="bg-card rounded-xl shadow-sm border border-border p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Full Name *
              </label>
              <input
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter driver's full name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Phone Number *
              </label>
              <input
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter phone number"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Password *
              </label>
              <input
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Create password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Car Type *
              </label>
              <select
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                name="carType"
                value={form.carType}
                onChange={handleChange}
                required
              >
                <option value="">Select Car Type</option>
                <option value="bajaj">Bajaj</option>
                <option value="taxi">Taxi</option>
                <option value="heavy">Heavy Vehicle</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Car Plate Number *
              </label>
              <input
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter car plate number"
                name="carPlate"
                value={form.carPlate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Driver Document
              </label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  className="hidden"
                  type="file"
                  name="document"
                  id="document"
                  onChange={handleChange}
                />
                <label htmlFor="document" className="cursor-pointer">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-muted-foreground mb-1">Upload driver document</p>
                  <p className="text-sm text-muted-foreground">Click to browse files</p>
                  {form.document && (
                    <p className="text-sm text-green-600 mt-2">Selected: {form.document.name}</p>
                  )}
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <button 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold shadow-sm hover:shadow-md flex items-center gap-2"
              type="submit"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Register Driver
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterDriver;

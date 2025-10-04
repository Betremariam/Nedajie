import React, { useState } from "react";
import API from "../../services/api.js";

const OtherRegistration = () => {
  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    fuelType: "",
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
    formData.append("fuelType", form.fuelType);
    formData.append("document", form.document);

    try {
      const res = await API.post("/admins/register-other-user", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(res.data.msg || "Registered successfully.");

      setForm({
        fullName: "",
        phoneNumber: "",
        fuelType: "",
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Register Other Users</h1>
        <p className="text-gray-600">Register other user types for the fuel management system</p>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {success}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                placeholder="Enter user's full name"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                placeholder="Enter phone number"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fuel Type *
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                name="fuelType"
                value={form.fuelType}
                onChange={handleChange}
                required
              >
                <option value="">Select Fuel Type</option>
                <option value="benzene">Benzene</option>
                <option value="diesel">Diesel</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Document
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
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
                  <p className="text-gray-600 mb-1">Upload user document</p>
                  <p className="text-sm text-gray-500">Click to browse files</p>
                  {form.document && (
                    <p className="text-sm text-purple-600 mt-2">Selected: {form.document.name}</p>
                  )}
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <button 
              className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200 font-semibold shadow-sm hover:shadow-md flex items-center gap-2"
              type="submit"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Register User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OtherRegistration;
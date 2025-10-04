import React from "react";

const RegisterAdminDashboard = () => {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Registration Dashboard</h1>
        <p className="text-gray-600">Welcome to the Registration Administration Portal</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">⛽</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Attendants</h3>
              <p className="text-gray-600 text-sm">Register new fuel attendants</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🚗</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Drivers</h3>
              <p className="text-gray-600 text-sm">Register new drivers</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">👨‍🌾</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Farmers</h3>
              <p className="text-gray-600 text-sm">Register new farmers</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Administration</h2>
          <p className="text-gray-600 mb-4">
            Manage user registrations for the fuel management system. 
            Register new attendants, drivers, farmers, and other user types to ensure 
            proper access and authorization across the platform.
          </p>
          <div className="text-sm text-gray-500">
            Use the sidebar navigation to access different registration sections
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterAdminDashboard;
import React from "react";
const ApproveDashboard = () => {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Approval Dashboard</h1>
        <p className="text-gray-600">Welcome to the Approval Administration Portal</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🚗</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Drivers</h3>
              <p className="text-gray-600 text-sm">Approve driver registrations</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">👨‍🌾</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Farmers</h3>
              <p className="text-gray-600 text-sm">Approve farmer registrations</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">⛽</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Attendants</h3>
              <p className="text-gray-600 text-sm">Approve attendant registrations</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Other Users</h3>
              <p className="text-gray-600 text-sm">Approve other user types</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Approval Administration</h2>
          <p className="text-gray-600 mb-4">
            Manage and approve user registrations for the fuel management system. 
            Review pending applications and ensure proper authorization for all user types.
          </p>
          <div className="text-sm text-gray-500">
            Use the sidebar navigation to access different approval sections
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApproveDashboard;
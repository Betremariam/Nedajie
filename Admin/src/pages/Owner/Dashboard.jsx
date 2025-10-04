const OwnerDashboard = () => {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Station Owner Dashboard</h1>
        <p className="text-gray-600">Welcome to your Fuel Station Management Portal</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Attendants</h3>
              <p className="text-gray-600 text-sm">Manage station attendants</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">⛽</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Fuel Received</h3>
              <p className="text-gray-600 text-sm">Track fuel deliveries</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">💳</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Transactions</h3>
              <p className="text-gray-600 text-sm">View all station transactions</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Reports</h3>
              <p className="text-gray-600 text-sm">Generate detailed reports</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Quick Stats</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Attendants</span>
              <span className="font-semibold text-gray-900">--</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Today's Transactions</span>
              <span className="font-semibold text-gray-900">--</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Fuel Stock</span>
              <span className="font-semibold text-gray-900">--</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              Monitor your station operations and track performance metrics from your dashboard.
            </div>
            <div className="text-sm text-gray-500">
              Use the navigation menu to access detailed sections for each management area.
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Station Management</h2>
          <p className="text-gray-600 mb-4">
            Efficiently manage your fuel station operations, track fuel deliveries, 
            monitor transactions, and generate comprehensive reports for better business insights.
          </p>
          <div className="text-sm text-gray-500">
            Access all management features through the sidebar navigation
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
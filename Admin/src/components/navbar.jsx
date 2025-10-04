const Navbar = () => {
  return (
    <div className="bg-blue-800 text-white px-6 py-4 shadow-lg border-b-4 border-blue-600 w-full">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-white p-2 rounded-lg">
            <svg className="w-8 h-8 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Fuel Management System</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <p className="font-medium">Welcome, Admins</p>
          </div>
       
        </div>
      </div>
    </div>
  );
};

export default Navbar;
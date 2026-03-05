import { NavLink } from "react-router-dom";

const OwnerSidebar = () => {
  const linkClass = ({ isActive }) => 
    `block py-3 px-4 text-white transition-all duration-200 rounded-lg border-l-4 ${
      isActive 
        ? 'bg-blue-700 border-blue-400 shadow-md font-semibold' 
        : 'bg-gray-700 border-gray-700 hover:bg-gray-600 hover:border-blue-500 hover:translate-x-1'
    }`;

  return (
    <div className="w-64 bg-gray-600 text-white h-full p-6 shadow-xl">
      <div className="mb-8 pb-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white">Station Owner</h1>
        <p className="text-white text-sm mt-1">Management Portal</p>
      </div>
      <nav className="flex flex-col gap-3">
        <NavLink to="/owner/dashboard" className={linkClass}>
          📊 Dashboard
        </NavLink>
        <NavLink to="/owner/fuelstock" className={linkClass}>
          OwnerFuel Stock
        </NavLink>
        <NavLink to="/owner/attendant" className={linkClass}>
          👥 Attendant Registration
        </NavLink>
        <NavLink to="/owner/fuel-received" className={linkClass}>
          ⛽ Fuel Received
        </NavLink>
        <NavLink to="/owner/transactions" className={linkClass}>
          💰 Transactions
        </NavLink>
        <NavLink to="/owner/reports" className={linkClass}>
          📈 Reports
        </NavLink>
      </nav>
      
      <div className="mt-auto pt-6 border-t border-gray-700">
        <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold">O</span>
          </div>
          <div>
            <p className="text-sm font-medium">Owner Account</p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerSidebar;
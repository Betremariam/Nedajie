import { NavLink } from "react-router-dom";

const SuperAdminSidebar = () => {
  const linkClass = ({ isActive }) => 
    `block py-3 px-4 text-white transition-all duration-200 rounded-lg border-l-4 ${
      isActive 
        ? 'bg-red-700 border-red-400 shadow-md font-semibold' 
        : 'bg-gray-700 border-gray-700 hover:bg-gray-600 hover:border-red-500 hover:translate-x-1'
    }`;

  return (
    <div className="w-64 bg-gray-600 text-white h-full p-6 shadow-xl">
      <div className="mb-8 pb-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white">Super Admin</h1>
        <p className="text-white text-sm mt-1">System Administration</p>
      </div>
      <nav className="flex flex-col gap-3">
        <NavLink to="/super-admin/dashboard" className={linkClass}>
          📊 Dashboard
        </NavLink>
        <NavLink to="/super-admin/manage-admins" className={linkClass}>
          👨‍💼 Manage Admins
        </NavLink>
        <NavLink to="/super-admin/fuel-stock" className={linkClass}>
          ⛽ Fuel Stock Manager
        </NavLink>
        <NavLink to="/super-admin/transactions" className={linkClass}>
          💰 Transactions
        </NavLink>
        <NavLink to="/super-admin/drivers-list" className={linkClass}>
          🚗 Drivers List
        </NavLink>
        <NavLink to="/super-admin/farmers-list" className={linkClass}>
          👨‍🌾 Farmers List
        </NavLink>
        <NavLink to="/super-admin/others-list" className={linkClass}>
          👥 Others List
        </NavLink>
        <NavLink to="/super-admin/fuel-delivery" className={linkClass}>
          🚚 Fuel Delivery
        </NavLink>
      </nav>
      
      <div className="mt-auto pt-6 border-t border-gray-700">
        <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold">S</span>
          </div>
          <div>
            <p className="text-sm font-medium">Super Admin</p>
            <p className="text-xs text-gray-400">System Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminSidebar;
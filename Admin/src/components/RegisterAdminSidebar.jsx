import { NavLink } from "react-router-dom";

const RegisterAdminSidebar = () => {
  const linkClass = ({ isActive }) => 
    `block py-3 px-4 text-white transition-all duration-200 rounded-lg border-l-4 ${
      isActive 
        ? 'bg-purple-700 border-purple-400 shadow-md font-semibold' 
        : 'bg-gray-700 border-gray-700 hover:bg-gray-600 hover:border-purple-500 hover:translate-x-1'
    }`;

  return (
    <div className="w-64 bg-gray-600 text-white h-full p-6 shadow-xl">
      <div className="mb-8 pb-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white">Register Admin</h1>
        <p className="text-white text-sm mt-1">Registration Portal</p>
      </div>
      <nav className="flex flex-col gap-3">
        <NavLink to="/register/register-dashboard" className={linkClass}>
          📊 Registration Dashboard
        </NavLink>
        <NavLink to="/register/attendant-registration" className={linkClass}>
          ⛽ Attendant Registration
        </NavLink>
        <NavLink to="/register/driver-registration" className={linkClass}>
          🚗 Driver Registration
        </NavLink>
        <NavLink to="/register/farmer-registration" className={linkClass}>
          👨‍🌾 Farmer Registration
        </NavLink>
        <NavLink to="/register/other-registration" className={linkClass}>
          👥 Other Registration
        </NavLink>
      </nav>
      
      <div className="mt-auto pt-6 border-t border-gray-700">
        <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold">R</span>
          </div>
          <div>
            <p className="text-sm font-medium">Register Admin</p>
            <p className="text-xs text-gray-400">Registration Officer</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterAdminSidebar;
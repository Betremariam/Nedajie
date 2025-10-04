import { NavLink } from "react-router-dom";

const ApproverSidebar = () => {
  const linkClass = ({ isActive }) => 
    `block py-3 px-4 text-white transition-all duration-200 rounded-lg border-l-4 ${
      isActive 
        ? 'bg-green-700 border-green-400 shadow-md font-semibold' 
        : 'bg-gray-700 border-gray-700 hover:bg-gray-600 hover:border-green-500 hover:translate-x-1'
    }`;

  return (
    <div className="w-64 bg-gray-600 text-white h-full p-6 shadow-xl">
      <div className="mb-8 pb-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white">Approval Admin</h1>
        <p className="text-white text-sm mt-1">Authorization Portal</p>
      </div>
      <nav className="flex flex-col gap-3">
        <NavLink to="/approver/drivers" className={linkClass}>
          🚗 Approve Drivers
        </NavLink>
        <NavLink to="/approver/farmers" className={linkClass}>
          👨‍🌾 Approve Farmers
        </NavLink>
        <NavLink to="/approver/attendants" className={linkClass}>
          ⛽ Approve Attendants
        </NavLink>
        <NavLink to="/approver/others" className={linkClass}>
          👥 Approve Others
        </NavLink>
        <NavLink to="/approver/dashboard" className={linkClass}>
          📊 Approval Dashboard
        </NavLink>
      </nav>
      
      <div className="mt-auto pt-6 border-t border-gray-700">
        <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold">A</span>
          </div>
          <div>
            <p className="text-sm font-medium">Approver Account</p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApproverSidebar;
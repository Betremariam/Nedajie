import { NavLink } from "react-router-dom";

const ApproverSidebar = () => {
  const linkClass = "block py-2 px-4 text-white hover:bg-blue-600 rounded";

  return (
    <div className="w-64 bg-gray-800 text-white h-full p-4">
      <h1 className="text-2xl font-bold mb-6">Approve Admin</h1>
      <nav className="flex flex-col gap-2">
        <NavLink to="/approver/drivers" className={linkClass}>Approve Drivers</NavLink>
        <NavLink to="/approver/farmers" className={linkClass}>Approve Farmers</NavLink>
        <NavLink to="/approver/attendants" className={linkClass}>Approve Attendants</NavLink>
        <NavLink to="/approver/others" className={linkClass}>Approve Others</NavLink>
        <NavLink to="/approver/dashboard" className={linkClass}>Approve dashboard</NavLink>
      </nav>
    </div>
  );
};

export default ApproverSidebar;

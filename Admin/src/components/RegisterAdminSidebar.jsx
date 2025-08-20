import { NavLink } from "react-router-dom";

const RegisterAdminSidebar = () => {
  const linkClass = "block py-2 px-4 text-white hover:bg-blue-600 rounded";

  return (
    <div className="w-64 bg-gray-800 text-white h-full p-4">
      <h1 className="text-2xl font-bold mb-6">Register Admin</h1>
      <nav className="flex flex-col gap-2">
        <NavLink to="/register/register-dashboard" className={linkClass}>
          Registration Dashboard
        </NavLink>
        <NavLink to="/register/attendant-registration" className={linkClass}>
          Attendant Registration
        </NavLink>
        <NavLink to="/register/driver-registration" className={linkClass}>
          Driver Registration
        </NavLink>
        <NavLink to="/register/farmer-registration" className={linkClass}>
          Farmer Registration
        </NavLink>
        <NavLink to="/register/other-registration" className={linkClass}>
          Other Registration
        </NavLink>
         
      </nav>
    </div>
  );
};

export default RegisterAdminSidebar;

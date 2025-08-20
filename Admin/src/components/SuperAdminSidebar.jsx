import { NavLink } from "react-router-dom";

const SuperAdminSidebar = () => {
  const linkClass = "block py-2 px-4 text-white hover:bg-blue-600 rounded";

  return (
      <div className="w-64 bg-gray-800 text-white h-full p-4">
      <h1 className="text-2xl font-bold mb-6">Super Admin</h1>
      <nav className="flex flex-col gap-2">
        <NavLink to="/super-admin/dashboard" className={linkClass}>Dashboard</NavLink>
        <NavLink to="/super-admin/manage-admins" className={linkClass}>Manage Admins</NavLink>
        <NavLink to="/super-admin/fuel-stock" className={linkClass}>FuelStockManager</NavLink>
        <NavLink to="/super-admin/transactions" className={linkClass}>Transactions</NavLink>
        <NavLink to="/super-admin/drivers-list" className={linkClass}>Drivers List</NavLink>
        <NavLink to="/super-admin/farmers-list" className={linkClass}>Farmers List</NavLink>
        <NavLink to="/super-admin/others-list" className={linkClass}>Others List</NavLink>
        <NavLink to="/super-admin/fuel-delivery" className={linkClass}>Fuel Delivery</NavLink>
      </nav>
    </div>
  );
};

export default SuperAdminSidebar;

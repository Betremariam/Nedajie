import { LayoutGrid, Users, Fuel, History, Users2, Truck, Building2 } from "lucide-react";
import BaseSidebar from "./BaseSidebar";

const navItems = [
  { title: "Dashboard", url: "/super-admin/dashboard", icon: LayoutGrid },
  { title: "Admins", url: "/super-admin/manage-admins", icon: Users },
  { title: "Owners", url: "/super-admin/manage-owners", icon: Building2 },
  { title: "Fuel Stock", url: "/super-admin/fuel-stock", icon: Fuel },
  { title: "History", url: "/super-admin/transactions", icon: History },
  { title: "Confirm Deliveries", url: "/super-admin/confirm-deliveries", icon: Truck },
  {
    title: "Users",
    icon: Users2,
    items: [
      { title: "Vehicles", url: "/super-admin/vehicles-list" },
      { title: "Farmers", url: "/super-admin/farmers-list" },
      { title: "Mill Owners", url: "/super-admin/mill-house-owners-list" },
      { title: "Others", url: "/super-admin/others-list" },
    ],
  },
];

const SuperAdminSidebar = () => (
  <BaseSidebar navItems={navItems} label="Management" roleTitle="Super Admin" />
);

export default SuperAdminSidebar;

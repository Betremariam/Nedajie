import { LayoutDashboard, Fuel, Users, History, BarChart3, Truck } from "lucide-react";
import BaseSidebar from "./BaseSidebar";

const navItems = [
  { title: "Dashboard", url: "/owner/dashboard", icon: LayoutDashboard },
  { title: "Attendants", url: "/owner/attendant", icon: Users },
  { title: "Fuel Inflow", url: "/owner/fuel-received", icon: Fuel },
  { title: "Pending Deliveries", url: "/owner/pending-deliveries", icon: Truck },
  { title: "Transactions", url: "/owner/transactions", icon: History },
  { title: "Analytics", url: "/owner/reports", icon: BarChart3 },
];

const OwnerSidebar = () => (
  <BaseSidebar navItems={navItems} label="Owner Portal" roleTitle="Station Owner" />
);

export default OwnerSidebar;

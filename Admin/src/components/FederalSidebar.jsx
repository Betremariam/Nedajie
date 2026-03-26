import { LayoutGrid, Users, UserPlus, Truck } from "lucide-react";
import BaseSidebar from "./BaseSidebar";

const navItems = [
  { title: "Dashboard", url: "/federal/dashboard", icon: LayoutGrid },
  { title: "Super Admins", url: "/federal/manage-super-admins", icon: Users },
  { title: "Owners", url: "/federal/manage-owners", icon: UserPlus },
  { title: "Fuel Deliveries", url: "/federal/fuel-deliveries", icon: Truck },
];

const FederalSidebar = () => (
  <BaseSidebar navItems={navItems} label="Federal Ops" roleTitle="Federal Admin" />
);

export default FederalSidebar;

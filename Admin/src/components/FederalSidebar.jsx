import { LayoutGrid, Users, UserPlus, Truck, List, ShieldPlus } from "lucide-react";
import BaseSidebar from "./BaseSidebar";

const navItems = [
  { title: "Dashboard", url: "/federal/dashboard", icon: LayoutGrid },
  { title: "Register Super Admin", url: "/federal/manage-super-admins", icon: ShieldPlus },
  { title: "Super Admins List", url: "/federal/super-admins-list", icon: Users },
  { title: "Register Owner", url: "/federal/manage-owners", icon: UserPlus },
  { title: "Owners List", url: "/federal/owners-list", icon: List },
  { title: "Fuel Deliveries", url: "/federal/fuel-deliveries", icon: Truck },
];

const FederalSidebar = () => (
  <BaseSidebar navItems={navItems} label="Federal Ops" roleTitle="Federal Admin" />
);

export default FederalSidebar;

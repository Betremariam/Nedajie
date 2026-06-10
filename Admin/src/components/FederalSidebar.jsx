import { LayoutGrid, Users, UserPlus, Truck, List, ShieldPlus, Car, Receipt } from "lucide-react";
import BaseSidebar from "./BaseSidebar";
import { useTranslation } from "react-i18next";

const FederalSidebar = () => {
  const { t } = useTranslation();

  const navItems = [
    { title: t("navDashboard"), url: "/federal/dashboard", icon: LayoutGrid },
    { title: t("navRegisterSuperAdmin"), url: "/federal/manage-super-admins", icon: ShieldPlus },
    { title: t("navSuperAdminsList"), url: "/federal/super-admins-list", icon: Users },
    { title: t("navRegisterOwner"), url: "/federal/manage-owners", icon: UserPlus },
    { title: t("navOwnersList"), url: "/federal/owners-list", icon: List },
    { title: t("navVehicleTypeConfig"), url: "/federal/vehicle-types", icon: Car },
    { title: t("navTransactions"), url: "/federal/transactions", icon: Receipt },
    { title: t("navFuelDeliveries"), url: "/federal/fuel-deliveries", icon: Truck },
  ];

  return (
    <BaseSidebar navItems={navItems} label="sidebarFederalOps" roleTitle="sidebarFederalAdmin" />
  );
};

export default FederalSidebar;

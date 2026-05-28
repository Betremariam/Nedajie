import { LayoutGrid, Users, Fuel, History, Users2, Truck, Building2 } from "lucide-react";
import BaseSidebar from "./BaseSidebar";
import { useTranslation } from "react-i18next";

const SuperAdminSidebar = () => {
  const { t } = useTranslation();

  const navItems = [
    { title: t("navDashboard"), url: "/super-admin/dashboard", icon: LayoutGrid },
    { title: t("navAdmins"), url: "/super-admin/manage-admins", icon: Users },
    { title: t("navOwners"), url: "/super-admin/manage-owners", icon: Building2 },
    { title: t("navFuelStock"), url: "/super-admin/fuel-stock", icon: Fuel },
    { title: t("navHistory"), url: "/super-admin/transactions", icon: History },
    { title: t("navConfirmDeliveries"), url: "/super-admin/confirm-deliveries", icon: Truck },
    {
      title: t("navUsers"),
      icon: Users2,
      items: [
        { title: t("navVehicles"), url: "/super-admin/vehicles-list" },
        { title: t("navFarmers"), url: "/super-admin/farmers-list" },
        { title: t("navMillOwners"), url: "/super-admin/mill-house-owners-list" },
        { title: t("navOthers"), url: "/super-admin/others-list" },
      ],
    },
  ];

  return (
    <BaseSidebar navItems={navItems} label="sidebarManagement" roleTitle="sidebarSuperAdmin" />
  );
};

export default SuperAdminSidebar;

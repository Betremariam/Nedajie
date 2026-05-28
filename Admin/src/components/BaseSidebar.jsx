import { useTranslation } from "react-i18next";
import { Lock } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "./ui/Sidebar";
import { NavMain } from "./NavMain";
import { NavUser } from "./NavUser";
import nedajieLogo from "../assets/nedajie_logo.png";

/**
 * BaseSidebar - shared sidebar shell for all admin roles.
 * Each role sidebar only needs to pass its navItems, nav group label,
 * and a roleTitle string.
 */
const BaseSidebar = ({ navItems, label, roleTitle }) => {
  const { t } = useTranslation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-3 px-4 py-6 group-data-[collapsible=icon]:p-2 border-b border-sidebar-border/50">
          <div className="flex aspect-square size-12 group-data-[collapsible=icon]:size-8 items-center justify-center shrink-0 transition-all duration-200">
            <img src={nedajieLogo} alt="Nedajie Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
            <span className="font-bold text-[15px] tracking-tight text-sidebar-foreground drop-shadow-sm">
              Nedajie
            </span>
            <span className="text-[10px] text-sidebar-foreground/60 font-semibold tracking-widest uppercase mt-0.5">
              {t(roleTitle)}
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavMain label={t(label)} items={navItems} />
      </SidebarContent>

      <SidebarFooter className="p-4 gap-4 pb-6">
        <NavUser />
        <div className="flex flex-col items-center gap-3 mt-2 text-center group-data-[collapsible=icon]:hidden">
          <p className="text-[10px] text-sidebar-foreground/50 font-medium">
            {t("sidebarCopyright")}
          </p>
          <div className="flex items-center gap-1.5 bg-sidebar-accent border border-emerald-500/20 text-emerald-600 dark:text-emerald-500 rounded-full px-4 py-1.5 opacity-80 backdrop-blur-sm">
            <Lock className="w-3 h-3" />
            <span className="text-[10px] font-semibold tracking-wide">
              {t("sidebarSecureEncrypted")}
            </span>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};

export default BaseSidebar;

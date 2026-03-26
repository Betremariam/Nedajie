import { EllipsisVertical, LogOut, CircleUser } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Avatar, AvatarFallback } from "./ui/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/Sidebar";

export function NavUser() {
  const { isMobile } = useSidebar();
  const navigate = useNavigate();

  const adminData = JSON.parse(localStorage.getItem("admin") || "{}");

  const userName  = adminData.name  || "Admin";
  const userEmail = adminData.email || "admin@nigdbureau.com";
  const initials  = userName.charAt(0).toUpperCase() || "A";

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    localStorage.removeItem("stationIds");
    navigate("/");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="cursor-pointer bg-white/5 border border-white/10 rounded-2xl p-2 h-auto hover:bg-white/10 transition-colors data-[state=open]:bg-white/10"
            >
              <Avatar className="h-9 w-9 rounded-full bg-white flex items-center justify-center p-0.5 shadow-sm shrink-0">
                <AvatarFallback className="rounded-full bg-white text-blue-600 font-bold text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight ml-1 overflow-hidden">
                <span className="truncate font-semibold text-white text-[13px] tracking-tight">
                  {userName}
                </span>
                <span className="truncate text-slate-400 text-[10px] tracking-wider mt-0.5">
                  {userEmail}
                </span>
              </div>
              <EllipsisVertical className="ml-auto size-4 text-slate-400 shrink-0" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{userName}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {userEmail}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to="/settings/account">
                  <CircleUser />
                  Account
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

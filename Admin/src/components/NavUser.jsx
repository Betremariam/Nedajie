import { EllipsisVertical, LogOut, BellDot, CircleUser } from "lucide-react"
import { Link } from "react-router-dom"

import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/Sidebar"

import { useNavigate } from "react-router-dom"

export function NavUser() {
  const { isMobile } = useSidebar()
  const navigate = useNavigate()
  
  const adminData = JSON.parse(localStorage.getItem("admin") || "{}");
  
  const user = {
    name: adminData.name || "Admin",
    email: adminData.email || "admin@nigdbureau.com",
    role: adminData.role || "unknown"
  }

  const userName = user.name
  const userEmail = user.email
  const initials = user.name?.charAt(0) || "A"

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    localStorage.removeItem("stationIds");
    navigate("/");
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-white/5 data-[state=open]:text-white cursor-pointer bg-slate-900 rounded-2xl border border-white/5 shadow-sm p-2 h-auto hover:bg-slate-800 transition-colors"
            >
              <Avatar className="h-9 w-9 rounded-full bg-white flex items-center justify-center p-0.5 shadow-sm">
                <AvatarFallback className="rounded-full bg-white text-blue-600 font-bold text-sm h-full w-full flex items-center justify-center">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight ml-1">
                <span className="truncate font-semibold text-white text-[13px] tracking-tight">{userName}</span>
                <span className="text-slate-400 truncate text-[10px] tracking-wider mt-0.5">
                  {userEmail}
                </span>
              </div>
              <EllipsisVertical className="ml-auto size-4 text-slate-400" />
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
  )
}

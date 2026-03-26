import { ChevronRight } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/Collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "./ui/Sidebar"

export function NavMain({
  label,
  items,
}) {
  const location = useLocation()

  const shouldBeOpen = (item) => {
    if (item.isActive) return true
    return item.items?.some(subItem => location.pathname === subItem.url) || false
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-[11px] font-bold text-slate-400 mb-2">{label}</SidebarGroupLabel>
      <SidebarMenu className="space-y-1 px-2">
        {items.map((item) => {
          const isActive = location.pathname === item.url;
          
          return (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={shouldBeOpen(item)}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title} className="cursor-pointer text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
                      {item.icon && <item.icon />}
                      <span className="font-medium text-[13px]">{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => {
                        const isSubActive = location.pathname === subItem.url;
                        return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton 
                             asChild 
                             className={`cursor-pointer transition-colors ${isSubActive ? "text-white font-medium" : "text-slate-400 hover:text-white"}`}
                          >
                            <Link to={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : (
                <SidebarMenuButton 
                  asChild 
                  tooltip={item.title} 
                  className={`cursor-pointer transition-all duration-200 ${isActive ? "bg-blue-600 text-white hover:bg-blue-700 hover:text-white shadow-sm font-medium" : "text-slate-300 hover:bg-slate-800 hover:text-white font-medium"}`}
                >
                  <Link to={item.url} className="flex items-center w-full">
                    {item.icon && <item.icon className="w-4 h-4" />}
                    <span className="text-[13px] ml-1">{item.title}</span>
                    {isActive && <ChevronRight className="ml-auto w-4 h-4 opacity-70" />}
                  </Link>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          </Collapsible>
        )})}
      </SidebarMenu>
    </SidebarGroup>
  )
}

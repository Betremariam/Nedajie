import { ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/Collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "./ui/Sidebar";

export function NavMain({ label, items }) {
  const location = useLocation();

  const isGroupOpen = (item) =>
    item.isActive || item.items?.some((sub) => location.pathname === sub.url) || false;

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-[11px] font-bold text-sidebar-foreground/50 mb-2">
        {label}
      </SidebarGroupLabel>

      <SidebarMenu className="space-y-1 px-2">
        {items.map((item) => {
          const isActive = location.pathname === item.url;

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isGroupOpen(item)}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                {item.items?.length ? (
                  <>
                    {/* Collapsible parent item */}
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        className="cursor-pointer text-sidebar-foreground/70 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent transition-colors"
                      >
                        {item.icon && <item.icon className="w-4 h-4" />}
                        <span className="font-medium text-[13px]">{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((sub) => {
                          const isSubActive = location.pathname === sub.url;
                          return (
                            <SidebarMenuSubItem key={sub.title}>
                              <SidebarMenuSubButton
                                asChild
                                className={`cursor-pointer transition-colors ${
                                  isSubActive
                                    ? "text-sidebar-foreground font-medium"
                                    : "text-sidebar-foreground/50 hover:text-sidebar-accent-foreground"
                                }`}
                              >
                                <Link to={sub.url}>
                                  <span>{sub.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : (
                  /* Leaf item */
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className={`cursor-pointer transition-all duration-200 font-medium ${
                      isActive
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground shadow-sm"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }`}
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
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

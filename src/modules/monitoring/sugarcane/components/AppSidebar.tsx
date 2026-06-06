import { Link, useRouterState } from "@tanstack/react-router";
import { Map, BarChart3, FileText, Database, Sprout, Sparkles, LogOut, ChevronRight, ChevronLeft } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar,
} from "@monitoring-shared/ui/sidebar";
import { useMonitoring } from "../../shared/MonitoringContext";

const main = [
  { title: "Dashboard", url: "/", icon: BarChart3 },
  { title: "Map View", url: "/map", icon: Map },
  { title: "AI Assistant", url: "/assistant", icon: Sparkles, badge: "AI" },
];

const ops = [
  { title: "Reports", url: "/reports", icon: FileText },
  { title: "Data Management", url: "/data", icon: Database },
];

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const { onSignOut } = useMonitoring();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border bg-sidebar">
        <div className="flex items-center gap-2.5 px-2 py-2.5">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-emerald-400 text-primary-foreground shadow-md">
            <Sprout className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-sidebar" />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold tracking-tight text-sidebar-foreground">CaneSense</span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-sidebar-foreground/60">Sugarcane RS</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-sidebar">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50">Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {main.map((item) => {
                const active = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.title}
                      className="group/btn data-[active=true]:!bg-primary data-[active=true]:!text-primary-foreground data-[active=true]:font-semibold data-[active=true]:shadow-sm hover:bg-sidebar-accent"
                    >
                      <Link to={item.url} className="flex items-center gap-2.5">
                        <item.icon className="h-4 w-4" />
                        {!collapsed && (
                          <>
                            <span className="flex-1">{item.title}</span>
                            {item.badge && (
                              <span className="rounded-md bg-gradient-to-r from-emerald-500 to-emerald-400 px-1.5 py-0.5 text-[9px] font-bold text-white">
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50">Operations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {ops.map((item) => {
                const active = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.title}
                      className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:font-semibold hover:bg-sidebar-accent"
                    >
                      <Link to={item.url} className="flex items-center gap-2.5">
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border bg-sidebar p-3 space-y-3">
        <button onClick={onSignOut} className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold text-sidebar-foreground/60 hover:text-white hover:bg-sidebar-accent rounded-md transition shadow-sm border border-sidebar-border/50">
           <LogOut className="h-4 w-4" /> Sign Out
        </button>
        <button
          onClick={() => toggleSidebar()}
          className="w-full flex items-center justify-center rounded-md py-1.5 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-white"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}

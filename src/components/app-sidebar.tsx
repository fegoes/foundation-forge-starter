import { Users, Package, CreditCard, Kanban, Headphones, Settings, Building2, BarChart3, ChevronLeft, ChevronRight } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: BarChart3,
    description: "Visão geral e métricas",
    badge: null
  },
  {
    title: "Clientes",
    url: "/clientes",
    icon: Users,
    description: "Gestão de clientes e contratos",
    badge: null
  },
  {
    title: "Produtos & Serviços",
    url: "/produtos",
    icon: Package,
    description: "Catálogo de produtos e serviços",
    badge: null
  },
  {
    title: "Assinaturas",
    url: "/assinaturas",
    icon: CreditCard,
    description: "Contratos de recorrência",
    badge: null
  },
  {
    title: "Tarefas",
    url: "/kanban",
    icon: Kanban,
    description: "Quadros de negociações",
    badge: "3"
  },
  {
    title: "Chamados Técnicos",
    url: "/chamados",
    icon: Headphones,
    description: "Suporte e atendimento",
    badge: "12"
  },
  {
    title: "Configurações",
    url: "/configuracoes",
    icon: Settings,
    description: "Parâmetros do sistema",
    badge: null
  }
];
export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";
  
  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path + "/");

  const renderMenuItem = (item: typeof menuItems[0]) => {
    const content = (
      <NavLink 
        to={item.url} 
        className="flex items-center gap-3 w-full group transition-all duration-200"
      >
        <div className="flex items-center justify-center w-5 h-5 transition-transform duration-200 group-hover:scale-110">
          <item.icon className="h-5 w-5" />
        </div>
        
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium truncate">{item.title}</span>
              {item.badge && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-primary-foreground bg-primary rounded-full ml-2 flex-shrink-0">
                  {item.badge}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
              {item.description}
            </p>
          </div>
        )}
      </NavLink>
    );

    if (collapsed) {
      return (
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative">
                {content}
                {item.badge && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-primary-foreground bg-primary rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="ml-2">
              <div className="font-medium">{item.title}</div>
              <div className="text-xs text-muted-foreground">{item.description}</div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return content;
  };

  return (
    <Sidebar 
      className={`transition-all duration-300 ease-in-out ${collapsed ? "w-16" : "w-72"}`} 
      collapsible="icon"
    >
      <SidebarContent className="flex flex-col h-full">
        {/* Header da empresa */}
        <div className="p-4 border-b border-border/50 bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div className="animate-fade-in">
                <h1 className="text-base font-bold text-foreground">RecFin</h1>
                <p className="text-xs text-muted-foreground">Gestão de Cobranças</p>
              </div>
            )}
          </div>
        </div>

        {/* Menu principal */}
        <div className="flex-1 py-4">
          <SidebarGroup>
            {!collapsed && (
              <SidebarGroupLabel className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Módulos do Sistema
              </SidebarGroupLabel>
            )}
            
            <SidebarGroupContent className="px-2">
              <SidebarMenu className="space-y-1">
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive(item.url)}
                      className="h-auto p-3 rounded-xl transition-all duration-200 hover:bg-muted/50 data-[active=true]:bg-primary/10 data-[active=true]:border-primary/20 data-[active=true]:shadow-sm"
                    >
                      {renderMenuItem(item)}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* Footer com trigger estilizado */}
        <div className="border-t border-border/50 p-3">
          <button
            onClick={toggleSidebar}
            className="flex items-center justify-center w-full h-10 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-200 group"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span className="ml-2 text-sm text-muted-foreground group-hover:text-foreground">
                  Recolher
                </span>
              </>
            )}
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
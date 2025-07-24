import { Users, Package, CreditCard, Kanban, Headphones, Settings, Building2, BarChart3 } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
const menuItems = [{
  title: "Dashboard",
  url: "/",
  icon: BarChart3,
  description: "Visão geral e métricas"
}, {
  title: "Clientes",
  url: "/clientes",
  icon: Users,
  description: "Gestão de clientes e contratos"
}, {
  title: "Produtos & Serviços",
  url: "/produtos",
  icon: Package,
  description: "Catálogo de produtos e serviços"
}, {
  title: "Assinaturas",
  url: "/assinaturas",
  icon: CreditCard,
  description: "Contratos de recorrência"
}, {
  title: "Kanban Comercial",
  url: "/kanban",
  icon: Kanban,
  description: "Quadro de negociações"
}, {
  title: "Chamados Técnicos",
  url: "/chamados",
  icon: Headphones,
  description: "Suporte e atendimento"
}, {
  title: "Configurações",
  url: "/configuracoes",
  icon: Settings,
  description: "Parâmetros do sistema"
}];
export function AppSidebar() {
  const {
    state
  } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";
  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path + "/");
  return <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent>
        {/* Header da empresa */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            {!collapsed && <div>
                <h1 className="text-sm font-semibold text-foreground">RecFin</h1>
                <p className="text-xs text-muted-foreground">Gestão de Cobranças</p>
              </div>}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Módulos do Sistema</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(item => <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <div className="flex-1">
                          <span className="text-sm font-medium">{item.title}</span>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Trigger para colapsar/expandir */}
      <div className="border-t p-2">
        <SidebarTrigger className="w-full" />
      </div>
    </Sidebar>;
}
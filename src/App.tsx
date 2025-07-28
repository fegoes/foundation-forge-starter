import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/main-layout";
import Index from "./pages/Index";
import ClientesIndex from "./pages/clientes/Index";
import ProdutosIndex from "./pages/produtos/Index";
import AssinaturasIndex from "./pages/assinaturas/Index";
import KanbanIndex from "./pages/kanban/Index";
import ChamadosIndex from "./pages/chamados/Index";
import ConfiguracoesIndex from "./pages/configuracoes/Index";
import EstagiosPipeline from "./pages/configuracoes/EstagiosPipeline";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/clientes" element={<ClientesIndex />} />
            <Route path="/produtos" element={<ProdutosIndex />} />
            <Route path="/assinaturas" element={<AssinaturasIndex />} />
            <Route path="/kanban" element={<KanbanIndex />} />
            <Route path="/chamados" element={<ChamadosIndex />} />
            <Route path="/configuracoes" element={<ConfiguracoesIndex />} />
            <Route path="/configuracoes/estagios-pipeline" element={<EstagiosPipeline />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

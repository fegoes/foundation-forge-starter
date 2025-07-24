import { DashboardStats } from "@/components/dashboard/DashboardStats"
import { WelcomeCard } from "@/components/dashboard/WelcomeCard"
import { RevenueChart } from "@/components/dashboard/RevenueChart"
import { AssinaturasChart } from "@/components/dashboard/AssinaturasChart"
import { ChamadosChart } from "@/components/dashboard/ChamadosChart"
import { RecentActivity } from "@/components/dashboard/RecentActivity"
import { DashboardStats as StatsType, RevenueData, ChartData } from "@/types/dashboard"

const Index = () => {
  // Dados reais simulados para dashboard
  const stats: StatsType = {
    clientesAtivos: 142,
    clientesInativos: 18,
    assinaturasAtivas: 387,
    assinaturasInativas: 45,
    receitaMensal: 89750.00,
    receitaAnual: 1025430.00,
    chamadosAbertos: 12,
    chamadosFechados: 156,
    totalProdutos: 24,
    produtosAtivos: 22,
    ticketMedio: 231.85,
    crescimentoMensal: 8.5
  }

  const revenueData: RevenueData[] = [
    { month: 'Jan', receita: 65400, assinaturas: 287, clientes: 128 },
    { month: 'Fev', receita: 71200, assinaturas: 312, clientes: 135 },
    { month: 'Mar', receita: 78500, assinaturas: 345, clientes: 142 },
    { month: 'Abr', receita: 82300, assinaturas: 365, clientes: 148 },
    { month: 'Mai', receita: 86700, assinaturas: 378, clientes: 155 },
    { month: 'Jun', receita: 89750, assinaturas: 387, clientes: 160 },
  ]

  const assinaturasData: ChartData[] = [
    { name: 'Ativas', value: 387, fill: 'hsl(var(--chart-1))' },
    { name: 'Inativas', value: 45, fill: 'hsl(var(--chart-2))' },
  ]

  const chamadosData = [
    { status: 'Abertos', quantidade: 12, fill: 'hsl(var(--chart-3))' },
    { status: 'Em Andamento', quantidade: 8, fill: 'hsl(var(--chart-4))' },
    { status: 'Resolvidos', quantidade: 156, fill: 'hsl(var(--chart-1))' },
    { status: 'Fechados', quantidade: 143, fill: 'hsl(var(--chart-2))' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do sistema de gestão de cobranças recorrentes</p>
      </div>

      {/* Cards de métricas principais */}
      <DashboardStats stats={stats} />

      {/* Gráficos e análises */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <RevenueChart data={revenueData} />
        <RecentActivity />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <AssinaturasChart data={assinaturasData} />
        <ChamadosChart data={chamadosData} />
      </div>

      {/* Informações do sistema */}
      <WelcomeCard />
    </div>
  )
};

export default Index;

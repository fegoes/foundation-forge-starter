import { DashboardStats } from "@/components/dashboard/DashboardStats"
import { WelcomeCard } from "@/components/dashboard/WelcomeCard"
import { RecentActivity } from "@/components/dashboard/RecentActivity"
import { RevenueChart } from "@/components/dashboard/RevenueChart"
import { AssinaturasChart } from "@/components/dashboard/AssinaturasChart"
import { ChamadosChart } from "@/components/dashboard/ChamadosChart"
import type { DashboardStats as DashboardStatsType, RevenueData, ChartData, ChamadosData } from "@/types/dashboard"

export default function Index() {
  // Mock data
  const stats: DashboardStatsType = {
    revenue: 150000,
    growth: 12.5,
    customers: 340,
    orders: 125,
    clientesAtivos: 340,
    crescimentoMensal: 12.5,
    assinaturasAtivas: 125,
    assinaturasInativas: 15,
    receitaMensal: 150000,
    receitaAnual: 1800000,
    chamadosAbertos: 23,
    chamadosFechados: 102,
    totalProdutos: 45,
    produtosAtivos: 42,
    ticketMedio: 1200,
    clientesInativos: 8
  }

  const revenueData: RevenueData[] = [
    { month: "Jan", revenue: 120000 },
    { month: "Fev", revenue: 135000 },
    { month: "Mar", revenue: 150000 }
  ]

  const chartData: ChartData = {
    labels: ["Jan", "Fev", "Mar"],
    datasets: [
      {
        label: "Receita",
        data: [120000, 135000, 150000]
      }
    ]
  }

  const chamadosData: ChamadosData[] = [
    { status: "Abertos", quantidade: 23, fill: "hsl(var(--destructive))" },
    { status: "Fechados", quantidade: 102, fill: "hsl(var(--primary))" }
  ]

  return (
    <div className="space-y-6">
      <WelcomeCard />
      <DashboardStats stats={stats} />
      <div className="grid gap-6 md:grid-cols-2">
        <RevenueChart data={revenueData} />
        <AssinaturasChart data={[chartData]} />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <ChamadosChart data={chamadosData} />
        <RecentActivity />
      </div>
    </div>
  )
}
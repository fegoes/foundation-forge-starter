import { TrendingUp, Users, CreditCard, Headphones, Package, DollarSign, UserCheck, UserX } from "lucide-react"
import { StatsCard } from "./StatsCard"
import { DashboardStats as StatsType } from "@/types/dashboard"

interface DashboardStatsProps {
  stats: StatsType
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  const statsData = [
    {
      title: "Clientes Ativos",
      value: stats.clientesAtivos,
      change: `+${stats.crescimentoMensal}% em relação ao mês anterior`,
      icon: UserCheck,
      variant: 'success' as const,
    },
    {
      title: "Assinaturas Ativas", 
      value: stats.assinaturasAtivas,
      change: `${stats.assinaturasInativas} inativas`,
      icon: CreditCard,
    },
    {
      title: "Receita Mensal",
      value: `R$ ${stats.receitaMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      change: `Anual: R$ ${stats.receitaAnual.toLocaleString('pt-BR')}`,
      icon: TrendingUp,
      variant: 'success' as const,
    },
    {
      title: "Chamados Abertos",
      value: stats.chamadosAbertos,
      change: `${stats.chamadosFechados} resolvidos este mês`, 
      icon: Headphones,
      variant: stats.chamadosAbertos > 10 ? 'warning' as const : 'default' as const,
    },
    {
      title: "Total de Produtos",
      value: stats.totalProdutos,
      change: `${stats.produtosAtivos} ativos`,
      icon: Package,
    },
    {
      title: "Ticket Médio",
      value: `R$ ${stats.ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      change: "+5% em relação ao mês anterior",
      icon: DollarSign,
      variant: 'success' as const,
    },
    {
      title: "Clientes Inativos",
      value: stats.clientesInativos,
      change: "Retenção: 94%",
      icon: UserX,
      variant: stats.clientesInativos > 20 ? 'warning' as const : 'default' as const,
    },
    {
      title: "Taxa de Crescimento",
      value: `${stats.crescimentoMensal}%`,
      change: "Crescimento mensal",
      icon: TrendingUp,
      variant: stats.crescimentoMensal > 0 ? 'success' as const : 'destructive' as const,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  )
}
export interface DashboardData {
  revenue: {
    currentMonth: number
    previousMonth: number
    growth: number
  }
  assinaturas: {
    total: number
    active: number
    growth: number
  }
  chamados: {
    total: number
    resolved: number
    pending: number
  }
}

export interface DashboardStats {
  revenue: number
  growth: number
  customers: number
  orders: number
  clientesAtivos: number
  crescimentoMensal: number
  assinaturasAtivas: number
  assinaturasInativas: number
  receitaMensal: number
  receitaAnual: number
  chamadosAbertos: number
  chamadosFechados: number
  totalProdutos: number
  produtosAtivos: number
  ticketMedio: number
  clientesInativos: number
}

export interface ChartData {
  labels: string[]
  datasets: any[]
}

export interface RevenueData {
  month: string
  revenue: number
}

export interface StatCardData {
  title: string
  value: string | number
  change: string
  icon: React.ComponentType<any>
  variant?: 'default' | 'success' | 'warning' | 'destructive'
}

export interface StatsCardProps {
  title: string
  value: string | number
  change: string
  icon: React.ComponentType<any>
  variant?: 'default' | 'success' | 'warning' | 'destructive'
}

export interface DashboardStatsProps {
  stats: DashboardStats
}

export interface RevenueChartProps {
  data: RevenueData[]
}

export interface ChamadosData {
  status: string
  quantidade: number
  fill: string
}

export interface AssinaturasChartProps {
  data: ChartData[]
}

export interface ChamadosChartProps {
  data: ChamadosData[]
}
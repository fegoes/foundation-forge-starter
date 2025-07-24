export interface DashboardStats {
  clientesAtivos: number
  clientesInativos: number
  assinaturasAtivas: number
  assinaturasInativas: number
  receitaMensal: number
  receitaAnual: number
  chamadosAbertos: number
  chamadosFechados: number
  totalProdutos: number
  produtosAtivos: number
  ticketMedio: number
  crescimentoMensal: number
}

export interface StatCardData {
  title: string
  value: string | number
  change: string
  icon: React.ComponentType<{ className?: string }>
  variant?: 'default' | 'success' | 'warning' | 'destructive'
}

export interface ChartData {
  name: string
  value: number
  fill?: string
}

export interface RevenueData {
  month: string
  receita: number
  assinaturas: number
  clientes: number
}
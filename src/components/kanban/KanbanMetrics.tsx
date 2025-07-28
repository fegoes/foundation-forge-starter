import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Plus } from "lucide-react"
import type { Stage } from "@/types/kanban"

interface KanbanMetricsProps {
  stages: Stage[]
}

export const KanbanMetrics = ({ stages }: KanbanMetricsProps) => {
  const calcularTotalStage = (cards: any[]) => {
    return cards.reduce((total, card) => total + card.valor, 0)
  }

  const calcularTotalPipeline = () => {
    return stages.reduce((total, stage) => 
      total + calcularTotalStage(stage.cards), 0
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Pipeline</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">
            R$ {calcularTotalPipeline().toFixed(2)}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Oportunidades</CardTitle>
          <Plus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stages.reduce((total, stage) => total + stage.cards.length, 0)}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">25%</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">18 dias</div>
        </CardContent>
      </Card>
    </div>
  )
}
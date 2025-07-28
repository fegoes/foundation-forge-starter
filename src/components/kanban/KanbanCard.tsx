import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import { EditarOportunidadeDialog } from "@/components/dialogs/EditarOportunidadeDialog"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import type { KanbanCard as KanbanCardType, Stage, AcaoCard } from "@/types/kanban"

interface KanbanCardProps {
  card: KanbanCardType
  stages: Stage[]
  onUpdate: (cardId: number, updatedData: Partial<KanbanCardType>) => void
  onDragStart: (e: React.DragEvent, card: KanbanCardType) => void
}

export const KanbanCard = ({ card, stages, onUpdate, onDragStart }: KanbanCardProps) => {
  const [acoesCards] = useLocalStorage<AcaoCard[]>("acoesCards", [])
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "quente": return "destructive"
      case "morno": return "warning"
      case "frio": return "secondary"
      case "perdido": return "outline"
      default: return "secondary"
    }
  }

  const getAcaoCard = (acaoId?: number) => {
    if (!acaoId) return null
    return acoesCards.find(acao => acao.id === acaoId)
  }

  const acaoAtual = getAcaoCard(card.acaoId)

  return (
    <Card 
      className="cursor-move hover:shadow-md transition-all duration-200 border-l-4 border-l-primary/20"
      draggable
      onDragStart={(e) => onDragStart(e, card)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm truncate">{card.cliente}</CardTitle>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <EditarOportunidadeDialog
              card={card}
              stages={stages}
              onUpdate={onUpdate}
              trigger={
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Edit className="h-3 w-3" />
                </Button>
              }
            />
            <Badge variant={getStatusColor(card.status) as any} className="text-xs">
              {card.status}
            </Badge>
          </div>
        </div>
        <CardDescription className="text-xs mt-1 line-clamp-2">
          {card.descricao}
        </CardDescription>
        
        {/* Exibir ação atual */}
        {acaoAtual && (
          <div className="mt-2">
            <Badge 
              variant="outline" 
              className="text-xs"
              style={{ 
                backgroundColor: acaoAtual.cor + '20', 
                borderColor: acaoAtual.cor,
                color: acaoAtual.cor 
              }}
            >
              {acaoAtual.nome}
            </Badge>
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Valor</span>
          <span className="text-sm font-semibold text-success">
            R$ {card.valor.toFixed(2)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
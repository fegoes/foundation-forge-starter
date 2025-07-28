import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Plus } from "lucide-react"
import { TrelloCard } from "./TrelloCard"
import { NovaOportunidadeDialog } from "@/components/dialogs/NovaOportunidadeDialog"
import type { Stage, KanbanCard as KanbanCardType } from "@/types/kanban"

interface KanbanColumnProps {
  stage: Stage
  stages: Stage[]
  onAddCard: (cardData: any) => void
  onUpdateCard: (cardId: number, updatedData: Partial<KanbanCardType>) => void
  onDeleteCard: (cardId: number) => void
  onDragStart: (e: React.DragEvent, card: KanbanCardType) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, targetStageId: number) => void
}

export const KanbanColumn = ({ 
  stage, 
  stages, 
  onAddCard, 
  onUpdateCard,
  onDeleteCard, 
  onDragStart, 
  onDragOver, 
  onDrop 
}: KanbanColumnProps) => {
  const calcularTotalStage = (cards: KanbanCardType[]) => {
    return cards.reduce((total, card) => total + card.valor, 0)
  }

  return (
    <div className="flex-shrink-0 w-80 sm:w-96">
      <Card 
        className="h-fit border-0 shadow-lg"
        style={{ backgroundColor: stage.cor }}
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, stage.id)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full border-2 border-white/30"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              />
              <div className="px-3 py-1 rounded-full text-white font-bold text-base bg-white/20 backdrop-blur-sm">
                {stage.nome}
              </div>
              <span className="text-sm text-white/80">
                ({stage.cards.length})
              </span>
            </div>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-sm font-medium text-white">
            R$ {calcularTotalStage(stage.cards).toFixed(2)}
          </div>
        </CardHeader>
        <CardContent className="space-y-3 min-h-32">
          {stage.cards.map((card) => (
            <TrelloCard
              key={card.id}
              card={card}
              stages={stages}
              onUpdate={onUpdateCard}
              onDragStart={onDragStart}
              onDelete={onDeleteCard}
            />
          ))}
          
          <NovaOportunidadeDialog 
            stages={stages}
            onAddCard={(cardData) => {
              onAddCard({
                ...cardData,
                estagio: stage.id
              })
            }}
            trigger={
              <Button 
                variant="ghost" 
                className="w-full h-12 border-2 border-dashed border-white/30 hover:border-white/50 hover:bg-white/10 text-white transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Card
              </Button>
            }
          />
        </CardContent>
      </Card>
    </div>
  )
}
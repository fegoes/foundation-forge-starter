import { KanbanColumn } from "./KanbanColumn"
import type { Stage, KanbanCard } from "@/types/kanban"

interface KanbanBoardProps {
  stages: Stage[]
  onAddCard: (cardData: any) => void
  onUpdateCard: (cardId: number, updatedData: Partial<KanbanCard>) => void
  onMoveCard: (cardId: number, targetStageId: number) => void
  onDeleteCard: (cardId: number) => void
}

export const KanbanBoard = ({ stages, onAddCard, onUpdateCard, onMoveCard, onDeleteCard }: KanbanBoardProps) => {
  const handleDragStart = (e: React.DragEvent, card: KanbanCard) => {
    e.dataTransfer.setData("text/plain", JSON.stringify(card))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, targetStageId: number) => {
    e.preventDefault()
    const cardData = JSON.parse(e.dataTransfer.getData("text/plain")) as KanbanCard
    onMoveCard(cardData.id, targetStageId)
  }

  return (
    <div className="h-full flex gap-4 overflow-x-auto px-6 py-4">
      {stages.map((stage) => (
        <KanbanColumn
          key={stage.id}
          stage={stage}
          stages={stages}
          onAddCard={onAddCard}
          onUpdateCard={onUpdateCard}
          onDeleteCard={onDeleteCard}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />
      ))}
    </div>
  )
}
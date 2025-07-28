import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Edit, 
  MessageSquare, 
  Paperclip, 
  Calendar, 
  User,
  MoreHorizontal,
  Eye
} from "lucide-react"
import { EditarOportunidadeDialog } from "@/components/dialogs/EditarOportunidadeDialog"
import { CardDetailsDialog } from "@/components/dialogs/CardDetailsDialog"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import type { KanbanCard as KanbanCardType, Stage, AcaoCard } from "@/types/kanban"

interface TrelloCardProps {
  card: KanbanCardType
  stages: Stage[]
  onUpdate: (cardId: number, updatedData: Partial<KanbanCardType>) => void
  onDragStart: (e: React.DragEvent, card: KanbanCardType) => void
  onDelete?: (cardId: number) => void
}

export const TrelloCard = ({ card, stages, onUpdate, onDragStart, onDelete }: TrelloCardProps) => {
  const [showDetails, setShowDetails] = useState(false)
  const [acoesCards] = useLocalStorage<AcaoCard[]>("acoesCards", [])
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "quente": return "bg-red-500"
      case "morno": return "bg-yellow-500"
      case "frio": return "bg-blue-500"
      case "perdido": return "bg-gray-500"
      default: return "bg-gray-400"
    }
  }

  const getAcaoCard = (acaoId?: number) => {
    if (!acaoId) return null
    return acoesCards.find(acao => acao.id === acaoId)
  }

  const acaoAtual = getAcaoCard(card.acaoId)
  const hasComentarios = (card.comentarios?.length || 0) > 0
  const hasAnexos = typeof card.anexos === 'number' ? card.anexos > 0 : false

  return (
    <>
      <Card 
        className="cursor-pointer hover:shadow-md transition-all duration-200 bg-white border border-gray-200 rounded-lg mb-2 group"
        draggable
        onDragStart={(e) => onDragStart(e, card)}
        onClick={() => setShowDetails(true)}
      >
        <CardContent className="p-3">
          {/* Labels */}
          {card.labels && card.labels.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {card.labels.map((label, index) => (
                <div
                  key={index}
                  className="h-2 w-10 rounded-full bg-green-500"
                />
              ))}
            </div>
          )}

          {/* Título */}
          <div className="mb-2">
            <h3 className="text-sm font-medium text-gray-800 leading-tight">
              {card.cliente}
            </h3>
          </div>

          {/* Descrição curta se houver */}
          {card.descricao && (
            <p className="text-xs text-gray-600 mb-2 line-clamp-2">
              {card.descricao}
            </p>
          )}

          {/* Status badge */}
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(card.status)}`} />
            <span className="text-xs text-gray-600 font-medium">{card.status}</span>
          </div>

          {/* Ação atual */}
          {acaoAtual && (
            <Badge 
              variant="outline" 
              className="text-xs mb-2"
              style={{ 
                backgroundColor: acaoAtual.cor + '20', 
                borderColor: acaoAtual.cor,
                color: acaoAtual.cor 
              }}
            >
              {acaoAtual.nome}
            </Badge>
          )}

          {/* Valor */}
          <div className="mb-3">
            <span className="text-sm font-semibold text-green-600">
              R$ {card.valor.toFixed(2)}
            </span>
          </div>

          {/* Ícones de informações */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {card.dataVencimento && (
                <div className="flex items-center space-x-1 text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span className="text-xs">
                    {new Date(card.dataVencimento).toLocaleDateString()}
                  </span>
                </div>
              )}
              
              {hasComentarios && (
                <div className="flex items-center space-x-1 text-gray-500">
                  <MessageSquare className="w-3 h-3" />
                  <span className="text-xs">{card.comentarios?.length}</span>
                </div>
              )}
              
              {hasAnexos && (
                <div className="flex items-center space-x-1 text-gray-500">
                  <Paperclip className="w-3 h-3" />
                  <span className="text-xs">{typeof card.anexos === 'number' ? card.anexos : 0}</span>
                </div>
              )}
            </div>

            {/* Membros */}
            {card.membros && card.membros.length > 0 && (
              <div className="flex -space-x-1">
                {card.membros.slice(0, 3).map((membro, index) => (
                  <Avatar key={index} className="w-5 h-5 border border-white">
                    <AvatarFallback className="text-xs">
                      {membro.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {card.membros.length > 3 && (
                  <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 border border-white">
                    +{card.membros.length - 3}
                  </div>
                )}
              </div>
            )}

            {/* Botão de edição rápida */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <EditarOportunidadeDialog
                card={card}
                stages={stages}
                onUpdate={onUpdate}
                trigger={
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de detalhes */}
      <CardDetailsDialog
        card={card}
        stages={stages}
        open={showDetails}
        onOpenChange={setShowDetails}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    </>
  )
}
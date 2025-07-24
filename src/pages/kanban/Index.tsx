import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, MoreHorizontal, DollarSign, Edit } from "lucide-react"
import { NovaOportunidadeDialog } from "@/components/dialogs/NovaOportunidadeDialog"
import { EditarOportunidadeDialog } from "@/components/dialogs/EditarOportunidadeDialog"
import { useLocalStorage } from "@/hooks/useLocalStorage"

interface ServicoItem {
  id: number
  produtoId: number
  produto: string
  valor: number
  quantidade: number
}

interface KanbanCard {
  id: number
  cliente: string
  descricao: string
  valor: number
  status: string
  clienteId?: number
  servicos?: ServicoItem[]
}

interface Stage {
  id: number
  nome: string
  cor: string
  cards: KanbanCard[]
}

const defaultStages: Stage[] = [
  { id: 1, nome: "Prospecção", cor: "secondary", cards: [] },
  { id: 2, nome: "Proposta Enviada", cor: "warning", cards: [] },
  { id: 3, nome: "Negociação", cor: "accent", cards: [] },
  { id: 4, nome: "Fechado", cor: "success", cards: [] }
]

const KanbanIndex = () => {
  const [stages, setStages] = useLocalStorage<Stage[]>("kanban-stages", defaultStages)

  const calcularTotalStage = (cards: KanbanCard[]) => {
    return cards.reduce((total, card) => total + card.valor, 0)
  }

  const calcularTotalPipeline = () => {
    return stages.reduce((total, stage) => 
      total + calcularTotalStage(stage.cards), 0
    )
  }

  const handleAddCard = (cardData: {
    cliente: string
    descricao: string
    valor: number
    status: string
    estagio: number
    clienteId?: number
    servicos?: ServicoItem[]
  }) => {
    const newCard: KanbanCard = {
      id: Date.now(),
      cliente: cardData.cliente,
      descricao: cardData.descricao,
      valor: cardData.valor,
      status: cardData.status,
      clienteId: cardData.clienteId,
      servicos: cardData.servicos,
    }

    setStages(prevStages => 
      prevStages.map(stage => 
        stage.id === cardData.estagio
          ? { ...stage, cards: [...stage.cards, newCard] }
          : stage
      )
    )
  }

  const handleUpdateCard = (cardId: number, updatedData: Partial<KanbanCard>) => {
    setStages(prevStages => 
      prevStages.map(stage => ({
        ...stage,
        cards: stage.cards.map(card => 
          card.id === cardId ? { ...card, ...updatedData } : card
        )
      }))
    )
  }

  const handleMoveCard = (cardId: number, targetStageId: number) => {
    let cardToMove: KanbanCard | null = null
    
    // Encontrar e remover o card do estágio atual
    setStages(prevStages => {
      const updatedStages = prevStages.map(stage => {
        const cardIndex = stage.cards.findIndex(card => card.id === cardId)
        if (cardIndex !== -1) {
          cardToMove = stage.cards[cardIndex]
          return {
            ...stage,
            cards: stage.cards.filter(card => card.id !== cardId)
          }
        }
        return stage
      })
      
      // Adicionar o card ao estágio de destino
      if (cardToMove) {
        return updatedStages.map(stage => 
          stage.id === targetStageId
            ? { ...stage, cards: [...stage.cards, cardToMove!] }
            : stage
        )
      }
      
      return updatedStages
    })
  }

  const handleDragStart = (e: React.DragEvent, card: KanbanCard) => {
    e.dataTransfer.setData("text/plain", JSON.stringify(card))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, targetStageId: number) => {
    e.preventDefault()
    const cardData = JSON.parse(e.dataTransfer.getData("text/plain")) as KanbanCard
    handleMoveCard(cardData.id, targetStageId)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "quente": return "destructive"
      case "morno": return "warning"
      case "frio": return "secondary"
      case "perdido": return "outline"
      default: return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Kanban Comercial</h1>
          <p className="text-muted-foreground">Acompanhe suas negociações e oportunidades</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Configurar Estágios</Button>
          <NovaOportunidadeDialog stages={stages} onAddCard={handleAddCard} />
        </div>
      </div>

      {/* Métricas */}
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

      {/* Kanban Board */}
      <div className="grid gap-6 md:grid-cols-4 overflow-x-auto">
        {stages.map((stage) => (
          <div key={stage.id} className="min-w-80 md:min-w-0">
            <Card 
              className="h-fit"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={stage.cor as any}>
                      {stage.nome}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      ({stage.cards.length})
                    </span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-sm font-medium text-success">
                  R$ {calcularTotalStage(stage.cards).toFixed(2)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {stage.cards.map((card) => (
                  <Card 
                    key={card.id} 
                    className="cursor-move hover:shadow-sm transition-shadow"
                    draggable
                    onDragStart={(e) => handleDragStart(e, card)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-sm">{card.cliente}</CardTitle>
                        </div>
                        <div className="flex items-center gap-1">
                          <EditarOportunidadeDialog
                            card={card}
                            stages={stages}
                            onUpdate={handleUpdateCard}
                            trigger={
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <Edit className="h-3 w-3" />
                              </Button>
                            }
                          />
                          <Badge variant={getStatusColor(card.status) as any} className="ml-1">
                            {card.status}
                          </Badge>
                        </div>
                      </div>
                      <CardDescription className="text-xs mt-1">
                        {card.descricao}
                      </CardDescription>
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
                ))}
                
                <NovaOportunidadeDialog 
                  stages={stages} 
                  onAddCard={(cardData) => {
                    const newCard: KanbanCard = {
                      id: Date.now(),
                      cliente: cardData.cliente,
                      descricao: cardData.descricao,
                      valor: cardData.valor,
                      status: cardData.status,
                      clienteId: cardData.clienteId,
                      servicos: cardData.servicos,
                    }

                    setStages(prevStages => 
                      prevStages.map(currentStage => 
                        currentStage.id === stage.id
                          ? { ...currentStage, cards: [...currentStage.cards, newCard] }
                          : currentStage
                      )
                    )
                  }}
                  trigger={
                    <Button 
                      variant="ghost" 
                      className="w-full h-12 border-2 border-dashed border-border hover:border-primary"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Card
                    </Button>
                  }
                />
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}

export default KanbanIndex
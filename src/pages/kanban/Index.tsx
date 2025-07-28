import { useState } from "react"
import { Plus, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { KanbanBoard } from "@/components/kanban/KanbanBoard"
import { KanbanMetrics } from "@/components/kanban/KanbanMetrics"
import { KanbanConfigDialog } from "@/components/dialogs/KanbanConfigDialog"
import { toast } from "sonner"
import type { Stage, KanbanCard } from "@/types/kanban"

// Mock data - em produção viria de uma API
const initialStages: Stage[] = [
  {
    id: 1,
    nome: "Leads",
    ordem: 1,
    cor: "#3B82F6",
    cards: [
      {
        id: 1,
        titulo: "Empresa ABC",
        cliente: "João Silva",
        valor: 15000,
        dataVencimento: "2024-03-15",
        descricao: "Implementação de sistema ERP",
        prioridade: "alta",
        tags: ["ERP", "Implementação"],
        anexos: [],
        comentarios: [],
        atividades: [],
        servicos: [],
        stageId: 1,
        createdAt: "2024-01-10",
        updatedAt: "2024-01-10"
      }
    ]
  },
  {
    id: 2,
    nome: "Qualificação",
    ordem: 2,
    cor: "#F59E0B",
    cards: []
  },
  {
    id: 3,
    nome: "Proposta",
    ordem: 3,
    cor: "#10B981",
    cards: []
  },
  {
    id: 4,
    nome: "Fechado",
    ordem: 4,
    cor: "#059669",
    cards: []
  }
]

export default function KanbanIndex() {
  const [stages, setStages] = useState<Stage[]>(initialStages)
  const [showConfiguracoes, setShowConfiguracoes] = useState(false)

  const handleAddCard = (cardData: any) => {
    const newCard: KanbanCard = {
      id: Date.now(),
      ...cardData,
      anexos: [],
      comentarios: [],
      atividades: [],
      servicos: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setStages(prev => prev.map(stage => 
      stage.id === cardData.stageId 
        ? { ...stage, cards: [...stage.cards, newCard] }
        : stage
    ))

    toast.success("Oportunidade criada com sucesso!")
  }

  const handleUpdateCard = (cardId: number, updatedData: Partial<KanbanCard>) => {
    setStages(prev => prev.map(stage => ({
      ...stage,
      cards: stage.cards.map(card => 
        card.id === cardId 
          ? { ...card, ...updatedData, updatedAt: new Date().toISOString() }
          : card
      )
    })))
  }

  const handleMoveCard = (cardId: number, targetStageId: number) => {
    let cardToMove: KanbanCard | null = null
    
    // Remove card do estágio atual
    setStages(prev => prev.map(stage => {
      const cardIndex = stage.cards.findIndex(card => card.id === cardId)
      if (cardIndex >= 0) {
        cardToMove = { ...stage.cards[cardIndex], stageId: targetStageId }
        return {
          ...stage,
          cards: stage.cards.filter(card => card.id !== cardId)
        }
      }
      return stage
    }))

    // Adiciona card no novo estágio
    if (cardToMove) {
      setStages(prev => prev.map(stage => 
        stage.id === targetStageId 
          ? { ...stage, cards: [...stage.cards, cardToMove!] }
          : stage
      ))
    }
  }

  const handleDeleteCard = (cardId: number) => {
    setStages(prev => prev.map(stage => ({
      ...stage,
      cards: stage.cards.filter(card => card.id !== cardId)
    })))
    toast.success("Oportunidade excluída com sucesso!")
  }

  const handleUpdateStages = (newStages: Stage[]) => {
    setStages(newStages)
    toast.success("Estágios atualizados com sucesso!")
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div>
          <h1 className="text-2xl font-bold">Kanban Comercial</h1>
          <p className="text-muted-foreground">Gerencie suas oportunidades de negócio</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowConfiguracoes(true)}
            className="gap-2"
          >
            <Settings className="h-4 w-4" />
            Configurações
          </Button>
          <Button 
            onClick={() => alert("Nova oportunidade - funcionalidade em desenvolvimento")}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Nova Oportunidade
          </Button>
        </div>
      </div>

      {/* Métricas */}
      <div className="p-6">
        <KanbanMetrics stages={stages} />
      </div>

      {/* Board */}
      <div className="flex-1 overflow-hidden">
        <KanbanBoard
          stages={stages}
          onAddCard={handleAddCard}
          onUpdateCard={handleUpdateCard}
          onMoveCard={handleMoveCard}
          onDeleteCard={handleDeleteCard}
        />
      </div>

      {/* Dialogs */}
      <KanbanConfigDialog
        open={showConfiguracoes}
        onOpenChange={setShowConfiguracoes}
        stages={stages}
        onUpdateStages={handleUpdateStages}
      />
    </div>
  )
}
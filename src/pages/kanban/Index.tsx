import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { KanbanBoard } from "@/components/kanban/KanbanBoard"
import { KanbanMetrics } from "@/components/kanban/KanbanMetrics"
import { KanbanConfigDialog } from "@/components/dialogs/KanbanConfigDialog"
import { BoardSelector } from "@/components/kanban/BoardSelector"
import { BoardDialog } from "@/components/dialogs/BoardDialog"
import { toast } from "sonner"
import type { Stage, KanbanCard, KanbanBoard as KanbanBoardType } from "@/types/kanban"

// Mock data - em produção viria de uma API
const defaultStages: Stage[] = [
  {
    id: 1,
    nome: "Leads",
    ordem: 1,
    cor: "#3B82F6",
    cards: []
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

const initialBoards: KanbanBoardType[] = [
  {
    id: 1,
    nome: "Kanban Comercial",
    descricao: "Quadro principal para oportunidades de negócio",
    stages: [
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
            anexos: 0,
            comentarios: [],
            atividades: [],
            servicos: [],
            stageId: 1,
            createdAt: "2024-01-10",
            updatedAt: "2024-01-10",
            status: "quente"
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
    ],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  }
]

export default function KanbanIndex() {
  const [boards, setBoards] = useState<KanbanBoardType[]>(initialBoards)
  const [selectedBoard, setSelectedBoard] = useState<KanbanBoardType | null>(initialBoards[0])
  const [showConfiguracoes, setShowConfiguracoes] = useState(false)
  const [showBoardDialog, setShowBoardDialog] = useState(false)
  const [editingBoard, setEditingBoard] = useState<KanbanBoardType | null>(null)

  const handleAddCard = (cardData: any) => {
    if (!selectedBoard) return

    const newCard: KanbanCard = {
      id: Date.now(),
      ...cardData,
      anexos: 0,
      comentarios: [],
      atividades: [],
      servicos: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setBoards(prev => prev.map(board => 
      board.id === selectedBoard.id 
        ? {
            ...board,
            stages: board.stages.map(stage => 
              stage.id === cardData.stageId 
                ? { ...stage, cards: [...stage.cards, newCard] }
                : stage
            )
          }
        : board
    ))

    // Atualiza o board selecionado
    setSelectedBoard(prev => prev ? {
      ...prev,
      stages: prev.stages.map(stage => 
        stage.id === cardData.stageId 
          ? { ...stage, cards: [...stage.cards, newCard] }
          : stage
      )
    } : null)

    toast.success("Oportunidade criada com sucesso!")
  }

  const handleUpdateCard = (cardId: number, updatedData: Partial<KanbanCard>) => {
    if (!selectedBoard) return

    setBoards(prev => prev.map(board => 
      board.id === selectedBoard.id 
        ? {
            ...board,
            stages: board.stages.map(stage => ({
              ...stage,
              cards: stage.cards.map(card => 
                card.id === cardId 
                  ? { ...card, ...updatedData, updatedAt: new Date().toISOString() }
                  : card
              )
            }))
          }
        : board
    ))

    setSelectedBoard(prev => prev ? {
      ...prev,
      stages: prev.stages.map(stage => ({
        ...stage,
        cards: stage.cards.map(card => 
          card.id === cardId 
            ? { ...card, ...updatedData, updatedAt: new Date().toISOString() }
            : card
        )
      }))
    } : null)
  }

  const handleMoveCard = (cardId: number, targetStageId: number) => {
    if (!selectedBoard) return

    let cardToMove: KanbanCard | null = null
    
    // Atualiza boards
    setBoards(prev => prev.map(board => {
      if (board.id !== selectedBoard.id) return board

      let updatedStages = [...board.stages]
      
      // Remove card do estágio atual
      updatedStages = updatedStages.map(stage => {
        const cardIndex = stage.cards.findIndex(card => card.id === cardId)
        if (cardIndex >= 0) {
          cardToMove = { ...stage.cards[cardIndex], stageId: targetStageId }
          return {
            ...stage,
            cards: stage.cards.filter(card => card.id !== cardId)
          }
        }
        return stage
      })

      // Adiciona card no novo estágio
      if (cardToMove) {
        updatedStages = updatedStages.map(stage => 
          stage.id === targetStageId 
            ? { ...stage, cards: [...stage.cards, cardToMove!] }
            : stage
        )
      }

      return { ...board, stages: updatedStages }
    }))

    // Atualiza selectedBoard
    if (cardToMove) {
      setSelectedBoard(prev => prev ? {
        ...prev,
        stages: prev.stages.map(stage => {
          const cardIndex = stage.cards.findIndex(card => card.id === cardId)
          if (cardIndex >= 0) {
            return {
              ...stage,
              cards: stage.cards.filter(card => card.id !== cardId)
            }
          }
          if (stage.id === targetStageId) {
            return { ...stage, cards: [...stage.cards, cardToMove!] }
          }
          return stage
        })
      } : null)
    }
  }

  const handleDeleteCard = (cardId: number) => {
    if (!selectedBoard) return

    setBoards(prev => prev.map(board => 
      board.id === selectedBoard.id 
        ? {
            ...board,
            stages: board.stages.map(stage => ({
              ...stage,
              cards: stage.cards.filter(card => card.id !== cardId)
            }))
          }
        : board
    ))

    setSelectedBoard(prev => prev ? {
      ...prev,
      stages: prev.stages.map(stage => ({
        ...stage,
        cards: stage.cards.filter(card => card.id !== cardId)
      }))
    } : null)

    toast.success("Oportunidade excluída com sucesso!")
  }

  const handleUpdateStages = (newStages: Stage[]) => {
    if (!selectedBoard) return

    setBoards(prev => prev.map(board => 
      board.id === selectedBoard.id 
        ? { ...board, stages: newStages }
        : board
    ))

    setSelectedBoard(prev => prev ? { ...prev, stages: newStages } : null)
    toast.success("Estágios atualizados com sucesso!")
  }

  const handleCreateBoard = () => {
    setEditingBoard(null)
    setShowBoardDialog(true)
  }

  const handleEditBoard = (board: KanbanBoardType) => {
    setEditingBoard(board)
    setShowBoardDialog(true)
  }

  const handleSaveBoard = (boardData: Omit<KanbanBoardType, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingBoard) {
      // Editando board existente
      setBoards(prev => prev.map(board => 
        board.id === editingBoard.id 
          ? { 
              ...board, 
              nome: boardData.nome,
              descricao: boardData.descricao,
              updatedAt: new Date().toISOString()
            }
          : board
      ))
      
      if (selectedBoard?.id === editingBoard.id) {
        setSelectedBoard(prev => prev ? {
          ...prev,
          nome: boardData.nome,
          descricao: boardData.descricao
        } : null)
      }
      
      toast.success("Quadro atualizado com sucesso!")
    } else {
      // Criando novo board
      const newBoard: KanbanBoardType = {
        id: Date.now(),
        ...boardData,
        stages: [...defaultStages],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      setBoards(prev => [...prev, newBoard])
      toast.success("Quadro criado com sucesso!")
    }
  }

  const handleDeleteBoard = (board: KanbanBoardType) => {
    if (boards.length <= 1) {
      toast.error("Não é possível excluir o último quadro!")
      return
    }

    setBoards(prev => prev.filter(b => b.id !== board.id))
    
    if (selectedBoard?.id === board.id) {
      setSelectedBoard(boards.find(b => b.id !== board.id) || null)
    }
    
    toast.success("Quadro excluído com sucesso!")
  }

  const handleConfigureBoard = (board: KanbanBoardType) => {
    setSelectedBoard(board)
    setShowConfiguracoes(true)
  }

  if (!selectedBoard) {
    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h1 className="text-2xl font-bold">Tarefas</h1>
            <p className="text-muted-foreground">Gerencie seus quadros kanban</p>
          </div>
        </div>

        {/* Board Selector */}
        <div className="flex-1 p-6">
          <BoardSelector
            boards={boards}
            selectedBoard={selectedBoard}
            onSelectBoard={setSelectedBoard}
            onCreateBoard={handleCreateBoard}
            onEditBoard={handleEditBoard}
            onDeleteBoard={handleDeleteBoard}
            onConfigureBoard={handleConfigureBoard}
          />
        </div>

        {/* Dialogs */}
        <BoardDialog
          open={showBoardDialog}
          onOpenChange={setShowBoardDialog}
          board={editingBoard}
          onSave={handleSaveBoard}
        />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedBoard(null)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{selectedBoard.nome}</h1>
            <p className="text-muted-foreground">{selectedBoard.descricao || "Gerencie suas oportunidades de negócio"}</p>
          </div>
        </div>
      </div>

      {/* Métricas */}
      <div className="p-6">
        <KanbanMetrics stages={selectedBoard.stages} />
      </div>

      {/* Board */}
      <div className="flex-1 overflow-hidden">
        <KanbanBoard
          stages={selectedBoard.stages}
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
        stages={selectedBoard.stages}
        onUpdateStages={handleUpdateStages}
      />

      <BoardDialog
        open={showBoardDialog}
        onOpenChange={setShowBoardDialog}
        board={editingBoard}
        onSave={handleSaveBoard}
      />
    </div>
  )
}
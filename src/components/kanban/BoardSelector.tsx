import { useState } from "react"
import { Plus, Settings, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { KanbanBoard } from "@/types/kanban"

interface BoardSelectorProps {
  boards: KanbanBoard[]
  selectedBoard: KanbanBoard | null
  onSelectBoard: (board: KanbanBoard) => void
  onCreateBoard: () => void
  onEditBoard: (board: KanbanBoard) => void
  onDeleteBoard: (board: KanbanBoard) => void
  onConfigureBoard: (board: KanbanBoard) => void
}

export const BoardSelector = ({
  boards,
  selectedBoard,
  onSelectBoard,
  onCreateBoard,
  onEditBoard,
  onDeleteBoard,
  onConfigureBoard
}: BoardSelectorProps) => {
  const getTotalCards = (board: KanbanBoard) => {
    return board.stages.reduce((total, stage) => total + stage.cards.length, 0)
  }

  const getTotalValue = (board: KanbanBoard) => {
    return board.stages.reduce((total, stage) => 
      total + stage.cards.reduce((stageTotal, card) => stageTotal + card.valor, 0), 0
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Card para criar novo quadro */}
      <Card 
        className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer group"
        onClick={onCreateBoard}
      >
        <CardContent className="flex flex-col items-center justify-center h-40 p-6">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold text-center mb-1">Criar Novo Quadro</h3>
          <p className="text-sm text-muted-foreground text-center">
            Adicione um novo quadro kanban
          </p>
        </CardContent>
      </Card>

      {/* Cards dos quadros existentes */}
      {boards.map((board) => (
        <Card 
          key={board.id} 
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedBoard?.id === board.id ? 'border-primary shadow-sm' : ''
          }`}
          onClick={() => onSelectBoard(board)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{board.nome}</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onConfigureBoard(board)}>
                    <Settings className="h-4 w-4 mr-2" />
                    Configurar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEditBoard(board)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => onDeleteBoard(board)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {board.descricao && (
              <p className="text-sm text-muted-foreground">{board.descricao}</p>
            )}
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Badge variant="secondary">
                  {getTotalCards(board)} cards
                </Badge>
                <Badge variant="outline">
                  {board.stages.length} estágios
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  R$ {getTotalValue(board).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { KanbanBoard } from "@/types/kanban"

interface BoardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  board?: KanbanBoard | null
  onSave: (boardData: Omit<KanbanBoard, 'id' | 'createdAt' | 'updatedAt'>) => void
}

export const BoardDialog = ({ open, onOpenChange, board, onSave }: BoardDialogProps) => {
  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")

  useEffect(() => {
    if (board) {
      setNome(board.nome)
      setDescricao(board.descricao || "")
    } else {
      setNome("")
      setDescricao("")
    }
  }, [board, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nome.trim()) return

    onSave({
      nome: nome.trim(),
      descricao: descricao.trim(),
      stages: board?.stages || []
    })

    onOpenChange(false)
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {board ? "Editar Quadro" : "Criar Novo Quadro"}
          </DialogTitle>
          <DialogDescription>
            {board 
              ? "Edite as informações do quadro kanban." 
              : "Crie um novo quadro kanban para organizar suas tarefas."
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Quadro</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Vendas Q1 2024"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição (opcional)</Label>
            <Textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva o propósito deste quadro..."
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {board ? "Atualizar" : "Criar"} Quadro
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { 
  Plus, 
  X, 
  Calendar as CalendarIcon, 
  User, 
  Tag,
  Trash2
} from "lucide-react"
import type { KanbanCard } from "@/types/kanban"

const CORES_LABELS = [
  { cor: "#10b981", nome: "Verde" },
  { cor: "#3b82f6", nome: "Azul" },
  { cor: "#f59e0b", nome: "Amarelo" },
  { cor: "#ef4444", nome: "Vermelho" },
  { cor: "#8b5cf6", nome: "Roxo" },
  { cor: "#6b7280", nome: "Cinza" }
]

const MEMBROS_DISPONIVEIS = [
  "João Silva",
  "Maria Santos", 
  "Ana Costa",
  "Pedro Lima",
  "Carla Ferreira",
  "Bruno Oliveira"
]

interface CardEditActionsProps {
  card: KanbanCard
  onUpdate: (updates: Partial<KanbanCard>) => void
  onDelete?: () => void
}

export const CardEditActions = ({ card, onUpdate, onDelete }: CardEditActionsProps) => {
  const [novaLabel, setNovaLabel] = useState("")
  const [corSelecionada, setCorSelecionada] = useState(CORES_LABELS[0].cor)

  const adicionarLabel = () => {
    if (!novaLabel.trim()) return
    
    const labels = card.labels || []
    if (!labels.includes(novaLabel)) {
      onUpdate({
        labels: [...labels, novaLabel]
      })
    }
    setNovaLabel("")
  }

  const removerLabel = (label: string) => {
    const labels = card.labels || []
    onUpdate({
      labels: labels.filter(l => l !== label)
    })
  }

  const adicionarMembro = (membro: string) => {
    const membros = card.membros || []
    if (!membros.includes(membro)) {
      onUpdate({
        membros: [...membros, membro]
      })
    }
  }

  const removerMembro = (membro: string) => {
    const membros = card.membros || []
    onUpdate({
      membros: membros.filter(m => m !== membro)
    })
  }

  const definirDataVencimento = (data: Date | undefined) => {
    onUpdate({
      dataVencimento: data?.toISOString()
    })
  }

  const incrementarAnexos = () => {
    onUpdate({
      anexos: (card.anexos || 0) + 1
    })
  }

  return (
    <div className="space-y-4">
      {/* Adicionar aos Cards */}
      <div>
        <h4 className="font-medium text-sm mb-3">Adicionar ao Card</h4>
        <div className="space-y-2">
          
          {/* Membros */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <User className="w-4 h-4 mr-2" />
                Membros
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="space-y-3">
                <h4 className="font-medium">Membros</h4>
                
                {/* Membros atuais */}
                {card.membros && card.membros.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-600">Membros atuais:</p>
                    {card.membros.map((membro) => (
                      <div key={membro} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs">
                              {membro.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{membro}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => removerMembro(membro)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Adicionar membros */}
                <div className="space-y-2">
                  <p className="text-xs text-gray-600">Adicionar membro:</p>
                  {MEMBROS_DISPONIVEIS
                    .filter(membro => !card.membros?.includes(membro))
                    .map((membro) => (
                      <Button
                        key={membro}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => adicionarMembro(membro)}
                      >
                        <Avatar className="w-6 h-6 mr-2">
                          <AvatarFallback className="text-xs">
                            {membro.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {membro}
                      </Button>
                    ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Labels */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Tag className="w-4 h-4 mr-2" />
                Labels
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="space-y-3">
                <h4 className="font-medium">Labels</h4>
                
                {/* Labels atuais */}
                {card.labels && card.labels.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-600">Labels atuais:</p>
                    <div className="flex flex-wrap gap-1">
                      {card.labels.map((label) => (
                        <Badge 
                          key={label} 
                          variant="secondary" 
                          className="text-xs flex items-center gap-1"
                        >
                          {label}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-3 w-3 p-0 hover:bg-transparent"
                            onClick={() => removerLabel(label)}
                          >
                            <X className="w-2 h-2" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Adicionar nova label */}
                <div className="space-y-2">
                  <p className="text-xs text-gray-600">Nova label:</p>
                  <div className="flex gap-2">
                    <div 
                      className="w-6 h-6 rounded"
                      style={{ backgroundColor: corSelecionada }}
                    />
                    <Input
                      placeholder="Nome da label"
                      value={novaLabel}
                      onChange={(e) => setNovaLabel(e.target.value)}
                      className="flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && adicionarLabel()}
                    />
                  </div>
                  <div className="flex gap-1">
                    {CORES_LABELS.map((cor) => (
                      <button
                        key={cor.cor}
                        className={`w-6 h-6 rounded cursor-pointer border-2 ${
                          corSelecionada === cor.cor ? 'border-gray-800' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: cor.cor }}
                        onClick={() => setCorSelecionada(cor.cor)}
                      />
                    ))}
                  </div>
                  <Button 
                    size="sm" 
                    onClick={adicionarLabel}
                    disabled={!novaLabel.trim()}
                    className="w-full"
                  >
                    Adicionar Label
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Data de Vencimento */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Data de vencimento
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={card.dataVencimento ? new Date(card.dataVencimento) : undefined}
                onSelect={definirDataVencimento}
                initialFocus
              />
              {card.dataVencimento && (
                <div className="p-3 border-t">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => definirDataVencimento(undefined)}
                    className="w-full"
                  >
                    Remover data
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>

          {/* Anexos (simulado) */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start"
            onClick={incrementarAnexos}
          >
            <Plus className="w-4 h-4 mr-2" />
            Anexo ({card.anexos || 0})
          </Button>
        </div>
      </div>

      {/* Ações */}
      {onDelete && (
        <div>
          <h4 className="font-medium text-sm mb-3">Ações</h4>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                size="sm" 
                className="w-full justify-start"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir card
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir este card? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  )
}
import { useState } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { EditableText } from "@/components/ui/editable-text"
import { CardEditActions } from "@/components/kanban/CardEditActions"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { 
  MessageSquare, 
  Send, 
  User, 
  Calendar,
  MapPin,
  Activity,
  X,
  Trash2,
  Plus,
  Package,
  Reply
} from "lucide-react"
import type { KanbanCard, Stage, Comentario, ServicoItem } from "@/types/kanban"

interface Produto {
  id: number
  nome: string
  preco: number
  categoria: string
}

interface ComentarioComResposta extends Comentario {
  respostas?: Comentario[]
  respondendoA?: number
}

interface CardDetailsDialogProps {
  card: KanbanCard
  stages: Stage[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (cardId: number, updatedData: Partial<KanbanCard>) => void
  onDelete?: (cardId: number) => void
}

export const CardDetailsDialog = ({ 
  card, 
  stages, 
  open, 
  onOpenChange, 
  onUpdate,
  onDelete 
}: CardDetailsDialogProps) => {
  const [novoComentario, setNovoComentario] = useState("")
  const [comentarios, setComentarios] = useState<Comentario[]>(card.comentarios || [])
  const [servicos, setServicos] = useState<ServicoItem[]>(card.servicos || [])
  const [respondiendoA, setRespondiendoA] = useState<number | null>(null)
  const [textoResposta, setTextoResposta] = useState("")
  const [produtos] = useLocalStorage<Produto[]>("produtos", [
    { id: 1, nome: "Consultoria Especializada", preco: 150, categoria: "Consultoria" },
    { id: 2, nome: "Desenvolvimento Sistema", preco: 300, categoria: "Desenvolvimento" },
    { id: 3, nome: "Treinamento Equipe", preco: 80, categoria: "Treinamento" },
    { id: 4, nome: "Manutenção Mensal", preco: 200, categoria: "Suporte" }
  ])
  const [novoServico, setNovoServico] = useState({ produtoId: "", quantidade: 1 })

  const adicionarComentario = () => {
    if (!novoComentario.trim()) return

    const comentario: Comentario = {
      id: Date.now(),
      autor: "Usuário Atual",
      texto: novoComentario,
      createdAt: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      tipo: 'comentario'
    }

    const novosComentarios = [...comentarios, comentario]
    setComentarios(novosComentarios)
    
    const atividadeComentario: Comentario = {
      id: Date.now() + 1,
      autor: "Sistema",
      texto: "adicionou um comentário",
      createdAt: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      tipo: 'atividade',
      icone: 'MessageSquare'
    }
    
    const comentariosComAtividade = [...novosComentarios, atividadeComentario]
    
    onUpdate(card.id, { comentarios: comentariosComAtividade })
    setNovoComentario("")
  }

  const responderComentario = (comentarioId: number) => {
    if (!textoResposta.trim()) return

    const resposta: Comentario = {
      id: Date.now(),
      autor: "Usuário Atual",
      texto: textoResposta,
      createdAt: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      tipo: 'comentario'
    }

    const novosComentarios = [...comentarios, resposta]
    setComentarios(novosComentarios)
    onUpdate(card.id, { comentarios: novosComentarios })
    
    setTextoResposta("")
    setRespondiendoA(null)
  }

  const adicionarAtividade = (texto: string, icone?: string) => {
    const atividade: Comentario = {
      id: Date.now(),
      autor: "Sistema",
      texto,
      createdAt: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      tipo: 'atividade',
      icone
    }

    const novosComentarios = [...comentarios, atividade]
    setComentarios(novosComentarios)
    onUpdate(card.id, { comentarios: novosComentarios })
  }

  const formatarData = (timestamp: string) => {
    const data = new Date(timestamp)
    const agora = new Date()
    const diffHoras = Math.floor((agora.getTime() - data.getTime()) / (1000 * 60 * 60))
    
    if (diffHoras < 1) {
      return "há poucos minutos"
    } else if (diffHoras < 24) {
      return `há ${diffHoras} hora${diffHoras > 1 ? 's' : ''}`
    } else {
      return data.toLocaleDateString('pt-BR')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "quente": return "bg-red-500"
      case "morno": return "bg-yellow-500" 
      case "frio": return "bg-blue-500"
      case "perdido": return "bg-gray-500"
      default: return "bg-gray-400"
    }
  }

  const handleStatusChange = (novoStatus: string) => {
    onUpdate(card.id, { status: novoStatus })
    adicionarAtividade(`alterou o status para ${novoStatus}`, 'Activity')
  }

  const adicionarServico = () => {
    if (!novoServico.produtoId) return
    
    const produto = produtos.find(p => p.id === parseInt(novoServico.produtoId))
    if (!produto) return

    const novoServicoItem: ServicoItem = {
      id: Date.now(),
      nome: produto.nome,
      produtoId: produto.id,
      produto: produto.nome,
      valor: produto.preco,
      quantidade: novoServico.quantidade
    }

    const novosServicos = [...servicos, novoServicoItem]
    setServicos(novosServicos)
    
    const novoValorTotal = novosServicos.reduce((total, s) => total + (s.valor * s.quantidade), 0)
    onUpdate(card.id, { servicos: novosServicos, valor: novoValorTotal })
    
    setNovoServico({ produtoId: "", quantidade: 1 })
    adicionarAtividade(`adicionou o produto ${produto.nome}`, 'Package')
  }

  const removerServico = (servicoId: number) => {
    const novosServicos = servicos.filter(s => s.id !== servicoId)
    setServicos(novosServicos)
    
    const novoValorTotal = novosServicos.reduce((total, s) => total + (s.valor * s.quantidade), 0)
    onUpdate(card.id, { servicos: novosServicos, valor: novoValorTotal })
    
    adicionarAtividade("removeu um produto", 'Trash2')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0 flex flex-col">
        <div className="flex h-full min-h-[70vh]">
          {/* Área principal com scroll */}
          <div className="flex-1 flex flex-col">
            {/* Header fixo */}
            <div className="p-6 border-b bg-white">
              <DialogHeader>
                <EditableText
                  value={card.cliente}
                  onSave={(newValue) => onUpdate(card.id, { cliente: newValue })}
                  placeholder="Nome do cliente"
                  className="text-xl font-semibold"
                />
                <p className="text-sm text-gray-600 mt-2">
                  na lista <span className="font-medium">
                    {stages.find(s => s.id === card.id)?.nome}
                  </span>
                </p>
              </DialogHeader>

              {/* Labels editáveis */}
              {card.labels && card.labels.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {card.labels.map((label, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {label}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Conteúdo com scroll */}
            <div className="flex-1 p-6 overflow-y-auto">
              {/* Descrição editável */}
              <div className="mb-6">
                <h3 className="font-medium flex items-center gap-2 mb-3">
                  <User className="w-4 h-4" />
                  Descrição
                </h3>
                <EditableText
                  value={card.descricao}
                  onSave={(newValue) => onUpdate(card.id, { descricao: newValue })}
                  placeholder="Adicione uma descrição mais detalhada..."
                  multiline
                  className="bg-gray-50 rounded-lg p-4"
                />
              </div>

              {/* Serviços */}
              <div className="mb-6">
                <h3 className="font-medium flex items-center gap-2 mb-3">
                  <Package className="w-4 h-4" />
                  Produtos/Serviços
                </h3>
                
                {/* Adicionar novo serviço */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-12 gap-3 items-end">
                    <div className="col-span-7">
                      <Label htmlFor="produto" className="text-sm font-medium">Produto</Label>
                      <Select value={novoServico.produtoId} onValueChange={(value) => setNovoServico(prev => ({ ...prev, produtoId: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um produto" />
                        </SelectTrigger>
                        <SelectContent>
                          {produtos.map((produto) => (
                            <SelectItem key={produto.id} value={produto.id.toString()}>
                              {produto.nome} - R$ {produto.preco.toFixed(2)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-3">
                      <Label htmlFor="quantidade" className="text-sm font-medium">Qtd</Label>
                      <Input
                        type="number"
                        min="1"
                        value={novoServico.quantidade}
                        onChange={(e) => setNovoServico(prev => ({ ...prev, quantidade: parseInt(e.target.value) || 1 }))}
                      />
                    </div>
                    <div className="col-span-2">
                      <Button 
                        onClick={adicionarServico} 
                        disabled={!novoServico.produtoId}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Lista de serviços */}
                {servicos.length > 0 && (
                  <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-2 bg-white">
                    {servicos.map((servico) => (
                      <div key={servico.id} className="flex justify-between items-center py-2 px-3 bg-gray-50 border rounded group">
                        <div className="flex-1">
                          <span className="text-sm font-medium">{servico.produto}</span>
                          <div className="text-xs text-gray-500">
                            {servico.quantidade}x R$ {servico.valor.toFixed(2)} = R$ {(servico.quantidade * servico.valor).toFixed(2)}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removerServico(servico.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Comentários e Atividades */}
              <div className="mb-6">
                <h3 className="font-medium flex items-center gap-2 mb-4">
                  <Activity className="w-4 h-4" />
                  Atividade
                </h3>
                
                {/* Adicionar comentário */}
                <div className="flex gap-3 mb-4">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>UC</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Escreva um comentário..."
                      value={novoComentario}
                      onChange={(e) => setNovoComentario(e.target.value)}
                      className="resize-none"
                      rows={2}
                    />
                    <div className="flex justify-end mt-2">
                      <Button 
                        size="sm" 
                        onClick={adicionarComentario}
                        disabled={!novoComentario.trim()}
                      >
                        <Send className="w-3 h-3 mr-1" />
                        Comentar
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Lista de comentários e atividades com scroll */}
                <div className="space-y-4 max-h-96 overflow-y-auto border rounded-lg p-4 bg-white">
                  {comentarios
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>
                            {item.tipo === 'atividade' ? 'S' : item.autor.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{item.autor}</span>
                            <span className="text-xs text-gray-500">
                              {formatarData(item.timestamp)}
                            </span>
                          </div>
                          {item.tipo === 'comentario' ? (
                            <div className="group">
                              <div className="bg-gray-50 border rounded-lg p-3 shadow-sm">
                                <p className="text-sm text-gray-700">{item.texto}</p>
                              </div>
                              <div className="flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs"
                                  onClick={() => setRespondiendoA(item.id)}
                                >
                                  <Reply className="w-3 h-3 mr-1" />
                                  Responder
                                </Button>
                              </div>
                              
                              {/* Campo de resposta */}
                              {respondiendoA === item.id && (
                                <div className="mt-3 ml-4 border-l-2 border-gray-200 pl-4">
                                  <div className="flex gap-2">
                                    <Avatar className="w-6 h-6">
                                      <AvatarFallback className="text-xs">UC</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <Textarea
                                        placeholder="Escreva uma resposta..."
                                        value={textoResposta}
                                        onChange={(e) => setTextoResposta(e.target.value)}
                                        className="resize-none text-sm"
                                        rows={2}
                                      />
                                      <div className="flex justify-end gap-2 mt-2">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => {
                                            setRespondiendoA(null)
                                            setTextoResposta("")
                                          }}
                                        >
                                          Cancelar
                                        </Button>
                                        <Button
                                          size="sm"
                                          onClick={() => responderComentario(item.id)}
                                          disabled={!textoResposta.trim()}
                                        >
                                          <Send className="w-3 h-3 mr-1" />
                                          Responder
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-600 italic">
                              {item.icone && <MessageSquare className="w-3 h-3 inline mr-1" />}
                              {item.texto}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Footer fixo com status */}
            <div className="p-6 border-t bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="status" className="text-sm font-medium">Status:</Label>
                    <Select value={card.status} onValueChange={handleStatusChange}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quente">🔥 Quente</SelectItem>
                        <SelectItem value="morno">🟡 Morno</SelectItem>
                        <SelectItem value="frio">🔵 Frio</SelectItem>
                        <SelectItem value="perdido">⚫ Perdido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Badge variant="secondary" className="text-lg font-semibold px-4 py-2">
                  R$ {card.valor.toFixed(2)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Sidebar de ações */}
          <div className="w-72 border-l bg-gray-50/50 p-4">
            <CardEditActions
              card={card}
              onUpdate={(updates) => onUpdate(card.id, updates)}
              onDelete={onDelete ? () => {
                onDelete(card.id)
                onOpenChange(false)
              } : undefined}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
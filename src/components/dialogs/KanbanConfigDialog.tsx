import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, Settings, GripVertical } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import type { Stage } from "@/types/kanban"

interface KanbanConfigDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  stages: Stage[]
  onUpdateStages: (stages: Stage[]) => void
}

const coresDisponiveis = [
  { cor: "#6b7280", nome: "Cinza" },
  { cor: "#f59e0b", nome: "Âmbar" },
  { cor: "#3b82f6", nome: "Azul" },
  { cor: "#10b981", nome: "Verde" },
  { cor: "#ef4444", nome: "Vermelho" },
  { cor: "#8b5cf6", nome: "Violeta" },
  { cor: "#f97316", nome: "Laranja" },
  { cor: "#06b6d4", nome: "Ciano" },
]

export function KanbanConfigDialog({ open, onOpenChange, stages, onUpdateStages }: KanbanConfigDialogProps) {
  const [localStages, setLocalStages] = useState<Stage[]>(stages)
  const [editingStage, setEditingStage] = useState<Stage | null>(null)
  const [newStageName, setNewStageName] = useState("")
  const [newStageCor, setNewStageCor] = useState("#6b7280")

  const handleAddStage = () => {
    if (!newStageName.trim()) {
      toast.error("Nome do estágio é obrigatório")
      return
    }

    const newStage: Stage = {
      id: Math.max(...localStages.map(s => s.id), 0) + 1,
      nome: newStageName.trim(),
      ordem: localStages.length + 1,
      cor: newStageCor,
      cards: []
    }

    setLocalStages([...localStages, newStage])
    setNewStageName("")
    setNewStageCor("#6b7280")
    toast.success("Estágio adicionado com sucesso!")
  }

  const handleEditStage = (stage: Stage) => {
    setEditingStage(stage)
  }

  const handleUpdateStage = (updatedStage: Stage) => {
    setLocalStages(localStages.map(stage => 
      stage.id === updatedStage.id ? updatedStage : stage
    ))
    setEditingStage(null)
    toast.success("Estágio atualizado com sucesso!")
  }

  const handleDeleteStage = (stageId: number) => {
    const stage = localStages.find(s => s.id === stageId)
    if (stage && stage.cards.length > 0) {
      toast.error("Não é possível excluir um estágio que possui cards")
      return
    }

    setLocalStages(localStages.filter(stage => stage.id !== stageId))
    toast.success("Estágio excluído com sucesso!")
  }

  const handleSaveChanges = () => {
    onUpdateStages(localStages)
    onOpenChange(false)
    toast.success("Configurações salvas com sucesso!")
  }

  const moveStage = (fromIndex: number, toIndex: number) => {
    const updatedStages = [...localStages]
    const [moved] = updatedStages.splice(fromIndex, 1)
    updatedStages.splice(toIndex, 0, moved)
    
    // Reordenar
    const reorderedStages = updatedStages.map((stage, index) => ({
      ...stage,
      ordem: index + 1
    }))
    
    setLocalStages(reorderedStages)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações do Kanban
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="estagios" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="estagios">Estágios do Pipeline</TabsTrigger>
            <TabsTrigger value="acoes">Ações dos Cards</TabsTrigger>
            <TabsTrigger value="configuracoes">Configurações Gerais</TabsTrigger>
          </TabsList>

          <TabsContent value="estagios" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Adicionar Novo Estágio</CardTitle>
                <CardDescription>
                  Crie novos estágios para o pipeline de vendas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="novo-estagio">Nome do Estágio</Label>
                    <Input
                      id="novo-estagio"
                      value={newStageName}
                      onChange={(e) => setNewStageName(e.target.value)}
                      placeholder="Ex: Qualificação"
                    />
                  </div>
                  <div>
                    <Label>Cor do Estágio</Label>
                    <div className="flex gap-2 mt-2">
                      {coresDisponiveis.map((cor) => (
                        <button
                          key={cor.cor}
                          className={`w-6 h-6 rounded-full border-2 ${
                            newStageCor === cor.cor ? 'border-foreground' : 'border-muted'
                          }`}
                          style={{ backgroundColor: cor.cor }}
                          onClick={() => setNewStageCor(cor.cor)}
                          title={cor.nome}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleAddStage} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estágios Existentes</CardTitle>
                <CardDescription>
                  Gerencie os estágios do seu pipeline de vendas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {localStages
                    .sort((a, b) => a.ordem - b.ordem)
                    .map((stage, index) => (
                    <div
                      key={stage.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          className="cursor-grab"
                          onMouseDown={() => {
                            // Implementar drag and drop aqui se necessário
                          }}
                        >
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: stage.cor }}
                        />
                        <div>
                          <p className="font-medium">{stage.nome}</p>
                          <p className="text-sm text-muted-foreground">
                            {stage.cards.length} cards
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          Ordem: {stage.ordem}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditStage(stage)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteStage(stage.id)}
                          disabled={stage.cards.length > 0}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="acoes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ações dos Cards</CardTitle>
                <CardDescription>
                  Configure as ações rápidas disponíveis nos cards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Esta funcionalidade será implementada em breve.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="configuracoes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
                <CardDescription>
                  Configurações gerais do quadro Kanban
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Esta funcionalidade será implementada em breve.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Separator />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSaveChanges}>
            Salvar Configurações
          </Button>
        </div>

        {/* Dialog de edição de estágio */}
        {editingStage && (
          <Dialog open={!!editingStage} onOpenChange={() => setEditingStage(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Estágio</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-nome">Nome do Estágio</Label>
                  <Input
                    id="edit-nome"
                    value={editingStage.nome}
                    onChange={(e) => setEditingStage({ ...editingStage, nome: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Cor do Estágio</Label>
                  <div className="flex gap-2 mt-2">
                    {coresDisponiveis.map((cor) => (
                      <button
                        key={cor.cor}
                        className={`w-6 h-6 rounded-full border-2 ${
                          editingStage.cor === cor.cor ? 'border-foreground' : 'border-muted'
                        }`}
                        style={{ backgroundColor: cor.cor }}
                        onClick={() => setEditingStage({ ...editingStage, cor: cor.cor })}
                        title={cor.nome}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setEditingStage(null)}>
                  Cancelar
                </Button>
                <Button onClick={() => handleUpdateStage(editingStage)}>
                  Salvar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  )
}
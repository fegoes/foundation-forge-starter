import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Edit } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface EstagioPipeline {
  id: number
  nome: string
  ordem: number
  cor: string
}

interface EstagioPipelineDialogProps {
  estagio?: EstagioPipeline
  onSave: (estagio: Omit<EstagioPipeline, 'id'> | EstagioPipeline) => void
  isEdit?: boolean
  proximaOrdem?: number
}

const coresDisponiveis = [
  "#6b7280", // gray
  "#f59e0b", // amber
  "#3b82f6", // blue
  "#10b981", // emerald
  "#ef4444", // red
  "#8b5cf6", // violet
  "#f97316", // orange
  "#06b6d4", // cyan
]

export function EstagioPipelineDialog({ estagio, onSave, isEdit = false, proximaOrdem = 1 }: EstagioPipelineDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    nome: estagio?.nome || "",
    ordem: estagio?.ordem || proximaOrdem,
    cor: estagio?.cor || "#6b7280"
  })
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nome) {
      toast({
        title: "Erro",
        description: "Nome do estágio é obrigatório",
        variant: "destructive"
      })
      return
    }

    if (isEdit && estagio) {
      onSave({ ...estagio, ...formData })
    } else {
      onSave(formData)
    }
    
    setOpen(false)
    setFormData({ nome: "", ordem: proximaOrdem, cor: "#6b7280" })
    
    toast({
      title: "Sucesso",
      description: `Estágio ${isEdit ? 'atualizado' : 'criado'} com sucesso!`
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="gap-2" 
          variant={isEdit ? "ghost" : "default"} 
          size={isEdit ? "sm" : "sm"}
        >
          {isEdit ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {isEdit ? "" : "Novo Estágio"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar Estágio" : "Novo Estágio do Pipeline"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              placeholder="Ex: Prospecção, Proposta Enviada..."
            />
          </div>
          <div>
            <Label htmlFor="ordem">Ordem</Label>
            <Input
              id="ordem"
              type="number"
              min="1"
              value={formData.ordem}
              onChange={(e) => setFormData({ ...formData, ordem: parseInt(e.target.value) || 1 })}
            />
          </div>
          <div>
            <Label htmlFor="cor">Cor</Label>
            <div className="flex gap-2 flex-wrap mt-2">
              {coresDisponiveis.map((cor) => (
                <button
                  key={cor}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 ${
                    formData.cor === cor ? 'border-foreground' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: cor }}
                  onClick={() => setFormData({ ...formData, cor })}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEdit ? "Atualizar" : "Criar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
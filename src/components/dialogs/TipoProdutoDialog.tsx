import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TipoProduto {
  id: number
  nome: string
  descricao: string
  ordem: number
  cor: string
}

interface TipoProdutoDialogProps {
  tipo?: TipoProduto
  onSave: (tipo: Omit<TipoProduto, 'id'> | TipoProduto) => void
  isEdit?: boolean
  proximaOrdem?: number
}

const coresDisponiveis = [
  "#3b82f6", // blue
  "#10b981", // emerald
  "#f59e0b", // amber
  "#8b5cf6", // violet
  "#ef4444", // red
  "#f97316", // orange
  "#06b6d4", // cyan
  "#6b7280", // gray
]

export function TipoProdutoDialog({ tipo, onSave, isEdit = false, proximaOrdem = 1 }: TipoProdutoDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    nome: tipo?.nome || "",
    descricao: tipo?.descricao || "",
    ordem: tipo?.ordem || proximaOrdem,
    cor: tipo?.cor || "#3b82f6"
  })
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nome || !formData.descricao) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios",
        variant: "destructive"
      })
      return
    }

    if (isEdit && tipo) {
      onSave({ ...tipo, ...formData })
    } else {
      onSave(formData)
    }
    
    setOpen(false)
    setFormData({ nome: "", descricao: "", ordem: proximaOrdem, cor: "#3b82f6" })
    
    toast({
      title: "Sucesso",
      description: `Tipo ${isEdit ? 'atualizado' : 'criado'} com sucesso!`
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
          {isEdit ? "" : "Novo Tipo"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar Tipo" : "Novo Tipo de Produto/Serviço"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              placeholder="Ex: Software, Serviços, Licenças..."
            />
          </div>
          <div>
            <Label htmlFor="descricao">Descrição *</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Descrição do tipo de produto ou serviço"
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
              placeholder="Ordem de exibição"
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
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useLocalStorage } from "@/hooks/useLocalStorage"

interface TipoProduto {
  id: number
  nome: string
  descricao: string
  ordem: number
  cor: string
}

interface Produto {
  id: number
  nome: string
  descricao: string
  valor: number
  tipo: string
  status: string
}

interface ProdutoDialogProps {
  produto?: Produto
  onSave: (produto: Omit<Produto, 'id'> | Produto) => void
  isEdit?: boolean
}

export function ProdutoDialog({ produto, onSave, isEdit = false }: ProdutoDialogProps) {
  const [open, setOpen] = useState(false)
  const [tiposProdutos] = useLocalStorage<TipoProduto[]>("tiposProdutos", [
    { id: 1, nome: "Software", descricao: "Sistemas e aplicações", ordem: 1, cor: "#3b82f6" },
    { id: 2, nome: "Serviços", descricao: "Prestação de serviços", ordem: 2, cor: "#10b981" }
  ])
  
  const [formData, setFormData] = useState({
    nome: produto?.nome || "",
    descricao: produto?.descricao || "",
    valor: produto?.valor || 0,
    tipo: produto?.tipo || (tiposProdutos[0]?.nome || "Software"),
    status: produto?.status || "Ativo"
  })
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nome || !formData.descricao || formData.valor <= 0) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios e valor deve ser maior que 0",
        variant: "destructive"
      })
      return
    }

    if (isEdit && produto) {
      onSave({ ...produto, ...formData })
    } else {
      onSave(formData)
    }
    
    setOpen(false)
    setFormData({ nome: "", descricao: "", valor: 0, tipo: tiposProdutos[0]?.nome || "Software", status: "Ativo" })
    
    toast({
      title: "Sucesso",
      description: `Produto ${isEdit ? 'atualizado' : 'criado'} com sucesso!`
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={isEdit ? "gap-2" : "gap-2"} variant={isEdit ? "outline" : "default"} size={isEdit ? "sm" : "default"}>
          {isEdit ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {isEdit ? "Editar" : "Novo Produto"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar Produto" : "Novo Produto"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              placeholder="Nome do produto ou serviço"
            />
          </div>
          <div>
            <Label htmlFor="descricao">Descrição *</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Descrição detalhada"
            />
          </div>
          <div>
            <Label htmlFor="valor">Valor (R$) *</Label>
            <Input
              id="valor"
              type="number"
              step="0.01"
              min="0"
              value={formData.valor}
              onChange={(e) => setFormData({ ...formData, valor: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
            />
          </div>
          <div>
            <Label htmlFor="tipo">Tipo</Label>
            <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tiposProdutos.map((tipo) => (
                  <SelectItem key={tipo.id} value={tipo.nome}>
                    {tipo.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
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
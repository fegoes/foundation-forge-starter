import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit3, Palette } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AcaoCard {
  id: number
  nome: string
  ordem: number
  cor: string
}

interface AcaoCardDialogProps {
  acao?: AcaoCard
  onSave: (acaoData: Omit<AcaoCard, 'id'> | AcaoCard) => void
  proximaOrdem?: number
  isEdit?: boolean
}

const cores = [
  { nome: "Azul", valor: "#3b82f6" },
  { nome: "Verde", valor: "#10b981" },
  { nome: "Amarelo", valor: "#f59e0b" },
  { nome: "Vermelho", valor: "#ef4444" },
  { nome: "Roxo", valor: "#8b5cf6" },
  { nome: "Rosa", valor: "#ec4899" },
  { nome: "Cinza", valor: "#6b7280" },
  { nome: "Indigo", valor: "#6366f1" }
]

export const AcaoCardDialog = ({ acao, onSave, proximaOrdem, isEdit }: AcaoCardDialogProps) => {
  const [open, setOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [nome, setNome] = useState(acao?.nome || "")
  const [ordem, setOrdem] = useState(acao?.ordem || proximaOrdem || 1)
  const [cor, setCor] = useState(acao?.cor || cores[0].valor)
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!nome.trim()) {
      toast({
        title: "Erro",
        description: "Nome da ação é obrigatório",
        variant: "destructive"
      })
      return
    }

    const acaoData = {
      nome: nome.trim(),
      ordem,
      cor
    }

    if (isEdit && acao) {
      onSave({ ...acaoData, id: acao.id })
    } else {
      onSave(acaoData)
    }

    // Reset form
    setNome("")
    setOrdem(proximaOrdem || 1)
    setCor(cores[0].valor)
    setCurrentStep(1)
    setOpen(false)

    toast({
      title: isEdit ? "Ação atualizada" : "Ação criada",
      description: isEdit ? "Ação atualizada com sucesso!" : "Nova ação criada com sucesso!"
    })
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen && isEdit && acao) {
      setNome(acao.nome)
      setOrdem(acao.ordem)
      setCor(acao.cor)
    }
    if (!newOpen) {
      setCurrentStep(1)
    }
  }

  const nextStep = () => {
    if (!nome.trim()) {
      toast({
        title: "Erro",
        description: "Nome da ação é obrigatório",
        variant: "destructive"
      })
      return
    }
    setCurrentStep(2)
  }

  const prevStep = () => {
    setCurrentStep(1)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button variant="ghost" size="sm">
            <Edit3 className="h-4 w-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Ação
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar Ação" : "Nova Ação"}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? "Edite as informações da ação" : "Crie uma nova ação para os cards do kanban"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Indicador de Etapas */}
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              1
            </div>
            <div className={`h-1 w-8 ${
              currentStep >= 2 ? 'bg-primary' : 'bg-muted'
            }`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              2
            </div>
          </div>

          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações da Ação</CardTitle>
                <CardDescription>
                  Defina o nome e ordem da ação
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome da Ação *</Label>
                  <Input
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Aguardando contato, Em análise..."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ordem">Ordem</Label>
                  <Input
                    id="ordem"
                    type="number"
                    value={ordem}
                    onChange={(e) => setOrdem(parseInt(e.target.value))}
                    min="1"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Personalização Visual</CardTitle>
                <CardDescription>
                  Escolha uma cor para identificar esta ação
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label>Cor da Ação</Label>
                  <div className="grid grid-cols-4 gap-3">
                    {cores.map((corOption) => (
                      <button
                        key={corOption.valor}
                        type="button"
                        onClick={() => setCor(corOption.valor)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          cor === corOption.valor 
                            ? 'border-primary ring-2 ring-primary/20' 
                            : 'border-border hover:border-muted-foreground'
                        }`}
                      >
                        <div 
                          className="w-full h-8 rounded-md"
                          style={{ backgroundColor: corOption.valor }}
                        />
                        <p className="text-xs mt-1 text-center">{corOption.nome}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: cor }}
                      />
                      <Badge variant="secondary" style={{ backgroundColor: cor + '20', color: cor }}>
                        {nome || "Nome da ação"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <DialogFooter className="flex gap-3">
            {currentStep === 1 ? (
              <Button type="button" onClick={nextStep} className="flex-1">
                Próximo
              </Button>
            ) : (
              <>
                <Button type="button" variant="outline" onClick={prevStep}>
                  Voltar
                </Button>
                <Button type="submit" className="flex-1">
                  {isEdit ? "Atualizar Ação" : "Criar Ação"}
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
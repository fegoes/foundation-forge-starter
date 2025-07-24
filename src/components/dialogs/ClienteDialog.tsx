import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, ChevronRight, ChevronLeft, Building, User, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Cliente {
  id: number
  nome: string
  email: string
  telefone: string
  status: string
  tipo: 'fisica' | 'juridica'
  // Dados para pessoa jurídica
  razaoSocial?: string
  cnpj?: string
  nomeRepresentante?: string
  emailRepresentante?: string
  telefoneRepresentante?: string
  // Dados para pessoa física
  cpf?: string
}

interface ClienteDialogProps {
  cliente?: Cliente
  onSave: (cliente: Omit<Cliente, 'id'> | Cliente) => void
  isEdit?: boolean
}

export function ClienteDialog({ cliente, onSave, isEdit = false }: ClienteDialogProps) {
  const [open, setOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    nome: cliente?.nome || "",
    email: cliente?.email || "",
    telefone: cliente?.telefone || "",
    status: cliente?.status || "Ativo",
    tipo: cliente?.tipo || "fisica" as 'fisica' | 'juridica',
    razaoSocial: cliente?.razaoSocial || "",
    cnpj: cliente?.cnpj || "",
    nomeRepresentante: cliente?.nomeRepresentante || "",
    emailRepresentante: cliente?.emailRepresentante || "",
    telefoneRepresentante: cliente?.telefoneRepresentante || "",
    cpf: cliente?.cpf || ""
  })
  const { toast } = useToast()

  const resetForm = () => {
    setFormData({ 
      nome: "", email: "", telefone: "", status: "Ativo", tipo: "fisica",
      razaoSocial: "", cnpj: "", nomeRepresentante: "", emailRepresentante: "", 
      telefoneRepresentante: "", cpf: ""
    })
    setCurrentStep(1)
  }

  const handleTipoChange = (tipo: 'fisica' | 'juridica') => {
    setFormData({ ...formData, tipo })
    setCurrentStep(1) // Reset to first step when changing type
  }

  const validateStep1Juridica = () => {
    return formData.razaoSocial && formData.cnpj && formData.email
  }

  const validateStep2Juridica = () => {
    return formData.nomeRepresentante && formData.emailRepresentante
  }

  const validateFisica = () => {
    return formData.nome && formData.email && formData.cpf
  }

  const handleNext = () => {
    if (formData.tipo === 'juridica' && currentStep === 1) {
      if (!validateStep1Juridica()) {
        toast({
          title: "Campos obrigatórios",
          description: "Preencha todos os campos obrigatórios da empresa",
          variant: "destructive"
        })
        return
      }
      setCurrentStep(2)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.tipo === 'fisica') {
      if (!validateFisica()) {
        toast({
          title: "Erro",
          description: "Preencha todos os campos obrigatórios",
          variant: "destructive"
        })
        return
      }
    } else {
      if (!validateStep1Juridica() || !validateStep2Juridica()) {
        toast({
          title: "Erro",
          description: "Preencha todos os campos obrigatórios da empresa e representante",
          variant: "destructive"
        })
        return
      }
    }

    if (isEdit && cliente) {
      onSave({ ...cliente, ...formData })
    } else {
      onSave(formData)
    }
    
    setOpen(false)
    resetForm()
    
    toast({
      title: "Sucesso",
      description: `Cliente ${isEdit ? 'atualizado' : 'criado'} com sucesso!`
    })
  }

  const renderStepIndicator = () => {
    if (formData.tipo === 'fisica') return null
    
    return (
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              {currentStep > 1 ? <CheckCircle className="w-4 h-4" /> : <Building className="w-4 h-4" />}
            </div>
            <span className="ml-2 text-sm font-medium">Empresa</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              <User className="w-4 h-4" />
            </div>
            <span className="ml-2 text-sm font-medium">Representante</span>
          </div>
        </div>
      </div>
    )
  }

  const renderPessoaFisica = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Dados Pessoais
        </CardTitle>
        <CardDescription>Informações da pessoa física</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="nome">Nome Completo *</Label>
          <Input
            id="nome"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            placeholder="Nome completo"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="cpf">CPF *</Label>
          <Input
            id="cpf"
            value={formData.cpf}
            onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
            placeholder="000.000.000-00"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="email@exemplo.com"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="telefone">Telefone</Label>
          <Input
            id="telefone"
            value={formData.telefone}
            onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
            placeholder="(11) 99999-9999"
            className="mt-1"
          />
        </div>
      </CardContent>
    </Card>
  )

  const renderStep1Juridica = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="w-5 h-5 text-primary" />
          Dados da Empresa
        </CardTitle>
        <CardDescription>Informações corporativas</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="razaoSocial">Razão Social *</Label>
          <Input
            id="razaoSocial"
            value={formData.razaoSocial}
            onChange={(e) => setFormData({ ...formData, razaoSocial: e.target.value })}
            placeholder="Razão social da empresa"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="cnpj">CNPJ *</Label>
          <Input
            id="cnpj"
            value={formData.cnpj}
            onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
            placeholder="00.000.000/0000-00"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="nome">Nome Fantasia</Label>
          <Input
            id="nome"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            placeholder="Nome fantasia"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="email">Email da Empresa *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="contato@empresa.com"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="telefone">Telefone da Empresa</Label>
          <Input
            id="telefone"
            value={formData.telefone}
            onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
            placeholder="(11) 3333-3333"
            className="mt-1"
          />
        </div>
      </CardContent>
    </Card>
  )

  const renderStep2Juridica = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Dados do Representante
        </CardTitle>
        <CardDescription>Informações do responsável pela empresa</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="nomeRepresentante">Nome do Representante *</Label>
          <Input
            id="nomeRepresentante"
            value={formData.nomeRepresentante}
            onChange={(e) => setFormData({ ...formData, nomeRepresentante: e.target.value })}
            placeholder="Nome do responsável"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="emailRepresentante">Email do Representante *</Label>
          <Input
            id="emailRepresentante"
            type="email"
            value={formData.emailRepresentante}
            onChange={(e) => setFormData({ ...formData, emailRepresentante: e.target.value })}
            placeholder="email@exemplo.com"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="telefoneRepresentante">Telefone do Representante</Label>
          <Input
            id="telefoneRepresentante"
            value={formData.telefoneRepresentante}
            onChange={(e) => setFormData({ ...formData, telefoneRepresentante: e.target.value })}
            placeholder="(11) 99999-9999"
            className="mt-1"
          />
        </div>
      </CardContent>
    </Card>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2" variant={isEdit ? "outline" : "default"} size={isEdit ? "sm" : "default"}>
          {isEdit ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {isEdit ? "Editar" : "Novo Cliente"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEdit ? "Editar Cliente" : "Novo Cliente"}
            <Badge variant="outline">{formData.tipo === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}</Badge>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="tipo">Tipo de Cliente *</Label>
            <Select value={formData.tipo} onValueChange={handleTipoChange}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="fisica">Pessoa Física</SelectItem>
                <SelectItem value="juridica">Pessoa Jurídica</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {renderStepIndicator()}

          {formData.tipo === 'fisica' && renderPessoaFisica()}
          {formData.tipo === 'juridica' && currentStep === 1 && renderStep1Juridica()}
          {formData.tipo === 'juridica' && currentStep === 2 && renderStep2Juridica()}

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2 justify-between">
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              {formData.tipo === 'juridica' && currentStep === 2 && (
                <Button type="button" variant="outline" onClick={() => setCurrentStep(1)}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Voltar
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              {formData.tipo === 'juridica' && currentStep === 1 ? (
                <Button type="button" onClick={handleNext}>
                  Próximo
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button type="submit">
                  {isEdit ? "Atualizar" : "Criar"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
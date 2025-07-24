import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Package, ArrowLeft, ArrowRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useLocalStorage } from "@/hooks/useLocalStorage"

interface Cliente {
  id: number
  nome: string
  email: string
  telefone: string
  status: string
}

interface Produto {
  id: number
  nome: string
  valor: number
}

interface ItemAssinatura {
  produtoId: number
  produto: string
  valor: number
  dataVencimento: string
  status: string
}

interface Assinatura {
  id: number
  clienteId: number
  cliente: string
  itens: ItemAssinatura[]
  valorTotal: number
  periodicidade: string
  status: string
  proximaCobranca: string
  inicioContrato: string
}

interface AssinaturaDialogProps {
  assinatura?: Assinatura
  onSave: (assinatura: Omit<Assinatura, 'id'> | Assinatura) => void
  isEdit?: boolean
}

export function AssinaturaDialog({ assinatura, onSave, isEdit = false }: AssinaturaDialogProps) {
  const [open, setOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [clientes] = useLocalStorage<Cliente[]>("clientes", [])
  const [produtos] = useLocalStorage<Produto[]>("produtos", [])
  const [formData, setFormData] = useState({
    clienteId: assinatura?.clienteId || 0,
    cliente: assinatura?.cliente || "",
    itens: assinatura?.itens || [] as ItemAssinatura[],
    periodicidade: assinatura?.periodicidade || "Mensal",
    status: assinatura?.status || "Ativa",
    proximaCobranca: assinatura?.proximaCobranca || "",
    inicioContrato: assinatura?.inicioContrato || ""
  })

  // Atualizar formData quando assinatura mudar
  useEffect(() => {
    if (assinatura && isEdit) {
      setFormData({
        clienteId: assinatura.clienteId,
        cliente: assinatura.cliente,
        itens: assinatura.itens,
        periodicidade: assinatura.periodicidade,
        status: assinatura.status,
        proximaCobranca: assinatura.proximaCobranca,
        inicioContrato: assinatura.inicioContrato
      })
    }
  }, [assinatura, isEdit])
  
  const [novoItem, setNovoItem] = useState({
    produtoId: 0,
    produto: "",
    valor: 0,
    dataVencimento: ""
  })
  const { toast } = useToast()

  useEffect(() => {
    if (formData.clienteId) {
      const cliente = clientes.find(c => c.id === formData.clienteId)
      if (cliente) {
        setFormData(prev => ({ ...prev, cliente: cliente.nome }))
      }
    }
  }, [formData.clienteId, clientes])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.clienteId || formData.itens.length === 0) {
      toast({
        title: "Erro",
        description: "Cliente e pelo menos um produto/serviço são obrigatórios",
        variant: "destructive"
      })
      return
    }

    const valorTotal = formData.itens.reduce((total, item) => total + item.valor, 0)
    
    const assinaturaData = {
      ...formData,
      cliente: clientes.find(c => c.id === formData.clienteId)?.nome || "",
      valorTotal
    }

    if (isEdit && assinatura) {
      onSave({ ...assinatura, ...assinaturaData })
    } else {
      onSave(assinaturaData)
    }
    
    setOpen(false)
    setFormData({
      clienteId: 0,
      cliente: "",
      itens: [],
      periodicidade: "Mensal",
      status: "Ativa",
      proximaCobranca: "",
      inicioContrato: ""
    })
    setNovoItem({
      produtoId: 0,
      produto: "",
      valor: 0,
      dataVencimento: ""
    })
    
    toast({
      title: "Sucesso",
      description: `Assinatura ${isEdit ? 'atualizada' : 'criada'} com sucesso!`
    })
  }

  const adicionarItem = () => {
    if (!novoItem.produtoId || !novoItem.valor) {
      toast({
        title: "Erro",
        description: "Produto e valor são obrigatórios",
        variant: "destructive"
      })
      return
    }

    const produto = produtos.find(p => p.id === novoItem.produtoId)
    if (!produto) return

    const item: ItemAssinatura = {
      ...novoItem,
      produto: produto.nome,
      status: "Pendente"
    }

    setFormData({
      ...formData,
      itens: [...formData.itens, item]
    })

    setNovoItem({
      produtoId: 0,
      produto: "",
      valor: 0,
      dataVencimento: ""
    })
  }

  const removerItem = (index: number) => {
    setFormData({
      ...formData,
      itens: formData.itens.filter((_, i) => i !== index)
    })
  }

  const updateItemStatus = (index: number, novoStatus: string) => {
    const novosItens = [...formData.itens]
    novosItens[index].status = novoStatus
    setFormData({
      ...formData,
      itens: novosItens
    })
  }

  const nextStep = () => {
    if (currentStep === 1 && !formData.clienteId) {
      toast({
        title: "Erro",
        description: "Selecione um cliente para continuar",
        variant: "destructive"
      })
      return
    }
    if (currentStep < 3) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="cliente">Cliente *</Label>
              <Select value={formData.clienteId.toString()} onValueChange={(value) => setFormData({ ...formData, clienteId: parseInt(value) })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.id.toString()}>
                      {cliente.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <Label htmlFor="periodicidade">Periodicidade</Label>
                <Select value={formData.periodicidade} onValueChange={(value) => setFormData({ ...formData, periodicidade: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mensal">Mensal</SelectItem>
                    <SelectItem value="Trimestral">Trimestral</SelectItem>
                    <SelectItem value="Semestral">Semestral</SelectItem>
                    <SelectItem value="Anual">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status da Assinatura</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativa">Ativa</SelectItem>
                    <SelectItem value="Suspensa">Suspensa</SelectItem>
                    <SelectItem value="Cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )
      
      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Produtos/Serviços *</Label>
              <span className="text-sm text-muted-foreground">
                Total: R$ {formData.itens.reduce((total, item) => total + item.valor, 0).toFixed(2)}
              </span>
            </div>
            
            {/* Lista de Itens */}
            {formData.itens.length > 0 && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {formData.itens.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2 flex-1">
                      <Package className="h-4 w-4 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium">{item.produto}</p>
                        <p className="text-sm text-muted-foreground">
                          R$ {item.valor.toFixed(2)} • Venc: {item.dataVencimento || "Não definido"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select value={item.status} onValueChange={(value) => updateItemStatus(index, value)}>
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pago">Pago</SelectItem>
                            <SelectItem value="Pendente">Pendente</SelectItem>
                            <SelectItem value="Cancelado">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
                        <Badge variant={
                          item.status === "Pago" ? "default" : 
                          item.status === "Pendente" ? "secondary" : 
                          "destructive"
                        }>
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="sm"
                      onClick={() => removerItem(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Adicionar Novo Item */}
            <div className="border rounded-lg p-4 space-y-3">
              <h4 className="font-medium">Adicionar Produto/Serviço</h4>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <Label htmlFor="produtoSelect">Produto/Serviço</Label>
                  <Select 
                    value={novoItem.produtoId.toString()} 
                    onValueChange={(value) => {
                      const produto = produtos.find(p => p.id === parseInt(value))
                      if (produto) {
                        setNovoItem({ 
                          ...novoItem, 
                          produtoId: produto.id, 
                          produto: produto.nome,
                          valor: produto.valor 
                        })
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {produtos.map((produto) => (
                        <SelectItem key={produto.id} value={produto.id.toString()}>
                          {produto.nome} - R$ {produto.valor.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="valorItem">Valor</Label>
                  <Input
                    id="valorItem"
                    type="number"
                    step="0.01"
                    value={novoItem.valor}
                    onChange={(e) => setNovoItem({ ...novoItem, valor: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="dataVencimento">Data Vencimento</Label>
                  <Input
                    id="dataVencimento"
                    type="date"
                    value={novoItem.dataVencimento}
                    onChange={(e) => setNovoItem({ ...novoItem, dataVencimento: e.target.value })}
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    type="button" 
                    onClick={adicionarItem}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <Label htmlFor="inicioContrato">Início do Contrato</Label>
                <Input
                  id="inicioContrato"
                  type="date"
                  value={formData.inicioContrato}
                  onChange={(e) => setFormData({ ...formData, inicioContrato: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="proximaCobranca">Próxima Cobrança</Label>
                <Input
                  id="proximaCobranca"
                  type="date"
                  value={formData.proximaCobranca}
                  onChange={(e) => setFormData({ ...formData, proximaCobranca: e.target.value })}
                />
              </div>
            </div>
            
            {/* Resumo */}
            <div className="border rounded-lg p-4 bg-muted/30">
              <h4 className="font-medium mb-3">Resumo da Assinatura</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Cliente:</span>
                  <span className="font-medium">{formData.cliente}</span>
                </div>
                <div className="flex justify-between">
                  <span>Periodicidade:</span>
                  <span className="font-medium">{formData.periodicidade}</span>
                </div>
                <div className="flex justify-between">
                  <span>Produtos/Serviços:</span>
                  <span className="font-medium">{formData.itens.length} itens</span>
                </div>
                <div className="flex justify-between">
                  <span>Valor Total:</span>
                  <span className="font-medium text-success">
                    R$ {formData.itens.reduce((total, item) => total + item.valor, 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={isEdit ? "gap-2" : "gap-2"} variant={isEdit ? "outline" : "default"} size={isEdit ? "sm" : "default"}>
          {isEdit ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {isEdit ? "Editar" : "Nova Assinatura"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{isEdit ? "Editar Assinatura" : "Nova Assinatura"}</DialogTitle>
            {!isEdit && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Etapa {currentStep} de 3</span>
              </div>
            )}
          </div>
          {!isEdit && (
            <div className="flex gap-1 mt-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`h-2 flex-1 rounded-full ${
                    step <= currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          )}
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {isEdit ? (
            // Modo de edição: mostra tudo numa tela só
            <div className="space-y-4">
              <div>
                <Label htmlFor="cliente">Cliente *</Label>
                <Select value={formData.clienteId.toString()} onValueChange={(value) => setFormData({ ...formData, clienteId: parseInt(value) })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.id.toString()}>
                        {cliente.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Produtos com status individuais */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Produtos/Serviços *</Label>
                  <span className="text-sm text-muted-foreground">
                    Total: R$ {formData.itens.reduce((total, item) => total + item.valor, 0).toFixed(2)}
                  </span>
                </div>
                
                {formData.itens.length > 0 && (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {formData.itens.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2 flex-1">
                          <Package className="h-4 w-4 text-primary" />
                          <div className="flex-1">
                            <p className="font-medium">{item.produto}</p>
                            <p className="text-sm text-muted-foreground">
                              R$ {item.valor.toFixed(2)} • Venc: {item.dataVencimento || "Não definido"}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Select value={item.status} onValueChange={(value) => updateItemStatus(index, value)}>
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pago">Pago</SelectItem>
                                <SelectItem value="Pendente">Pendente</SelectItem>
                                <SelectItem value="Cancelado">Cancelado</SelectItem>
                              </SelectContent>
                            </Select>
                            <Badge variant={
                              item.status === "Pago" ? "default" : 
                              item.status === "Pendente" ? "secondary" : 
                              "destructive"
                            }>
                              {item.status}
                            </Badge>
                          </div>
                        </div>
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="sm"
                          onClick={() => removerItem(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="border rounded-lg p-4 space-y-3">
                  <h4 className="font-medium">Adicionar Produto/Serviço</h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <Label htmlFor="produtoSelect">Produto/Serviço</Label>
                      <Select 
                        value={novoItem.produtoId.toString()} 
                        onValueChange={(value) => {
                          const produto = produtos.find(p => p.id === parseInt(value))
                          if (produto) {
                            setNovoItem({ 
                              ...novoItem, 
                              produtoId: produto.id, 
                              produto: produto.nome,
                              valor: produto.valor 
                            })
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          {produtos.map((produto) => (
                            <SelectItem key={produto.id} value={produto.id.toString()}>
                              {produto.nome} - R$ {produto.valor.toFixed(2)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="valorItem">Valor</Label>
                      <Input
                        id="valorItem"
                        type="number"
                        step="0.01"
                        value={novoItem.valor}
                        onChange={(e) => setNovoItem({ ...novoItem, valor: parseFloat(e.target.value) || 0 })}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dataVencimento">Data Vencimento</Label>
                      <Input
                        id="dataVencimento"
                        type="date"
                        value={novoItem.dataVencimento}
                        onChange={(e) => setNovoItem({ ...novoItem, dataVencimento: e.target.value })}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button 
                        type="button" 
                        onClick={adicionarItem}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <Label htmlFor="periodicidade">Periodicidade</Label>
                  <Select value={formData.periodicidade} onValueChange={(value) => setFormData({ ...formData, periodicidade: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mensal">Mensal</SelectItem>
                      <SelectItem value="Trimestral">Trimestral</SelectItem>
                      <SelectItem value="Semestral">Semestral</SelectItem>
                      <SelectItem value="Anual">Anual</SelectItem>
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
                      <SelectItem value="Ativa">Ativa</SelectItem>
                      <SelectItem value="Suspensa">Suspensa</SelectItem>
                      <SelectItem value="Cancelada">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <Label htmlFor="inicioContrato">Início do Contrato</Label>
                  <Input
                    id="inicioContrato"
                    type="date"
                    value={formData.inicioContrato}
                    onChange={(e) => setFormData({ ...formData, inicioContrato: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="proximaCobranca">Próxima Cobrança</Label>
                  <Input
                    id="proximaCobranca"
                    type="date"
                    value={formData.proximaCobranca}
                    onChange={(e) => setFormData({ ...formData, proximaCobranca: e.target.value })}
                  />
                </div>
              </div>
            </div>
          ) : (
            // Modo de criação: fluxo em steps
            renderStep()
          )}

          <div className="flex gap-2 justify-between">
            <div className="flex gap-2">
              {!isEdit && currentStep > 1 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Anterior
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              {!isEdit && currentStep < 3 ? (
                <Button type="button" onClick={nextStep}>
                  Próximo
                  <ArrowRight className="h-4 w-4 ml-2" />
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
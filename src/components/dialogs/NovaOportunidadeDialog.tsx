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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, X, ChevronRight, ChevronLeft, User, ShoppingCart, CheckCircle, BarChart3 } from "lucide-react"
import { ClienteSelector } from "./ClienteSelector"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  cliente: z.string().min(1, "Cliente é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  valor: z.string().min(1, "Valor é obrigatório"),
  status: z.string().min(1, "Status é obrigatório"),
  estagio: z.string().min(1, "Estágio é obrigatório"),
})

interface Cliente {
  id: number
  nome: string
  email: string
}

interface Produto {
  id: number
  nome: string
  descricao: string
  valor: number
  tipo: string
  status: string
}

interface ServicoItem {
  id: number
  produtoId: number
  produto: string
  valor: number
  quantidade: number
}

interface Stage {
  id: number
  nome: string
  cor: string
}

interface NovaOportunidadeDialogProps {
  stages: Stage[]
  onAddCard: (card: {
    cliente: string
    descricao: string
    valor: number
    status: string
    estagio: number
    clienteId?: number
    servicos?: ServicoItem[]
  }) => void
  trigger?: React.ReactNode
}

const statusOptions = [
  { value: "quente", label: "Quente", color: "destructive" },
  { value: "morno", label: "Morno", color: "warning" },
  { value: "frio", label: "Frio", color: "secondary" },
  { value: "perdido", label: "Perdido", color: "outline" },
]

export function NovaOportunidadeDialog({ stages, onAddCard, trigger }: NovaOportunidadeDialogProps) {
  const [open, setOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedClienteId, setSelectedClienteId] = useState<number | undefined>()
  const [servicos, setServicos] = useState<ServicoItem[]>([])
  const [novoServico, setNovoServico] = useState({
    produtoId: 0,
    produto: "",
    valor: 0,
    quantidade: 1
  })
  
  const [produtos] = useLocalStorage<Produto[]>("produtos", [])
  const { toast } = useToast()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cliente: "",
      descricao: "",
      valor: "",
      status: "",
      estagio: "",
    },
  })

  const calcularValorTotal = () => {
    return servicos.reduce((total, servico) => total + (servico.valor * servico.quantidade), 0)
  }

  const adicionarServico = () => {
    if (!novoServico.produtoId || novoServico.quantidade <= 0) return

    const produto = produtos.find(p => p.id === novoServico.produtoId)
    if (!produto) return

    const novoItem: ServicoItem = {
      id: Date.now(),
      produtoId: produto.id,
      produto: produto.nome,
      valor: produto.valor,
      quantidade: novoServico.quantidade
    }

    setServicos([...servicos, novoItem])
    setNovoServico({
      produtoId: 0,
      produto: "",
      valor: 0,
      quantidade: 1
    })
  }

  const removerServico = (servicoId: number) => {
    setServicos(servicos.filter(s => s.id !== servicoId))
  }

  const validateStep1 = () => {
    const cliente = form.getValues("cliente")
    const descricao = form.getValues("descricao")
    return cliente && descricao
  }

  const handleNext = () => {
    if (!validateStep1()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o cliente e a descrição para continuar",
        variant: "destructive"
      })
      return
    }
    setCurrentStep(2)
  }

  const handlePrevious = () => {
    setCurrentStep(1)
  }

  const resetForm = () => {
    form.reset()
    setSelectedClienteId(undefined)
    setServicos([])
    setNovoServico({
      produtoId: 0,
      produto: "",
      valor: 0,
      quantidade: 1
    })
    setCurrentStep(1)
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    const valorTotal = servicos.length > 0 ? calcularValorTotal() : parseFloat(values.valor)
    onAddCard({
      cliente: values.cliente,
      descricao: values.descricao,
      valor: valorTotal,
      status: values.status,
      estagio: parseInt(values.estagio),
      clienteId: selectedClienteId,
      servicos: servicos,
    })
    resetForm()
    setOpen(false)
    toast({
      title: "Sucesso",
      description: "Oportunidade criada com sucesso!"
    })
  }

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              {currentStep > 1 ? <CheckCircle className="w-4 h-4" /> : <User className="w-4 w-4" />}
            </div>
            <span className="ml-2 text-sm font-medium">Dados Básicos</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              <BarChart3 className="w-4 h-4" />
            </div>
            <span className="ml-2 text-sm font-medium">Status & Estágio</span>
          </div>
        </div>
      </div>
    )
  }

  const selectedStatus = statusOptions.find(option => option.value === form.watch("status"))

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Oportunidade
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Nova Oportunidade
            <Badge variant="outline">Etapa {currentStep} de 2</Badge>
          </DialogTitle>
          <DialogDescription>
            {currentStep === 1 
              ? "Selecione o cliente e adicione os serviços desejados."
              : "Configure o status e estágio da oportunidade."
            }
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {renderStepIndicator()}
            
            {currentStep === 1 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      Informações Básicas
                    </CardTitle>
                    <CardDescription>Cliente e descrição da oportunidade</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="cliente"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cliente *</FormLabel>
                          <FormControl>
                            <ClienteSelector
                              value={field.value}
                              onValueChange={(clienteNome, clienteId) => {
                                field.onChange(clienteNome)
                                setSelectedClienteId(clienteId)
                              }}
                              placeholder="Selecione ou busque um cliente..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="descricao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Descreva brevemente o que foi realizado..."
                              className="min-h-[80px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5 text-primary" />
                      Produtos/Serviços
                    </CardTitle>
                    <CardDescription>Adicione os produtos ou serviços desta oportunidade</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {servicos.length > 0 && (
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                          {servicos.map((servico) => (
                            <Card key={servico.id} className="relative">
                              <CardContent className="p-4">
                                <div className="space-y-2">
                                  <div className="flex items-start justify-between">
                                    <p className="font-medium text-sm">{servico.produto}</p>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 absolute top-2 right-2"
                                      onClick={() => removerServico(servico.id)}
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                  <div className="text-xs text-muted-foreground space-y-1">
                                    <p>Quantidade: {servico.quantidade}</p>
                                    <p>Valor unitário: R$ {servico.valor.toFixed(2)}</p>
                                    <p className="font-semibold text-foreground">
                                      Total: R$ {(servico.quantidade * servico.valor).toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                        <div className="text-right bg-muted p-3 rounded-lg">
                          <p className="font-bold text-lg text-success">
                            Valor Total: R$ {calcularValorTotal().toFixed(2)}
                          </p>
                        </div>
                      </div>
                    )}

                    <Card className="bg-muted/30">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Adicionar Produto/Serviço</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                          <div className="md:col-span-2">
                            <Select
                              value={novoServico.produtoId.toString()}
                              onValueChange={(value) => {
                                const produto = produtos.find(p => p.id === parseInt(value))
                                if (produto) {
                                  setNovoServico({
                                    ...novoServico,
                                    produtoId: produto.id,
                                    produto: produto.nome,
                                    valor: produto.valor
                                  })
                                }
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um produto/serviço" />
                              </SelectTrigger>
                              <SelectContent>
                                {produtos.map((produto) => (
                                  <SelectItem key={produto.id} value={produto.id.toString()}>
                                    <div className="flex flex-col">
                                      <span>{produto.nome}</span>
                                      <span className="text-xs text-muted-foreground">R$ {produto.valor.toFixed(2)}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <Input
                            type="number"
                            placeholder="Quantidade"
                            min="1"
                            value={novoServico.quantidade}
                            onChange={(e) => setNovoServico({
                              ...novoServico,
                              quantidade: parseInt(e.target.value) || 1
                            })}
                          />
                          
                          <Button
                            type="button"
                            onClick={adicionarServico}
                            disabled={!novoServico.produtoId}
                            className="w-full"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Adicionar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
                
                {servicos.length === 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Valor Manual</CardTitle>
                      <CardDescription>Se não há produtos cadastrados, informe o valor manualmente</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="valor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Valor (R$) *</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.01"
                                placeholder="0.00" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      Status & Estágio
                    </CardTitle>
                    <CardDescription>Configure o status e estágio da oportunidade</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {statusOptions.map((status) => (
                                <SelectItem key={status.value} value={status.value}>
                                  <div className="flex items-center gap-2">
                                    <Badge variant={status.color as any} className="w-3 h-3 p-0" />
                                    {status.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="estagio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estágio *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o estágio" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {stages.map((stage) => (
                                <SelectItem key={stage.id} value={stage.id.toString()}>
                                  <div className="flex items-center gap-2">
                                    <Badge variant={stage.cor as any}>
                                      {stage.nome}
                                    </Badge>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card className="bg-muted/30">
                  <CardHeader>
                    <CardTitle className="text-sm">Resumo da Oportunidade</CardTitle>
                    <CardDescription>Confira os dados antes de finalizar</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3 md:grid-cols-2 text-sm">
                      <div>
                        <p><strong>Cliente:</strong> {form.watch("cliente")}</p>
                        <p><strong>Valor:</strong> R$ {(servicos.length > 0 ? calcularValorTotal() : parseFloat(form.watch("valor") || "0")).toFixed(2)}</p>
                      </div>
                      <div>
                        <p><strong>Descrição:</strong> {form.watch("descricao")}</p>
                      </div>
                      {servicos.length > 0 && (
                        <div className="md:col-span-2">
                          <strong>Serviços Inclusos:</strong>
                          <div className="mt-1 grid gap-1 md:grid-cols-2 lg:grid-cols-3">
                            {servicos.map((servico) => (
                              <div key={servico.id} className="text-xs bg-background p-2 rounded">
                                {servico.produto} - {servico.quantidade}x R$ {servico.valor.toFixed(2)}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {selectedStatus && (
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium">Preview do Status:</span>
                      <Badge variant={selectedStatus.color as any}>
                        {selectedStatus.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Este status será exibido no card da oportunidade.
                    </p>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex gap-2 justify-between">
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                {currentStep === 2 && (
                  <Button type="button" variant="outline" onClick={handlePrevious}>
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Voltar
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                {currentStep === 1 ? (
                  <Button type="button" onClick={handleNext}>
                    Próximo
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                ) : (
                  <Button type="submit">
                    Criar Oportunidade
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
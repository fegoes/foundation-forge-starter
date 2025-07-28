import { useState, useEffect } from "react"
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
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { 
  Plus, 
  X, 
  Save, 
  User, 
  ShoppingCart, 
  Target, 
  Calendar, 
  Hash, 
  DollarSign, 
  Trash2,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  BarChart3
} from "lucide-react"
import { ClienteSelector } from "./ClienteSelector"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { useToast } from "@/hooks/use-toast"
import type { AcaoCard } from "@/types/kanban"

const formSchema = z.object({
  cliente: z.string().min(1, "Cliente é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  valor: z.string().optional(),
  status: z.string().min(1, "Status é obrigatório"),
  estagio: z.string().min(1, "Estágio é obrigatório"),
  acao: z.string().optional(),
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
    acaoId?: number
  }) => void
  trigger?: React.ReactNode
}

const statusOptions = [
  { value: "quente", label: "🔥 Quente", color: "destructive" },
  { value: "morno", label: "🟡 Morno", color: "default" },
  { value: "frio", label: "🔵 Frio", color: "secondary" },
  { value: "perdido", label: "⚫ Perdido", color: "outline" },
]

export function NovaOportunidadeDialog({ stages, onAddCard, trigger }: NovaOportunidadeDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedClienteId, setSelectedClienteId] = useState<number | undefined>()
  const [servicos, setServicos] = useState<ServicoItem[]>([])
  const [novoServico, setNovoServico] = useState({
    produtoId: "",
    quantidade: 1
  })
  
  const [produtos] = useLocalStorage<Produto[]>("produtos", [])
  const [acoesCards] = useLocalStorage<AcaoCard[]>("acoesCards", [])
  const { toast } = useToast()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cliente: "",
      descricao: "",
      valor: "",
      status: "",
      estagio: "",
      acao: "",
    },
  })

  // Atualizar valor total automaticamente
  useEffect(() => {
    const valorTotal = calcularValorTotal()
    if (valorTotal > 0) {
      form.setValue("valor", valorTotal.toString())
    }
  }, [servicos])

  const calcularValorTotal = () => {
    return servicos.reduce((total, servico) => total + (servico.valor * servico.quantidade), 0)
  }

  const adicionarServico = () => {
    if (!novoServico.produtoId || novoServico.quantidade <= 0) return

    const produto = produtos.find(p => p.id === parseInt(novoServico.produtoId))
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
      produtoId: "",
      quantidade: 1
    })
  }

  const removerServico = (servicoId: number) => {
    setServicos(servicos.filter(s => s.id !== servicoId))
  }

  const resetForm = () => {
    form.reset()
    setSelectedClienteId(undefined)
    setServicos([])
    setNovoServico({
      produtoId: "",
      quantidade: 1
    })
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Validar se temos valor ou serviços
    if (servicos.length === 0 && (!values.valor || parseFloat(values.valor) <= 0)) {
      toast({
        title: "Valor obrigatório",
        description: "Adicione produtos/serviços ou informe um valor manual",
        variant: "destructive"
      })
      return
    }
    
    const valorTotal = servicos.length > 0 ? calcularValorTotal() : parseFloat(values.valor || "0")
    
    onAddCard({
      cliente: values.cliente,
      descricao: values.descricao,
      valor: valorTotal,
      status: values.status,
      estagio: parseInt(values.estagio),
      clienteId: selectedClienteId,
      servicos: servicos,
      acaoId: values.acao ? parseInt(values.acao) : undefined,
    })
    resetForm()
    setOpen(false)
    toast({
      title: "Sucesso",
      description: "Oportunidade criada com sucesso!"
    })
  }

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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Nova Oportunidade
          </DialogTitle>
          <DialogDescription>
            Crie uma nova oportunidade de negócio com cliente e produtos
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Informações Básicas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="w-5 h-5 text-primary" />
                    Informações Básicas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
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
                              placeholder="Selecione ou cadastre um cliente..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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
                                  {status.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="descricao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descreva brevemente a oportunidade..."
                            className="min-h-[80px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 md:grid-cols-2">
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
                                    <div 
                                      className="w-3 h-3 rounded-full"
                                      style={{ backgroundColor: stage.cor }}
                                    />
                                    {stage.nome}
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
                      name="acao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ação Atual</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione uma ação" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {acoesCards.length > 0 ? (
                                acoesCards
                                  .sort((a, b) => a.ordem - b.ordem)
                                  .map((acao) => (
                                  <SelectItem key={acao.id} value={acao.id.toString()}>
                                    <div className="flex items-center gap-2">
                                      <div 
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: acao.cor }}
                                      />
                                      {acao.nome}
                                    </div>
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem disabled value="no-actions">
                                  <span className="text-muted-foreground">Nenhuma ação cadastrada</span>
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Produtos/Serviços */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ShoppingCart className="w-5 h-5 text-primary" />
                    Produtos/Serviços
                    {produtos.length === 0 && (
                      <Badge variant="outline" className="text-xs">
                        Cadastre produtos na seção Produtos
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {produtos.length > 0 
                      ? "Adicione os produtos ou serviços desta oportunidade"
                      : "Para usar produtos/serviços, cadastre-os primeiro na seção Produtos"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Adicionar produto */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div className="md:col-span-2">
                        <Label>Produto/Serviço</Label>
                        <Select
                          value={novoServico.produtoId}
                          onValueChange={(value) => setNovoServico({ ...novoServico, produtoId: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um produto" />
                          </SelectTrigger>
                          <SelectContent>
                            {produtos.length > 0 ? (
                              produtos.map((produto) => (
                                <SelectItem key={produto.id} value={produto.id.toString()}>
                                  <div className="flex flex-col">
                                    <span>{produto.nome}</span>
                                    <span className="text-xs text-muted-foreground">R$ {produto.valor.toFixed(2)}</span>
                                  </div>
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem disabled value="no-products">
                                <span className="text-muted-foreground">Nenhum produto cadastrado</span>
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Quantidade</Label>
                        <Input
                          type="number"
                          min="1"
                          value={novoServico.quantidade}
                          onChange={(e) => setNovoServico({
                            ...novoServico,
                            quantidade: parseInt(e.target.value) || 1
                          })}
                        />
                      </div>
                      
                      <div className="flex items-end">
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
                    </div>
                  </div>

                  {/* Lista de serviços */}
                  {servicos.length > 0 && (
                    <div className="space-y-3">
                      <Separator />
                      <div className="max-h-60 overflow-y-auto space-y-2">
                        {servicos.map((servico) => (
                          <div key={servico.id} className="flex items-center justify-between p-3 border rounded-lg bg-background">
                            <div className="flex-1">
                              <div className="font-medium">{servico.produto}</div>
                              <div className="text-sm text-muted-foreground">
                                {servico.quantidade}x R$ {servico.valor.toFixed(2)} = R$ {(servico.quantidade * servico.valor).toFixed(2)}
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removerServico(servico.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <div className="text-right bg-primary/10 p-3 rounded-lg">
                        <div className="font-bold text-lg text-primary">
                          Total: R$ {calcularValorTotal().toFixed(2)}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Valor manual se não há serviços */}
                  {servicos.length === 0 && (
                    <div>
                      <Separator className="mb-4" />
                      <FormField
                        control={form.control}
                        name="valor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Valor Manual (R$) *</FormLabel>
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
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Resumo */}
              {(form.watch("cliente") && form.watch("descricao")) && (
                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      Resumo da Oportunidade
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 md:grid-cols-2 text-sm">
                      <div>
                        <p><strong>Cliente:</strong> {form.watch("cliente")}</p>
                        <p><strong>Status:</strong> {statusOptions.find(s => s.value === form.watch("status"))?.label || "Não selecionado"}</p>
                      </div>
                      <div>
                        <p><strong>Estágio:</strong> {stages.find(s => s.id.toString() === form.watch("estagio"))?.nome || "Não selecionado"}</p>
                        <p><strong>Valor:</strong> R$ {(servicos.length > 0 ? calcularValorTotal() : parseFloat(form.watch("valor") || "0")).toFixed(2)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </form>
          </Form>
        </ScrollArea>

        <DialogFooter className="pt-4 border-t">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)}>
            <Save className="h-4 w-4 mr-2" />
            Criar Oportunidade
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
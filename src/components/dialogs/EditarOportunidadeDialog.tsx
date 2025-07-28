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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Edit, Plus, X, User, ShoppingCart } from "lucide-react"
import { ClienteSelector } from "./ClienteSelector"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { useToast } from "@/hooks/use-toast"
import type { AcaoCard } from "@/types/kanban"

const formSchema = z.object({
  cliente: z.string().min(1, "Cliente é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  valor: z.string().min(1, "Valor é obrigatório"),
  status: z.string().min(1, "Status é obrigatório"),
  estagio: z.string().min(1, "Estágio é obrigatório"),
  acao: z.string().optional(),
})

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

interface KanbanCard {
  id: number
  cliente: string
  descricao: string
  valor: number
  status: string
  clienteId?: number
  servicos?: ServicoItem[]
  acaoId?: number
}

interface Stage {
  id: number
  nome: string
  cor: string
}

interface EditarOportunidadeDialogProps {
  card: KanbanCard
  stages: Stage[]
  onUpdate: (cardId: number, updatedCard: Partial<KanbanCard>) => void
  trigger?: React.ReactNode
}

const statusOptions = [
  { value: "quente", label: "Quente", color: "destructive" },
  { value: "morno", label: "Morno", color: "warning" },
  { value: "frio", label: "Frio", color: "secondary" },
  { value: "perdido", label: "Perdido", color: "outline" },
]

export function EditarOportunidadeDialog({ card, stages, onUpdate, trigger }: EditarOportunidadeDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedClienteId, setSelectedClienteId] = useState<number | undefined>(card.clienteId)
  const [servicos, setServicos] = useState<ServicoItem[]>(card.servicos || [])
  const [novoServico, setNovoServico] = useState({
    produtoId: 0,
    produto: "",
    valor: 0,
    quantidade: 1
  })
  
  const [produtos] = useLocalStorage<Produto[]>("produtos", [])
  const [acoesCards] = useLocalStorage<AcaoCard[]>("acoesCards", [])
  const { toast } = useToast()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cliente: card.cliente,
      descricao: card.descricao,
      valor: card.valor.toString(),
      status: card.status,
      estagio: "",
      acao: card.acaoId?.toString() || "",
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    const valorTotal = servicos.length > 0 ? calcularValorTotal() : parseFloat(values.valor)
    
    onUpdate(card.id, {
      cliente: values.cliente,
      descricao: values.descricao,
      valor: valorTotal,
      status: values.status,
      clienteId: selectedClienteId,
      servicos: servicos,
      acaoId: values.acao ? parseInt(values.acao) : undefined,
    })
    
    setOpen(false)
    toast({
      title: "Sucesso",
      description: "Oportunidade atualizada com sucesso!"
    })
  }

  const selectedStatus = statusOptions.find(option => option.value === form.watch("status"))

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Oportunidade</DialogTitle>
          <DialogDescription>
            Atualize as informações da oportunidade.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                <CardDescription>Gerencie os produtos ou serviços desta oportunidade</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {servicos.length > 0 && (
                  <div className="space-y-2">
                    {servicos.map((servico) => (
                      <Card key={servico.id} className="bg-muted/30">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{servico.produto}</p>
                              <p className="text-xs text-muted-foreground">
                                {servico.quantidade}x R$ {servico.valor.toFixed(2)} = R$ {(servico.quantidade * servico.valor).toFixed(2)}
                              </p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removerServico(servico.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    <div className="text-right bg-muted p-3 rounded-lg">
                      <p className="font-semibold text-success">
                        Total: R$ {calcularValorTotal().toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}

                <Card className="bg-background border-dashed">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Adicionar Produto/Serviço</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
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
                          <SelectValue placeholder="Produto" />
                        </SelectTrigger>
                        <SelectContent>
                          {produtos.map((produto) => (
                            <SelectItem key={produto.id} value={produto.id.toString()}>
                              {produto.nome} - R$ {produto.valor.toFixed(2)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Input
                        type="number"
                        placeholder="Qtd"
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
                      >
                        <Plus className="h-4 w-4" />
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
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Status & Estágio</CardTitle>
                <CardDescription>Configure o status atual da oportunidade</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
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
                      <FormLabel>Estágio</FormLabel>
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

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  Ação Atual
                  {acoesCards.length === 0 && (
                    <Badge variant="outline" className="text-xs">
                      Cadastre ações em Configurações
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {acoesCards.length > 0 
                    ? "Selecione a ação atual da oportunidade (opcional)"
                    : "Para usar ações, cadastre-as primeiro em Configurações → Ações dos Cards"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="acao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ação</FormLabel>
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
              </CardContent>
            </Card>
            
            {selectedStatus && (
              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium">Preview do Status:</span>
                    <Badge variant={selectedStatus.color as any}>
                      {selectedStatus.label}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Este status será exibido no card da oportunidade.
                  </p>
                </CardContent>
              </Card>
            )}
            
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                Salvar Alterações
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
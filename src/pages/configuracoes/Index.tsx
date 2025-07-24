import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Settings, Trash2, Edit3 } from "lucide-react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { TipoProdutoDialog } from "@/components/dialogs/TipoProdutoDialog"
import { EstagioPipelineDialog } from "@/components/dialogs/EstagioPipelineDialog"
import { StatusChamadoDialog } from "@/components/dialogs/StatusChamadoDialog"
import { useToast } from "@/hooks/use-toast"

interface TipoProduto {
  id: number
  nome: string
  descricao: string
}

interface EstagioPipeline {
  id: number
  nome: string
  ordem: number
  cor: string
}

interface StatusChamado {
  id: number
  nome: string
  cor: string
}

// Mock data para demonstração
const mockConfiguracoes = {
  estagiosKanban: [
    { id: 1, nome: "Prospecção", ordem: 1, cor: "#6b7280" },
    { id: 2, nome: "Proposta Enviada", ordem: 2, cor: "#f59e0b" },
    { id: 3, nome: "Negociação", ordem: 3, cor: "#3b82f6" },
    { id: 4, nome: "Fechado", ordem: 4, cor: "#10b981" }
  ],
  statusChamados: [
    { id: 1, nome: "Aberto", cor: "#ef4444" },
    { id: 2, nome: "Em Andamento", cor: "#f59e0b" },
    { id: 3, nome: "Aguardando Cliente", cor: "#6b7280" },
    { id: 4, nome: "Resolvido", cor: "#10b981" }
  ],
  tiposProdutos: [
    { id: 1, nome: "Software", descricao: "Sistemas e aplicações" },
    { id: 2, nome: "Serviços", descricao: "Prestação de serviços" },
    { id: 3, nome: "Licenças", descricao: "Licenças de software" },
    { id: 4, nome: "Suporte", descricao: "Suporte técnico" }
  ],
  parametros: {
    emailEmpresa: "contato@recurseflow.com",
    telefoneEmpresa: "(11) 99999-9999",
    diasVencimentoPadrao: 30,
    jurosAtraso: 2.0,
    multaAtraso: 10.0
  }
}

const ConfiguracoesIndex = () => {
  const [estagios, setEstagios] = useLocalStorage<EstagioPipeline[]>("estagiosPipeline", mockConfiguracoes.estagiosKanban)
  const [statusChamados, setStatusChamados] = useLocalStorage<StatusChamado[]>("statusChamados", mockConfiguracoes.statusChamados)
  const [tiposProdutos, setTiposProdutos] = useLocalStorage<TipoProduto[]>("tiposProdutos", mockConfiguracoes.tiposProdutos)
  const [parametros, setParametros] = useState(mockConfiguracoes.parametros)
  const { toast } = useToast()

  const handleSaveEstagio = (estagioData: Omit<EstagioPipeline, 'id'> | EstagioPipeline) => {
    if ('id' in estagioData) {
      // Editar estágio existente
      setEstagios(estagios.map(e => e.id === estagioData.id ? estagioData : e))
    } else {
      // Criar novo estágio
      const newId = Math.max(0, ...estagios.map(e => e.id)) + 1
      const newEstagio: EstagioPipeline = {
        ...estagioData,
        id: newId
      }
      setEstagios([...estagios, newEstagio])
    }
  }

  const handleDeleteEstagio = (id: number) => {
    setEstagios(estagios.filter(e => e.id !== id))
    toast({
      title: "Estágio removido",
      description: "Estágio do pipeline removido com sucesso!"
    })
  }

  const handleSaveStatusChamado = (statusData: Omit<StatusChamado, 'id'> | StatusChamado) => {
    if ('id' in statusData) {
      // Editar status existente
      setStatusChamados(statusChamados.map(s => s.id === statusData.id ? statusData : s))
    } else {
      // Criar novo status
      const newId = Math.max(0, ...statusChamados.map(s => s.id)) + 1
      const newStatus: StatusChamado = {
        ...statusData,
        id: newId
      }
      setStatusChamados([...statusChamados, newStatus])
    }
  }

  const handleDeleteStatusChamado = (id: number) => {
    setStatusChamados(statusChamados.filter(s => s.id !== id))
    toast({
      title: "Status removido",
      description: "Status de chamado removido com sucesso!"
    })
  }

  const handleSaveTipoProduto = (tipoData: Omit<TipoProduto, 'id'> | TipoProduto) => {
    if ('id' in tipoData) {
      // Editar tipo existente
      setTiposProdutos(tiposProdutos.map(t => t.id === tipoData.id ? tipoData : t))
    } else {
      // Criar novo tipo
      const newId = Math.max(0, ...tiposProdutos.map(t => t.id)) + 1
      const newTipo: TipoProduto = {
        ...tipoData,
        id: newId
      }
      setTiposProdutos([...tiposProdutos, newTipo])
    }
  }

  const handleDeleteTipoProduto = (id: number) => {
    setTiposProdutos(tiposProdutos.filter(t => t.id !== id))
    toast({
      title: "Tipo removido",
      description: "Tipo de produto/serviço removido com sucesso!"
    })
  }

  const proximaOrdemEstagio = Math.max(0, ...estagios.map(e => e.ordem)) + 1

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground">Gerencie parâmetros e configurações do sistema</p>
        </div>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Salvar Alterações
        </Button>
      </div>

      {/* Estágios do Kanban */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Estágios do Kanban Comercial</CardTitle>
              <CardDescription>
                Configure os estágios do funil de vendas
              </CardDescription>
            </div>
            <EstagioPipelineDialog 
              onSave={handleSaveEstagio} 
              proximaOrdem={proximaOrdemEstagio}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {estagios.map((estagio, index) => (
              <div key={estagio.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: estagio.cor }}
                  />
                  <div>
                    <p className="font-medium">{estagio.nome}</p>
                    <p className="text-sm text-muted-foreground">Ordem: {estagio.ordem}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <EstagioPipelineDialog 
                    estagio={estagio} 
                    onSave={handleSaveEstagio} 
                    isEdit 
                  />
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteEstagio(estagio.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Status dos Chamados */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Status dos Chamados</CardTitle>
              <CardDescription>
                Configure os status disponíveis para chamados técnicos
              </CardDescription>
            </div>
            <StatusChamadoDialog onSave={handleSaveStatusChamado} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {statusChamados.map((status) => (
              <div key={status.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: status.cor }}
                  />
                  <Badge style={{ backgroundColor: status.cor, color: 'white' }}>
                    {status.nome}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <StatusChamadoDialog 
                    status={status} 
                    onSave={handleSaveStatusChamado} 
                    isEdit 
                  />
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteStatusChamado(status.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tipos de Produtos/Serviços */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tipos de Produtos/Serviços</CardTitle>
              <CardDescription>
                Configure as categorias de produtos e serviços
              </CardDescription>
            </div>
            <TipoProdutoDialog onSave={handleSaveTipoProduto} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {tiposProdutos.map((tipo) => (
              <div key={tipo.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{tipo.nome}</p>
                  <p className="text-sm text-muted-foreground">{tipo.descricao}</p>
                </div>
                <div className="flex gap-2">
                  <TipoProdutoDialog 
                    tipo={tipo} 
                    onSave={handleSaveTipoProduto} 
                    isEdit 
                  />
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteTipoProduto(tipo.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Parâmetros Gerais */}
      <Card>
        <CardHeader>
          <CardTitle>Parâmetros Gerais</CardTitle>
          <CardDescription>
            Configure informações gerais da empresa e cobrança
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Email da Empresa</label>
                <Input 
                  value={parametros.emailEmpresa}
                  onChange={(e) => setParametros({...parametros, emailEmpresa: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Telefone da Empresa</label>
                <Input 
                  value={parametros.telefoneEmpresa}
                  onChange={(e) => setParametros({...parametros, telefoneEmpresa: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Dias para Vencimento (Padrão)</label>
                <Input 
                  type="number"
                  value={parametros.diasVencimentoPadrao}
                  onChange={(e) => setParametros({...parametros, diasVencimentoPadrao: parseInt(e.target.value)})}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Juros por Atraso (%)</label>
                <Input 
                  type="number"
                  step="0.1"
                  value={parametros.jurosAtraso}
                  onChange={(e) => setParametros({...parametros, jurosAtraso: parseFloat(e.target.value)})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Multa por Atraso (%)</label>
                <Input 
                  type="number"
                  step="0.1"
                  value={parametros.multaAtraso}
                  onChange={(e) => setParametros({...parametros, multaAtraso: parseFloat(e.target.value)})}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integrações */}
      <Card>
        <CardHeader>
          <CardTitle>Integrações</CardTitle>
          <CardDescription>
            Configure integrações com serviços externos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">WhatsApp Business API</h3>
                <p className="text-sm text-muted-foreground">
                  Envio automático de cobranças via WhatsApp
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary">Não Configurado</Badge>
                <Button variant="outline" size="sm">Configurar</Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">SMTP Email</h3>
                <p className="text-sm text-muted-foreground">
                  Servidor de email para envio de cobranças
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary">Não Configurado</Badge>
                <Button variant="outline" size="sm">Configurar</Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Gateway de Pagamento</h3>
                <p className="text-sm text-muted-foreground">
                  Integração para processamento de pagamentos
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary">Não Configurado</Badge>
                <Button variant="outline" size="sm">Configurar</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ConfiguracoesIndex
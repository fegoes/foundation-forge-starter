import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Headphones, Clock, AlertCircle, CheckCircle } from "lucide-react"

import { useLocalStorage } from "@/hooks/useLocalStorage"

interface Chamado {
  id: number
  titulo: string
  cliente: string
  produto: string
  status: string
  prioridade: string
  dataAbertura: string
  ultimaAtualizacao: string
  tecnicoResponsavel: string
}

const ChamadosIndex = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [chamados] = useLocalStorage<Chamado[]>("chamados", [
    {
      id: 1001,
      titulo: "Sistema lento após atualização",
      cliente: "Empresa ABC Ltda",
      produto: "Sistema ERP Básico",
      status: "Aberto",
      prioridade: "Alta",
      dataAbertura: "2024-01-20",
      ultimaAtualizacao: "2024-01-20",
      tecnicoResponsavel: "Carlos Silva"
    },
    {
      id: 1002,
      titulo: "Erro ao gerar relatórios",
      cliente: "TechStart Soluções",
      produto: "Sistema ERP Avançado",
      status: "Em Andamento",
      prioridade: "Média",
      dataAbertura: "2024-01-19",
      ultimaAtualizacao: "2024-01-21",
      tecnicoResponsavel: "Ana Santos"
    },
    {
      id: 1003,
      titulo: "Configuração de email não funciona",
      cliente: "Maria Santos",
      produto: "Licença Office 365",
      status: "Aguardando Cliente",
      prioridade: "Baixa",
      dataAbertura: "2024-01-18",
      ultimaAtualizacao: "2024-01-19",
      tecnicoResponsavel: "João Costa"
    },
    {
      id: 1004,
      titulo: "Backup automático falhando",
      cliente: "Empresa ABC Ltda",
      produto: "Sistema ERP Básico",
      status: "Resolvido",
      prioridade: "Alta",
      dataAbertura: "2024-01-15",
      ultimaAtualizacao: "2024-01-17",
      tecnicoResponsavel: "Carlos Silva"
    },
    {
      id: 1005,
      titulo: "Solicitar nova funcionalidade",
      cliente: "TechStart Soluções",
      produto: "Sistema ERP Avançado",
      status: "Em Andamento",
      prioridade: "Média",
      dataAbertura: "2024-01-22",
      ultimaAtualizacao: "2024-01-23",
      tecnicoResponsavel: "Ana Santos"
    }
  ])

  const filteredChamados = chamados.filter(chamado =>
    chamado.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chamado.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chamado.tecnicoResponsavel.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aberto": return "destructive"
      case "Em Andamento": return "warning"
      case "Aguardando Cliente": return "secondary"
      case "Resolvido": return "success"
      default: return "secondary"
    }
  }

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case "Alta": return "destructive"
      case "Média": return "warning"
      case "Baixa": return "secondary"
      default: return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Aberto": return AlertCircle
      case "Em Andamento": return Clock
      case "Aguardando Cliente": return Clock
      case "Resolvido": return CheckCircle
      default: return Headphones
    }
  }

  const calcularEstatisticas = () => {
    const total = chamados.length
    const abertos = chamados.filter(c => c.status === "Aberto").length
    const emAndamento = chamados.filter(c => c.status === "Em Andamento").length
    const resolvidos = chamados.filter(c => c.status === "Resolvido").length
    
    return { total, abertos, emAndamento, resolvidos }
  }

  const stats = calcularEstatisticas()

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Chamados Técnicos</h1>
          <p className="text-muted-foreground">Gerencie solicitações de suporte e atendimento</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Chamado
        </Button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Chamados</CardTitle>
            <Headphones className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abertos</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.abertos}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.emAndamento}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolvidos</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.resolvidos}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título, cliente ou técnico..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">Filtros</Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Chamados */}
      <div className="grid gap-4">
        {filteredChamados.map((chamado) => {
          const StatusIcon = getStatusIcon(chamado.status)
          
          return (
            <Card key={chamado.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="flex items-center gap-2">
                      <StatusIcon className="h-5 w-5 text-primary" />
                      <span className="text-sm text-muted-foreground">#{chamado.id}</span>
                      {chamado.titulo}
                    </CardTitle>
                    <CardDescription>
                      {chamado.cliente} • {chamado.produto}
                    </CardDescription>
                    <div className="flex gap-2">
                      <Badge variant={getStatusColor(chamado.status) as any}>
                        {chamado.status}
                      </Badge>
                      <Badge variant={getPrioridadeColor(chamado.prioridade) as any}>
                        {chamado.prioridade}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Técnico Responsável</p>
                    <p className="font-medium">{chamado.tecnicoResponsavel}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data de Abertura</p>
                    <p className="font-medium">{formatarData(chamado.dataAbertura)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Última Atualização</p>
                    <p className="font-medium">{formatarData(chamado.ultimaAtualizacao)}</p>
                  </div>
                  <div className="flex gap-2 md:justify-end">
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredChamados.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Headphones className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhum chamado encontrado</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ChamadosIndex
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, CreditCard, Calendar, TrendingUp, Edit } from "lucide-react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { AssinaturaDialog } from "@/components/dialogs/AssinaturaDialog"
import { useToast } from "@/hooks/use-toast"

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

const AssinaturasIndex = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [assinaturas, setAssinaturas] = useLocalStorage<Assinatura[]>("assinaturas", [
    {
      id: 1,
      clienteId: 1,
      cliente: "Empresa ABC Ltda",
      itens: [
        {
          produtoId: 1,
          produto: "Sistema ERP Básico",
          valor: 299.90,
          dataVencimento: "2024-02-15",
          status: "pago"
        },
        {
          produtoId: 2,
          produto: "Suporte Técnico Premium",
          valor: 150.00,
          dataVencimento: "2024-02-15",
          status: "pago"
        }
      ],
      valorTotal: 449.90,
      periodicidade: "mensal",
      status: "Ativa",
      proximaCobranca: "2024-02-15",
      inicioContrato: "2024-01-15"
    },
    {
      id: 2,
      clienteId: 2,
      cliente: "Maria Santos",
      itens: [
        {
          produtoId: 4,
          produto: "Licença Office 365",
          valor: 45.00,
          dataVencimento: "2024-02-10",
          status: "pendente"
        }
      ],
      valorTotal: 45.00,
      periodicidade: "mensal",
      status: "Ativa",
      proximaCobranca: "2024-02-10",
      inicioContrato: "2024-01-10"
    },
    {
      id: 3,
      clienteId: 3,
      cliente: "TechStart Soluções",
      itens: [
        {
          produtoId: 3,
          produto: "Sistema ERP Avançado",
          valor: 599.90,
          dataVencimento: "2024-02-20",
          status: "cancelado"
        },
        {
          produtoId: 5,
          produto: "Consultoria Mensal",
          valor: 800.00,
          dataVencimento: "2024-02-20",
          status: "pendente"
        }
      ],
      valorTotal: 1399.90,
      periodicidade: "mensal",
      status: "Pendente",
      proximaCobranca: "2024-02-20",
      inicioContrato: "2024-01-20"
    }
  ])
  const [clientes, setClientes] = useLocalStorage<any[]>("clientes", [])
  const { toast } = useToast()

  const handleSaveAssinatura = (assinaturaData: Omit<Assinatura, 'id'> | Assinatura) => {
    if ('id' in assinaturaData) {
      // Editar assinatura existente
      setAssinaturas(assinaturas.map(a => a.id === assinaturaData.id ? assinaturaData : a))
    } else {
      // Criar nova assinatura
      const newId = Math.max(0, ...assinaturas.map(a => a.id)) + 1
      const newAssinatura: Assinatura = {
        ...assinaturaData,
        id: newId
      }
      setAssinaturas([...assinaturas, newAssinatura])
    }
    
    // Atualizar contadores do cliente
    updateClienteStats()
  }

  const updateClienteStats = () => {
    const updatedClientes = clientes.map(cliente => {
    const clienteAssinaturas = assinaturas.filter(a => a.clienteId === cliente.id && a.status === "Ativa")
      return {
        ...cliente,
        assinaturas: clienteAssinaturas.length,
        valorTotal: clienteAssinaturas.reduce((total, a) => total + a.valorTotal, 0)
      }
    })
    setClientes(updatedClientes)
  }

  const filteredAssinaturas = assinaturas.filter(assinatura =>
    assinatura.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assinatura.itens.some(item => item.produto.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativa": return "success"
      case "Suspensa": return "warning"
      case "Cancelada": return "destructive"
      default: return "secondary"
    }
  }

  const calcularReceita = () => {
    return assinaturas
      .filter(sub => sub.status === "Ativa")
      .reduce((total, sub) => total + sub.valorTotal, 0)
  }

  const formatarData = (data: string) => {
    if (data === "-") return "-"
    return new Date(data).toLocaleDateString('pt-BR')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Assinaturas</h1>
          <p className="text-muted-foreground">Gerencie contratos de recorrência</p>
        </div>
        <AssinaturaDialog onSave={handleSaveAssinatura} />
      </div>

      {/* Cards de Métricas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assinaturas Ativas</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assinaturas.filter(sub => sub.status === "Ativa").length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              R$ {calcularReceita().toFixed(2)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assinaturas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assinaturas.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Retenção</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">95%</div>
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
                placeholder="Buscar por cliente ou produto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">Filtros</Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Assinaturas */}
      <div className="grid gap-4">
        {filteredAssinaturas.map((assinatura) => (
          <Card key={assinatura.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    {assinatura.cliente}
                  </CardTitle>
                  <CardDescription>
                    {assinatura.itens.length} produto(s) • {assinatura.periodicidade}
                  </CardDescription>
                </div>
                <Badge variant={getStatusColor(assinatura.status) as any}>
                  {assinatura.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Lista de Produtos */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Produtos/Serviços:</p>
                  {assinatura.itens.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{item.produto}</span>
                        <Badge variant={
                          item.status === "Pago" ? "default" : 
                          item.status === "Pendente" ? "secondary" : 
                          "destructive"
                        }>
                          {item.status}
                        </Badge>
                      </div>
                      <span className="text-sm font-medium">R$ {item.valor.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="grid gap-4 md:grid-cols-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Valor Total</p>
                    <p className="text-lg font-semibold text-success">
                      R$ {assinatura.valorTotal.toFixed(2)}
                    </p>
                  </div>
                <div>
                  <p className="text-sm text-muted-foreground">Próxima Cobrança</p>
                  <p className="font-medium">
                    {formatarData(assinatura.proximaCobranca)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Início do Contrato</p>
                  <p className="font-medium">
                    {formatarData(assinatura.inicioContrato)}
                  </p>
                </div>
                <div className="flex gap-2 md:justify-end">
                  <AssinaturaDialog 
                    assinatura={assinatura} 
                    onSave={handleSaveAssinatura} 
                    isEdit 
                  />
                  <Button variant="outline" size="sm">
                    Cobrar
                  </Button>
                </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAssinaturas.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhuma assinatura encontrada</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default AssinaturasIndex
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Package, DollarSign, Trash2 } from "lucide-react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { ProdutoDialog } from "@/components/dialogs/ProdutoDialog"
import { useToast } from "@/hooks/use-toast"

interface Produto {
  id: number
  nome: string
  descricao: string
  valor: number
  tipo: string
  status: string
  assinaturasAtivas: number
}

const ProdutosIndex = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [produtos, setProdutos] = useLocalStorage<Produto[]>("produtos", [
    {
      id: 1,
      nome: "Sistema ERP Básico",
      descricao: "Sistema completo para gestão empresarial básico",
      valor: 299.90,
      tipo: "Software",
      status: "Ativo",
      assinaturasAtivas: 15
    },
    {
      id: 2,
      nome: "Suporte Técnico Premium",
      descricao: "Suporte técnico 24h com SLA de 4 horas",
      valor: 150.00,
      tipo: "Serviços",
      status: "Ativo",
      assinaturasAtivas: 23
    },
    {
      id: 3,
      nome: "Sistema ERP Avançado",
      descricao: "Sistema completo para gestão empresarial com módulos avançados",
      valor: 599.90,
      tipo: "Software",
      status: "Ativo",
      assinaturasAtivas: 8
    },
    {
      id: 4,
      nome: "Licença Office 365",
      descricao: "Licenças do Microsoft Office 365 Business Premium",
      valor: 45.00,
      tipo: "Licenças",
      status: "Ativo",
      assinaturasAtivas: 45
    },
    {
      id: 5,
      nome: "Consultoria Mensal",
      descricao: "Consultoria mensal para otimização de processos",
      valor: 800.00,
      tipo: "Serviços",
      status: "Pendente",
      assinaturasAtivas: 3
    }
  ])
  const { toast } = useToast()

  const filteredProdutos = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSaveProduto = (produtoData: Omit<Produto, 'id'> | Produto) => {
    if ('id' in produtoData) {
      // Editar produto existente
      setProdutos(produtos.map(p => p.id === produtoData.id ? produtoData : p))
    } else {
      // Criar novo produto
      const newId = Math.max(0, ...produtos.map(p => p.id)) + 1
      const newProduto: Produto = {
        ...produtoData,
        id: newId,
        assinaturasAtivas: 0
      }
      setProdutos([...produtos, newProduto])
    }
  }

  const handleDeleteProduto = (id: number) => {
    setProdutos(produtos.filter(p => p.id !== id))
    toast({
      title: "Produto removido",
      description: "Produto removido com sucesso!"
    })
  }

  const getStatusColor = (status: string) => {
    return status === "Ativo" ? "success" : "secondary"
  }

  const getTipoColor = (tipo: string) => {
    return tipo === "Software" ? "accent" : "warning"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Produtos & Serviços</h1>
          <p className="text-muted-foreground">Gerencie seu catálogo de produtos e serviços</p>
        </div>
        <ProdutoDialog onSave={handleSaveProduto} />
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar produtos ou serviços..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">Filtros</Button>
          </div>
        </CardContent>
      </Card>

      {/* Grid de Produtos */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProdutos.map((produto) => (
          <Card key={produto.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    {produto.nome}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge variant={getTipoColor(produto.tipo) as any}>
                      {produto.tipo}
                    </Badge>
                    <Badge variant={getStatusColor(produto.status) as any}>
                      {produto.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-sm">
                {produto.descricao}
              </CardDescription>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Valor/Mês</span>
                  <span className="flex items-center gap-1 text-lg font-semibold text-success">
                    <DollarSign className="h-4 w-4" />
                    R$ {produto.valor.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Assinaturas Ativas</span>
                  <span className="font-medium">{produto.assinaturasAtivas}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Receita/Mês</span>
                  <span className="font-semibold text-success">
                    R$ {(produto.valor * produto.assinaturasAtivas).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <ProdutoDialog 
                  produto={produto} 
                  onSave={handleSaveProduto} 
                  isEdit 
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDeleteProduto(produto.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProdutos.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhum produto ou serviço encontrado</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ProdutosIndex
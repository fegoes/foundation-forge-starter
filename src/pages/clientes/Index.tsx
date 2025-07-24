import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Mail, Phone, Building, Trash2 } from "lucide-react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { ClienteDialog } from "@/components/dialogs/ClienteDialog"
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
  assinaturas: number
  valorTotal: number
}

const ClientesIndex = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [clientes, setClientes] = useLocalStorage<Cliente[]>("clientes", [])
  const { toast } = useToast()

  const filteredClientes = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSaveCliente = (clienteData: Omit<Cliente, 'id'> | Cliente) => {
    if ('id' in clienteData) {
      // Editar cliente existente
      setClientes(clientes.map(c => c.id === clienteData.id ? clienteData : c))
    } else {
      // Criar novo cliente
      const newId = Math.max(0, ...clientes.map(c => c.id)) + 1
      const newCliente: Cliente = {
        ...clienteData,
        id: newId,
        assinaturas: 0,
        valorTotal: 0,
        tipo: clienteData.tipo || 'fisica'
      }
      setClientes([...clientes, newCliente])
    }
  }

  const handleDeleteCliente = (id: number) => {
    setClientes(clientes.filter(c => c.id !== id))
    toast({
      title: "Cliente removido",
      description: "Cliente removido com sucesso!"
    })
  }

  const getStatusColor = (status: string) => {
    return status === "Ativo" ? "success" : "secondary"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground">Gerencie seus clientes e contratos</p>
        </div>
        <ClienteDialog onSave={handleSaveCliente} />
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">Filtros</Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Clientes */}
      <div className="grid gap-4">
        {filteredClientes.map((cliente) => (
          <Card key={cliente.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-primary" />
                    {cliente.nome}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {cliente.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {cliente.telefone}
                    </span>
                  </CardDescription>
                </div>
                <Badge variant={getStatusColor(cliente.status) as any}>
                  {cliente.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Assinaturas</p>
                    <p className="text-lg font-semibold">{cliente.assinaturas}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Valor Total/Mês</p>
                    <p className="text-lg font-semibold text-success">
                      R$ {cliente.valorTotal.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <ClienteDialog 
                    cliente={cliente} 
                    onSave={handleSaveCliente} 
                    isEdit 
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteCliente(cliente.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClientes.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Nenhum cliente encontrado</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ClientesIndex
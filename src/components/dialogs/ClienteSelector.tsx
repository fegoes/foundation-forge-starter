import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Check, ChevronsUpDown, Plus, Search, Building, User } from "lucide-react"
import { ClienteDialog } from "./ClienteDialog"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { cn } from "@/lib/utils"

interface Cliente {
  id: number
  nome: string
  email: string
  telefone: string
  status: string
  tipo: 'fisica' | 'juridica'
  razaoSocial?: string
  cnpj?: string
  cpf?: string
}

interface ClienteSelectorProps {
  value: string
  onValueChange: (clienteNome: string, clienteId?: number) => void
  placeholder?: string
}

export function ClienteSelector({ value, onValueChange, placeholder = "Selecione ou busque um cliente..." }: ClienteSelectorProps) {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [clientes, setClientes] = useLocalStorage<Cliente[]>("clientes", [])
  
  const filteredClientes = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchValue.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchValue.toLowerCase()) ||
    (cliente.razaoSocial && cliente.razaoSocial.toLowerCase().includes(searchValue.toLowerCase()))
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
        tipo: clienteData.tipo || 'fisica'
      }
      setClientes([...clientes, newCliente])
      
      // Automaticamente selecionar o novo cliente
      onValueChange(newCliente.nome, newCliente.id)
      setOpen(false)
    }
  }

  const handleSelectCliente = (cliente: Cliente) => {
    onValueChange(cliente.nome, cliente.id)
    setOpen(false)
  }

  const handleCreateFromSearch = () => {
    if (searchValue.trim()) {
      // Se há texto na busca mas nenhum cliente encontrado, 
      // usar o texto como nome inicial para o novo cliente
      onValueChange(searchValue.trim())
      setOpen(false)
    }
  }

  return (
    <div className="space-y-2">
      <Label>Cliente *</Label>
      <div className="flex gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="flex-1 justify-between"
            >
              {value || placeholder}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] p-0">
            <Command>
              <div className="flex items-center border-b px-3">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <CommandInput 
                  placeholder="Buscar cliente..." 
                  value={searchValue}
                  onValueChange={setSearchValue}
                />
              </div>
              <CommandList>
                <CommandEmpty>
                  <div className="py-6 text-center text-sm">
                    <p className="text-muted-foreground mb-3">Nenhum cliente encontrado.</p>
                    {searchValue && (
                      <div className="space-y-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleCreateFromSearch}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Usar "{searchValue}" como cliente
                        </Button>
                        <p className="text-xs text-muted-foreground">
                          ou cadastre um novo cliente completo abaixo
                        </p>
                      </div>
                    )}
                  </div>
                </CommandEmpty>
                <CommandGroup>
                  {filteredClientes.map((cliente) => (
                    <CommandItem
                      key={cliente.id}
                      value={cliente.nome}
                      onSelect={() => handleSelectCliente(cliente)}
                      className="flex items-center justify-between py-3"
                    >
                      <div className="flex items-center">
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === cliente.nome ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex items-center gap-2">
                          {cliente.tipo === 'juridica' ? (
                            <Building className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <User className="h-4 w-4 text-muted-foreground" />
                          )}
                          <div>
                            <div className="font-medium">{cliente.nome}</div>
                            <div className="text-xs text-muted-foreground">
                              {cliente.email}
                            </div>
                          </div>
                        </div>
                      </div>
                      <Badge variant={cliente.status === "Ativo" ? "success" : "secondary"}>
                        {cliente.status}
                      </Badge>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
              <div className="border-t p-3">
                <ClienteDialog onSave={handleSaveCliente} />
              </div>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      {value && !clientes.find(c => c.nome === value) && (
        <div className="text-xs text-muted-foreground">
          ⚠️ Cliente não está cadastrado no sistema. Será criado como texto simples.
        </div>
      )}
    </div>
  )
}
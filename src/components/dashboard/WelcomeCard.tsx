import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package } from "lucide-react"

const features = [
  "Gestão completa de clientes e contratos",
  "Catálogo de produtos e serviços", 
  "Controle de assinaturas recorrentes",
  "Quadro Kanban para vendas",
  "Sistema de chamados técnicos",
]

const upcomingFeatures = [
  "Envio automatizado de cobranças",
  "Integração com WhatsApp Business",
  "Gateway de pagamento",
  "Relatórios avançados", 
  "Sistema de autenticação",
]

export const WelcomeCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" />
          Bem-vindo ao RecurseFlow
        </CardTitle>
        <CardDescription>
          Sistema interno de gestão de cobranças recorrentes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="font-semibold mb-2">Recursos Principais</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {features.map((feature, index) => (
                <li key={index}>• {feature}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Próximas Funcionalidades</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {upcomingFeatures.map((feature, index) => (
                <li key={index}>• {feature}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
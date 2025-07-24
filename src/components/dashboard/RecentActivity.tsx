import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface Activity {
  id: string
  type: 'cliente' | 'assinatura' | 'chamado' | 'produto'
  description: string
  user: string
  timestamp: string
  status?: 'success' | 'warning' | 'destructive'
}

const activities: Activity[] = [
  {
    id: '1',
    type: 'cliente',
    description: 'Novo cliente "Tech Solutions" cadastrado',
    user: 'João Silva',
    timestamp: '2 min atrás',
    status: 'success'
  },
  {
    id: '2', 
    type: 'assinatura',
    description: 'Assinatura Premium renovada automaticamente',
    user: 'Sistema',
    timestamp: '15 min atrás',
    status: 'success'
  },
  {
    id: '3',
    type: 'chamado',
    description: 'Chamado #1234 foi resolvido',
    user: 'Maria Santos',
    timestamp: '1h atrás',
    status: 'success'
  },
  {
    id: '4',
    type: 'produto',
    description: 'Produto "Consultoria" foi atualizado',
    user: 'Carlos Lima',
    timestamp: '2h atrás'
  },
  {
    id: '5',
    type: 'chamado',
    description: 'Novo chamado #1235 aberto',
    user: 'Ana Costa',
    timestamp: '3h atrás',
    status: 'warning'
  }
]

const getTypeColor = (type: Activity['type']) => {
  switch (type) {
    case 'cliente': return 'bg-blue-500'
    case 'assinatura': return 'bg-green-500'
    case 'chamado': return 'bg-orange-500'
    case 'produto': return 'bg-purple-500'
    default: return 'bg-gray-500'
  }
}

const getTypeLabel = (type: Activity['type']) => {
  switch (type) {
    case 'cliente': return 'Cliente'
    case 'assinatura': return 'Assinatura'
    case 'chamado': return 'Chamado'
    case 'produto': return 'Produto'
    default: return 'Atividade'
  }
}

export const RecentActivity = () => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Atividades Recentes</CardTitle>
        <CardDescription>
          Últimas atividades do sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" />
              <AvatarFallback className={`text-white text-xs ${getTypeColor(activity.type)}`}>
                {activity.user.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {getTypeLabel(activity.type)}
                </Badge>
                {activity.status && (
                  <Badge variant={activity.status} className="text-xs">
                    {activity.status === 'success' ? 'Sucesso' : 
                     activity.status === 'warning' ? 'Atenção' : 'Erro'}
                  </Badge>
                )}
              </div>
              <p className="text-sm">{activity.description}</p>
              <p className="text-xs text-muted-foreground">
                {activity.user} • {activity.timestamp}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
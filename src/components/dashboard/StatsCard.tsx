import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { StatCardData } from "@/types/dashboard"

interface StatsCardProps extends StatCardData {
  className?: string
}

export const StatsCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  variant = 'default',
  className 
}: StatsCardProps) => {
  const getValueColor = () => {
    switch (variant) {
      case 'success':
        return 'text-success'
      case 'warning':
        return 'text-warning'
      case 'destructive':
        return 'text-destructive'
      default:
        return ''
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", getValueColor())}>
          {value}
        </div>
        <p className="text-xs text-muted-foreground">{change}</p>
      </CardContent>
    </Card>
  )
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { RevenueData } from "@/types/dashboard"

interface RevenueChartProps {
  data: RevenueData[]
}

export const RevenueChart = ({ data }: RevenueChartProps) => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Evolução da Receita</CardTitle>
        <CardDescription>
          Receita mensal dos últimos 6 meses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
              className="fill-muted-foreground"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              className="fill-muted-foreground"
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              formatter={(value: number, name: string) => [
                name === 'receita' ? `R$ ${value.toLocaleString('pt-BR')}` : value,
                name === 'receita' ? 'Receita' : name === 'assinaturas' ? 'Assinaturas' : 'Clientes'
              ]}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="receita" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              name="Receita"
            />
            <Line 
              type="monotone" 
              dataKey="assinaturas" 
              stroke="hsl(var(--secondary))" 
              strokeWidth={2}
              name="Assinaturas"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
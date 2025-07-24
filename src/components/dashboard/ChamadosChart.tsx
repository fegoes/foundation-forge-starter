import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

interface ChamadosData {
  status: string
  quantidade: number
  fill: string
}

interface ChamadosChartProps {
  data: ChamadosData[]
}

export const ChamadosChart = ({ data }: ChamadosChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Chamados por Status</CardTitle>
        <CardDescription>
          Distribuição dos chamados técnicos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="status" 
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
              formatter={(value: number) => [value, 'Chamados']}
            />
            <Bar 
              dataKey="quantidade" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
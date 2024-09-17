import react, { useEffect, useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { api } from '@/axiosConfig'
import { Project, ProjectChart } from '@/types/projectsTypes'

const chartConfig = {
  projects: {
    label: "Projects",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function GraphComponent() {
  const [timeRange, setTimeRange] = useState("90d")
  const [filteredData, setFilteredData] = useState<ProjectChart[]>([])

  useEffect(() => {
    api.get<Project[]>('/projetos')
      .then(res => {
        const contadorPorDia: Record<string, number> = {}

        res.data.forEach((projeto: Project) => {
          const endDate = new Date(projeto.data_fim)

          if (isNaN(endDate.getTime())) {
            console.warn(`Data de fim inválida para o projeto ${projeto.id}: ${projeto.data_fim}`)
            return
          }

          const dateString = endDate.toISOString().split('T')[0]
          contadorPorDia[dateString] = (contadorPorDia[dateString] || 0) + 1
        })

        const dadosFormatados: ProjectChart[] = Object.keys(contadorPorDia).map(dia => ({
          dia,
          Projetos: contadorPorDia[dia]
        }))

        const now = new Date()
        let daysToSubtract = 90
        if (timeRange === "30d") {
          daysToSubtract = 30
        } else if (timeRange === "7d") {
          daysToSubtract = 7
        }
        now.setDate(now.getDate() - daysToSubtract)


        const filtered = dadosFormatados.filter(item => new Date(item.dia).getTime() >= now.getTime())
        setFilteredData(filtered)
      })
      .catch(error => {
        console.error('Erro ao buscar dados:', error)
      })
  }, [timeRange])

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Data de fim</CardTitle>
          <CardDescription>
            Mostrando a quantidade de projetos por data de fim
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillProjects" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-projects)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-projects)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="dia"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(valor) => valor.slice(5)}
            />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="Projetos"
              type="natural"
              fill="url(#fillProjects)"
              stroke="var(--color-projects)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

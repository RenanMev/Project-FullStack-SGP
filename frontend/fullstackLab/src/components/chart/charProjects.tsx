
import  { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { api } from '@/axiosConfig';
import { Project, ProjectChart } from '@/types/projectsTypes';

const chartConfig = {
  projects: {
    label: "Projetos",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function CharProjects() {
  const [dadosDoGrafico, setDadosDoGrafico] = useState<ProjectChart[]>([]);

  useEffect(() => {
    api.get<Project[]>('/projetos')
      .then(res => {
        const contadorPorDia: Record<string, number> = {};

        res.data.forEach((projeto: Project) => {
          const startDate = new Date(projeto.data_inicio);

          if (isNaN(startDate.getTime())) {
            console.warn(`Data de início inválida para o projeto ${projeto.id}: ${projeto.data_inicio}`);
            return;
          }

          const dateString = startDate.toISOString().split('T')[0];
          contadorPorDia[dateString] = (contadorPorDia[dateString] || 0) + 1;
        });

        const dadosFormatados: ProjectChart[] = Object.keys(contadorPorDia).map(dia => ({
          dia,
          Projetos: contadorPorDia[dia]
        }));

        setDadosDoGrafico(dadosFormatados);

      })
      .catch(error => {
        console.error('Erro ao buscar dados:', error);
      });
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle> Data de Início</CardTitle>
        <CardDescription>
          Mostrando a quantidade de projetos por data de início
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={dadosDoGrafico}
            margin={{
              left: 12,
              right: 12,
              top: 24,
              bottom: 24
            }}
            width={window.innerWidth * 0.9}
          >
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
               type="monotone"
               fill={chartConfig.projects.color}
               fillOpacity={0.3}
               stroke={chartConfig.projects.color}
               strokeWidth={2}
               stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      
    </Card>
  );
}

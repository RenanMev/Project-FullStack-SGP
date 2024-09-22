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
        const contadorPorDia: Record<string, { count: number; userId: string }> = {};

        res.data.forEach((projeto: Project) => {
          const startDate = new Date(projeto.data_inicio);

          if (isNaN(startDate.getTime())) {
            console.warn(`Data de início inválida para o projeto ${projeto.id}: ${projeto.data_inicio}`);
            return;
          }

          const dateString = startDate.toISOString().split('T')[0];
          if (!contadorPorDia[dateString]) {
            contadorPorDia[dateString] = { count: 0, userId: projeto.id.toString() };
          }

          contadorPorDia[dateString].count += 1;
        });

        const dadosFormatados: ProjectChart[] = Object.keys(contadorPorDia).map(dia => ({
          dia,
          Projetos: contadorPorDia[dia].count,
          userId: contadorPorDia[dia].userId,
        }));

        setDadosDoGrafico(dadosFormatados);
      })
      .catch(error => {
        console.error('Erro ao buscar dados:', error);
      });
  }, []);

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Data de Início</CardTitle>
          <CardDescription>
            Mostrando a quantidade de projetos por data de início
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={dadosDoGrafico}>
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
  );
}

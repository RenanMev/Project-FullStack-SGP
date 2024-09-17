import React, { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from '@/axiosConfig';
import { Project, ProjectChart } from '@/types/projectsTypes';

const chartConfig = {
  projects: {
    label: "Projetos",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export const GraphComponentFilter = () => {
  const [allProjects, setAllProjects] = useState<ProjectChart[]>([]);
  const [userProjects, setUserProjects] = useState<ProjectChart[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | undefined>(undefined);
  const [filteredData, setFilteredData] = useState<ProjectChart[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    api.get('/usuarios')
      .then(res => {
        setUsers(res.data); 
      })
      .catch(error => {
        console.error('Erro ao buscar usuários:', error);
      });
  }, []);

  useEffect(() => {
    api.get<Project[]>('/projetos')
      .then(res => {
        const contadorPorDia: Record<string, number> = {};

        res.data.forEach((projeto: Project) => {
          const endDate = new Date(projeto.data_fim);

          if (isNaN(endDate.getTime())) {
            console.warn(`Data de fim inválida para o projeto ${projeto.id}: ${projeto.data_fim}`);
            return;
          }

          const dateString = endDate.toISOString().split('T')[0];
          contadorPorDia[dateString] = (contadorPorDia[dateString] || 0) + 1;
        });

        const dadosFormatados: ProjectChart[] = Object.keys(contadorPorDia).map(dia => ({
          dia,
          Projetos: contadorPorDia[dia],
        }));

        setAllProjects(dadosFormatados);
      })
      .catch(error => {
        console.error('Erro ao buscar dados de todos os projetos:', error);
      });
  }, []);

  useEffect(() => {
    if (!selectedUser) return; 

    api.get<Project[]>(`/projetos/${selectedUser}`)
      .then(res => {
        const contadorPorDia: Record<string, number> = {};

        res.data.forEach((projeto: Project) => {
          const endDate = new Date(projeto.data_fim);

          if (isNaN(endDate.getTime())) {
            console.warn(`Data de fim inválida para o projeto ${projeto.id}: ${projeto.data_fim}`);
            return;
          }

          const dateString = endDate.toISOString().split('T')[0];
          contadorPorDia[dateString] = (contadorPorDia[dateString] || 0) + 1;
        });

        const dadosFormatados: ProjectChart[] = Object.keys(contadorPorDia).map(dia => ({
          dia,
          Projetos: contadorPorDia[dia],
        }));

        setUserProjects(dadosFormatados);
      })
      .catch(error => {
        console.error('Erro ao buscar projetos do usuário:', error);
      });
  }, [selectedUser]);

  useEffect(() => {
    setFilteredData(selectedUser ? userProjects : allProjects);
  }, [selectedUser, allProjects, userProjects]);

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Projetos por Data</CardTitle>
          <CardDescription>
            Mostrando a quantidade de projetos por data de fim
          </CardDescription>
        </div>
        <Select 
          value={selectedUser} 
          onValueChange={(value) => setSelectedUser(value === 'Todos os usuários' ? undefined : value)}
        >
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Selecione um usuário"
          >
            <SelectValue placeholder="Todos os usuários" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value={'Todos os usuários'} className="rounded-lg">
              Todos os usuários
            </SelectItem>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id} className="rounded-lg">
                {user.nome}
              </SelectItem>
            ))}
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
                  stopOpacity={0.85}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-projects)"
                  stopOpacity={0.2}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" strokeOpacity={0.5} />
            <XAxis
              dataKey="dia"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(valor) => valor.slice(5)}
              style={{ fontSize: "12px", fill: "var(--text-muted)" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              style={{ fontSize: "12px", fill: "var(--text-muted)" }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />} 
            />
            <Area
              dataKey="Projetos"
              type="monotone" 
              fill="url(#fillProjects)"
              stroke="var(--color-projects)"
              strokeWidth={2}
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

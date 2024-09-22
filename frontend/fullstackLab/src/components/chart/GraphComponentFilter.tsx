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
import { Project, ProjectChart } from '@/types/projectsTypes';
import { api } from "@/axiosConfig";

const chartConfig = {
  projects: {
    label: "Projetos",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface GraphComponentFilterProps {
  projects: Project[];
  users: { id: string; nome: string }[];
}

export const GraphComponentFilter: React.FC<GraphComponentFilterProps> = ({ projects, users }) => {
  const [filteredData, setFilteredData] = useState<ProjectChart[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | undefined>(undefined);

  const formatData = (projects: Project[]) => {
    const countForDay: Record<string, { count: number; userId: string }> = {};

    projects.forEach((projeto: Project) => {
      const endDate = new Date(projeto.data_fim);

      if (isNaN(endDate.getTime())) {
        console.warn(`Data de fim inválida para o projeto ${projeto.id}: ${projeto.data_fim}`);
        return;
      }

      const dateString = endDate.toISOString().split('T')[0];
      if (!countForDay[dateString]) {
        countForDay[dateString] = { count: 0, userId: selectedUser || '' };
      }

      countForDay[dateString].count += 1;
    });

    return Object.keys(countForDay).map(dia => ({
      dia,
      Projetos: countForDay[dia].count,
      userId: countForDay[dia].userId,
    }));
  };

  const getDataForFilter = async (idUser: string) => {
    return api.get(`/projetos/${idUser}/projetos`)
      .then(res => formatData(res.data))
      .catch(err => {
        console.log(err)
        return [];
      });
  };

  useEffect(() => {
    if (!selectedUser) {
      setFilteredData(formatData(projects));
    } else {
      getDataForFilter(selectedUser)
      .then(data => {
        setFilteredData(data);
      });
    }
  }, [selectedUser, projects]);

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
            className="w-[160px] rounded-xl sm:ml-auto"
            aria-label="Selecione um usuário"
          >
            <SelectValue placeholder="Todos os usuários" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value={'Todos os usuários'} className="rounded-xl">
              Todos os usuários
            </SelectItem>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id} className="rounded-xl">
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

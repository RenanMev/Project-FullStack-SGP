import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard } from 'lucide-react';
import { CharProjects } from '@/components/chart/charProjects';
import { GraphComponent } from '@/components/chart/GraphComponent';
import { GraphComponentFilter } from '@/components/chart/GraphComponentFilter';
import { useEffect, useState } from 'react';
import { api } from '@/axiosConfig';
import { Project } from '@/types/projectsTypes';
import { Badge } from "@/components/ui/badge";

interface User {
  id: string;
  nome: string;
}

const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]); 
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    Promise.all([
      api.get<Project[]>('/projetos'),
      api.get<User[]>('/usuarios')
    ])
    .then(([projectsRes, usersRes]) => {
      setProjects(projectsRes.data);
      setUsers(usersRes.data);
    })
    .catch(err => {
      console.error('Erro ao buscar dados:', err);
    })
    .finally(() => {
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <div>Carregando...</div>; 
  }

  return (
    <section className="min-h-screen h-full w-full p-6">
      <div>
        <div className="flex gap-4 items-center">
          <div>
            <LayoutDashboard className="w-8 h-8" />
          </div>
          <h1 className="font-bold text-3xl">Dashboard</h1>
        </div>
        <div className="mt-5">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                <div className="text-lg opacity-60">Projetos criados!</div>
                <div className="text-4xl mt-2 flex gap-6">
                  Totais de projetos: {projects.length}
                  {projects.length > 600 && (
                    <Badge variant="default">
                      Muitos projetos criados até o momento!
                    </Badge>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <div className="p-7">
              <GraphComponentFilter users={users} projects={projects} />
            </div>
            <div className="p-7 flex-1 gap-2">
              <div className="gap-5 justify-around flex xl:flex-row md:flex-col">
                <div className="flex-1">
                  <CharProjects />
                </div>
                <div className="flex-1">
                  <GraphComponent />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;

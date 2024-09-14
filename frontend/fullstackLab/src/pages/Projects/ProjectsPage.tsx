import { api } from '@/axiosConfig'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import CardProjects from '@/components/ui/CardProjects'
import { useTheme } from '@/context/ThemeContext'
import { ChartNoAxesGantt } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Project } from '@/types/projectsTypes' // Certifique-se de importar o tipo Project

const ProjectsList: React.FC = () => {
  const { darkMode } = useTheme()
  const [listProjects, setListProjects] = useState<Project[]>([]) // Definido como um array de Project

  const fetchListProjects = () => {
    api.get('/projetos')
      .then((res) => {
        setListProjects(res.data) // Acessar dados da resposta
      })
      .catch((error) => {
        console.error('Erro ao buscar projetos:', error);
      });
  }

  useEffect(() => {
    fetchListProjects();
  }, []);

  return (
    <section className={`${darkMode ? "bg-neutral-950" : "bg-white"} h-screen w-full p-6`}>
      <div className='flex gap-4 items-center'>
        <div className={`${darkMode ? "text-white" : "text-neutral-950"}`}>
          <ChartNoAxesGantt className='w-8 h-8' />
        </div>
        <h1 className={`${darkMode ? "text-white" : "text-neutral-950"} font-bold text-3xl`}>Projetos</h1>
      </div>
      <div className='mt-5'>
        <Card>
          <CardHeader>
            <CardDescription>
              Você consegue verificar todos os projetos que foram criados
            </CardDescription>
          </CardHeader>
          <CardContent className='w-full overflow-x-auto'>
            <CardProjects data={listProjects} /> {/* Passando a lista de projetos */}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default ProjectsList

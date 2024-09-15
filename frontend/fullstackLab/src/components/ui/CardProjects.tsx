import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Project } from '@/types/projectsTypes';
import { Eye, Pencil } from 'lucide-react';
import ViewProjectDialog from './ViewProjectDialog';
import EditProjectDialog from './EditProjectDialog';

interface CardProjectsProps {
  data: Project[];
}

const CardProjects: React.FC<CardProjectsProps> = ({ data }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);

  const handleEditClick = (project: Project) => {
    console.log(project)
    setSelectedProject(project);
    setOpenEditDialog(true);
  };

  const handleViewClick = (project: Project) => {
    setSelectedProject(project);
    setOpenViewDialog(true);
  };

  const handleDeleteProject = (id: number) => {
    console.log('Deletar projeto com id:', id);
    setOpenEditDialog(false);
  };

  const handleSaveProject = (updatedProject: Project) => {
    console.log('Projeto salvo:', updatedProject);
  };

  return (
    <div className="flex gap-8 p-4">
      {data.map((project) => (
        <Card key={project.id} className='max-w-96 min-w-80'>
          <CardHeader>
            <CardTitle>
              <h3>{project.nome}</h3>
            </CardTitle>
            <CardDescription>
              <p>{project.descricao}</p>
            </CardDescription>
          </CardHeader>
          <CardContent className='max-w-80 overflow-auto'>
            <div className='flex justify-between'>
              <div className='flex flex-col'>
                <p>{new Date(project.data_inicio).toLocaleDateString()}</p>
                <p>{new Date(project.data_fim).toLocaleDateString()}</p>
                <p>Status: {project.status}</p>
              </div>
              <div className='gap-2 flex-col'>
                <div
                  className='cursor-pointer hover:bg-stone-50 m-2 hover:text-black rounded-full p-1 w-10 h-10 justify-center items-center flex'
                  onClick={() => handleEditClick(project)}
                >
                  <Pencil />
                </div>
                <div
                  className='cursor-pointer hover:bg-stone-50 m-2 hover:text-black rounded-full p-1 w-10 h-10 justify-center items-center flex'
                  onClick={() => handleViewClick(project)}
                >
                  <Eye />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <EditProjectDialog
        project={selectedProject}
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        onDelete={handleDeleteProject}
        onSave={handleSaveProject}
      />

      <ViewProjectDialog
        project={selectedProject}
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
      />
    </div>
  );
};

export default CardProjects;

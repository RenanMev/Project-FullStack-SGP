import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Project } from '@/types/projectsTypes';
import { Eye, Pencil } from 'lucide-react';
import ViewProjectDialog from './ViewProjectDialog';
import EditProjectDialog from './EditProjectDialog';
import { api } from '@/axiosConfig';
import Notification from './notification';

interface CardProjectsProps {
  data: Project[];
}

const CardProjects: React.FC<CardProjectsProps> = ({ data }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const [titleAlert, setTitleAlert] = useState('');
  const [messageAlert, setMessageAlert] = useState('');
  const [collaborators, setCollaborators] = useState<any>([])

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
    api.delete(`/projetos/${id}`)
      .then(res => {
        setTitleAlert('Deletar');
        setMessageAlert('Projeto deletado com sucesso!');
        setOpenNotification(true);
        setOpenEditDialog(false);
        window.location.reload();
      })
    setOpenEditDialog(false);
  };

  const getUser = () => {
    api.get('usuarios').then((res) => {
      setCollaborators(res.data)
    })
  }


  const handleSaveProject = async (updatedProject: Project, idColaboradores: number) => {
    let userChangeSucess = false;

    if (idColaboradores && idColaboradores > 0) {
      await api.post(`/projetos/${updatedProject.id}/usuarios`, { usuario_id: idColaboradores })
        .then((res) => {
          userChangeSucess = true;
        })
        .catch((err) => {
          setTitleAlert('Erro');
          setMessageAlert(err.response?.data?.error || 'Erro desconhecido');
          setOpenNotification(true);
          setOpenEditDialog(false);
          return;
        });
    } else {
      userChangeSucess = true;
    }

    if (userChangeSucess) {
      await api.put(`projetos/${updatedProject.id}`, updatedProject)
        .then((res) => {
          if (res.status === 200) {
            setTitleAlert('Alteração');
            setMessageAlert(userChangeSucess
              ? 'Projeto e colaborador alterado com sucesso!'
              : 'Projeto alterado com sucesso!');
            setOpenNotification(true);
            setOpenEditDialog(false);
            window.location.reload();
          }
        })
        .catch((error) => {
          console.error('Erro ao fazer a requisição:', error);
          setTitleAlert('Erro');
          setMessageAlert('Erro ao salvar o projeto.');
          setOpenNotification(true);
        });
    }
  };



  useEffect(() => {
    getUser()
  }, [])




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
        collaborators={collaborators}
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

      {openNotification && (
        <Notification
          variant="default"
          title={titleAlert}
          description={messageAlert}
          onClose={() => setOpenNotification(false)}
        />
      )}
    </div>
  );
};

export default CardProjects;

import { api } from '@/axiosConfig';
import { Card, CardContent, CardTitle, CardFooter } from '@/components/ui/card';
import { LoadingIndicator } from '@/components/ui/LoadingIndicator';
import Notification from '@/components/ui/notification';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from '@/components/ui/alert-dialog';

const EditProject = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [openNotification, setOpenNotification] = useState<boolean>(false);
  const [notification, setNotification] = useState({ title: '', description: '' });
  const [projectUsers, setProjectUsers] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [userPermissions, setUserPermissions] = useState<any>({});

  const fetchProject = () => {
    setLoading(true);
    api.get(`/projetos/${id}`)
      .then((res) => {
        setProject(res.data);
      })
      .catch((err) => {
        setOpenNotification(true);
        setNotification({ title: 'Erro ao buscar projeto', description: `${err}, erro ao buscar o projeto` });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchUsersInProject = () => {
    api.get(`/projetos/${id}/usuarios`)
      .then(res => {
        setProjectUsers(res.data);
      })
      .catch(err => {
        setOpenNotification(true);
        setNotification({ title: 'Erro ao buscar usuários do projeto', description: `${err}, erro ao buscar os usuários do projeto` });
      });
  };

  const fetchAllUsers = () => {
    api.get('/usuarios')
      .then(res => {
        setAllUsers(res.data);
      })
      .catch(err => {
        setOpenNotification(true);
        setNotification({ title: 'Erro ao buscar todos os usuários', description: `${err}, erro ao buscar todos os usuários` });
      });
  };

  const fetchUserPermissions = () => {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        setUserPermissions(JSON.parse(userData));
      } else {
        setUserPermissions({});
      }
    } catch (error) {
      console.error('Erro ao buscar permissões do usuário:', error);
      setUserPermissions({});
    }
  };

  useEffect(() => {
    fetchProject();
    fetchUsersInProject();
    fetchAllUsers();
    fetchUserPermissions();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setProject({ ...project, [name]: value });
  };

  const handleDateChange = (name: string, date: Date | undefined) => {
    if (date) {
      const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
      setProject({ ...project, [name]: format(adjustedDate, 'yyyy-MM-dd') });
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    api.put(`/projetos/${id}`, project)
      .then(() => {
        setOpenNotification(true);
        setNotification({ title: 'Sucesso', description: 'Projeto atualizado com sucesso' });
      })
      .catch((err) => {
        setOpenNotification(true);
        setNotification({ title: 'Erro ao atualizar projeto', description: `${err}, erro ao atualizar o projeto` });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleRemoveUser = (userId: string) => {
    setLoading(true);
    api.delete(`/projetos/${id}/usuarios/${userId}`)
      .then(() => {
        fetchUsersInProject();
        setOpenNotification(true);
        setNotification({ title: 'Sucesso', description: 'Usuário removido do projeto com sucesso' });
      })
      .catch((err) => {
        setOpenNotification(true);
        setNotification({ title: 'Erro ao remover usuário', description: `${err}, erro ao remover o usuário do projeto` });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDeleteProject = () => {
    setLoading(true);
    api.delete(`/projetos/${id}`)
      .then(() => {
        setOpenNotification(true);
        setNotification({ title: 'Sucesso', description: 'Projeto deletado com sucesso' });
        navigate('/projects');
      })
      .catch((err) => {
        setOpenNotification(true);
        setNotification({ title: 'Erro ao deletar projeto', description: `${err}, erro ao deletar o projeto` });
      })
      .finally(() => {
        setLoading(false);
        setOpenDeleteDialog(false);
      });
  };

  const handleAddUser = () => {
    if (selectedUser) {
      setLoading(true);
      api.post(`/projetos/${id}/usuarios`, { usuario_id: selectedUser })
        .then(() => {
          fetchUsersInProject();
          setSelectedUser('');
          setOpenNotification(true);
          setNotification({ title: 'Sucesso', description: 'Usuário adicionado ao projeto com sucesso' });
        })
        .catch((err) => {
          setOpenNotification(true);
          setNotification({ title: 'Erro ao adicionar usuário', description: `${err}, erro ao adicionar o usuário ao projeto` });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

const havePerm = () => {
  return userPermissions && userPermissions.papel ? userPermissions.papel.includes("Gerente") : false;
};

  return (
    <div>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1200]">
          <LoadingIndicator />
        </div>
      )}
      <Card className="min-w-full min-h-full">
        <CardTitle className="p-6">
          <div className='text-2xl'>
            Edição de projetos
          </div>
        </CardTitle>
        <CardContent className="space-y-4">
          {project && (
            <>
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input id="nome" name="nome" value={project.nome} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea id="descricao" name="descricao" value={project.descricao} onChange={handleInputChange} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data de Início</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {project.data_inicio ? format(new Date(project.data_inicio), 'PPP') : <span>Selecione uma data</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={project.data_inicio ? new Date(project.data_inicio) : undefined}
                        onSelect={(date) => handleDateChange('data_inicio', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Data de Fim</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {project.data_fim ? format(new Date(project.data_fim), 'PPP') : <span>Selecione uma data</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={project.data_fim ? new Date(project.data_fim) : undefined}
                        onSelect={(date) => handleDateChange('data_fim', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select onValueChange={(value) => handleSelectChange('status', value)} value={project.status}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Em andamento">Em andamento</SelectItem>
                    <SelectItem value="Concluido">Concluído</SelectItem>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="prioridade">Prioridade</Label>
                <Select onValueChange={(value) => handleSelectChange('prioridade', value)} value={project.prioridade}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixo">Baixo</SelectItem>
                    <SelectItem value="médio">Médio</SelectItem>
                    <SelectItem value="alto">Alto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Usuários no Projeto</Label>
                <div className="flex flex-wrap gap-2">
                  {projectUsers.map((user) => (
                    <div key={user.id} className="flex items-center bg-primary text-secondary font-bold rounded-full px-3 py-1">
                      <span>{user.nome}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-2 h-5 w-5"
                        onClick={() => handleRemoveUser(user.id)}
                        aria-label={`Remover ${user.nome} do projeto`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="addUser">Adicionar Usuário</Label>
                <div className="flex gap-2">
                  <Select onValueChange={setSelectedUser} value={selectedUser}>
                    <SelectTrigger className="flex-grow">
                      <SelectValue placeholder="Selecione um usuário" />
                    </SelectTrigger>
                    <SelectContent>
                      {allUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>{user.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAddUser}>Adicionar</Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className='flex gap-5 justify-center items-center'>
          {havePerm() && (
            <Button onClick={handleSubmit} className="w-full">Salvar Alterações</Button>
          )}
          {havePerm() && (
            <Button variant="outline" onClick={() => setOpenDeleteDialog(true)} className="w-full">
              Deletar Projeto
            </Button>
          )}
        </CardFooter>
      </Card>

      {openDeleteDialog && (
        <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Deleção</AlertDialogTitle>
              <AlertDialogDescription>
                Você tem certeza que deseja deletar este projeto? Essa ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className='flex gap-5'>
              <Button className='w-full' onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
              <Button className='w-full' variant={'outline'} onClick={handleDeleteProject}>
                Deletar
              </Button>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {openNotification && (
        <Notification
          variant="default"
          title={notification.title}
          description={notification.description}
          onClose={() => setOpenNotification(false)}
        />
      )}
    </div>
  );
};

export default EditProject;

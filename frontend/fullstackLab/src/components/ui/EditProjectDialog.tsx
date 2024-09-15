import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogHeader } from './dialog';
import { Button } from './button';
import { Project } from '@/types/projectsTypes';
import { useTheme } from '@/context/ThemeContext';
import { Input } from './input';
import { Textarea } from './textarea';
import { CalendarArrowUp } from 'lucide-react';
import { Calendar } from './calendar';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from './alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { api } from '@/axiosConfig';

interface Collaborator {
  id: number;
  nome: string;
}

interface UserInProject {
  id: number;
  nome: string;
  email: string;
}

interface EditProjectDialogProps {
  project: Project | null;
  open: boolean;
  onClose: () => void;
  onDelete: (id: number) => void;
  onSave: (updatedProject: Project, id: number) => void;
  collaborators: Array<Collaborator>;
}

const EditProjectDialog: React.FC<EditProjectDialogProps> = ({ project, open, onClose, onDelete, onSave, collaborators }) => {
  const darkMode = useTheme();

  const [date, setDate] = useState<{ startDate?: Date; endDate?: Date }>({});
  const [tempDates, setTempDates] = useState<{ tempStartDate?: Date; tempEndDate?: Date }>({});
  const [selectedUserInProjects, setSelectedUserInProjects] = useState<UserInProject[]>([]);
  const [selectedCollaborator, setSelectedCollaborator] = useState<Collaborator | null>(null);
  const [openDialogCalendar, setOpenDialogCalendar] = useState<boolean>(false);
  const [editedProject, setEditedProject] = useState<Project | null>(null);
  const [usersToRemove, setUsersToRemove] = useState<number[]>([]);
  const [openAlertConfirm, setOpenAlertConfirm] = useState<boolean>(false);
  console.log(selectedCollaborator)
  const fetchUsersInProject = (idProjects: number) => {
    api.get(`projetos/${idProjects}/usuarios`)
      .then(response => {
        setSelectedUserInProjects(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar usuários do projeto:', error);
      });
  };

  useEffect(() => {
    if (project) {
      setEditedProject(project);
      const startDate = project.data_inicio ? new Date(project.data_inicio) : undefined;
      const endDate = project.data_fim ? new Date(project.data_fim) : undefined;
      setDate({ startDate, endDate });
      setTempDates({ tempStartDate: startDate, tempEndDate: endDate });
      fetchUsersInProject(project.id);
    }
  }, [project]);

  const handleTempDateChange = (key: 'tempStartDate' | 'tempEndDate', date: Date | undefined) => {
    setTempDates(prev => ({
      ...prev,
      [key]: date
    }));
  };

  const handleOpenDialogCalendar = () => {
    setOpenDialogCalendar(prev => !prev);
  };

  const handleSaveDates = () => {
    if (tempDates.tempStartDate && tempDates.tempEndDate && tempDates.tempStartDate <= tempDates.tempEndDate) {
      setDate({
        startDate: tempDates.tempStartDate,
        endDate: tempDates.tempEndDate,
      });
      setEditedProject(prev => prev ? {
        ...prev,
        data_inicio: tempDates.tempStartDate?.toISOString().split('T')[0] || '',
        data_fim: tempDates.tempEndDate?.toISOString().split('T')[0] || '',
      } : null);
      setOpenDialogCalendar(false);
    }
  };

  const handleSaveProject = useCallback(() => {
    if (!editedProject) return;

    const updatedProject = {
      ...editedProject,
      data_inicio: date.startDate ? date.startDate.toISOString().split('T')[0] : '',
      data_fim: date.endDate ? date.endDate.toISOString().split('T')[0] : '',
    };

    Promise.all(usersToRemove.map(userId =>
      api.delete(`/projetos/${project?.id}/usuarios/${userId}`)
    ))
      .then(() => {
        setUsersToRemove([]);
        if (project) {
          fetchUsersInProject(project.id);
        }
      })
      .catch(error => {
        console.error('Erro ao remover usuários do projeto:', error);
      });

    onSave(updatedProject, selectedCollaborator ? Number(selectedCollaborator.id) : 0);

  }, [editedProject, date, selectedCollaborator, onSave, usersToRemove, project?.id]);

  const handleMarkUserForRemoval = (userId: number) => {
    setUsersToRemove(prev => [...prev, userId]);

    setSelectedUserInProjects(prev => prev.filter(user => user.id !== userId));
  };


  const disabledCalendarSubmit = () => {
    return !tempDates.tempStartDate || !tempDates.tempEndDate || tempDates.tempStartDate > tempDates.tempEndDate;
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className={`${darkMode ? "bg-neutral-950 text-white" : "bg-white text-black"} w-full gap-9`}>
          <DialogTitle>Editar Projeto</DialogTitle>
          <div className="space-y-4 min-w-36">
            <Input
              type="text"
              value={editedProject?.nome || ''}
              onChange={(e) => setEditedProject(prev => prev ? { ...prev, nome: e.target.value } : null)}
              placeholder="Nome do Projeto"
              className="w-full p-2 border rounded"
            />
            <Textarea
              value={editedProject?.descricao || ''}
              onChange={(e) => setEditedProject(prev => prev ? { ...prev, descricao: e.target.value } : null)}
              placeholder="Descrição"
              className="w-full p-2 border rounded"
            />
            <div className='flex border border-neutral-700 rounded-xl p-2 gap-4 cursor-pointer' onClick={handleOpenDialogCalendar}>
              {date.startDate && date.endDate && (
                <div>
                  {date.startDate.toDateString()} - {date.endDate.toDateString()}
                </div>
              )}
              <div>
                <CalendarArrowUp />
              </div>
            </div>

            <Select
              onValueChange={(id) => {
                const selected = collaborators.find((collab) => collab.id.toString() === id);
                setSelectedCollaborator(selected || null);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={selectedCollaborator ? selectedCollaborator.nome : "Selecione um colaborador"} />
              </SelectTrigger>
              <SelectContent>
                {collaborators.length > 0 && (
                  collaborators.map((collaborator) => (
                    <SelectItem key={collaborator.id} value={collaborator.id.toString()}>
                      {collaborator.nome}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>


            <div>
              <h3>Usuários no Projeto:</h3>
              <ul>
                {selectedUserInProjects.map((user: UserInProject) => (
                  <li key={user.id} className="flex justify-between items-center">
                    <span>{user.nome} ({user.email})</span>
                    <Button variant="destructive" onClick={() => handleMarkUserForRemoval(user.id)}>x</Button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="destructive" onClick={() => setOpenAlertConfirm(true)}>
              Deletar
            </Button>
            <Button onClick={handleSaveProject}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialogCalendar} onOpenChange={handleOpenDialogCalendar}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Selecione as datas</DialogTitle>
            <DialogContent className='flex-col'>
              <div className='flex gap-7'>
                <div>
                  <p className='pb-2'>Data de Início</p>
                  <Calendar
                    mode='single'
                    selected={tempDates.tempStartDate}
                    onSelect={(date) => handleTempDateChange('tempStartDate', date)}
                    className='rounded-md border'
                  />
                </div>
                <div>
                  <p className='pb-2'>Data de Término</p>
                  <Calendar
                    mode='single'
                    selected={tempDates.tempEndDate}
                    onSelect={(date) => handleTempDateChange('tempEndDate', date)}
                    className='rounded-md border'
                  />
                </div>
              </div>
              {disabledCalendarSubmit() && (
                <div className='text-red-600'>A data inicial tem que ser menor que a data final!</div>
              )}
              <div className='flex items-end w-full justify-end gap-6'>
                <Button variant='outline' className='mt-2' onClick={() => setOpenDialogCalendar(false)}>
                  Cancelar
                </Button>
                <Button className='mt-2' onClick={handleSaveDates} disabled={disabledCalendarSubmit()}>
                  Confirmar
                </Button>
              </div>
            </DialogContent>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <AlertDialog open={openAlertConfirm} onOpenChange={() => setOpenAlertConfirm(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar projeto</AlertDialogTitle>
          </AlertDialogHeader>
          <p>Deseja deletar o projeto?</p>
          <div className='flex gap-4 justify-end'>
            <Button variant='outline' onClick={() => setOpenAlertConfirm(false)}>
              Cancelar
            </Button>
            <Button onClick={() => { if (editedProject) onDelete(editedProject.id); setOpenAlertConfirm(false); }}>
              Confirmar
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EditProjectDialog;

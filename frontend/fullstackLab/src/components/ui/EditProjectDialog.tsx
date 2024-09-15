import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogHeader } from './dialog';
import { Button } from './button';
import { Project } from '@/types/projectsTypes';
import { useTheme } from '@/context/ThemeContext';
import { Input } from './input';
import { Textarea } from './textarea';
import { CalendarArrowUp } from 'lucide-react';
import { Calendar } from './calendar';
import { api } from '@/axiosConfig';

interface EditProjectDialogProps {
  project: Project | null;
  open: boolean;
  onClose: () => void;
  onDelete: (id: number) => void;
  onSave: (updatedProject: Project) => void;
}

const EditProjectDialog: React.FC<EditProjectDialogProps> = ({ project, open, onClose, onDelete, onSave }) => {
  const darkMode = useTheme();
  const [date, setDate] = useState({
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
  });
  const [tempDates, setTempDates] = useState({
    tempStartDate: undefined as Date | undefined,
    tempEndDate: undefined as Date | undefined,
  });
  const [openDialogCalendar, setOpenDialogCalendar] = useState<boolean>(false);
  const [editedProject, setEditedProject] = useState<Project>(() => project || {
    id: 0,
    nome: '',
    descricao: '',
    data_inicio: '',
    data_fim: '',
    status: 'Em andamento',
  });


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
      setEditedProject(prev => ({
        ...prev,
        data_inicio: tempDates.tempStartDate?.toISOString().split('T')[0] || '',
        data_fim: tempDates.tempEndDate?.toISOString().split('T')[0] || '',
      }));
      setOpenDialogCalendar(false);
    }
  };

  const handleSaveProject = useCallback(() => {
    const updatedProject = {
      ...editedProject,
      data_inicio: date.startDate ? date.startDate.toISOString().split('T')[0] : '',
      data_fim: date.endDate ? date.endDate.toISOString().split('T')[0] : '',
    };

    api.put(`projetos/${editedProject.id}`, updatedProject)
      .then(res => {
        if (res.status === 200) {
          console.log(res);
          onSave(updatedProject); 
        }
      })
      .catch(error => {
        console.error('Erro ao fazer a requisição:', error);
      });
  }, [editedProject, date, onSave]);

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
              value={editedProject.nome}
              onChange={(e) => setEditedProject({ ...editedProject, nome: e.target.value })}
              placeholder="Nome do Projeto"
              className="w-full p-2 border rounded"
            />
            <Textarea
              value={editedProject.descricao}
              onChange={(e) => setEditedProject({ ...editedProject, descricao: e.target.value })}
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
          </div>
          <DialogFooter>
            <Button variant="destructive" onClick={() => onDelete(editedProject.id)}>
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
    </>
  );
};

export default EditProjectDialog;

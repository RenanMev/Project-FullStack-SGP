import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Calendar } from '@/components/ui/calendar';
import { CalendarArrowUp, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const people = [
  { id: 1, name: 'João' },
  { id: 2, name: 'Maria' },
  { id: 3, name: 'Pedro' },
];

const BodyProjects: React.FC = () => {
  const [state, setState] = useState({
    projectName: '',
    projectDescription: '',
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    responsible: undefined as number | undefined,
    participants: [] as { id: number; name: string }[],
    selectedParticipant: undefined as number | undefined,
    alertOpen: false,
    dialogCalendar: false,
  });

  const [tempDates, setTempDates] = useState({
    tempStartDate: undefined as Date | undefined,
    tempEndDate: undefined as Date | undefined,
  });

  const handleChange = (field: string, value: any) => {
    setState(prevState => ({ ...prevState, [field]: value }));
  };

  const handleTempDateChange = (field: string, value: Date | undefined) => {
    setTempDates(prevState => ({ ...prevState, [field]: value }));
  };

  const addParticipant = () => {
    if (state.selectedParticipant !== undefined) {
      const selectedPerson = people.find(p => p.id === state.selectedParticipant);
      if (selectedPerson && !state.participants.some(p => p.id === selectedPerson.id)) {
        handleChange('participants', [...state.participants, selectedPerson]);
        handleChange('selectedParticipant', undefined);
      }
    }
  };

  const disabledCalendarSubmit = () => {
    if (tempDates.tempStartDate && tempDates.tempEndDate) {
      return tempDates.tempEndDate > tempDates.tempStartDate;
    }
    return false;
  };

  const removeParticipant = (id: number) => {
    handleChange('participants', state.participants.filter(p => p.id !== id));
  };

  const validateFields = () => {
    return (
      state.projectName &&
      state.projectDescription &&
      state.startDate &&
      state.endDate &&
      state.participants.length > 0 &&
      state.responsible !== undefined &&
      state.endDate > state.startDate
    );
  };

  const startProject = () => {
    if (validateFields()) {
      handleChange('alertOpen', true);
    }
  };

  const confirmStartProject = () => {
    const project = {
      projectName: state.projectName,
      projectDescription: state.projectDescription,
      projectDeadline: { startDate: state.startDate, endDate: state.endDate },
      participants: state.participants,
      responsible: people.find(p => p.id === state.responsible)?.name,
    };
    console.log(project);
    handleChange('alertOpen', false);
  };

  const saveDates = () => {
    handleChange('startDate', tempDates.tempStartDate);
    handleChange('endDate', tempDates.tempEndDate);
    handleChange('dialogCalendar', false);
  };

  return (
    <>
      <Card className='flex-1 overflow-hidden'>
        <CardContent className='w-full flex'>
          <div className='w-full p-5 mt-4'>
            <div className='w-full mb-6'>
              <p className='pb-2'>Nome do Projeto</p>
              <Input
                placeholder='Ex.: Estudo de Português...'
                value={state.projectName}
                onChange={(e) => handleChange('projectName', e.target.value)}
              />
            </div>
            <div className='w-full mb-6'>
              <p className='pb-2'>Descreva o projeto</p>
              <Textarea
                placeholder='Ex.: Leia o livro da página 50 a 58, depois faça os exercícios'
                value={state.projectDescription}
                onChange={(e) => handleChange('projectDescription', e.target.value)}
              />
            </div>
            <div className='w-full mb-6'>
              <p className='pb-2'>Especifique o prazo do projeto</p>
              <div className='flex border border-neutral-700 rounded-xl p-2 gap-4' onClick={() => handleChange('dialogCalendar', !state.dialogCalendar)}>
                {state.startDate && state.endDate && (
                  <div>
                    {state.startDate.toDateString()} - {state.endDate.toDateString()}
                  </div>
                )}
                <div>
                  <CalendarArrowUp />
                </div>
              </div>
            </div>
          </div>
          <div className='w-full p-5 mt-4'>
            <div className='w-full mb-6'>
              <p className='mb-2'>Participantes</p>
              <div className='flex gap-4'>
                <Select
                  onValueChange={(value) => handleChange('selectedParticipant', Number(value))}
                  value={state.selectedParticipant?.toString()}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Selecione o participante' />
                  </SelectTrigger>
                  <SelectContent>
                    {people.map((person) => (
                      <SelectItem key={person.id} value={person.id.toString()}>
                        {person.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={addParticipant} disabled={state.selectedParticipant === undefined}>
                  Adicionar
                </Button>
              </div>
            </div>
            <div className='w-full mb-6 flex'>
              <div className='flex gap-4'>
                {state.participants.map((participant) => (
                  <div key={participant.id} className='flex items-center gap-2 justify-center hover:bg-white rounded-full hover:text-neutral-950 px-2 font-bold'>
                    <span>{participant.name}</span>
                    <div className='w-4 h-4 rounded-full items-center flex cursor-pointer' onClick={() => removeParticipant(participant.id)}>
                      <X />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className='w-full mb-6'>
              <p className='mb-2'>Responsável</p>
              <Select onValueChange={(value) => handleChange('responsible', Number(value))} value={state.responsible?.toString()}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Selecione a pessoa responsável' />
                </SelectTrigger>
                <SelectContent>
                  {people.map((person) => (
                    <SelectItem key={person.id} value={person.id.toString()}>
                      {person.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button className='w-full mt-2' onClick={startProject} disabled={!validateFields()}>
                Iniciar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={state.dialogCalendar} onOpenChange={() => handleChange('dialogCalendar', !state.dialogCalendar)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Selecione as datas</DialogTitle>
            <DialogContent className='flex-col'>
              <div className='flex gap-7'>
                <div className=''>
                  <p className='pb-2'>Data de Início</p>
                  <Calendar
                    mode='single'
                    selected={tempDates.tempStartDate}
                    onSelect={(date) => handleTempDateChange('tempStartDate', date)}
                    className='rounded-md border'
                  />
                </div>
                <div className=''>
                  <p className='pb-2'>Data de Término</p>
                  <Calendar
                    mode='single'
                    selected={tempDates.tempEndDate}
                    onSelect={(date) => handleTempDateChange('tempEndDate', date)}
                    className='rounded-md border'
                  />
                </div>
              </div>
              {!disabledCalendarSubmit() && (
                <div className='text-red-600'>A data inicial tem que ser menor que a data final!</div>
              )}
              <div className='flex items-end w-full justify-end gap-6'>
                <div>
                  <Button variant='outline' className='mt-2' onClick={() => handleChange('dialogCalendar', false)}>
                    Cancelar
                  </Button>
                </div>
                <div>
                  <Button className='mt-2' onClick={saveDates} disabled={!disabledCalendarSubmit()}>
                    Confirmar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <AlertDialog open={state.alertOpen} onOpenChange={() => handleChange('alertOpen', false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
          </AlertDialogHeader>
          <p>Deseja iniciar o projeto com as informações fornecidas?</p>
          <div className='flex gap-4 justify-end'>
            <Button variant='outline' onClick={() => handleChange('alertOpen', false)}>
              Cancelar
            </Button>
            <Button onClick={confirmStartProject}>Confirmar</Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BodyProjects;

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Pencil, Users } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const initialCollaborators = [
  { id: 1, name: 'João', role: 'Desenvolvedor' },
  { id: 2, name: 'Maria', role: 'Designer' },
  { id: 3, name: 'Pedro', role: 'Gerente' },
  { id: 3, name: 'Pedro', role: 'Gerente' },
  { id: 3, name: 'Pedro', role: 'Gerente' },
  { id: 3, name: 'Pedro', role: 'Gerente' },
  { id: 3, name: 'Pedro', role: 'Gerente' },
  { id: 3, name: 'Pedro', role: 'Gerente' },
  { id: 3, name: 'Pedro', role: 'Gerente' },
  { id: 3, name: 'Pedro', role: 'Gerente' },
  { id: 3, name: 'Pedro', role: 'Gerente' },
  { id: 3, name: 'Pedro', role: 'Gerente' },
  { id: 3, name: 'Pedro', role: 'Gerente' },
  { id: 3, name: 'Pedro', role: 'Gerente' },
];

const roles = ['Desenvolvedor', 'Designer', 'Gerente', 'Analista', 'QA'];

const Collaborators: React.FC = () => {
  const darkMode = useTheme()
  const [collaborators, setCollaborators] = useState(initialCollaborators);
  const [editingCollaborator, setEditingCollaborator] = useState<{ id: number; name: string; role: string } | null>(null);

  const [tempRole, setTempRole] = useState<string | undefined>(undefined);

  const handleEdit = (collaborator: { id: number; name: string; role: string }) => {
    setEditingCollaborator(collaborator);
    setTempRole(collaborator.role);
  };

  const handleSave = () => {
    if (editingCollaborator && tempRole) {
      setCollaborators(prevCollaborators =>
        prevCollaborators.map(c =>
          c.id === editingCollaborator.id ? { ...c, role: tempRole } : c
        )
      );
      setEditingCollaborator(null);
    }
  };

  return (
    <>
      <div className='w-full bg-neutral-950 h-screen '>
        <Card className='w-full h-full overflow-auto'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <div className='w-6 h-6'>
                <Users />
              </div>
              <div className='text-3xl font-bold'>
                Colaboradores
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {collaborators.map((collaborator) => (
                <div key={collaborator.id} className='flex justify-between items-center p-2 border rounded-md'>
                  <div>
                    <p>{collaborator.name}</p>
                    <p className='text-sm text-neutral-500'>{collaborator.role}</p>
                  </div>
                  <Button onClick={() => handleEdit(collaborator)} variant='outline' className='flex items-center'>
                    <Pencil className='mr-2' size={16} /> Editar
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Dialog open={editingCollaborator !== null} onOpenChange={() => setEditingCollaborator(null)}>
          <DialogContent className={`${darkMode ? "bg-neutral-950 text-white" : "bg-white text-black"} min-w-96`}>
            <DialogHeader>
              <DialogTitle>Editar Colaborador</DialogTitle>
            </DialogHeader>
            <div className='space-y-4'>
              <div>
                <p>Nome</p>
                <Input value={editingCollaborator?.name} readOnly />
              </div>
              <div>
                <p>Cargo</p>
                <Select onValueChange={(value) => setTempRole(value)} value={tempRole}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Selecione o cargo' />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='flex justify-end gap-4'>
                <Button variant='outline' className={`${darkMode ? "bg-neutral-950 text-white" : "bg-white text-black"}`} onClick={() => setEditingCollaborator(null)}>
                  Cancelar
                </Button>
                <Button variant='outline' onClick={handleSave} className={`${darkMode ? "bg-neutral-950 text-white" : "bg-white text-black"}`} disabled={!tempRole}>
                  Salvar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default Collaborators;

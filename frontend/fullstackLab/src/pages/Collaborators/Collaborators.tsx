import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Pencil, Users } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { api } from '@/axiosConfig';

const papels = ['Desenvolvedor', 'Designer', 'Gerente', 'Analista', 'QA'];

const Collaborators: React.FC = () => {
  const darkMode = useTheme();

  const [collaborators, setCollaborators] = useState<{ id: number; nome: string; papel: string; email: string }[]>([]);
  const [editingCollaborator, setEditingCollaborator] = useState<{ id: number; nome: string; papel: string; email: string } | null>(null);
  const [temppapel, setTemppapel] = useState<string | undefined>(undefined);
  const [disabledPerm, setDisabledPerm] = useState<boolean>(false);
  const [user, setUser] = useState<any>(false);

  const userData = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')!) : null;

  const validUser = () => {
    if (userData) {
      api.get(`/usuarios/${userData.id}`)
        .then(res => {
          if (res.data.papel !== 'Gerente') {
            setDisabledPerm(true)
            setUser(res.data)
          }
        })
        .catch(error => {
          console.error('Erro ao buscar dados do usuário:', error);
        });
    }
  };

  useEffect(() => {
    if (userData) {
      validUser();
    }
  }, [userData]);

  useEffect(() => {
    const fetchCollaborators = () => {
      api.get('/usuarios')
        .then(res => {
          setCollaborators(res.data);
        })
        .catch(err => {
          console.error('Erro ao buscar colaboradores:', err);
        });
    };

    fetchCollaborators();
  }, []);

  const handleEdit = (collaborator: { id: number; nome: string; papel: string; email: string }) => {

    setEditingCollaborator(collaborator);
    setTemppapel(collaborator.papel);
  };

  const handleSave = () => {
    if (editingCollaborator && temppapel) {
      api.put(`/edituser/${editingCollaborator.id}`, {
        ...editingCollaborator,
        papel: temppapel,
      })
        .then(() => {
          setCollaborators(prevCollaborators =>
            prevCollaborators.map(c =>
              c.id === editingCollaborator.id ? { ...c, papel: temppapel } : c
            )
          );
          setEditingCollaborator(null);
        })
        .catch((error) => {
          console.error('Erro ao salvar as alterações:', error);
        });
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
                <div key={collaborator.id} className={`flex justify-between items-center p-2 border rounded-xl ${disabledPerm && collaborator.id !== user.id ? 'opacity-60' : ''}`}>
                  <div>
                    <p className='font-semibold'>{collaborator.nome}</p>
                    <p className='text-sm text-neutral-500'>{collaborator.papel}</p>
                    <p className='text-sm text-neutral-500'>{collaborator.email}</p>
                  </div>
                  <Button
                    onClick={() => handleEdit(collaborator)}
                    variant='outline'
                    disabled={disabledPerm && collaborator.id !== user.id }
                    className='flex items-center'
                    aria-label={`Editar ${collaborator.nome}`}
                  >
                    <Pencil className='mr-2' size={16} /> Editar
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Dialog
          open={editingCollaborator !== null}
          onOpenChange={() => setEditingCollaborator(null)}
        >
          <DialogContent
            className={`${darkMode ? "bg-neutral-950 text-white" : "bg-white text-black"} min-w-[400px]`}
          >
            <DialogHeader>
              <DialogTitle>Editar Colaborador</DialogTitle>
            </DialogHeader>
            <div className='space-y-4'>
              <div>
                <p className='pt-2 mb-3'>Nome</p>
                <Input value={editingCollaborator?.nome} readOnly />
              </div>
              <div >
                <p className='pt-2 mb-3'>Cargo</p>
                <Select
                  disabled={disabledPerm}
                  onValueChange={(value) => setTemppapel(value)}
                  value={temppapel}
                  aria-label='Selecione o cargo'
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Selecione o cargo' />
                  </SelectTrigger>
                  <SelectContent>
                    {papels.map((papel) => (
                      <SelectItem key={papel} value={papel}>
                        {papel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='pb-6'>
                <p className='pt-2 mb-3'>Email</p>
                <Input disabled={disabledPerm} value={editingCollaborator?.email} readOnly />
              </div>
              <div className='flex justify-end gap-4'>
                <Button
                  variant='outline'
                  className={`${darkMode ? "bg-neutral-950 text-white" : "bg-white text-black"}`}
                  onClick={() => setEditingCollaborator(null)}
                  aria-label='Cancelar edição'
                >
                  Cancelar
                </Button>
                <Button
                  variant='outline'
                  onClick={handleSave}
                  className={`${darkMode ? "bg-neutral-950 text-white" : "bg-white text-black"}`}
                  disabled={!temppapel}
                  aria-label='Salvar alterações'
                >
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

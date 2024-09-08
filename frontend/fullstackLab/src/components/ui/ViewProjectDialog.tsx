import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from './dialog';
import { Project } from '@/types/projectsTypes';
import { useTheme } from '@/context/ThemeContext';

interface ViewProjectDialogProps {
  project: Project | null;
  open: boolean;
  onClose: () => void;
}

const ViewProjectDialog: React.FC<ViewProjectDialogProps> = ({ project, open, onClose }) => {
  const darkMode = useTheme()

  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={`${darkMode ? "bg-neutral-950 text-white" : "bg-white text-black"} w-1/3`}>
        <DialogTitle>{project.nome}</DialogTitle>
        <p>{project.descricao}</p>
        <p>Data de Início: {new Date(project.data_inicio).toLocaleDateString()}</p>
        <p>Data de Fim: {new Date(project.data_fim).toLocaleDateString()}</p>
        <p>Status: {project.status}</p>
        <p>Responsável: {project.responsibleName}</p>
        <div>
          <p>Colaboradores:</p>
          <ul>
            {project.collaborators.length > 0 ? (
              project.collaborators.map((collaborator) => (
                <li key={collaborator.id}>{collaborator.name}</li>
              ))
            ) : (
              <li>Nenhum colaborador</li>
            )}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewProjectDialog;

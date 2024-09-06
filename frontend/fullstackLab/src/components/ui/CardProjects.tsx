import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { projectsTypes } from '@/types/projectsTypes';

const CardProjects: React.FC = () => {
  return (
    <div className="flex gap-8 p-4">
      {projectsTypes.map((project) => (
        <Card key={project.id} className='max-w-96 min-w-80 '>
          <CardHeader>
            <CardTitle>
              <h3>{project.nome}</h3>
            </CardTitle>
            <CardDescription>
              <p>{project.descricao}</p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex'>
              <p>{new Date(project.data_inicio).toLocaleDateString()}</p> -
              <p>{new Date(project.data_fim).toLocaleDateString()}</p>
            </div>
            <p>Status: {project.status}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CardProjects;

import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import "@/assets/style/scrollBarStyle.css";

interface Project {
  title: string;
  nome: string;
  description: string;
  dataDeInicio: string;
  dataFim: string;
  status: string;
  colaboradores: string[];
}

const MAX_COLABORADORES_LENGTH = 20;

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

const ProjectCard: React.FC = () => {
  const projects: Project[] = Array(6).fill({
    title: "Projeto Destaque",
    nome: "Nome do projeto",
    description: "Essa é a descrição do projeto. A descrição pode ser longa, mas será truncada se exceder o limite de caracteres.",
    dataDeInicio: "20/12/2024",
    dataFim: "30/12/2024",
    status: "Em andamento",
    colaboradores: ["Ana", "Carlos", "João", "Maria", "Pedro", "Lucas"]
  });

  return (
    <Card className="p-4 shadow-lg rounded-lg">
      <CardHeader className="mb-4">
        <CardTitle className="text-xl">Projetos</CardTitle>
      </CardHeader>
      <CardContent className="scroll-container flex overflow-x-auto space-x-6 pb-4">
        {projects.map((project, index) => (
          <Card key={index} className="flex-none max-w-xs min-w-[30rem] border border-gray-300 rounded-lg p-1">
            <CardHeader className="mb-2">
              <CardTitle className="text-xl">{project.title}</CardTitle>
              <CardDescription>{project.nome}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{truncateText(project.description, 100)}</p>
              <p className="text-xs">Data de Início: {project.dataDeInicio}</p>
              <p className="text-xs">Data de Fim: {project.dataFim}</p>
              <p className="text-xs font-bold mt-2">Status: {project.status}</p>
              <p className="text-xs mt-2">
                Colaboradores: {truncateText(project.colaboradores.join(", "), MAX_COLABORADORES_LENGTH)}
              </p>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

export default ProjectCard;

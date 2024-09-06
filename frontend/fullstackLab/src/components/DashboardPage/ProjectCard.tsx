import React from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";


const ProjectCard: React.FC = () => {
  return (
    <Link to="/projects" className="">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Projetos</CardTitle>
        </CardHeader>
        <CardContent className="flex">
          <Card className={`max-w-80 min-w-60`}>
            <CardHeader>
              <CardTitle className="text-xl">Projeto Destaque</CardTitle>
              <CardDescription>Nome do projeto</CardDescription>
            </CardHeader>
            <CardContent>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProjectCard;

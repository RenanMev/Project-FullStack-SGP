import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  SquareKanban,
  CircleFadingPlus,
  ChartNoAxesGantt,
  Users,
  Terminal,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Button } from '../ui/button';
import EditUserDialog from '../ui/SettingsDialog';
import { LogoutIsAcout } from '@/services/utils/auth';
import { useUser } from '@/context/UserContext';


const Sidebar: React.FC = () => {
  const { userData } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    LogoutIsAcout();
    localStorage.removeItem("sessionToken")
    navigate('/');
  }

  const capitalizeFirstLetter = (value: String) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };
  



  return (
    <div className="flex flex-col fixed gap-0 h-screen bg-neutral-950 w-60 border-r-2 border-neutral-800">
      <div className='flex items-center px-4 w-full my-4 justify-around'>

        <Avatar className='rounded-full pointer'>
          <AvatarImage className='rounded-full w-10 cursor-pointer hover:border-2 border-white ' src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className='text-neutral-50 font-medium'>
          {userData ? capitalizeFirstLetter(userData.nome) : 'Usuário não encontrado'}
        </div>

        <EditUserDialog />
      </div>
      <div className='flex flex-col h-full py-6'>
        <nav className="flex-col flex h-full items-start px-2 text-sm font-medium lg:px-4  gap-3">
          <Link
            to="/projects"
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${isActive('/projects') ? 'bg-muted text-primary' : 'text-muted-foreground'
              }`}
          >
            <ChartNoAxesGantt className=" h-6 w-6" />
            Projetos
          </Link>
          <Link
            to="/createProjects"
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${isActive('/createProjects') ? 'bg-muted text-primary' : 'text-muted-foreground'
              }`}
          >
            <CircleFadingPlus className=" h-6 w-6" />
            Criar Projeto
          </Link>
          <Link
            to="/collaborators"
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${isActive('/collaborators') ? 'bg-muted text-primary' : 'text-muted-foreground'
              }`}
          >
            <Users className=" h-6 w-6" />
            Colaboradores
          </Link>
        </nav>
        <div className='px-4 ' onClick={handleLogout} >
          <Button className='w-full'>
            Sair
          </Button>
        </div>
      </div>




    </div>
  );
};

export default Sidebar;

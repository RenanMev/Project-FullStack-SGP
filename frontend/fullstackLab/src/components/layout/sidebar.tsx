import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  CircleFadingPlus,
  ChartNoAxesGantt,
  Users,
  LayoutDashboard,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Button } from '../ui/button';
import { LogoutIsAcout } from '@/services/utils/auth';
import { useUser } from '@/context/UserContext';
import { ModeToggle } from '../toogleDarkmode';

const Sidebar: React.FC = () => {
  const { userData } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    LogoutIsAcout();
    localStorage.removeItem("sessionToken");
    localStorage.removeItem("user");
    navigate('/');
  };

  return (
    <div className="flex-col fixed gap-0 h-screen w-60 border-r-2 xl:flex lg:hidden md:hidden sm:hidden flex bg-card">
      <div className='flex items-center px-4 w-full my-4 justify-around'>
        <Avatar className='rounded-full pointer'>
          <AvatarImage className='rounded-full w-10 cursor-pointer hover:border-2 border-white' src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className=' font-medium'>
          {userData ? userData.nome : ''}
        </div>
        <ModeToggle />
      </div>
      <div className='flex flex-col h-full py-6'>
        <nav className="flex-col flex h-full items-start px-2 text-sm font-medium lg:px-4 gap-3">
          <Link
            to="/dashboard"
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 transition-all hover:text-primary ${isActive('/dashboard') ? 'bg-popover text-primary' : 'text-muted-foreground'}`}
          >
            <LayoutDashboard className="h-6 w-6" />
            Dashboard
          </Link>
          <Link
            to="/projects"
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 transition-all hover:text-primary ${isActive('/projects') ? 'bg-popover text-primary' : 'text-muted-foreground'}`}
          >
            <ChartNoAxesGantt className="h-6 w-6" />
            Projetos
          </Link>
          <Link
            to="/createProjects"
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 transition-all hover:text-primary ${isActive('/createProjects') ? 'bg-popover text-primary' : 'text-muted-foreground'}`}
          >
            <CircleFadingPlus className="h-6 w-6" />
            Criar Projeto
          </Link>
          <Link
            to={"/collaborators"}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 transition-all hover:text-primary ${isActive('/collaborators') ? 'bg-popover text-primary' : 'text-muted-foreground'}`}
          >
            <Users className="h-6 w-6" />
            Colaboradores
          </Link>
        </nav>
        <div className='px-4' onClick={handleLogout}>
          <Button className='w-full rounded-xl'>
            Sair
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

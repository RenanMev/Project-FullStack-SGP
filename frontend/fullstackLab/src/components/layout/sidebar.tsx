import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  CircleFadingPlus,
  ChartNoAxesGantt,
  Users,
  LayoutDashboard,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Button } from '../ui/button';
import { LogoutIsAcout } from '@/services/utils/auth';
import { useUser } from '@/context/UserContext';
import { ModeToggle } from '../toogleDarkmode';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

// Definição das props do Sidebar
interface SidebarProps {
  isMinimized: boolean;
  toggleMinimize: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMinimized, toggleMinimize }) => {
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

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/projects', icon: ChartNoAxesGantt, label: 'Projetos' },
    { path: '/createProjects', icon: CircleFadingPlus, label: 'Criar Projeto' },
    { path: '/collaborators', icon: Users, label: 'Colaboradores' },
  ];

  return (
    <div className={`flex flex-col fixed h-screen border-r border-border bg-card shadow-lg transition-all duration-300 ${isMinimized ? 'w-20' : 'w-64'}`}>
      <div className={`flex items-center justify-between px-4 py-4 border-b border-border ${isMinimized ? 'flex-col' : ''}`}>
        <div className={`flex items-center ${isMinimized ? 'flex-col' : 'space-x-3'}`}>
          <Avatar className='rounded-full'>
            <AvatarImage className='rounded-full w-10 h-10 object-cover' src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {!isMinimized && (
            <div className='font-semibold truncate'>
              {userData ? userData.nome : 'User'}
            </div>
          )}
        </div>
        {!isMinimized && <ModeToggle />}
      </div>
      <nav className="flex-grow py-6 px-2">
        <ul className="space-y-2">
          {navItems.map(({ path, icon: Icon, label }) => (
            <li key={path}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to={path}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${
                        isActive(path)
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-muted-foreground hover:bg-primary/5 hover:text-primary'
                      } ${isMinimized ? 'justify-center' : ''}`}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      {!isMinimized && <span>{label}</span>}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={10}>
                    {label}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </li>
          ))}
        </ul>
      </nav>
      <div className='px-2 pb-6'>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-muted-foreground hover:text-primary ${isMinimized ? 'px-2' : ''}`}
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                {!isMinimized && <span className="ml-2">Sair</span>}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={10}>
              Sair
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-card border border-border rounded-full shadow-md"
        onClick={toggleMinimize}
      >
        {isMinimized ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default Sidebar;

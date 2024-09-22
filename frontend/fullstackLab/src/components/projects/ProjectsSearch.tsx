import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface ProjectsSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function ProjectsSearch({ searchTerm, onSearchChange }: ProjectsSearchProps) {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 opacity-45" />
      <Input
        placeholder="Busque o projeto"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10" 
      />
    </div>
  );
}

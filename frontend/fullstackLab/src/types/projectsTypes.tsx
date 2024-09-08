export interface Project {
  id: number;
  nome: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  status: 'Em andamento' | 'Concluído' | 'Pendente';
  responsibleID: number;
  responsibleName: string;
  collaborators: {
    id: number;
    name: string;
  }[];
}

export const projectsTypes: Project[] = [
  {
    id: 1,
    nome: 'Projeto A',
    descricao: 'Descrição do Projeto A',
    data_inicio: '2024-01-01',
    data_fim: '2024-06-01',
    status: 'Em andamento',
    responsibleID: 4342,
    responsibleName: 'João',
    collaborators: [
      { id: 1, name: 'Ana' },
      { id: 2, name: 'Pedro' }
    ]
  },
  {
    id: 2,
    nome: 'Projeto B',
    descricao: 'Descrição do Projeto B',
    data_inicio: '2023-03-15',
    data_fim: '2024-03-15',
    status: 'Concluído',
    responsibleID: 1234,
    responsibleName: 'Maria',
    collaborators: [ 
      { id: 3, name: 'Lucas' }
    ]
  },
  {
    id: 3,
    nome: 'Projeto C',
    descricao: 'Descrição do Projeto C',
    data_inicio: '2024-04-01',
    data_fim: '2024-09-30',
    status: 'Pendente',
    responsibleID: 5678,
    responsibleName: 'Carlos',
    collaborators: [] 
  },
];

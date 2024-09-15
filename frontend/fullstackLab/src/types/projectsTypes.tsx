export interface Project {
  id: number;
  nome: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  status: 'Em andamento' | 'Concluído' | 'Pendente';
}

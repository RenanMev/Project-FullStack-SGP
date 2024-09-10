import { ProjetoAttributes } from './Projeto'; 
import { User } from './User'; 

declare module './Projeto' {
  interface Projeto {
    Usuarios?: User[];
  }
}

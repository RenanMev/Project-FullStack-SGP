import { api } from '@/axiosConfig';
import { useEffect, useState } from 'react';
import { Project } from '@/types/projectsTypes';
import { useNavigate } from 'react-router-dom';
import { LoadingIndicator } from '@/components/ui/LoadingIndicator';
import ProjectsTable from './ProjectsTable';
import ProjectsSearch from '@/components/projects/ProjectsSearch';
import ProjectsPagination from '@/components/projects/ProjectsPagination';
import Notification from '@/components/ui/notification';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ChartNoAxesGantt, CloudUpload } from 'lucide-react';
import ProjectCards from './ProjectCards';

export default function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [openNotification, setOpenNotification] = useState(false);
  const [titleAlert, setTitleAlert] = useState('');
  const [messageAlert, setMessageAlert] = useState('');
  const [viewProjectsTable, setViewProjectsTable] = useState(true); // Alterado para 'true' como padrão.

  const itemsPerPage = 6;
  const navigate = useNavigate();

  const fetchProjects = () => {
    setLoading(true);
    api.get('/projetos')
      .then((res) => {
        setProjects(res.data);
      })
      .catch((error) => {
        console.error('Erro ao buscar projetos:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(project =>
    project.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastProject = currentPage * itemsPerPage;
  const indexOfFirstProject = indexOfLastProject - itemsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

  const handleEditClick = (project: Project) => {
    navigate(`/projects/${project.id}`);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= Math.ceil(filteredProjects.length / itemsPerPage)) {
      setCurrentPage(page);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setFileName(selectedFile.name);
    } else {
      setFile(null);
      setFileName(null);
    }
  };

  const handleFileUpload = () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    api.post('/projectfile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then(() => {
        setTitleAlert('Sucesso');
        setMessageAlert('Arquivo enviado com sucesso.');
        fetchProjects();
      })
      .catch((error) => {
        setTitleAlert('Erro');
        setMessageAlert('Erro ao subir o arquivo.');
        console.error('Erro ao enviar arquivo:', error);
      })
      .finally(() => {
        setOpenNotification(true);
        setLoading(false);
        setFile(null);
        setFileName(null);
      });
  };

  const changeViewProjects = (value: boolean) => {
    setViewProjectsTable(value);
  };

  return (
    <section className="h-full w-full p-6 min-h-screen">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1200]">
          <LoadingIndicator />
        </div>
      )}
      <div className='flex-col items-center mb-10'>
        <div className='flex items-center mb-6 gap-2'>
          <div>
            <ChartNoAxesGantt />
          </div>
          <h1 className="font-bold text-3xl">Projetos</h1>
        </div>

        <div className='flex mt-5 gap-9 h-10'>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="border-2 rounded-lg p-2 hover:bg-primary/80 hover:text-secondary transition">
                Upload de Arquivo
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Subir Arquivo CSV</DialogTitle>
              </DialogHeader>

              <div className="flex items-center justify-center mt-4">
                <Input
                  id="file-upload"
                  className="hidden"
                  type="file"
                  onChange={handleFileChange}
                  accept=".csv"
                />
                <label htmlFor="file-upload" className="flex text-xs items-center cursor-pointer">
                  <span>{fileName ? fileName : 'Selecione um arquivo CSV'}</span>
                  <CloudUpload className="ml-2" />
                </label>
              </div>

              <div className="mt-4 flex justify-end">
                <Button
                  className="border-2 rounded-lg p-2 hover:bg-primary/80 hover:text-secondary transition"
                  onClick={handleFileUpload}
                  disabled={!file}
                >
                  Enviar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className='flex pb-5'>
        <div className='flex gap-2 pl-2'>
          <Button variant={"outline"} onClick={() => changeViewProjects(true)}>
            Tabela
          </Button>
          <Button variant={"outline"} onClick={() => changeViewProjects(false)}>
            Cards
          </Button>
        </div>
      </div>

      {viewProjectsTable && (
        <>
          <ProjectsTable projects={currentProjects} onEditClick={handleEditClick} />
          <ProjectsPagination
            currentPage={currentPage}
            totalItems={filteredProjects.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </>
      )}
      {!viewProjectsTable && (
        <>
          <ProjectCards/>
        </>
      )}



      {openNotification && (
        <Notification
          variant="default"
          title={titleAlert}
          description={messageAlert}
          onClose={() => setOpenNotification(false)}
        />
      )}
    </section>
  );
}

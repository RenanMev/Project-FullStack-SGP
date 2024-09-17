import { api } from '@/axiosConfig';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import CardProjects from '@/components/ui/CardProjects';
import { useTheme } from '@/context/ThemeContext';
import { ChartNoAxesGantt } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Project } from '@/types/projectsTypes';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import Notification from '@/components/ui/notification';

const ProjectsList: React.FC = () => {
  const { darkMode } = useTheme();
  const [listProjects, setListProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 6;
  const [openNotification, setOpenNotification] = useState(false);
  const [titleAlert, setTitleAlert] = useState('');
  const [messageAlert, setMessageAlert] = useState('');

  const fetchListProjects = () => {
    setLoading(true);  
    api.get('/projetos')
      .then((res) => {
        setListProjects(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erro ao buscar projetos:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchListProjects();
  }, []);

  const filteredProjects = listProjects.filter(project =>
    project.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastProject = currentPage * itemsPerPage;
  const indexOfFirstProject = indexOfLastProject - itemsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

  const getPageRange = () => {
    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    const range = 4;
    let start = Math.max(currentPage - Math.floor(range / 2), 1);
    let end = start + range - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(end - range + 1, 1);
    }

    return { start, end };
  };

  const { start, end } = getPageRange();

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= Math.ceil(filteredProjects.length / itemsPerPage)) {
      setCurrentPage(page);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleFileUpload = () => {
    if (file) {
      setLoading(true)
      const formData = new FormData();
      formData.append('file', file);

      api.post('/projectfile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(() => {
          setLoading(false)
          setFile(null);
          window.location.reload();
        })
        .catch((error) => {
          setLoading(false)
          setTitleAlert('Erro');
          setMessageAlert('Erro ao subir o arquivo.');
          setOpenNotification(true);
          console.error('Erro ao enviar arquivo:', error);
        });
    }
  };

  return (
    <section className={`${darkMode ? "bg-neutral-950" : "bg-white"} h-full w-full p-6 min-h-screen`}>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-neutral-950 bg-opacity-50 z-50">
          <div role="status">
            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
      <div className='flex gap-4 items-center'>
        <div className={`${darkMode ? "text-white" : "text-neutral-950"}`}>
          <ChartNoAxesGantt className='w-8 h-8' />
        </div>
        <h1 className={`${darkMode ? "text-white" : "text-neutral-950"} font-bold text-3xl`}>Projetos</h1>
        <div className='flex-1'>
          <Input
            placeholder='Busque o projeto'
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <div className='mt-5'>
        <Card>
          <CardHeader>
            <CardDescription className='flex-col'>
              <div>
                Você consegue verificar todos os projetos que foram criados
              </div>
              <div className="grid w-full  max-w-xl items-center gap-5 text-white pt-5">
                <Label className='text-white' htmlFor="csv">Caso queira adicionar dados por excel, suba o arquivo</Label>
                <div className='flex gap-20 w-full'>
                  <Input className='text-white' id="csv" type="file" onChange={handleFileChange} />
                  <Button
                    onClick={handleFileUpload}
                    className="bg-neutral-800 w-64 text-white px-4 py-2 rounded hover:text-black"
                  >
                    Enviar Arquivo
                  </Button>
                </div>

              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className='w-full h-full flex flex-col'>
            <div className='w-full'>
              <CardProjects data={currentProjects} />
            </div>
            <Pagination className='mt-4'>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={() => handlePageChange(currentPage - 1)}
                  />
                </PaginationItem>
                {start > 1 && (
                  <>
                    <PaginationItem>
                      <PaginationLink href="#" onClick={() => handlePageChange(1)}>1</PaginationLink>
                    </PaginationItem>
                    {start > 2 && <PaginationEllipsis />}
                  </>
                )}
                {[...Array(end - start + 1)].map((_, index) => (
                  <PaginationItem key={start + index}>
                    <PaginationLink
                      href="#"
                      onClick={() => handlePageChange(start + index)}
                      className={currentPage === start + index ? 'bg-neutral-900 text-white' : ''}
                    >
                      {start + index}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                {end < Math.ceil(filteredProjects.length / itemsPerPage) && (
                  <>
                    {end < Math.ceil(filteredProjects.length / itemsPerPage) - 1 && <PaginationEllipsis />}
                    <PaginationItem>
                      <PaginationLink href="#" onClick={() => handlePageChange(Math.ceil(filteredProjects.length / itemsPerPage))}>
                        {Math.ceil(filteredProjects.length / itemsPerPage)}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={() => handlePageChange(currentPage + 1)}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardContent>
        </Card>
      </div>
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
};

export default ProjectsList;

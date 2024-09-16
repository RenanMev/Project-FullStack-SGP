import { api } from '@/axiosConfig'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import CardProjects from '@/components/ui/CardProjects'
import { useTheme } from '@/context/ThemeContext'
import { ChartNoAxesGantt } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Project } from '@/types/projectsTypes'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Input } from '@/components/ui/input'

const ProjectsList: React.FC = () => {
  const { darkMode } = useTheme()
  const [listProjects, setListProjects] = useState<Project[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const itemsPerPage = 6

  const fetchListProjects = () => {
    api.get('/projetos')
      .then((res) => {
        setListProjects(res.data)
      })
      .catch((error) => {
        console.error('Erro ao buscar projetos:', error)
      })
  }

  useEffect(() => {
    fetchListProjects()
  }, [])

  const filteredProjects = listProjects.filter(project =>
    project.nome.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexOfLastProject = currentPage * itemsPerPage
  const indexOfFirstProject = indexOfLastProject - itemsPerPage
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject)

  const getPageRange = () => {
    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage)
    const range = 4
    let start = Math.max(currentPage - Math.floor(range / 2), 1)
    let end = start + range - 1

    if (end > totalPages) {
      end = totalPages
      start = Math.max(end - range + 1, 1)
    }

    return { start, end }
  }

  const { start, end } = getPageRange()

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= Math.ceil(filteredProjects.length / itemsPerPage)) {
      setCurrentPage(page)
    }
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    setCurrentPage(1) 
  }

  return (
    <section className={`${darkMode ? "bg-neutral-950" : "bg-white"} h-full w-full p-6 min-h-screen`}>
      <div className='flex gap-4 items-center'>
        <div className={`${darkMode ? "text-white" : "text-neutral-950"}`}>
          <ChartNoAxesGantt className='w-8 h-8' />
        </div>
        <h1 className={`${darkMode ? "text-white" : "text-neutral-950"} font-bold text-3xl`}>Projetos</h1>
        <div className='flex-1 text-white'>
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
            <CardDescription>
              Você consegue verificar todos os projetos que foram criados
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
    </section>
  )
}

export default ProjectsList

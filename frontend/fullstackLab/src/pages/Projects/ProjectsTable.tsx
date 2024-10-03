import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ClipboardPlus } from 'lucide-react'

import { Project } from '@/types/projectsTypes'
import { api } from '@/axiosConfig'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"

interface ProjectsTableProps {
  projects: Project[]
  onEditClick: (project: Project) => void
}

export default function ProjectsTable({ projects, onEditClick }: ProjectsTableProps) {
  const [status, setStatus] = useState<{ [key: string]: string }>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const navigate = useNavigate()

  const handleStatusChange = (projectId: string, newStatus: string) => {
    setStatus((prev) => ({ ...prev, [projectId]: newStatus }))

    api.put(`/projetos/status/${projectId}`, { status: newStatus })
      .then(() => {
        console.log("Status atualizado com sucesso!")
      })
      .catch((error) => {
        console.error("Erro ao atualizar o status:", error)
      })
  }

  const getBadgeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta':
        return 'bg-red-500 text-white'
      case 'médio':
        return 'bg-gray-300 text-black'
      case 'baixa':
        return 'bg-green-500 text-white'
      default:
        return 'bg-gray-300 text-black'
    }
  }

  const columns: ColumnDef<Project>[] = [
    {
      accessorKey: "nome",
      header: "Nome",
    },
    {
      accessorKey: "descricao",
      header: "Descrição",
      cell: ({ row }) => {
        const descricao = row.getValue("descricao") as string
        return descricao.length > 40 ? `${descricao.substring(0, 40)}...` : descricao
      },
    },
    {
      accessorKey: "data_inicio",
      header: "Data Início",
      cell: ({ row }) => new Date(row.getValue("data_inicio")).toLocaleDateString(),
    },
    {
      accessorKey: "data_fim",
      header: "Data Fim",
      cell: ({ row }) => new Date(row.getValue("data_fim")).toLocaleDateString(),
    },
    {
      accessorKey: "prioridade",
      header: "Prioridade",
      cell: ({ row }) => {
        const prioridade = row.getValue("prioridade") as string
        return (
          <Badge className={getBadgeColor(prioridade)}>
            {prioridade}
          </Badge>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const project = row.original
        return (
          <Select
            onValueChange={(newStatus) => handleStatusChange(project.id.toString(), newStatus)}
            defaultValue={project.status}
          >
            <SelectTrigger>
              <SelectValue placeholder={project.status} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Concluido">Concluido</SelectItem>
              <SelectItem value="Pendente">Pendente</SelectItem>
              <SelectItem value="Em andamento">Em andamento</SelectItem>
            </SelectContent>
          </Select>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const project = row.original
        return (
          <Button onClick={() => onEditClick(project)}>Editar</Button>
        )
      },
    },
  ]

  const table = useReactTable({
    data: projects,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  })

  return (
    <Card className='p-9'>
     
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar projetos..."
          value={(table.getColumn("nome")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("nome")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Button variant={'secondary'} className='ml-auto gap-4' onClick={() => navigate('/createProjects')}>
          Criar novo projeto
          <ClipboardPlus className='w-5 h-5' />
        </Button>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Nenhum resultado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  )
}
"use client"

import React, { useState } from 'react'
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SortableItem } from './SortableItem'
import { Column } from './Column'

// Define the structure of a project
interface Project {
  id: string
  title: string
  description: string
  status: 'To Do' | 'In Progress' | 'Done'
  assignee: {
    name: string
    avatar: string
  }
}

// Define the structure of our columns
interface ColumnType {
  id: string
  title: string
  projects: Project[]
}

// Sample data
const initialData: { [key: string]: ColumnType } = {
  'column1': {
    id: 'column1',
    title: 'To Do',
    projects: [
      { id: 'task1', title: 'Create login page', description: 'Implement user authentication', status: 'To Do', assignee: { name: 'John Doe', avatar: 'https://github.com/shadcn.png' } },
      { id: 'task2', title: 'Design dashboard', description: 'Create wireframes for main dashboard', status: 'To Do', assignee: { name: 'Jane Smith', avatar: 'https://github.com/shadcn.png' } },
      { id: 'task2', title: 'Design dashboard', description: 'Create wireframes for main dashboard', status: 'To Do', assignee: { name: 'Jane Smith', avatar: 'https://github.com/shadcn.png' } },
      { id: 'task2', title: 'Design dashboard', description: 'Create wireframes for main dashboard', status: 'To Do', assignee: { name: 'Jane Smith', avatar: 'https://github.com/shadcn.png' } },
    ],
  },
  'column2': {
    id: 'column2',
    title: 'In Progress',
    projects: [
      { id: 'task3', title: 'Implement API', description: 'Set up RESTful API endpoints', status: 'In Progress', assignee: { name: 'Bob Johnson', avatar: 'https://github.com/shadcn.png' } },
      { id: 'task3', title: 'Implement API', description: 'Set up RESTful API endpoints', status: 'In Progress', assignee: { name: 'Bob Johnson', avatar: 'https://github.com/shadcn.png' } },
      { id: 'task3', title: 'Implement API', description: 'Set up RESTful API endpoints', status: 'In Progress', assignee: { name: 'Bob Johnson', avatar: 'https://github.com/shadcn.png' } },
    ],
  },
  'column3': {
    id: 'column3',
    title: 'Done',
    projects: [
      { id: 'task4', title: 'Set up database', description: 'Configure and connect to database', status: 'Done', assignee: { name: 'Alice Brown', avatar: 'https://github.com/shadcn.png' } },
    ],
  },
}

export default function ProjectBoard() {
  const [columns, setColumns] = useState(initialData)
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event: any) => {
    const { active } = event
    setActiveId(active.id)
  }

  const handleDragOver = (event: any) => {
    const { active, over } = event
    if (!over) return

    const activeColumn = Object.values(columns).find(column =>
      column.projects.some(project => project.id === active.id)
    )
    const overColumn = Object.values(columns).find(column => column.id === over.id)

    if (!activeColumn || !overColumn || activeColumn === overColumn) {
      return
    }

    setColumns(prev => {
      const activeProjects = [...prev[activeColumn.id].projects]
      const overProjects = [...prev[overColumn.id].projects]

      const activeIndex = activeProjects.findIndex(p => p.id === active.id)
      const [removedProject] = activeProjects.splice(activeIndex, 1)

      overProjects.push({ ...removedProject, status: overColumn.title as 'To Do' | 'In Progress' | 'Done' })

      return {
        ...prev,
        [activeColumn.id]: {
          ...prev[activeColumn.id],
          projects: activeProjects,
        },
        [overColumn.id]: {
          ...prev[overColumn.id],
          projects: overProjects,
        },
      }
    })
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (!over) return

    const activeColumn = Object.values(columns).find(column =>
      column.projects.some(project => project.id === active.id)
    )
    const overColumn = Object.values(columns).find(column =>
      column.projects.some(project => project.id === over.id)
    )

    if (!activeColumn || !overColumn) return

    if (activeColumn.id === overColumn.id) {
      const oldIndex = activeColumn.projects.findIndex(p => p.id === active.id)
      const newIndex = activeColumn.projects.findIndex(p => p.id === over.id)

      setColumns(prev => ({
        ...prev,
        [activeColumn.id]: {
          ...prev[activeColumn.id],
          projects: arrayMove(prev[activeColumn.id].projects, oldIndex, newIndex),
        },
      }))
    }

    setActiveId(null)
  }

  const getProjectById = (id: string): Project | undefined => {
    return Object.values(columns).flatMap(column => column.projects).find(project => project.id === id)
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Project Board</h1>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.values(columns).map((column) => (
            <Column key={column.id} column={column}>
              <SortableContext items={column.projects.map(p => p.id)} strategy={verticalListSortingStrategy}>
                {column.projects.map((project) => (
                  <SortableItem key={project.id} id={project.id}>
                    <ProjectCard project={project} />
                  </SortableItem>
                ))}
              </SortableContext>
            </Column>
          ))}
        </div>
        <DragOverlay>
          {activeId ? <ProjectCard project={getProjectById(activeId)!} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="bg-background mb-2">
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
        <div className="flex justify-between items-center">
          <Badge variant="outline">{project.status}</Badge>
          <Avatar className="h-8 w-8">
            <AvatarImage src={project.assignee.avatar} alt={project.assignee.name} />
            <AvatarFallback>{project.assignee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
        </div>
      </CardContent>
    </Card>
  )
}
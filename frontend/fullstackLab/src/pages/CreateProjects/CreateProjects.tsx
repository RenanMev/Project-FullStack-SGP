import { useTheme } from '@/context/ThemeContext'
import { CircleFadingPlus } from 'lucide-react'
import React from 'react'
import BodyProjects from './bodyProjects'


const CreateProjects: React.FC = () => {
  const { darkMode } = useTheme()

  return (
    <section className={`${darkMode ? "bg-neutral-950 text-white" : "bg-white text-neutral-950"} p-6 h-screen w-full`}>
      <header>
        <div className='flex items-center gap-3'>
          <div>
            <CircleFadingPlus />
          </div>
          <h1 className='text-3xl font-bold'> Criar Projetoss</h1>
        </div>
        <div className='font-normal pt-2 text-neutral-400'>
          Vamos criar um projeto juntos?
        </div>
      </header>
      <div className='overflow-hidden'>
        <BodyProjects />
      </div>

    </section>
  )
}

export default CreateProjects
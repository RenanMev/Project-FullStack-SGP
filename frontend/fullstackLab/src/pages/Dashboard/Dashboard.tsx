import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/context/ThemeContext';
import { LayoutDashboard } from 'lucide-react';
import { CharProjects } from '@/components/chart/charProjects';
import { GraphComponent } from '@/components/chart/GraphComponent';
import { GraphComponentFilter } from '@/components/chart/GraphComponentFilter';


const Dashboard = () => {
  const { darkMode } = useTheme();

  return (
    <section className={`${darkMode ? "bg-neutral-950" : "bg-white"} min-h-screen h-full w-full p-6`}>
      <div className='flex gap-4 items-center'>
        <div className={`${darkMode ? "text-white" : "text-neutral-950"}`}>
          <LayoutDashboard className='w-8 h-8' />
        </div>
        <h1 className={`${darkMode ? "text-white" : "text-neutral-950"} font-bold text-3xl`}>Dashboard</h1>
      </div>
      <div className='mt-5'>
        <Card>
          <CardHeader>
            <CardTitle className='text-2xl'>Projetos criados!</CardTitle>
          </CardHeader>
          <div className='p-4 flex-1 gap-2'>
            <div className='flex gap-5 justify-around'>
              <div className='min-w-[750px]'>
                <CharProjects />
              </div>
              <div className='min-w-[750px]'>
                <GraphComponent />
              </div>
            </div>
          </div>
          <div className='p-7'>
          <GraphComponentFilter/>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Dashboard;

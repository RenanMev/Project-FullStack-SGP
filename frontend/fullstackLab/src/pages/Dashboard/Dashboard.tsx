import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/context/ThemeContext';
import { LayoutDashboard } from 'lucide-react';
import { CharProjects } from '@/components/chart/charProjects';
import { GraphComponent } from '@/components/chart/GraphComponent';


const Dashboard = () => {
  const { darkMode } = useTheme();

  return (
    <section className={`${darkMode ? "bg-neutral-950" : "bg-white"} h-screen w-full p-6`}>
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
            <div className='flex gap-5'>
              <div className='min-w-[550px]'>
            <CharProjects />
              </div>
            <GraphComponent/>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Dashboard;

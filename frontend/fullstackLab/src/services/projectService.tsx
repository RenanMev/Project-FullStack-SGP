
interface GenericProject {
  data_inicio: string;
}

interface ProjectCountByDate {
  date: string;
  count: number;
}

const analyzeProjectGrowth = (projects: GenericProject[]): boolean => {
  const countByDate: Record<string, number> = {};

  projects.forEach(project => {
    const startDate = new Date(project.data_inicio).toISOString().split('T')[0];
    countByDate[startDate] = (countByDate[startDate] || 0) + 1;
  });

  const projectCounts: ProjectCountByDate[] = Object.keys(countByDate).map(date => ({
    date,
    count: countByDate[date]
  }));

  for (let i = 1; i < projectCounts.length; i++) {
    if (projectCounts[i].count > projectCounts[i - 1].count) {
      console.log('entrou')
      return true; 
    }
  }

  return false; 
};

export { analyzeProjectGrowth };

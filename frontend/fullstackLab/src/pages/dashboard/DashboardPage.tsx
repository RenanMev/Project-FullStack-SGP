import Header from "@/components/DashboardPage/Header";
import ProjectCard from "@/components/DashboardPage/ProjectCard";
import React from "react";

const Dashboard: React.FC = () => {
  return (
    <section className="flex-1 pt-8 h-screen p-4 bg-neutral-900">
      <Header />
      <div className="mt-6 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[24rem]">
          <div className="flex-1 overflow-hidden">
            <div className="overflow-x-auto">
              <ProjectCard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;

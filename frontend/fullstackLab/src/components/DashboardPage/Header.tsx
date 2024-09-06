import React from "react";
import { SquareKanban } from "lucide-react";

const Header: React.FC = () => {
  return (
    <div className="flex items-center gap-4">
      <h1 className="text-2xl text-white font-bold mb-4">
        <SquareKanban 
          
        />
      </h1>
      <h1 className="text-2xl text-white font-bold mb-4">Dashboard</h1>
    </div>
  );
};

export default Header;
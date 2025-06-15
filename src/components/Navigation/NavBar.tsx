import React from "react";
import { Map as MapIcon, FileText, Star, User } from "lucide-react";

interface NavBarProps {
  activeNav: string;
  setActiveNav: (nav: string) => void;
  onReportClick: () => void;
}

export const NavBar: React.FC<NavBarProps> = ({
  activeNav,
  setActiveNav,
  onReportClick,
}) => {
  return (
    <nav className="w-16 bg-white flex flex-col items-center shadow-md z-20">
      <div className="p-3">
        <button
          onClick={() => setActiveNav("map")}
          className={`p-3 rounded-lg transition-colors ${
            activeNav === "map"
              ? "bg-blue-500 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <MapIcon size={24} />
        </button>
      </div>
      <div className="mt-auto p-4">
        <button className="p-2 rounded-full bg-gray-200 text-gray-600">
          <User size={24} />
        </button>
      </div>
    </nav>
  );
};

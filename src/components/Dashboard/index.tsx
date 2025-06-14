import React, { useState, useCallback } from "react";
import { NavBar } from "../Navigation/NavBar";
import { Sidebar } from "../Navigation/Sidebar";
import { GoogleMap } from "../Map/GoogleMap";
import { DetailPanel } from "../TrafficAnalysis/DetailPanel";
import { ReportModal } from "../Reports/ReportModal";
import { roadSegments } from "../../data/roadSegments";
import { RoadSegment } from "../../types/global.types";
import { Map as MapIcon, X } from "lucide-react";
import "./Dashboard.styles.css";

export default function Dashboard() {
  const [selectedSegment, setSelectedSegment] = useState<RoadSegment | null>(
    roadSegments[0]
  );
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("map");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");

  const handleSegmentClick = useCallback((segment: RoadSegment) => {
    setSelectedSegment(segment);
  }, []);

  return (
    <div className="h-screen w-full bg-gray-100 flex font-sans text-gray-800">
      <NavBar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        onReportClick={() => setIsReportModalOpen(true)}
      />

      <Sidebar
        selectedSegment={selectedSegment}
        onSegmentClick={handleSegmentClick}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        roadSegments={roadSegments}
      />

      <main className="flex-1 relative bg-gray-100">
        <div className="absolute inset-0">
          <GoogleMap
            selectedSegment={selectedSegment}
            onSegmentClick={handleSegmentClick}
          />
        </div>

        {selectedSegment && (
          <div className="fixed top-0 right-0 w-1/3 h-full bg-white shadow-2xl border-l border-gray-200 animate-slideInRight z-50">
            <button
              onClick={() => setSelectedSegment(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
              aria-label="close"
            >
              <X size={20} className="text-gray-500" />
            </button>

            <div className="h-full overflow-y-auto p-6">
              <DetailPanel segment={selectedSegment} />
            </div>
          </div>
        )}

        {!selectedSegment && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 flex items-center space-x-3">
            <MapIcon size={24} className="text-blue-500" />
            <p className="text-sm text-gray-700">
              Click a road section on the map or select it from the list on the
              left
            </p>
          </div>
        )}
      </main>

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        comparisonSegments={roadSegments}
      />
    </div>
  );
}

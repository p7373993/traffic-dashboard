import React, { useState } from "react";
import { Search } from "lucide-react";
import { RoadSegment } from "../../types/global.types";
import { DateTimePicker } from "../common/DateTimePicker";
import { MiniChart } from "../TrafficAnalysis/MiniChart";
import { generateTrafficData } from "../../utils/trafficDataGenerator";
import CalendarModal from "../common/CalendarModal";

interface SidebarProps {
  selectedSegment: RoadSegment | null;
  onSegmentClick: (segment: RoadSegment) => void;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  roadSegments: RoadSegment[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedSegment,
  onSegmentClick,
  currentDate,
  setCurrentDate,
  searchTerm,
  setSearchTerm,
  roadSegments,
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const formatFullDate = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = (date.getMonth() + 1).toString().padStart(2, "0");
    const dd = date.getDate().toString().padStart(2, "0");
    const hh = date.getHours().toString().padStart(2, "0");
    const min = (Math.floor(date.getMinutes() / 5) * 5)
      .toString()
      .padStart(2, "0");
    return `${yyyy} ${mm} ${dd} ${hh}:${min}`;
  };

  // 날짜 범위 선택 핸들러
  const handleDateRangeSelect = (startDate: Date, endDate: Date) => {
    console.log("Selected date range:", startDate, "to", endDate);
    setCurrentDate(startDate);
    setIsCalendarOpen(false);
  };

  const filteredSegments = roadSegments.filter(
    (segment) =>
      segment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      segment.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <aside className="w-[400px] bg-white flex flex-col border-r border-gray-200 z-10">
      <header className="p-4 border-b border-gray-200 space-y-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
          />
        </div>
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold text-blue-600 tracking-wide">
            {formatFullDate(currentDate)}
          </p>
          <button
            onClick={() => setIsCalendarOpen(true)}
            className="text-xs bg-gray-200 text-gray-700 font-semibold px-3 py-1.5 rounded-full hover:bg-gray-300"
          >
            Custom Settings
          </button>
        </div>
        <DateTimePicker
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
        />
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        <h3 className="text-sm font-bold text-gray-500 px-2">
          Traffic Analysis Section
        </h3>
        {filteredSegments.map((segment) => {
          const trafficData = generateTrafficData(segment.id);
          const isSelected = selectedSegment?.id === segment.id;
          return (
            <div
              key={segment.id}
              onClick={() => onSegmentClick(segment)}
              className={`p-4 rounded-lg cursor-pointer border-2 shadow-sm transition-all ${
                isSelected
                  ? "border-blue-500 bg-white"
                  : "border-transparent bg-white hover:border-blue-400"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-sm text-gray-800">
                  {segment.name}
                </h4>
                <span className="text-xs text-gray-500">{segment.area}</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">{segment.length}km</p>
              <MiniChart
                data={trafficData}
                dataKey="volume"
                color={isSelected ? "#3b82f6" : "#10b981"}
              />
            </div>
          );
        })}
      </div>
      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        onDateRangeSelect={handleDateRangeSelect}
      />
    </aside>
  );
};

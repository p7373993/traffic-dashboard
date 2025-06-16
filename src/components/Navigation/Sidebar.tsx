import React, { useState } from "react";
import { Search, Star } from "lucide-react";
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
  activeNav: string;
  favoriteSegments: number[];
  onToggleFavorite: (segmentId: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedSegment,
  onSegmentClick,
  currentDate,
  setCurrentDate,
  searchTerm,
  setSearchTerm,
  roadSegments,
  activeNav,
  favoriteSegments,
  onToggleFavorite,
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
    setCurrentDate(startDate);
    setIsCalendarOpen(false);
  };

  // 즐겨찾기 모드에 따른 세그먼트 필터링
  const getFilteredSegments = () => {
    let segments = roadSegments;

    // 즐겨찾기 모드일 때는 즐겨찾기된 세그먼트만 표시
    if (activeNav === "favorites") {
      segments = roadSegments.filter((segment) =>
        favoriteSegments.includes(segment.id)
      );
    }

    // 검색어 필터링
    return segments.filter(
      (segment) =>
        segment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        segment.area.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredSegments = getFilteredSegments();

  // 헤더 제목 결정
  const getHeaderTitle = () => {
    if (activeNav === "favorites") {
      return "Favorites";
    }
    return "Traffic Analysis Section";
  };

  return (
    <aside className="w-[400px] bg-white flex flex-col border-r border-gray-200 z-10">
      <header className="px-6 py-5 border-b border-gray-200 space-y-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder={
              activeNav === "favorites" ? "Search favorites..." : "Search..."
            }
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
            style={{
              borderRadius: "11px",
              border: "1px solid rgba(0,0,0,0.09)",
              background: "rgba(236,236,236,0.51)",
              color: "#939393",
              fontWeight: 500,
              fontSize: "12px",
              padding: "4px 14px",
              flexShrink: 0,
            }}
          >
            Custom Settings
          </button>
        </div>
        {activeNav === "map" && (
          <div className="flex justify-center">
            <DateTimePicker
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
            />
          </div>
        )}
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-gray-500 px-2">
            {getHeaderTitle()}
          </h3>
          {activeNav === "favorites" && (
            <span className="text-xs text-gray-400 px-2">
              {filteredSegments.length} items
            </span>
          )}
        </div>

        {filteredSegments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {activeNav === "favorites" ? (
              <div>
                <Star className="mx-auto mb-2 text-gray-300" size={32} />
                <p className="text-sm">No favorites yet</p>
                <p className="text-xs mt-1">
                  Click the star icon to add favorites
                </p>
              </div>
            ) : (
              <p className="text-sm">No roads found</p>
            )}
          </div>
        ) : (
          filteredSegments.map((segment) => {
            const trafficData = generateTrafficData(segment.id);
            const isSelected = selectedSegment?.id === segment.id;
            const isFavorited = favoriteSegments.includes(segment.id);

            return (
              <div
                key={segment.id}
                className={`p-4 rounded-lg border-2 shadow-sm transition-all ${
                  isSelected
                    ? "border-blue-500 bg-white"
                    : "border-transparent bg-white hover:border-blue-400"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div
                    onClick={() => onSegmentClick(segment)}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-sm text-gray-800">
                        {segment.name}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {segment.area}
                      </span>
                      <button
                        style={{
                          display: "inline-flex",
                          padding: "4px 14px",
                          justifyContent: "center",
                          alignItems: "center",
                          flexShrink: 0,
                          borderRadius: "11px",
                          border: "1px solid rgba(0,0,0,0.09)",
                          background: "rgba(236,236,236,0.51)",
                          color: "#939393",
                          fontWeight: 500,
                          fontSize: "12px",
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  onClick={() => onSegmentClick(segment)}
                  className="cursor-pointer"
                >
                  {/* Divider line */}
                  <hr className="border-gray-200 mb-4" />
                  <MiniChart
                    data={trafficData}
                    dataKey="volume"
                    color={isSelected ? "#3b82f6" : "#10b981"}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        onDateRangeSelect={handleDateRangeSelect}
      />
    </aside>
  );
};

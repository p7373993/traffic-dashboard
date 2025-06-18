import React, { useState } from "react";
import { Search, Star } from "lucide-react";
import { Intersection } from "../../types/global.types";
import { DateTimePicker } from "../common/DateTimePicker";
import { MiniChart } from "../TrafficAnalysis/MiniChart";
import CalendarModal from "../common/CalendarModal";

interface SidebarProps {
  selectedIntersection: Intersection | null;
  onIntersectionClick: (intersection: Intersection) => void;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  intersections: Intersection[];
  activeNav: string;
  favoriteIntersections: number[];
  onToggleFavorite: (intersectionId: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedIntersection,
  onIntersectionClick,
  currentDate,
  setCurrentDate,
  searchTerm,
  setSearchTerm,
  intersections,
  activeNav,
  favoriteIntersections,
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

  // 즐겨찾기 모드에 따른 교차로 필터링
  const getFilteredIntersections = () => {
    let points = intersections;

    // 즐겨찾기 모드일 때는 즐겨찾기된 교차로만 표시
    if (activeNav === "favorites") {
      points = intersections.filter((intersection) =>
        favoriteIntersections.includes(intersection.id)
      );
    }

    // 검색어 필터링
    return points.filter((intersection) =>
      intersection.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredIntersections = getFilteredIntersections();

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
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-bold text-gray-500 px-2">
            {getHeaderTitle()}
          </h3>
          {activeNav === "favorites" && (
            <span className="text-xs text-gray-400 px-2">
              {filteredIntersections.length} items
            </span>
          )}
        </div>

        {filteredIntersections.length === 0 ? (
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
              <p className="text-sm">No intersections found</p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredIntersections.map((intersection) => {
              const isSelected = selectedIntersection?.id === intersection.id;

              return (
                <div
                  key={intersection.id}
                  className={`bg-white rounded-lg border-2 transition-all ${
                    isSelected
                      ? "border-blue-500"
                      : "border-transparent hover:border-blue-400"
                  }`}
                >
                  {/* Header Section */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-sm text-gray-800">
                        {intersection.name}
                      </h4>
                      <button
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
                        View Details
                      </button>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div
                    className="p-4 cursor-pointer"
                    onClick={() => onIntersectionClick(intersection)}
                  >
                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Latitude</p>
                        <p className="text-sm font-medium text-gray-700">
                          {intersection.latitude.toFixed(6)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Longitude</p>
                        <p className="text-sm font-medium text-gray-700">
                          {intersection.longitude.toFixed(6)}
                        </p>
                      </div>
                    </div>

                    {/* Rectangle Box */}
                    <div className="mt-4">
                      <div className="w-full h-16 rounded-lg bg-gray-100" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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

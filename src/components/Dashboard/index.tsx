import React, { useState, useCallback, useEffect } from "react";
import { NavBar } from "../Navigation/NavBar";
import { Sidebar } from "../Navigation/Sidebar";
import { GoogleMap } from "../Map/GoogleMap";
import { DetailPanel } from "../TrafficAnalysis/DetailPanel";
import { ReportModal } from "../Reports/ReportModal";
import { roadSegments } from "../../data/roadSegments";
import { RoadSegment } from "../../types/global.types";
import { Map as MapIcon, X, Heart } from "lucide-react";
import "./Dashboard.styles.css";

export default function Dashboard() {
  const [selectedSegment, setSelectedSegment] = useState<RoadSegment | null>(
    roadSegments[0]
  );
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("map");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [favoriteSegments, setFavoriteSegments] = useState<number[]>([]);

  // 로컬 스토리지에서 즐겨찾기 불러오기 (초기화 시)
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favoriteRoadSegments");
    if (savedFavorites) {
      setFavoriteSegments(JSON.parse(savedFavorites));
    }
  }, []);

  // 즐겨찾기 변경 시 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem(
      "favoriteRoadSegments",
      JSON.stringify(favoriteSegments)
    );
  }, [favoriteSegments]);

  // 즐겨찾기 토글 함수
  const handleToggleFavorite = useCallback((segmentId: number) => {
    setFavoriteSegments((prev) => {
      if (prev.includes(segmentId)) {
        return prev.filter((id) => id !== segmentId);
      } else {
        return [...prev, segmentId];
      }
    });
  }, []);

  const handleSegmentClick = useCallback((segment: RoadSegment) => {
    setSelectedSegment(segment);
  }, []);

  // 네비게이션 변경 시 검색어 초기화
  const handleNavChange = useCallback((nav: string) => {
    setActiveNav(nav);
    setSearchTerm("");
  }, []);

  return (
    <div className="h-screen w-full bg-gray-100 flex font-sans text-gray-800">
      <NavBar
        activeNav={activeNav}
        setActiveNav={handleNavChange}
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
        activeNav={activeNav}
        favoriteSegments={favoriteSegments}
        onToggleFavorite={handleToggleFavorite}
      />

      <main className="flex-1 relative bg-gray-100">
        {activeNav === "map" || activeNav === "favorites" ? (
          <>
            {/* 지도 뷰 - 맵 모드와 즐겨찾기 모드 모두에서 표시 */}
            <div className="absolute inset-0">
              <GoogleMap
                selectedSegment={selectedSegment}
                onSegmentClick={handleSegmentClick}
              />
            </div>

            {/* 즐겨찾기 모드일 때 추가 오버레이 */}
            {activeNav === "favorites" && !selectedSegment && (
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 flex items-center space-x-3 z-10">
                <Heart size={24} className="text-red-500" />
                <div className="text-sm">
                  <p className="font-semibold text-gray-700">Favorites Mode</p>
                  <p className="text-gray-600">
                    {favoriteSegments.length > 0
                      ? `${favoriteSegments.length} favorite road${
                          favoriteSegments.length > 1 ? "s" : ""
                        } available in sidebar`
                      : "No favorite roads selected yet"}
                  </p>
                </div>
              </div>
            )}

            {/* 맵 모드일 때 기존 메시지 */}
            {activeNav === "map" && !selectedSegment && (
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 flex items-center space-x-3">
                <MapIcon size={24} className="text-blue-500" />
                <p className="text-sm text-gray-700">
                  Click a road section on the map or select it from the list on
                  the left
                </p>
              </div>
            )}
          </>
        ) : (
          /* 기타 네비게이션 뷰 */
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500">Other navigation content</p>
          </div>
        )}

        {/* 상세 패널 - 모든 모드에서 공통 */}
        {selectedSegment && (
          <div className="fixed top-0 right-0 w-1/3 h-full bg-white shadow-2xl border-l border-gray-200 animate-slideInRight z-50">
            <div className="h-full overflow-y-auto">
              <DetailPanel
                segment={selectedSegment}
                favoriteSegments={favoriteSegments}
                onToggleFavorite={handleToggleFavorite}
                onClose={() => setSelectedSegment(null)}
              />
            </div>
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

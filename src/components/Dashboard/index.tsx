import React, { useState, useCallback, useEffect } from "react";
import { NavBar } from "../Navigation/NavBar";
import { Sidebar } from "../Navigation/Sidebar";
import { GoogleMap } from "../Map/GoogleMap";
import { DetailPanel } from "../TrafficAnalysis/DetailPanel";
import { roadSegments } from "../../data/roadSegments";
import { RoadSegment } from "../../types/global.types";
import { Map as MapIcon, Star, ChevronRight, ChevronLeft } from "lucide-react";
import "./Dashboard.styles.css";

export default function Dashboard() {
  const [selectedSegment, setSelectedSegment] = useState<RoadSegment | null>(
    roadSegments[0]
  );
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

  const [isDetailPanelFullscreen, setIsDetailPanelFullscreen] = useState(false);
  return (
    <div className="h-screen w-full bg-gray-100 flex font-sans text-gray-800">
      <NavBar activeNav={activeNav} setActiveNav={handleNavChange} />
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
            <div className="absolute inset-0">
              <GoogleMap
                selectedSegment={selectedSegment}
                onSegmentClick={handleSegmentClick}
              />
            </div>
            {activeNav === "favorites" && !selectedSegment && (
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 flex items-center space-x-3 z-10">
                <Star size={24} className="text-red-500" />
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
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500">Other navigation content</p>
          </div>
        )}
        {selectedSegment && (
          <>
            {/* 최소화 버튼: 최대화 상태일 때만 왼쪽에 고정 */}
            {isDetailPanelFullscreen && (
              <button
                onClick={() => setIsDetailPanelFullscreen(false)}
                className="fixed left-4 top-1/2 transform -translate-y-1/2 z-[70] flex items-center justify-center p-0 transition-all"
                aria-label="Exit fullscreen"
                title="축소"
                style={{
                  borderRadius: "0px 10px 10px 0px",
                  borderTop: "1px solid #DEDFE5",
                  borderRight: "1px solid #DEDFE5",
                  borderBottom: "1px solid #DEDFE5",
                  background: "rgba(255, 255, 255, 0.75)",
                  backdropFilter: "blur(5px)",
                  width: "17px",
                  height: "51px",
                  flexShrink: 0,
                  boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)",
                }}
              >
                <ChevronRight size={20} className="text-gray-400 mx-auto" />
              </button>
            )}
            {/* 최대화 버튼: 최대화 아닐 때만 detail panel 오른쪽에 보이게 */}
            {!isDetailPanelFullscreen && (
              <button
                onClick={() => setIsDetailPanelFullscreen(true)}
                className="fixed top-1/2 transform -translate-y-1/2 z-[70] flex items-center justify-center p-0 transition-all duration-300 translate-x-0 opacity-100 pointer-events-auto"
                aria-label="Enter fullscreen"
                title="maximize"
                style={{
                  right: "calc(min(823px, 90vw))",
                  borderRadius: "10px 0px 0px 10px",
                  borderTop: "1px solid #DEDFE5",
                  borderRight: "1px solid #DEDFE5",
                  borderBottom: "1px solid #DEDFE5",
                  background: "rgba(255, 255, 255, 0.75)",
                  backdropFilter: "blur(5px)",
                  width: "17px",
                  height: "51px",
                  flexShrink: 0,
                  boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)",
                }}
              >
                <ChevronLeft size={20} className="text-gray-400 mx-auto" />
              </button>
            )}
            <div
              className="fixed top-0 right-0 h-full z-50 transition-all duration-300 ease-in-out"
              style={
                isDetailPanelFullscreen
                  ? {
                      left: 0,
                      width: "100vw",
                      background: "white",
                      zIndex: 60,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
                    }
                  : {
                      width: "min(823px, 90vw)",
                      right: 0,
                      left: "unset",
                      position: "fixed",
                      aspectRatio: "823/1080",
                      borderRight: "1px solid #ECECEC",
                      background: "rgba(255, 255, 255, 0.90)",
                      boxShadow: "0px 4px 12.8px 0px rgba(0, 0, 0, 0.30)",
                      backdropFilter: "blur(5px)",
                      flexShrink: 0,
                      height: "100%",
                      transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
                    }
              }
            >
              <div
                className="h-full overflow-y-auto relative"
                style={{ width: "100%" }}
              >
                <DetailPanel
                  segment={selectedSegment}
                  favoriteSegments={favoriteSegments}
                  onToggleFavorite={handleToggleFavorite}
                  onClose={() => setSelectedSegment(null)}
                  isFullscreen={isDetailPanelFullscreen}
                />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

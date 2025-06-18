import React, { useState, useCallback, useEffect } from "react";
import { NavBar } from "../Navigation/NavBar";
import { Sidebar } from "../Navigation/Sidebar";
import { GoogleMap } from "../Map/GoogleMap";
import { DetailPanel } from "../TrafficAnalysis/DetailPanel";
import { Intersection } from "../../types/global.types";
import { Map as MapIcon, Star, ChevronRight, ChevronLeft } from "lucide-react";
import { getTrafficIntersections } from "../../api/traffic";
import "./Dashboard.styles.css";

export default function Dashboard() {
  const [selectedIntersection, setSelectedIntersection] =
    useState<Intersection | null>(null);
  const [intersections, setIntersections] = useState<Intersection[]>([]);
  const [activeNav, setActiveNav] = useState("map");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [favoriteIntersections, setFavoriteIntersections] = useState<number[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  // 교차로 데이터 로드
  useEffect(() => {
    const loadIntersections = async () => {
      try {
        const data = await getTrafficIntersections();
        setIntersections(data);
        if (data.length > 0) {
          setSelectedIntersection(data[0]);
        }
      } catch (error) {
        console.error("교차로 데이터 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadIntersections();
  }, []);

  // 로컬 스토리지에서 즐겨찾기 불러오기 (초기화 시)
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favoriteIntersections");
    if (savedFavorites) {
      setFavoriteIntersections(JSON.parse(savedFavorites));
    }
  }, []);

  // 즐겨찾기 변경 시 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem(
      "favoriteIntersections",
      JSON.stringify(favoriteIntersections)
    );
  }, [favoriteIntersections]);

  // 즐겨찾기 토글 함수
  const handleToggleFavorite = useCallback((intersectionId: number) => {
    setFavoriteIntersections((prev) => {
      if (prev.includes(intersectionId)) {
        return prev.filter((id) => id !== intersectionId);
      } else {
        return [...prev, intersectionId];
      }
    });
  }, []);

  const handleIntersectionClick = useCallback((intersection: Intersection) => {
    setSelectedIntersection(intersection);
  }, []);

  // 네비게이션 변경 시 검색어 초기화
  const handleNavChange = useCallback((nav: string) => {
    setActiveNav(nav);
    setSearchTerm("");
  }, []);

  const [isDetailPanelFullscreen, setIsDetailPanelFullscreen] = useState(false);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <p className="text-gray-500">Loading data...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-gray-100 flex font-sans text-gray-800">
      <NavBar activeNav={activeNav} setActiveNav={handleNavChange} />
      <Sidebar
        selectedIntersection={selectedIntersection}
        onIntersectionClick={handleIntersectionClick}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        intersections={intersections}
        activeNav={activeNav}
        favoriteIntersections={favoriteIntersections}
        onToggleFavorite={handleToggleFavorite}
      />
      <main className="flex-1 relative bg-gray-100">
        {activeNav === "map" || activeNav === "favorites" ? (
          <>
            <div className="absolute inset-0">
              <GoogleMap
                selectedIntersection={selectedIntersection}
                onIntersectionClick={handleIntersectionClick}
                intersections={intersections}
              />
            </div>
            {activeNav === "favorites" && !selectedIntersection && (
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 flex items-center space-x-3 z-10">
                <Star size={24} className="text-red-500" />
                <div className="text-sm">
                  <p className="font-semibold text-gray-700">Favorites Mode</p>
                  <p className="text-gray-600">
                    {favoriteIntersections.length > 0
                      ? `${favoriteIntersections.length} favorite intersections`
                      : "No favorite intersections yet"}
                  </p>
                </div>
              </div>
            )}
            {activeNav === "map" && !selectedIntersection && (
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 flex items-center space-x-3">
                <MapIcon size={24} className="text-blue-500" />
                <p className="text-sm text-gray-700">
                  Click an intersection on the map or select from the list
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500">Other navigation content</p>
          </div>
        )}
        {selectedIntersection && (
          <>
            {/* Minimize button: only fixed on the left when maximized */}
            {isDetailPanelFullscreen && (
              <button
                onClick={() => setIsDetailPanelFullscreen(false)}
                className="fixed left-4 top-1/2 transform -translate-y-1/2 z-[70] flex items-center justify-center p-0 transition-all"
                aria-label="Exit fullscreen"
                title="Minimize"
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
            {/* Maximize button: only visible on the right of detail panel when not maximized */}
            {!isDetailPanelFullscreen && (
              <button
                onClick={() => setIsDetailPanelFullscreen(true)}
                className="fixed top-1/2 transform -translate-y-1/2 z-[70] flex items-center justify-center p-0 transition-all duration-300 translate-x-0 opacity-100 pointer-events-auto"
                aria-label="Enter fullscreen"
                title="Maximize"
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
                  boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)",
                }}
              >
                <ChevronLeft size={20} className="text-gray-400 mx-auto" />
              </button>
            )}
            <div
              className={`fixed top-0 h-full z-50 ${
                isDetailPanelFullscreen
                  ? "left-0 w-screen"
                  : "right-0 w-[min(823px,90vw)]"
              }`}
              style={{
                background: isDetailPanelFullscreen
                  ? "white"
                  : "rgba(255, 255, 255, 0.90)",
                boxShadow: "0px 4px 12.8px 0px rgba(0, 0, 0, 0.30)",
                backdropFilter: "blur(5px)",
                borderRight: "1px solid #ECECEC",
                zIndex: 60,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                className="h-full overflow-y-auto relative flex justify-center"
                style={{ width: "100%" }}
              >
                <div className="w-full max-w-[1200px]">
                  <DetailPanel
                    intersection={selectedIntersection}
                    favoriteIntersections={favoriteIntersections}
                    onToggleFavorite={handleToggleFavorite}
                    onClose={() => setSelectedIntersection(null)}
                    isFullscreen={isDetailPanelFullscreen}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

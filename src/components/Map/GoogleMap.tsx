import React, { memo, useRef, useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { RoadSegment } from "../../types/global.types";
import {
  GOOGLE_MAPS_API_KEY,
  LIMA_CENTER,
  DEFAULT_ZOOM,
} from "../../utils/constants";
import { roadSegments } from "../../data/roadSegments";

interface GoogleMapProps {
  selectedSegment: RoadSegment | null;
  onSegmentClick: (segment: RoadSegment) => void;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export const GoogleMap = memo<GoogleMapProps>(
  ({ selectedSegment, onSegmentClick }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const googleMapRef = useRef<any>(null);
    const polylinesRef = useRef<Map<number, any>>(new Map());
    const markersRef = useRef<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>("");

    const initializeMap = useCallback(() => {
      if (!mapRef.current || !window.google) {
        console.error("Map ref or Google Maps not available");
        return;
      }

      try {
        // 지도 초기화
        const map = new window.google.maps.Map(mapRef.current, {
          center: LIMA_CENTER,
          zoom: DEFAULT_ZOOM,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
          mapTypeControl: false,
          fullscreenControl: false,
        });

        googleMapRef.current = map;

        // 도로 구간 폴리라인 생성
        roadSegments.forEach((segment) => {
          const polyline = new window.google.maps.Polyline({
            path: segment.coordinates,
            geodesic: true,
            strokeColor: "#6b7280",
            strokeOpacity: 0.8,
            strokeWeight: 6,
            clickable: true,
            map: map, // 직접 map 설정
          });

          polylinesRef.current.set(segment.id, polyline);

          // 클릭 이벤트
          polyline.addListener("click", () => {
            onSegmentClick(segment);
          });
        });

        // 간단한 테스트 마커 추가
        new window.google.maps.Marker({
          position: LIMA_CENTER,
          map: map,
          title: "Lima Center",
        });

        setIsLoading(false);
        setError("");
      } catch (err) {
        console.error("Error initializing map:", err);
        setError("지도를 초기화하는 중 오류가 발생했습니다.");
        setIsLoading(false);
      }
    }, [onSegmentClick]);

    useEffect(() => {
      // Google Maps 스크립트가 이미 로드되었는지 확인
      if (window.google && window.google.maps) {
        initializeMap();
      } else {
        // 기존 스크립트 태그가 있는지 확인
        const existingScript = document.querySelector(
          'script[src*="maps.googleapis.com"]'
        );
        if (existingScript) {
          existingScript.remove();
        }

        // 스크립트 로드
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=visualization,places&callback=initMap`;
        script.async = true;
        script.defer = true;

        // 전역 콜백 함수 설정
        window.initMap = () => {
          initializeMap();
        };

        script.onerror = () => {
          console.error("Failed to load Google Maps script");
          setError("Google Maps를 로드할 수 없습니다. API 키를 확인해주세요.");
          setIsLoading(false);
        };

        document.head.appendChild(script);
      }

      // Cleanup
      return () => {
        if (polylinesRef.current.size > 0) {
          polylinesRef.current.forEach((polyline) => {
            polyline.setMap(null);
          });
          polylinesRef.current.clear();
        }
        if (markersRef.current.length > 0) {
          markersRef.current.forEach((marker) => marker.setMap(null));
          markersRef.current = [];
        }
      };
    }, [initializeMap]);

    // 선택된 구간 하이라이트
    useEffect(() => {
      if (!googleMapRef.current) return;

      polylinesRef.current.forEach((polyline, segmentId) => {
        if (segmentId === selectedSegment?.id) {
          polyline.setOptions({
            strokeColor: "#3b82f6",
            strokeWeight: 10,
            strokeOpacity: 1,
          });

          // 선택된 구간으로 지도 이동
          if (selectedSegment.bounds) {
            googleMapRef.current.fitBounds(selectedSegment.bounds);
          }
        } else {
          polyline.setOptions({
            strokeColor: "#6b7280",
            strokeWeight: 6,
            strokeOpacity: 0.8,
          });
        }
      });
    }, [selectedSegment]);

    return (
      <div className="relative w-full h-full">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <div className="text-center">
              <Loader2
                className="animate-spin text-blue-600 mx-auto"
                size={48}
              />
              <p className="mt-4 text-gray-600">지도를 불러오는 중...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <p className="text-red-600 font-semibold mb-2">오류</p>
              <p className="text-gray-700">{error}</p>
              <p className="text-sm text-gray-500 mt-2">
                브라우저 콘솔을 확인하여 자세한 정보를 확인하세요.
              </p>
            </div>
          </div>
        )}

        <div ref={mapRef} className="w-full h-full rounded-lg" />
      </div>
    );
  }
);

GoogleMap.displayName = "GoogleMap";

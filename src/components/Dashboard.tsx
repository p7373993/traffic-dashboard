import React, {
  useState,
  useCallback,
  useMemo,
  memo,
  useEffect,
  useRef,
} from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Map as MapIcon,
  FileText,
  Star,
  User,
  Search,
  Settings,
  ChevronLeft,
  ChevronRight,
  Maximize,
  AlertCircle,
  Download,
  X,
  Loader2,
} from "lucide-react";

// CSS 애니메이션 추가
const styles = `
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-slideUp {
    animation: slideUp 0.3s ease-out;
  }
`;

// 스타일 삽입
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

// --- 타입 정의 ---
type Coordinates = {
  lat: number;
  lng: number;
};

type RoadSegment = {
  id: number;
  name: string;
  length: number;
  area: string;
  coordinates: Coordinates[];
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
};

type TrafficData = {
  hour: string;
  speed: number;
  volume: number;
};

type Accident = {
  id: number;
  segmentId: number;
  date: string;
  time: string;
  severity: string;
  description: string;
  location: Coordinates;
};

// Google Maps 타입 정의
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

// --- 상수 및 설정 ---
const GOOGLE_MAPS_API_KEY = "YOUR_API_KEY_HERE"; // 실제 API 키로 교체 필요
const LIMA_CENTER: Coordinates = { lat: -12.0464, lng: -77.0428 };

// --- 데이터 ---
const roadSegments: RoadSegment[] = [
  {
    id: 1,
    name: "Av. Javier Prado Este",
    length: 5.2,
    area: "San Isidro",
    coordinates: [
      { lat: -12.0897, lng: -77.0117 },
      { lat: -12.0901, lng: -77.0033 },
      { lat: -12.0906, lng: -76.9949 },
    ],
    bounds: {
      north: -12.0897,
      south: -12.0906,
      east: -76.9949,
      west: -77.0117,
    },
  },
  {
    id: 2,
    name: "Panamericana Sur",
    length: 10.5,
    area: "Surco",
    coordinates: [
      { lat: -12.1464, lng: -76.9897 },
      { lat: -12.1564, lng: -76.9797 },
      { lat: -12.1664, lng: -76.9697 },
    ],
    bounds: {
      north: -12.1464,
      south: -12.1664,
      east: -76.9697,
      west: -76.9897,
    },
  },
  {
    id: 3,
    name: "Av. Arequipa",
    length: 6.8,
    area: "Miraflores",
    coordinates: [
      { lat: -12.083, lng: -77.034 },
      { lat: -12.103, lng: -77.034 },
      { lat: -12.123, lng: -77.034 },
    ],
    bounds: {
      north: -12.083,
      south: -12.123,
      east: -77.034,
      west: -77.034,
    },
  },
  {
    id: 4,
    name: "Vía Expresa Paseo de la República",
    length: 7.1,
    area: "Lima Centro",
    coordinates: [
      { lat: -12.0564, lng: -77.034 },
      { lat: -12.0764, lng: -77.034 },
      { lat: -12.0964, lng: -77.034 },
    ],
    bounds: {
      north: -12.0564,
      south: -12.0964,
      east: -77.034,
      west: -77.034,
    },
  },
  {
    id: 5,
    name: "Av. Elmer Faucett",
    length: 4.5,
    area: "Callao",
    coordinates: [
      { lat: -12.0214, lng: -77.1142 },
      { lat: -12.0314, lng: -77.1042 },
      { lat: -12.0414, lng: -77.0942 },
    ],
    bounds: {
      north: -12.0214,
      south: -12.0414,
      east: -77.0942,
      west: -77.1142,
    },
  },
];

// --- 유틸리티 함수 ---
const generateTrafficData = (segmentId: number): TrafficData[] => {
  const data: TrafficData[] = [];
  const baseSpeed = 40 - segmentId * 3;
  const baseVolume = 1200 + segmentId * 150;

  for (let i = 0; i < 24; i++) {
    const hour = `${i.toString().padStart(2, "0")}:00`;
    let speed, volume;

    if ((i >= 7 && i <= 9) || (i >= 17 && i <= 19)) {
      speed = baseSpeed * (0.4 + Math.random() * 0.2);
      volume = baseVolume * (1.6 + Math.random() * 0.4);
    } else {
      speed = baseSpeed * (0.9 + Math.random() * 0.1);
      volume = baseVolume * (0.7 + Math.random() * 0.2);
    }

    data.push({
      hour,
      speed: parseFloat(speed.toFixed(1)),
      volume: Math.round(volume),
    });
  }
  return data;
};

const accidentData: Accident[] = [
  {
    id: 1,
    segmentId: 4,
    date: "2024-07-14",
    time: "08:15",
    severity: "Minor",
    description: "Rear-end collision",
    location: { lat: -12.0664, lng: -77.034 },
  },
  {
    id: 2,
    segmentId: 2,
    date: "2024-07-14",
    time: "18:30",
    severity: "Moderate",
    description: "Multi-vehicle pile-up",
    location: { lat: -12.1514, lng: -76.9847 },
  },
  {
    id: 3,
    segmentId: 4,
    date: "2024-07-13",
    time: "19:00",
    severity: "Minor",
    description: "Side-swipe",
    location: { lat: -12.0864, lng: -77.034 },
  },
];

// --- Google Maps 컴포넌트 ---
const GoogleMap = memo(
  ({
    selectedSegment,
    onSegmentClick,
  }: {
    selectedSegment: RoadSegment | null;
    onSegmentClick: (segment: RoadSegment) => void;
  }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const googleMapRef = useRef<any>(null);
    const polylinesRef = useRef<Map<number, any>>(new Map());
    const markersRef = useRef<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Google Maps 스크립트 로드
    useEffect(() => {
      if (!window.google) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=visualization,places`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          initializeMap();
        };
        document.head.appendChild(script);
      } else {
        initializeMap();
      }

      return () => {
        // Cleanup
        markersRef.current.forEach((marker) => marker.setMap(null));
        polylinesRef.current.forEach((polyline) => polyline.setMap(null));
      };
    }, []);

    const initializeMap = useCallback(() => {
      if (!mapRef.current || !window.google) return;

      const map = new window.google.maps.Map(mapRef.current, {
        center: LIMA_CENTER,
        zoom: 12,
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
      setIsLoading(false);

      // 도로 구간 폴리라인 생성
      roadSegments.forEach((segment) => {
        const polyline = new window.google.maps.Polyline({
          path: segment.coordinates,
          geodesic: true,
          strokeColor: "#6b7280",
          strokeOpacity: 0.8,
          strokeWeight: 6,
          clickable: true,
        });

        polyline.setMap(map);
        polylinesRef.current.set(segment.id, polyline);

        // 클릭 이벤트
        polyline.addListener("click", () => {
          onSegmentClick(segment);
        });
      });

      // 사고 마커 추가
      accidentData.forEach((accident) => {
        const marker = new window.google.maps.Marker({
          position: accident.location,
          map: map,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: accident.severity === "Moderate" ? "#f59e0b" : "#fbbf24",
            fillOpacity: 0.8,
            strokeColor: "#ffffff",
            strokeWeight: 2,
          },
          title: `${accident.severity} - ${accident.description}`,
        });

        markersRef.current.push(marker);
      });

      // 교통 레이어 추가 (실제 교통 정보)
      const trafficLayer = new window.google.maps.TrafficLayer();
      trafficLayer.setMap(map);
    }, [onSegmentClick]);

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
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <Loader2 className="animate-spin text-blue-600" size={48} />
          </div>
        )}
        <div ref={mapRef} className="w-full h-full rounded-lg" />
      </div>
    );
  }
);

// --- 최적화된 컴포넌트들 ---
const MiniChart = memo(
  ({
    data,
    dataKey,
    color,
  }: {
    data: TrafficData[];
    dataKey: keyof TrafficData;
    color: string;
  }) => (
    <ResponsiveContainer width="100%" height={100}>
      <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
        <Tooltip
          contentStyle={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "0.5rem",
            fontSize: "0.75rem",
            color: "#1f2937",
          }}
          labelStyle={{ fontWeight: "bold" }}
        />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          fill={color}
          fillOpacity={0.1}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
);

const DetailPanel = memo(({ segment }: { segment: RoadSegment }) => {
  const trafficData = useMemo(
    () => generateTrafficData(segment.id),
    [segment.id]
  );

  const { avgSpeed, maxVolume } = useMemo(() => {
    const avgSpeed = (
      trafficData.reduce((acc, cur) => acc + cur.speed, 0) / trafficData.length
    ).toFixed(1);
    const maxVolume = Math.max(...trafficData.map((d) => d.volume));
    return { avgSpeed, maxVolume };
  }, [trafficData]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-1 pr-8">{segment.name}</h2>
      <p className="text-sm text-gray-500 mb-6">
        {segment.area} | 길이: {segment.length}km
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6 text-center">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">평균 속도</p>
          <p className="text-3xl font-bold text-blue-600">
            {avgSpeed}
            <span className="text-base ml-1">km/h</span>
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">최대 교통량</p>
          <p className="text-3xl font-bold text-green-600">
            {maxVolume}
            <span className="text-base ml-1">vph</span>
          </p>
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg mb-6">
        <h4 className="font-bold text-base mb-2 flex items-center">
          <AlertCircle size={18} className="mr-2 text-yellow-500" />
          데이터 해석
        </h4>
        <p className="text-sm text-gray-700">
          해당 구간의 평균 속도는{" "}
          <span className="font-bold">{avgSpeed} km/h</span> 입니다. 출퇴근
          시간대에 교통량이 최대{" "}
          <span className="font-bold">{maxVolume} vph</span>에 달하며 속도가
          저하되는 패턴을 보입니다.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-bold text-sm text-gray-700">시간대별 교통량</h4>
          <button className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors">
            상세 분석
          </button>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={trafficData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="speed"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
              name="속도 (km/h)"
            />
            <Area
              type="monotone"
              dataKey="volume"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.6}
              name="교통량 (vph)"
              yAxisId="right"
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 11 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 추가 액션 버튼들 */}
      <div className="mt-6 flex gap-2">
        <button className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
          전체 리포트 보기
        </button>
        <button className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
          데이터 내보내기
        </button>
      </div>
    </div>
  );
});

const DateTimePicker = memo(
  ({
    currentDate,
    setCurrentDate,
  }: {
    currentDate: Date;
    setCurrentDate: (date: Date) => void;
  }) => {
    const changeDate = useCallback(
      (amount: number) => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + amount);
        setCurrentDate(newDate);
      },
      [currentDate, setCurrentDate]
    );

    const changeHour = useCallback(
      (amount: number) => {
        const newDate = new Date(currentDate);
        newDate.setHours(newDate.getHours() + amount);
        setCurrentDate(newDate);
      },
      [currentDate, setCurrentDate]
    );

    const changeMinute = useCallback(
      (amount: number) => {
        const newDate = new Date(currentDate);
        let newMinutes = newDate.getMinutes() + amount;
        if (newMinutes < 0) {
          newMinutes = 55;
          newDate.setHours(newDate.getHours() - 1);
        }
        if (newMinutes > 59) {
          newMinutes = 0;
          newDate.setHours(newDate.getHours() + 1);
        }
        newDate.setMinutes(newMinutes);
        setCurrentDate(newDate);
      },
      [currentDate, setCurrentDate]
    );

    const isToday = useMemo(() => {
      const today = new Date();
      return (
        currentDate.getDate() === today.getDate() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear()
      );
    }, [currentDate]);

    const formatHour = (date: Date) =>
      date.getHours().toString().padStart(2, "0");
    const formatMinute = (date: Date) => {
      const minutes = date.getMinutes();
      return (Math.floor(minutes / 5) * 5).toString().padStart(2, "0");
    };

    return (
      <div className="flex items-center justify-between border border-gray-300 rounded-md p-1 bg-white text-sm">
        <div className="flex items-center justify-center flex-1">
          <button
            onClick={() => changeDate(-1)}
            className="p-1.5 hover:bg-gray-100 rounded-md"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="font-semibold w-20 text-center">
            {isToday
              ? "Today"
              : currentDate.toLocaleDateString("ko-KR", {
                  month: "2-digit",
                  day: "2-digit",
                })}
          </span>
          <button
            onClick={() => changeDate(1)}
            className="p-1.5 hover:bg-gray-100 rounded-md"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="flex items-center justify-center flex-1 border-l border-r border-gray-300">
          <button
            onClick={() => changeHour(-1)}
            className="p-1.5 hover:bg-gray-100 rounded-md"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="font-semibold w-12 text-center">
            {formatHour(currentDate)}
          </span>
          <button
            onClick={() => changeHour(1)}
            className="p-1.5 hover:bg-gray-100 rounded-md"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="flex items-center justify-center flex-1">
          <button
            onClick={() => changeMinute(-5)}
            className="p-1.5 hover:bg-gray-100 rounded-md"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="font-semibold w-12 text-center">
            {formatMinute(currentDate)}
          </span>
          <button
            onClick={() => changeMinute(5)}
            className="p-1.5 hover:bg-gray-100 rounded-md"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  }
);

const ReportModal = memo(
  ({
    isOpen,
    onClose,
    comparisonSegments,
  }: {
    isOpen: boolean;
    onClose: () => void;
    comparisonSegments: RoadSegment[];
  }) => {
    const comparisonData = useMemo(
      () =>
        comparisonSegments.map((seg) => {
          const traffic = generateTrafficData(seg.id);
          return {
            name: seg.name,
            avgSpeed: parseFloat(
              (
                traffic.reduce((a, b) => a + b.speed, 0) / traffic.length
              ).toFixed(1)
            ),
            maxVolume: Math.max(...traffic.map((d) => d.volume)),
          };
        }),
      [comparisonSegments]
    );

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white text-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
            <h2 className="text-2xl font-bold">교통 분석 보고서</h2>
            <div className="flex items-center space-x-2">
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                <Download size={16} className="mr-2" /> PDF로 내보내기
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-200"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          <div className="p-8">
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">구간별 비교 분석</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={comparisonData}
                    layout="vertical"
                    margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 12, fill: "#6b7280" }}
                      stroke="#ccc"
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={120}
                      tick={{ fontSize: 12, fill: "#374151" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #ccc",
                      }}
                    />
                    <Legend wrapperStyle={{ color: "#374151" }} />
                    <Bar
                      dataKey="avgSpeed"
                      fill="#3b82f6"
                      name="평균 속도 (km/h)"
                    />
                    <Bar
                      dataKey="maxVolume"
                      fill="#10b981"
                      name="최대 교통량 (vph)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

// --- 메인 앱 컴포넌트 ---
export default function App() {
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

  const filteredSegments = useMemo(
    () =>
      roadSegments.filter(
        (segment) =>
          segment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          segment.area.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [searchTerm]
  );

  const formatFullDate = useCallback((date: Date) => {
    const yyyy = date.getFullYear();
    const mm = (date.getMonth() + 1).toString().padStart(2, "0");
    const dd = date.getDate().toString().padStart(2, "0");
    const hh = date.getHours().toString().padStart(2, "0");
    const min = (Math.floor(date.getMinutes() / 5) * 5)
      .toString()
      .padStart(2, "0");
    return `${yyyy} ${mm} ${dd} ${hh}:${min}`;
  }, []);

  return (
    <div className="h-screen w-full bg-gray-100 flex font-sans text-gray-800">
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
        <div className="p-3">
          <button
            onClick={() => {
              setActiveNav("report");
              setIsReportModalOpen(true);
            }}
            className={`p-3 rounded-lg transition-colors ${
              activeNav === "report"
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <FileText size={24} />
          </button>
        </div>
        <div className="p-3">
          <button
            onClick={() => setActiveNav("favorites")}
            className={`p-3 rounded-lg transition-colors ${
              activeNav === "favorites"
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Star size={24} />
          </button>
        </div>
        <div className="mt-auto p-4">
          <button className="p-2 rounded-full bg-gray-200 text-gray-600">
            <User size={24} />
          </button>
        </div>
      </nav>

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
            <button className="text-xs bg-gray-200 text-gray-700 font-semibold px-3 py-1.5 rounded-full hover:bg-gray-300">
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
            교통 분석 구간
          </h3>
          {filteredSegments.map((segment) => {
            const trafficData = generateTrafficData(segment.id);
            const isSelected = selectedSegment?.id === segment.id;
            return (
              <div
                key={segment.id}
                onClick={() => handleSegmentClick(segment)}
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
      </aside>

      <main className="flex-1 relative bg-gray-100">
        {/* 전체 화면 지도 */}
        <div className="absolute inset-0">
          <GoogleMap
            selectedSegment={selectedSegment}
            onSegmentClick={handleSegmentClick}
          />
        </div>

        {/* 플로팅 데이터 패널 */}
        {selectedSegment && (
          <div className="absolute bottom-8 right-8 left-8 md:left-auto md:w-[500px] max-h-[80vh] overflow-y-auto animate-slideUp">
            <div className="bg-white rounded-xl shadow-2xl border border-gray-200">
              {/* 닫기 버튼 */}
              <button
                onClick={() => setSelectedSegment(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
                aria-label="닫기"
              >
                <X size={20} className="text-gray-500" />
              </button>

              <DetailPanel segment={selectedSegment} />
            </div>
          </div>
        )}

        {/* 선택 안내 메시지 */}
        {!selectedSegment && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 flex items-center space-x-3">
            <MapIcon size={24} className="text-blue-500" />
            <p className="text-sm text-gray-700">
              지도에서 도로 구간을 클릭하거나 왼쪽 목록에서 선택하세요
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

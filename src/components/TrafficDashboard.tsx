import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

// 아이콘 컴포넌트들 (lucide-react 대신 SVG로 대체)
const MapPin = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const Calendar = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const Clock = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
);

const Download = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7,10 12,15 17,10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const Play = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polygon points="5,3 19,12 5,21" />
  </svg>
);

const Menu = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const X = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// 타입 정의
interface Intersection {
  id: number;
  name: string;
  lat: number;
  lng: number;
  status: "high" | "medium" | "low";
  code: string;
}

interface TrafficDataPoint {
  time: string;
  value: number;
}

interface TrafficData {
  speed: TrafficDataPoint[];
  congestion: TrafficDataPoint[];
  accidents: TrafficDataPoint[];
}

const TrafficDashboard = () => {
  const [selectedDate, setSelectedDate] = useState<string>("today");
  const [selectedTime, setSelectedTime] = useState<string>("09:00");
  const [selectedIntersection, setSelectedIntersection] = useState<
    number | null
  >(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<keyof TrafficData>("speed");
  const [analysisGenerated, setAnalysisGenerated] = useState<boolean>(false);

  // 가상의 교차로 데이터
  const intersections: Intersection[] = [
    {
      id: 1,
      name: "강남역 교차로",
      lat: 37.4979,
      lng: 127.0276,
      status: "high",
      code: "GN001",
    },
    {
      id: 2,
      name: "잠실역 교차로",
      lat: 37.5133,
      lng: 127.1,
      status: "medium",
      code: "JS001",
    },
    {
      id: 3,
      name: "홍대입구역 교차로",
      lat: 37.5563,
      lng: 126.9236,
      status: "low",
      code: "HD001",
    },
    {
      id: 4,
      name: "명동 교차로",
      lat: 37.5636,
      lng: 126.9834,
      status: "high",
      code: "MD001",
    },
    {
      id: 5,
      name: "이태원 교차로",
      lat: 37.5336,
      lng: 126.9946,
      status: "medium",
      code: "IT001",
    },
  ];

  // 가상의 시계열 데이터
  const trafficData: TrafficData = {
    speed: [
      { time: "06:00", value: 45 },
      { time: "07:00", value: 32 },
      { time: "08:00", value: 28 },
      { time: "09:00", value: 25 },
      { time: "10:00", value: 38 },
      { time: "11:00", value: 42 },
      { time: "12:00", value: 35 },
      { time: "13:00", value: 40 },
      { time: "14:00", value: 43 },
      { time: "15:00", value: 38 },
      { time: "16:00", value: 30 },
      { time: "17:00", value: 22 },
      { time: "18:00", value: 20 },
      { time: "19:00", value: 28 },
      { time: "20:00", value: 35 },
    ],
    congestion: [
      { time: "06:00", value: 20 },
      { time: "07:00", value: 65 },
      { time: "08:00", value: 85 },
      { time: "09:00", value: 90 },
      { time: "10:00", value: 55 },
      { time: "11:00", value: 45 },
      { time: "12:00", value: 60 },
      { time: "13:00", value: 50 },
      { time: "14:00", value: 40 },
      { time: "15:00", value: 55 },
      { time: "16:00", value: 70 },
      { time: "17:00", value: 95 },
      { time: "18:00", value: 100 },
      { time: "19:00", value: 75 },
      { time: "20:00", value: 45 },
    ],
    accidents: [
      { time: "06:00", value: 0 },
      { time: "07:00", value: 1 },
      { time: "08:00", value: 2 },
      { time: "09:00", value: 1 },
      { time: "10:00", value: 0 },
      { time: "11:00", value: 1 },
      { time: "12:00", value: 2 },
      { time: "13:00", value: 1 },
      { time: "14:00", value: 0 },
      { time: "15:00", value: 1 },
      { time: "16:00", value: 2 },
      { time: "17:00", value: 3 },
      { time: "18:00", value: 2 },
      { time: "19:00", value: 1 },
      { time: "20:00", value: 0 },
    ],
  };

  const getAnalysisText = (): string => {
    if (!selectedIntersection) return "";

    const intersection = intersections.find(
      (i) => i.id === selectedIntersection
    );
    if (!intersection) return "";

    const data = trafficData[activeTab];
    const avgValue =
      data.reduce(
        (sum: number, item: TrafficDataPoint) => sum + item.value,
        0
      ) / data.length;
    const maxValue = Math.max(
      ...data.map((item: TrafficDataPoint) => item.value)
    );
    const maxTime = data.find(
      (item: TrafficDataPoint) => item.value === maxValue
    )?.time;

    switch (activeTab) {
      case "speed":
        return `${intersection.name}의 평균 통행 속도는 ${avgValue.toFixed(
          1
        )}km/h입니다. 오전 8-9시 구간에서 가장 낮은 속도를 보이며, ${maxTime}에 최대 ${maxValue}km/h의 속도를 기록했습니다. 출퇴근 시간대의 속도 저하가 뚜렷하게 관찰됩니다.`;
      case "congestion":
        return `${intersection.name}의 평균 혼잡도는 ${avgValue.toFixed(
          1
        )}%입니다. ${maxTime}에 최대 혼잡도 ${maxValue}%를 기록하여 심각한 교통체증이 발생했습니다. 오전 7-9시와 오후 5-7시 구간에서 혼잡도가 급격히 증가하는 패턴을 보입니다.`;
      case "accidents":
        return `${intersection.name}에서 총 ${data.reduce(
          (sum, item) => sum + item.value,
          0
        )}건의 교통사고가 발생했습니다. ${maxTime}에 최대 ${maxValue}건의 사고가 집중되었으며, 교통량이 많은 시간대와 사고 발생률이 비례하는 경향을 보입니다.`;
      default:
        return "";
    }
  };

  const handleIntersectionClick = (intersection: Intersection): void => {
    setSelectedIntersection(intersection.id);
    setAnalysisGenerated(false);
  };

  const generateAnalysis = (): void => {
    setAnalysisGenerated(true);
  };

  const exportData = (format: string): void => {
    alert(`${format} 형식으로 데이터를 내보냅니다.`);
  };

  const getStatusColor = (status: "high" | "medium" | "low"): string => {
    switch (status) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getChartColor = (): string => {
    switch (activeTab) {
      case "speed":
        return "#3b82f6";
      case "congestion":
        return "#ef4444";
      case "accidents":
        return "#f59e0b";
      default:
        return "#3b82f6";
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 사이드바 */}
      <div
        className={`${
          sidebarOpen ? "w-80" : "w-0"
        } transition-all duration-300 bg-white shadow-lg overflow-hidden`}
      >
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-800">
              교통 분석 시스템
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X size={20} />
            </button>
          </div>

          {/* 날짜/시간 선택 */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                기간 선택
              </label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="today">오늘</option>
                <option value="week">최근 일주일</option>
                <option value="month">최근 한달</option>
                <option value="custom">사용자 정의</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                시간 선택
              </label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 교차로 목록 */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 mb-3">교차로 목록</h3>
          <div className="space-y-2">
            {intersections.map((intersection) => (
              <div
                key={intersection.id}
                onClick={() => handleIntersectionClick(intersection)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedIntersection === intersection.id
                    ? "bg-blue-100 border-blue-300 border"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-800">
                      {intersection.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      코드: {intersection.code}
                    </div>
                  </div>
                  <div
                    className={`w-3 h-3 rounded-full ${getStatusColor(
                      intersection.status
                    )}`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col">
        {/* 헤더 */}
        <div className="bg-white shadow-sm p-4 flex items-center justify-between">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <Menu size={20} />
            </button>
          )}

          {selectedIntersection && (
            <div className="flex items-center space-x-4">
              <div className="text-lg font-semibold text-gray-800">
                {intersections.find((i) => i.id === selectedIntersection)?.name}{" "}
                분석
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => exportData("PDF")}
                  className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <Download size={16} />
                  <span>PDF</span>
                </button>
                <button
                  onClick={() => exportData("Excel")}
                  className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Download size={16} />
                  <span>Excel</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 flex">
          {/* 지도 영역 */}
          <div className="flex-1 relative">
            <div className="h-full bg-gray-200 relative overflow-hidden">
              {/* 가상 지도 배경 */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100">
                <div className="absolute top-10 left-10 text-2xl font-bold text-gray-600">
                  서울시 교통 현황
                </div>

                {/* 교차로 마커들 */}
                {intersections.map((intersection, index) => (
                  <div
                    key={intersection.id}
                    onClick={() => handleIntersectionClick(intersection)}
                    className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
                      selectedIntersection === intersection.id
                        ? "scale-150"
                        : "scale-100"
                    } transition-transform hover:scale-125`}
                    style={{
                      left: `${20 + index * 15}%`,
                      top: `${30 + index * 12}%`,
                    }}
                  >
                    <div
                      className={`w-4 h-4 rounded-full ${getStatusColor(
                        intersection.status
                      )} border-2 border-white shadow-lg`}
                    ></div>
                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-xs font-medium shadow-md whitespace-nowrap">
                      {intersection.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 데이터 시각화 패널 */}
          {selectedIntersection && (
            <div className="w-96 bg-white shadow-lg border-l">
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  데이터 분석
                </h3>

                {/* 탭 메뉴 */}
                <div className="flex space-x-1 mb-4">
                  <button
                    onClick={() => setActiveTab("speed")}
                    className={`px-3 py-2 rounded text-sm font-medium ${
                      activeTab === "speed"
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    평균속도
                  </button>
                  <button
                    onClick={() => setActiveTab("congestion")}
                    className={`px-3 py-2 rounded text-sm font-medium ${
                      activeTab === "congestion"
                        ? "bg-red-100 text-red-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    혼잡도
                  </button>
                  <button
                    onClick={() => setActiveTab("accidents")}
                    className={`px-3 py-2 rounded text-sm font-medium ${
                      activeTab === "accidents"
                        ? "bg-yellow-100 text-yellow-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    사고현황
                  </button>
                </div>

                {/* 차트 */}
                <div className="h-64 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    {activeTab === "accidents" ? (
                      <BarChart data={trafficData[activeTab]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill={getChartColor()} />
                      </BarChart>
                    ) : (
                      <LineChart data={trafficData[activeTab]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke={getChartColor()}
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                </div>

                {/* 분석 생성 버튼 */}
                <button
                  onClick={generateAnalysis}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-4"
                >
                  <Play size={16} />
                  <span>데이터 해석 생성</span>
                </button>

                {/* 분석 결과 */}
                {analysisGenerated && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">
                      AI 분석 결과
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {getAnalysisText()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrafficDashboard;
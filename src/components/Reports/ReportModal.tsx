import React, { memo, useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Download, X } from "lucide-react";
import { RoadSegment } from "../../types/global.types";
import { generateTrafficData } from "../../utils/trafficDataGenerator";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparisonSegments: RoadSegment[];
}

interface ComparisonChartData {
  name: string;
  avgSpeed: number;
  maxVolume: number;
}

export const ReportModal = memo<ReportModalProps>(
  ({ isOpen, onClose, comparisonSegments }) => {
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

            {/* 추가 분석 섹션 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h4 className="font-bold text-lg mb-2">평균 속도 분석</h4>
                <p className="text-sm text-gray-700">
                  가장 빠른 구간:{" "}
                  <span className="font-bold">
                    {
                      comparisonData.reduce((prev, curr) =>
                        prev.avgSpeed > curr.avgSpeed ? prev : curr
                      ).name
                    }
                  </span>
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  가장 느린 구간:{" "}
                  <span className="font-bold">
                    {
                      comparisonData.reduce((prev, curr) =>
                        prev.avgSpeed < curr.avgSpeed ? prev : curr
                      ).name
                    }
                  </span>
                </p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h4 className="font-bold text-lg mb-2">교통량 분석</h4>
                <p className="text-sm text-gray-700">
                  최대 교통량 구간:{" "}
                  <span className="font-bold">
                    {
                      comparisonData.reduce((prev, curr) =>
                        prev.maxVolume > curr.maxVolume ? prev : curr
                      ).name
                    }
                  </span>
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  최소 교통량 구간:{" "}
                  <span className="font-bold">
                    {
                      comparisonData.reduce((prev, curr) =>
                        prev.maxVolume < curr.maxVolume ? prev : curr
                      ).name
                    }
                  </span>
                </p>
              </div>
            </div>

            {/* 권장사항 섹션 */}
            <div className="bg-gray-100 p-6 rounded-lg">
              <h4 className="font-bold text-lg mb-3">권장사항</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  출퇴근 시간대(07:00-09:00, 17:00-19:00)는 가능한 우회 경로
                  이용을 권장합니다.
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  평균 속도가 20km/h 이하인 구간은 대중교통 이용을 고려해보세요.
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  실시간 교통 정보를 확인하여 경로를 유동적으로 조정하세요.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ReportModal.displayName = "ReportModal";

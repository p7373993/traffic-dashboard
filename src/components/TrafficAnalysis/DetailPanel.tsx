import React, { memo, useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { AlertCircle } from "lucide-react";
import { RoadSegment } from "../../types/global.types";
import { generateTrafficData } from "../../utils/trafficDataGenerator";

interface DetailPanelProps {
  segment: RoadSegment;
}

export const DetailPanel = memo<DetailPanelProps>(({ segment }) => {
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
        {segment.area} | Length: {segment.length} km
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6 text-center">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Average Speed</p>
          <p className="text-3xl font-bold text-blue-600">
            {avgSpeed}
            <span className="text-base ml-1">km/h</span>
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Maximum Volume</p>
          <p className="text-3xl font-bold text-green-600">
            {maxVolume}
            <span className="text-base ml-1">vph</span>
          </p>
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg mb-6">
        <h4 className="font-bold text-base mb-2 flex items-center">
          <AlertCircle size={18} className="mr-2 text-yellow-500" />
          Data Insight
        </h4>
        <p className="text-sm text-gray-700">
          The average speed for this segment is{" "}
          <span className="font-bold">{avgSpeed} km/h</span>. During rush hours,
          traffic volume can reach up to{" "}
          <span className="font-bold">{maxVolume} vph</span>, indicating a
          pattern of speed reduction.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-bold text-sm text-gray-700">
            Hourly Traffic Volume
          </h4>
          <button className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors">
            Detailed Analysis
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
              name="Speed (km/h)"
            />
            <Area
              type="monotone"
              dataKey="volume"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.6}
              name="Volume (vph)"
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

      <div className="mt-6 flex justify-end gap-2">
        <button className="flex items-center gap-1 px-3 py-1.5 bg-black text-white text-sm rounded transition-colors hover:bg-gray-800">
          Export Data
          <span className="text-white">&gt;</span>
        </button>
      </div>
    </div>
  );
});

DetailPanel.displayName = "DetailPanel";

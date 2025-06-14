import React, { memo } from "react";
import { ResponsiveContainer, AreaChart, Area, Tooltip } from "recharts";
import { TrafficData } from "../../types/global.types";

interface MiniChartProps {
  data: TrafficData[];
  dataKey: keyof TrafficData;
  color: string;
}

export const MiniChart = memo<MiniChartProps>(({ data, dataKey, color }) => (
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
));

MiniChart.displayName = "MiniChart";

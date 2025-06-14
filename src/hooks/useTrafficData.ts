import { useState, useEffect } from "react";
import { TrafficData } from "../types/global.types";
import { generateTrafficData } from "../utils/trafficDataGenerator";

export const useTrafficData = (segmentId: number) => {
  const [data, setData] = useState<TrafficData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 실제로는 API 호출
        const trafficData = generateTrafficData(segmentId);
        setData(trafficData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [segmentId]);

  return { data, loading, error };
};

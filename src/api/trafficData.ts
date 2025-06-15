import api from "./axios";
import { TrafficData } from "../types/global.types";

export const trafficDataApi = {
  // 특정 도로 구간의 교통 데이터 조회
  getTrafficDataBySegment: async (
    segmentId: number
  ): Promise<TrafficData[]> => {
    const response = await api.get(`/traffic-data/segment/${segmentId}`);
    return response.data;
  },

  // 특정 시간대의 교통 데이터 조회
  getTrafficDataByHour: async (hour: string): Promise<TrafficData[]> => {
    const response = await api.get(`/traffic-data/hour/${hour}`);
    return response.data;
  },

  // 특정 도로 구간의 특정 시간대 교통 데이터 조회
  getTrafficDataBySegmentAndHour: async (
    segmentId: number,
    hour: string
  ): Promise<TrafficData> => {
    const response = await api.get(
      `/traffic-data/segment/${segmentId}/hour/${hour}`
    );
    return response.data;
  },
};

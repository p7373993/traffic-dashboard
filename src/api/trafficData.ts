import api from "./axios";
import { TrafficData } from "../types/global.types";

export const trafficDataApi = {
  // 특정 도로 구간의 교통 데이터 조회
  getTrafficDataBySegment: async (
    segmentId: number
  ): Promise<TrafficData[]> => {
    const response = await api.get(`/api/traffic-data/segment/${segmentId}`);
    return response.data;
  },

  // 특정 시간대의 교통 데이터 조회
  getTrafficDataByHour: async (hour: string): Promise<TrafficData[]> => {
    const response = await api.get(`/api/traffic-data/hour/${hour}`);
    return response.data;
  },

  // 특정 도로 구간의 특정 시간대 교통 데이터 조회
  getTrafficDataBySegmentAndHour: async (
    segmentId: number,
    hour: string
  ): Promise<TrafficData> => {
    const response = await api.get(
      `/api/traffic-data/segment/${segmentId}/hour/${hour}`
    );
    return response.data;
  },

  // 교차로별 15분 단위 교통 데이터 조회
  getIntersectionTrafficData: async (
    intersectionId: number,
    startTime: string,
    endTime: string
  ): Promise<TrafficData[]> => {
    const response = await api.get(
      `/api/traffic-data/intersection/${intersectionId}`,
      {
        params: {
          start_time: startTime,
          end_time: endTime
        }
      }
    );
    return response.data;
  },

  // 모든 교차로의 특정 시간대 교통 데이터 조회
  getAllIntersectionsTrafficData: async (
    time: string
  ): Promise<TrafficData[]> => {
    const response = await api.get(
      `/api/traffic-data/intersections`,
      {
        params: {
          time: time
        }
      }
    );
    return response.data;
  }
};

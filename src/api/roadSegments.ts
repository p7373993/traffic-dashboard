import api from "./axios";
import { RoadSegment } from "../types/global.types";

export const roadSegmentApi = {
  // 모든 도로 구간 조회
  getAllRoadSegments: async (): Promise<RoadSegment[]> => {
    const response = await api.get("/road-segments");
    return response.data;
  },

  // 특정 도로 구간 조회
  getRoadSegmentById: async (id: number): Promise<RoadSegment> => {
    const response = await api.get(`/road-segments/${id}`);
    return response.data;
  },

  // 특정 지역의 도로 구간 조회
  getRoadSegmentsByArea: async (area: string): Promise<RoadSegment[]> => {
    const response = await api.get(`/road-segments/area/${area}`);
    return response.data;
  },
};

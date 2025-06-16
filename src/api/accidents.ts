import api from "./axios";
import { Accident } from "../types/global.types";

export const accidentApi = {
  // 모든 사고 데이터 조회
  getAllAccidents: async (): Promise<Accident[]> => {
    const response = await api.get("/accidents");
    return response.data;
  },

  // 특정 도로 구간의 사고 데이터 조회
  getAccidentsBySegment: async (segmentId: number): Promise<Accident[]> => {
    const response = await api.get(`/accidents/segment/${segmentId}`);
    return response.data;
  },

  // 특정 날짜의 사고 데이터 조회
  getAccidentsByDate: async (date: string): Promise<Accident[]> => {
    const response = await api.get(`/accidents/date/${date}`);
    return response.data;
  },

  // 특정 심각도의 사고 데이터 조회
  getAccidentsBySeverity: async (severity: string): Promise<Accident[]> => {
    const response = await api.get(`/accidents/severity/${severity}`);
    return response.data;
  },

  // 새로운 사고 데이터 추가
  createAccident: async (accident: Omit<Accident, "id">): Promise<Accident> => {
    const response = await api.post("/accidents", accident);
    return response.data;
  },
};

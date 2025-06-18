import api from "./axios";
import { Intersection } from "../types/global.types";

export const getTrafficIntersections = async (): Promise<Intersection[]> => {
  const response = await api.get("/intersections/latest_volume/");
  const data = response.data.map((item: any) => ({
    ...item,
    total_volume: item.total_volume || 0, // 기본값 설정
  }));
  return data;
};

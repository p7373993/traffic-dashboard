import api from './axios';

export interface TrafficIntersection {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export const getTrafficIntersections = async (): Promise<TrafficIntersection[]> => {
  const response = await api.get('/intersections/latest_volume/');
  console.log('교차로 데이터:', response.data); // 데이터 확인을 위한 로그
  return response.data;
}; 
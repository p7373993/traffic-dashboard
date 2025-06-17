export type Coordinates = {
  lat: number;
  lng: number;
};

export type RoadSegment = {
  id: number;
  name: string;
  length: number;
  area: string;
  coordinates: Coordinates[];
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
};

export type TrafficData = {
  hour: string;
  speed: number;
  volume: number;
};

export type IntersectionTrafficData = {
  intersection_id: number;
  timestamp: string;  // 15분 단위 시간
  average_speed: number;
  total_volume: number;
};

export type Accident = {
  id: number;
  segmentId: number;
  date: string;
  time: string;
  severity: string;
  description: string;
  location: Coordinates;
};
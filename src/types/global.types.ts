export type Coordinates = {
  lat: number;
  lng: number;
};

export type Intersection = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  total_volume: number;
  average_speed: number;
  datetime: string;
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

export type Accident = {
  id: number;
  segmentId: number;
  date: string;
  time: string;
  severity: string;
  description: string;
  location: Coordinates;
};

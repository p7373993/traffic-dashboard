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

export type TrafficData = {
  hour: string;
  speed: number;
  volume: number;
};

export type Incident = {
  id: number;
  incident_number: number;
  ticket_number: number;
  incident_type: string;
  incident_detail_type: string;
  location_name: string;
  district: string;
  managed_by: string;
  assigned_to: string;
  description: string;
  operator: string;
  status: string;
  registered_at: string;
  last_status_update: string;
  day: number;
  month: number;
  year: number;
  intersection: number;
  intersection_name: string;
  latitude: number;
  longitude: number;
};

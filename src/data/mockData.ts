import { Accident } from "../types/global.types";

export const accidentData: Accident[] = [
  {
    id: 1,
    segmentId: 4,
    date: "2024-07-14",
    time: "08:15",
    severity: "Minor",
    description: "Rear-end collision",
    location: { lat: -12.0664, lng: -77.034 },
  },
  {
    id: 2,
    segmentId: 2,
    date: "2024-07-14",
    time: "18:30",
    severity: "Moderate",
    description: "Multi-vehicle pile-up",
    location: { lat: -12.1514, lng: -76.9847 },
  },
  {
    id: 3,
    segmentId: 4,
    date: "2024-07-13",
    time: "19:00",
    severity: "Minor",
    description: "Side-swipe",
    location: { lat: -12.0864, lng: -77.034 },
  },
];

export const mockDataStore = {
  getTrafficData: (segmentId: number) => {
    // 실제로는 generateTrafficData를 사용하지만,
    // 여기서는 API 호출을 시뮬레이션하는 용도로 사용
    return import("../utils/trafficDataGenerator").then((module) =>
      module.generateTrafficData(segmentId)
    );
  },
  getAccidents: (segmentId: number) =>
    accidentData.filter((a: Accident) => a.segmentId === segmentId),
};

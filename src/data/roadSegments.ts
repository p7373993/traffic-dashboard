import { RoadSegment } from "../types/global.types";

export const roadSegments: RoadSegment[] = [
  {
    id: 1,
    name: "Av. Javier Prado Este",
    length: 5.2,
    area: "San Isidro",
    coordinates: [
      { lat: -12.0897, lng: -77.0117 },
      { lat: -12.0901, lng: -77.0033 },
      { lat: -12.0906, lng: -76.9949 },
    ],
    bounds: {
      north: -12.0897,
      south: -12.0906,
      east: -76.9949,
      west: -77.0117,
    },
  },
  {
    id: 2,
    name: "Panamericana Sur",
    length: 10.5,
    area: "Surco",
    coordinates: [
      { lat: -12.1464, lng: -76.9897 },
      { lat: -12.1564, lng: -76.9797 },
      { lat: -12.1664, lng: -76.9697 },
    ],
    bounds: {
      north: -12.1464,
      south: -12.1664,
      east: -76.9697,
      west: -76.9897,
    },
  },
  {
    id: 3,
    name: "Av. Arequipa",
    length: 6.8,
    area: "Miraflores",
    coordinates: [
      { lat: -12.083, lng: -77.034 },
      { lat: -12.103, lng: -77.034 },
      { lat: -12.123, lng: -77.034 },
    ],
    bounds: {
      north: -12.083,
      south: -12.123,
      east: -77.034,
      west: -77.034,
    },
  },
  {
    id: 4,
    name: "Vía Expresa Paseo de la República",
    length: 7.1,
    area: "Lima Centro",
    coordinates: [
      { lat: -12.0564, lng: -77.034 },
      { lat: -12.0764, lng: -77.034 },
      { lat: -12.0964, lng: -77.034 },
    ],
    bounds: {
      north: -12.0564,
      south: -12.0964,
      east: -77.034,
      west: -77.034,
    },
  },
  {
    id: 5,
    name: "Av. Elmer Faucett",
    length: 4.5,
    area: "Callao",
    coordinates: [
      { lat: -12.0214, lng: -77.1142 },
      { lat: -12.0314, lng: -77.1042 },
      { lat: -12.0414, lng: -77.0942 },
    ],
    bounds: {
      north: -12.0214,
      south: -12.0414,
      east: -77.0942,
      west: -77.1142,
    },
  },
];

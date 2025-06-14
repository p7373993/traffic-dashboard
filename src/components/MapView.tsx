import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

type GeoJSONFeature = {
  geometry: {
    type: "Point";
    coordinates: [number, number, number]; // Point 좌표 (lon, lat, z)
  };
  properties: {
    id?: string;
    [key: string]: any;
  };
};

const MapView = () => {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [-76.98516422, -12.04000049],
      zoom: 12,
    });

    map.on("load", () => {
      fetch("/road-segments.json")
        .then((res) => res.json())
        .then((data) => {
          console.log("GeoJSON Data:", data);

          map.addSource("road-segments", {
            type: "geojson",
            data: data,
          });

          map.addLayer({
            id: "road-segments-layer",
            type: "circle",
            source: "road-segments",
            paint: {
              "circle-radius": 6,
              "circle-color": "#FF0000",
              "circle-stroke-width": 1,
              "circle-stroke-color": "#000000",
            },
          } as maplibregl.LayerSpecification);

          const coordinates: [number, number][] = data.features.map(
            (f: GeoJSONFeature) => [
              f.geometry.coordinates[0],
              f.geometry.coordinates[1],
            ]
          );

          const bounds = coordinates.reduce(
            (b: maplibregl.LngLatBounds, coord: [number, number]) =>
              b.extend(coord),
            new maplibregl.LngLatBounds(coordinates[0], coordinates[0])
          );

          map.fitBounds(bounds, { padding: 20 });

          console.log(
            "First Feature Geometry Type:",
            data.features[0].geometry.type
          );
        })
        .catch((err) => console.error("Failed to load GeoJSON:", err));
    });

    return () => map.remove();
  }, []);

  return <div ref={mapContainer} className="w-full h-screen" />;
};

export default MapView;

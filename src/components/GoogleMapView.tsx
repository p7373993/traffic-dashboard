/// <reference types="google.maps" />

import { useEffect, useRef, useState } from "react";

const GoogleMapView = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const initMap = () => {
      const map = new google.maps.Map(mapRef.current as HTMLElement, {
        center: { lat: -12.04, lng: -76.985 },
        zoom: 12,
      });

      const kmlLayer = new google.maps.KmlLayer({
        url: "http://googlemaps.github.io/js-v2-samples/ggeoxml/cta.kml",
        map: map,
      });

      kmlLayer.addListener("click", (event: google.maps.KmlMouseEvent) => {
        console.log("KML clicked:", event);
        const featureName = event.featureData?.name;
        if (featureName) {
          setSelectedFeature(featureName);
        }
      });
    };

    if (typeof google !== "undefined") {
      initMap();
    } else {
      console.error("Google Maps API not loaded");
    }
  }, []);

  return (
    <div className="flex w-full h-screen">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default GoogleMapView;

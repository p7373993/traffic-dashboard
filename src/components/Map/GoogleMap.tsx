import React from "react";
import {
  GoogleMap as GoogleMapComponent,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { Intersection } from "../../types/global.types";

interface GoogleMapProps {
  selectedIntersection: Intersection | null;
  onIntersectionClick: (intersection: Intersection) => void;
  intersections: Intersection[];
}

const defaultCenter = { lat: -12.0464, lng: -77.0428 }; // Lima, Peru

export const GoogleMap: React.FC<GoogleMapProps> = ({
  selectedIntersection,
  onIntersectionClick,
  intersections,
}) => {
  const [selectedMarker, setSelectedMarker] =
    React.useState<Intersection | null>(null);

  return (
    <GoogleMapComponent
      mapContainerStyle={{ width: "100%", height: "100%" }}
      center={
        selectedIntersection
          ? {
              lat: selectedIntersection.latitude,
              lng: selectedIntersection.longitude,
            }
          : defaultCenter
      }
      zoom={14}
      options={{
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
        disableDefaultUI: true,
        zoomControl: true,
      }}
    >
      {intersections.map((intersection) => (
        <Marker
          key={intersection.id}
          position={{
            lat: intersection.latitude,
            lng: intersection.longitude,
          }}
          onClick={() => {
            onIntersectionClick(intersection);
            setSelectedMarker(intersection);
          }}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor:
              selectedIntersection?.id === intersection.id
                ? "#3b82f6"
                : "#10b981",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
          }}
        />
      ))}

      {selectedMarker && (
        <InfoWindow
          position={{
            lat: selectedMarker.latitude,
            lng: selectedMarker.longitude,
          }}
          onCloseClick={() => setSelectedMarker(null)}
        >
          <div className="p-2">
            <h3 className="font-semibold text-gray-800">
              {selectedMarker.name}
            </h3>
            <p className="text-sm text-gray-600">
              Average Speed: {selectedMarker.average_speed || "N/A"} km/h
            </p>
            <p className="text-sm text-gray-600">
              Total Volume: {selectedMarker.total_volume || "N/A"}
            </p>
          </div>
        </InfoWindow>
      )}
    </GoogleMapComponent>
  );
};

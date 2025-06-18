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
          key={`intersection-${intersection.id}`}
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
            scale: 6,
            fillColor:
              selectedIntersection?.id === intersection.id
                ? "#3b82f6"
                : "#10b981",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 1.5,
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
          <div className="p-2 min-w-[200px] -mt-2">
            <h3
              className="font-bold -mb-1"
              style={{
                color: "#131416",
                fontSize: "17px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "150%",
                letterSpacing: "0px",
              }}
            >
              {selectedMarker.name}
            </h3>
            <div className="space-y-1 mt-3 mb-3">
              <p
                className="text-[#939393]"
                style={{
                  WebkitTextStrokeWidth: "1px",
                  WebkitTextStrokeColor: "rgba(0, 0, 0, 0.00)",
                  fontSize: "15px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "150%",
                  letterSpacing: "0px",
                }}
              >
                speed: {selectedMarker.average_speed || "N/A"}
              </p>
              <p
                className="text-[#939393]"
                style={{
                  WebkitTextStrokeWidth: "1px",
                  WebkitTextStrokeColor: "rgba(0, 0, 0, 0.00)",
                  fontSize: "15px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "150%",
                  letterSpacing: "0px",
                }}
              >
                volume: {selectedMarker.total_volume || "N/A"}
              </p>
            </div>
            <button
              onClick={() => onIntersectionClick(selectedMarker)}
              className="text-xs text-gray-600 hover:text-gray-800 flex items-center ml-auto"
            >
              View details <span className="ml-1">›</span>
            </button>
          </div>
        </InfoWindow>
      )}
    </GoogleMapComponent>
  );
};

import React from "react";
import { X, Star } from "lucide-react";
import { Intersection } from "../../types/global.types";

interface DetailPanelProps {
  intersection: Intersection;
  favoriteIntersections: number[];
  onToggleFavorite: (intersectionId: number) => void;
  onClose: () => void;
  isFullscreen: boolean;
}

export const DetailPanel: React.FC<DetailPanelProps> = ({
  intersection,
  favoriteIntersections,
  onToggleFavorite,
  onClose,
  isFullscreen,
}) => {
  const isFavorited = favoriteIntersections.includes(intersection.id);

  return (
    <div className="h-full p-8">
      <div className="flex justify-end mb-4">
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close panel"
        >
          <X size={24} className="text-gray-500" />
        </button>
      </div>

      <div className="mb-6">
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {intersection.name}
            </h2>
            <button
              onClick={() => onToggleFavorite(intersection.id)}
              className={`p-2 rounded-full transition-colors ${
                isFavorited
                  ? "bg-red-50 text-red-500 hover:bg-red-100"
                  : "bg-gray-50 text-gray-400 hover:bg-gray-100"
              }`}
              title={isFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              <Star size={20} fill={isFavorited ? "currentColor" : "none"} />
            </button>
          </div>
          <div className="space-y-1 text-sm text-gray-600">
            <p>Latitude: {intersection.latitude}</p>
            <p>Longitude: {intersection.longitude}</p>
            {intersection.average_speed && (
              <p>Average Speed: {intersection.average_speed} km/h</p>
            )}
            {intersection.total_volume && (
              <p>Total Volume: {intersection.total_volume}</p>
            )}
            {intersection.datetime && (
              <p>
                Last Update: {new Date(intersection.datetime).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Traffic Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <p className="text-sm text-gray-500">Average Speed</p>
              <p className="text-xl font-bold text-gray-800">
                {intersection.average_speed || "N/A"} km/h
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <p className="text-sm text-gray-500">Total Volume</p>
              <p className="text-xl font-bold text-gray-800">
                {intersection.total_volume || "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Location Information
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Latitude:</span>
              <span className="font-medium">{intersection.latitude}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Longitude:</span>
              <span className="font-medium">{intersection.longitude}</span>
            </div>
          </div>
        </div>

        {intersection.datetime && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Time Information
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Last Update:</span>
                <span className="font-medium">
                  {new Date(intersection.datetime).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

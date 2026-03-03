"use client";
import React, { useCallback, useState } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "0.5rem",
};

// Sri Lanka Boundaries (Approximate lat/lng bounds)
const SRI_LANKA_BOUNDS = {
  north: 9.9,
  south: 5.8,
  west: 79.4,
  east: 82.0,
};

const defaultCenter = {
  lat: 7.8731, // Central Sri Lanka
  lng: 80.7718,
};

const MapSelector = ({ lat, lng, onChange }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API,
  });

  const onMapClick = useCallback(
    (e) => {
      const clickLat = e.latLng.lat();
      const clickLng = e.latLng.lng();

      // Secondary check to ensure click is within Sri Lanka
      if (
        clickLat >= SRI_LANKA_BOUNDS.south &&
        clickLat <= SRI_LANKA_BOUNDS.north &&
        clickLng >= SRI_LANKA_BOUNDS.west &&
        clickLng <= SRI_LANKA_BOUNDS.east
      ) {
        onChange({ lat: clickLat, lng: clickLng });
      }
    },
    [onChange],
  );

  if (!isLoaded)
    return <div className="skeleton w-full h-[300px] rounded-lg"></div>;

  return (
    <div className="border border-base-300 rounded-lg overflow-hidden shadow-sm">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={lat && lng ? { lat, lng } : defaultCenter}
        zoom={8} // Zoomed out slightly to see the whole island initially
        onClick={onMapClick}
        options={{
          restriction: {
            latLngBounds: SRI_LANKA_BOUNDS,
            strictBounds: false, // Prevents panning completely out of Sri Lanka
          },
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {lat !== 0 && lng !== 0 && (
          <Marker
            position={{ lat, lng }}
            draggable={true}
            onDragEnd={(e) =>
              onChange({ lat: e.latLng.lat(), lng: e.latLng.lng() })
            }
          />
        )}
      </GoogleMap>
    </div>
  );
};

export default React.memo(MapSelector);

import React, { useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import { College } from "../types";
import "leaflet/dist/leaflet.css";

// Default marker icon
const icon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Custom highlighted marker icon
const highlightedIcon = new Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  iconRetinaUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [35, 57], // Larger size
  iconAnchor: [17, 57],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: "highlighted-marker",
});

interface MapComponentProps {
  colleges: College[];
  selectedCollege?: College | null;
}

// Helper component to focus on a specific college
const FocusOnCollege = ({
  college,
}: {
  college: College | null | undefined;
}) => {
  const map = useMap();

  useEffect(() => {
    if (college) {
      // Higher zoom level (13 instead of 12) for better visibility of the selected college
      map.setView([college.latitude, college.longitude], 13, {
        animate: true,
        duration: 0.8,
      });

      // Flash effect to make the selection more obvious
      const marker = document.querySelector(".highlighted-marker");
      if (marker) {
        marker.classList.add("flash-highlight");
        setTimeout(() => {
          marker.classList.remove("flash-highlight");
        }, 1500);
      }
    }
  }, [college, map]);

  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({
  colleges,
  selectedCollege,
}) => {
  // Calculate center point of all colleges
  const center: [number, number] =
    colleges.length > 0
      ? [
          colleges.reduce((sum, college) => sum + college.latitude, 0) /
            colleges.length,
          colleges.reduce((sum, college) => sum + college.longitude, 0) /
            colleges.length,
        ]
      : [39.8283, -98.5795]; // Default to US center

  // Adjust zoom level based on screen width for better mobile experience
  const getInitialZoom = () => {
    const width = window.innerWidth;
    if (width <= 480) return 3; // Mobile phones
    if (width <= 768) return 3.5; // Tablets
    return 4; // Desktop
  };

  return (
    <MapContainer
      center={center}
      zoom={getInitialZoom()}
      style={{ height: "100%", width: "100%" }}
      zoomControl={window.innerWidth > 768} // Only show zoom control on larger screens
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FocusOnCollege college={selectedCollege} />

      {colleges.map((college) => {
        // Use highlighted icon for selected college
        const isSelected = selectedCollege?.id === college.id;

        return (
          <Marker
            key={college.id}
            position={[college.latitude, college.longitude]}
            icon={isSelected ? highlightedIcon : icon}
            // Add ref to access marker instance for opening popup
            eventHandlers={{
              add: (e) => {
                // Open popup automatically when marker is selected
                if (isSelected) {
                  setTimeout(() => {
                    e.target.openPopup();
                  }, 100);
                }
              },
            }}
          >
            <Popup>
              <div className={isSelected ? "selected-college-popup" : ""}>
                <h3>{college.name}</h3>
                <p>
                  <strong>Tech Lead Interns:</strong> {college.techLeadInterns}
                </p>
                <p>
                  <strong>AI Developer Interns:</strong>{" "}
                  {college.aiDeveloperInterns}
                </p>
                <p>
                  <strong>Location:</strong> {college.latitude.toFixed(4)},{" "}
                  {college.longitude.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default MapComponent;

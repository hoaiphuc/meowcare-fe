import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapProps {
    defaultLat: number | undefined; // Latitude for the marker
    defaultLng: number | undefined; // Longitude for the marker
    popupContent?: string; // Optional content for the marker popup
}

const IndividualMap: React.FC<MapProps> = ({ defaultLat, defaultLng, popupContent = "Marker" }) => {
    const mapRef = useRef<L.Map | null>(null);

    // Map initialization
    useEffect(() => {
        if (!defaultLat || !defaultLng) return; // Do nothing if coordinates are undefined

        if (!mapRef.current) {
            // Initialize the map
            mapRef.current = L.map("map", {
                center: [defaultLat, defaultLng],
                zoom: 15,
                dragging: false, // Disable dragging
                scrollWheelZoom: false, // Disable scroll zoom
                doubleClickZoom: false, // Disable double-click zoom
                boxZoom: false, // Disable box zoom
                keyboard: false, // Disable keyboard navigation
                zoomControl: false, // Disable zoom controls
                attributionControl: false, // Optionally remove attribution controls
            });

            // Add OpenStreetMap tile layer
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(mapRef.current);
        } else {
            // Update the map center if it already exists
            mapRef.current.setView([defaultLat, defaultLng], 17);
        }

        // Remove any existing markers
        mapRef.current.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                mapRef.current?.removeLayer(layer);
            }
        });

        // Add the marker
        const customIcon = L.divIcon({
            html: `<div style="background-color: #2B764F; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold;">🐈</div>`,
            className: "",
            iconSize: [24, 24],
            iconAnchor: [12, 24],
        });

        L.marker([defaultLat, defaultLng], { icon: customIcon, interactive: false })
            .addTo(mapRef.current)
    }, [defaultLat, defaultLng, popupContent]);

    return <div id="map" style={{ height: "100%", width: "100%" }} />;
};

export default IndividualMap;

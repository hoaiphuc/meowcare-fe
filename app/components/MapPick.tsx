import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapProps {
    onLocationChange: (lat: number, lng: number) => void;
    location?: {
        lat: number;
        lng: number;
    }
}

const MapComponent = ({ onLocationChange, location }: MapProps) => {
    const mapRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);

    useEffect(() => {
        if (mapRef.current) return; // Prevent re-initialization

        const mapContainer = document.getElementById("map");
        if (!mapContainer) {
            console.error("Map container not found");
            return;
        }

        mapRef.current = L.map(mapContainer).setView([10.8231, 106.6297], 12);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; OpenStreetMap contributors',
        }).addTo(mapRef.current);
    }, []);

    // Create a custom icon
    const icon = L.divIcon({
        html: `<div style="background-color: #2B764F; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold;">🐈</div>`,
        className: "",
        iconSize: [24, 24],
        iconAnchor: [12, 24],
    });

    useEffect(() => {
        if (!mapRef.current) return;

        // Add click event listener to set marker by clicking on map
        mapRef.current.on("click", (e: L.LeafletMouseEvent) => {
            if (markerRef.current) {
                mapRef.current?.removeLayer(markerRef.current);
            }
            const { lat, lng } = e.latlng;
            onLocationChange(lat, lng);
            if (mapRef.current) {
                markerRef.current = L.marker([lat, lng], { icon }).addTo(mapRef.current);
            }
        });

        return () => {
            mapRef.current?.off("click");
        };
    }, [onLocationChange, icon]);

    // Update marker and map view if `location` prop changes
    useEffect(() => {
        if (location && mapRef.current) {
            // Remove existing marker if any
            if (markerRef.current) {
                mapRef.current.removeLayer(markerRef.current);
            }
            // Add new marker at given location
            markerRef.current = L.marker([location.lat, location.lng], { icon }).addTo(mapRef.current);
            mapRef.current.setView([location.lat, location.lng], 12);
        }
    }, [location, icon]);

    return (
        <div
            id="map"
            role="application"
            aria-label="Map for selecting a location"
            style={{ height: "500px", width: "100%" }}
            tabIndex={0}
        />
    );
};

export default MapComponent;

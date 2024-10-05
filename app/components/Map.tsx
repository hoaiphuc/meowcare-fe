import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Marker {
    id: string;
    lat: number;
    lng: number;
    title: string;
    price: string;
}

interface MapProps {
    markers: Marker[];
}

const Map: React.FC<MapProps> = ({ markers }) => {
    const mapRef = useRef<L.Map | null>(null);

    useEffect(() => {
        if (mapRef.current) return; // Prevent map from being re-initialized

        // Initialize map centered on New York
        mapRef.current = L.map("map").setView([10.8231, 106.6297], 12);

        // Load and display tile layer (OpenStreetMap tiles)
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapRef.current);

        // Add markers to map
        markers.forEach((markerData) => {
            L.marker([markerData.lat, markerData.lng])
                .addTo(mapRef.current as L.Map)
                .bindPopup(`<b>${markerData.title}</b><br>Price: ${markerData.price}`);
        });
    }, [markers]);

    return (
        <div id="map" style={{ height: "100vh", width: "100%", float: "right" }} />
    );
};

export default Map;

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Marker {
    id: string;
    lat: number;
    lng: number;
    name: string;
    avatarUrl: string;
    description: string;
    address: string;
    price: string;
    rating: string;
    reviews: string;
    bio: string;
    lastUpdated: string;
}


interface MapProps {
    markers: Marker[];
    onMarkerClick: (id: string) => void;
}

const Map: React.FC<MapProps> = ({ markers, onMarkerClick }) => {
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

        // Remove existing markers
        mapRef.current.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                mapRef.current?.removeLayer(layer);
            }
        });

        // Add markers to map
        markers.forEach((markerData, index) => {
            // Create a custom icon with a number
            const numberedIcon = L.divIcon({
                html: `<div style="background-color: #2B764F; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold;">${index + 1}</div>`,
                className: "", // Remove default class to prevent unwanted styles
                iconSize: [24, 24],
                iconAnchor: [12, 24],
            });
            const marker = L.marker([markerData.lat, markerData.lng], { icon: numberedIcon })
                .addTo(mapRef.current as L.Map)
                .bindPopup(
                    `<b>${markerData.name}</b>`
                );
            // Add click event to marker
            marker.on('click', () => {
                onMarkerClick(markerData.id);
            });
        });
    }, [markers, onMarkerClick]);

    return (
        <div id="map" style={{ height: "900px", width: "100%", float: "right" }} />
    );
};

export default Map;

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CatSitter } from "../constants/types/homeType";

interface MapProps {
    markers: CatSitter[];
    onMarkerClick: (id: string) => void;
    defaultLat?: number;
    defaultLng?: number;
}

const Map: React.FC<MapProps> = ({ markers, onMarkerClick, defaultLat, defaultLng }) => {
    const mapRef = useRef<L.Map | null>(null);

    // Map initialization
    useEffect(() => {
        if (mapRef.current) return; // Prevent map from being re-initialized

        // Initialize map centered on Ho Chi Minh City (coordinates: 10.8231, 106.6297)
        mapRef.current = L.map("map").setView([defaultLat ?? 10.8231, defaultLng ?? 106.6297], 12);

        // Load and display tile layer (OpenStreetMap tiles)
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapRef.current);
    }, []);

    useEffect(() => {
        if (
            mapRef.current &&
            defaultLat !== undefined &&
            defaultLng !== undefined &&
            (defaultLat !== mapRef.current.getCenter().lat ||
                defaultLng !== mapRef.current.getCenter().lng)
        ) {
            mapRef.current.flyTo([defaultLat, defaultLng], 12);
            mapRef.current.invalidateSize();
            mapRef.current.once("moveend", () => {
                console.log("Map center after animation completes:", mapRef.current?.getCenter());
            });
        }
    }, [defaultLat, defaultLng]);

    // Marker rendering
    useEffect(() => {
        if (!mapRef.current) return;

        // Remove existing markers
        mapRef.current.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                mapRef.current?.removeLayer(layer);
            }
        });

        // Add markers to map
        markers.forEach(async (markerData, index) => {
            // const { lat, lng } = coordinates;
            const lat = markerData.latitude
            const lng = markerData.longitude

            // Create a custom icon with a number
            const numberedIcon = L.divIcon({
                html: `<div style="background-color: #2B764F; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold;">${index + 1}</div>`,
                className: "", // Remove default class to prevent unwanted styles
                iconSize: [24, 24],
                iconAnchor: [12, 24],
            });

            const marker = L.marker([lat, lng], { icon: numberedIcon })
                .addTo(mapRef.current as L.Map)
                .bindPopup(`<b>${markerData.fullName}</b>`);

            // Add click event to marker
            marker.on("click", () => {
                onMarkerClick(markerData.id);
            });
        });
    }, [markers, onMarkerClick]);

    return (
        <div
            id="map"
            style={{ height: "900px", width: "100%", float: "right" }}
        />
    );
};

export default Map;

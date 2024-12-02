import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapProps {
    onLocationChange: (lat: number, lng: number) => void;
}

const MapComponent = ({ onLocationChange }: MapProps) => {
    const mapRef = useRef<L.Map | null>(null);

    useEffect(() => {
        if (mapRef.current) return; // Prevent map from being re-initialized

        // Ensure the map container exists
        const mapContainer = document.getElementById("map");
        if (!mapContainer) {
            console.error("Map container not found");
            return;
        }

        // Initialize map centered on Ho Chi Minh City (coordinates: 10.8231, 106.6297)
        mapRef.current = L.map(mapContainer).setView([10.8231, 106.6297], 12);

        // Load and display tile layer (OpenStreetMap tiles)
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapRef.current);

        // Create a custom icon with aria-label for accessibility
        const icon = L.divIcon({
            html: `<div style="background-color: #2B764F; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold;">🐈</div>`,
            className: "", // Remove default class to prevent unwanted styles
            iconSize: [24, 24],
            iconAnchor: [12, 24],
        });

        // Add click event listener
        let marker: L.Marker | null = null;

        // Use a type guard to ensure mapRef.current is not null
        if (mapRef.current) {
            mapRef.current.on("click", (e: L.LeafletMouseEvent) => {
                if (marker) {
                    mapRef.current?.removeLayer(marker);
                }

                const { lat, lng } = e.latlng;
                onLocationChange(lat, lng); // Pass the lat and lng to the parent component

                // Create the marker with the custom icon
                marker = L.marker(e.latlng, { icon: icon }).addTo(mapRef.current!);
            });
        }

        // Cleanup on component unmount
        // return () => {
        //     if (mapRef.current) {
        //         mapRef.current.off(); // Remove all event listeners
        //         mapRef.current.remove(); // Remove map instance
        //     }
        //     mapRef.current = null;
        // };
    }, [onLocationChange]);

    return (
        <div
            id="map"
            role="application" // Set the role to 'application' for complex interactive elements
            aria-label="Map for selecting a location by clicking on the map" // Describes the purpose of the map
            style={{ height: "500px", width: "100%" }}
            tabIndex={0} // Make the map container focusable for keyboard navigation
        />
    );
};

export default MapComponent;

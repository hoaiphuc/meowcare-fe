import { useState, useEffect } from "react";

interface GeoapifySuggestion {
  properties: {
    formatted: string;
  };
}

const useGeoapify = (query: string) => {
  const [suggestions, setSuggestions] = useState<GeoapifySuggestion[]>([]);
  const apiKey = "7eaa555d1d1f4dbe9b2792ee9c726f10"; // Replace with your actual API key

  useEffect(() => {
    if (!query) return;

    // Make a request to the Geoapify Geocoding API
    const fetchSuggestions = async () => {
      try {
        const response = await fetch(
          `https://api.geoapify.com/v1/geocode/autocomplete?text=${query}&apiKey=${apiKey}`
        );
        const data = await response.json();
        setSuggestions(data.features); // Assuming 'features' contains the suggestions
      } catch (error) {
        console.error("Error fetching Geoapify suggestions", error);
      }
    };

    fetchSuggestions();
  }, [query]);

  return suggestions;
};

export default useGeoapify;

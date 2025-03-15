import { useState, useCallback } from "react";
import { debounce } from "../utils/global";

const usePlacesAutocomplete = (initialValue, accessToken) => {
  const [value, setValue] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);

  const fetchPlaces = async (inputText) => {
    if (!inputText) {
      setSuggestions([]);
      return;
    }

    try {
      const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        inputText
      )}.json?access_token=${accessToken}&autocomplete=true&limit=5`;
      const response = await fetch(endpoint);
      const results = await response.json();
      setSuggestions(results?.features || []);
    } catch (error) {
      console.log("Error fetching data: ", error);
    }
  };

  const debouncedFetchPlaces = useCallback(debounce(fetchPlaces, 500), []);

  const handleChange = (inputText) => {
    setValue(inputText);
    debouncedFetchPlaces(inputText);
  };

  return {
    value,
    onChangeText: handleChange,
    setValue,
    suggestions,
    setSuggestions,
  };
};

export default usePlacesAutocomplete;

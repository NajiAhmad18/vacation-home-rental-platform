import { useState, useEffect, useRef } from "react";
import { useMap } from "../../provider/GoogleMapsProvider";
import { useFormContext } from "react-hook-form";

export default function PlacesAutocompleteInput({
  name,
  label,
  register,
  options = {},
  validation = {},
  className = "",
  onPlaceSelect,
}) {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const autocompleteService = useRef(null);
  const inputRef = useRef(null);

  const { watch, setValue } = useFormContext();
  const value = watch(name);

  const { isLoaded } = useMap();

  useEffect(() => {
    if (isLoaded && !autocompleteService.current && window.google) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
    }
  }, [isLoaded]);

  const handleChange = async (e) => {
    const text = e.target.value;
    setValue(name, text);
    setLoading(true);

    if (!text || !autocompleteService.current) {
      setPredictions([]);
      setLoading(false);
      return;
    }

    autocompleteService.current.getPlacePredictions(
      { input: text, ...options },
      async (preds, status) => {
        if (status !== window.google.maps.places.PlacesServiceStatus.OK || !preds) {
          setPredictions([]);
          setLoading(false);
          return;
        }

        const placesService = new window.google.maps.places.PlacesService(document.createElement("div"));

        const filtered = await Promise.all(
          preds.map((p) =>
            new Promise((resolve) => {
              placesService.getDetails({ placeId: p.place_id }, (details, detailStatus) => {
                console.log(`Details for ${p.description}:`, details);

                const location = details?.geometry?.location;
                const bounds = options.bounds;

                const isWithinBounds = bounds ? bounds.contains(location) : true;

                if (
                  detailStatus === window.google.maps.places.PlacesServiceStatus.OK &&
                  location &&
                  isWithinBounds
                ) {
                  resolve({
                    ...p,
                    description: p.description.replace(/,\s*Sri Lanka$/i, ""),
                    details,
                  });
                } else {
                  resolve(null);
                }
              });
            })
          )
        );

        setPredictions(filtered.filter(Boolean));
        setLoading(false);
      }
    );
  };

  const selectPrediction = (pred) => {
    setValue(name, pred.description, { shouldValidate: true });
    setPredictions([]);
    if (onPlaceSelect) onPlaceSelect(pred.details);
  };

  return (
    <div className="relative">
      {label && (
        <label htmlFor={name} className="block mb-2 text-sm font-medium text-slate-600">
          {label}
        </label>
      )}
      <input
        id={name}
        value={value || ""}
        {...register(name, validation)}
        onChange={handleChange}
        ref={inputRef}
        className={`border border-slate-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none ${className}`}
        autoComplete="off"
        placeholder="Enter city"
      />

      {loading && (
        <div className="absolute top-full mt-1 text-sm text-gray-500">Loading...</div>
      )}

      {predictions.length > 0 && (
        <ul className="absolute z-10 bg-white border border-slate-300 w-full max-h-60 overflow-auto rounded-lg shadow-md">
          {predictions.map((p) => (
            <li
              key={p.place_id}
              onClick={() => selectPrediction(p)}
              className="p-2 hover:bg-blue-50 cursor-pointer text-sm"
            >
              {p.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

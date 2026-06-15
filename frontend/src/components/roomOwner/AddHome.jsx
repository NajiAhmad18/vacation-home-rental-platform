import React, { useState, useCallback, useEffect, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { GoogleMap } from "@react-google-maps/api";
import { useHomeStore } from "../../stores/useHomeStore.js";
import PlacesAutocompleteInput from "../PlacesAutocompleteInput.jsx";
import { useMap } from "../../../provider/GoogleMapsProvider.jsx";
import { provinceDistricts } from "../../const/provinceDistricts.js";
import { MapPin } from "lucide-react";
import { featureGroups } from "../../const/featureGroups.jsx";

const containerStyle = { width: "100%", height: "300px" };
const defaultCenter = { lat: 6.9271, lng: 79.8612 };

export default function AddNewHome() {
  const methods = useForm({
    defaultValues: {
      title: "",
      description: "",
      province: "",
      district: "",
      city: "",
      address: "",
      latitude: defaultCenter.lat,
      longitude: defaultCenter.lng,
      price: "",
      bedrooms: "",
      bathrooms: "",
      floorArea: "",
      floors: "",
      landArea: "",
      parking: "",
      features: [],
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  const createHome = useHomeStore((state) => state.createHome);
  const { isLoaded, loadError } = useMap();
  const loading = useHomeStore((state) => state.loading);
  const error = useHomeStore((state) => state.error);

  const [images, setImages] = useState([]);
  const [markerPosition, setMarkerPosition] = useState(defaultCenter);

  const selectedProvince = watch("province");

  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const onMapLoad = (map) => {
    mapRef.current = map;
  };

  const updateMarkerPosition = (lat, lng) => {
    setMarkerPosition({ lat, lng });
    setValue("latitude", lat);
    setValue("longitude", lng);
    if (markerRef.current) markerRef.current.setPosition({ lat, lng });
  };

  const onMapClick = useCallback(
    (event) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      updateMarkerPosition(lat, lng);
    },
    [setValue]
  );

  useEffect(() => {
    if (isLoaded && mapRef.current && window.google) {
      if (!markerRef.current) {
        markerRef.current = new window.google.maps.Marker({
          position: markerPosition,
          map: mapRef.current,
          title: "Property Location",
          draggable: true,
        });
        markerRef.current.addListener("dragend", (event) => {
          updateMarkerPosition(event.latLng.lat(), event.latLng.lng());
        });
      } else {
        markerRef.current.setPosition(markerPosition);
      }
    }
  }, [isLoaded, markerPosition]);

  useEffect(() => {
    console.log("Updated marker position:", markerPosition);
  }, [markerPosition]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 10) {
      alert("Max 10 images allowed");
      return;
    }
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) =>
    setImages((prev) => prev.filter((_, i) => i !== index));

  const onSubmit = async (data) => {
    if (!selectedProvince) {
      methods.setError("province", {
        type: "manual",
        message: "Please select a province",
      });
      return;
    }
    const homeData = { ...data, images };
    try {
      await createHome(homeData);
      alert("Home created successfully");
      setImages([]);
      window.location.reload();
    } catch (error) {
      console.error("Failed to create home:", error);
    }
  };

  if (loadError)
    return <p className="text-red-500 text-center">Map failed to load</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Info */}
          <section className="bg-white shadow-sm border border-slate-200 rounded-xl p-6 space-y-6">
            <h2 className="text-xl font-semibold text-slate-700">Basic Info</h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block mb-1 text-sm font-medium text-slate-600"
                >
                  Title
                </label>
                <input
                  id="title"
                  {...register("title", {
                    required: "Title is required",
                    minLength: {
                      value: 10,
                      message: "Title must be at least 10 characters",
                    },
                    maxLength: {
                      value: 100,
                      message: "Title must not exceed 100 characters",
                    },
                  })}
                  placeholder="Enter a title"
                  className="border border-slate-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block mb-1 text-sm font-medium text-slate-600"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  {...register("description", {
                    required: "Description is required",
                    maxLength: {
                      value: 5000,
                      message: "Description must not exceed 5000 characters",
                    },
                  })}
                  placeholder="Write a short description"
                  rows={4}
                  className="border border-slate-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none resize-none"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Location */}
          <section className="bg-white shadow-sm border border-slate-200 rounded-xl p-6 lg:p-8 space-y-8">
            <h2 className="text-xl font-semibold text-slate-700">Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6">
              {/* Province */}
              <div className="space-y-2">
                <label
                  htmlFor="province"
                  className="block text-sm font-medium text-slate-700"
                >
                  Province
                </label>
                <select
                  id="province"
                  {...register("province", {
                    required: "Province is required",
                  })}
                  onChange={(e) => {
                    setValue("province", e.target.value);
                    setValue("district", "");
                    if (errors.province) methods.clearErrors("province");
                  }}
                  className="border border-slate-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                >
                  <option value="">Select Province</option>
                  {Object.keys(provinceDistricts).map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
                {errors.province && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.province.message}
                  </p>
                )}
              </div>

              {/* District */}
              <div className="space-y-2 relative">
                <label
                  htmlFor="district"
                  className="block text-sm font-medium text-slate-700"
                >
                  District
                </label>
                {selectedProvince ? (
                  <select
                    id="district"
                    {...register("district", {
                      required: "District is required",
                    })}
                    className="border border-slate-300 p-3 rounded-lg w-full cursor-pointer"
                  >
                    <option value="">Select District</option>
                    {provinceDistricts[selectedProvince]?.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div
                    className="border border-slate-300 p-3 rounded-lg w-full cursor-not-allowed bg-gray-100 text-gray-500 select-none"
                    onClick={() =>
                      methods.setError("province", {
                        type: "manual",
                        message: "Please select a province first",
                      })
                    }
                  >
                    Select District
                  </div>
                )}
                {errors.district && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.district.message}
                  </p>
                )}
              </div>

              {/* City */}
              <div className="space-y-2">
                <PlacesAutocompleteInput
                  name="city"
                  label="City"
                  register={register}
                  setValue={setValue}
                  watch={watch}
                  rules={{
                    required: "City is required",
                    maxLength: {
                      value: 100,
                      message: "City must not exceed 100 characters",
                    },
                  }}
                  options={{
                    types: ["locality"],
                    componentRestrictions: { country: "lk" },
                  }}
                  className="border border-slate-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-slate-700"
              >
                Address
              </label>
              <input
                id="address"
                {...register("address", {
                  required: "Address is required",
                  maxLength: {
                    value: 200,
                    message: "Address must not exceed 200 characters",
                  },
                })}
                placeholder="Street address or landmark"
                className="border border-slate-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition placeholder:text-slate-400"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* Map */}
            <div className="space-y-3">
              <div className="h-[300px] rounded-lg overflow-hidden border border-slate-300 bg-slate-100 relative shadow-md ring-1 ring-slate-200">
                {isLoaded ? (
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={markerPosition}
                    zoom={10}
                    onClick={onMapClick}
                    onLoad={onMapLoad}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-slate-500">Loading map...</p>
                  </div>
                )}
              </div>
              <div className="mt-1 rounded-lg border border-blue-700 bg-blue-50 px-4 py-3 flex items-center gap-2 text-[15px] text-blue-900 font-medium">
                <MapPin className="w-4 h-4 text-blue-700" />
                <span>
                  Click on the map to place a marker. You can drag it to mark
                  the exact location of your home.
                </span>
              </div>
            </div>
          </section>

          {/* Pricing & Capacity */}
          <section className="bg-white shadow-sm border border-slate-200 rounded-xl p-6 lg:p-8 space-y-8">
            <h2 className="text-xl font-semibold text-slate-700">
              Pricing & Capacity
            </h2>
            <div className="space-y-2">
              <label
                htmlFor="price"
                className="block text-sm font-medium text-slate-700"
              >
                Price (LKR)
              </label>
              <div className="relative">
                <input
                  id="price"
                  {...register("price", {
                    required: "Price is required",
                    min: { value: 1000, message: "Price must be at least 1000" },
                    max: { value: 1000000, message: "Price must not exceed 1,000,000" },
                    pattern: {
                      value: /^\d+$/,
                      message: "Price must be a whole number",
                    },
                  })}
                  placeholder="Enter price"
                  type="number"
                  className="border border-slate-300 p-3 rounded-lg w-full pr-16 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition placeholder:text-slate-400"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                  LKR
                </span>
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.price.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-6">
              {[
                {
                  name: "bedrooms",
                  label: "Bedrooms",
                  min: 0,
                  max: 20,
                },
                {
                  name: "bathrooms",
                  label: "Bathrooms/WCs",
                  min: 0,
                  max: 20,
                },
                {
                  name: "floorArea",
                  label: "Floor Area",
                  unit: "sq.ft.",
                  min: 50,
                  max: 10000,
                },
                {
                  name: "floors",
                  label: "No. of Floors",
                  min: 1,
                  max: 10,
                },
                {
                  name: "landArea",
                  label: "Land Area",
                  unit: "perches",
                  min: 100,
                  max: 100000,
                },
                {
                  name: "parking",
                  label: "Car Parking Spaces",
                  min: 0,
                  max: 10,
                },
              ].map((field) => (
                <div key={field.name} className="space-y-2">
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-slate-700"
                  >
                    {field.label}
                  </label>
                  <div className="relative">
                    <input
                      id={field.name}
                      {...register(field.name, {
                        required: `${field.label} is required`,
                        min: {
                          value: field.min,
                          message: `${field.label} must be at least ${field.min}`,
                        },
                        max: {
                          value: field.max,
                          message: `${field.label} must not exceed ${field.max}`,
                        },
                        pattern: {
                          value: /^\d+$/,
                          message: `${field.label} must be a whole number`,
                        },
                      })}
                      placeholder={field.label}
                      type="number"
                      className="border border-slate-300 p-3 rounded-lg w-full pr-16 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition placeholder:text-slate-400"
                    />
                    {field.unit && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                        {field.unit}
                      </span>
                    )}
                    {errors[field.name] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[field.name].message}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Property Features */}
          <section className="bg-white shadow-sm border border-slate-200 rounded-xl p-6 lg:p-8 space-y-8">
            <h2 className="text-xl font-semibold text-slate-700">
              Property Features
            </h2>
            {featureGroups.map((group) => (
              <div key={group.title} className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-600">
                  {group.title}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
                  {group.features.map((feature) => (
                    <div
                      key={feature.name}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition"
                    >
                      <input
                        type="checkbox"
                        {...register("features", {
                          validate: (value) =>
                            value.length > 0 || "Select at least one feature",
                        })}
                        value={feature.name}
                        id={`feature-${feature.name}`}
                        className="accent-blue-600 w-4 h-4"
                      />
                      <label
                        htmlFor={`feature-${feature.name}`}
                        className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer"
                      >
                        {feature.icon}
                        {feature.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {errors.features && (
              <p className="text-red-500 text-sm mt-1">
                {errors.features.message}
              </p>
            )}
          </section>

          {/* Images */}
          <section className="bg-white shadow-sm border border-slate-200 rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold text-slate-700">Images</h2>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <div className="flex flex-wrap gap-4 mt-2">
              {images.map((file, index) => {
                const url = URL.createObjectURL(file);
                return (
                  <div
                    key={index}
                    className="relative w-24 h-24 rounded-lg overflow-hidden shadow"
                  >
                    <img
                      src={url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onLoad={() => URL.revokeObjectURL(url)}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 transition text-white text-xs px-1 rounded"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Submit */}
          <div className="flex gap-4 items-center justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 rounded-lg text-white font-medium shadow-sm transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Publishing..." : "Publish"}
            </button>
            {error && (
              <p className="text-red-500 text-sm">Failed to publish: {error}</p>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

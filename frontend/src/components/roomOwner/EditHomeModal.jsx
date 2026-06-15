// components/admin/EditHomeModal.jsx
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useHomeStore } from "../../stores/useHomeStore";
import { featureGroups } from "../../const/featureGroups.jsx";
import toast from "react-hot-toast";

export default function EditHomeModal({
  home,
  isOpen,
  onClose,
  readOnly = false,
}) {
  const [images, setImages] = useState(home?.images || []);
  const methods = useForm({ defaultValues: home || {} });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;
  const { updateHome, loading } = useHomeStore();

  // Reset when modal opens with new home
  useEffect(() => {
    if (home) {
      reset(home);
      setImages(home.images || []);
    }
  }, [home, reset]);

  const handleImageChange = (e) => {
    if (readOnly) return; // prevent changes in read-only
    const files = Array.from(e.target.files);
    if (images.length + files.length > 10) {
      alert("Max 10 images allowed");
      return;
    }
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    if (readOnly) return;
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    if (readOnly) return;

    try {
      // separate existing URLs (string) and new File objects
      const existingUrls = images.filter((img) => typeof img === "string");
      const newFiles = images.filter((img) => typeof img !== "string");

      await updateHome(home._id, {
        ...data, // ✅ all the form fields
        existingImages: existingUrls,
        images: newFiles,
      });

      toast.success("Home updated successfully!");
      onClose();
    } catch (err) {
      toast.error("Failed to update home. Please try again.");
      console.error("Failed to update home:", err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="backdrop"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.9, y: -30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -30 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl relative flex flex-col overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-8 text-gray-400 hover:text-gray-800 transition"
            >
              ✕
            </button>

            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col h-full"
              >
                {/* Scrollable content */}
                <div className="p-8 overflow-y-auto max-h-[80vh] space-y-8">
                  <h2 className="text-2xl font-bold text-slate-700 mb-6">
                    {readOnly ? "View Property" : "Edit Property"}
                  </h2>

                  {/* Basic Info */}
                  <section className="space-y-4">
                    <h3 className="text-lg font-semibold">Basic Info</h3>
                    <div>
                      <label className="block text-sm font-medium">Title</label>
                      <input
                        {...register("title", {
                          required: "Title is required",
                          minLength: {
                            value: 10,
                            message: "Min 10 characters",
                          },
                          maxLength: {
                            value: 100,
                            message: "Max 100 characters",
                          },
                        })}
                        className="border border-slate-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 transition"
                        disabled={readOnly}
                      />
                      {errors.title && (
                        <p className="text-red-500 text-sm">
                          {errors.title.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium">
                        Description
                      </label>
                      <textarea
                        {...register("description", {
                          required: "Description is required",
                          maxLength: {
                            value: 5000,
                            message: "Max 5000 characters",
                          },
                        })}
                        rows={8}
                        className="border border-slate-300 p-3 rounded-lg w-full resize-none focus:ring-2 focus:ring-blue-500 transition"
                        disabled={readOnly}
                      />
                      {errors.description && (
                        <p className="text-red-500 text-sm">
                          {errors.description.message}
                        </p>
                      )}
                    </div>
                  </section>

                  {/* Pricing & Capacity */}
                  <section className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Pricing & Capacity
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {[
                        {
                          name: "price",
                          label: "Price (LKR)",
                          min: 1000,
                          max: 1000000,
                        },
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
                          label: "Floor Area (sq.ft.)",
                          min: 50,
                          max: 10000,
                        },
                        { name: "floors", label: "Floors", min: 1, max: 10 },
                        {
                          name: "landArea",
                          label: "Land Area (perches)",
                          min: 100,
                          max: 100000,
                        },
                        {
                          name: "parking",
                          label: "Car Parking",
                          min: 0,
                          max: 10,
                        },
                      ].map((field) => (
                        <div key={field.name}>
                          <label className="block text-sm font-medium">
                            {field.label}
                          </label>
                          <input
                            type="number"
                            {...register(field.name, {
                              required: `${field.label} required`,
                              min: {
                                value: field.min,
                                message: `Min ${field.min}`,
                              },
                              max: {
                                value: field.max,
                                message: `Max ${field.max}`,
                              },
                              pattern: {
                                value: /^\d+$/,
                                message: "Must be whole number",
                              },
                            })}
                            className="border border-slate-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 transition"
                            disabled={readOnly}
                          />
                          {errors[field.name] && (
                            <p className="text-red-500 text-sm">
                              {errors[field.name].message}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Features */}
                  <section className="space-y-4">
                    <h3 className="text-lg font-semibold">Property Features</h3>
                    {featureGroups.map((group) => (
                      <div key={group.title} className="space-y-2">
                        <h4 className="font-medium text-slate-600">
                          {group.title}
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {group.features.map((f) => (
                            <label
                              key={f.name}
                              className="flex gap-2 items-center"
                            >
                              <input
                                type="checkbox"
                                value={f.name}
                                {...register("features", {
                                  validate: (val) =>
                                    val?.length > 0 ||
                                    "Select at least one feature",
                                })}
                                defaultChecked={home?.features?.includes(
                                  f.name
                                )}
                                className="accent-blue-600 w-4 h-4"
                                disabled={readOnly}
                              />
                              <span className="flex items-center gap-1 text-sm">
                                {f.icon}
                                {f.name}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                    {errors.features && (
                      <p className="text-red-500 text-sm">
                        {errors.features.message}
                      </p>
                    )}
                  </section>

                  {/* Images */}
                  <section className="space-y-4">
                    <h3 className="text-lg font-semibold">Images</h3>
                    {!readOnly && (
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    )}
                    <div className="flex flex-wrap gap-4 mt-2">
                      {images.map((img, i) => {
                        const url =
                          typeof img === "string"
                            ? img
                            : URL.createObjectURL(img);
                        return (
                          <div
                            key={i}
                            className="relative w-24 h-24 rounded-lg overflow-hidden shadow"
                          >
                            <img
                              src={url}
                              alt="preview"
                              className="w-full h-full object-cover"
                            />
                            {!readOnly && (
                              <button
                                type="button"
                                onClick={() => removeImage(i)}
                                className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 rounded"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end gap-3 px-6 py-3 border-t bg-white sticky bottom-0">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                  >
                    Close
                  </button>
                  {!readOnly && (
                    <button
                      type="submit"
                      disabled={loading}
                      className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ${
                        loading ? "cursor-not-allowed" : ""
                      }`}
                    >
                      {loading ? "Updating..." : "Save Changes"}
                    </button>
                  )}
                </div>
              </form>
            </FormProvider>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

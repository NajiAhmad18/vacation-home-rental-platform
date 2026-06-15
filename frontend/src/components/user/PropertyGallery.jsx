import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const PropertyGallery = ({ images = [], title = "" }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  if (!images.length) return null;

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const prevImage = () =>
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "Escape") closeModal();
  };

  useEffect(() => {
    if (showModal) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showModal]);

  return (
    <>
      {/* Main Image */}
      <div className="mb-4">
        <div
          className="relative w-full aspect-video overflow-hidden rounded-xl cursor-pointer group"
          onClick={openModal}
        >
          <img
            src={images[currentImageIndex]}
            alt={`${title} ${currentImageIndex + 1}`}
            className="w-full h-full object-cover "
          />
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Thumbnail ${idx + 1}`}
            onClick={() => setCurrentImageIndex(idx)}
            className={`h-20 w-28 object-cover rounded-lg cursor-pointer border-2 ${
              idx === currentImageIndex
                ? "border-blue-500"
                : "border-transparent"
            }`}
          />
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="relative w-full max-w-6xl h-full flex flex-col items-center justify-center">
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 text-white hover:text-gray-300"
              aria-label="Close"
            >
              <X className="w-8 h-8" />
            </button>

            <img
              src={images[currentImageIndex]}
              alt={`${title} ${currentImageIndex + 1}`}
              className="max-h-[80vh] object-contain rounded-xl shadow-lg"
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2"
                  aria-label="Next"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <div className="mt-6 flex gap-2 overflow-x-auto max-w-full">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`h-16 w-24 object-cover rounded-lg cursor-pointer border-2 ${
                    idx === currentImageIndex
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                />
              ))}
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-4 py-1 rounded-full">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyGallery;

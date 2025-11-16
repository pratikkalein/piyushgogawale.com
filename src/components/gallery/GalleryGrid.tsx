import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ModalLightbox } from "./ModalLightbox";
import type { CategoryName } from "@/data/galleryData";
import { getCategoryImages } from "@/data/galleryData";

interface GalleryGridProps {
  categoryName: CategoryName;
}

export const GalleryGrid = ({ categoryName }: GalleryGridProps) => {
  const images = getCategoryImages(categoryName);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const isLightboxOpen = selectedImageIndex !== null;

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleClose = () => {
    setSelectedImageIndex(null);
  };

  const handlePrevious = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedImageIndex !== null && selectedImageIndex < images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  return (
    <>
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
        {images.map((image, index) => (
          <Card
            key={index}
            className="break-inside-avoid mb-4 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
            onClick={() => handleImageClick(index)}
          >
            <div className="relative overflow-hidden bg-muted">
              <img
                src={image}
                alt={`${categoryName} image ${index + 1}`}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
            </div>
          </Card>
        ))}
      </div>

      {isLightboxOpen && selectedImageIndex !== null && (
        <ModalLightbox
          isOpen={isLightboxOpen}
          onClose={handleClose}
          images={images}
          currentIndex={selectedImageIndex!}
          categoryName={categoryName}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      )}
    </>
  );
};


import { useParams, Navigate } from "react-router-dom";
import { Typography } from "@/components/ui/typography";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { getCategory } from "@/data/galleryData";
import type { CategoryName } from "@/data/galleryData";

const Gallery = () => {
  const { category } = useParams<{ category: string }>();
  
  // Convert URL param to CategoryName (handle URL-friendly format)
  const categoryMap: Record<string, CategoryName> = {
    product: "Product",
    people: "People",
    food: "Food",
    "e-commerce": "E-commerce",
    ecommerce: "E-commerce",
    timekeeper: "Timekeeper",
  };

  const categoryName = category ? categoryMap[category.toLowerCase()] : null;
  const selectedCategory = categoryName ? getCategory(categoryName) : null;

  // If no category or invalid category, redirect to first category
  if (!categoryName || !selectedCategory) {
    return <Navigate to="/work/product" replace />;
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <Typography variant="h1" className="mb-2">
          {selectedCategory.name}
        </Typography>
      </div>

      <GalleryGrid categoryName={categoryName} />
    </div>
  );
};

export default Gallery;


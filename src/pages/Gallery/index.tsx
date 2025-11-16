import { useParams, Navigate } from "react-router-dom";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { getCategory } from "@/data/galleryData";
import type { CategoryName } from "@/data/galleryData";
import { Instagram, Facebook, Youtube } from "lucide-react";

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

      {/* Mobile Footer */}
      <footer className="lg:hidden py-2 px-4 mt-8">
        <div className="flex justify-center mb-1">
          <Separator className="w-[80%]" />
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex gap-1 justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0 hover:bg-muted"
              asChild
            >
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4 text-foreground" />
              </a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0 hover:bg-muted"
              asChild
            >
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4 text-foreground" />
              </a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0 hover:bg-muted"
              asChild
            >
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4 text-foreground" />
              </a>
            </Button>
          </div>

          <div className="text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Piyush Gogawale
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Gallery;


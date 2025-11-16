// Gallery data - maps category names to their image file paths
// Images are in public/ directory

export type CategoryName =
  | "Product"
  | "People"
  | "Food"
  | "E-commerce"
  | "Timekeeper";

export interface GalleryCategory {
  name: CategoryName;
  folder: string;
  images: string[];
}

// Helper function to generate image paths for a category
const generateImagePaths = (folder: string, count: number): string[] => {
  return Array.from({ length: count }, (_, i) => `/${folder}/${i + 1}.jpg`);
};

export const galleryData: GalleryCategory[] = [
  {
    name: "Product",
    folder: "product",
    images: generateImagePaths("product", 10),
  },
  {
    name: "People",
    folder: "people",
    images: generateImagePaths("people", 10),
  },
  {
    name: "Food",
    folder: "food",
    images: generateImagePaths("food", 10),
  },
  {
    name: "E-commerce",
    folder: "ecommerce",
    images: generateImagePaths("ecommerce", 22), // ecommerce has 22 images
  },
  {
    name: "Timekeeper",
    folder: "timekeeper",
    images: generateImagePaths("timekeeper", 10),
  },
];

// Helper function to get all images for a specific category
export const getCategoryImages = (categoryName: CategoryName): string[] => {
  const category = galleryData.find((cat) => cat.name === categoryName);
  return category?.images || [];
};

// Helper function to get category by name
export const getCategory = (
  categoryName: CategoryName
): GalleryCategory | undefined => {
  return galleryData.find((cat) => cat.name === categoryName);
};

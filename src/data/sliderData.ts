// Slider images data
// Images are in src/assets/slider/ directory
import img1 from "../assets/slider/wb-1.jpg";
import img2 from "../assets/slider/wb-2.jpg";
import img3 from "../assets/slider/wb-3.jpg";

export interface SliderImage {
  src: string;
  category: string;
  categorySlug: string;
}

export const sliderImages: SliderImage[] = [
  { src: img1, category: "Product", categorySlug: "product" },
  { src: img2, category: "E-commerce", categorySlug: "ecommerce" },
  { src: img3, category: "People", categorySlug: "people" },
];


import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { sliderImages } from "@/data/sliderData";

export const ImageSlider = () => {
  const sliderRef = useRef<Slider>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    dots: false,
    arrows: false, // We'll use custom arrows
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
    cssEase: "ease",
    beforeChange: (_current: number, next: number) => setCurrentSlide(next),
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const currentCategory = sliderImages[currentSlide];

  return (
    <div className="w-full max-w-full mx-auto mb-0 pb-0">
      <div className="relative">
        <Slider {...settings} ref={sliderRef}>
          {sliderImages.map((item, idx) => (
            <div key={idx}>
              <div className="relative w-full h-[calc(100vh-15rem)] md:aspect-video md:h-auto bg-muted rounded-lg overflow-hidden md:max-h-[calc(100vh-12rem)]">
                <img
                  src={item.src}
                  alt={`${item.category} slide ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                {/* Black Gradient Overlay */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                {/* Category Heading */}
                <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
                  <Typography
                    variant="h1"
                    className="text-white uppercase font-bold"
                  >
                    {item.category}
                  </Typography>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Custom Controls */}
      <div className="flex justify-center items-center gap-2 md:gap-4 mt-2 md:mt-6 mb-4 md:mb-4">
        <Button
          variant="outline"
          size="icon"
          className="w-10 h-10 md:w-14 md:h-14 rounded-full shadow-md hover:shadow-lg transition-shadow"
          aria-label="Previous"
          onClick={() => sliderRef.current?.slickPrev()}
        >
          <ChevronLeft className="h-4 w-4 md:h-6 md:w-6" />
        </Button>

        <Button
          className="px-4 py-2 md:px-8 md:py-4 bg-black hover:bg-black/90 text-white rounded-xl shadow-md hover:shadow-lg transition-all text-sm md:text-base"
          asChild
        >
          <Link to={`/work/${currentCategory.categorySlug}`}>See More</Link>
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="w-10 h-10 md:w-14 md:h-14 rounded-full shadow-md hover:shadow-lg transition-shadow"
          aria-label="Next"
          onClick={() => sliderRef.current?.slickNext()}
        >
          <ChevronRight className="h-4 w-4 md:h-6 md:w-6" />
        </Button>
      </div>
    </div>
  );
};

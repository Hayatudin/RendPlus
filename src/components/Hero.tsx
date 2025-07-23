import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      image: "/lovable-uploads/eedd55a8-484e-492c-9886-d8f12a1f7d29.png", 
      alt: "Luxury Duplex Interior with LED Lighting"
    },
    {
      image: "/lovable-uploads/c556a26c-719e-4f6d-a3ab-c624c56dc5de.png",
      alt: "Contemporary Black and Stone Facade House"
    },
    {
      image: "/lovable-uploads/b25e21da-ebe9-481b-9548-be3f2e537ec4.png",
      alt: "Modern White and Wood Minimalist House"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleThumbnailClick = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Hero Background with Slideshow */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute inset-0 bg-black/60 z-10"></div>
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-4 h-full flex items-center relative z-10">
        <div className="max-w-2xl text-white animate-fade-in">
          <h1 className="font-montserrat font-bold text-3xl md:text-4xl lg:text-5xl mb-3 leading-tight">
            Bringing Your Designs to Life with Professional <span className="text-red-500">3D</span> Modeling
          </h1>
          <p className="text-base md:text-lg mb-6 text-gray-200">
            Transform your architectural concepts into stunning visual experiences with our expert 3D rendering services.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Button 
              asChild
              size="lg" 
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-md transition-all duration-300 hover:scale-105"
            >
              <Link to="/#pricing">
                Order Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              asChild
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white hover:text-rend-primary font-semibold px-6 py-3 backdrop-blur-sm bg-white/10 rounded-md transition-all duration-300 hover:scale-105"
            >
              <Link to="/#pricing">
                Get a Quote
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Slideshow Indicators */}
      <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? "bg-blue-500 w-10" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Thumbnail previews */}
      <div className="absolute bottom-8 right-8 z-20 flex space-x-2">
        {slides.map((slide, index) => (
          <button
            key={index}
            onClick={() => handleThumbnailClick(index)}
            className={`transition-all duration-300 ${
              index === currentSlide 
                ? "ring-2 ring-blue-500 scale-110" 
                : "opacity-70 hover:opacity-100"
            }`}
          >
            <img 
              src={slide.image} 
              alt={`Thumbnail ${index + 1}`} 
              className="w-16 h-12 object-cover rounded-md"
            />
          </button>
        ))}
      </div>
    </section>
  );
};

export default Hero;

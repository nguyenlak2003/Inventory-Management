"use client";
import React, { useState, useEffect } from "react";
import CarouselSlide from "./CarouselSlide";
import NavigationButton from "./NavigationButton";

function ImageCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image:
        "https://images.pexels.com/photos/6169634/pexels-photo-6169634.jpeg",
      title: "THE BEST WAREHOUSE MANAGER THERE IS",
      subtitle: "Streamline your operations today",
    },
    {
      image:
        "https://images.pexels.com/photos/2701434/pexels-photo-2701434.jpeg",
      title: "OUT OF BUDGET, NOT OUT OF OPTIONS",
      subtitle: "Flexible solutions for every business",
    },
  ];

  function nextSlide() {
    setCurrentSlide((currentSlide + 1) % slides.length);
  }

  function previousSlide() {
    setCurrentSlide((currentSlide - 1 + slides.length) % slides.length);
  }

  function goToSlide(index) {
    setCurrentSlide(index);
  }

  function handleKeyDown(event) {
    if (event.key === "ArrowLeft") {
      previousSlide();
    } else if (event.key === "ArrowRight") {
      nextSlide();
    }
  }

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  return (
    <section
      tabIndex="0"
      role="region"
      aria-label="Image carousel"
      className="overflow-hidden relative h-[600px]"
      onKeyDown={handleKeyDown}
    >
      {slides.map((slide, index) => (
        <CarouselSlide
          key={index}
          image={slide.image}
          title={slide.title}
          subtitle={slide.subtitle}
          isActive={index === currentSlide}
        />
      ))}

      <NavigationButton
        direction="prev"
        ariaLabel="Previous slide"
        onClick={previousSlide}
      />

      <NavigationButton
        direction="next"
        ariaLabel="Next slide"
        onClick={nextSlide}
      />

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            aria-label={`Go to slide ${index + 1}`}
            className={`w-3 h-3 rounded-full border-none cursor-pointer transition-colors duration-300 ${
              index === currentSlide ? "bg-white" : "bg-white/50"
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </section>
  );
}

export default ImageCarousel;

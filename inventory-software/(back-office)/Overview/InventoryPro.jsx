"use client";
import * as React from "react";
import { useState, useEffect } from "react";

function InventoryPro() {
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
    <div className="bg-white min-w-[980px]">
      <Header />
      <Carousel
        slides={slides}
        currentSlide={currentSlide}
        handleKeyDown={handleKeyDown}
        nextSlide={nextSlide}
        previousSlide={previousSlide}
      />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="flex relative justify-between items-center px-16 py-5 bg-white shadow-[rgba(0,0,0,0.35)_0px_0px_25px_0px] z-[100]">
      <div className="flex gap-10 items-center">
        <h1 className="text-2xl text-red-600 font-bold">InventoryPro</h1>
        <nav className="flex gap-8">
          <a href="#features" className="no-underline text-zinc-800">
            Features
          </a>
          <a href="#solutions" className="no-underline text-zinc-800">
            Solutions
          </a>
          <a href="#pricing" className="no-underline text-zinc-800">
            Pricing
          </a>
          <a href="#contact" className="no-underline text-zinc-800">
            Contact
          </a>
        </nav>
      </div>
      <button className="px-6 py-3 bg-red-600 rounded transition-transform cursor-pointer border-none duration-[0.2s] ease-in text-white">
        Get Started
      </button>
    </header>
  );
}

function Carousel({
  slides,
  currentSlide,
  handleKeyDown,
  nextSlide,
  previousSlide,
}) {
  return (
    <div
      tabIndex="0"
      role="region"
      aria-label="Image carousel"
      className="overflow-hidden relative h-[600px]"
      onKeyDown={handleKeyDown}
    >
      {slides.map((slide, index) => (
        <div
          className="absolute top-0 left-0 transition-opacity duration-[0.5s] ease-in-out w-full h-full"
          key={index}
          style={{
            opacity: index === currentSlide ? 1 : 0,
          }}
        >
          <img
            className="object-cover w-full h-full"
            src={slide.image}
            alt={slide.title}
          />
          <div className="absolute top-1/2 left-1/2 p-10 text-center rounded-lg -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white">
            <h2 className="mb-5 text-5xl">{slide.title}</h2>
            <p className="text-2xl">{slide.subtitle}</p>
          </div>
        </div>
      ))}
      <button
        aria-label="Previous slide"
        className="absolute left-5 top-1/2 rounded-full -translate-y-1/2 cursor-pointer bg-black bg-opacity-50 border-none duration-[0.3s] ease-in h-[50px] text-white transition-[background-color] w-[50px]"
        onClick={previousSlide}
      >
        ←
      </button>
      <button
        aria-label="Next slide"
        className="absolute right-5 top-1/2 rounded-full -translate-y-1/2 cursor-pointer bg-black bg-opacity-50 border-none duration-[0.3s] ease-in h-[50px] text-white transition-[background-color] w-[50px]"
        onClick={nextSlide}
      >
        →
      </button>
    </div>
  );
}

function Footer() {
  return (
    <footer className="px-16 py-10 bg-white text-neutral-400">
      <div className="flex justify-between mb-10">
        <div>
          <h3 className="mb-5 text-zinc-800">InventoryPro</h3>
          <p className="max-w-[300px]">
            Streamline your warehouse operations with our cutting-edge inventory
            management solutions.
          </p>
        </div>
        <div className="flex gap-16">
          <div>
            <h4 className="mb-4 text-zinc-800">Company</h4>
            <ul className="p-0 list-none">
              <li className="mb-2.5">
                <a href="#about" className="no-underline text-inherit">
                  About
                </a>
              </li>
              <li className="mb-2.5">
                <a href="#careers" className="no-underline text-inherit">
                  Careers
                </a>
              </li>
              <li className="mb-2.5">
                <a href="#contact" className="no-underline text-inherit">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-zinc-800">Resources</h4>
            <ul className="p-0 list-none">
              <li className="mb-2.5">
                <a href="#blog" className="no-underline text-inherit">
                  Blog
                </a>
              </li>
              <li className="mb-2.5">
                <a href="#guides" className="no-underline text-inherit">
                  Guides
                </a>
              </li>
              <li className="mb-2.5">
                <a href="#webinars" className="no-underline text-inherit">
                  Webinars
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="pt-5 text-center border-t border-solid border-t-zinc-100">
        <p>© 2024 InventoryPro. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default InventoryPro;

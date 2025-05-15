"use client";
import React from "react";
import Header from "./Header";
import ImageCarousel from "./ImageCarousel";
import Footer from "./Footer";

function InventoryProLanding() {
  return (
    <main className="bg-white min-w-[980px]">
      <Header />
      <ImageCarousel />
      <Footer />
    </main>
  );
}

export default InventoryProLanding;

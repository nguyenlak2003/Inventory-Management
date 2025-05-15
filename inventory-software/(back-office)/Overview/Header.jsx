"use client";
import React from "react";

function Header() {
  return (
    <header className="flex relative justify-between items-center px-16 py-5 bg-white shadow-[rgba(0,0,0,0.35)_0px_0px_25px_0px] z-[100]">
      <div className="flex gap-10 items-center">
        <h1 className="text-2xl text-red-600 font-bold">InventoryPro</h1>
        <nav className="flex gap-8">
          <a
            href="#features"
            className="no-underline text-zinc-800 hover:text-red-600 transition-colors"
          >
            Features
          </a>
          <a
            href="#solutions"
            className="no-underline text-zinc-800 hover:text-red-600 transition-colors"
          >
            Solutions
          </a>
          <a
            href="#pricing"
            className="no-underline text-zinc-800 hover:text-red-600 transition-colors"
          >
            Pricing
          </a>
          <a
            href="#contact"
            className="no-underline text-zinc-800 hover:text-red-600 transition-colors"
          >
            Contact
          </a>
        </nav>
      </div>
      <button className="px-6 py-3 bg-red-600 rounded transition-transform cursor-pointer border-none duration-200 ease-in-out text-white hover:bg-red-700 hover:scale-105">
        Get Started
      </button>
    </header>
  );
}

export default Header;

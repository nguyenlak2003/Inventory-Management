"use client";
import React from "react";

function CarouselSlide({ image, title, subtitle, isActive }) {
    return (
        <div
            className="absolute top-0 left-0 transition-opacity duration-500 ease-in-out w-full h-full"
            style={{
                opacity: isActive ? 1 : 0,
            }}
        >
            <img
                className="object-cover w-full h-full"
                src={image}
                alt={title}
            />
            <div className="absolute top-1/2 left-1/2 p-10 text-center rounded-lg -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white">
                <h2 className="mb-5 text-5xl">{title}</h2>
                <p className="text-2xl">{subtitle}</p>
            </div>
        </div>
    );
}

export default CarouselSlide;

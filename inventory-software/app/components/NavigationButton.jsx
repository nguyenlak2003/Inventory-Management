"use client";
import React from "react";

function NavigationButton({ direction, onClick, ariaLabel, className }) {
    const arrowSymbol = direction === "prev" ? "←" : "→";

    return (
        <button
            aria-label={ariaLabel}
            className={`absolute top-1/2 rounded-full -translate-y-1/2 cursor-pointer bg-black bg-opacity-50 border-none duration-300 ease-in-out h-[50px] text-white transition-[background-color] w-[50px] hover:bg-opacity-70 ${direction === "prev" ? "left-5" : "right-5"
                } ${className || ""}`}
            onClick={onClick}
        >
            {arrowSymbol}
        </button>
    );
}

export default NavigationButton;

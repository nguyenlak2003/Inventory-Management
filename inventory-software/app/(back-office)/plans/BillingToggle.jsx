import React from "react";

function BillingToggle({ isAnnual, toggleBilling }) {
    return (
        <div className="flex justify-center mb-10">
            <button
                className="relative p-1 w-60 cursor-pointer bg-black bg-opacity-10 border-[none] rounded-[32px]"
                role="switch"
                aria-label="Toggle between monthly and annual billing"
                aria-checked={isAnnual}
                onClick={toggleBilling}
                onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        toggleBilling();
                    }
                }}
            >
                <div
                    className="absolute h-9 bg-white rounded-3xl transition-transform duration-[0.2s] w-[120px]"
                    style={{
                        transform: isAnnual ? "translateX(120px)" : "translateX(0)",
                    }}
                />
                <div className="grid relative grid-cols-[1fr_1fr] z-[1]">
                    <span
                        className="px-0 py-2"
                        style={{
                            color: isAnnual ? "#666" : "#000",
                        }}
                    >
                        Monthly
                    </span>
                    <span
                        className="px-0 py-2"
                        style={{
                            color: isAnnual ? "#000" : "#666",
                        }}
                    >
                        Annual
                    </span>
                </div>
            </button>
        </div>
    );
}

export default BillingToggle;

import React from "react";

function PricingTier({
    title,
    description,
    price,
    features,
    buttonText,
    buttonAction,
    buttonStyle,
    isAnnual,
    hidePerMonth = false,
    highlighted = false,
    id
}) {
    const handleButtonClick = () => {
        window.location.href = buttonAction;
    };

    const getButtonClasses = () => {
        if (buttonStyle === "primary") {
            return "p-3 w-full text-white bg-red-600 rounded-lg cursor-pointer border-[none]";
        } else if (buttonStyle === "dark") {
            return "p-3 w-full text-white bg-black rounded-lg cursor-pointer border-[none]";
        } else {
            return "p-3 w-full rounded-lg border border-black border-solid cursor-pointer";
        }
    };

    return (
        <article
            role="article"
            aria-labelledby={id || `${title.toLowerCase()}-plan-title`}
            className={`p-8 rounded-2xl border border-solid border-black border-opacity-10 ${highlighted ? "bg-stone-50" : ""
                }`}
        >
            <h2 id={id || `${title.toLowerCase()}-plan-title`} className="mb-4 text-2xl">
                {title}
            </h2>
            <p className="mb-6 text-sm text-stone-500">
                {description}
            </p>
            <div className="mb-6 text-5xl">
                {price !== "Custom" && <span>$</span>}
                <span>{price}</span>
                {!hidePerMonth && <span className="text-base">/mo</span>}
            </div>
            <ul className="p-0 mx-0 mt-0 mb-6">
                {features.map((feature, index) => (
                    <li key={index} className="mb-3">
                        {feature}
                    </li>
                ))}
            </ul>
            <button
                className={getButtonClasses()}
                aria-label={`${buttonText} for ${title} plan`}
                onClick={handleButtonClick}
            >
                {buttonText}
            </button>
        </article>
    );
}

export default PricingTier;

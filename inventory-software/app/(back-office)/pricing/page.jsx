"use client";
import React, { useState } from "react";
import Header from "./Header";
import BillingToggle from "./BillingToggle";
import PricingTier from "./PricingTier";
import FeatureComparison from "./FeatureComparison";

function PricingPage() {
    const [isAnnual, setIsAnnual] = useState(true);

    const toggleBilling = () => {
        setIsAnnual(!isAnnual);
    };

    const pricingTiers = [
        {
            title: "Free",
            description: "Perfect for small businesses just getting started",
            price: "0",
            features: [
                "Up to 100 items",
                "Basic reporting",
                "Single user"
            ],
            buttonText: "Get Started",
            buttonAction: "/signup",
            buttonStyle: "border",
            id: "free-plan-title"
        },
        {
            title: "Starter",
            description: "For growing businesses ready to optimize",
            price: isAnnual ? "29" : "39",
            features: [
                "Up to 1,000 items",
                "Advanced reporting",
                "5 team members",
                "Barcode scanning"
            ],
            buttonText: "Get Started",
            buttonAction: "/signup",
            buttonStyle: "primary"
        },
        {
            title: "Professional",
            description: "For established businesses needing powerful features",
            price: isAnnual ? "79" : "99",
            features: [
                "Unlimited items",
                "Custom reporting",
                "20 team members",
                "Advanced analytics",
                "API access"
            ],
            buttonText: "Get Started",
            buttonAction: "/signup",
            buttonStyle: "primary",
            highlighted: true
        },
        {
            title: "Enterprise",
            description: "Custom solutions for large organizations",
            price: "Custom",
            hidePerMonth: true,
            features: [
                "Unlimited everything",
                "Dedicated support",
                "Custom integrations",
                "SLA guarantee",
                "On-premise option"
            ],
            buttonText: "Contact Sales",
            buttonAction: "/contact",
            buttonStyle: "dark"
        }
    ];

    return (
        <div className="overflow-x-auto overflow-y-auto bg-white">
            <Header />
            <main>
                <section className="px-0 py-20 bg-white">
                    <div className="px-8 py-0 mx-auto my-0 max-w-screen-xl">
                        <h1 className="mb-10 text-7xl leading-none text-center">
                            Simple, transparent pricing
                        </h1>

                        <BillingToggle isAnnual={isAnnual} toggleBilling={toggleBilling} />

                        <div className="grid gap-6 mb-20 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                            {pricingTiers.map((tier, index) => (
                                <PricingTier
                                    key={index}
                                    {...tier}
                                    isAnnual={isAnnual}
                                />
                            ))}
                        </div>

                        <FeatureComparison />
                    </div>
                </section>
            </main>
        </div>
    );
}

export default PricingPage;

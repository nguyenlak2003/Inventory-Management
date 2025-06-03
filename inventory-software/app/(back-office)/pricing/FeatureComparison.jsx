import React from "react";

function FeatureComparison() {
    const features = [
        {
            name: "Inventory Tracking",
            free: "Basic",
            starter: "Advanced",
            professional: "Advanced",
            enterprise: "Custom"
        },
        {
            name: "Reporting",
            free: "Basic",
            starter: "Advanced",
            professional: "Custom",
            enterprise: "Custom"
        },
        {
            name: "API Access",
            free: "-",
            starter: "-",
            professional: "✓",
            enterprise: "✓"
        }
    ];

    return (
        <div className="mx-auto my-0 text-center max-w-[800px]">
            <h2 className="mb-6 text-4xl">Compare all features</h2>
            <p className="mb-10">
                Get a detailed look at what's included in each plan
            </p>
            <table
                aria-label="Plan feature comparison"
                className="w-full border-collapse"
            >
                <caption className="overflow-hidden absolute p-0 -m-px w-px h-px border-0">
                    Comparison of features across different pricing plans
                </caption>
                <thead>
                    <tr className="border-b border-solid border-b-black border-b-opacity-10">
                        <th scope="col" className="p-4 text-left">
                            Feature
                        </th>
                        <th scope="col" className="p-4">
                            Free
                        </th>
                        <th scope="col" className="p-4">
                            Starter
                        </th>
                        <th scope="col" className="p-4">
                            Professional
                        </th>
                        <th scope="col" className="p-4">
                            Enterprise
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {features.map((feature, index) => (
                        <tr key={index} className="border-b border-solid border-b-black border-b-opacity-10">
                            <td className="p-4">{feature.name}</td>
                            <td className="p-4">{feature.free}</td>
                            <td className="p-4">{feature.starter}</td>
                            <td className="p-4">{feature.professional}</td>
                            <td className="p-4">{feature.enterprise}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default FeatureComparison;

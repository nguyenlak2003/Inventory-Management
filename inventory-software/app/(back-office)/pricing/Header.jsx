import React from "react";

function Header() {
    return (
        <header className="flex sticky top-0 items-center px-0 py-4 bg-white shadow-[rgba(0,0,0,0.08)_0px_1px_0px_0px] z-[100]">
            <div className="flex justify-between items-center px-8 py-0 mx-auto my-0 w-full max-w-screen-xl">
                <div className="flex gap-12 items-center">
                    <a
                        href="/"
                        className="text-2xl text-red-600 no-underline font-[bold]"
                    >
                        InventoryPro
                    </a>
                    <nav aria-label="Main navigation">
                        <ul className="flex gap-8 p-0 m-0">
                            <li>
                                <a
                                    className="text-black no-underline"
                                    href="/features"
                                >
                                    Features
                                </a>
                            </li>
                            <li>
                                <a
                                    className="text-black no-underline"
                                    href="/solutions"
                                >
                                    Solutions
                                </a>
                            </li>
                            <li>
                                <a
                                    className="text-black no-underline"
                                    href="/pricing"
                                >
                                    Pricing
                                </a>
                            </li>
                            <li>
                                <a
                                    className="text-black no-underline"
                                    href="/contact"
                                >
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div className="flex gap-4">
                    <a
                        href="/signup"
                        className="px-4 py-2 text-white no-underline bg-red-600 rounded-lg"
                    >
                        Get Started
                    </a>
                </div>
            </div>
        </header>
    );
}

export default Header;

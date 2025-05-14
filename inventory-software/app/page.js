"use client";

import React, { useState } from "react";
import Header from "./components/Header";
import ImageCarousel from "./components/ImageCarousel";
import Footer from "./components/Footer";
import AuthModal from "./(back-office)/AuthModal";

export default function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <main className="bg-white min-w-[980px]">
            <Header onGetStartedClick={() => setIsModalOpen(true)} />
            <ImageCarousel />
            <Footer />
            <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </main>
    );
}

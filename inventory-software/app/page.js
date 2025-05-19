"use client";

import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import ImageCarousel from "./components/ImageCarousel";
import Footer from "./components/Footer";
import AuthModal from "./login/AuthModal";
import { useRouter } from 'next/navigation';

export default function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('token');

            if(token) {
                try {
                    const response = await fetch(`${apiUrl}/api/auth/me`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                if(response.ok) {
                    router.replace('/Overview');
                } else {
                    localStorage.removeItem('token');
                    setIsLoading(false);
                }
                } catch (err) {
                    console.error('Lỗi xác thực: ', err);
                    localStorage.removeItem('token');
                    setIsLoading(false);
                }
            }else {
                setIsLoading(false);
            }
        };

        verifyToken();
    }, [router, apiUrl]);

    if (isLoading) {
        return <div>Đang tải trang...</div>;
    }

    return (
        <main className="bg-white min-w-[980px]">
            <Header onGetStartedClick={() => setIsModalOpen(true)} />   
            <ImageCarousel />
            <Footer />
            <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </main>
    );
}

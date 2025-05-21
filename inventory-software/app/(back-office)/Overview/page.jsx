"use client"
import React, { useState } from "react";
import SidebarMenu from "./SidebarMenu/SidebarMenu"; // Adjust the path if needed
import Link from 'next/link';
export default function OverviewPage() {
    return (
        <div style={{ display: 'flex' }}>
            <SidebarMenu />
            <main style={{ flex: 1, padding: '2rem' }}>
                {/* Your overview content here */}
                <h1>Overview</h1>
                <p>Welcome to the overview page.</p>
            </main>
        </div>
    );
}
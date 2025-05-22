"use client"
import React, { useState } from "react";
import SidebarMenu from "./SidebarMenu/SidebarMenu"; // Adjust the path if needed
import DashboardPage from "./DashboardPage";
export default function OverviewPage() {
    return (
        <div style={{ display: 'flex' }}>
            <SidebarMenu />
            <main style={{ flex: 1, padding: '2rem' }}>
                <DashboardPage />
            </main>
        </div>
    );
}
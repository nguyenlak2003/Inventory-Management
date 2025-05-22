"use client"
import React, { useState } from "react";
import SidebarMenu from "./SidebarMenu/SidebarMenu"; // Adjust the path if needed

import InventoryProTabs from "./Overview-components/InventoryProTabs";
export default function OverviewPage() {
    return (
        <div style={{ display: 'flex' }}>
            <SidebarMenu />
            <InventoryProTabs/>
            <main style={{ flex: 1, padding: '2rem' }}>
                
            </main>
        </div>
    );
}
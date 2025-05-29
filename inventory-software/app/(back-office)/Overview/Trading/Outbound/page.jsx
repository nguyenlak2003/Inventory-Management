
"use client"
import React, { useState } from "react";

import Link from 'next/link';
import PurchaseOrderManagement from "./SellOrderManagement";
import SidebarMenu from "../../SidebarMenu/SidebarMenu";

export default function InventoryManagemnet() {
    return (
        <div style={{ display: 'flex' }}>
            <SidebarMenu />
            <main style={{ flex: 1, padding: '2rem' }}>
                <PurchaseOrderManagement/>
            </main>
        </div>
    );
}

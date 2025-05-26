

"use client"
import React, { useState } from "react";
//import "./style.css"; // Adjust the path if needed
import Link from 'next/link';
import SupplierManagement from "./SupplierManagement";
import SidebarMenu from "../../SidebarMenu/SidebarMenu";

export default function page() {
    return (
        <div style={{ display: 'flex' }}>
            <SidebarMenu />
            <main style={{ flex: 1, padding: '2rem' }}>
            <SupplierManagement/>
            </main>
        </div>
    );
}

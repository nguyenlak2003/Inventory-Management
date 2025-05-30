"use client"
import React from "react";

import EmployeeManagement from "./EmployeeManagement";
import SidebarMenu from "../../SidebarMenu/SidebarMenu";

export default function EmployeeManagemnet() {
    return (
        <div style={{ display: 'flex' }}>
            <SidebarMenu />
            <main style={{ flex: 1, padding: '2rem' }}>
            <EmployeeManagement/>
            </main>
        </div>
    );
}

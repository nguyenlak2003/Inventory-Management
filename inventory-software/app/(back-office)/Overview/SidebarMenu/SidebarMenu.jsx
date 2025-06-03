"use client"
import React, { useState } from "react";
import "./style.css"; // Adjust the path if needed
import Link from 'next/link';
export default function SidebarMenu() {
    // Sidebar open/close state
    const [sidebarClosed, setSidebarClosed] = useState(false);
    // Track which submenu is open (null, 0, 1, ...)
    const [openSubMenu, setOpenSubMenu] = useState(null);

    // Toggle sidebar open/close
    const toggleSidebar = () => {
        setSidebarClosed((prev) => !prev);
        setOpenSubMenu(null); // Close all submenus when toggling sidebar
    };

    // Toggle a specific submenu
    const handleSubMenuToggle = (idx) => {
        setOpenSubMenu((prev) => (prev === idx ? null : idx));
        if (sidebarClosed) {
            setSidebarClosed(false);
        }
    };

    // Menu data for mapping
    const subMenus = [
        {
            label: "Inventory",
            items: ["Electronics", "Housewares", "Misc"],
        },
        {
            label: "Trading",
            items: ["Customers", "Provider", "Inbound", "Outbound", "Employees"],
        },
    ];

    return (
        <nav
            id="sidebar"
            className={sidebarClosed ? "close" : ""}
        // You can add more classes as needed
        >
            <ul>
                <li>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" style={{ marginRight: '8px', fill: 'red' }}>
                            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zM7.16 14.26l.03-.12L7.9 12h8.45c.75 0 1.41-.41 1.75-1.03l3.24-5.88A1 1 0 0 0 20.45 4H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7.42c-.14 0-.25-.11-.26-.25zM6.16 6h12.31l-2.76 5H8.53L6.16 6z" />
                        </svg>
                        <span className="logo" style={{ color: 'red', fontWeight: 'bold', fontSize: '1.2em' }}>InventoryPro</span>
                        <button
                            onClick={toggleSidebar}
                            id="toggle-btn"
                            className={sidebarClosed ? "rotate" : ""}
                            aria-label="Toggle sidebar"
                            type="button"
                        >
                            {/* SVG icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="red">
                                <path d="m313-480 155 156q11 11 11.5 27.5T468-268q-11 11-28 11t-28-11L228-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l184-184q11-11 27.5-11.5T468-692q11 11 11 28t-11 28L313-480Zm264 0 155 156q11 11 11.5 27.5T732-268q-11 11-28 11t-28-11L492-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l184-184q11-11 27.5-11.5T732-692q11 11 11 28t-11 28L577-480Z" />
                            </svg>
                        </button>
                    </div>
                </li>
                <li className="active">
                    <Link href="/Overview">
                        {/* SVG icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                            <path d="M240-200h120v-200q0-17 11.5-28.5T400-440h160q17 0 28.5 11.5T600-400v200h120v-360L480-740 240-560v360Zm-80 0v-360q0-19 8.5-36t23.5-28l240-180q21-16 48-16t48 16l240 180q15 11 23.5 28t8.5 36v360q0 33-23.5 56.5T720-120H560q-17 0-28.5-11.5T520-160v-200h-80v200q0 17-11.5 28.5T400-120H240q-33 0-56.5-23.5T160-200Zm320-270Z" />
                        </svg>
                        <span>Home</span>
                    </Link>
                </li>
                <li>
                    <Link href="/Overview/Dashboard">
                        {/* SVG icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                            <path d="M520-640v-160q0-17 11.5-28.5T560-840h240q17 0 28.5 11.5T840-800v160q0 17-11.5 28.5T800-600H560q-17 0-28.5-11.5T520-640ZM120-480v-320q0-17 11.5-28.5T160-840h240q17 0 28.5 11.5T440-800v320q0 17-11.5 28.5T400-440H160q-17 0-28.5-11.5T120-480Zm400 320v-320q0-17 11.5-28.5T560-520h240q17 0 28.5 11.5T840-480v320q0 17-11.5 28.5T800-120H560q-17 0-28.5-11.5T520-160Zm-400 0v-160q0-17 11.5-28.5T160-360h240q17 0 28.5 11.5T440-320v160q0 17-11.5 28.5T400-120H160q-17 0-28.5-11.5T120-160Zm80-360h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z" />
                        </svg>
                        <span>Dashboard</span>
                    </Link>
                </li>
                {/* Submenus */}
                {subMenus.map((menu, idx) => (
                    <li key={menu.label}>
                        <button
                            onClick={() => handleSubMenuToggle(idx)}
                            className={`dropdown-btn${openSubMenu === idx ? " rotate" : ""}`}
                            type="button"
                        >
                            {/* SVG icon */}
                            {idx === 0 ? (
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                    <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h207q16 0 30.5 6t25.5 17l57 57h320q33 0 56.5 23.5T880-640v400q0 33-23.5-56.5T800-160H160Zm0-80h640v-400H447l-80-80H160v480Zm0 0v-480 480Zm400-160v40q0 17 11.5 28.5T600-320q17 0 28.5-11.5T640-360v-40h40q17 0 28.5-11.5T720-440q0-17-11.5-28.5T680-480h-40v-40q0-17-11.5-28.5T600-560q-17 0-28.5 11.5T560-520v40h-40q-17 0-28.5 11.5T480-440q0 17 11.5 28.5T520-400h40Z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                    <path d="m221-313 142-142q12-12 28-11.5t28 12.5q11 12 11 28t-11 28L250-228q-12 12-28 12t-28-12l-86-86q-11-11-11-28t11-28q11-11 28-11t28 11l57 57Zm0-320 142-142q12-12 28-11.5t28 12.5q11 12 11 28t-11 28L250-548q-12 12-28 12t-28-12l-86-86q-11-11-11-28t11-28q11-11 28-11t28 11l57 57Zm339 353q-17 0-28.5-11.5T520-320q0-17 11.5-28.5T560-360h280q17 0 28.5 11.5T880-320q0 17-11.5 28.5T840-280H560Zm0-320q-17 0-28.5-11.5T520-640q0-17 11.5-28.5T560-680h280q17 0 28.5 11.5T880-640q0 17-11.5 28.5T840-600H560Z" />
                                </svg>
                            )}
                            <span>{menu.label}</span>
                            {/* Down arrow */}
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                <path d="M480-361q-8 0-15-2.5t-13-8.5L268-556q-11-11-11-28t11-28q11-11 28-11t28 11l156 156 156-156q11-11 28-11t28 11q11 11 11 28t-11 28L508-372q-6 6-13 8.5t-15 2.5Z" />
                            </svg>
                        </button>
                        <ul className={`sub-menu${openSubMenu === idx ? " show" : ""}`}>
                            <div>
                                {menu.items.map((item) => (
                                    <li key={item}>
                                        <Link href={`/Overview/${menu.label}/${item}`}>
                                            {item}
                                        </Link>
                                    </li>
                                ))}

                            </div>
                        </ul>
                    </li>
                ))}
                <li>
                    <Link href='/Overview/Security'>
                        {/* SVG icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#e8eaed">
                            <path d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3zm0 2.18l6 2.25V11c0 4.42-2.94 8.36-6 9.74C8.94 19.36 6 15.42 6 11V6.43l6-2.25z" />
                        </svg>
                        <span>Security</span>
                    </Link>
                </li>
                <li>
                    <Link href='/Overview/Profile'>
                        {/* SVG icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                            <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-240v-32q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v32q0 33-23.5 56.5T720-160H240q-33 0-56.5-23.5T160-240Zm80 0h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z" />
                        </svg>
                        <span>Profile</span>
                    </Link>
                </li>
            </ul>
        </nav>
    );
}
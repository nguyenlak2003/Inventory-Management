import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

function TabNavigation() {
  const router = useRouter();
  const tabs = [
    { id: "customers", label: "Customers", href: "/customers" },
    { id: "invoices", label: "Invoices", href: "/invoices" },
    { id: "information", label: "Information", href: "/information" },
  ];

  return (
    <nav className="flex gap-2.5">
      {tabs.map((tab) => {
        const isActive = router.pathname === tab.href;
        return (
          <Link key={tab.id} href={tab.href} passHref legacyBehavior>
            <a
              className="px-5 py-2.5 rounded cursor-pointer border-[none]"
              style={{
                backgroundColor: isActive ? "#E31B23" : "#f5f5f5",
                color: isActive ? "white" : "black",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              {tab.label}
            </a>
          </Link>
        );
      })}
    </nav>
  );
}

export default TabNavigation;

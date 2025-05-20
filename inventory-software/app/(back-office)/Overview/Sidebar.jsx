"use client";
import React, { useState } from "react";

function Sidebar({ isNavMinimized, selectedMenuItem, onMenuItemSelect }) {
  const [menuOpen, setMenuOpen] = useState({
    inventory: false,
    sales: false,
    purchases: false,
    account: false,
  });

  const [activeMenuId, setActiveMenuId] = useState(null);
  const [focusedMenuItemIndex, setFocusedMenuItemIndex] = useState(-1);

  // Toggle menu open/closed
  const toggleMenu = (menu) => {
    setMenuOpen((prev) => {
      const newState = { ...prev };
      // Close all other menus
      Object.keys(newState).forEach((key) => {
        newState[key] = key === menu ? !prev[key] : false;
      });
      return newState;
    });

    if (!menuOpen[menu]) {
      setActiveMenuId(menu);
      setFocusedMenuItemIndex(0);
      setTimeout(() => {
        const menuItems = document.querySelectorAll(
          `#${menu}-menu [role="menuitem"]`,
        );
        if (menuItems.length > 0) menuItems[0].focus();
      }, 0);
    } else {
      setActiveMenuId(null);
      setFocusedMenuItemIndex(-1);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (event, menu) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleMenu(menu);
    }

    if (event.key === "Escape" && menuOpen[menu]) {
      toggleMenu(menu);
      document.querySelector(`button[aria-controls="${menu}-menu"]`).focus();
    }

    if (
      (event.key === "ArrowDown" || event.key === "ArrowUp") &&
      menuOpen[menu]
    ) {
      event.preventDefault();
      const menuItems = document.querySelectorAll(
        `#${menu}-menu [role="menuitem"]`,
      );
      const itemCount = menuItems.length;

      if (itemCount === 0) return;

      const currentIndex = focusedMenuItemIndex;
      const nextIndex =
        event.key === "ArrowDown"
          ? (currentIndex + 1) % itemCount
          : (currentIndex - 1 + itemCount) % itemCount;

      setFocusedMenuItemIndex(nextIndex);
      menuItems[nextIndex].focus();
    }

    if (event.key === "Tab" && menuOpen[menu]) {
      toggleMenu(menu);
    }
  };

  return (
    <nav
      role="navigation"
      aria-label="Main Navigation"
      className="flex overflow-hidden relative flex-col gap-2.5 p-5 bg-white duration-[0.3s] ease-[ease] shadow-[2px_0_5px_rgba(0,0,0,0.1)] transition-[width] z-10"
      style={{
        width: isNavMinimized ? "60px" : "250px",
        minWidth: isNavMinimized ? "60px" : "250px",
      }}
    >
      <header className="mb-8 text-3xl tracking-tighter text-red-600 font-bold">
        {!isNavMinimized && <p>InventoryPro</p>}
        {isNavMinimized && <p>IP</p>}
      </header>

      <NavItem
        label="Home"
        isSelected={selectedMenuItem === "home"}
        onClick={() => onMenuItemSelect("home")}
        isMinimized={isNavMinimized}
      />

      <div role="menuitem">
        <button
          className="px-5 py-2.5 w-full text-left rounded-md transition-all cursor-pointer border-none duration-[0.2s] ease-[ease]"
          aria-controls="inventory-menu"
          id="inventory-trigger"
          aria-haspopup="true"
          aria-expanded={menuOpen.inventory}
          onKeyDown={(event) => handleKeyDown(event, "inventory")}
          onClick={() => {
            toggleMenu("inventory");
            onMenuItemSelect("inventory");
          }}
          style={{
            backgroundColor:
              selectedMenuItem === "inventory"
                ? "rgba(214, 35, 12, 0.1)"
                : "transparent",
            color:
              selectedMenuItem === "inventory"
                ? "rgb(214, 35, 12)"
                : "rgb(87, 87, 87)",
            overflow: isNavMinimized ? "hidden" : "visible",
            textOverflow: isNavMinimized ? "ellipsis" : "clip",
            whiteSpace: "nowrap",
          }}
        >
          {isNavMinimized ? "Inv" : "Inventory ▼"}
        </button>

        {menuOpen.inventory && !isNavMinimized && (
          <nav aria-label="Inventory Navigation">
            <ul
              id="inventory-menu"
              className="p-0 m-0 ml-5 rounded-md bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
            >
              {["Electronics", "Housewares", "Misc"].map((category, index) => (
                <li key={category}>
                  <button
                    className="block px-5 py-2.5 w-full text-base text-left no-underline transition-all cursor-pointer border-none duration-[0.2s] text-zinc-600 hover:bg-red-50"
                    role="menuitem"
                    tabIndex={focusedMenuItemIndex === index ? 0 : -1}
                    onClick={() => onMenuItemSelect("inventory", category)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onMenuItemSelect("inventory", category);
                      }
                    }}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      <div role="menuitem">
        <button
          className="px-5 py-2.5 w-full text-lg text-left rounded-md transition-all cursor-pointer border-none duration-[0.2s] ease-[ease]"
          aria-controls="sales-menu"
          id="sales-trigger"
          aria-haspopup="true"
          aria-expanded={menuOpen.sales}
          onKeyDown={(event) => handleKeyDown(event, "sales")}
          onClick={() => {
            toggleMenu("sales");
            onMenuItemSelect("sales");
          }}
          style={{
            backgroundColor:
              selectedMenuItem === "sales"
                ? "rgba(214, 35, 12, 0.1)"
                : "transparent",
            color:
              selectedMenuItem === "sales"
                ? "rgb(214, 35, 12)"
                : "rgb(87, 87, 87)",
            overflow: isNavMinimized ? "hidden" : "visible",
            textOverflow: isNavMinimized ? "ellipsis" : "clip",
            whiteSpace: "nowrap",
          }}
        >
          {isNavMinimized ? "Sal" : "Sales ▼"}
        </button>

        {menuOpen.sales && !isNavMinimized && (
          <nav aria-label="Sales Navigation">
            <ul
              role="menu"
              id="sales-menu"
              className="p-0 m-0 ml-5 rounded-md bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
            >
              {["Orders", "Invoices", "Reports"].map((item, index) => (
                <li key={item}>
                  <button
                    className="block px-5 py-2.5 w-full text-base text-left cursor-pointer border-none text-zinc-600 hover:bg-red-50"
                    role="menuitem"
                    tabIndex={focusedMenuItemIndex === index ? 0 : -1}
                    onClick={() => onMenuItemSelect("sales", item)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onMenuItemSelect("sales", item);
                      }
                    }}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      <div role="menuitem">
        <button
          className="px-5 py-2.5 w-full text-lg text-left rounded-md transition-all cursor-pointer border-none duration-[0.2s] ease-[ease]"
          aria-controls="purchases-menu"
          id="purchases-trigger"
          aria-haspopup="true"
          aria-expanded={menuOpen.purchases}
          onKeyDown={(event) => handleKeyDown(event, "purchases")}
          onClick={() => {
            toggleMenu("purchases");
            onMenuItemSelect("purchases");
          }}
          style={{
            backgroundColor:
              selectedMenuItem === "purchases"
                ? "rgba(214, 35, 12, 0.1)"
                : "transparent",
            color:
              selectedMenuItem === "purchases"
                ? "rgb(214, 35, 12)"
                : "rgb(87, 87, 87)",
            overflow: isNavMinimized ? "hidden" : "visible",
            textOverflow: isNavMinimized ? "ellipsis" : "clip",
            whiteSpace: "nowrap",
          }}
        >
          {isNavMinimized ? "Pur" : "Purchases ▼"}
        </button>

        {menuOpen.purchases && !isNavMinimized && (
          <nav aria-label="Purchases Navigation">
            <ul
              role="menu"
              id="purchases-menu"
              className="p-0 m-0 ml-5 rounded-md bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
            >
              {["Orders", "Vendors", "Expenses"].map((item, index) => (
                <li key={item}>
                  <button
                    className="block px-5 py-2.5 w-full text-base text-left cursor-pointer border-none text-zinc-600 hover:bg-red-50"
                    role="menuitem"
                    tabIndex={focusedMenuItemIndex === index ? 0 : -1}
                    onClick={() => onMenuItemSelect("purchases", item)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onMenuItemSelect("purchases", item);
                      }
                    }}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      <NavItem
        label="Integration"
        isSelected={selectedMenuItem === "integration"}
        onClick={() => onMenuItemSelect("integration")}
        isMinimized={isNavMinimized}
      />

      <NavItem
        label="Reports"
        isSelected={selectedMenuItem === "reports"}
        onClick={() => onMenuItemSelect("reports")}
        isMinimized={isNavMinimized}
      />

      <div className="pt-5 mt-auto border-t border-solid border-t-red-600 border-t-opacity-10">
        <button
          className="flex justify-between items-center px-5 py-2.5 w-full text-lg bg-transparent rounded-md cursor-pointer border-none text-zinc-600"
          aria-expanded={menuOpen.account}
          onClick={() => toggleMenu("account")}
          style={{
            overflow: isNavMinimized ? "hidden" : "visible",
            textOverflow: isNavMinimized ? "ellipsis" : "clip",
            whiteSpace: "nowrap",
          }}
        >
          {isNavMinimized ? (
            <span>Acc</span>
          ) : (
            <>
              <span>Account Settings</span>
              <span>▼</span>
            </>
          )}
        </button>

        {menuOpen.account && !isNavMinimized && (
          <div className="ml-5">
            <a
              className="block px-5 py-2.5 text-base no-underline rounded-md text-zinc-600 hover:bg-red-50"
              href="#"
            >
              Manage Account
            </a>
            <a
              className="block px-5 py-2.5 text-base no-underline rounded-md text-zinc-600 hover:bg-red-50"
              href="#"
            >
              Sign Out
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}

// Helper component for navigation items
function NavItem({ label, isSelected, onClick, isMinimized }) {
  return (
    <button
      className="px-5 py-2.5 text-lg text-left rounded-md transition-all cursor-pointer border-none duration-[0.2s] ease-[ease]"
      role="menuitem"
      tabIndex="0"
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
      style={{
        color: isSelected ? "rgb(214, 35, 12)" : "rgb(87, 87, 87)",
        backgroundColor: isSelected ? "rgba(214, 35, 12, 0.1)" : "transparent",
        overflow: isMinimized ? "hidden" : "visible",
        textOverflow: isMinimized ? "ellipsis" : "clip",
        whiteSpace: "nowrap",
      }}
    >
      {isMinimized ? label.substring(0, 3) : label}
    </button>
  );
}

export default Sidebar;

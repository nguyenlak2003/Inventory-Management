"use client";
import React, { useState } from "react";

function Sidebar({
  activeTab,
  setActiveTab,
  selectedMenuItem,
  setSelectedMenuItem,
  searchQuery,
  handleSearch,
  menuOpen,
  toggleMenu,
}) {
  function handleKeyDown(event, menu) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleMenu(menu);
    }
    if (event.key === "Escape" && menuOpen[menu]) {
      toggleMenu(menu);
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const menuItems = document.querySelectorAll(
        `#${menu}-menu [role="menuitem"]`,
      );
      const currentIndex = Array.from(menuItems).findIndex(
        (item) => item === document.activeElement,
      );
      const nextIndex =
        event.key === "ArrowDown"
          ? (currentIndex + 1) % menuItems.length
          : (currentIndex - 1 + menuItems.length) % menuItems.length;
      menuItems[nextIndex].focus();
    }
  }

  function handleMenuItemClick(item) {
    setSelectedMenuItem(item);
  }

  function setSelectedMenuItem(item) {
    setSelectedMenuItem(item);
  }

  return (
    <nav
      role="navigation"
      aria-label="Main Navigation"
      className="flex flex-col gap-2.5 p-5 bg-white shadow-[2px_0_5px_rgba(0,0,0,0.1)] w-[250px]"
    >
      <div className="mb-8 text-3xl tracking-tighter text-red-600 font-[bold]">
        <p>InventoryPro</p>
      </div>

      <NavItem
        label="Home"
        isSelected={selectedMenuItem === "home"}
        onClick={() => handleMenuItemClick("home")}
      />

      <div role="menuitem">
        <button
          className="px-5 py-2.5 w-full text-left rounded-md transition-all cursor-pointer border-[none] duration-[0.2s] ease-[ease]"
          aria-controls="inventory-menu"
          aria-expanded={menuOpen.inventory}
          onKeyDown={(event) => handleKeyDown(event, "inventory")}
          onClick={() => {
            toggleMenu("inventory");
            handleMenuItemClick("inventory");
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
          }}
        >
          Inventory ▼
        </button>
        {menuOpen.inventory && (
          <div id="inventory-menu" role="menu" className="ml-5">
            {["Electronics", "Housewares", "Misc"].map((item) => (
              <a
                className="block px-5 py-2.5 text-lg no-underline rounded-md transition-all duration-[0.2s] ease-[ease]"
                href="#"
                role="menuitem"
                tabIndex="0"
                key={item.toLowerCase()}
                onClick={() => setActiveTab(item.toLowerCase())}
                style={{
                  color:
                    activeTab === item.toLowerCase()
                      ? "rgb(214, 35, 12)"
                      : "rgb(87, 87, 87)",
                  backgroundColor:
                    activeTab === item.toLowerCase()
                      ? "rgba(214, 35, 12, 0.1)"
                      : "transparent",
                }}
              >
                {item}
              </a>
            ))}
          </div>
        )}
      </div>

      <div role="menuitem">
        <button
          className="p-2.5 w-full text-left bg-transparent rounded-md cursor-pointer border-[none]"
          aria-controls="sales-menu"
          aria-expanded={menuOpen.sales}
          onKeyDown={(event) => handleKeyDown(event, "sales")}
          onClick={() => {
            toggleMenu("sales");
            handleMenuItemClick("sales");
          }}
        >
          Sales ▼
        </button>
        {menuOpen.sales && (
          <div
            id="sales-menu"
            role="menu"
            aria-label="Sales menu"
            className="p-1.5 ml-5 rounded-md bg-[white] shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
          >
            <div className="p-2.5">
              <input
                type="search"
                placeholder="Search..."
                className="p-2 mb-2.5 w-full rounded border border-solid border-zinc-300"
                value={searchQuery}
                onChange={(event) => handleSearch(event.target.value)}
              />
            </div>
            {["Customers", "Invoices", "Information"].map((item) => (
              <a
                className="block px-5 py-2.5 text-lg no-underline rounded-md transition-all duration-[0.2s] ease-[ease]"
                href="#"
                role="menuitem"
                tabIndex="0"
                key={item}
                onClick={() => setActiveTab(item.toLowerCase())}
                style={{
                  color:
                    activeTab === item.toLowerCase()
                      ? "rgb(214, 35, 12)"
                      : "rgb(87, 87, 87)",
                }}
              >
                {item}
              </a>
            ))}
          </div>
        )}
      </div>

      <div role="menuitem">
        <button
          className="p-2.5 w-full text-left bg-transparent rounded-md cursor-pointer border-[none]"
          aria-controls="purchases-menu"
          aria-expanded={menuOpen.purchases}
          onKeyDown={(event) => handleKeyDown(event, "purchases")}
          onClick={() => {
            toggleMenu("purchases");
            handleMenuItemClick("purchases");
          }}
        >
          Purchases ▼
        </button>
        {menuOpen.purchases && (
          <div id="purchases-menu" role="menu" className="ml-5">
            {["Suppliers", "Employees", "Bills"].map((item) => (
              <a
                className="block px-5 py-2.5 text-lg no-underline rounded-md transition-all duration-[0.2s] ease-[ease]"
                href="#"
                role="menuitem"
                tabIndex="0"
                key={item}
                onClick={() => setActiveTab(item.toLowerCase())}
                style={{
                  color:
                    activeTab === item.toLowerCase()
                      ? "rgb(214, 35, 12)"
                      : "rgb(87, 87, 87)",
                }}
              >
                {item}
              </a>
            ))}
          </div>
        )}
      </div>

      <NavItem
        label="Integration"
        isSelected={selectedMenuItem === "integration"}
        onClick={() => handleMenuItemClick("integration")}
      />

      <NavItem
        label="Reports"
        isSelected={selectedMenuItem === "reports"}
        onClick={() => handleMenuItemClick("reports")}
      />

      <div className="pt-5 mt-auto border-t border-solid border-t-red-600 border-t-opacity-10">
        <button
          className="flex justify-between items-center px-5 py-2.5 w-full text-lg bg-transparent rounded-md cursor-pointer border-[none] text-zinc-600"
          aria-expanded={menuOpen.account}
          onClick={() => toggleMenu("account")}
        >
          <span>Account Settings</span>
          <span>▼</span>
        </button>
        {menuOpen.account && (
          <div className="ml-5">
            <a
              className="px-5 py-2.5 text-base no-underline rounded-md text-zinc-600"
              href="#"
            >
              Manage Account
            </a>
            <a
              className="px-5 py-2.5 text-base no-underline rounded-md text-zinc-600"
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

function NavItem({ label, isSelected, onClick }) {
  return (
    <a
      className="px-5 py-2.5 no-underline rounded-md transition-all duration-[0.2s] ease-[ease]"
      href="#"
      role="menuitem"
      tabIndex="0"
      onClick={onClick}
      style={{
        color: isSelected ? "rgb(214, 35, 12)" : "rgb(87, 87, 87)",
        backgroundColor: isSelected ? "rgba(214, 35, 12, 0.1)" : "transparent",
      }}
    >
      {label}
    </a>
  );
}

export default Sidebar;
"use client";  
import React, { useState } from "react";  

function Sidebar({  
 activeTab,  
 setActiveTab,  
 selectedMenuItem,  
 setSelectedMenuItem,  
 searchQuery,  
 handleSearch,  
 menuOpen,  
 toggleMenu,  
}) {  
 function handleKeyDown(event, menu) {  
   if (event.key === "Enter" || event.key === " ") {  
     event.preventDefault();  
     toggleMenu(menu);  
   }  
   if (event.key === "Escape" && menuOpen[menu]) {  
     toggleMenu(menu);  
   }  
   if (event.key === "ArrowDown" || event.key === "ArrowUp") {  
     event.preventDefault();  
     const menuItems = document.querySelectorAll(  
       `#${menu}-menu [role="menuitem"]`,  
     );  
     const currentIndex = Array.from(menuItems).findIndex(  
       (item) => item === document.activeElement,  
     );  
     const nextIndex =  
       event.key === "ArrowDown"  
         ? (currentIndex + 1) % menuItems.length  
         : (currentIndex - 1 + menuItems.length) % menuItems.length;  
     menuItems[nextIndex].focus();  
   }  
 }  

 function handleMenuItemClick(item) {  
   setSelectedMenuItem(item);  
 }  

 // Issue: Duplicate function definition for setSelectedMenuItem  
 // Fix: Remove the duplicate function definition below  
 // function setSelectedMenuItem(item) {  
 //   setSelectedMenuItem(item);  
 // }  

 return (  
   <nav  
     role="navigation"  
     aria-label="Main Navigation"  
     className="flex flex-col gap-2.5 p-5 bg-white shadow-[2px_0_5px_rgba(0,0,0,0.1)] w-[250px]"  
   >  
     <div className="mb-8 text-3xl tracking-tighter text-red-600 font-[bold]">  
       <p>InventoryPro</p>  
     </div>  

     <NavItem  
       label="Home"  
       isSelected={selectedMenuItem === "home"}  
       onClick={() => handleMenuItemClick("home")}  
     />  

     <div role="menuitem">  
       <button  
         className="px-5 py-2.5 w-full text-left rounded-md transition-all cursor-pointer border-[none] duration-[0.2s] ease-[ease]"  
         aria-controls="inventory-menu"  
         aria-expanded={menuOpen.inventory}  
         onKeyDown={(event) => handleKeyDown(event, "inventory")}  
         onClick={() => {  
           toggleMenu("inventory");  
           handleMenuItemClick("inventory");  
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
         }}  
       >  
         Inventory ▼  
       </button>  
       {menuOpen.inventory && (  
         <div id="inventory-menu" role="menu" className="ml-5">  
           {["Electronics", "Housewares", "Misc"].map((item) => (  
             <a  
               className="block px-5 py-2.5 text-lg no-underline rounded-md transition-all duration-[0.2s] ease-[ease]"  
               href="#"  
               role="menuitem"  
               tabIndex="0"  
               key={item.toLowerCase()}  
               onClick={() => setActiveTab(item.toLowerCase())}  
               style={{  
                 color:  
                   activeTab === item.toLowerCase()  
                     ? "rgb(214, 35, 12)"  
                     : "rgb(87, 87, 87)",  
                 backgroundColor:  
                   activeTab === item.toLowerCase()  
                     ? "rgba(214, 35, 12, 0.1)"  
                     : "transparent",  
               }}  
             >  
               {item}  
             </a>  
           ))}  
         </div>  
       )}  
     </div>  

     {/* Other menu items remain unchanged */}  

     <NavItem  
       label="Integration"  
       isSelected={selectedMenuItem === "integration"}  
       onClick={() => handleMenuItemClick("integration")}  
     />  

     <NavItem  
       label="Reports"  
       isSelected={selectedMenuItem === "reports"}  
       onClick={() => handleMenuItemClick("reports")}  
     />  

     <div className="pt-5 mt-auto border-t border-solid border-t-red-600 border-t-opacity-10">  
       <button  
         className="flex justify-between items-center px-5 py-2.5 w-full text-lg bg-transparent rounded-md cursor-pointer border-[none] text-zinc-600"  
         aria-expanded={menuOpen.account}  
         onClick={() => toggleMenu("account")}  
       >  
         <span>Account Settings</span>  
         <span>▼</span>  
       </button>  
       {menuOpen.account && (  
         <div className="ml-5">  
           <a  
             className="px-5 py-2.5 text-base no-underline rounded-md text-zinc-600"  
             href="#"  
           >  
             Manage Account  
           </a>  
           <a  
             className="px-5 py-2.5 text-base no-underline rounded-md text-zinc-600"  
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

function NavItem({ label, isSelected, onClick }) {  
 return (  
   <a  
     className="px-5 py-2.5 no-underline rounded-md transition-all duration-[0.2s] ease-[ease]"  
     href="#"  
     role="menuitem"  
     tabIndex="0"  
     onClick={onClick}  
     style={{  
       color: isSelected ? "rgb(214, 35, 12)" : "rgb(87, 87, 87)",  
       backgroundColor: isSelected ? "rgba(214, 35, 12, 0.1)" : "transparent",  
     }}  
   >  
     {label}  
   </a>  
 );  
}  

export default Sidebar;

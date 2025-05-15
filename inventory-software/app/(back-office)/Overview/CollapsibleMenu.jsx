import React from "react";

function CollapsibleMenu({
  label,
  isOpen,
  isSelected,
  onToggle,
  onKeyDown,
  menuItems,
}) {
  return (
    <div role="menuitem">
      <button
        className="px-5 py-2.5 w-full text-left rounded-md transition-all cursor-pointer border-[none] duration-[0.2s] ease-[ease]"
        aria-controls={`${label.toLowerCase()}-menu`}
        aria-expanded={isOpen}
        onKeyDown={onKeyDown}
        onClick={onToggle}
        style={{
          backgroundColor: isSelected
            ? "rgba(214, 35, 12, 0.1)"
            : "transparent",
          color: isSelected ? "rgb(214, 35, 12)" : "rgb(87, 87, 87)",
        }}
      >
        {label} ▼
      </button>

      {isOpen && (
        <div id={`${label.toLowerCase()}-menu`} role="menu" className="ml-5">
          {menuItems?.map((item) => (
            <a
              className="block p-2 no-underline text-stone-500"
              href="#"
              role="menuitem"
              tabIndex="0"
              key={item}
            >
              {item}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default CollapsibleMenu;

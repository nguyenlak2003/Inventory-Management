import React from "react";

function NavItem({ label, isSelected, onClick }) {
  return (
    <a
      className="px-5 py-2.5 no-underline rounded-md transition-all duration-[0.2s] ease-[ease]"
      href="#"
      role="menuitem"
      tabIndex="0"
      onClick={(event) => {
        event.preventDefault();
        onClick();
      }}
      style={{
        color: isSelected ? "rgb(214, 35, 12)" : "rgb(87, 87, 87)",
        backgroundColor: isSelected ? "rgba(214, 35, 12, 0.1)" : "transparent",
      }}
    >
      {label}
    </a>
  );
}

export default NavItem;

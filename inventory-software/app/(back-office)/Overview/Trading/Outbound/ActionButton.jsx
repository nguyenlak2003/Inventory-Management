import React from "react";

function ActionButton({
  children,
  variant = "primary",
  className = "",
  onClick,
  ...props
}) {
  const baseStyles =
    "px-4 py-2 rounded cursor-pointer border-[none] text-[white]";

  const variantStyles = {
    primary: "px-5 py-2.5 bg-red-700",
    secondary: "bg-stone-500",
    danger: "bg-red-800",
  };

  const buttonStyles = `${baseStyles} ${variantStyles[variant]} ${className}`;

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick && onClick(event);
    }
  };

  return (
    <button
      className={buttonStyles}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </button>
  );
}

export default ActionButton;

import React from "react";

function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
  ...props
}) {
  const baseClasses =
    "px-5 py-2.5 rounded cursor-pointer border-none duration-[0.2s] font-bold text-white transition-[background-color]";

  const variantClasses = {
    primary: "bg-red-600 hover:bg-red-700",
    dark: "px-10 py-4 text-base bg-zinc-800 hover:bg-zinc-900",
  };

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <button className={buttonClasses} onClick={onClick} {...props}>
      {children}
    </button>
  );
}

export default Button;

import React from "react";

export default function CandidateButton({
  href,
  children,
  variant = "primary",
  type = "button",
  onClick,
  className = "",
  disabled = false,
}) {
  const baseStyles = "px-8 py-2 rounded-md transition-colors text-center";
  const variants = {
    primary: disabled
      ? "bg-gray-400 text-white cursor-not-allowed"
      : "bg-[#05B4B4] text-white hover:bg-[#049191]",
    secondary: disabled
      ? "bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed"
      : "bg-transparent text-[#05B4B4] border border-[#05B4B4] hover:bg-[#f0fdfd]",
  };

  const ButtonComponent = href ? "a" : "button";
  const buttonProps = href ? { href } : { type, onClick, disabled }; // Apply native disabled attr only on <button>

  return (
    <ButtonComponent
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...buttonProps}
    >
      {children}
    </ButtonComponent>
  );
}

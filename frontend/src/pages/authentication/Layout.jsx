import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Group5 from "../../assets/logo.svg";

export default function Layout({ children, buttonText }) {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleClick = () => {
    buttonText === "SIGN IN" ? navigate("/login") : navigate("/register");
  };

  return (
    <div
      className="min-h-screen relative flex flex-col items-center justify-center h-full px-4 sm:px-6 md:px-8 lg:px-10"
      style={{ backgroundColor: "#F2FDFF" }}
    >
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{ backgroundColor: "rgba(255, 255, 255, 0)", zIndex: 0 }}
      ></div>

      {/* Top bar container with flex */}
      <div className="absolute top-4 sm:top-6 md:top-8 left-0 right-0 flex items-center justify-between px-6 sm:px-8 md:px-12 lg:px-16 w-full">
        {/* Logo */}
        <img
          src={Group5}
          alt="TalentScout"
          className="w-28 sm:w-36 md:w-44 lg:w-48 h-auto"
        />

        {/* Sign-in button */}
        <button
          onClick={handleClick}
          className="border border-black text-black font-bold px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base"
        >
          {buttonText}
        </button>
      </div>

      <div
        className="absolute top-0 left-0 w-full h-full bg-white"
        style={{ clipPath: "polygon(0 50%, 100% 25%, 100% 100%, 0 100%)" }}
      ></div>

      {children}
{/* 
      <footer className="absolute bottom-0 w-full text-center py-2 sm:py-3 md:py-4 text-xs sm:text-sm md:text-base text-gray-500">
        © 2024 - {new Date().getFullYear()} All Rights Reserved TalentScout
      </footer> */}
    </div>
  );
}

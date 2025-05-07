import React, { useState, useEffect } from "react";
import { FiMenu, FiLogOut, FiHome, FiBriefcase } from "react-icons/fi"; 
import TalentScout from "../../assets/Logo.svg";
import { useLocation } from "react-router-dom";

export default function SidebarLayout({ children }) {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Set initial selection based on current path
  const getInitialSelection = () => {
    if (currentPath.includes("/dashboard")) return "dashboard";
    return "jobs";
  };
  
  const [currentSelection, setCurrentSelection] = useState(getInitialSelection);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar toggle state

  useEffect(() => {
    localStorage.setItem("currentSelection", currentSelection);
  }, [currentSelection]);

  // Update selection when path changes
  useEffect(() => {
    if (currentPath.includes("/dashboard")) {
      setCurrentSelection("dashboard");
    } else if (currentPath.includes("/recruiter") && !currentPath.includes("/dashboard")) {
      setCurrentSelection("jobs");
    }
  }, [currentPath]);

  const handleLogout = () => {
    // Clear any user-related data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("currentSelection");
    // Redirect to login page
    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen bg-[#F2FDFF] overflow-hidden">
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-md flex items-center p-4 z-50">
        <FiMenu className="text-2xl cursor-pointer mr-4" onClick={() => setIsSidebarOpen(true)} />
        <img src={TalentScout} alt="TalentScout" className="h-10" />
      </div>

      {/* Sidebar: Fixed on the left */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white p-0 transition-transform duration-300 ease-in-out shadow-lg z-50
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:w-[18%] flex flex-col`} // Added flex-col for layout
      >
        <div className="flex items-center p-4 lg:block">
          <FiMenu className="text-2xl cursor-pointer lg:hidden" onClick={() => setIsSidebarOpen(false)} />
          <img onClick={() => (window.location.href = "/recruiter")} src={TalentScout} alt="TalentScout" className="w-44 h-10" />
        </div>

        <nav className="flex-grow">
          <ul className="space-y-0">
            {/* Dashboard Button */}
            <a 
            href="/recruiter/dashboard" 
            className="block" onClick={() => setCurrentSelection("dashboard")}>
              <li className={`py-3 px-6 font-bold cursor-pointer flex items-center ${currentSelection === "dashboard" ? "text-white bg-[#144066]" : "text-[#5E5E5E]"}`}>
                <FiHome className="mr-2" />
                Dashboard
              </li>
            </a>
            {/* Jobs Button */}
            <a href="/recruiter" className="block" onClick={() => setCurrentSelection("jobs")}>
              <li className={`py-3 px-6 font-bold cursor-pointer flex items-center ${currentSelection === "jobs" ? "text-white bg-[#144066]" : "text-[#5E5E5E]"}`}>
                <FiBriefcase className="mr-2" />
                Jobs
              </li>
            </a>
          </ul>
        </nav>
        
        {/* Logout Button */}
        <div className="mt-auto border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full py-4 px-6 text-[#5E5E5E] font-bold flex items-center transition hover:bg-gray-100"
          >
            <FiLogOut className="mr-2" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 p-8 overflow-y-auto max-h-screen mt-16 lg:mt-0">
        {children}
      </main>
    </div>
  );
}

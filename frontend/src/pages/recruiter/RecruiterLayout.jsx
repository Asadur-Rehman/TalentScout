import React, { useState, useEffect } from "react";
import { FiMenu } from "react-icons/fi"; 
import TalentScout from "../../assets/Logo.svg";

export default function SidebarLayout({ children }) {
  const storedSelection = localStorage.getItem("currentSelection") || "dashboard";
  const [currentSelection, setCurrentSelection] = useState(storedSelection);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar toggle state

  useEffect(() => {
    localStorage.setItem("currentSelection", currentSelection);
  }, [currentSelection]);

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
          lg:translate-x-0 lg:static lg:w-[18%]`} // Adjusted sidebar width for different screen sizes
      >
        <div className="flex items-center p-4 lg:block">
          <FiMenu className="text-2xl cursor-pointer lg:hidden" onClick={() => setIsSidebarOpen(false)} />
          <img onClick={() => (window.location.href = "/recruiter")} src={TalentScout} alt="TalentScout" className="w-44 h-10" />
        </div>

        <nav>
          <ul className="space-y-0">
            {/* Dashboard Button */}
            <a href="/recruiter/dashboard" className="block" onClick={() => setCurrentSelection("dashboard")}>
              <li className={`py-3 px-6 font-bold cursor-pointer ${currentSelection === "dashboard" ? "text-white bg-[#144066]" : "text-[#5E5E5E]"}`}>
                Dashboard
              </li>
            </a>
            {/* Jobs Button */}
            <a href="/recruiter" className="block" onClick={() => setCurrentSelection("jobs")}>
              <li className={`py-3 px-6 font-bold cursor-pointer ${currentSelection === "jobs" ? "text-white bg-[#144066]" : "text-[#5E5E5E]"}`}>
                Jobs
              </li>
            </a>
          </ul>
        </nav>
      </aside>

      {/* Main content area */}
      <main className="flex-1 p-8 overflow-y-auto max-h-screen mt-16 lg:mt-0">
  {children}
</main>


    </div>
  );
}

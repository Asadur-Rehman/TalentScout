import React from "react";
import CandidateButton from "./CandidateButton";
import TalentScout from "../../assets/Logo.svg";
import Star from "../../assets/Star 1.svg";

export default function CandidateLayout({ children }) {
  return (
    <div className="min-h-screen relative bg-white w-full shadow-lg">
      <header className="border-b w-full">
        <div className="h-16 flex items-center justify-between px-10">
          <div className="flex items-center gap-2">
            <img
              src={TalentScout}
              alt="TalentScout Logo"
              className="h-20 w-40"
            />
            
          </div>
          <CandidateButton href="/faqs">FAQs</CandidateButton>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">{children}</main>

      <div className="fixed bottom-0 left-0 pointer-events-none">
        <img src={Star} alt="" className="w-32 h-32" />
      </div>
    </div>
  );
}

import React, { useState } from "react";
import OpenedJob from "./OpenedJob";
import ClosedJob from "./ClosedJob";
import TalentScout from "../../assets/Group 5.svg";

const RecruiterHome = () => {
  const [activeTab, setActiveTab] = useState("opened");

  return (
    <div className="flex min-h-screen bg-[#F2FDFF]">
      <aside className="w-1/7 bg-white p-0">
        <img src={TalentScout} alt="TalentScout" className="w-56 h-28 mx-6" />
        <nav>
          <ul className="space-y-0">
            <li className="text-[#5E5E5E] py-3 px-6 font-bold">Dashboard</li>
            <li className="text-white bg-[#144066] py-3 px-6 font-bold">
              Jobs
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          {activeTab === "opened" && (
            <h2 className="text-xl font-bold">OPENED JOBS</h2>
          )}
          {activeTab === "closed" && (
            <h2 className="text-xl font-bold">CLOSED JOBS</h2>
          )}

          <button
            className="text-white px-4 py-2 rounded"
            style={{ backgroundColor: "#144066" }}
          >
            + Open a Job
          </button>
        </header>

        <div className="flex border-b mb-8">
          <button
            className={`px-6 py-2 ${
              activeTab === "opened"
                ? "border-b-2 border-black font-semibold"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("opened")}
          >
            Opened Jobs
          </button>
          <button
            className={`px-6 py-2 ${
              activeTab === "closed"
                ? "border-b-2 border-black font-semibold"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("closed")}
          >
            Closed Jobs
          </button>
        </div>

        {activeTab === "opened" && <OpenedJob />}
        {activeTab === "closed" && <ClosedJob />}
      </main>
    </div>
  );
};

export default RecruiterHome;

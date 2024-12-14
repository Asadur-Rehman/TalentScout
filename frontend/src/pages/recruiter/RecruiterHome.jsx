import React, { useState } from "react";
import OpenedJob from "./OpenedJob";
import ClosedJob from "./ClosedJob";
import TalentScout from "../../assets/Group 5.svg";

const RecruiterHome = () => {
  const [activeTab, setActiveTab] = useState("opened");

  return (
    <div className="flex h-screen">
      <aside className="w-1/7 bg-white p-0">
        <img src={TalentScout} alt="TalentScout" className="w-56 h-28 mx-6" />
        <nav>
          <ul className="space-y-0">
            <li className="text-gray-600 py-3 px-6">Dashboard</li>
            <li className="text-white bg-gray-600 py-3 px-6">Open a job</li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8" style={{ backgroundColor: "#DFE7EF" }}>
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold">OPEN A JOB</h2>
          <button
            className="text-white px-4 py-2 rounded"
            style={{ backgroundColor: "#838383" }}
          >
            + Open a Job
          </button>
        </header>

        <div className="flex border-b mb-8">
          <button
            className={`px-6 py-2 ${
              activeTab === "opened"
                ? "border-b-2 border-blue-600 font-semibold"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("opened")}
          >
            Opened Jobs
          </button>
          <button
            className={`px-6 py-2 ${
              activeTab === "closed"
                ? "border-b-2 border-blue-600 font-semibold"
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

import React, { useState } from "react";
import TalentScout from "../../assets/Group 5.svg";
import UploadTab from "./UploadTab";
import WriteYourselfTab from "./WriteYourselfTab";

const JobDescription = () => {
  const [uploadTab, setUploadTab] = useState("opened");

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
        </header>

        <section className="mb-8 border-b bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold">Job Description</h2>
        </section>

        <section className="mb-8 border-b bg-white p-6 rounded-xl shadow">
          <div className="flex border-b mb-8">
            <button
              className={`px-6 py-2 ${
                uploadTab === "closed"
                  ? "border-b-2 border-blue-600 font-semibold"
                  : "text-gray-600"
              }`}
              onClick={() => setUploadTab("closed")}
            >
              Write Yourself
            </button>
            <button
              className={`px-6 py-2 ${
                uploadTab === "opened"
                  ? "border-b-2 border-blue-600 font-semibold"
                  : "text-gray-600"
              }`}
              onClick={() => setUploadTab("opened")}
            >
              Upload a PDF
            </button>
          </div>

          {uploadTab === "opened" && <UploadTab />}
          {uploadTab === "closed" && <WriteYourselfTab />}
        </section>
      </main>
    </div>

    // <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    //   <div className="w-full max-w-4xl bg-white shadow-md rounded-md p-8">
    //     <div className="flex items-center justify-between mb-6">
    //       <h1 className="text-xl font-semibold text-gray-800">OPEN A JOB</h1>
    //       <p className="text-gray-500">2/2</p>
    //     </div>
    //     <h2 className="text-lg font-medium text-gray-700 mb-4">JOB DESCRIPTION</h2>

    //     <div className="flex items-center gap-4 mb-6">
    //       <button className="py-2 px-4 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition">
    //         Write Yourself
    //       </button>
    //       <button className="py-2 px-4 bg-gray-100 text-gray-700 rounded-md shadow hover:bg-gray-200 transition">
    //         Upload a PDF
    //       </button>
    //     </div>

    //     <p className="text-gray-500 mb-4">
    //       Write the job description or let our AI write it for you!
    //     </p>

    //     <div className="border rounded-md p-4 bg-gray-50">
    //       <div className="flex items-center gap-2 mb-4">
    //         <span className="text-blue-500 text-lg">\u2728</span>
    //         <span className="text-blue-500 font-medium">Generate with AI</span>
    //       </div>
    //       <textarea
    //         className="w-full h-32 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
    //         placeholder="Write Job description"
    //       ></textarea>
    //     </div>

    //     <div className="flex justify-end mt-6">
    //       <button className="py-2 px-6 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition">
    //         Generate
    //       </button>
    //       <button className="ml-4 py-2 px-6 bg-gray-200 text-gray-700 rounded-md shadow hover:bg-gray-300 transition">
    //         Next
    //       </button>
    //     </div>
    //   </div>
    // </div>
  );
};

export default JobDescription;

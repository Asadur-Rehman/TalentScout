import React from "react";
import { CiMail, CiLocationOn } from "react-icons/ci";

export default function CandidateReport() {
  const candidateData = {
    name: "Raghupathi Sahiti",
    overallScore: "83%",
    technicalSkills: "68%",
    communication: "60%",
    jobRole: "React Developer",
    interviewLevel: "Medium",
    assessmentName: "AI-based Interview",
    mcqScore: "72%",
    hrInterviewScore: "63%",
    techInterviewScore: "75%",
    questions: {
      reasoning: "7/10",
      verbal: "9/10",
      aptitude: "8/10",
      technical: "8/10",
    },
  };

  return (
    <div className="p-5">
      <div className="p-4 bg-white rounded-md shadow-sm flex flex-row items-center justify-between h-auto">
        <div className="flex flex-row items-center space-x-16">
          {/* Candidate Image */}
          <div className="w-24 h-24 bg-black rounded-full"></div>

          {/* Candidate Details */}
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              Asad ur Rehman
            </h1>
            <h2 className="text-sm text-gray-500 p-1">Nov 29, 2024</h2>

            {/* Location and Email */}
            <div className="flex flex-row space-x-16 mt-2">
              <div className="flex items-center space-x-2">
                <CiLocationOn className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-500">Karachi</span>
              </div>

              <div className="flex items-center space-x-2">
                <CiMail className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-500">asad@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end space-y-4">
          <div className="flex space-x-4">
            <button className="px-12 py-3 text-base font-semibold text-white bg-gray-600 rounded-lg hover:bg-gray-600 ">
              Shortlisted
            </button>
            <button className="px-12 py-3 text-base font-semibold text-white bg-gray-400 rounded-lg hover:bg-gray-600 ">
              Hire Candidate
            </button>
          </div>
        </div>
      </div>

      <div></div>
    </div>
  );
}

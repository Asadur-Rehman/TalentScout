import React, { useState } from "react";
import CandidateLayout from "./CandidateLayout";
import CandidateButton from "./CandidateButton";
import { useNavigate } from "react-router-dom";
import CodeEditor from "./CodeEditor";

export default function CandidateInterview() {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const navigate = useNavigate();

  const questions = JSON.parse(localStorage.getItem("questions")) || [];

  // Since there's only one coding question, we can directly access it
  const lastQuestion = questions[questions.length - 1];

  const handleSubmit = () => {
    navigate("/candidate/interview-completion");
  };

  return (
    <CandidateLayout>
      <div className="max-w-full mx-auto px-4">
        {/* Question Content */}
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Coding Question</h1>
            <div className="relative">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#05B4B4] focus:border-transparent"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="csharp">C#</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex flex-row w-full gap-4 ">
            <div className="w-2/5 bg-[#F2FDFF] p-6 rounded-lg shadow-md">
              <p className="text-gray-700 text-lg leading-relaxed">
                {lastQuestion}
              </p>
            </div>
            <div className="w-3/5 flex items-center justify-center">
              <div className="w-full h-[400px] bg-white rounded-lg shadow-lg overflow-hidden">
                <CodeEditor language={selectedLanguage} />
              </div>
            </div>
          </div>

          {/* Submit Button and Note */}
          <div className="mt-8 space-y-4">
            <div className="flex justify-center">
              <CandidateButton onClick={handleSubmit}>Submit</CandidateButton>
            </div>

            <p className="text-center text-sm text-gray-500">
              Note: Do not refresh the page or you'll lose your data
            </p>
          </div>
        </div>

        {/* Video Preview (if needed) */}
        <div className="fixed bottom-4 right-4 w-50 h-30 bg-white rounded-lg overflow-hidden">
          {/* Optional video preview component */}
        </div>
      </div>
    </CandidateLayout>
  );
}

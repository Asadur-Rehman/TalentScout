import React, { useState } from "react";
import CandidateLayout from "./CandidateLayout";
import CandidateButton from "./CandidateButton";
import { useNavigate } from "react-router-dom";
import CodeEditor from "./CodeEditor";
import axios from "axios";

export default function CandidateInterview() {
  const [code, setCode] = useState("// Write your code here\n");

  const answers = location.state?.answers || [];

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const navigate = useNavigate();

  const questions = JSON.parse(localStorage.getItem("questions")) || [];

  // Since there's only one coding question, we can directly access it
  const lastQuestion = questions[questions.length - 1];

  // inside handleSubmit
  const handleSubmit = () => {
    navigate("/candidate/interview-completion");

    processEvaluation();
  };

  const processEvaluation = async () => {
    const llama = import.meta.env.VITE_LLAMA;

    const updatedAnswers = [...answers, code];

    console.log("Final Answers:", updatedAnswers);

    const prompt = `
  Based on the following interview questions and the candidate’s responses, generate a **detailed evaluation report**. First, evaluate each question individually and then compute the final score.
  
  ---
  
  ### **1. Detailed Breakdown & Candidate Evaluation**
  
  #### **A. Scoring Breakdown**
  - Show the score assigned to each question.
  - Weightage:
    - **Q1–Q7 (General & Technical):** 10 points each = 70 total
    - **Q8 (Coding Question):** 30 points
  
  #### **B. Question-Wise Performance Analysis**
  For each question, include:
  - **Question Asked**
  - **Candidate’s Response**
  - **Evaluation** (based on clarity, depth, accuracy, and job relevance)
  - **Score Given (out of applicable points)**
  
  #### **C. Soft Skills & Communication Rating (Out of 10)**
  Evaluate the candidate’s:
  - Communication clarity  
  - Confidence  
  - Problem-solving approach  
  - Overall professionalism
  
  #### **D. Overall Performance Summary**
  Highlight:
  - **Strengths**
  - **Areas for Improvement** (with specific, actionable feedback)
  
  #### **E. Final Recommendation**
  Clearly state:
  - **Shortlisted / Not Shortlisted**
  - Suggested next steps (e.g., technical round, HR interview, or rejection with reasoning)
  
  ---
  
  ### **Weightage Recap**
  - Q1–Q7: 70 points  
  - Q8 (Coding): 30 points  
  - **Total: 100**
  
  ---
  
  ### **Candidate’s Responses:**
  ${JSON.stringify(updatedAnswers, null, 2)}
  
  ---
  
  Place the **final total score** (out of 100) **on the last line of your response**.  
  ⚠️ **Do not add any label or text — just the number.**
  `;

    try {
      const response = await axios.post(
        "/llama38b/v1/chat/completions",
        {
          model: llama,
          messages: [{ role: "user", content: prompt }],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const responseContent = response.data.choices[0].message.content;
      const lines = responseContent.trim().split("\n").filter(Boolean);
      const scoreStr = lines[lines.length - 1].trim();
      const score = parseInt(scoreStr);
      const evaluationReport = lines.slice(0, -1).join("\n").trim();

      const validCandidate = JSON.parse(localStorage.getItem("validCandidate"));
      const candidateId = validCandidate._id;

      if (!isNaN(score)) {
        await fetch(`/api/candidate/update/${candidateId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            evaluationScore: score,
            evaluationReport: evaluationReport,
          }),
        });
      }
    } catch (error) {
      console.error("Error in background evaluation:", error);
    }
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
                <CodeEditor
                  language={selectedLanguage}
                  code={code}
                  setCode={setCode}
                />
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

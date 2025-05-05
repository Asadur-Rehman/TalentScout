import React, { useState } from "react";
import CandidateLayout from "./CandidateLayout";
import CandidateButton from "./CandidateButton";
import { useNavigate } from "react-router-dom";
import CodeEditor from "./CodeEditor";
import axios from "axios";

export default function CandidateInterview() {
  const [code, setCode] = useState("// Write your code here\n");

  const answers = JSON.parse(localStorage.getItem("answers") || "[]");
  console.log("Answers:", answers);

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

    const updatedAnswers = [...answers, { [lastQuestion]: code }];

    console.log("Final Answers:", updatedAnswers);

    console.log("Questions:", questions);

    const prompt = `
You are given an array of 8 interview questions and their corresponding candidate answers. Generate a strict 33-line evaluation report in the exact following format:

For each question (Q1 to Q8), write:
1. The **question** itself (Lines 1, 5, 9, ... up to 29)
2. The **candidate's answer** (Lines 2, 6, 10, ... up to 30)
   - If the answer is empty, write: "Not answered by the candidate"
   - For Q8 (coding question), the answer MUST be returned in **serialized multiline format**: the entire code should be a **single-line string** with real line breaks replaced by '\\n' (backslash-n). Do not use actual line breaks in the output.
3. An **evaluation summary** (Lines 3, 7, 11, ... up to 31)
4. A **score only** (Lines 4, 8, 12, ... up to 32)
   - For Q1–Q7, score out of **10**
   - For Q8, score out of **30**

On **line 33**, write only the **total score** (sum of all 8 scores).

⚠️ Absolutely NO labels, extra lines, markdown, explanations, indentation, or formatting. Output must be strictly 33 plain-text lines, exactly as described.

---

Questions:
${JSON.stringify(questions, null, 2)}

Answers:
${JSON.stringify(updatedAnswers, null, 2)}
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

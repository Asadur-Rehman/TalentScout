import React, { useState, useEffect } from "react";
import CandidateLayout from "./CandidateLayout";
import CandidateButton from "./CandidateButton";
import SmallVideoPlaceholder from "../../assets/SmallVideoPlaceholder.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CandidateInterview() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-US";

  const questions = JSON.parse(localStorage.getItem("questions")) || [];
  questions.pop();
  // const interviewId = JSON.parse(localStorage.getItem("interviewId")) || [];

  const startRecording = async () => {
    try {
      setIsRecording(true);
      setLoading(true);

      const questionToSend = [questions[currentQuestion]]; // Send as an array

      const response = await axios.post("http://localhost:8000/interview/", {
        questions: questionToSend, // Now sending as an array
      });

      // const recordedAnswer = response.data.answers[questions[currentQuestion]]; // Extract answer
      // // console.log("Recorded Answer:", response.data.answers[questions[currentQuestion]]);
      // console.log("Recorded Answer:", recordedAnswer);
      const recordedAnswer = response.data.answers;

      setAnswers((prevAnswers) => {
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[currentQuestion] = recordedAnswer;
        console.log(updatedAnswers);
        return updatedAnswers;
      });
      console.log("Answers:", answers);

      setIsRecording(false);
      setLoading(false);
    } catch (error) {
      console.error("Error recording answer:", error);
      setError("Recording failed. Please try again.");
      setIsRecording(false);
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    // Navigate immediately
    navigate("/candidate/coding-interview", {
      state: { answers },
    });

    // Continue with AI evaluation in the background
    // processEvaluation();
  };

  const processEvaluation = async () => {
    const llama = import.meta.env.VITE_LLAMA;

    console.log("Final Answers:", answers);

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
${JSON.stringify(answers, null, 2)}

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
      const [scoreStr, ...reportLines] = responseContent.split("\n");
      const score = parseInt(scoreStr);
      const evaluationReport = reportLines.join("\n").trim();

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
      // Consider storing the error in localStorage or another state management solution
      // so it can be displayed on the next page if needed
    }
  };

  return (
    <CandidateLayout>
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-12 w-2/3 mx-auto">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900"
            disabled={currentQuestion === 0}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>

          <div className="flex-1 mx-4">
            <div className="flex gap-2">
              {[...Array(questions.length)].map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded-full ${
                    index <= currentQuestion ? "bg-[#05B4B4]" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="text-gray-600">
            ({String(currentQuestion + 1).padStart(2, "0")}/
            {String(questions.length).padStart(2, "0")})
          </div>
        </div>

        <div className="space-y-8 w-2/4 mx-auto">
          <h1 className="text-3xl font-bold text-center">
            Demo Audio Question
          </h1>
          <p className="text-center max-w-3xl mx-auto">
            {questions[currentQuestion]}
          </p>

          <div className="bg-gray-50 rounded-lg p-12 flex items-center justify-center">
            <button
              onClick={startRecording}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                isRecording ? "bg-red-500" : "bg-[#05B4B4]"
              }`}
              disabled={loading}
            >
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 15c1.66 0 3-1.34 3-3V6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .56-.44 1-1 1s-1-.44-1-1V6z" />
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>
            </button>
          </div>

          <button
            onClick={handleNext}
            className="mt-4 w-full py-2 px-4 bg-[#05B4B4] text-white font-bold rounded-lg disabled:opacity-50"
            disabled={loading}
          >
            {currentQuestion < questions.length - 1 ? "Next" : "Submit"}
          </button>
        </div>
      </div>
    </CandidateLayout>
  );
}

// import React, { useState } from "react";
// import CandidateLayout from "./CandidateLayout";
// import CandidateButton from "./CandidateButton";
// import SmallVideoPlaceholder from "../../assets/SmallVideoPlaceholder.svg";
// import InterviewPlaceholder from "../../assets/InterviewPlaceholder.svg";
// import { useNavigate } from "react-router-dom";

// export default function CandidateInterview() {
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [isRecording, setIsRecording] = useState(false);
//   const navigate = useNavigate();

//   const questions = [
//     "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ?",
//     "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat?",
//     "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur?",
//     "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum?",
//   ];

//   const handleBack = () => {
//     if (currentQuestion > 0) {
//       setCurrentQuestion(currentQuestion - 1);
//     }
//   };

//   const handleNext = () => {
//     if (currentQuestion < questions.length - 1) {
//       setCurrentQuestion(currentQuestion + 1);
//     }
//   };

//   const handleSubmit = () => {
//     navigate("/candidate/coding-interview");
//   };

//   return (
//     <CandidateLayout>
//       <div className="max-w-4xl mx-auto px-4">
//         {/* Back Button, Progress Bar, and Question Count */}
//         <div className="flex items-center justify-between mb-12">
//           <button
//             onClick={handleBack}
//             className="flex items-center text-gray-600 hover:text-gray-900"
//           >
//             <svg
//               className="w-5 h-5 mr-2"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M15 19l-7-7 7-7"
//               />
//             </svg>
//             Back
//           </button>

//           <div className="flex-1 mx-4">
//             {/* Progress Bar */}
//             <div className="flex gap-2">
//               {[...Array(4)].map((_, index) => (
//                 <div
//                   key={index}
//                   className={`h-1 flex-1 rounded-full ${
//                     index <= currentQuestion ? "bg-[#05B4B4]" : "bg-gray-200"
//                   }`}
//                 />
//               ))}
//             </div>
//           </div>

//           <div className="text-gray-600">
//             ({String(currentQuestion + 1).padStart(2, "0")}/04)
//           </div>
//         </div>

//         {/* Question Content */}
//         <div className="space-y-8">
//           <h1 className="text-3xl font-bold text-center">Video Question</h1>

//           <div className="flex flex-row w-full gap-4 px-6">
//             <div className="w-2/5 bg-[#F2FDFF] p-6 rounded-lg shadow-md">
//               <p className="text-gray-700 text-lg leading-relaxed">
//                 Hi Asad! Can you tell me about React Hooks, their use, with
//                 examples
//               </p>
//             </div>
//             <div className="w-3/5 flex items-center justify-center">
//               <img
//                 src={InterviewPlaceholder}
//                 alt="Video Question Image"
//                 className="rounded-lg shadow-lg max-w-full h-auto"
//               />
//             </div>
//           </div>

//           {/* Submit Button and Note */}
//           <div className="mt-8 space-y-4">
//             <div className="flex justify-center">
//               <CandidateButton
//                 onClick={
//                   currentQuestion === questions.length - 1
//                     ? handleSubmit
//                     : handleNext
//                 }
//               >
//                 {currentQuestion === questions.length - 1
//                   ? "Submit"
//                   : "Submit & Continue"}
//               </CandidateButton>
//             </div>

//             <p className="text-center text-sm text-gray-500">
//               Note: Do not refresh the page or you'll lose your data
//             </p>
//           </div>
//         </div>

//         {/* Video Preview */}
//         <div className="fixed bottom-4 right-4 w-50 h-30 bg-white rounded-lg overflow-hidden">
//           <img
//             src={SmallVideoPlaceholder}
//             alt=""
//             className="w-full h-full object-cover"
//           />
//           {/* Status Indicators */}
//           {/* <div className="absolute bottom-2 right-2 flex gap-2">
//             <div className="w-4 h-4 bg-[#05B4B4] rounded-full" />
//             <div className="w-4 h-4 bg-[#05B4B4] rounded-full" />
//           </div> */}
//         </div>
//       </div>
//     </CandidateLayout>
//   );
// }

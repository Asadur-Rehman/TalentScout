import React, { useState, useEffect, useRef } from "react";
import CandidateLayout from "./CandidateLayout";
import CandidateButton from "./CandidateButton";
import SmallVideoPlaceholder from "../../assets/SmallVideoPlaceholder.svg";
import avatar from "../../assets/avatar.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CandidateInterview() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [audioContext, setAudioContext] = useState(null);
  const [audioAnalyser, setAudioAnalyser] = useState(null);
  const [micStream, setMicStream] = useState(null);

  const canvasRef = useRef(null);
  const animationRef = useRef(null);

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

  useEffect(() => {
    return () => {
      stopVisualization();
      if (micStream) {
        micStream.getTracks().forEach((track) => track.stop());
      }
      if (audioContext) {
        audioContext.close();
      }
    };
  }, []);

  // Start audio visualization
  const startVisualization = (analyser) => {
    if (!canvasRef.current || !analyser) return;

    // Cancel any existing animation frame first
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas dimensions
    canvas.width = canvas.clientWidth || 300;
    canvas.height = canvas.clientHeight || 100;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // Create a waveform visualization
    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      // Get waveform data
      analyser.getByteTimeDomainData(dataArray);

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw waveform
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        // Scale the waveform to make it more visible
        const v = ((dataArray[i] - 128) * 1.5) / 128.0 + 1;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      // Style the waveform
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#05B4B4";
      ctx.stroke();

      // Draw a horizontal center line
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.strokeStyle = "rgba(150, 150, 150, 0.2)";
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    // Start drawing loop
    draw();
  };

  // Stop visualization
  const stopVisualization = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    // Clear canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  // Play question using TTS API
  const playQuestion = async () => {
    try {
      setIsPlaying(true);

      await axios.post("http://localhost:8000/generate-tts/", {
        text: questions[currentQuestion],
      });

      setIsPlaying(false);
    } catch (error) {
      console.error("Error playing question:", error);
      setIsPlaying(false);
    }
  };

  const startRecording = async () => {
    try {
      setIsListening(true);
      setIsRecording(true);

      // Set up microphone stream
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000,
        },
      });
      setMicStream(stream);

      // Set up audio context for microphone visualization
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.6;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      setAudioContext(ctx);
      setAudioAnalyser(analyser);

      // Start visualization for microphone input
      startVisualization(analyser);

      const questionToSend = [questions[currentQuestion]]; // Send as an array

      const response = await axios.post("http://localhost:8000/interview/", {
        questions: questionToSend, // Now sending as an array
      });

      const recordedAnswer = response.data.answers;

      setAnswers((prevAnswers) => {
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[currentQuestion] = recordedAnswer;
        console.log(updatedAnswers);
        return updatedAnswers;
      });
      console.log("Answers:", answers);

      // Stop the visualization and microphone stream
      stopVisualization();
      if (micStream) {
        micStream.getTracks().forEach((track) => track.stop());
      }

      setIsListening(false);
      setIsRecording(false);
      setLoading(false);
    } catch (error) {
      console.error("Error recording answer:", error);
      setError("Recording failed. Please try again.");

      // Stop the visualization and microphone stream on error
      stopVisualization();
      if (micStream) {
        micStream.getTracks().forEach((track) => track.stop());
      }

      setIsListening(false);
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
    // Store answers in localStorage
    localStorage.setItem("answers", JSON.stringify(answers));

    // Navigate to the next page
    navigate("/candidate/coding-interview");

    // Optionally process evaluation
    // processEvaluation();
  };

  const processEvaluation = async () => {
    const llama = import.meta.env.VITE_LLAMA;

    console.log("Final Answers:", answers);

    const prompt = `
Based on the following interview questions and the candidate's responses, generate a **detailed evaluation report**. First, evaluate each question individually and then compute the final score.

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
- **Candidate's Response**
- **Evaluation** (based on clarity, depth, accuracy, and job relevance)
- **Score Given (out of applicable points)**

#### **C. Soft Skills & Communication Rating (Out of 10)**
Evaluate the candidate's:
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

### **Candidate's Responses:**
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

          <button
            onClick={handleNext}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            Next
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-8 align-center justify-center flex flex-col w-2/4 mx-auto">
          <h1 className="text-3xl font-bold text-center">Audio Question</h1>
          <p className="text-center max-w-3xl mx-auto">
            {questions[currentQuestion]}
          </p>

          <div className="bg-white rounded-lg p-12 flex flex-col items-center justify-center gap-4">
            <button
              onClick={isRecording ? null : playQuestion}
              className={`rounded-full flex items-center justify-center transition-all duration-300 ${
                isPlaying || isRecording ? "scale-110" : ""
              }`}
              disabled={isPlaying || isRecording || loading}
            >
              <div className="relative">
                {isPlaying && (
                  <>
                    <div className="absolute inset-0 -m-6 rounded-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 opacity-75 animate-pulse-ring"></div>
                    <div className="absolute inset-0 -m-8 rounded-full bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 opacity-50 animate-pulse-ring animation-delay-300"></div>
                    <div className="absolute inset-0 -m-16 rounded-full bg-gradient-to-r from-blue-700 via-yellow-500 to-blue-700 opacity-30 animate-pulse-ring animation-delay-700"></div>
                  </>
                )}
                <img
                  src={avatar}
                  alt="Avatar"
                  className="w-20 h-20 object-contain relative z-10"
                />
              </div>
            </button>

            {isListening && (
              <>
                <p className="text-red-500 font-medium">Listening...</p>
                <canvas ref={canvasRef} className="w-full h-10 mt-2" />
              </>
            )}
          </div>

          <button
            onClick={
              isListening ? null : isRecording ? handleNext : startRecording
            }
            className="mt-4 w-full py-2 px-4 bg-[#05B4B4] text-white font-bold rounded-lg disabled:opacity-50"
            disabled={isPlaying || loading}
          >
            {isListening
              ? "Listening..."
              : isRecording
              ? "Next"
              : "Submit Answer"}
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

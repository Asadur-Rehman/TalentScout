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

  const questions = [
    "Tell me about yourself and your background.",
    "What are your greatest strengths?",
    "Where do you see yourself in 5 years?",
  ];

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-US";

  // const questions = JSON.parse(localStorage.getItem("questions")) || [];

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

  const handleSubmit = async () => {
    console.log("Final Answers:", answers);

    //     const prompt = `
    // Based on the following interview questions and the candidate's responses, generate:

    // 1. **Overall Score (out of 100)** – Calculate the candidate’s total evaluation score based on a weighted scoring system:
    //    - **General Questions (Q1 - Q4): 40% weightage (10% each)**
    //    - **Technical Questions (Q5 - Q7): 60% weightage (20% each)**
    //    - If a question is not answered, assign **0 marks** for that question.
    //    - Your response should start with **just one number** (the total score).

    // 2. **Detailed Breakdown & Report**, including:
    //    - **Scoring Breakdown:** Show the marks assigned to each question based on the weightage.
    //    - **Question-wise Performance Analysis:**
    //      - **Question Asked**
    //      - **Candidate’s Response**
    //      - **Evaluation** (Assess clarity, depth, correctness, and job relevance).
    //      - **Score Given (out of allocated weightage points)**
    //    - **Soft Skills & Communication Rating:** (Confidence, clarity, problem-solving skills).
    //    - **Overall Performance Summary:** Key strengths, weaknesses, and improvement areas.
    //    - **Final Recommendation:** (Shortlisted / Not Shortlisted + Next Steps).

    // **Weightage Distribution:**
    // - **General Questions (Q1 - Q4):** 10 points each (Total: 40)
    // - **Technical Questions (Q5 - Q7):** 20 points each (Total: 60)
    // - **Final Score: Out of 100**

    // **Questions and Answers:**
    // ${JSON.stringify(answers, null, 2)}

    // Ensure the response is structured, professional, and easy to read.
    // `;

    //     console.log(prompt);

    //     // ... existing code ...
    //     try {
    //       const response = await axios.post(
    //         "llama38b/v1/chat/completions",
    //         {
    //           model: llama,
    //           messages: [{ role: "user", content: prompt }],
    //         },
    //         {
    //           headers: {
    //             Authorization: `Bearer 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`,
    //             "Content-Type": "application/json",
    //           },
    //         }
    //       );

    // const responseContent = response.data.choices[0].message.content;
    // Extract score (assuming it's the first line) and report content
    // const [scoreStr, ...reportLines] = responseContent.split("\n");
    // const score = parseInt(scoreStr);
    // const evaluationReport = reportLines.join("\n").trim();

    // console.log("Score:", score);
    // console.log("Report:", evaluationReport);

    // const validCandidate = JSON.parse(localStorage.getItem("validCandidate"));
    // const candidateId = validCandidate._id;

    // if (!isNaN(score)) {
    //   const response = await fetch(`/api/candidate/update/${candidateId}`, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       evaluationScore: score,
    //       evaluationReport: evaluationReport,
    //     }),
    //   });

    //   if (!response.ok) throw new Error("Failed to evaluate candidate");
    // }
    // } catch (error) {
    //   console.error("Error generating interview questions:", error);
    // }
    // ... existing code ...

    navigate("/candidate/video-instructions");
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

        <div className="space-y-8 align-center justify-center flex flex-col w-2/4 mx-auto">
          <h1 className="text-3xl font-bold text-center">
            Demo Audio Question
          </h1>
          <p className="text-center max-w-3xl mx-auto">
            {questions[currentQuestion]}
          </p>

          <div className="bg-gray-50 rounded-lg p-12 flex items-center justify-center ">
            <button
              onClick={startRecording}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors  ${
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
            className="mt-4 w-full py-2 px-4 bg-[#05B4B4] text-white font-bold rounded-lg disabled:opacity-50 text-center"
            disabled={loading}
          >
            {currentQuestion < questions.length - 1 ? "Next" : "Submit"}
          </button>
        </div>
      </div>
    </CandidateLayout>
  );
}

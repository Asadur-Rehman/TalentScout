import React, { useState, useEffect, useRef } from "react";
import CandidateLayout from "./CandidateLayout";
import CandidateButton from "./CandidateButton";
import SmallVideoPlaceholder from "../../assets/SmallVideoPlaceholder.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import avatar from "../../assets/avatar.png";
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

  const questions = [
    "Tell me about yourself and your background.",
    "What are your greatest strengths?",
    "Where do you see yourself in 5 years?",
  ];

  // Clean up visualization resources on unmount
  useEffect(() => {
    return () => {
      stopVisualization();
      if (micStream) {
        micStream.getTracks().forEach(track => track.stop());
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
    const ctx = canvas.getContext('2d');
    
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
        const v = (dataArray[i] - 128) * 1.5 / 128.0 + 1;
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
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  // Play question using TTS API
  const playQuestion = async () => {
    try {
      setIsPlaying(true);
      
      await axios.post("http://localhost:8000/generate-tts/", {
        text: questions[currentQuestion]
      });
      
      setIsPlaying(false);
    } catch (error) {
      console.error("Error playing question:", error);
      setIsPlaying(false);
    }
  };

  // Record answer using STT API
  const recordAnswer = async () => {
    try {
      setIsListening(true);
      setIsRecording(true);
      
      // Set up microphone stream
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000
        } 
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
      
      const response = await axios.post("http://localhost:8000/generate-stt/");
      const transcription = response.data.text;
      
      setAnswers((prevAnswers) => {
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[currentQuestion] = transcription;
        return updatedAnswers;
      });
      
      // Stop the visualization and microphone stream
      stopVisualization();
      if (micStream) {
        micStream.getTracks().forEach(track => track.stop());
      }
      
      setIsListening(false);
      setIsRecording(false);
    } catch (error) {
      console.error("Error recording answer:", error);
      setError("Recording failed. Please try again.");
      
      // Stop the visualization and microphone stream on error
      stopVisualization();
      if (micStream) {
        micStream.getTracks().forEach(track => track.stop());
      }
      
      setIsListening(false);
      setIsRecording(false);
    }
  };

  const handleBack = () => {
    if (currentQuestion === 0) {
      // Navigate to previous page when on first question
      navigate(-1);
    } else {
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
    navigate("/candidate/video-instructions");
  };

  return (
    <CandidateLayout>
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-12 w-2/3 mx-auto">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900"
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
          <h1 className="text-3xl font-bold text-center">
            Demo Audio Question
          </h1>
          <p className="text-center max-w-3xl mx-auto">
            {questions[currentQuestion]}
          </p>

          <div className="bg-white rounded-lg p-12 flex flex-col items-center justify-center gap-4">
            <button
              onClick={isRecording ? null : playQuestion}
              className={`rounded-full flex items-center justify-center transition-all duration-300 ${
                (isPlaying || isRecording) ? "scale-110" : ""
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
                <canvas 
                  ref={canvasRef} 
                  className="w-full h-10 mt-2"
                />
              </>
            )}
          </div>

          <button
            onClick={isListening ? null : (isRecording ? handleNext : recordAnswer)}
            className="mt-4 w-full py-2 px-4 bg-[#05B4B4] text-white font-bold disabled:opacity-50 text-center"
            disabled={isPlaying || loading}
          >
            {isListening ? "Listening..." : 
              (isRecording ? "Next" : 
                "Submit Answer" )}
          </button>
        </div>
      </div>
    </CandidateLayout>
  );
}

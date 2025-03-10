import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CandidateLayout from "./CandidateLayout";
import CandidateButton from "./CandidateButton";
import axios from "axios";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../../redux/candidate/candidateSlice";

export default function CandidateSignin() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    interviewId: "",
  });

  const { loading, error } = useSelector((state) => state.candidate);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [resume, setResume] = useState(null);
  const [questions, setQuestions] = useState([]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // ... existing code ...

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());

    try {
      const res = await fetch("/api/auth/candidatelogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }

      localStorage.setItem(
        "validCandidate",
        JSON.stringify(data.validCandidate)
      );

      dispatch(signInSuccess(data));

      // Navigate immediately after basic auth
      navigate("/candidate/instructions");

      // Continue with background tasks after navigation
      fetchJobDetails(data.validCandidate.jobRef).then(() => {
        fetchCandidate(data.validCandidate._id);
      });
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  const fetchJobDetails = async (jobId) => {
    try {
      const { data } = await axios.get(`/api/job/get/${jobId}`);
      setJob(data);
      localStorage.setItem("job", JSON.stringify(data));
      return data; // Return data for chaining
    } catch (err) {
      console.error("Error fetching job details:", err.message);
    }
  };

  const fetchCandidate = async (candidateId) => {
    try {
      const { data } = await axios.get(
        `/api/interview/get/${formData.interviewId}`
      );
      setResume(data.resumeText);
      localStorage.setItem("resume", data.resumeText);

      // Check if candidate already has questions
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        localStorage.setItem("questions", JSON.stringify(data.questions));
      } else {
        // Generate questions in background
        generateQuestions(data._id);
      }
    } catch (err) {
      console.error("Error fetching candidate details:", err.message);
    }
  };

  // ... rest of the code remains the same ...

  const generateQuestions = async (candidateId) => {
    if (!job || !resume) return;

    const prompt = `
    Generate 7 interview questions based on this job description and candidate resume. The questions should be a mix of technical and behavioral questions relevant to the role. Format your response as plain questions only, one per line, with no numbering, labels, or additional text.

    Context for generating questions:
    Job Details: ${JSON.stringify(job, null, 2)}
    Resume: ${resume}
  `;

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o",
          messages: [{ role: "user", content: prompt }],
        },
        {
          headers: {
            Authorization: `Bearer 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`,
            "Content-Type": "application/json",
          },
        }
      );

      const generatedQuestions = response.data.choices[0].message.content
        .split("\n")
        .filter((q) => q.trim())
        .map((q) => q.replace(/^\d+\.\s*/, ""));

      // Save questions to candidate in database
      await axios.post(`/api/interview/update/${formData.interviewId}`, {
        questions: generatedQuestions,
      });

      setQuestions(generatedQuestions);
      localStorage.setItem("questions", JSON.stringify(generatedQuestions));
    } catch (error) {
      console.error("Error generating interview questions:", error);
    }
  };

  // Remove or modify this useEffect since we're now handling question generation in fetchCandidate
  useEffect(() => {
    const storedJob = localStorage.getItem("job");
    const storedResume = localStorage.getItem("resume");

    if (storedJob) setJob(JSON.parse(storedJob));
    if (storedResume) setResume(storedResume);
  }, []);

  // ... existing code ...

  // const fetchCandidate = async (candidateId) => {
  //   try {
  //     const { data } = await axios.get(`/api/candidate/get/${candidateId}`);
  //     setResume(data.resumeText);
  //     localStorage.setItem("resume", data.resumeText); // Store resume in localStorage
  //   } catch (err) {
  //     console.error("Error fetching candidate details:", err.message);
  //   }
  // };

  // // On page load, retrieve data if available
  // useEffect(() => {
  //   const storedJob = localStorage.getItem("job");
  //   const storedResume = localStorage.getItem("resume");

  //   if (storedJob) setJob(JSON.parse(storedJob));
  //   if (storedResume) setResume(storedResume);
  // }, []);

  // const generateQuestions = async () => {
  //   if (!job || !resume) return;

  //   const prompt = `
  //     Based on the following job description and candidate resume, generate Seven total interview questions out of which four should be general-purpose and three should be technical interview questions:
  //     **Job Details:** ${JSON.stringify(job, null, 2)}
  //     **Candidate Resume:** ${resume}
  //     The questions should be relevant to the role and assess the candidate's skills, experience, and problem-solving ability. You can use resume and ask about things mentioned in resume and also use job description to make questions as relevant as possible.
  //     Provide only the seven questions.
  //   `;

  //   try {
  //     const response = await axios.post(
  //       "https://api.openai.com/v1/chat/completions",
  //       {
  //         model: "gpt-4o",
  //         messages: [{ role: "user", content: prompt }],
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer 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`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     const generatedQuestions = response.data.choices[0].message.content
  //       .split("\n")
  //       .filter((q) => q.trim());

  //     setQuestions(generatedQuestions);
  //     localStorage.setItem("questions", JSON.stringify(generatedQuestions)); // Store immediately
  //   } catch (error) {
  //     console.error("Error generating interview questions:", error);
  //   }
  // };

  // useEffect(() => {
  //   if (job && resume) {
  //     generateQuestions();
  //   }
  // }, [job, resume]);

  return (
    <CandidateLayout>
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">AI-powered assessment</h1>
          <p className="text-gray-600">
            Please check your email for interview details
          </p>
        </div>

        <div className="bg-white shadow-sm rounded-lg border border-gray-200 mt-8 w-2/3 mx-auto">
          <div className="p-6">
            <h2 className="text-lg text-center font-semibold mb-6">
              Interview credentials
            </h2>
            {error && (
              <p className="text-red-500 text-xs sm:text-sm mb-3 text-center">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium">
                  Your Name
                </label>
                <input
                  id="name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#05B4B4]"
                  placeholder="Asad ur Rehman"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#05B4B4]"
                  placeholder="asad@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="interviewId"
                  className="block text-sm font-medium"
                >
                  Interview ID
                </label>
                <input
                  id="interviewId"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#05B4B4]"
                  placeholder="Interview ID"
                  value={formData.interviewId}
                  onChange={handleChange}
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <CandidateButton variant="secondary" type="button">
                  Back
                </CandidateButton>
                <CandidateButton type="submit" disabled={loading}>
                  {loading ? "Verifying..." : "Next"}
                </CandidateButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </CandidateLayout>
  );
}

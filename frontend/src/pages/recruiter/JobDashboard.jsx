import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TalentScout from "../../assets/Group 5.svg";
import ProfileModal from "./ProfileModal";
import Layout from "./RecruiterLayout";
import { FiMoreVertical } from "react-icons/fi";
import jsPDF from "jspdf";
import { ShareModal } from "./ShareModal";
import EvaluationDisplay from "./TechnicalReport";
import axios from "axios";

const JobDashboard = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [shortlistedCandidates, setShortlistedCandidates] = useState([]);
  const [hiredCandidates, setHiredCandidates] = useState([]);
  const [activeTab, setActiveTab] = useState("applicants");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [candidateFeedback, setCandidateFeedback] = useState("");
  const llama = import.meta.env.VITE_LLAMA;

  useEffect(() => {
    console.log("Fetching job and candidates for job ID:", id);

    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`/api/job/get/${id}`);
        if (!response.ok) throw new Error("Failed to fetch job details");
        const data = await response.json();
        console.log("Job details fetched:", data);
        setJob(data);
      } catch (err) {
        console.error("Error fetching job details:", err.message);
        setError(err.message);
      }
    };

    const fetchCandidates = async () => {
      try {
        const response = await fetch(`/api/candidate/getbyjob/${id}`);
        if (!response.ok) throw new Error("Failed to fetch candidates");
        const data = await response.json();
        console.log("Candidates fetched:", data);
        setCandidates(data);
      } catch (err) {
        console.error("Error fetching candidates:", err.message);
        setCandidates([]); // Instead of setting error, fallback to an empty list
      }
    };

    const fetchShortlistedCandidates = async () => {
      try {
        const response = await fetch(`/api/candidate/shortlisted/${id}`);
        if (!response.ok)
          throw new Error("Failed to fetch shortlisted candidates");
        const data = await response.json();
        console.log("Shortlisted candidates fetched:", data);
        setShortlistedCandidates(data);
      } catch (err) {
        console.error("Error fetching shortlisted candidates:", err.message);
        setShortlistedCandidates([]); // Ensure fallback to empty array
      } finally {
        setLoading(false);
      }
    };

    const fetchHiredCandidates = async () => {
      try {
        const response = await fetch(`/api/candidate/hired/${id}`);
        if (!response.ok) throw new Error("Failed to fetch hired candidates");
        const data = await response.json();
        console.log("Hired candidates fetched:", data);
        setHiredCandidates(data);
      } catch (err) {
        console.error("Error fetching hired candidates:", err.message);
        setHiredCandidates([]); // Ensure fallback to empty array
      } finally {
        setLoading(false);
      }
    };

    fetchHiredCandidates();
    fetchJobDetails();
    fetchCandidates();
    fetchShortlistedCandidates();
  }, [id]);

  // ... existing code ...

  // const handleDownloadReport = async (candidateId) => {
  //   try {
  //     // Fetch candidate data including evaluation report
  //     const response = await fetch(`/api/candidate/get/${candidateId}`);
  //     if (!response.ok) throw new Error("Failed to fetch candidate data");
  //     const candidateData = await response.json();

  //     // Create new PDF document
  //     const doc = new jsPDF();
  //     const pageHeight = doc.internal.pageSize.height;
  //     let yPosition = 20; // Initial Y position for content
  //     const margin = 20;
  //     const lineHeight = 7;

  //     // Title
  //     doc.setFont("helvetica", "bold");
  //     doc.setFontSize(18);
  //     doc.text("Candidate Evaluation Report", margin, yPosition);
  //     yPosition += 12;

  //     // Candidate Information
  //     doc.setFontSize(12);
  //     doc.setFont("helvetica", "normal");
  //     doc.text(
  //       `Candidate Name: ${candidateData.firstname} ${candidateData.lastname}`,
  //       margin,
  //       yPosition
  //     );
  //     yPosition += 7;
  //     doc.text(
  //       `Evaluation Score: ${candidateData.evaluationScore}`,
  //       margin,
  //       yPosition
  //     );
  //     yPosition += 10;

  //     // Section: Scoring Breakdown
  //     doc.setFont("helvetica", "bold");
  //     doc.setFontSize(14);
  //     doc.text("Scoring Breakdown", margin, yPosition);
  //     yPosition += 8;

  //     // Score List
  //     doc.setFont("helvetica", "normal");
  //     doc.setFontSize(12);
  //     const scores =
  //       candidateData.evaluationReport.match(/- \*\*Q\d+:\*\* \d+\/\d+/g) || [];

  //     scores.forEach((score) => {
  //       if (yPosition + lineHeight > pageHeight - margin) {
  //         doc.addPage();
  //         yPosition = margin;
  //       }
  //       doc.text(score.replace(/\*\*/g, ""), margin + 5, yPosition);
  //       yPosition += lineHeight;
  //     });

  //     yPosition += 10;

  //     // Section: Question-wise Performance Analysis
  //     doc.setFont("helvetica", "bold");
  //     doc.setFontSize(14);
  //     doc.text("Question-wise Performance Analysis", margin, yPosition);
  //     yPosition += 8;

  //     // Extract & Format Each Question Block
  //     const questions = candidateData.evaluationReport.split("\n\n");
  //     questions.forEach((section) => {
  //       if (section.includes("Q")) {
  //         const lines = doc.splitTextToSize(
  //           section.replace(/\*\*/g, ""),
  //           doc.internal.pageSize.width - margin * 2
  //         );
  //         lines.forEach((line) => {
  //           if (yPosition + lineHeight > pageHeight - margin) {
  //             doc.addPage();
  //             yPosition = margin;
  //           }
  //           doc.text(line, margin, yPosition);
  //           yPosition += lineHeight;
  //         });
  //         yPosition += 5;
  //       }
  //     });

  //     yPosition += 10;

  //     // Section: Final Recommendation
  //     doc.setFont("helvetica", "bold");
  //     doc.setFontSize(14);
  //     doc.text("Final Recommendation", margin, yPosition);
  //     yPosition += 8;

  //     doc.setFont("helvetica", "normal");
  //     const recommendation = candidateData.evaluationReport.match(
  //       /\*\*Final Recommendation:\*\* .*/g
  //     );
  //     if (recommendation) {
  //       const recommendationText = recommendation[0].replace(/\*\*/g, "");
  //       doc.text(recommendationText, margin, yPosition);
  //       yPosition += lineHeight;
  //     }

  //     yPosition += 10;

  //     // Section: Next Steps
  //     doc.setFont("helvetica", "bold");
  //     doc.setFontSize(14);
  //     doc.text("Next Steps", margin, yPosition);
  //     yPosition += 8;

  //     doc.setFont("helvetica", "normal");
  //     const nextSteps = candidateData.evaluationReport.match(
  //       /\*\*Next Steps:\*\* .*/g
  //     );
  //     if (nextSteps) {
  //       const nextStepsText = nextSteps[0].replace(/\*\*/g, "");
  //       doc.text(nextStepsText, margin, yPosition);
  //       yPosition += lineHeight;
  //     }

  //     // Generate timestamp for filename
  //     const timestamp = new Date().toISOString().split("T")[0];

  //     // Download PDF
  //     doc.save(
  //       `candidate-evaluation-${candidateData.firstname}-${timestamp}.pdf`
  //     );
  //   } catch (error) {
  //     console.error("Error downloading report:", error);
  //   }
  // };

  const handleInviteInterview = async (candidateId) => {
    try {
      // Create interview
      const interviewResponse = await fetch(`/api/interview/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidateRef: candidateId }),
      });

      if (!interviewResponse.ok) throw new Error("Failed to create interview");

      const interview = await interviewResponse.json();
      console.log("Interview Created:", interview);

      // Update candidate status
      const candidateUpdate = await fetch(
        `/api/candidate/update/${candidateId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Shortlisted", shortlist: true }),
        }
      );

      if (!candidateUpdate.ok)
        throw new Error("Failed to update candidate status");

      // Update local state to trigger re-render
      setCandidates((prevCandidates) =>
        prevCandidates.map((candidate) =>
          candidate._id === candidateId
            ? { ...candidate, status: "Shortlisted", shortlist: true }
            : candidate
        )
      );
    } catch (error) {
      console.error("Error creating interview:", error);
    }
  };

  const handleViewProfile = (candidateId) => {
    console.log("Opening profile modal for candidate ID:", candidateId);
    setSelectedCandidateId(candidateId);
    setIsProfileModalOpen(true);
  };

  const handleEditJob = () => {
    navigate(`/recruiter/edit-job/${id}`);
    setShowMenu(false);
  };

  const handleShareJob = () => {
    setIsShareModalOpen(true);
    setShowMenu(false);
  };

  const handleCloseJob = async () => {
    try {
      const response = await fetch(`/api/job/update/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ active: false }),
      });

      if (!response.ok) {
        throw new Error("Failed to close the job");
      }

      const updatedJob = await response.json();
      console.log("Job closed successfully:", updatedJob);
      setJob(updatedJob); // Update state to reflect the job is now closed
      navigate("/recruiter");
    } catch (error) {
      console.error("Error closing job:", error.message);
    } finally {
      setShowMenu(false);
    }
  };

  const handleHire = async (candidateId) => {
    try {
      const hireResponse = await fetch(`/api/candidate/hire`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidateRef: candidateId }),
      });

      if (!hireResponse.ok) throw new Error("Failed to hire candidate");

      const candidateUpdate = await fetch(
        `/api/candidate/update/${candidateId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Hired", hired: true }),
        }
      );

      if (!candidateUpdate.ok)
        throw new Error("Failed to update candidate status");

      // Update local state to trigger re-render
      setCandidates((prevCandidates) =>
        prevCandidates.map((candidate) =>
          candidate._id === candidateId
            ? { ...candidate, status: "Hired", hired: true }
            : candidate
        )
      );
    } catch (error) {
      console.error("Error hiring Candidate:", error);
    }
  };

  const handleReject = async (candidateId) => {
    try {
      // Fetch evaluation report for the candidate
      const evalResponse = await axios.get(
        `/api/candidate/getEvaluation/${candidateId}`
      );
      const { evaluationScore, evaluationReport } = evalResponse.data;

      // Prepare feedback prompt
      const prompt = `Based on the following candidate evaluation report, write a detailed and constructive feedback paragraph directly addressed to the candidate, explaining why they were not selected for the role. The tone should be respectful, honest, and supportive. Acknowledge their strengths, explain what was important for the position, and offer clear but kind insight into the areas that impacted the decision. Do not include greetings, sign-offs, or placeholders like [Candidate Name]. Just return the feedback paragraph only, as it will be embedded in a custom email. Here is the report:
  ${evaluationReport}`;

      // Get feedback from AI
      const feedbackResponse = await axios.post(
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

      const candidateFeedback =
        feedbackResponse.data.choices[0].message.content;

      // Send rejection request with feedback
      const rejectResponse = await fetch(`/api/candidate/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateRef: candidateId,
          candidateFeedback,
        }),
      });

      if (!rejectResponse.ok) throw new Error("Failed to reject candidate");

      // Update candidate status to "Rejected"
      const candidateUpdate = await fetch(
        `/api/candidate/update/${candidateId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Rejected" }),
        }
      );

      if (!candidateUpdate.ok)
        throw new Error("Failed to update candidate status");

      // Update local state to reflect rejection
      setCandidates((prevCandidates) =>
        prevCandidates.map((candidate) =>
          candidate._id === candidateId
            ? { ...candidate, status: "Rejected" }
            : candidate
        )
      );
    } catch (error) {
      console.error("Error rejecting candidate:", error);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div>
      <Layout>
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold">
            Opened Jobs &gt; {job?.title || "Job Title"}
          </h2>
        </header>

        {/* Job Details Section */}
        <section className="mb-8 border-b pb-6 bg-white m-6 p-6 rounded-xl shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold" style={{ color: "#144066" }}>
              Job Specific Information
            </h2>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <FiMoreVertical className="text-gray-600 text-xl" />
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border">
                  <div className="py-1">
                    <button
                      onClick={handleEditJob}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Edit Job
                    </button>
                    <button
                      onClick={handleShareJob}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Share Job
                    </button>
                    <button
                      onClick={handleCloseJob}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Close Job
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <p className="text-gray-500 mb-2">
            <strong>Job Title: {job?.title}</strong>
          </p>
          <p className="text-gray-600 mb-4">
            <strong className="text-gray-500">Job Description:</strong>
            <textarea
              className="w-full bg-white text-gray-500 border border-gray-500 rounded p-2 mt-2 resize-none"
              readOnly
              rows="6"
              value={job?.description || ""}
            />
          </p>

          <p className="font-medium text-gray-500 mb-2">Required Skills:</p>
          <div className="flex gap-2 flex-wrap mb-4">
            {job?.skills?.map((skill, index) => (
              <span
                key={index}
                className="text-white px-3 py-1 rounded-2xl text-sm"
                style={{ backgroundColor: "#144066" }}
              >
                {skill}
              </span>
            ))}
          </div>

          <p className="font-medium text-gray-500">
            Number Of Vacancies: {job?.hires}
          </p>
          <p className="font-medium text-gray-500">
            Job Location: {job?.location}
          </p>
          <p className="font-medium text-gray-500">Job Type: {job?.type}</p>

          <p className="font-medium text-gray-500">
            Employment Type: {job?.type}
          </p>
          <p className="font-medium text-gray-500">
            Expected Monthly Salary: {job?.salary}
          </p>
        </section>

        {/* Candidates Section */}
        <section className="mb-8 bg-white m-6 p-6 rounded-xl shadow">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                className={`${
                  activeTab === "applicants"
                    ? "border-[#144066] text-[#144066]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab("applicants")}
              >
                Job Applicants ({candidates.length})
              </button>
              <button
                className={`${
                  activeTab === "shortlisted"
                    ? "border-[#144066] text-[#144066]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab("shortlisted")}
              >
                Shortlisted Candidates ({shortlistedCandidates.length})
              </button>
              <button
                className={`${
                  activeTab === "hired"
                    ? "border-[#144066] text-[#144066]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab("hired")}
              >
                Hired Candidates ({hiredCandidates.length})
              </button>
            </nav>
          </div>

          <div className="bg-[#E6EDFF] rounded-xl overflow-hidden mt-6">
            {activeTab !== "shortlisted" && (
              <div className="grid grid-cols-6 gap-4 p-4 text-sm font-medium text-black">
                <div className="text-center">Name</div>
                <div className="text-center">Education</div>
                <div className="text-center">Experience</div>
                <div className="text-center">
                  {activeTab === "applicants"
                    ? "Resume Score"
                    : "Evaluation Score"}
                </div>
                <div className="text-center">Profile</div>
                <div className="text-center">Action</div>
              </div>
            )}

            {activeTab === "shortlisted" && (
              <div className="grid grid-cols-6 md:grid-cols-7 gap-4 p-4 text-sm font-medium text-black">
                <div className="text-center">Name</div>
                <div className="text-center">Education</div>
                <div className="text-center">Experience</div>
                <div className="text-center">
                  {activeTab === "applicants"
                    ? "Resume Score"
                    : "Evaluation Score"}
                </div>
                <div className="text-center">Profile</div>
                <div className="text-center">Action</div>

                <div className="text-center">Hire / Reject</div>
              </div>
            )}

            <div className="divide-y divide-gray-200">
              {activeTab === "applicants" ? (
                candidates.length > 0 ? (
                  candidates.map((candidate, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-6 gap-4 p-4 bg-white items-center text-sm"
                    >
                      <div className="text-[#121212] text-center">
                        {candidate.firstname + " " + candidate.lastname}
                      </div>
                      <div className="text-[#121212] text-center">
                        {candidate.education}
                      </div>
                      <div className="text-[#121212] text-center">
                        {candidate.experience} years
                      </div>
                      <div className="text-[#121212] text-center">
                        {candidate.resumeScore}
                      </div>
                      <div className="flex justify-center">
                        <button
                          className="px-4 py-2 text-[#121212] hover:text-gray-900 flex items-center gap-2 border border-gray-400 rounded-md shadow-sm"
                          onClick={() => handleViewProfile(candidate._id)}
                        >
                          View Profile
                        </button>
                      </div>
                      <button
                        className="px-4 py-2 text-sm text-white rounded-md bg-[#144066] hover:bg-[#0B2544] transition-colors shadow-sm"
                        onClick={() => handleInviteInterview(candidate._id)}
                        disabled={candidate.status !== "Pending"} // Optional: Disable button if already invited
                      >
                        {candidate.status && candidate.status !== "Pending"
                          ? "Invitation Sent"
                          : "Invite for Interview"}
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 p-4">
                    No applicants found
                  </p>
                )
              ) : activeTab === "hired" ? (
                hiredCandidates.length > 0 ? (
                  hiredCandidates.map((candidate, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-6 gap-4 p-4 bg-white items-center text-sm"
                    >
                      <div className="text-[#121212] text-center">
                        {candidate.firstname + " " + candidate.lastname}
                      </div>
                      <div className="text-[#121212] text-center">
                        {candidate.education}
                      </div>
                      <div className="text-[#121212] text-center">
                        {candidate.experience} years
                      </div>
                      <div className="text-[#121212] text-center">
                        {candidate.resumeScore}
                      </div>
                      <div className="flex justify-center">
                        <button
                          className="px-4 py-2 text-[#121212] hover:text-gray-900 flex items-center gap-2 border border-gray-400 rounded-md shadow-sm"
                          onClick={() => handleViewProfile(candidate._id)}
                        >
                          View Profile
                        </button>
                      </div>
                      {/* <button
                        className="px-4 py-2 text-sm text-white rounded-md bg-[#144066] hover:bg-[#0B2544] transition-colors shadow-sm"
                        onClick={() => handleInviteInterview(candidate._id)}
                        disabled={candidate.status !== "Pending"} // Optional: Disable button if already invited
                      >
                        {candidate.status && candidate.status !== "Pending"
                          ? "Invitation Sent"
                          : "Invite for Interview"}
                      </button> */}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 p-4">
                    No applicants hired yet
                  </p>
                )
              ) : shortlistedCandidates.length > 0 ? (
                shortlistedCandidates.map((candidate, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-7 gap-4 p-4 bg-white items-center text-sm"
                  >
                    <div className="text-[#121212] text-center">
                      {candidate.firstname + " " + candidate.lastname}
                    </div>
                    <div className="text-[#121212] text-center">
                      {candidate.education}
                    </div>
                    <div className="text-[#121212] text-center">
                      {candidate.experience} years
                    </div>
                    <div className="text-center">
                      {candidate.evaluationScore === 0 ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-amber-50 text-amber-600">
                          • Pending Interview
                        </span>
                      ) : (
                        <span className="text-[#121212]">
                          {candidate.evaluationScore}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-center">
                      <button
                        className="px-4 py-2 text-[#121212] hover:text-gray-900 flex items-center gap-2 border border-gray-400 rounded-md shadow-sm"
                        onClick={() => handleViewProfile(candidate._id)}
                      >
                        View Profile
                      </button>
                    </div>
                    <div className="flex justify-center">
                      <button
                        onClick={() =>
                          window.open(
                            `/recruiter/candidate-report/${candidate._id}`,
                            "_blank"
                          )
                        }
                        className="px-4 py-2 text-sm text-white rounded-md bg-[#144066] hover:bg-[#0B2544] transition-colors shadow-sm"
                      >
                        View Report
                      </button>
                    </div>

                    {/* Conditionally rendering Hire / Reject buttons when shortlisted */}
                    {activeTab === "shortlisted" && (
                      <div className="flex justify-center gap-2">
                        {candidate.status === "Hired" ? (
                          <span className="px-4 py-2 text-sm text-white bg-green-400 rounded-md cursor-not-allowed shadow-sm">
                            Hired
                          </span>
                        ) : candidate.status === "Rejected" ? (
                          <span className="px-4 py-2 text-sm text-white bg-red-400 rounded-md cursor-not-allowed shadow-sm">
                            Rejected
                          </span>
                        ) : (
                          <>
                            <button
                              onClick={() => handleHire(candidate._id)}
                              className="px-4 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors shadow-sm"
                            >
                              Hire
                            </button>
                            <button
                              onClick={() => handleReject(candidate._id)}
                              className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors shadow-sm"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 p-4">
                  No shortlisted candidates found
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="p-8" style={{ marginTop: -40 }}>
          <div className="flex justify-end mt-6 space-x-4">
            <button className="px-6 py-2 text-sm text-[#121212] hover:text-gray-900 flex items-center gap-2 border border-gray-400 rounded-md shadow-sm">
              Back
            </button>

            <button className="px-6 py-2 text-sm text-white rounded-md bg-[#144066] hover:bg-[#0B2544] transition-colors shadow-sm">
              Next
            </button>
          </div>
        </section>
      </Layout>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => {
          console.log("Closing profile modal");
          setIsProfileModalOpen(false);
        }}
        candidateId={selectedCandidateId}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        jobId={id}
      />
    </div>
  );
};

export default JobDashboard;

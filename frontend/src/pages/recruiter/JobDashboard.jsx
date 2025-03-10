import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TalentScout from "../../assets/Group 5.svg";
import ProfileModal from "./ProfileModal";
import Layout from "./RecruiterLayout";
import { FiMoreVertical } from "react-icons/fi";
import jsPDF from "jspdf";
import { ShareModal } from "./ShareModal";

const JobDashboard = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [shortlistedCandidates, setShortlistedCandidates] = useState([]);
  const [activeTab, setActiveTab] = useState("applicants");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

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

    fetchJobDetails();
    fetchCandidates();
    fetchShortlistedCandidates();
  }, [id]);

  // ... existing code ...

  const handleDownloadReport = async (candidateId) => {
    try {
      // Fetch candidate data including evaluation report
      const response = await fetch(`/api/candidate/get/${candidateId}`);
      if (!response.ok) throw new Error("Failed to fetch candidate data");
      const candidateData = await response.json();

      // Create new PDF document
      const doc = new jsPDF();

      // Add title
      doc.setFontSize(16);
      doc.text("Candidate Evaluation Report", 20, 20);

      // Add candidate info
      doc.setFontSize(12);
      doc.text(
        `Candidate Name: ${candidateData.firstname} ${candidateData.lastname}`,
        20,
        40
      );
      doc.text(`Evaluation Score: ${candidateData.evaluationScore}`, 20, 50);

      // Add evaluation report content
      doc.setFontSize(11);
      const reportText = doc.splitTextToSize(
        candidateData.evaluationReport,
        doc.internal.pageSize.width - 40
      );
      doc.text(reportText, 20, 70);

      // Generate timestamp for filename
      const timestamp = new Date().toISOString().split("T")[0];

      // Download PDF
      doc.save(`candidate-evaluation-${candidateData.name}-${timestamp}.pdf`);
    } catch (error) {
      console.error("Error downloading report:", error);
      // Handle error (show notification to user)
    }
  };

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

      // You might want to show a success message or update the UI here
    } catch (error) {
      console.error("Error creating interview:", error);
      // Handle error (show notification to user)
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
    } catch (error) {
      console.error("Error closing job:", error.message);
    } finally {
      setShowMenu(false);
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
            </nav>
          </div>

          <div className="bg-[#E6EDFF] rounded-xl overflow-hidden mt-6">
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
                      >
                        Invite for Interview
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 p-4">
                    No applicants found
                  </p>
                )
              ) : shortlistedCandidates.length > 0 ? (
                shortlistedCandidates.map((candidate, index) => (
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
                        onClick={() => handleDownloadReport(candidate._id)}
                        className="px-4 py-2 text-sm text-white rounded-md bg-[#144066] hover:bg-[#0B2544] transition-colors shadow-sm"
                      >
                        Download Report
                      </button>
                    </div>
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

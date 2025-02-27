import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TalentScout from "../../assets/Group 5.svg";
import ProfileModal from "./ProfileModal";
import Layout from "./RecruiterLayout";

const JobDashboard = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);

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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
    fetchCandidates();
  }, [id]);

  const handleViewProfile = (candidateId) => {
    console.log("Opening profile modal for candidate ID:", candidateId);
    setSelectedCandidateId(candidateId);
    setIsProfileModalOpen(true);
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
          <h2
            className="text-xl font-semibold mb-4"
            style={{ color: "#144066" }}
          >
            Job Specific Information
          </h2>
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
          <p className="font-medium text-gray-500">
            Employment Type: {job?.type}
          </p>
          <p className="font-medium text-gray-500">
            Expected Monthly Salary: {job?.salary}
          </p>
        </section>

        {/* Candidates Section */}
        <section className="mb-8 bg-white m-6 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-6 text-[#144066]">
            Job Applicants
          </h2>

          <div className="bg-[#E6EDFF] rounded-xl overflow-hidden">
            <div className="grid grid-cols-6 gap-4 p-4 text-sm font-medium text-black">
              <div className="text-center">Name</div>
              <div className="text-center">Education</div>
              <div className="text-center">Experience</div>
              <div className="text-center">Resume Score</div>
              <div className="text-center">Profile</div>
              <div className="text-center">Action</div>
            </div>

            <div className="divide-y divide-gray-200">
              {candidates.length > 0 ? (
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
                    <div className="flex justify-center">
                      <button className="px-4 py-2 text-sm text-white rounded-md bg-[#144066] hover:bg-[#0B2544] transition-colors shadow-sm">
                        Invite for Interview
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 p-4">
                  No applicants found
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="p-8" style={{ marginTop: -40 }}>
          <div className="flex justify-end mt-6 space-x-4">
            <button className="px-6 py-2 text-[#121212] hover:text-gray-900 flex items-center gap-2 border border-gray-400 rounded-md shadow-sm">
              Back
            </button>

            <a
              href={`/recruiter/shortlisted-candidates/${id}`}
              className="block"
            >
              <button className="px-6 py-2 text-sm text-white rounded-md bg-[#144066] hover:bg-[#0B2544] transition-colors shadow-sm">
                Next
              </button>
            </a>
          </div>
        </section>
      </Layout>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => {
          console.log("Closing profile modal");
          setIsProfileModalOpen(false);
        }}
        candidateId={selectedCandidateId} // Pass candidateId to ProfileModal
      />
    </div>
  );
};

export default JobDashboard;

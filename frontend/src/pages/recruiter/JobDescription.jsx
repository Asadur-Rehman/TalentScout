import React, { useState } from "react";
import TalentScout from "../../assets/Group 5.svg";
import UploadTab from "./UploadTab";
import WriteYourselfTab from "./WriteYourselfTab";
import Layout from "./RecruiterLayout";
import { ShareModal } from "./ShareModal";
import { useLocation, useNavigate } from "react-router-dom";

const JobDescription = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData || {};
  console.log("Initial Form Data:", formData);

  const [uploadTab, setUploadTab] = useState("opened");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [jobId, setJobId] = useState(null); // Store job ID from API response

  const handleNext = async () => {
    setLoading(true);
    setError(null);

    const jobData = {
      ...formData,
      description,
    };

    try {
      const res = await fetch("/api/job/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobData),
      });

      const data = await res.json();
      console.log("API Response:", data);

      if (!res.ok) {
        throw new Error(data.message || "Failed to create job");
      }

      // alert("Job posted successfully!");

      setJobId(data._id); // Save job ID from response

      setIsShareModalOpen(true);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <header className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold">Open a Job</h2>
      </header>

      <section className="mb-8 border-b pb-6 bg-white p-6 rounded-xl shadow-sm flex justify-between items-center">
        <h2 className="text-black text-md">Job Description</h2>
        <div className="w-1/5 flex justify-between items-center">
          <div className="w-full h-1 bg-gray-200">
            <div className="w-full h-full bg-[#144066]"></div>
          </div>
          <p className="text-black text-right font-[Montserrat] ml-3">2/2</p>
        </div>
      </section>

      <section className="mb-8 border-b bg-white p-6 rounded-xl shadow">
        <div className="flex border-b mb-8">
          <button
            className={`px-6 py-2 ${
              uploadTab === "closed"
                ? "border-b-2 border-blue-600 font-semibold"
                : "text-gray-600"
            }`}
            onClick={() => setUploadTab("closed")}
          >
            Write Yourself
          </button>
          <button
            className={`px-6 py-2 ${
              uploadTab === "opened"
                ? "border-b-2 border-blue-600 font-semibold"
                : "text-gray-600"
            }`}
            onClick={() => setUploadTab("opened")}
          >
            Upload a PDF
          </button>
        </div>

        {uploadTab === "opened" && (
          <UploadTab
            description={description}
            setDescription={setDescription}
          />
        )}
        {uploadTab === "closed" && (
          <WriteYourselfTab
            description={description}
            setDescription={setDescription}
            formData={formData}
          />
        )}
      </section>

      <section className="p-8" style={{ marginTop: -40 }}>
        <div className="flex justify-end mt-6 space-x-4">
          <button className="px-6 py-2 text-[#121212] hover:text-gray-900 flex items-center gap-2 border border-gray-400 rounded-md shadow-sm">
            Back
          </button>
          <button
            onClick={handleNext}
            className={`px-6 py-2 text-sm text-white rounded-md    transition-colors shadow-sm ${
              loading || !description.trim() ? "bg-gray-400" : "bg-[#144066]"

            }`}
            disabled={loading || !description.trim()}
          >
            {loading ? "Submitting..." : "Create Job"}
          </button>
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </section>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => {
          setIsShareModalOpen(false);
          navigate('/recruiter');
        }}
        jobId={jobId}
      />
    </Layout>
  );
};

export default JobDescription;

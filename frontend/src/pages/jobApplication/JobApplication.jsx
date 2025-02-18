import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // To get job ID from URL
import Group5 from "../../assets/Group 5.svg";
import CoverLetterSection from "./CoverLetterSection";
import Cloud from "../../assets/cloud.svg";

const JobApplication = () => {
  const { id } = useParams(); // Get the job ID from the URL
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`/api/job/get/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch job details");
        }
        const data = await response.json();
        setJob(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div style={{ backgroundColor: "#F2FDFF" }}>
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-white">
        <div className="flex justify-between items-center">
          <img src={Group5} alt="TalentScout" className="w-30 h-15" />
          <h1 className="text-2xl font-bold text-gray-700 mx-10">
            Job Application
          </h1>
        </div>
        <button
          className="text-white px-8 py-2 rounded hover:bg-blue-800"
          style={{ backgroundColor: "#144066" }}
          onClick={() => (window.location.href = "/faq")}
        >
          FAQs
        </button>
      </header>
      {/* Job Details Section */}
      <section className="mb-8 border-b pb-6 bg-white m-6 p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4" style={{ color: "#144066" }}>
          Job Specific Information
        </h2>
        <p className="text-gray-500 mb-2">
          <strong>Job Title: {job.title}</strong>
        </p>

        <p className="text-gray-600 mb-4">
          <strong className="text-gray-500">Job Description:</strong>
          <textarea
            className="w-full bg-white text-gray-500 border border-gray-500 rounded p-2 mt-2 resize-none"
            readOnly
            rows="6"
            value={job.description}
          />
        </p>

        <p className="font-medium text-gray-500 mb-2">Required Skills:</p>
        <div className="flex gap-2 flex-wrap mb-4">
          {job.skills.map((skill) => (
            <span
              key={skill}
              className="text-white px-3 py-1 rounded-2xl text-sm"
              style={{ backgroundColor: "#144066" }}
            >
              {skill}
            </span>
          ))}
        </div>

        <p className="font-medium text-gray-500">
          Number Of Vacancies: {job.hires}
        </p>
        <p className="font-medium text-gray-500">
          Job Location: {job.location}
        </p>
        <p className="font-medium text-gray-500">Employment Type: {job.type}</p>
        <p className="font-medium text-gray-500">
          Expected Monthly Salary: {job.salary}
        </p>
      </section>
      {/* Applicant's Information Section */}
      <section className="mb-8 border-b pb-6 bg-white m-8 p-8 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4" style={{ color: "#144066" }}>
          Applicant's Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "First Name", placeholder: "React Developer" },
            { label: "Last Name", placeholder: "React Developer" },
            { label: "Date Of Birth", type: "date" },
            { label: "Email", placeholder: "shahmeer@gmail.com" },
            { label: "Contact Number", placeholder: "03332521327" },
            { label: "Country Of Residence", placeholder: "Pakistan" },
          ].map(({ label, type = "text", placeholder }, idx) => (
            <div key={idx}>
              <label className="block text-sm font-medium text-gray-500 mb-2">
                {label}
              </label>
              <input
                type={type}
                placeholder={placeholder}
                className="w-full border border-gray-300 text-[#21315C] rounded-md py-2 px-4 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          ))}
        </div>
      </section>
      {/* Cover Letter Section */}
      <div className="mb-8 border-b pb-6 bg-white m-8 p-8 rounded-xl shadow">
        <CoverLetterSection />
      </div>
      {/* Resume Upload */}
      <div className="mb-8 border-b pb-6 bg-white m-8 p-8 rounded-xl shadow">
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Resume
        </label>
        <div className="p-12 rounded-md text-center bg-[#F1F2F4]">
          <img src={Cloud} alt="Cloud" className="w-20 h-20 mx-auto" />
          <p className="text-gray-500">
            <strong>Browse files</strong> or drop here
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Supported format: PDF, Word, Docs.
          </p>
        </div>
      </div>
      {/* Submit Button */}
      <section className="p-8">
        <div className="text-right mt-6">
          <button className="bg-[#144066] text-white px-6 py-2 rounded hover:bg-blue-800">
            Submit
          </button>
        </div>
      </section>{" "}
    </div>
  );
};

export default JobApplication;

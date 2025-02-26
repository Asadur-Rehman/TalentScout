import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // To get job ID from URL
import Group5 from "../../assets/Group 5.svg";
import Cloud from "../../assets/cloud.svg";
import { useRef } from "react";

const JobApplication = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState("");

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    birth: "",
    email: "",
    contact: "",
    country: "",
    education: "",
    experience: "",
    coverletter: "",
    resumeScore: "",
    jobRef: id,
  });

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    const formData = new FormData();
    formData.append("resume", uploadedFile);

    try {
      const res = await fetch("/api/text-extract/extract", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Failed to extract text: ${res.status}`);
      }

      const data = await res.json();
      console.log("API Response:", data); // Log full response

      if (data.success) {
        setResumeText(data.text); // Update state
      } else {
        console.error("Failed to extract text:", data.message);
      }
    } catch (error) {
      console.error("Error extracting resume text:", error);
    }
  };

  useEffect(() => {
    const cosineSimilarity = (vec1, vec2) => {
      const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
      const norm1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
      const norm2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));

      return dotProduct / (norm1 * norm2);
    };

    const handleEmbedding = async () => {
      try {
        const uploadData = {
          model: "text-embedding-nomic-embed-text-v1.5",
          input: [job.description, resumeText], // Ensure resumeText is updated
        };

        console.log("Embedding Request:", uploadData);

        const res = await fetch("http://192.168.56.1:1234/v1/embeddings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(uploadData),
        });

        if (!res.ok) {
          throw new Error(`Embedding request failed: ${res.status}`);
        }

        const data = await res.json();
        console.log("Embedding Response:", data);

        const embeddings = data.data.map((item) => item.embedding);

        if (embeddings.length === 2) {
          const similarity = cosineSimilarity(embeddings[0], embeddings[1]);
          const similarityPercentage = (similarity * 100).toFixed(2); // Convert to percentage

          console.log("Similarity Percentage:", similarityPercentage);

          // Update formData with resume score
          setFormData((prevData) => ({
            ...prevData,
            resumeScore: similarityPercentage,
          }));
        } else {
          console.log(
            "Expected exactly 2 embeddings but got:",
            embeddings.length
          );
        }
      } catch (error) {
        console.error("Error extracting resume text:", error);
      }
    };

    if (resumeText && job?.description) {
      handleEmbedding();
    }
  }, [resumeText, job?.description]);

  const handleSubmit = async (e) => {
    if (!file) return alert("Please select a resume file.");

    const uploadData = new FormData();
    Object.keys(formData).forEach((key) => {
      uploadData.append(key, formData[key]);
    });
    uploadData.append("resume", file);

    try {
      const res = await fetch("/api/candidate/create", {
        method: "POST",

        body: uploadData,
      });

      const data = await res.json();
      console.log(data);

      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }

      // await axios.post("/api/candidate/create", uploadData, {
      //   headers: { "Content-Type": "multipart/form-data" },
      // });
      alert("Application Submitted successfully!");
    } catch (error) {
      console.error("Submission error:", error);
      alert("Submission failed.");
    }
  };

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

      {/* Section 1: Job Details */}
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
            className="w-full bg-white text-gray-500 border border-gray-500 rounded p-2 mt-2 rounded-xl resize-none"
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

      {/* Section 2: Applicant's Information */}
      <section className="mb-8 border-b pb-6 bg-white m-8 p-8 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4" style={{ color: "#144066" }}>
          Applicant's Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              label: "First Name",
              name: "firstname",
              placeholder: "React Developer",
            },
            {
              label: "Last Name",
              name: "lastname",
              placeholder: "React Developer",
            },
            { label: "Date Of Birth", name: "birth", type: "date" },
            {
              label: "Email",
              name: "email",
              placeholder: "shahmeer@gmail.com",
            },
            {
              label: "Contact Number",
              name: "contact",
              placeholder: "03332521327",
            },
            {
              label: "Country Of Residence",
              name: "country",
              placeholder: "Pakistan",
            },
          ].map(({ label, name, type = "text", placeholder }, idx) => (
            <div key={idx}>
              <label className="block text-sm font-medium text-gray-500 mb-2">
                {label}
              </label>
              <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={formData[name]}
                onChange={handleChange}
                className="w-full border border-gray-300 text-[#21315C] rounded-md py-2 px-4 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Applicant's Experience */}
      <section className="mb-8 border-b pb-6 bg-white m-8 p-8 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4" style={{ color: "#144066" }}>
          Applicant's Experience
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Education Level */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Education Level
            </label>
            <select
              name="education"
              value={formData.education}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Bachelor's">Bachelor's</option>
              <option value="Master's">Master's</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Other Education */}
          {formData.education === "Other" && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                If Other (Specify)
              </label>
              <input
                type="text"
                name="otherEducation"
                placeholder="e.g PHD"
                value={formData.otherEducation}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          {/* Work Experience */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Work Experience (In Years)
            </label>
            <input
              type="number"
              name="experience"
              placeholder="3"
              value={formData.experience}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Section 4: Job-Specific Information */}
      <section className="mb-8 border-b pb-6 bg-white m-8 p-8 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4" style={{ color: "#144066" }}>
          Job-Specific Information
        </h2>

        {/* Cover Letter */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Cover Letter
          </label>
          <textarea
            name="coverletter"
            rows="5"
            placeholder="Write down a small cover letter to the hiring manager"
            value={formData.coverletter}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 mt-1 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Resume Upload */}
        <div onClick={() => fileRef.current.click()}>
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
            <input
              type="file"
              ref={fileRef}
              name="resume"
              hidden
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="opacity-0 absolute w-full h-full cursor-pointer"
            />
          </div>
        </div>
      </section>

      {/* Submit Button */}
      <section className="p-8">
        <div className="text-right mt-6">
          <button
            type="submit"
            className="bg-[#144066] text-white px-6 py-2 rounded hover:bg-blue-800"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </section>
    </div>
  );
};

export default JobApplication;

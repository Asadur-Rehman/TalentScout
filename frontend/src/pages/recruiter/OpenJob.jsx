import React, { useState } from "react";
import Layout from "./RecruiterLayout";
import { useNavigate } from "react-router-dom";

const SKILL_OPTIONS = [
  "React",
  "Node.js",
  "JavaScript",
  "TypeScript",
  "MongoDB",
  "Express.js",
  "Redux",
  "Next.js",
  "GraphQL",
  "Docker",
  "AWS",
  "Python",
  "Django",
  "Java",
  "Spring Boot",
  "C++",
  "MySQL",
  "PostgreSQL",
  "Firebase",
];

const OpenJobForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    skills: ["React"],
    hires: 0,
    location: "",
    type: "Full time",
    salary: "50-100k",
    recruiterRef: "sgnongoi",
  });
  const [skillInput, setSkillInput] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Adding Skills
  const addSkill = (skill) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData({ ...formData, skills: [...formData.skills, skill] });
    }
    setSkillInput("");
  };

  // Handle Removing Skills
  const removeSkill = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skill),
    });
  };

  // Increment & Decrement Hires
  const incrementHires = () =>
    setFormData({ ...formData, hires: formData.hires + 1 });
  const decrementHires = () => {
    if (formData.hires > 0)
      setFormData({ ...formData, hires: formData.hires - 1 });
  };

  return (
    <Layout>
      <header className="mb-8">
        <h2 className="text-xl font-bold">OPEN A JOB</h2>
      </header>

      <section className="mb-8 border-b pb-6 bg-white p-6 rounded-xl shadow-sm flex justify-between items-center">
        <p className="text-black">TELL US ABOUT THE JOB</p>
        <div className="w-1/5 flex justify-between items-center">
          <div className="w-full h-1 bg-gray-200">
            <div className="w-1/2 h-full bg-[#144066]"></div>
          </div>
          <p className="text-black text-right">1/2</p>
        </div>
      </section>

      <form className="bg-white rounded-xl shadow-sm p-6">
        {/* Job Title */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">JOB TITLE*</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="React Developer"
            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#144066]"
          />
        </div>

        {/* Skills Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            WHAT SKILLS SHOULD I HAVE?*
          </label>
          <div className="flex flex-wrap gap-2 border rounded-md px-4 py-2">
            {formData.skills.map((skill) => (
              <span
                key={skill}
                className="bg-[#144066] text-white px-3 py-1 rounded-full text-sm flex items-center"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="ml-2 text-white hover:text-red-400"
                >
                  ✕
                </button>
              </span>
            ))}
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="Add more skills..."
              className="focus:outline-none flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill(skillInput.trim());
                }
              }}
            />
          </div>

          {/* Skill Suggestions */}
          {skillInput && (
            <ul className="border mt-2 max-h-40 overflow-y-auto bg-white shadow-md rounded-md">
              {SKILL_OPTIONS.filter((skill) =>
                skill.toLowerCase().includes(skillInput.toLowerCase())
              ).map((filteredSkill) => (
                <li
                  key={filteredSkill}
                  onClick={() => addSkill(filteredSkill)}
                  className="cursor-pointer p-2 hover:bg-gray-200"
                >
                  {filteredSkill}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* How Many Hires */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            HOW MANY HIRES?
          </label>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={decrementHires}
              className="px-4 py-2 border rounded-md text-lg bg-[#144066] text-white"
            >
              -
            </button>
            <span className="text-lg">{formData.hires}</span>
            <button
              type="button"
              onClick={incrementHires}
              className="px-4 py-2 border rounded-md text-lg bg-[#144066] text-white"
            >
              +
            </button>
          </div>
        </div>

        {/* Job Location */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            JOB LOCATION*
          </label>
          <div className="flex items-center space-x-4 mb-2">
            {["Fully Remote", "Hybrid", "Onsite"].map((location) => (
              <label
                key={location}
                className={`px-4 py-2 border rounded-md text-lg flex items-center space-x-2 ${
                  formData.locationType === location
                    ? "bg-[#144066] text-white"
                    : "text-[#144066]"
                }`}
              >
                <input
                  type="radio"
                  name="locationType"
                  value={location}
                  checked={formData.locationType === location}
                  onChange={handleChange}
                  className="form-radio"
                />
                <span>{location}</span>
              </label>
            ))}
          </div>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Karachi, Lahore etc."
            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#144066]"
          />
        </div>

        {/* Employment Type */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            EMPLOYMENT TYPE
          </label>
          <div className="flex items-center space-x-4">
            {["Full time", "Part time"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData({ ...formData, type: type })}
                className={`px-4 py-2 border rounded-md text-sm ${
                  formData.type === type
                    ? "bg-[#144066] text-white"
                    : "text-[#144066]"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Salary Expectations */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            EXPECTED MONTHLY SALARY?
          </label>
          <div className="flex items-center space-x-4">
            {["50-100k", "100-200k", "200k+"].map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setFormData({ ...formData, salary: range })}
                className={`px-4 py-2 border rounded-md text-sm ${
                  formData.salary === range
                    ? "bg-[#144066] text-white"
                    : "text-[#144066]"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-md text-sm text-gray-700"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() =>
              navigate("/recruiter/job-description", { state: { formData } })
            }
            className="px-6 py-2 bg-[#144066] text-white rounded-md text-sm"
          >
            Next
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default OpenJobForm;

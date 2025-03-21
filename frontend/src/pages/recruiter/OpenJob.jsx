import React, { useState, useEffect } from "react";
import Layout from "./RecruiterLayout";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiMinus, FiPlus } from "react-icons/fi";

const SKILL_OPTIONS = [
  // Frontend Technologies
  "React",
  "Next.js",
  "Vue.js",
  "Angular",
  "Svelte",
  "Redux",
  "Recoil",
  "Tailwind CSS",
  "Bootstrap",
  "Material-UI",
  "Chakra UI",
  "Three.js",
  "WebGL",
  "Framer Motion",

  // Backend Technologies
  "Node.js",
  "Express.js",
  "NestJS",
  "Fastify",
  "Koa",
  "Hapi.js",
  "Django",
  "Flask",
  "Spring Boot",
  "Ruby on Rails",
  "ASP.NET Core",
  "Laravel",
  "Go Fiber",
  "Gin (Go)",

  // Databases
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "MariaDB",
  "Firebase",
  "SQLite",
  "Cassandra",
  "Redis",
  "DynamoDB",
  "Neo4j",
  "Supabase",
  "PlanetScale",

  // DevOps & Cloud
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "Google Cloud Platform",
  "Heroku",
  "Vercel",
  "Netlify",
  "Terraform",
  "CI/CD",
  "Jenkins",
  "GitHub Actions",
  "CircleCI",
  "Travis CI",

  // Programming Languages
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C++",
  "C",
  "C#",
  "Go",
  "Rust",
  "Ruby",
  "PHP",
  "Swift",
  "Kotlin",
  "Dart",
  "R",
  "Scala",

  // Testing & QA
  "Jest",
  "Mocha",
  "Chai",
  "Cypress",
  "Playwright",
  "Selenium",
  "JUnit",
  "PyTest",
  "Karma",
  "Enzyme",
  "TestNG",
  "Postman",
  "SoapUI",

  // Version Control & Collaboration
  "Git",
  "GitHub",
  "GitLab",
  "Bitbucket",
  "SVN",
  "Mercurial",

  // Mobile Development
  "React Native",
  "Flutter",
  "Swift (iOS)",
  "Kotlin (Android)",
  "Xamarin",
  "Ionic",

  // Security
  "OAuth",
  "JWT",
  "OpenID Connect",
  "SSO",
  "OWASP",
  "Penetration Testing",
  "Ethical Hacking",

  // Data Science & AI
  "TensorFlow",
  "PyTorch",
  "Scikit-Learn",
  "Pandas",
  "NumPy",
  "Matplotlib",
  "OpenCV",
  "NLP",
  "Hugging Face",
  "MLflow",
  "Jupyter Notebook",
  "Apache Spark",

  // Blockchain
  "Ethereum",
  "Solidity",
  "Web3.js",
  "Hardhat",
  "Truffle",
  "Smart Contracts",
  "Hyperledger",
  "IPFS",

  // Miscellaneous
  "GraphQL",
  "Apollo Client",
  "REST API",
  "Microservices",
  "RabbitMQ",
  "Kafka",
  "gRPC",
  "Serverless",
  "TDD",
  "DDD",
  "Event-Driven Architecture",
  "WebSockets",
  "PWA (Progressive Web Apps)",
  "Electron.js",
  "Figma",
  "UX/UI Design",

  // Soft Skills
  "Problem-Solving",
  "Critical Thinking",
  "Communication Skills",
  "Teamwork",
  "Collaboration",
  "Time Management",
  "Adaptability",
  "Leadership",
  "Creativity",
  "Attention to Detail",
  "Decision-Making",
  "Analytical Thinking",
  "Emotional Intelligence",
  "Conflict Resolution",
  "Project Management",
  "Self-Motivation",
  "Interpersonal Skills",
  "Networking",
  "Public Speaking",
  "Active Listening",
  "Negotiation Skills",
  "Presentation Skills",
  "Mentoring",
  "Work Ethic",
  "Agile Methodologies",
  "Scrum",
  "Kanban",
  "Stakeholder Management",
];

const OpenJobForm = () => {
  const persistRoot = localStorage.getItem("persist:root");
  const parsedRoot = JSON.parse(persistRoot);
  const recruiterData = JSON.parse(parsedRoot.recruiter);
  const recruiterRef = recruiterData.currentRecruiter?._id;

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    skills: ["React"],
    hires: 0,
    location: "",
    locationType: "",
    type: "Full time",
    experience: "Mid-level",
    maxSalary: "60000",
    minSalary: "50000",
    recruiterRef: recruiterRef,
  });
  const [skillInput, setSkillInput] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  // Validate form whenever formData changes
  useEffect(() => {
    const validateForm = () => {
      const requiredFields = [
        formData.title,
        formData.skills.length > 0,
        formData.location,
        formData.locationType,
        formData.type,
        formData.experience,
        formData.minSalary,
        formData.maxSalary,
      ];
      
      setIsFormValid(requiredFields.every(field => field !== "" && field !== undefined && field !== null));
    };

    validateForm();
  }, [formData]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    const updatedFormData = {
      ...formData,
      salary: `${formData.minSalary} - ${formData.maxSalary}`,
    };

    console.log("Updated Form Data:", updatedFormData);

    navigate("/recruiter/job-description", {
      state: { formData: updatedFormData },
    });
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
        <h2 className="text-xl font-bold">Open a Job</h2>
      </header>

      <section className="mb-8 border-b pb-6 bg-white p-6 rounded-xl shadow-sm flex justify-between items-center">
        <p className="text-black text-md">Tell us about the job</p>
        <div className="w-1/5 flex justify-between items-center">
          <div className="w-full h-1 bg-gray-200">
            <div className="w-1/2 h-full bg-[#144066]"></div>
          </div>
          <p className="text-black text-right font-[Montserrat] ml-3">1/2</p>
        </div>
      </section>

      <form className="bg-white rounded-xl shadow-sm p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Job title<span className="text-red-500">*</span>
          </label>
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
            What skills should I have?<span className="text-red-500">*</span>
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
                  <FiX />
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
            How many hires?<span className="text-red-500">*</span>
          </label>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={decrementHires}
              className="px-4 py-2 border rounded-md text-lg bg-[#144066] text-white"
            >
              <FiMinus />
            </button>
            <span className="text-lg">{formData.hires}</span>
            <button
              type="button"
              onClick={incrementHires}
              className="px-4 py-2 border rounded-md text-lg bg-[#144066] text-white"
            >
              <FiPlus />
            </button>
          </div>
        </div>

        {/* Job Location */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Job location<span className="text-red-500">*</span>
          </label>
          <div className="flex items-center space-x-4 mb-2">
            {["Fully Remote", "Hybrid", "Onsite"].map((location) => (
              <label
                key={location}
                className={`px-4 py-2 border rounded-md text-sm ${
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
                <span className="ml-3">{location}</span>
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
            Employment Type<span className="text-red-500">*</span>
          </label>
          <div className="flex items-center space-x-4">
            {["Full time", "Part time", "Project based"].map((type) => (
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

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Experience<span className="text-red-500">*</span>
          </label>
          <div className="flex items-center space-x-4">
            {["Intern", "Junior", "Mid-level", "Senior"].map((experience) => (
              <button
                key={experience}
                type="button"
                onClick={() =>
                  setFormData({ ...formData, experience: experience })
                }
                className={`px-4 py-2 border rounded-md text-sm ${
                  formData.experience === experience
                    ? "bg-[#144066] text-white"
                    : "text-[#144066]"
                }`}
              >
                {experience}
              </button>
            ))}
          </div>
        </div>

        {/* Salary Expectations */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Expected Monthly Salary Range (In PKR)?<span className="text-red-500">*</span>
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              name="minSalary"
              value={formData.minSalary}
              onChange={handleChange}
              placeholder="50000"
              className="w-half border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#144066]"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              name="maxSalary"
              value={formData.maxSalary}
              onChange={handleChange}
              placeholder="60000"
              className="w-half border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#144066]"
            />
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-md text-sm text-gray-700"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={!isFormValid}
            className={`px-6 py-2 rounded-md text-sm ml-4 ${
              isFormValid
                ? "bg-[#144066] text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Next
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default OpenJobForm;

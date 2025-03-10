import React, { useState, useEffect } from "react";
import Layout from "./RecruiterLayout";
import { useNavigate, useParams } from "react-router-dom";
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

const EditJob = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    skills: [],
    hires: 0,
    location: "",
    locationType: "Fully Remote",
    type: "Full time",
    experience: "Mid-level",
    maxSalary: "",
    minSalary: "",
    description: "",
  });
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`/api/job/get/${id}`);
        if (!response.ok) throw new Error("Failed to fetch job details");
        const data = await response.json();
        
        // Parse salary range - handle both formats "X - Y" and "X-Y"
        const salaryParts = data.salary?.split(/\s*-\s*/);
        const [minSalary, maxSalary] = salaryParts || ["", ""];
        
        setFormData({
          title: data.title || "",
          skills: data.skills || [],
          hires: data.hires || 0,
          location: data.location || "",
          locationType: data.locationType || "Fully Remote",
          type: data.type || "Full time",
          experience: data.experience || "Mid-level",
          maxSalary: maxSalary?.trim() || "",
          minSalary: minSalary?.trim() || "",
          description: data.description || "",
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching job details:", err);
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const updatedFormData = {
        ...formData,
        salary: `${formData.minSalary} - ${formData.maxSalary}`,
        locationType: formData.locationType,
      };

      const response = await fetch(`/api/job/update/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      });

      if (!response.ok) throw new Error("Failed to update job");
      
      navigate(`/recruiter/job-dashboard/${id}`);
    } catch (err) {
      console.error("Error updating job:", err);
    }
  };

  const addSkill = (skill) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData({ ...formData, skills: [...formData.skills, skill] });
    }
    setSkillInput("");
  };

  const removeSkill = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skill),
    });
  };

  const incrementHires = () =>
    setFormData({ ...formData, hires: formData.hires + 1 });
  const decrementHires = () => {
    if (formData.hires > 0)
      setFormData({ ...formData, hires: formData.hires - 1 });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <header className="mb-8">
        <h2 className="text-xl font-bold">Edit Job</h2>
      </header>

      <form className="bg-white rounded-xl shadow-sm p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Job title*</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="React Developer"
            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#144066]"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Job Description*</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="6"
            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#144066]"
          />
        </div>

        {/* Skills Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            What skills should I have?*
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
            How many hires?
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
            Job location*
          </label>
          <div className="flex items-center space-x-4 mb-2">
            {["Fully Remote", "Hybrid", "Onsite"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData({ ...formData, locationType: type })}
                className={`px-4 py-2 border rounded-md text-sm ${
                  formData.locationType === type
                    ? "bg-[#144066] text-white"
                    : "text-[#144066]"
                }`}
              >
                {type}
              </button>
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
            Employment Type
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
          <label className="block text-sm font-medium mb-2">Experience</label>
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
            Expected Monthly Salary Range (In PKR)?
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
            onClick={() => navigate(`/recruiter/job-dashboard/${id}`)}
            className="px-6 py-2 border border-gray-300 rounded-md text-sm text-gray-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 bg-[#144066] text-white rounded-md text-sm ml-4"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default EditJob; 
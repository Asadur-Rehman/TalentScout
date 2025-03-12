"use client";
import { useState } from "react";
import axios from "axios";
import Stars from "../../assets/stars.svg";

export default function WriteYourselfTab({
  description,
  setDescription,
  formData,
}) {
  const [loading, setLoading] = useState(false);

  const apikey =
    "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";

  const handleGenerate = async () => {
    if (!formData) {
      console.error("Form data is missing.");
      return;
    }

    setLoading(true);

    const prompt = `
        Write a professional job description for a "${formData.experience} ${
      formData.title
    }" role.
        
        **Do NOT include job title, location, salary, company details, or application instructions.**
        
        Structure:
        - Begin with a brief but engaging introduction (2-3 sentences) that sets the tone for the role.
        - Follow with clearly structured sections:
          - Key responsibilities
          - Required technical and soft skills
          - Daily tasks
          - Expected contributions to projects
          - Required qualifications
        
        The role requires expertise in:
        - ${formData.skills.join("\n- ")}
    
        Keep the language professional, engaging, and concise.
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
            Authorization: `Bearer ${apikey}`,
            "Content-Type": "application/json",
          },
        }
      );

      setDescription(response.data.choices[0].message.content);
    } catch (error) {
      console.error("Error generating job description:", error);
    }

    setLoading(false);
  };

  return (
    <div>
      <div className="space-y-4">
        <h2 className="text-lg text-gray-700">
          Write the job description or let our AI write it for you!
        </h2>

        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6">
                <img src={Stars} className="h-10" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Generate with AI
              </span>
            </div>
            <button
              onClick={handleGenerate}
              className="px-4 py-2 text-sm font-medium text-white bg-[#0B2544] hover:bg-[#0B2544]/90 rounded-md transition-colors"
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>

          <div className="p-4">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write Job description"
              className="w-full min-h-[200px] resize-none border-0 focus:outline-none focus:ring-0 text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

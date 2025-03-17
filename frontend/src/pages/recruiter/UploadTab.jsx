"use client";
import { useRef, useState } from "react";
import upload from "../../assets/upload.svg";
export default function UploadTab({ description, setDescription }) {
  const [file, setFile] = useState(null);
  const fileRef = useRef(null);

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

      const data = await res.json();
      if (data.success) {
        console.log("Extracted text:", data.text);
        setDescription(data.text); 
      } else {
        console.error("Failed to extract text:", data.message);
      }
    } catch (error) {
      console.error("Error extracting resume text:", error);
    }
  };

  return (
    <div>
      <div className="space-y-4">
        <h2 className="text-lg text-gray-700">
          Upload a concise description of the job
        </h2>

        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6">
              <img src={upload} alt="upload" className="h-10" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Upload a PDF
              </span>
            </div>
            <button
              onClick={() => fileRef.current.click()}
              className="px-4 py-2 text-sm font-medium text-white bg-[#0B2544] hover:bg-[#0B2544]/90 rounded-md transition-colors"
            >
              Upload
              <input
                type="file"
                ref={fileRef}
                name="resume"
                hidden
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="opacity-0 absolute w-full h-full cursor-pointer"
              />
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

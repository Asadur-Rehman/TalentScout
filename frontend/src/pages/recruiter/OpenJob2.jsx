import React from "react";

const JobDescription = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-md p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-gray-800">OPEN A JOB</h1>
          <p className="text-gray-500">2/2</p>
        </div>
        <h2 className="text-lg font-medium text-gray-700 mb-4">
          JOB DESCRIPTION
        </h2>

        <div className="flex items-center gap-4 mb-6">
          <button className="py-2 px-4 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition">
            Write Yourself
          </button>
          <button className="py-2 px-4 bg-gray-100 text-gray-700 rounded-md shadow hover:bg-gray-200 transition">
            Upload a PDF
          </button>
        </div>

        <p className="text-gray-500 mb-4">
          Write the job description or let our AI write it for you!
        </p>

        <div className="border rounded-md p-4 bg-gray-50">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-blue-500 text-lg">\u2728</span>
            <span className="text-blue-500 font-medium">Generate with AI</span>
          </div>
          <textarea
            className="w-full h-32 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            placeholder="Write Job description"
          ></textarea>
        </div>

        <div className="flex justify-end mt-6">
          <button className="py-2 px-6 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition">
            Generate
          </button>
          <button className="ml-4 py-2 px-6 bg-gray-200 text-gray-700 rounded-md shadow hover:bg-gray-300 transition">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDescription;

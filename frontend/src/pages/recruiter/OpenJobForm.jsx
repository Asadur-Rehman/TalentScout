import React from "react";
import open_job_icon from "../../assets/open_job_icon.png";
import Layout from "./RecruiterLayout";
import { Plus } from "lucide-react"; // Importing Plus icon for button

const OpenJobForm = () => {
  return (
    <Layout>
      <header className="mb-8 px-6 ml-2">
        <h2 className="text-xl font-bold text-left">Open a Job</h2>
      </header>

      {/* Full-width and Full-height White Section with Outer Margin */}
      <div className="flex items-center justify-center w-full h-[80vh]">
        <div className="bg-white w-full h-full flex flex-col items-center justify-center rounded-lg border border-[#DFE7EF] shadow-md px-6 m-4 md:m-6 lg:m-8">
          {/* Open Job Icon */}
          <img
            src={open_job_icon}
            alt="Open Job"
            className="w-14 h-14 md:w-16 md:h-16 mb-3 md:mb-4"
          />

          {/* Text Below Icon */}
          <p className="text-[#5E5E5E] text-center text-xs md:text-sm font-medium max-w-xs md:max-w-sm">
            No open job. Open a job to hire the best talent out there!
          </p>

          {/* Open Job Button */}
          <a href="/recruiter/open-job" className="mt-3 md:mt-4">
            <button className="bg-[#144066] hover:bg-[#123456] text-white flex items-center px-3 md:px-5 py-1.5 md:py-2.5 text-xs md:text-sm rounded-md shadow-md transition duration-200">
              <Plus size={14} className="mr-2" /> Open a Job
            </button>
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default OpenJobForm;

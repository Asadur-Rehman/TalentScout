import React from "react";

const OpenedJob = () => {
  return (
    <div>
      <section className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 shadow rounded">
          <p className="text-gray-600">Total Open Jobs</p>
          <h3 className="text-2xl font-bold">2</h3>
        </div>
        <div className="bg-white p-6 shadow rounded">
          <p className="text-gray-600">Total Applicants</p>
          <h3 className="text-2xl font-bold">100</h3>
        </div>
        <div className="bg-white p-6 shadow rounded">
          <p className="text-gray-600">Shortlisted Application</p>
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mx-auto">
            <span className="text-blue-600 font-bold">38%</span>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        {[...Array(2)].map((_, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center bg-white p-6 shadow rounded"
          >
            <div>
              <h3 className="text-lg font-bold">React Developer</h3>
              <p className="text-gray-600">
                Type of interview: AI based interview
              </p>
              <p className="text-gray-600">Level of interview: Medium</p>
              <p className="text-gray-600">Number of v: 08</p>
            </div>
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <h4 className="text-xl font-bold">30</h4>
                <p className="text-gray-600">Applied</p>
              </div>
              <div className="text-center">
                <h4 className="text-xl font-bold">5</h4>
                <p className="text-gray-600">Shortlisted</p>
              </div>
            </div>
            <button className="bg-gray-100 text-blue-600 px-4 py-2 rounded">
              View job details
            </button>
          </div>
        ))}
      </section>
    </div>
  );
};

export default OpenedJob;

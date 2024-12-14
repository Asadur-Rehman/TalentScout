import React from "react";

const JobDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="flex">
        <aside className="w-64 bg-white border-r min-h-screen">
          <div className="p-5 text-2xl font-bold text-blue-600">
            TalentScout
          </div>
          <nav>
            <ul>
              <li className="px-6 py-3 bg-blue-100 font-semibold">
                Open a Job
              </li>
              <li className="px-6 py-3 text-gray-600 cursor-pointer">
                Closed Jobs
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 px-8 py-6">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">OPEN A JOB</h1>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              + Open a Job
            </button>
          </div>

          {/* Job Details Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h2 className="text-xl font-semibold mb-4">React Developer</h2>
                <p>
                  Type of interview:{" "}
                  <span className="font-semibold">AI based interview</span>
                </p>
                <p>
                  Level of interview:{" "}
                  <span className="font-semibold">Medium</span>
                </p>
                <p>
                  Number of v: <span className="font-semibold">08</span>
                </p>
              </div>
              <div className="text-center">
                <div className="flex justify-between">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold">30</h3>
                    <p className="text-gray-500">Applied</p>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold">5</h3>
                    <p className="text-gray-500">Shortlisted</p>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-green-500 font-semibold">
                    Status: Active
                  </span>
                </div>
              </div>
            </div>
            <button className="mt-4 bg-gray-100 px-4 py-2 rounded hover:bg-gray-200">
              View job details
            </button>
          </div>

          {/* Table Section */}
          <div className="mt-8">
            <table className="w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-blue-50 text-gray-600">
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Departemen</th>
                  <th className="py-3 px-4 text-left">Posisi</th>
                  <th className="py-3 px-4 text-left">Waktu</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array(10)
                  .fill(0)
                  .map((_, index) => (
                    <tr
                      key={index}
                      className="border-b hover:bg-gray-100 text-gray-600 text-sm"
                    >
                      <td className="py-3 px-4 flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                        <span>Dhimas Adit</span>
                      </td>
                      <td className="py-3 px-4">QA (Quality Assurance)</td>
                      <td className="py-3 px-4">QA (Quality Assurance)</td>
                      <td className="py-3 px-4">22 Des 2022 10:45 WIB</td>
                      <td className="py-3 px-4">
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          Pending Interview
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">
                          Lihat Portfolio
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDashboard;

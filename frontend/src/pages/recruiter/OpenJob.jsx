import React, { useState } from "react";

const OpenJobForm = () => {
  const [hires, setHires] = useState(0);

  const incrementHires = () => setHires(hires + 1);
  const decrementHires = () => {
    if (hires > 0) setHires(hires - 1);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-1/4 bg-gray-100 p-6">
        <h1 className="text-2xl font-bold mb-6">TalentScout</h1>
        <nav>
          <ul className="space-y-4">
            <li className="text-gray-600">Dashboard</li>
            <li className="text-blue-600 font-semibold">Open a job</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <header className="mb-8">
          <h2 className="text-xl font-bold">OPEN A JOB</h2>
          <p className="text-gray-500">TELL US ABOUT THE JOB</p>
          <div className="mt-4 w-full h-1 bg-gray-200">
            <div className="w-1/2 h-full bg-blue-600"></div>
          </div>
          <p className="text-gray-500 mt-2">1/2</p>
        </header>

        {/* Form */}
        <form>
          {/* Job Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">JOB TITLE*</label>
            <input
              type="text"
              placeholder="React Developer"
              className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Skills */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              WHAT SKILLS SHOULD I HAVE?*
            </label>
            <div className="flex items-center space-x-2 border rounded px-4 py-2">
              <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                React <button className="ml-2">✕</button>
              </span>
              <input
                type="text"
                placeholder="Add more skills..."
                className="focus:outline-none"
              />
            </div>
          </div>

          {/* Number of Hires */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              HOW MANY HIRES?
            </label>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={decrementHires}
                className="px-4 py-2 border rounded text-lg"
              >
                -
              </button>
              <span className="text-lg">{hires}</span>
              <button
                type="button"
                onClick={incrementHires}
                className="px-4 py-2 border rounded text-lg"
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
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input type="radio" name="location" className="form-radio" />
                <span>It’s fully remote</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="location" className="form-radio" />
                <span>It’s hybrid</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="location" className="form-radio" />
                <span>It’s on-site</span>
              </label>
            </div>
            <input
              type="text"
              placeholder="e.g. Karachi, Lahore etc."
              className="w-full border rounded px-4 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Employment Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              EMPLOYMENT TYPE
            </label>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                className="px-4 py-2 border rounded text-sm bg-blue-600 text-white"
              >
                Full time
              </button>
              <button
                type="button"
                className="px-4 py-2 border rounded text-sm"
              >
                Part time
              </button>
            </div>
          </div>

          {/* Expected Salary */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              EXPECTED MONTHLY SALARY?
            </label>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                className="px-4 py-2 border rounded text-sm bg-blue-600 text-white"
              >
                50-100k
              </button>
              <button
                type="button"
                className="px-4 py-2 border rounded text-sm"
              >
                100-200k
              </button>
              <button
                type="button"
                className="px-4 py-2 border rounded text-sm"
              >
                200k+
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <button type="button" className="px-4 py-2 border rounded text-sm">
              Back
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded text-sm"
            >
              Next
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default OpenJobForm;

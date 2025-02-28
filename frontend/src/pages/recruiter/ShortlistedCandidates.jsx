import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import TalentScout from "../../assets/Group 5.svg";
import Layout from "./RecruiterLayout";

const JobDashboard = () => {
  const [applicants, setApplicants] = useState([]);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShortlistedCandidates = async () => {
      try {
        const response = await fetch(`/api/candidate/shortlisted/${id}`);
        if (!response.ok) setError("Failed to fetch shortlisted candidates");
        const data = await response.json();
        setApplicants(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShortlistedCandidates();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  // if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="flex min-h-screen bg-[#F2FDFF]">
      <aside className="w-1/7 bg-white p-0">
        <img src={TalentScout} alt="TalentScout" className="w-56 h-28 mx-6" />
        <nav>
          <ul className="space-y-0">
            <li className="text-[#5E5E5E] py-3 px-6 font-bold">Dashboard</li>
            <li className="text-white bg-[#144066] py-3 px-6 font-bold">
              Jobs
            </li>
          </ul>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold">
            OPENED JOBS &gt; REACT JS DEVELOPER &gt; SHORTLISTED CANDIDATES
          </h2>
        </header>

        <section className="mb-8 bg-white m-6 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-6 text-[#144066]">
            Shortlisted Applicants
          </h2>

          <div className="bg-[#E6EDFF] rounded-xl overflow-hidden">
            <div className="grid grid-cols-6 gap-4 p-4 text-sm font-medium text-black">
              <div className="text-center">Name</div>
              <div className="text-center">Education</div>
              <div className="text-center">Experience</div>
              <div className="text-center">Evaluation Score</div>
              <div className="text-center">Profile</div>
              <div className="text-center">Report</div>
            </div>

            <div className="divide-y divide-gray-200">
              {applicants.length > 0 ? (
                applicants.map((applicant, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-6 gap-4 p-4 bg-white items-center text-sm"
                  >
                    <div className="text-[#121212] text-center">
                      {applicant.firstname + " " + applicant.lastname}
                    </div>
                    <div className="text-[#121212] text-center">
                      {applicant.education}
                    </div>
                    <div className="text-[#121212] text-center">
                      {applicant.experience}
                    </div>
                    <div className="text-center">
                      {applicant.evaluationScore === 0 ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-amber-50 text-amber-600">
                          • Pending Interview
                        </span>
                      ) : (
                        <span className="text-[#121212]">
                          {applicant.evaluationScore}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-center">
                      <button className="px-4 py-2 text-[#121212] hover:text-gray-900 flex items-center gap-2 border border-gray-400 rounded-md shadow-sm">
                        View Profile
                      </button>
                    </div>
                    <div className="flex justify-center">
                      <button className="px-4 py-2 text-sm text-white rounded-md bg-[#144066] hover:bg-[#0B2544] transition-colors shadow-sm">
                        Download Report
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No shortlisted candidates found.
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default JobDashboard;

import React, { useEffect, useState } from "react";
import { StatsCard } from "./StatsCard";
import { JobCard } from "./JobCard";
import NoJobs from "./nojobs"; // Fixed import

export default function Dashboard() {
  const persistRoot = localStorage.getItem("persist:root");
  const parsedRoot = JSON.parse(persistRoot || "{}");
  const recruiterData = parsedRoot.recruiter
    ? JSON.parse(parsedRoot.recruiter)
    : {};
  const recruiterRef = recruiterData?.currentRecruiter?._id || null;

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalApplicants, setTotalApplicants] = useState(0);
  const [shortlistedApplications, setShortlistedApplications] = useState(0);
  const [hires, setHires] = useState(0);
  const [jobStats, setJobStats] = useState({}); // Stores stats per job

  // Fetch jobs for recruiter
  useEffect(() => {
    if (!recruiterRef) return;
    setError(null); // Reset error before fetching

    const fetchJobs = async () => {
      try {
        const response = await fetch(`/api/job/getbyrecruiter/${recruiterRef}`);
        const data = await response.json();

        if (!response.ok || data.success === false) {
          setError(data.message || "Something went wrong while fetching jobs");
          setJobs([]);
          return;
        }

        setJobs(data);
      } catch (err) {
        setError("Something went wrong while fetching jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [recruiterRef]);

  // Fetch stats for all jobs and update global totals
  useEffect(() => {
    if (jobs.length === 0) return;

    const fetchAllStats = async () => {
      let total = 0;
      let shortlisted = 0;
      let hired = 0;
      const statsMap = {};

      await Promise.all(
        jobs.map(async (job) => {
          try {
            const response = await fetch(`/api/candidate/stats/${job._id}`);
            if (!response.ok) throw new Error("Failed to fetch stats");

            const data = await response.json();

            statsMap[job._id] = {
              totalCandidates: Number(data.totalCandidates) || 0,
              shortlistedCandidates: Number(data.shortlistedCandidates) || 0,
              hiredCandidates: Number(data.hiredCandidates) || 0,
            };

            total += statsMap[job._id].totalCandidates;
            shortlisted += statsMap[job._id].shortlistedCandidates;
            hired += statsMap[job._id].hiredCandidates;
          } catch (err) {
            console.error(`Error fetching stats for job ${job._id}:`, err);
          }
        })
      );

      setJobStats(statsMap);
      setTotalApplicants(total);
      setShortlistedApplications(shortlisted);
      setHires(hired);
    };

    fetchAllStats();
  }, [jobs]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div>
      {error === "No jobs found for this recruiter!" ? (
        <NoJobs />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <StatsCard
              title="Total Open Jobs"
              value={jobs.length}
              variant="dark"
            />
            <StatsCard
              title="Total Applicants"
              value={totalApplicants}
              variant="light"
            />
            <StatsCard
              title="Shortlisted Applications"
              value={shortlistedApplications}
              variant="dark"
            />
            <StatsCard title="Hires" value={hires} variant="light" />
          </div>
          <div className="p-6 bg-white min-h-screen rounded-xl flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow px-8">
              {jobs.map((job) => (
                <JobCard
                  key={job._id}
                  jobId={job._id}
                  title={job.title}
                  datePosted={
                    new Date(job.createdAt).toISOString().split("T")[0]
                  }
                  status="Active"
                  hires={jobStats[job._id]?.hiredCandidates || 0}
                  totalApplications={jobStats[job._id]?.totalCandidates || 0}
                  shortlistedApplications={
                    jobStats[job._id]?.shortlistedCandidates || 0
                  }
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

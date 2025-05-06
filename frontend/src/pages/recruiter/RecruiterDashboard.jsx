import React from "react";
import Layout from "./RecruiterLayout";
import StatsCard from "../../components/StatsCard";
import RecentApplications from "../../components/RecentApplications";
// import UpcomingInterviews from "../../components/UpcomingInterviews";
import { useEffect } from "react";
import { useState } from "react";

const RecruiterDashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [activeJobs, setActiveJobs] = useState(0);
  const [shortlistedCount, setShortlistedCount] = useState(0);
  const [hiredCount, setHiredCount] = useState(0);

  const id = JSON.parse(
    JSON.parse(localStorage.getItem("persist:root")).recruiter
  ).currentRecruiter._id;

  const recruiterName = JSON.parse(
    JSON.parse(localStorage.getItem("persist:root")).recruiter
  ).currentRecruiter.username;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShortlistedCandidates = async () => {
      try {
        const response = await fetch(`/api/candidate/getbyrecruiter/${id}`);
        if (!response.ok) setError("Failed to fetch shortlisted candidates");
        const data = await response.json();
        setCandidates(data);

        setShortlistedCount(
          data.filter((candidate) => candidate.status === "Shortlisted").length
        );
        setHiredCount(
          data.filter((candidate) => candidate.status === "Hired").length
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchTotalJobs = async () => {
      try {
        const response = await fetch(`/api/job/getjobsbyrecruiter/${id}`);
        if (!response.ok) setError("Failed to fetch total jobs");
        const data = await response.json();
        setActiveJobs(data.totalJobs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShortlistedCandidates();
    fetchTotalJobs();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <Layout>
      {
        <div className="p-4">
          <div className="mb-4">
            <h1 className="text-xl font-bold text-gray-900">
              Dashboard Overview
            </h1>
            <p className="text-sm text-gray-500">
              Welcome back, {recruiterName}!
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <StatsCard
              icon="candidates"
              value={candidates.length}
              label="Total Candidates"
              percentage="12"
              isIncrease={true}
            />
            <StatsCard
              icon="jobs"
              value={activeJobs}
              label="Active Jobs"
              percentage="8"
              isIncrease={true}
            />
            <StatsCard
              icon="interviews"
              value={shortlistedCount}
              label="Shortlisted Candidates"
              percentage="5"
              isIncrease={false}
            />
            <StatsCard
              icon="hired"
              value={hiredCount}
              label="Total Hired"
              percentage="15"
              isIncrease={true}
            />
          </div>

          {/* Recent Applications */}
          {/* Recent Applications */}
          <RecentApplications candidates={candidates} />

          {/* Upcoming Interviews */}
          {/* <UpcomingInterviews /> */}
        </div>
      }
    </Layout>
  );
};

export default RecruiterDashboard;

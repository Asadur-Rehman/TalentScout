import React from "react";
import Layout from "./RecruiterLayout";
import StatsCard from "../../components/StatsCard";
import RecentApplications from "../../components/RecentApplications";
import UpcomingInterviews from "../../components/UpcomingInterviews";

const RecruiterDashboard = () => {
  return (
    <Layout>
      <div className="p-4">
        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-500">Welcome back, Sarah!</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <StatsCard
            icon="candidates"
            value="1,482"
            label="Total Candidates"
            percentage="12"
            isIncrease={true}
          />
          <StatsCard
            icon="jobs"
            value="64"
            label="Active Jobs"
            percentage="8"
            isIncrease={true}
          />
          <StatsCard
            icon="interviews"
            value="24"
            label="Interviews Today"
            percentage="5"
            isIncrease={false}
          />
          <StatsCard
            icon="hired"
            value="126"
            label="Hired this month"
            percentage="15"
            isIncrease={true}
          />
        </div>

        {/* Recent Applications */}
        <RecentApplications />

        {/* Upcoming Interviews */}
        <UpcomingInterviews />
      </div>
    </Layout>
  );
};

export default RecruiterDashboard;

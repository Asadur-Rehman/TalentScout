import React from "react";

const getStatusStyle = (status) => {
  const styles = {
    hired: "bg-green-100 text-green-800",
    interviewing: "bg-yellow-100 text-yellow-800",
    shortlisted: "bg-blue-100 text-blue-800",
    pending: "bg-gray-100 text-gray-800",
  };
  return styles[status?.toLowerCase()] || styles.pending;
};

const RecentApplications = ({ candidates }) => {
  return (
    <div className="bg-white p-6 rounded-xl">
      <h2 className="text-md font-semibold mb-6">Recent Applications</h2>
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-500">
            <th className="pb-4">Candidate</th>
            <th className="pb-4">Position</th>
            <th className="pb-4">Status</th>
            <th className="pb-4">Applied Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {candidates &&
            Array.isArray(candidates) &&
            candidates.map((candidate) => (
              <tr key={candidate._id} className="py-2">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="text-sm font-semibold">
                        {candidate.firstname} {candidate.lastname}
                      </div>
                      <div className="text-sm text-gray-500">
                        {candidate.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-sm">
                  <span className="text-gray-600 italic">
                    {candidate.position || "N/A"}
                  </span>
                </td>

                <td className="py-4">
                  <span
                    className={`px-3 py-1 text-sm rounded-full capitalize ${getStatusStyle(
                      candidate.status
                    )}`}
                  >
                    {candidate.status}
                  </span>
                </td>
                <td className="py-4 text-sm">
                  {new Date(candidate.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentApplications;

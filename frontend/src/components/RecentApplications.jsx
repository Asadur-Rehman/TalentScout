import React from 'react';

const candidates = [
  {
    id: 1,
    name: 'John Cooper',
    email: 'john@example.com',
    position: 'Senior UX Designer',
    status: 'interviewing',
    appliedDate: 'Jan 12, 2025',
  },
  {
    id: 2,
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    position: 'Frontend Developer',
    status: 'hired',
    appliedDate: 'Jan 15, 2025',
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike@example.com',
    position: 'Product Manager',
    status: 'shortlisted',
    appliedDate: 'Jan 18, 2025',
  },
  {
    id: 4,
    name: 'Emily Brown',
    email: 'emily@example.com',
    position: 'UI Designer',
    status: 'pending',
    appliedDate: 'Jan 20, 2025',
  },
  {
    id: 5,
    name: 'David Lee',
    email: 'david@example.com',
    position: 'Backend Developer',
    status: 'pending',
    appliedDate: 'Jan 22, 2025',
  },
];

const getStatusStyle = (status) => {
  const styles = {
    hired: 'bg-green-100 text-green-800',
    interviewing: 'bg-yellow-100 text-yellow-800',
    shortlisted: 'bg-blue-100 text-blue-800',
    pending: 'bg-gray-100 text-gray-800',
  };
  return styles[status] || styles.pending;
};

const RecentApplications = () => {
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
          {candidates.map((candidate) => (
            <tr key={candidate.id} className="py-2">
              <td className="py-4">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="text-sm font-semibold">{candidate.name}</div>
                    <div className="text-sm text-gray-500">{candidate.email}</div>
                  </div>
                </div>
              </td>
              <td className="py-4 text-sm">{candidate.position}</td>
              <td className="py-4">
                <span className={`px-3 py-1 text-sm rounded-full capitalize ${getStatusStyle(candidate.status)}`}>
                  {candidate.status}
                </span>
              </td>
              <td className="py-4 text-sm">{candidate.appliedDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RecentApplications; 
import React from 'react';

const interviews = [
  {
    id: 1,
    name: 'Emma Thompson',
    position: 'UI/UX Designer', 
    time: 'Today, 2:00 PM',
    duration: '30 minutes',
  },
  {
    id: 2,
    name: 'Emma Thompson',
    position: 'UI/UX Designer',   
    time: 'Tomorrow, 10:00 AM',
    duration: '45 minutes', 
  },
  {
    id: 3,
    name: 'Emma Thompson',
    position: 'UI/UX Designer',   
    time: 'Tomorrow, 10:00 AM',
    duration: '45 minutes', 
  },
];


const UpcomingInterviews = () => {
  return (
    <div className="bg-white p-6 rounded-xl mt-6">
      <h2 className="text-md font-semibold mb-6">Upcoming Interviews</h2>
      <div className="space-y-4">
        <div className="flex flex-col gap-4">
        {interviews.map((interview) => (
          <div key={interview.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center gap-4">
              {/* <div className="w-12 h-12 rounded-full bg-gray-200"></div> */}
              <div>
                <h3 className="text-sm font-semibold">{interview.name}</h3>
                <p className="text-sm text-gray-500">{interview.position}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm">{interview.time}</p>
              <p className="text-sm text-gray-500">{interview.duration}</p>
            </div>
          </div>
        ))}
        </div>

       
      </div>
    </div>
  );
}

export default UpcomingInterviews; 
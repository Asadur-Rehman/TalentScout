import React from 'react';
import hired from '../assets/hired.png';
import applicants from '../assets/applicants.png';
import interviews from '../assets/interviews.png';
import jobs from '../assets/jobs.png';

const StatsCard = ({ icon, value, label, percentage, isIncrease }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
       
          {/* Icon placeholder - you can replace with your actual icons */}
          <span >
            {icon === 'candidates' ? <img src={applicants} alt="applicants" className="w-10 h-10" /> : 
             icon === 'jobs' ? <img src={jobs} alt="jobs" className="w-10 h-10" /> : 
             icon === 'interviews' ? <img src={interviews} alt="interviews" className="w-10 h-10" /> : 
             icon==='hired'? <img src={hired} alt="hired" className="w-10 h-10" /> : '✓'
             }
          </span>
        {/* <div className={`text-sm font-medium ${isIncrease ? 'text-green-600' : 'text-red-600'}`}>
          {percentage}%
        </div> */}
      </div>
      <div className="space-y-1">
        <h3 className="text-xl font-semibold text-gray-900">{value}</h3>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

export default StatsCard; 
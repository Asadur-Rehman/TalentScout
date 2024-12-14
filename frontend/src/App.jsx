import { BrowserRouter, Routes, Route } from "react-router-dom";
// import RecruiterHome from "./pages/recruiter/RecruiterHome";
import CandidateReport from "./pages/recruiter/CandidateReport";
import OpenedJobs from "./pages/recruiter/OpenedJobs";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import OpenJobForm from "./pages/recruiter/OpenJob";
import JobDescription from "./pages/recruiter/OpenJob2";
import JobDashboard from "./pages/recruiter/JobDashboard";
import RecruiterHome from "./pages/recruiter/RecruiterHome";
import JobApplication from "./pages/JobApplication";
import FAQPage from "./pages/FAQs";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route
          path="/recruiter/candidate-report"
          element={<CandidateReport />}
        />
        <Route path="/recruiter/opened-jobs" element={<OpenedJobs />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/recruiter/open-job" element={<OpenJobForm />} />
        <Route path="/recruiter/job-description" element={<JobDescription />} />
        <Route path="recruiter/job-dashboard" element={<JobDashboard />} />
        <Route path="/recruiter" element={<RecruiterHome />} />
        <Route path="/job-application" element={<JobApplication />} />
        <Route path="/faq" element={<FAQPage />} />
      </Routes>
    </BrowserRouter>
  );
}

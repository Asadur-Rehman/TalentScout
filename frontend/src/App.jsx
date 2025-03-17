import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import RecruiterHome from "./pages/recruiter/RecruiterHome";
import CandidateReport from "./pages/recruiter/CandidateReport";
import OpenedJobs from "./pages/recruiter/OpenedJobs";
import SignIn from "./pages/authentication/SignIn";
import SignUp from "./pages/authentication/SignUp";
import ForgotPassword from "./pages/authentication/ForgotPassword";
import OpenJobForm from "./pages/recruiter/OpenJob";
import JobDescription from "./pages/recruiter/JobDescription";
import JobDashboard from "./pages/recruiter/JobDashboard";
import RecruiterHome from "./pages/recruiter/RecruiterHome";
import JobApplication from "./pages/jobApplication/JobApplication";
import FAQPage from "./pages/jobApplication/FAQs";
import ShortlistedCandidates from "./pages/recruiter/ShortlistedCandidates";
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import CandidateSignin from "./pages/candidate/candidateSignin";
import CandidateInstructions from "./pages/candidate/CandidateInstructions";
import CandidatePermissions from "./pages/candidate/CandidatePermissions";
import CandidateInterview from "./pages/candidate/CandidateInterview";
import VideoInterviewInstructions from "./pages/candidate/VideoInterviewInstructions";
import CandidateCompletion from "./pages/candidate/CandidateCompletion";
import VideoInterview from "./pages/candidate/VideoInterview";
import CodingInterview from "./pages/candidate/CodingInterview";
import InterviewCompletion from "./pages/candidate/InterviewCompletion";
import RecruiterPrivateRoute from "./pages/recruiter/RecruiterPrivateRoute";
import CandidatePrivateRoute from "./pages/candidate/CandidatePrivateRoute";
import EditJob from "./pages/recruiter/EditJob";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/candidatelogin" element={<CandidateSignin />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />

        <Route element={<RecruiterPrivateRoute />}>
          <Route
            path="/recruiter/candidate-report"
            element={<CandidateReport />}
          />
          <Route path="/recruiter/opened-jobs" element={<OpenedJobs />} />
          <Route path="/recruiter/open-job" element={<OpenJobForm />} />
          <Route path="/recruiter/edit-job/:id" element={<EditJob />} />
          <Route
            path="/recruiter/job-description"
            element={<JobDescription />}
          />
          <Route
            path="/recruiter/job-dashboard/:id"
            element={<JobDashboard />}
          />
          <Route path="/recruiter" element={<RecruiterHome />} />

          <Route
            path="/recruiter/shortlisted-candidates/:id"
            element={<ShortlistedCandidates />}
          />
          <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
        </Route>

        <Route path="/job-application/:id" element={<JobApplication />} />

        <Route path="/faq" element={<FAQPage />} />
        <Route element={<CandidatePrivateRoute />}>
          <Route
            path="/candidate/instructions"
            element={<CandidateInstructions />}
          />
          <Route
            path="/candidate/permissions"
            element={<CandidatePermissions />}
          />
          <Route path="/candidate/interview" element={<CandidateInterview />} />
          <Route
            path="/candidate/video-instructions"
            element={<VideoInterviewInstructions />}
          />
          <Route
            path="/candidate/completion"
            element={<CandidateCompletion />}
          />
          <Route
            path="/candidate/video-interview"
            element={<VideoInterview />}
          />
          <Route
            path="/candidate/coding-interview"
            element={<CodingInterview />}
          />
          <Route
            path="/candidate/interview-completion"
            element={<InterviewCompletion />}
          />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

import { BrowserRouter, Routes, Route } from "react-router-dom";
import RecruiterHome from "./pages/recruiter/RecruiterHome";
import CandidateReport from "./pages/recruiter/CandidateReport";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/recruiter-home" element={<RecruiterHome />} />
        <Route path="/candidate-report" element={<CandidateReport />} />
      </Routes>
    </BrowserRouter>
  );
}

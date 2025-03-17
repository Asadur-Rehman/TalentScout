import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export default function CandidatePrivateRoute() {
  const { currentCandidate } = useSelector((state) => state.candidate);

  return currentCandidate ? <Outlet /> : <Navigate to="/candidatelogin" />;
}

import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export default function RecruiterPrivateRoute() {
  const { currentRecruiter } = useSelector((state) => state.recruiter);

  return currentRecruiter ? <Outlet /> : <Navigate to="/login" />;
}

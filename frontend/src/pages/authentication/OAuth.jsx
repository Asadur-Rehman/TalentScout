import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../../redux/recruiter/recruiterSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Logo from "../../assets/glogo.png";

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [orgName, setOrgName] = useState(""); // State for organization name
  const [showOrgInput, setShowOrgInput] = useState(false); // State to show input field

  const checkIfRecruiterExists = async (email) => {
    try {
      const res = await fetch("/api/recruiter/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }), // Correct email sending
      });

      const data = await res.json(); // Correctly parse the response

      return data.res; // Correctly return `true` or `false`
    } catch (error) {
      console.error("Error checking recruiter:", error);
      return false; // Assume false if an error occurs
    }
  };

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      const email = result.user.email; // Ensure email is correctly extracted

      // Check if the recruiter exists
      const recruiterExists = await checkIfRecruiterExists(email);
      console.log("Recruiter exists:", recruiterExists);

      if (!recruiterExists && orgName === "") {
        setShowOrgInput(true);
        return;
      }

      // Prepare user data
      const user = {
        username: result.user.displayName,
        email,
        organizationname: orgName, // Ensure organization name is included
      };

      // Proceed with sign-in
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate("/recruiter");
    } catch (error) {
      console.error("Could not sign in with Google", error);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {showOrgInput ? (
        <div className="w-full">
          <input
            type="text"
            placeholder="Enter your organization name"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          <button
            onClick={handleGoogleClick}
            className="w-full mt-2 flex items-center justify-center border border-gray-300 text-gray-700 px-4 py-2 rounded-md shadow hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
          >
            Confirm & Sign In
          </button>
        </div>
      ) : (
        <button
          onClick={handleGoogleClick}
          type="button"
          className="w-full flex items-center justify-center border border-gray-300 text-gray-700 px-3 sm:px-4 py-2 sm:py-2 rounded-md shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-xs sm:text-sm"
        >
          <img src={Logo} alt="Google" className="w-5 h-5 mr-2" />
          Continue with Google
        </button>
      )}
    </div>
  );
};

export default OAuth;

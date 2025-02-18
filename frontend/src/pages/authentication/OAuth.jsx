import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../../redux/recruiter/recruiterSlice";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/glogo.png";

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: result.user.displayName,
          email: result.user.email,
        }),
      });

      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate("/recruiter");
    } catch (error) {
      console.log("Could not sign in with Google", error);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="w-full flex items-center justify-center border border-gray-300 text-gray-700 px-3 sm:px-4 py-2 sm:py-2 rounded-md shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-xs sm:text-sm"
    >
      <img src={Logo} alt="Google" className="w-5 h-5 mr-2" />
      Sign in with Google
    </button>
  );
};

export default OAuth;

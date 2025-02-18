import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInSuccess, signInFailure } from "../../redux/recruiter/recruiterSlice";
import OAuth from "./OAuth";

const SigninPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const { loading, error } = useSelector((state) => state.recruiter);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/recruiter");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <Layout buttonText="SIGN UP">
      <div className="w-full max-w-lg relative flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 font-inter">
      <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl bg-white shadow-md rounded-md px-4 py-6 sm:px-8 sm:py-10 font-inter">
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800">Log in to TalentScout</h1>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">Quick & Simple way to Automate your hiring process</p>
          </div>

          {error && <p className="text-red-500 text-xs sm:text-sm mb-3 text-center">{error}</p>}

          <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="johndoe@example.com"
                className="mt-1 block w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                className="mt-1 block w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between mt-3">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-xs sm:text-sm text-gray-700">
                  <u>Remember Me</u>
                </label>
              </div>
              <div className="mt-2 sm:mt-0">
                <Link to="/forgotpassword" className="text-xs sm:text-sm text-blue-600 hover:underline">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-xs sm:text-sm"
              style={{ background: "#144066" }}
            >
              {loading ? "Logging in..." : "PROCEED"}
            </button>
          </form>

          <div className="my-2 sm:my-2 flex items-center">
            <div className="border-t border-gray-300 flex-grow"></div>
            <span className="mx-3 sm:mx-4 text-gray-500 text-xs sm:text-sm">OR</span>
            <div className="border-t border-gray-300 flex-grow"></div>
          </div>

          <OAuth />
        </div>
      </div>
    </Layout>
  );
};

export default SigninPage;

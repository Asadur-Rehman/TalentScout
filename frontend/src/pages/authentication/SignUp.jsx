import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import OAuth from "./OAuth";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    organizationname: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.terms) {
      setError("You must agree to the Terms and Privacy Policy.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log(data);

      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }

      navigate("/login");
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout buttonText="SIGN IN">
      <div className="w-full max-w-lg  flex relative items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 font-inter">
        <div className="w-full max-w-lg sm:max-w-xl bg-white shadow-md rounded-md px-8 sm:px-10 py-6 sm:py-8 max-h-[95vh] font-inter">
          <div className="text-center mb-4 sm:mb-5">
            <h1 className="text-sm sm:text-lg md:text-xl font-semibold text-gray-800">
              Sign up to TalentScout
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">
              Quick & Simple way to Automate your hiring process
            </p>
          </div>

          {error && (
            <p className="text-red-500 text-xs sm:text-sm mb-3 text-center">
              {error}
            </p>
          )}
          <form className="space-y-2 sm:space-y-3" onSubmit={handleSubmit}>
            {[
              {
                id: "username",
                label: "First Name",
                type: "text",
                placeholder: "John",
              },
              {
                id: "organizationname",
                label: "Organization Name",
                type: "text",
                placeholder: "Your Organization",
              },
              {
                id: "email",
                label: "Email Address",
                type: "email",
                placeholder: "johndoe@example.com",
              },
              {
                id: "password",
                label: "Password",
                type: "password",
                placeholder: "********",
              },
              {
                id: "confirmPassword",
                label: "Confirm Password",
                type: "password",
                placeholder: "********",
              },
            ].map(({ id, label, type, placeholder }) => (
              <div key={id}>
                <label
                  htmlFor={id}
                  className="block text-xs sm:text-sm md:text-base font-medium text-gray-700"
                >
                  {label}
                </label>
                <input
                  type={type}
                  id={id}
                  value={formData[id]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="mt-1 block w-full px-2 sm:px-3 py-1 sm:py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
                  required
                />
              </div>
            ))}

            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                checked={formData.terms}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-xs sm:text-sm text-gray-700"
              >
                I agree to the{" "}
                <Link to="/terms" className="text-blue-500">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-blue-500">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-xs sm:text-sm"
              style={{ background: "#144066" }}
            >
              {loading ? "Creating Account..." : "CREATE AN ACCOUNT"}
            </button>
          </form>

          <div className="my-2 sm:my-2 flex items-center">
            <div className="border-t border-gray-300 flex-grow"></div>
            <span className="mx-3 sm:mx-4 text-gray-500 text-xs sm:text-sm">
              OR
            </span>
            <div className="border-t border-gray-300 flex-grow"></div>
          </div>

          <OAuth />
        </div>
      </div>
    </Layout>
  );
};

export default SignupPage;

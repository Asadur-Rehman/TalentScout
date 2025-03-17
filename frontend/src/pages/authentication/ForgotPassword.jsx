import React from "react";
import { Link } from "react-router-dom";
import Layout from "./Layout";

const ForgotPassword = () => {
  return (
    <Layout buttonText="SIGN UP">
            <div className="w-full max-w-lg relative flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 font-inter">
      <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl bg-white shadow-md rounded-md px-4 py-6 sm:px-8 sm:py-10 font-inter">
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800">Forgot Password?</h1>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">Don’t worry, we have got you covered!</p>
          </div>

          <form className="space-y-3 sm:space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs sm:text-sm md:text-base font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="johndoe@example.com"
                className="mt-1 block w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm md:text-base"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-xs sm:text-sm md:text-base"
              style={{ background: "#144066" }}
            >
              RESET PASSWORD
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;

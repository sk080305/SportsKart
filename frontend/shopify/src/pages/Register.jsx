import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { motion } from "framer-motion";
import { FaRunning } from "react-icons/fa"; // Brand icon

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCaptcha = (token) => {
    setCaptchaVerified(!!token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!captchaVerified) {
      setError("Please verify the CAPTCHA");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/register", formData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-tr from-gray-950 via-gray-900 to-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-gray-900/90 border border-gray-800 text-white p-8 rounded-xl shadow-2xl backdrop-blur-md"
      >
        <div className="flex justify-center items-center mb-6">
          <FaRunning className="text-blue-400 text-3xl mr-2" />
          <h2 className="text-3xl font-extrabold tracking-wide text-blue-400">
            SportsKart
          </h2>
        </div>

        <h3 className="text-lg text-center mb-4 text-gray-300 font-semibold">
          Create your account
        </h3>

        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <div className="flex justify-center">
            <ReCAPTCHA
              sitekey="6LfPw3UrAAAAALYtoUAA8LgItMNTvuR0pxOB5dap"
              onChange={handleCaptcha}
            />
          </div>

          <button
            type="submit"
            disabled={!captchaVerified}
            className={`w-full py-2 rounded-lg font-semibold transition ${
              captchaVerified
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-600 text-gray-300 cursor-not-allowed"
            }`}
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;

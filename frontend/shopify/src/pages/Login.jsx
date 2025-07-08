import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ReCAPTCHA from "react-google-recaptcha";

const Login = () => {
  const navigate = useNavigate();
  const { login: setAuthUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCaptchaChange = (token) => {
    setCaptchaVerified(!!token);
    setCaptchaToken(token);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!captchaVerified || !captchaToken) {
      setError("Please verify the CAPTCHA.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      setAuthUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      navigate(data.role === "admin" ? "/admindashboard" : "/userdashboard");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-tr from-gray-950 via-gray-900 to-gray-800">
  <div className="w-full max-w-md bg-gray-900/90 border border-gray-800 text-white p-8 rounded-xl shadow-2xl backdrop-blur-md">
    <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-300 tracking-wide">
      Welcome Back
    </h2>

    {error && (
      <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
    )}

    <form onSubmit={handleLogin} className="space-y-5">
      <input
        type="email"
        placeholder="Email"
        className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <div className="flex justify-center">
        <ReCAPTCHA
          sitekey="6LfPw3UrAAAAALYtoUAA8LgItMNTvuR0pxOB5dap"
          onChange={handleCaptchaChange}
        />
      </div>

      <button
        type="submit"
        disabled={loading || !captchaVerified}
        className="w-full bg-gray-700 hover:bg-gray-600 py-3 font-semibold rounded-md transition"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>

    <p className="mt-6 text-sm text-center text-gray-400">
      Don’t have an account?{" "}
      <Link
        to="/register"
        className="text-gray-300 hover:underline font-medium"
      >
        Register
      </Link>
    </p>
  </div>
</div>



  );
};

export default Login;

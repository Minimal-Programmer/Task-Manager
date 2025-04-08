import { useState } from "react";
import { registerUser } from "../api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import illustration from "../assets/register-illustration.png"; // ✅ Ensure correct path

const Register = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.username.trim() || !formData.password.trim()) {
      setError("⚠️ Username and Password are required.");
      return false;
    }
    if (formData.username.length < 3) {
      setError("⚠️ Username must be at least 3 characters long.");
      return false;
    }
    if (formData.password.length < 6) {
      setError("⚠️ Password must be at least 6 characters long.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    try {
      await registerUser(formData);
      setSuccess("✅ Registration successful! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setError(error.response?.data?.detail || "❌ Registration failed.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Section - Registration Form */}
      <div className="w-1/2 flex items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Join Us Today!</h2>
          <p className="text-gray-500 mb-6">Create your account and start managing tasks.</p>

          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          {success && <p className="text-green-500 text-sm text-center mb-4">{success}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium">Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                className="w-full px-4 py-3 mt-1 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 mt-1 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex items-center">
              <input type="checkbox" id="terms" className="w-4 h-4 text-blue-500" required />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                I agree to the <a href="#" className="text-blue-500 hover:underline">Terms & Conditions</a>
              </label>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3 text-white font-semibold rounded-md shadow-md transition-all bg-blue-500 hover:bg-blue-600"
            >
              Sign Up
            </motion.button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 font-semibold hover:underline">
              Log in here
            </a>
          </p>
        </motion.div>
      </div>

      {/* Right Section - Illustration with White Background */}
      <div className="w-1/2 flex items-center justify-center bg-white shadow-lg p-8 rounded-lg">
        <img src={illustration} alt="Illustration" className="w-3/4" />
      </div>
    </div>
  );
};

export default Register;

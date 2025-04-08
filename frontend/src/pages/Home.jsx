import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-center px-6">
      {/* Animated Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-6xl font-extrabold mb-6 drop-shadow-lg"
      >
        Welcome to Task Manager
      </motion.h1>

      {/* Subtitle with a fade-in effect */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="text-lg text-gray-200 max-w-2xl"
      >
        Organize your tasks efficiently with our simple and intuitive Task Manager.
        Plan, prioritize, and track your progress effortlessly.
      </motion.p>

      {/* Animated Buttons */}
      <div className="mt-8 flex space-x-6">
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Link 
            to="/login" 
            className="px-6 py-3 text-lg font-semibold rounded-md bg-white text-blue-600 hover:bg-blue-100 transition-all shadow-lg"
          >
            Login
          </Link>
        </motion.div>

        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Link 
            to="/register" 
            className="px-6 py-3 text-lg font-semibold rounded-md bg-yellow-400 hover:bg-yellow-500 text-gray-900 transition-all shadow-lg"
          >
            Register
          </Link>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-5 text-gray-300 text-sm">
        © {new Date().getFullYear()} Task Manager. All Rights Reserved.
      </footer>
    </div>
  );
};

export default Home;

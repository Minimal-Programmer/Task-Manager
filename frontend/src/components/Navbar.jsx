import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { token, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Navbar */}
      <nav className="sticky top-0 left-0 w-full bg-white/90 backdrop-blur-md shadow-sm py-3 px-6 flex justify-between items-center z-50">
        
        {/* Logo (Left Side) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xl font-semibold text-gray-800"
        >
          <Link to="/">Task<span className="text-blue-600">Manager</span></Link>
        </motion.div>

        {/* Center Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <NavItem to="/" label="Home" />
          {token && <NavItem to="/dashboard" label="Dashboard" />}
        </div>

        {/* Logout (Right Side) */}
        <div className="hidden md:flex">
          {token ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
            >
              Logout
            </motion.button>
          ) : (
            <div className="flex space-x-4">
              <NavItem to="/login" label="Login" />
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
                >
                  Register
                </Link>
              </motion.div>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white shadow-md absolute top-12 left-0 w-full p-4 flex flex-col items-center space-y-4"
        >
          <NavItem to="/" label="Home" onClick={() => setMenuOpen(false)} />
          {token && <NavItem to="/dashboard" label="Dashboard" onClick={() => setMenuOpen(false)} />}
          
          {token ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
            >
              Logout
            </motion.button>
          ) : (
            <>
              <NavItem to="/login" label="Login" onClick={() => setMenuOpen(false)} />
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </Link>
              </motion.div>
            </>
          )}
        </motion.div>
      )}
    </>
  );
};

// Reusable Nav Item Component
const NavItem = ({ to, label, onClick }) => (
  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
    <Link to={to} onClick={onClick} className="text-gray-700 hover:text-blue-600 font-medium transition">
      {label}
    </Link>
  </motion.div>
);

export default Navbar;

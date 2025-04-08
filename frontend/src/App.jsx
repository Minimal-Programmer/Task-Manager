import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "../src/context/AuthContext";
import { useContext } from "react";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";

const PrivateRoute = ({ element, allowedRoles }) => {
  const { token, userRole } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return element;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Role-based dashboard redirection */}
          <Route path="/dashboard" element={
            <PrivateRoute 
              element={localStorage.getItem("role") === "superuser" ? <AdminDashboard /> : <UserDashboard />}
            />
          } />

          {/* Specific Dashboards */}
          <Route path="/admin-dashboard" element={<PrivateRoute element={<AdminDashboard />} allowedRoles={["superuser"]} />} />
          <Route path="/user-dashboard" element={<PrivateRoute element={<UserDashboard />} allowedRoles={["user"]} />} />

          {/* Catch-All Redirect */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

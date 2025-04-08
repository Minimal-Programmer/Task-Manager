import { useState, useEffect, useContext } from "react";
import { getProfile, updateProfile, changePassword } from "../api";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      getProfile(user.token)
        .then((res) => setProfile(res.data))
        .catch(() => setError("Failed to load profile."));
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const updateUserProfile = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await updateProfile(profile, user.token);
      setMessage("Profile updated successfully!");
    } catch {
      setError("Failed to update profile.");
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await changePassword(passwords, user.token);
      setMessage("Password changed successfully!");
      setPasswords({ oldPassword: "", newPassword: "" });
    } catch {
      setError("Failed to change password.");
    }
  };

  if (!user)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-700">
        <p className="text-lg">Please log in to access your profile.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">User Profile</h2>

        {error && <p className="text-red-500 text-center mb-3">{error}</p>}
        {message && <p className="text-green-500 text-center mb-3">{message}</p>}

        {/* Profile Update Form */}
        <form onSubmit={updateUserProfile} className="space-y-4">
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleProfileChange}
            placeholder="Name"
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleProfileChange}
            placeholder="Email"
            required
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
          >
            Update Profile
          </button>
        </form>

        <h3 className="text-xl font-semibold text-center mt-6 text-gray-800">Change Password</h3>

        {/* Password Change Form */}
        <form onSubmit={updatePassword} className="space-y-4">
          <input
            type="password"
            name="oldPassword"
            value={passwords.oldPassword}
            onChange={handlePasswordChange}
            placeholder="Old Password"
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            name="newPassword"
            value={passwords.newPassword}
            onChange={handlePasswordChange}
            placeholder="New Password"
            required
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700 transition"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;

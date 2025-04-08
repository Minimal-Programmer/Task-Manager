import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import TaskForm from "../components/TaskForm";
import axios from "axios";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const { token, userRole } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:8000/tasks/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data.tasks || response.data || []);
    } catch (error) {
      setError("Failed to fetch tasks.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/users/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const availableUsers = response.data.filter((user) => user.role !== "superuser");
      setUsers(availableUsers);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:8000/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Task deleted successfully!");
      fetchTasks(); // Refresh task list
    } catch (error) {
      alert(error.response?.data?.detail || "Error deleting task.");
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-7xl bg-white p-8 rounded-xl shadow-lg"
      >
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Admin Dashboard</h1>

        {/* Task Form */}
        {userRole === "superuser" && (
          <div className="mb-10">
            <TaskForm refreshTasks={fetchTasks} availableUsers={users} />
          </div>
        )}

        {/* Available Users Section */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-gray-700 text-center">Available Users</h2>
          {users.length > 0 ? (
            <ul className="mt-4 grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {users.map((user) => (
                <li key={user.username} className="p-3 bg-blue-50 rounded-lg text-gray-800 text-center shadow-md">
                  {user.username}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-600">No users available.</p>
          )}
        </div>

        {/* Task List */}
        <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">Task List</h2>
        {loading ? (
          <p className="text-center text-gray-500">Loading tasks...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : tasks.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="relative bg-blue-50 shadow-md rounded-lg border border-gray-300 p-5 hover:shadow-xl transition"
              >
                {/* Priority Tag (Fixed Top Left) */}
                <span
                  className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold uppercase rounded-lg ${
                    task.priority === "High"
                      ? "bg-red-500 text-white"
                      : task.priority === "Medium"
                      ? "bg-yellow-500 text-white"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {task.priority}
                </span>

                {/* Task Title */}
                <h3 className="text-lg font-bold text-gray-900 mt-6">{task.title}</h3>
                <p className="text-gray-600 text-sm mt-2">{task.description}</p>

                {/* Task Status & Due Date */}
                <div className="mt-4 flex items-center justify-between">
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${
                      task.completed ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"
                    }`}
                  >
                    {task.completed ? "Completed" : "Pending"}
                  </span>
                  <span className="text-sm text-gray-500">
                    Due: <span className="font-medium">{new Date(task.due_date).toLocaleDateString()}</span>
                  </span>
                </div>

                {/* Assigned To */}
                <div className="mt-3 p-3 bg-white rounded-md text-sm shadow-sm">
                  <p className="text-gray-700">
                    <span className="font-semibold">Assigned To:</span> {task.assigned_to}
                  </p>
                </div>

                {/* Delete Task Button */}
                <button
                  onClick={() => deleteTask(task.id)} // Replace with actual delete function
                  className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Delete Task
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No tasks available.</p>
        )}
      </motion.div>
    </div>
  );
};

export default AdminDashboard;

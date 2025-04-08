import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";

const UserDashboard = () => {
  const { token } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserTasks = async () => {
      try {
        const response = await axios.get("http://localhost:8000/tasks/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTasks(response.data.tasks || response.data || []);
      } catch (error) {
        setError("Failed to load tasks.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUserTasks();
    } else {
      setError("Authentication error. Please log in.");
    }
  }, [token]);

  const markTaskAsCompleted = async (taskId) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/tasks/complete/${taskId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: true } : task)));
      } else {
        setError("Failed to mark task as completed.");
      }
    } catch (error) {
      setError(error.response?.data?.detail || "Error completing task.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-7xl bg-white p-8 rounded-xl shadow-lg"
      >
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">User Dashboard</h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading tasks...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : tasks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

                {/* Complete Task Button */}
                {!task.completed && (
                  <button
                    onClick={() => markTaskAsCompleted(task.id)}
                    className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
                  >
                    Mark as Completed
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No tasks assigned to you.</p>
        )}
      </motion.div>
    </div>
  );
};

export default UserDashboard;

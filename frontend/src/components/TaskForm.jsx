import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const TaskForm = ({ refreshTasks }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8000/users/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const availableUsers = response.data.filter((user) => user.role !== "superuser");
        setUsers(availableUsers);
      } catch (error) {
        setError("Failed to fetch users.");
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:8000/tasks/create",
        { title, description, priority, due_date: dueDate, assigned_to: assignedTo },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTitle("");
      setDescription("");
      setPriority("Medium");
      setDueDate("");
      setAssignedTo("");

      refreshTasks();
    } catch (error) {
      setError(error.response?.data?.detail || "Error creating task.");
    }

    setIsSubmitting(false);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="bg-white p-6 shadow-lg rounded-xl border border-blue-200 max-w-lg mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold text-center text-blue-700 mb-5">Create a New Task</h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Title */}
      <div className="mb-4">
        <label className="block text-blue-600 font-medium mb-1">Task Title</label>
        <input
          type="text"
          placeholder="Enter task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-3 rounded-lg border border-blue-300 bg-blue-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block text-blue-600 font-medium mb-1">Description</label>
        <textarea
          placeholder="Enter task description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
          className="w-full p-3 rounded-lg border border-blue-300 bg-blue-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Priority */}
      <div className="mb-4">
        <label className="block text-blue-600 font-medium mb-1">Priority</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          required
          className="w-full p-3 rounded-lg border border-blue-300 bg-blue-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {/* Due Date */}
      <div className="mb-4">
        <label className="block text-blue-600 font-medium mb-1">Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
          className="w-full p-3 rounded-lg border border-blue-300 bg-blue-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Assigned To (Dropdown) */}
      <div className="mb-6">
        <label className="block text-blue-600 font-medium mb-1">Assign To</label>
        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          required
          className="w-full p-3 rounded-lg border border-blue-300 bg-blue-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">Select a user</option>
          {users.map((user) => (
            <option key={user.username} value={user.username}>
              {user.username}
            </option>
          ))}
        </select>
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isSubmitting}
        className="w-full p-3 text-white font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 transition-all"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isSubmitting ? "Creating..." : "Create Task"}
      </motion.button>
    </motion.form>
  );
};

export default TaskForm;

import { useEffect, useState, useContext } from "react";
import { getTasks } from "../api";
import { AuthContext } from "../context/AuthContext";
import TaskForm from "../components/TaskForm";
import TaskItem from "../components/TaskItem";
import TaskFilters from "../components/TaskFilter";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({ priority: "", sortByDueDate: "" });
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTasks = () => {
    getTasks(null, filters, page, pageSize)
      .then((res) => {
        setTasks(res.data.tasks || []);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  };

  useEffect(() => {
    fetchTasks();
  }, [user, filters, page]);

  if (!user)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 text-gray-800">
        <p className="text-lg font-semibold">Please log in to view your tasks.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start p-6 pt-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg border border-gray-200"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Task Dashboard
        </h2>

        {/* Task Form */}
        <div className="mb-6 p-5 bg-gray-100 border border-gray-300 rounded-lg shadow-sm">
          <TaskForm refreshTasks={fetchTasks} token={user.token} />
        </div>

        {/* Task Filters */}
        <div className="mb-4">
          <TaskFilters filters={filters} setFilters={setFilters} />
        </div>

        {/* Task List */}
        {tasks.length === 0 ? (
          <p className="text-center text-gray-500 text-lg mt-4">No tasks found.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {tasks?.map((task) => (
              <motion.li
                key={task.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white border border-gray-300 p-4 rounded-lg shadow-md transition-all"
              >
                <TaskItem task={task} refreshTasks={fetchTasks} token={user.token} />
              </motion.li>
            ))}
          </ul>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-6">
          <motion.button
            whileHover={{ scale: page === 1 ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className={`px-4 py-2 rounded-lg transition-all ${
              page === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            ← Previous
          </motion.button>
          <span className="text-gray-700 font-medium">
            Page {page} of {totalPages}
          </span>
          <motion.button
            whileHover={{ scale: page === totalPages ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className={`px-4 py-2 rounded-lg transition-all ${
              page === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Next →
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;

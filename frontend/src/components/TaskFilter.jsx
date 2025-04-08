const TaskFilters = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow-md">
      {/* Priority Filter */}
      <div className="flex flex-col w-full md:w-1/2">
        <label className="text-gray-700 font-medium">Filter by Priority</label>
        <select
          name="priority"
          value={filters.priority}
          onChange={handleChange}
          className="mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        >
          <option value="">All</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* Due Date Sorting */}
      <div className="flex flex-col w-full md:w-1/2">
        <label className="text-gray-700 font-medium">Sort by Due Date</label>
        <select
          name="sortByDueDate"
          value={filters.sortByDueDate}
          onChange={handleChange}
          className="mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        >
          <option value="">Default</option>
          <option value="asc">Oldest First</option>
          <option value="desc">Newest First</option>
        </select>
      </div>
    </div>
  );
};

export default TaskFilters;

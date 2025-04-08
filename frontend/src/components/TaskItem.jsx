import { updateTask, deleteTask } from "../api";
import { useState } from "react";

const TaskItem = ({ task, refreshTasks, token }) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const toggleStatus = async () => {
        setIsUpdating(true);
        try {
            await updateTask(task.id, { completed: !task.completed }, token);
            refreshTasks();
        } catch (error) {
            console.error("Failed to update task:", error);
        }
        setIsUpdating(false);
    };

    const removeTask = async () => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            setIsDeleting(true);
            try {
                await deleteTask(task.id, token);
                refreshTasks();
            } catch (error) {
                console.error("Failed to delete task:", error);
            }
            setIsDeleting(false);
        }
    };

    const getPriorityClass = (priority) => {
        switch (priority) {
            case "High": return "text-red-600 font-bold";
            case "Medium": return "text-green-600 font-bold";
            case "Low": return "text-blue-600 font-bold";
            default: return "text-gray-600";
        }
    };

    return (
        <li className="p-4 rounded-lg shadow-sm flex flex-col gap-2 bg-white">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{task.title}</h3>
                <span className={`px-2 py-1 text-xs font-bold rounded ${task.completed ? "bg-green-200 text-green-700" : "bg-yellow-200 text-yellow-700"}`}>
                    {task.completed ? "Completed" : "Pending"}
                </span>
            </div>
            <div className="text-sm text-gray-600">
                <p><strong>Priority:</strong> <span className={getPriorityClass(task.priority)}>{task.priority}</span></p>
                <p><strong>Assigned to:</strong> {task.assigned_to || "Unassigned"}</p>
                <p><strong>Due Date:</strong> {task.due_date ? new Date(task.due_date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }) : "No Due Date"}</p>
            </div>
            <div className="flex justify-end gap-2">
                <button 
                    onClick={toggleStatus} 
                    disabled={isUpdating} 
                    className={`px-3 py-1 text-white rounded ${isUpdating ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"}`}
                >
                    {isUpdating ? "Updating..." : task.completed ? "Mark as Pending" : "Mark as Completed"}
                </button>
                <button 
                    onClick={removeTask} 
                    disabled={isDeleting} 
                    className={`px-3 py-1 text-white rounded ${isDeleting ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"}`}
                >
                    {isDeleting ? "Deleting..." : "Delete"}
                </button>
            </div>
        </li>
    );
};

export default TaskItem;

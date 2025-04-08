import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";// Adjust if using a different backend URL

export const registerUser = async (userData) => {
  return axios.post(`${API_BASE_URL}/users/register`, userData);
};

export const loginUser = async (userData) => {
  return axios.post(`${API_BASE_URL}/users/login`, userData);
};

export const getTasks = async (token, filters, page, pageSize) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  return axios.get(`${API_BASE_URL}/tasks`, { headers, params: { ...filters, page, pageSize } });
};
  

export const createTask = async (taskData, token) => {
    console.log("Inside createtask");
    return axios.post(`${API_BASE_URL}/tasks`, taskData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };
  
  export const updateTask = async (taskId, updatedFields, token) => {
    try {
        const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
            method: "PATCH",  // ✅ Use PATCH instead of PUT
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(updatedFields)  // ✅ Send only changed fields
        });

        if (!response.ok) throw new Error(`Failed to update task: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Update Task Error:", error);
    }
};
  
export const deleteTask = async (taskId, token) => {
  try {
      const response = await axios.delete(`${API_BASE_URL}/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Task Deleted:", response.data); // Debug log
      return response.data;
  } catch (error) {
      console.error("Error deleting task:", error.response?.data || error.message);
      throw error;
  }
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};

export const getProfile = async (token) => {
    return axios.get(`${API_BASE_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };
  
  export const updateProfile = async (userData, token) => {
    return axios.put(`${API_BASE_URL}/users/profile`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };
  
  export const changePassword = async (passwordData, token) => {
    return axios.put(`${API_BASE_URL}/users/change-password`, passwordData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };
  
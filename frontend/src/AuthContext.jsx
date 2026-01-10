import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
const API_URL = "http://localhost:5002/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      // Verify token is still valid
      fetchMe(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchMe = async (authToken) => {
    try {
      const response = await fetch(`${API_URL}/user/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        // Token is invalid
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    setError(null);
    try {
      const response = await fetch(`${API_URL}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Registration failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.accessToken);
      setToken(data.accessToken);

      // Fetch user data after registration
      await fetchMe(data.accessToken);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const login = async (usernameOrEmail, password) => {
    setError(null);
    try {
      const response = await fetch(`${API_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usernameOrEmail, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Login failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.accessToken);
      setToken(data.accessToken);

      // Fetch user data after login
      await fetchMe(data.accessToken);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setError(null);
  };

  // Todo Lists API
  const getLists = async () => {
    try {
      const response = await fetch(`${API_URL}/todo/lists`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch lists");
      return await response.json();
    } catch (err) {
      console.error("Error fetching lists:", err);
      throw err;
    }
  };

  const getList = async (listId) => {
    try {
      const response = await fetch(`${API_URL}/todo/lists/${listId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch list");
      return await response.json();
    } catch (err) {
      console.error("Error fetching list:", err);
      throw err;
    }
  };

  const createList = async (name) => {
    try {
      const response = await fetch(`${API_URL}/todo/lists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) throw new Error("Failed to create list");
      return await response.json();
    } catch (err) {
      console.error("Error creating list:", err);
      throw err;
    }
  };

  const updateList = async (listId, name) => {
    try {
      const response = await fetch(`${API_URL}/todo/lists/${listId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) throw new Error("Failed to update list");
      return await response.json();
    } catch (err) {
      console.error("Error updating list:", err);
      throw err;
    }
  };

  const deleteList = async (listId) => {
    try {
      const response = await fetch(`${API_URL}/todo/lists/${listId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete list");
    } catch (err) {
      console.error("Error deleting list:", err);
      throw err;
    }
  };

  // Todo Tasks API
  const getTasks = async (listId) => {
    try {
      const response = await fetch(`${API_URL}/todo/lists/${listId}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch tasks");
      return await response.json();
    } catch (err) {
      console.error("Error fetching tasks:", err);
      throw err;
    }
  };

  const createTask = async (listId, title, description) => {
    try {
      const response = await fetch(`${API_URL}/todo/lists/${listId}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      });
      if (!response.ok) throw new Error("Failed to create task");
      return await response.json();
    } catch (err) {
      console.error("Error creating task:", err);
      throw err;
    }
  };

  const updateTask = async (taskId, title, description, isCompleted) => {
    try {
      const response = await fetch(`${API_URL}/todo/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, isCompleted }),
      });
      if (!response.ok) throw new Error("Failed to update task");
      return await response.json();
    } catch (err) {
      console.error("Error updating task:", err);
      throw err;
    }
  };

  const patchTask = async (taskId, isCompleted) => {
    try {
      const response = await fetch(`${API_URL}/todo/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isCompleted }),
      });
      if (!response.ok) throw new Error("Failed to patch task");
      return await response.json();
    } catch (err) {
      console.error("Error patching task:", err);
      throw err;
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`${API_URL}/todo/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete task");
    } catch (err) {
      console.error("Error deleting task:", err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        register,
        login,
        logout,
        isAuthenticated: !!user && !!token,
        getLists,
        getList,
        createList,
        updateList,
        deleteList,
        getTasks,
        createTask,
        updateTask,
        patchTask,
        deleteTask,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

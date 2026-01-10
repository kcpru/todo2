import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { useTheme } from "./ThemeContext";
import { useAuth } from "./AuthContext";
import "./App.css";
import demoVideo from "./assets/video.mp4";

function App() {
  const navigate = useNavigate();
  const {
    user,
    logout,
    isAuthenticated,
    loading,
    getLists,
    createList,
    deleteList,
    createTask,
    updateTask,
    patchTask,
    deleteTask,
  } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [lists, setLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState(null);
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [loadingLists, setLoadingLists] = useState(true);
  const [loadingTodos, setLoadingTodos] = useState(false);
  const [newListName, setNewListName] = useState("");
  const { isDarkMode, toggleTheme } = useTheme();

  // Load lists on mount
  useEffect(() => {
    if (isAuthenticated && !loading) {
      loadLists();
    }
  }, [isAuthenticated, loading]);

  // Load tasks when list is selected
  useEffect(() => {
    if (selectedListId && isAuthenticated) {
      loadTasks();
    }
  }, [selectedListId, isAuthenticated]);

  // Redirect to login if not authenticated
  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const loadLists = async () => {
    try {
      setLoadingLists(true);
      const data = await getLists();
      setLists(data || []);
      if (data && data.length > 0 && !selectedListId) {
        setSelectedListId(data[0].id);
      }
    } catch (err) {
      console.error("Failed to load lists:", err);
    } finally {
      setLoadingLists(false);
    }
  };

  const loadTasks = async () => {
    try {
      setLoadingTodos(true);
      const tasksResponse = await getLists();
      const list = tasksResponse.find((l) => l.id === selectedListId);
      setTodos(list?.items || []);
    } catch (err) {
      console.error("Failed to load tasks:", err);
    } finally {
      setLoadingTodos(false);
    }
  };

  const handleAddList = async () => {
    if (!newListName.trim()) return;
    try {
      const newList = await createList(newListName);
      setLists([newList, ...lists]);
      setNewListName("");
      setSelectedListId(newList.id);
    } catch (err) {
      console.error("Failed to create list:", err);
    }
  };

  const handleDeleteList = async (listId) => {
    try {
      await deleteList(listId);
      setLists(lists.filter((l) => l.id !== listId));
      if (selectedListId === listId) {
        const nextList = lists.find((l) => l.id !== listId);
        setSelectedListId(nextList?.id || null);
      }
    } catch (err) {
      console.error("Failed to delete list:", err);
    }
  };

  const toggleTodo = async (id) => {
    const todo = todos.find((t) => t.id === id);

    // Trigger confetti when marking as completed
    if (todo && !todo.isCompleted) {
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
      };

      function fire(particleRatio, opts) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      }

      // Fire multiple bursts with slight delays
      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });

      setTimeout(
        () =>
          fire(0.2, {
            spread: 60,
          }),
        50
      );

      setTimeout(
        () =>
          fire(0.35, {
            spread: 100,
            decay: 0.91,
            scalar: 0.8,
          }),
        100
      );

      setTimeout(
        () =>
          fire(0.1, {
            spread: 120,
            startVelocity: 25,
            decay: 0.92,
            scalar: 1.2,
          }),
        150
      );

      setTimeout(
        () =>
          fire(0.1, {
            spread: 120,
            startVelocity: 45,
          }),
        200
      );
    }

    try {
      await patchTask(id, !todo.isCompleted);
      const updatedTodos = todos.map((t) =>
        t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
      );
      setTodos(updatedTodos);

      // Update lists with updated items
      setLists(
        lists.map((list) =>
          list.id === selectedListId ? { ...list, items: updatedTodos } : list
        )
      );
    } catch (err) {
      console.error("Failed to toggle task:", err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await deleteTask(id);
      const updatedTodos = todos.filter((todo) => todo.id !== id);
      setTodos(updatedTodos);

      // Update lists with new item count
      setLists(
        lists.map((list) =>
          list.id === selectedListId ? { ...list, items: updatedTodos } : list
        )
      );
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const addTodo = () => {
    if (!selectedListId) return;
    setEditingId("new");
    setEditingText("New task");
    setEditingDescription("");
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditingText(todo.title);
    setEditingDescription(todo.description || "");
  };

  const saveEdit = async () => {
    if (!editingText.trim()) return;

    try {
      if (editingId === "new") {
        const newTask = await createTask(
          selectedListId,
          editingText,
          editingDescription
        );
        const updatedTodos = [...todos, newTask];
        setTodos(updatedTodos);

        // Update lists with new item count
        setLists(
          lists.map((list) =>
            list.id === selectedListId ? { ...list, items: updatedTodos } : list
          )
        );
      } else {
        const updatedTask = await updateTask(
          editingId,
          editingText,
          editingDescription,
          todos.find((t) => t.id === editingId)?.isCompleted || false
        );
        const updatedTodos = todos.map((todo) =>
          todo.id === editingId ? updatedTask : todo
        );
        setTodos(updatedTodos);

        // Update lists with updated items
        setLists(
          lists.map((list) =>
            list.id === selectedListId ? { ...list, items: updatedTodos } : list
          )
        );
      }
      setEditingId(null);
      setEditingText("");
      setEditingDescription("");
    } catch (err) {
      console.error("Failed to save task:", err);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
    setEditingDescription("");
  };

  const filteredTodos = todos.filter((todo) => {
    const matchesSearch = todo.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    if (filter === "ALL") return matchesSearch;
    if (filter === "ACTIVE") return !todo.isCompleted && matchesSearch;
    if (filter === "COMPLETED") return todo.isCompleted && matchesSearch;
    return matchesSearch;
  });

  const selectedList = lists.find((l) => l.id === selectedListId);

  return (
    <div className="app">
      {/* User Profile Button */}
      <div className="profile-container">
        <motion.button
          className="profile-button"
          onClick={() => setShowProfile(!showProfile)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={user?.username}
        >
          {user?.username?.charAt(0).toUpperCase() || "U"}
        </motion.button>

        <AnimatePresence>
          {showProfile && (
            <motion.div
              className="profile-menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="profile-info">
                <div className="profile-username">{user?.username}</div>
                <div className="profile-email">{user?.email}</div>
              </div>
              <button
                className="profile-theme-btn"
                onClick={toggleTheme}
                title={isDarkMode ? "Light Mode" : "Dark Mode"}
              >
                {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
              </button>
              <button
                className="profile-logout"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="container">
        <h1 className="title">TODO LIST</h1>

        {/* Lists Selector */}
        <div className="lists-section">
          <div className="lists-header">
            <h2 className="lists-title">My Lists</h2>
          </div>
          {loadingLists ? (
            <div className="loading-lists">Loading lists...</div>
          ) : (
            <>
              <div className="lists-container">
                {lists.map((list) => (
                  <div key={list.id} className="list-item-container">
                    <motion.button
                      className={`list-item ${
                        selectedListId === list.id ? "active" : ""
                      }`}
                      onClick={() => setSelectedListId(list.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="list-name">{list.name}</span>
                      <span className="list-count">
                        {list.items?.length || 0}
                      </span>
                    </motion.button>
                    <motion.button
                      className="list-delete-btn"
                      onClick={() => handleDeleteList(list.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Delete list"
                    >
                      🗑️
                    </motion.button>
                  </div>
                ))}
              </div>
              <div className="new-list-input-container">
                <input
                  type="text"
                  className="new-list-input"
                  placeholder="Create new list..."
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddList()}
                />
                <motion.button
                  className="new-list-btn"
                  onClick={handleAddList}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  +
                </motion.button>
              </div>
            </>
          )}
        </div>

        {/* Tasks Section */}
        <AnimatePresence mode="wait">
          {selectedList && (
            <motion.div
              key={selectedList.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="controls">
                <div className="search-container">
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search task..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <span className="search-icon">🔍</span>
                </div>

                <select
                  className="filter-select"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="ALL">ALL</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
              </div>

              {loadingTodos ? (
                <div className="loading-todos">Loading tasks...</div>
              ) : (
                <>
                  <div className="todo-list">
                    <AnimatePresence mode="popLayout">
                      {filteredTodos.length === 0 ? (
                        <div className="no-todos">
                          No tasks yet. Add one to get started!
                        </div>
                      ) : (
                        filteredTodos.map((todo) => (
                          <motion.div
                            key={todo.id}
                            className="todo-item"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <input
                              type="checkbox"
                              className="todo-checkbox"
                              checked={todo.isCompleted}
                              onChange={() => toggleTodo(todo.id)}
                            />
                            <div className="todo-content">
                              <span
                                className={`todo-text ${
                                  todo.isCompleted ? "completed" : ""
                                }`}
                              >
                                {todo.title}
                              </span>
                              {todo.description && (
                                <span className="todo-description">
                                  {todo.description}
                                </span>
                              )}
                            </div>
                            <div className="todo-actions">
                              <button
                                className="todo-action-btn edit-btn"
                                onClick={() => startEdit(todo)}
                              >
                                ✏️
                              </button>
                              <button
                                className="todo-action-btn delete-btn"
                                onClick={() => deleteTodo(todo.id)}
                              >
                                🗑️
                              </button>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </AnimatePresence>
                  </div>

                  <motion.button
                    className="add-btn"
                    onClick={addTodo}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Add new task"
                  >
                    + Add Task
                  </motion.button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {editingId && (
            <motion.div
              className="modal-overlay"
              onClick={cancelEdit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="modal"
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="modal-title">
                  {editingId === "new" ? "NEW TASK" : "EDIT TASK"}
                </h2>
                <input
                  type="text"
                  className="modal-input"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  placeholder="Task title..."
                  autoFocus
                />
                <textarea
                  className="modal-textarea"
                  value={editingDescription}
                  onChange={(e) => setEditingDescription(e.target.value)}
                  placeholder="Task description (optional)..."
                  rows="3"
                />
                <div className="modal-buttons">
                  <button className="modal-btn cancel-btn" onClick={cancelEdit}>
                    CANCEL
                  </button>
                  <button className="modal-btn apply-btn" onClick={saveEdit}>
                    APPLY
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <video
          className="fixed-video"
          src={demoVideo}
          autoPlay
          muted
          loop
          playsInline
        />
      </div>
    </div>
  );
}

export default App;

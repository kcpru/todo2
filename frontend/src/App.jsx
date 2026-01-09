import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { useTheme } from "./ThemeContext";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: "NOTE #1", completed: false },
    { id: 2, text: "NOTE #2", completed: true },
    { id: 3, text: "NOTE #3", completed: false },
  ]);
  const [filter, setFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const { isDarkMode, toggleTheme } = useTheme();

  const toggleTodo = (id) => {
    const todo = todos.find((t) => t.id === id);

    // Trigger confetti when marking as completed
    if (todo && !todo.completed) {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        duration: 2000,
      });
    }

    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const addTodo = () => {
    const newTodo = {
      id: Math.max(...todos.map((t) => t.id), 0) + 1,
      text: "New note",
      completed: false,
    };
    setTodos([...todos, newTodo]);
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditingText(todo.text);
  };

  const saveEdit = () => {
    if (editingText.trim()) {
      setTodos(
        todos.map((todo) =>
          todo.id === editingId ? { ...todo, text: editingText } : todo
        )
      );
    }
    setEditingId(null);
    setEditingText("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const filteredTodos = todos.filter((todo) => {
    const matchesSearch = todo.text
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    if (filter === "ALL") return matchesSearch;
    if (filter === "ACTIVE") return !todo.completed && matchesSearch;
    if (filter === "COMPLETED") return todo.completed && matchesSearch;
    return matchesSearch;
  });

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">TODO LIST</h1>

        <div className="controls">
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search note..."
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

          <button className="theme-button" onClick={toggleTheme}>
            {isDarkMode ? "⚙️" : "🌙"}
          </button>
        </div>

        <div className="todo-list">
          <AnimatePresence mode="popLayout">
            {filteredTodos.map((todo) => (
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
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />
                <span
                  className={`todo-text ${todo.completed ? "completed" : ""}`}
                >
                  {todo.text}
                </span>
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
            ))}
          </AnimatePresence>
        </div>

        <motion.button
          className="add-btn"
          onClick={addTodo}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          +
        </motion.button>

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
                <h2 className="modal-title">NEW NOTE</h2>
                <input
                  type="text"
                  className="modal-input"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  placeholder="Input your note..."
                  autoFocus
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
      </div>
    </div>
  );
}

export default App;

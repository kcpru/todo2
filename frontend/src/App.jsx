import { useState } from "react";
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
  const { isDarkMode, toggleTheme } = useTheme();

  const toggleTodo = (id) => {
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
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label="Toggle dark mode"
        title={isDarkMode ? "Przełącz na light mode" : "Przełącz na dark mode"}
      >
        {isDarkMode ? "☀️" : "🌙"}
      </button>

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
          {filteredTodos.map((todo) => (
            <div key={todo.id} className="todo-item">
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
                <button className="todo-action-btn edit-btn">✏️</button>
                <button
                  className="todo-action-btn delete-btn"
                  onClick={() => deleteTodo(todo.id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        <button className="add-btn" onClick={addTodo}>
          +
        </button>
      </div>
    </div>
  );
}

export default App;

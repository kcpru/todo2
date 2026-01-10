import { motion, AnimatePresence } from "motion/react";
import { ANIMATION_CONFIG } from "../constants/animations";

export function TodoList({
  todos,
  filteredTodos,
  filter,
  searchTerm,
  loadingTodos,
  onToggleTodo,
  onDeleteTodo,
  onStartEdit,
  onFilterChange,
  onSearchChange,
  onAddTodo,
}) {
  return (
    <>
      <div className="controls">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search task..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>

        <select
          className="filter-select"
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
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
                filteredTodos.map((todo, index) => (
                  <motion.div
                    key={todo.id}
                    className="todo-item"
                    {...ANIMATION_CONFIG.listItem(index)}
                  >
                    <input
                      type="checkbox"
                      className="todo-checkbox"
                      checked={todo.isCompleted}
                      onChange={() => onToggleTodo(todo.id)}
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
                        onClick={() => onStartEdit(todo)}
                      >
                        ✏️
                      </button>
                      <button
                        className="todo-action-btn delete-btn"
                        onClick={() => onDeleteTodo(todo.id)}
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
            onClick={onAddTodo}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Add new task"
          >
            + Add Task
          </motion.button>
        </>
      )}
    </>
  );
}

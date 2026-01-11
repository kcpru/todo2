import { motion, AnimatePresence } from "motion/react";
import { useDopamine } from "../DopamineContext";
import { ANIMATION_CONFIG } from "../constants/animations";
import {
  MdEdit,
  MdDelete,
  MdList,
  MdRadioButtonUnchecked,
  MdCheckCircle,
  MdSearch,
  MdAdd,
} from "react-icons/md";
import { GradientButton } from "./GradientButton";
import { useRipple } from "../hooks/useRipple.jsx";

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
  registerCheckboxPosition,
}) {
  const { isDopamineMode } = useDopamine();
  const {
    createRipple: createSearchRipple,
    RippleContainer: SearchRippleContainer,
  } = useRipple();

  const filters = [
    { value: "ALL", label: "All", icon: <MdList /> },
    { value: "ACTIVE", label: "Active", icon: <MdRadioButtonUnchecked /> },
    { value: "COMPLETED", label: "Done", icon: <MdCheckCircle /> },
  ];

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
            onMouseDown={createSearchRipple}
          />
          <span className="search-icon">
            <MdSearch />
          </span>
          <SearchRippleContainer />
        </div>

        <div className="filter-toggle-group">
          {filters.map((f) => {
            const isActive = filter === f.value;
            return (
              <GradientButton
                key={f.value}
                variant={isActive ? "primary" : "secondary"}
                size="sm"
                iconOnly={false}
                className={`filter-toggle ${isActive ? "active" : ""}`}
                onClick={() => onFilterChange(f.value)}
                title={f.label}
              >
                {f.icon}
                <span>{f.label}</span>
              </GradientButton>
            );
          })}
        </div>
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
                    <div
                      className={`checkbox-wrapper ${
                        isDopamineMode ? "dopamine" : ""
                      }`}
                    >
                      <input
                        id={`cbx-${todo.id}`}
                        type="checkbox"
                        checked={todo.isCompleted}
                        onChange={(e) => {
                          const checkboxElement = e.currentTarget.parentElement;
                          onToggleTodo(todo.id, checkboxElement);
                          if (registerCheckboxPosition) {
                            registerCheckboxPosition(
                              todo.id,
                              checkboxElement.querySelector(".cbx")
                            );
                          }
                        }}
                      />
                      <label className="cbx" htmlFor={`cbx-${todo.id}`}></label>
                    </div>
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
                      <GradientButton
                        variant="secondary"
                        size="sm"
                        iconOnly={true}
                        className="todo-action-btn edit-btn"
                        onClick={() => onStartEdit(todo)}
                      >
                        <MdEdit />
                      </GradientButton>
                      <GradientButton
                        variant="danger"
                        size="sm"
                        iconOnly={true}
                        className="todo-action-btn delete-btn"
                        onClick={() => onDeleteTodo(todo.id)}
                      >
                        <MdDelete />
                      </GradientButton>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          <GradientButton
            size="md"
            className="add-btn"
            onClick={onAddTodo}
            title="Add new task"
          >
            <MdAdd />
            <span>Add Task</span>
          </GradientButton>
        </>
      )}
    </>
  );
}

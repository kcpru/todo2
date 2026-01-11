import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useDopamine } from "../../DopamineContext";
import { ANIMATION_CONFIG } from "../../constants/animations";
import {
  MdEdit,
  MdDelete,
  MdFormatListBulleted,
  MdRadioButtonUnchecked,
  MdCheckCircle,
  MdSearch,
  MdAdd,
  MdAssignmentLate,
  MdSearchOff,
  MdEventBusy,
  MdChecklistRtl,
} from "react-icons/md";
import { GradientButton } from "../GradientButton";
import { ConfirmDialog } from "../ConfirmDialog";
import { Input } from "../Input";
import { FilterSelect } from "../FilterSelect";
import "./TodoList.scss";

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
  const [confirmDeleteTodoId, setConfirmDeleteTodoId] = useState(null);

  const getEmptyMessage = () => {
    if (searchTerm.trim()) {
      return {
        icon: <MdSearchOff className="no-todos-icon" />,
        title: "No results",
        subtitle: `No tasks matching "${searchTerm}"`,
      };
    }

    if (filter === "COMPLETED") {
      return {
        icon: <MdEventBusy className="no-todos-icon" />,
        title: "No completed tasks",
        subtitle: "Complete some tasks to see them here",
      };
    }

    if (filter === "ACTIVE") {
      return {
        icon: <MdChecklistRtl className="no-todos-icon" />,
        title: "All tasks done!",
        subtitle: "Great job! You have completed all tasks",
      };
    }

    return {
      icon: <MdAssignmentLate className="no-todos-icon" />,
      title: "No tasks yet",
      subtitle: "Add one to get started!",
    };
  };
  const filters = [
    { value: "ALL", label: "All", icon: <MdFormatListBulleted /> },
    { value: "ACTIVE", label: "Active", icon: <MdRadioButtonUnchecked /> },
    { value: "COMPLETED", label: "Done", icon: <MdCheckCircle /> },
  ];

  return (
    <>
      <div className="controls">
        <div className="search-container">
          <Input
            withRipple
            type="text"
            className="search-input"
            placeholder="Search task..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <span className="search-icon">
            <MdSearch />
          </span>
        </div>

        <div className="filter-select-wrapper">
          <FilterSelect
            options={filters}
            value={filter}
            onChange={onFilterChange}
            ariaLabel="Filter tasks"
          />
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
                  {getEmptyMessage().icon}
                  <div className="no-todos-text">
                    <p className="no-todos-title">{getEmptyMessage().title}</p>
                    <p className="no-todos-subtitle">
                      {getEmptyMessage().subtitle}
                    </p>
                  </div>
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
                        icon={<MdEdit />}
                      />
                      <GradientButton
                        variant="danger"
                        size="sm"
                        iconOnly={true}
                        className="todo-action-btn delete-btn"
                        onClick={() => setConfirmDeleteTodoId(todo.id)}
                        icon={<MdDelete />}
                      />
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
            icon={<MdAdd />}
          >
            Add task
          </GradientButton>

          <ConfirmDialog
            isOpen={confirmDeleteTodoId !== null}
            title="Delete Task"
            message="Are you sure you want to delete this task? This action cannot be undone."
            confirmText="Delete"
            cancelText="Cancel"
            onConfirm={() => {
              if (confirmDeleteTodoId !== null) {
                onDeleteTodo(confirmDeleteTodoId);
              }
              setConfirmDeleteTodoId(null);
            }}
            onCancel={() => setConfirmDeleteTodoId(null)}
            confirmVariant="danger"
          />
        </>
      )}
    </>
  );
}

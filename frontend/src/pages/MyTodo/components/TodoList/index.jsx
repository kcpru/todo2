// import MotivationMessage from "../MotivationMessage";
// import { getMotivationMessage } from "@api/motivation";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import {
  MdEdit,
  MdDelete,
  MdAdd,
  MdAssignmentLate,
  MdShare,
} from "react-icons/md";

import { ActionMenu } from "@components/ActionMenu";
import { Button } from "@components/Button";
import { ConfirmDialog } from "@components/ConfirmDialog";
import { Input } from "@components/Input";
import { ANIMATION_CONFIG } from "@constants/animations";
import { useDopamine } from "@context/DopamineContext";
import "./TodoList.scss";

export function TodoList({
  filteredTodos,
  loadingTodos,
  onToggleTodo,
  onDeleteTodo,
  onStartEdit,
  onAddTodo,
  registerCheckboxPosition,
  onShare,
  selectedListName,
  completedCount,
  totalCount,
}) {
  const { isDopamineMode } = useDopamine();
  const [confirmDeleteTodoId, setConfirmDeleteTodoId] = useState(null);
  // Motywacja obsługiwana przez rodzica (MyTodo)

  const handleToggleTodo = async (todoId, checkboxElement) => {
    onToggleTodo(todoId, checkboxElement);
    if (typeof window !== "undefined" && window.onAllTodosCompleted) {
      setTimeout(() => {
        window.onAllTodosCompleted(todoId, filteredTodos);
      }, 0);
    }
  };

  return (
    <>
      {loadingTodos ? (
        <div className="loading-todos">Loading tasks...</div>
      ) : (
        <>
          {/* Motywacja obsługiwana przez rodzica (MyTodo) */}
          <div className="todo-list">
            <AnimatePresence mode="popLayout">
              {filteredTodos.length === 0 ? (
                <div className="no-todos">
                  <MdAssignmentLate className="no-todos-icon" />
                  <div className="no-todos-text">
                    <p className="no-todos-title">No tasks</p>
                    <p className="no-todos-subtitle">
                      No tasks match your current filter
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
                      <Input
                        id={`cbx-${todo.id}`}
                        type="checkbox"
                        withRipple={false}
                        checked={todo.isCompleted}
                        onChange={(e) => {
                          const checkboxElement = e.currentTarget.parentElement;
                          handleToggleTodo(todo.id, checkboxElement);
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
                      <ActionMenu
                        items={[
                          {
                            label: "Edit",
                            icon: <MdEdit />,
                            onClick: () => onStartEdit(todo),
                          },
                          {
                            label: "Delete",
                            icon: <MdDelete />,
                            variant: "danger",
                            onClick: () => setConfirmDeleteTodoId(todo.id),
                          },
                        ]}
                      />
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          <div className="button-group">
            <Button
              size="md"
              className="add-btn"
              onClick={onAddTodo}
              title="Add new task"
              icon={<MdAdd />}
            >
              Add task
            </Button>

            {onShare && (
              <Button
                size="md"
                className="share-btn"
                onClick={onShare}
                title="Share this achievement"
                icon={<MdShare />}
              >
                Share
              </Button>
            )}
          </div>

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

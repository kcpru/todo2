import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "motion/react";
import { Input } from "../Input";
import { useDopamine } from "../../DopamineContext";
import { ANIMATION_CONFIG } from "../../constants/animations";
import { MdEdit, MdDelete, MdAdd, MdAssignmentLate } from "react-icons/md";
import { GradientButton } from "../GradientButton";
import { ActionMenu } from "../ActionMenu";
import { ConfirmDialog } from "../ConfirmDialog";
import "./TodoList.scss";

export function TodoList({
  filteredTodos,
  loadingTodos,
  onToggleTodo,
  onDeleteTodo,
  onStartEdit,
  onAddTodo,
  registerCheckboxPosition,
}) {
  const { isDopamineMode } = useDopamine();
  const [confirmDeleteTodoId, setConfirmDeleteTodoId] = useState(null);

  return (
    <>
      {loadingTodos ? (
        <div className="loading-todos">Loading tasks...</div>
      ) : (
        <>
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

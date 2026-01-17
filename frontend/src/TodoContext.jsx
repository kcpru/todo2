import { createContext, useContext } from "react";
import { useTodoLogic } from "./hooks/useTodoLogic";

const TodoContext = createContext(null);

export function TodoProvider({ children }) {
  const todoLogic = useTodoLogic();

  return (
    <TodoContext.Provider value={todoLogic}>{children}</TodoContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTodo() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodo must be used within TodoProvider");
  }
  return context;
}

import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "./AuthContext";
import { TodoList } from "./components/TodoList";
import { EditModal } from "./components/EditModal";
import { DopamineVideo } from "./components/DopamineVideo";
import { useTodoLogic } from "./hooks/useTodoLogic";
import { ANIMATION_CONFIG } from "./constants/animations";
import "./App.scss";

function App() {
  const { isAuthenticated, loading } = useAuth();

  const {
    lists,
    selectedListId,
    todos,
    filter,
    searchTerm,
    editingId,
    editingText,
    editingDescription,
    loadingTodos,
    loadLists,
    loadTasks,
    toggleTodo,
    deleteTodo,
    addTodo,
    startEdit,
    saveEdit,
    cancelEdit,
    filteredTodos,
    setFilter,
    setSearchTerm,
    setEditingText,
    setEditingDescription,
    registerCheckboxPosition,
  } = useTodoLogic();

  // Load lists on mount
  useEffect(() => {
    if (isAuthenticated && !loading) {
      loadLists();
    }
  }, [isAuthenticated, loading, loadLists]);

  // Load tasks when list is selected
  useEffect(() => {
    if (selectedListId && isAuthenticated) {
      loadTasks();
    }
  }, [selectedListId, isAuthenticated, loadTasks]);

  const selectedList = lists.find((l) => l.id === selectedListId);

  return (
    <div className="app-todo-wrapper">
      <AnimatePresence mode="wait">
        {selectedList ? (
          <motion.div
            key={selectedList.id}
            {...ANIMATION_CONFIG.pageTransition}
          >
            <TodoList
              todos={todos}
              filteredTodos={filteredTodos}
              filter={filter}
              searchTerm={searchTerm}
              loadingTodos={loadingTodos}
              onToggleTodo={toggleTodo}
              onDeleteTodo={deleteTodo}
              onStartEdit={startEdit}
              onFilterChange={setFilter}
              onSearchChange={setSearchTerm}
              onAddTodo={addTodo}
              registerCheckboxPosition={registerCheckboxPosition}
            />
          </motion.div>
        ) : (
          <div className="empty-state empty-state-no-selection">
            <div className="empty-icon">📋</div>
            <h2>No List Selected</h2>
            <p>Select or create a list from the sidebar to get started</p>
          </div>
        )}
      </AnimatePresence>

      <EditModal
        editingId={editingId}
        editingText={editingText}
        editingDescription={editingDescription}
        onEditTextChange={setEditingText}
        onEditDescriptionChange={setEditingDescription}
        onSave={saveEdit}
        onCancel={cancelEdit}
      />

      <DopamineVideo />
    </div>
  );
}

export default App;

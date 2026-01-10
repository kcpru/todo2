import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "./AuthContext";
import { Header } from "./components/Header";
import { ListSelector } from "./components/ListSelector";
import { TodoList } from "./components/TodoList";
import { EditModal } from "./components/EditModal";
import { DopamineVideo } from "./components/DopamineVideo";
import { useTodoLogic } from "./hooks/useTodoLogic";
import { ANIMATION_CONFIG } from "./constants/animations";
import "./App.scss";

function App() {
  const navigate = useNavigate();
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
    loadingLists,
    loadingTodos,
    loadLists,
    loadTasks,
    handleAddList,
    handleDeleteList,
    toggleTodo,
    deleteTodo,
    addTodo,
    startEdit,
    saveEdit,
    cancelEdit,
    filteredTodos,
    setSelectedListId,
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

  const selectedList = lists.find((l) => l.id === selectedListId);

  return (
    <div className="app">
      <Header />

      <div className="container">
        <ListSelector
          lists={lists}
          selectedListId={selectedListId}
          loadingLists={loadingLists}
          onSelectList={setSelectedListId}
          onDeleteList={handleDeleteList}
          onAddList={handleAddList}
        />

        <AnimatePresence mode="wait">
          {selectedList && (
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
    </div>
  );
}

export default App;

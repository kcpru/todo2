import { AnimatePresence, motion } from "motion/react";
import { useState, useCallback } from "react";
import { Route, Routes } from "react-router-dom";

import { useTodo } from "./context/TodoContext";
import { TodoList } from "./components/TodoList";
import { EditModal } from "./components/EditModal";
import { DopamineVideo } from "./components/DopamineVideo";
import { SharePostModal } from "./components/SharePostModal";
import { Input } from "./components/Input";
import { FilterSelect } from "./components/FilterSelect";
import { usePostsAPI } from "./hooks/usePostsAPI";
import { useNotifications } from "./context/NotificationsContext";
import { ANIMATION_CONFIG } from "./constants/animations";
import {
  MdFormatListBulleted,
  MdRadioButtonUnchecked,
  MdCheckCircle,
  MdSearch,
} from "react-icons/md";
import Stats from "./pages/Stats";
import "./App.scss";

function App() {
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
  } = useTodo();
  const { createPost } = usePostsAPI();
  const { notify } = useNotifications();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  const selectedList = lists.find((l) => l.id === selectedListId);

  const completedCount = todos.filter((t) => t.isCompleted).length;
  const totalCount = todos.length;

  const handleShareClick = useCallback(() => {
    setShareModalOpen(true);
  }, []);

  const handleSharePost = useCallback(
    async (content) => {
      if (!selectedList) {
        notify({ message: "No list selected", type: "error" });
        return;
      }

      try {
        setIsCreatingPost(true);
        await createPost(selectedList.id, content);
        notify({ message: "Post shared!", type: "success" });
        setShareModalOpen(false);
      } catch (err) {
        console.error("Failed to share post:", err);
        notify({ message: "Failed to share post", type: "error" });
      } finally {
        setIsCreatingPost(false);
      }
    },
    [selectedList, createPost, notify]
  );

  const filters = [
    { value: "ALL", label: "All", icon: <MdFormatListBulleted /> },
    { value: "ACTIVE", label: "Active", icon: <MdRadioButtonUnchecked /> },
    { value: "COMPLETED", label: "Done", icon: <MdCheckCircle /> },
  ];

  return (
    <div className="app-todo-wrapper">
      {selectedList && (
        <div className="controls">
          <div className="search-container">
            <Input
              withRipple
              type="text"
              placeholder="Search task..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">
              <MdSearch />
            </span>
          </div>

          <div className="filter-select-wrapper">
            <FilterSelect
              options={filters}
              value={filter}
              onChange={setFilter}
              ariaLabel="Filter tasks"
            />
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {selectedList ? (
          <motion.div
            key={selectedList.id}
            {...ANIMATION_CONFIG.pageTransition}
          >
            <TodoList
              todos={todos}
              filteredTodos={filteredTodos}
              loadingTodos={loadingTodos}
              onToggleTodo={toggleTodo}
              onDeleteTodo={deleteTodo}
              onStartEdit={startEdit}
              onAddTodo={addTodo}
              registerCheckboxPosition={registerCheckboxPosition}
              onShare={handleShareClick}
              selectedListName={selectedList.name}
              completedCount={completedCount}
              totalCount={totalCount}
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

      <SharePostModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        todoListName={selectedList?.name || ""}
        completedCount={completedCount}
        totalCount={totalCount}
        onShare={handleSharePost}
        isLoading={isCreatingPost}
      />

      <DopamineVideo />

      <Routes>
        <Route path="/stats" element={<Stats />} />
        {/* Add other routes here if needed */}
      </Routes>
    </div>
  );
}

export default App;

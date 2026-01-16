import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { motion } from "motion/react";
import { MdMenu, MdClose } from "react-icons/md";
import { Header } from "../Header";
import { ListsSidebar } from "../ListsSidebar";
import { useTodoLogic } from "../../hooks/useTodoLogic";
import { useAuth } from "../../AuthContext";
import "./MyTodoLayout.scss";

export function MyTodoLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isAuthenticated, loading } = useAuth();

  const {
    lists,
    selectedListId,
    loadingLists,
    setSelectedListId,
    handleDeleteList,
    handleAddList,
    loadLists,
    loadTasks,
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

  return (
    <div className="app">
      <Header />

      <div className="main-content">
        {/* Sidebar Toggle Button */}
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? <MdClose /> : <MdMenu />}
        </button>

        {/* Sidebar Overlay (mobile) */}
        {sidebarOpen && (
          <motion.div
            className="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <motion.aside
          className={`sidebar ${sidebarOpen ? "open" : "closed"}`}
          initial={false}
          animate={{
            x: sidebarOpen ? 0 : -300,
            opacity: sidebarOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <ListsSidebar
            lists={lists}
            selectedListId={selectedListId}
            loadingLists={loadingLists}
            onSelectList={setSelectedListId}
            onDeleteList={handleDeleteList}
            onAddList={handleAddList}
          />
        </motion.aside>

        {/* Content Area */}
        <div className="content-wrapper">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import { useLocalStorage } from "@hooks/useLocalStorage";
import { Outlet, useLocation } from "react-router-dom";
import { usePageTransition } from "@context/PageTransitionContext";
import { MdMenu, MdClose } from "react-icons/md";
import { ListsSidebar } from "@components/ListsSidebar";
import { motion } from "motion/react";
import { useTodo } from "@context/TodoContext";
import { useAuth } from "@context/AuthContext";
import "./MyTodoLayout.scss";

export function MyTodoLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useLocalStorage("sidebarWidth", 280);
  const [isResizing, setIsResizing] = useState(false);
  const { isAuthenticated, loading } = useAuth();
  const hasLoadedListsRef = useRef(false);

  const {
    lists,
    selectedListId,
    loadingLists,
    setSelectedListId,
    handleDeleteList,
    handleAddList,
    loadLists,
    loadTasks,
  } = useTodo();

  // Load lists on mount
  useEffect(() => {
    if (isAuthenticated && !loading && !hasLoadedListsRef.current) {
      hasLoadedListsRef.current = true;
      loadLists();
    }
  }, [isAuthenticated, loading, loadLists]);

  // Load tasks when list is selected
  useEffect(() => {
    if (selectedListId && isAuthenticated) {
      loadTasks();
    }
  }, [selectedListId, isAuthenticated, loadTasks]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      const newWidth = e.clientX;
      if (newWidth >= 240 && newWidth <= 500) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing]);

  const location = useLocation();
  const { directionRef } = usePageTransition();

  // Ustal animację na podstawie kierunku (lewo/prawo)
  let initial, animate, exit;
  if (directionRef.current === "down") {
    // Przejście w prawo
    initial = { opacity: 0, x: 60 };
    animate = { opacity: 1, x: 0 };
    exit = { opacity: 0, x: -60 };
  } else {
    // "up" lub domyślnie: przejście w lewo
    initial = { opacity: 0, x: -60 };
    animate = { opacity: 1, x: 0 };
    exit = { opacity: 0, x: 60 };
  }

  return (
    <div className="app">
      <motion.div
        key={location.pathname}
        className="main-content"
        initial={initial}
        animate={animate}
        exit={exit}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
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
          style={{ width: sidebarOpen ? `${sidebarWidth}px` : "280px" }}
        >
          <ListsSidebar
            lists={lists}
            selectedListId={selectedListId}
            loadingLists={loadingLists}
            onSelectList={setSelectedListId}
            onDeleteList={handleDeleteList}
            onAddList={handleAddList}
          />
          <div
            className="sidebar-resizer"
            onMouseDown={handleMouseDown}
            style={{ cursor: isResizing ? "ew-resize" : "default" }}
          />
        </motion.aside>

        {/* Content Area */}
        <div className="content-wrapper">
          <Outlet />
        </div>
      </motion.div>
    </div>
  );
}

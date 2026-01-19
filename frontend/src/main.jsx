import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./index.scss";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { DopamineProvider } from "./context/DopamineContext.jsx";
import { NotificationsProvider } from "./context/NotificationsContext.jsx";
import { TodoProvider } from "./context/TodoContext.jsx";
import { Login } from "./pages/Login.jsx";
import { Register } from "./pages/Register.jsx";
import { Home } from "./pages/Home/index.jsx";
import { Settings } from "./pages/Settings";
import Stats from "./pages/Stats";
import { Layout } from "./components/Layout/index.jsx";
import { MyTodoLayout } from "./components/MyTodoLayout/index.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import MyTodo from "./pages/MyTodo/index.jsx";

function AppRoutes() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/stats" element={<Stats />} />
        </Route>
        <Route element={<MyTodoLayout />}>
          <Route path="/my-todo" element={<MyTodo />} />
        </Route>
      </Route>
    </Routes>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <DopamineProvider>
          <NotificationsProvider>
            <TodoProvider>
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </TodoProvider>
          </NotificationsProvider>
        </DopamineProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);

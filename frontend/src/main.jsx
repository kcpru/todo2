import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./index.scss";
import App from "./App.jsx";
import { ThemeProvider } from "./ThemeContext.jsx";
import { AuthProvider } from "./AuthContext.jsx";
import { DopamineProvider } from "./DopamineContext.jsx";
import { NotificationsProvider } from "./NotificationsContext.jsx";
import { TodoProvider } from "./TodoContext.jsx";
import { Login } from "./pages/Login.jsx";
import { Register } from "./pages/Register.jsx";
import { Home } from "./pages/Home.jsx";
import { Settings } from "./pages/Settings";
import Stats from "./pages/Stats";
import { Layout } from "./components/Layout/index.jsx";
import { MyTodoLayout } from "./components/MyTodoLayout/index.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

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
          <Route path="/my-todo" element={<App />} />
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

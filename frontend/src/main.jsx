import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.scss";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { DopamineProvider } from "./context/DopamineContext.jsx";
import { NotificationsProvider } from "./context/NotificationsContext.jsx";
import { TodoProvider } from "./context/TodoContext.jsx";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <DopamineProvider>
          <NotificationsProvider>
            <TodoProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </TodoProvider>
          </NotificationsProvider>
        </DopamineProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);

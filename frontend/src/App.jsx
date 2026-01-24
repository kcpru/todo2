import { Routes, Route, useLocation } from "react-router-dom";

import GlobalWelcomeProvider from "@components/GlobalWelcomeProvider.jsx";
import { Layout } from "@components/Layout/index.jsx";
import { MainLayout } from "@components/MainLayout/index.jsx";
import { MobileNavTabsPanel } from "@components/NavTabs/MobileNavTabsPanel.jsx";
import ProtectedRoute from "@components/ProtectedRoute.jsx";
import { Login } from "@pages/Auth/Login.jsx";
import { Register } from "@pages/Auth/Register.jsx";
import HomeWithWelcome from "@pages/Home/WithWelcome.jsx";
import MyTodo from "@pages/MyTodo/index.jsx";
import { MyTodoLayout } from "@pages/MyTodo/layout/MyTodoLayout/index.jsx";
import { Settings } from "@pages/Settings";
import Stats from "@pages/Stats";
import "./index.scss";

export default function App() {
  const location = useLocation();
  return (
    <>
      <img src="/image.webp" alt="" className="background" />
      <Routes location={location}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route
            element={
              <GlobalWelcomeProvider>
                <MainLayout />
              </GlobalWelcomeProvider>
            }
          >
            <Route element={<Layout />}>
              <Route path="/" element={<HomeWithWelcome />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/stats" element={<Stats />} />
            </Route>
            <Route element={<MyTodoLayout />}>
              <Route path="/todo" element={<MyTodo />} />
            </Route>
          </Route>
        </Route>
      </Routes>
      <MobileNavTabsPanel />
    </>
  );
}

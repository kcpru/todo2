import { Routes, Route, useLocation } from "react-router-dom";
import { Login } from "./pages/Login.jsx";
import { Register } from "./pages/Register.jsx";
import { Home } from "./pages/Home/index.jsx";
import { Settings } from "./pages/Settings";
import Stats from "./pages/Stats";
import { Layout } from "./components/Layout/index.jsx";
import { MyTodoLayout } from "./components/MyTodoLayout/index.jsx";
import { MainLayout } from "./components/MainLayout/index.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import MyTodo from "./pages/MyTodo/index.jsx";

export default function App() {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/stats" element={<Stats />} />
          </Route>
          <Route element={<MyTodoLayout />}>
            <Route path="/todo" element={<MyTodo />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

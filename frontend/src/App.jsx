import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

const GlobalWelcomeProvider = lazy(
  () => import("@components/GlobalWelcomeProvider.jsx")
);
const Layout = lazy(() =>
  import("@components/Layout/index.jsx").then((module) => ({
    default: module.Layout,
  }))
);
const MainLayout = lazy(() =>
  import("@components/MainLayout/index.jsx").then((module) => ({
    default: module.MainLayout,
  }))
);
const MobileNavTabsPanel = lazy(() =>
  import("@components/NavTabs/MobileNavTabsPanel.jsx").then((module) => ({
    default: module.MobileNavTabsPanel,
  }))
);
const ProtectedRoute = lazy(() => import("@components/ProtectedRoute.jsx"));
const Login = lazy(() =>
  import("@pages/Auth/Login.jsx").then((module) => ({
    default: module.Login,
  }))
);
const Register = lazy(() =>
  import("@pages/Auth/Register.jsx").then((module) => ({
    default: module.Register,
  }))
);
const HomeWithWelcome = lazy(() => import("@pages/Home/WithWelcome.jsx"));
const MyTodo = lazy(() => import("@pages/MyTodo/index.jsx"));
const MyTodoLayout = lazy(() =>
  import("@pages/MyTodo/layout/MyTodoLayout/index.jsx").then((module) => ({
    default: module.MyTodoLayout,
  }))
);
const Settings = lazy(() => import("@pages/Settings"));
const Stats = lazy(() => import("@pages/Stats"));
import "./index.scss";

export default function App() {
  const location = useLocation();
  return (
    <Suspense fallback={null}>
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
    </Suspense>
  );
}

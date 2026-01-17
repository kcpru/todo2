import { Outlet } from "react-router-dom";
import { Header } from "../Header";
import "./Layout.scss";

export function Layout() {
  return (
    <div className="layout-wrapper">
      <Header />
      <div className="layout-content">
        <Outlet />
      </div>
    </div>
  );
}

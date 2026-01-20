import { Header } from "../Header";
import { Outlet } from "react-router-dom";

export function MainLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

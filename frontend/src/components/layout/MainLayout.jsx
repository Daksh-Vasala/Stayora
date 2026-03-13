import { Outlet } from "react-router-dom";
import UserNavbar from "./UserNavbar";

function MainLayout() {
  return (
    <>
      <UserNavbar />
      <Outlet />
    </>
  );
}

export default MainLayout;
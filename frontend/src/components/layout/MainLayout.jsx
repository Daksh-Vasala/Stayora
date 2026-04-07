import { Outlet } from "react-router-dom";
import UserNavbar from "./UserNavbar";
import { useAuth } from "../../context/AuthContext";

function MainLayout() {
  const { role, handleLogout, user } = useAuth();

  return (
    <>
      <div className="sticky top-0 z-50 bg-white">
        {<UserNavbar userRole={role} onLogout={handleLogout} user={user} />}
      </div>
      <Outlet />
    </>
  );
}

export default MainLayout;

import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"
import UserNavbar from "./UserNavbar";

function HostLayout() {
  const { role, handleLogout } = useAuth();
  return (
    <>
      <div className="sticky top-0 z-50 bg-white">
        {<UserNavbar userRole={role} onLogout={handleLogout} />}
      </div>
      <Outlet />
    </>
  )
}

export default HostLayout
import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminSidebar from "./AdminSidebar";

function AdminLayout() {
  const { handleLogout } = useAuth();
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
      <AdminSidebar onLogout={handleLogout} />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;

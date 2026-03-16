import { Outlet } from "react-router-dom";
import UserNavbar from "./UserNavbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AdminSidebar from "./AdminSidebar";

function MainLayout() {
  const [role, setRole] = useState("");

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get("/user/me");
        setRole(res.data.data.role);
      } catch (error) {
        console.log(error);
      }
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    console.log("Logout button clicked");
    try {
      const res = await axios.post("/user/logout");
      console.log(res);
      toast.success(res.data.message);
      setRole(""); // Clear the role after logout
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <>
      <div className="sticky top-0 z-50 bg-white">
        {role == "admin" ? <AdminSidebar onLogout={handleLogout} /> : <UserNavbar userRole={role} onLogout={handleLogout} />}
      </div>
      <Outlet />
    </>
  );
}

export default MainLayout;

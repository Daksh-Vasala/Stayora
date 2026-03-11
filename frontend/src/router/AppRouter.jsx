import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../pages/Login.jsx";
import Signup from "../pages/Signup.jsx";
import UserNavbar from "../components/user/UserNavbar.jsx";
import AdminSidebar from "../components/admin/AdminSidebar.jsx";
import HomePage from "../pages/HomePage.jsx";

const router = createBrowserRouter([
  { path:"/", element: <Login /> },
  { path:"/signup", element: <Signup /> },

  {path: "/user", element:<HomePage />, 
    children: [
    ]
  },
  {path: "/admin", element:<AdminSidebar />},
])

const AppRouter = () => {
  return <RouterProvider router={router} />
}

export default AppRouter;
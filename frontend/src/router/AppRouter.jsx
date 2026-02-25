import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../components/Login.jsx";
import Signup from "../components/Signup.jsx";
import UserNavbar from "../components/user/UserNavbar.jsx";
import AdminSidebar from "../components/admin/AdminSidebar.jsx";
import UseEffectDemo from "../components/tasks/UseEffectDemo.jsx";
import ApiDemo from "../components/tasks/ApiDemo.jsx";

const router = createBrowserRouter([
  { path:"/", element: <Login /> },
  { path:"/signup", element: <Signup /> },

  {path: "/user", element:<UserNavbar />, 
    children: [
      {path: "useeffectdemo", element:<UseEffectDemo />},
      {path: "apidemo", element:<ApiDemo />},
    ]
  },
  {path: "/admin", element:<AdminSidebar />},
])

const AppRouter = () => {
  return <RouterProvider router={router} />
}

export default AppRouter;
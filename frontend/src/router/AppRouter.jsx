import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
import PropertyDetail from "../pages/PropertyDetail";

import AdminSidebar from "../components/layout/AdminSidebar";
import MainLayout from "../components/layout/MainLayout";

const router = createBrowserRouter([
  // PUBLIC ROUTES
  { path: "/login", element: <Login /> },

  { path: "/register", element: <Signup /> },

  // USER ROUTES WITH NAVBAR
  { path: "/", element: <MainLayout />, children: [
      { path: "/", element: <Home /> },
      { path: "/property/:id", element: <PropertyDetail /> },
    ],
  },

  // ADMIN ROUTE
  { path: "/admin", element: <AdminSidebar /> },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
import PropertyDetail from "../pages/PropertyDetail";

import AdminSidebar from "../components/layout/AdminSidebar";
import MainLayout from "../components/layout/MainLayout";
import HostLayout from "../components/layout/HostLayout";
import HostDashboard from "../pages/host/HostDashboard";
import { AuthProvider } from "../context/AuthContext";
import ListingsPage from "../pages/host/ListingsPage";
import BookingsPage from "../pages/host/BookingsPage";
import EarningsPage from "../pages/host/EarningsPage";

const router = createBrowserRouter([
  // PUBLIC ROUTES
  { path: "/login", element: <Login /> },

  { path: "/register", element: <Signup /> },

  // USER ROUTES WITH NAVBAR
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "property/:id", element: <PropertyDetail /> },
    ],
  },

  //HOST ROUTE
  {
    path: "/host",
    element: <HostLayout />,
    children: [
      { index: true, element: <HostDashboard /> },
      { path: "listings", element: <ListingsPage /> },
      { path: "bookings", element: <BookingsPage /> },
      { path: "earnings", element: <EarningsPage /> },
    ],
  },

  // ADMIN ROUTE
  { path: "/admin", element: <AdminSidebar /> },
]);

const AppRouter = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default AppRouter;

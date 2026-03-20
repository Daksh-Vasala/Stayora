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
import GuestBookingsPages from "../pages/guest/GuestBookingsPage";
import WishlistPage from "../pages/guest/WishlistPage";
import { GuestMessagesPage } from "../pages/guest/GuestMessagesPage";
import AddListingPage from "../pages/host/AddListingPage";
import ListingDetailPage from "../pages/host/ListingDetailPage";
import UpdateListingPage from "../pages/host/UpdateListingPage";
import ProtectedRoute from "../components/ProtectedRoute";

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
      {
        path: "bookings",
        element: (
          <ProtectedRoute allowedRoles={["guest", "host"]}>
            <GuestBookingsPages />
          </ProtectedRoute>
        ),
      },
      {
        path: "wishlist",
        element: (
          <ProtectedRoute allowedRoles={["guest", "host"]}>
            <WishlistPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "messages",
        element: (
          <ProtectedRoute allowedRoles={["guest", "host"]}>
            <GuestMessagesPage />
          </ProtectedRoute>
        ),
      },
    ],
  },

  //HOST ROUTE
  {
    path: "/host",
    element: (
      <ProtectedRoute allowedRoles={["host"]}>
        <HostLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <HostDashboard /> },
      { path: "listings", element: <ListingsPage /> },
      { path: "bookings", element: <BookingsPage /> },
      { path: "earnings", element: <EarningsPage /> },
      { path: "new", element: <AddListingPage /> },
      { path: "listing/:id", element: <ListingDetailPage /> },
      { path: "listing/update/:id", element: <UpdateListingPage /> },
    ],
  },

  // ADMIN ROUTE
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminSidebar />
      </ProtectedRoute>
    ),
  },
]);

const AppRouter = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default AppRouter;

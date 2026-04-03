import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
import PropertyDetail from "../pages/PropertyDetail";
import MainLayout from "../components/layout/MainLayout";
import HostLayout from "../components/layout/HostLayout";
import HostDashboard from "../pages/host/HostDashboard";
import { AuthProvider } from "../context/AuthContext";
import ListingsPage from "../pages/host/ListingsPage";
import BookingsPage from "../pages/host/BookingsPage";
import EarningsPage from "../pages/host/EarningsPage";
import GuestBookingsPages from "../pages/guest/GuestBookingsPage";
import MessagesPage  from "../pages/guest/MessagesPage";
import AddListingPage from "../pages/host/AddListingPage";
import ListingDetailPage from "../pages/host/ListingDetailPage";
import UpdateListingPage from "../pages/host/UpdateListingPage";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminLayout from "../components/layout/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminListings from "../pages/admin/AdminListings";
import AdminFinancials from "../pages/admin/AdminFinancials";
import AdminMessages from "../pages/admin/AdminMessages";
import AdminDisputes from "../pages/admin/AdminDisputes";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import AdminBookings from "../pages/admin/AdminBookings";
import AdminBookingDetail from "../pages/admin/AdminBookingDetail";
import AdminPropertyDetail from "../pages/admin/AdminPropertyDetail";

const router = createBrowserRouter([
  // PUBLIC ROUTES
  { path: "/login", element: <Login /> },

  { path: "/register", element: <Signup /> },

  { path: "/forgot-password", element: <ForgotPassword />},

  { path: "/reset-password/:token", element: <ResetPassword />},

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
        path: "messages",
        element: (
          <ProtectedRoute allowedRoles={["guest", "host"]}>
            <MessagesPage />
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
        <AdminLayout />
      </ProtectedRoute>
    ), children: [
      {index: true, element: <AdminDashboard />},
      {path: "users", element: <AdminUsers />},
      {path: "listings", element: <AdminListings />},
      {path: "listings/:id", element: <AdminPropertyDetail />},
      {path: "bookings", element: <AdminBookings />},
      {path: "bookings/:id", element: <AdminBookingDetail />},
      {path: "financials", element: <AdminFinancials />},
      {path: "messages", element: <AdminMessages />},
      {path: "disputes", element: <AdminDisputes />},
    ]
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

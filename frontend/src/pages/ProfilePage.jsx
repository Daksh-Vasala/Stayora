// ProfilePage.jsx - Updated with Resend Verification
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Edit2,
  LogOut,
  Key,
  Bell,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Send,
  Loader2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [updating, setUpdating] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState(null);
  const { handleLogout } = useAuth();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get("/user/me");
      setUser(response.data.data);
      setFormData(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setUpdating(true);
      const response = await axios.put("/user/update", {
        name: formData.name,
        phone: formData.phone,
        location: formData.location,
      });
      setUser(response.data.data);
      setEditing(false);
      toast.success(response?.data?.message);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something wen wrong");
      alert(error.response?.data?.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      setResending(true);
      setResendMessage(null);
      console.log(user);

      const response = await axios.post("/user/resend-verification", {
        email: user.email,
      });

      setResendMessage({
        type: "success",
        text:
          response.data.message ||
          "Verification email sent! Please check your inbox.",
      });

      // Clear message after 5 seconds
      setTimeout(() => setResendMessage(null), 5000);
    } catch (error) {
      setResendMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to send verification email. Please try again.",
      });

      setTimeout(() => setResendMessage(null), 5000);
    } finally {
      setResending(false);
    }
  };

  const logout = () => {
    handleLogout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Personal Profile</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your personal information
          </p>
        </div>

        {/* Email Verification Warning with Resend Button */}
        {!user?.is_verified && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <AlertCircle size={18} className="text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-800">
                    Email not verified
                  </p>
                  <p className="text-xs text-yellow-700 mt-0.5">
                    Verify your email to access all features like booking
                    properties and messaging hosts.
                  </p>
                </div>
              </div>
              <button
                onClick={handleResendVerification}
                disabled={resending}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-lg text-xs font-medium hover:bg-yellow-200 transition disabled:opacity-50 whitespace-nowrap"
              >
                {resending ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send size={12} />
                    <span>Resend Email</span>
                  </>
                )}
              </button>
            </div>

            {/* Resend Message */}
            {resendMessage && (
              <div
                className={`mt-3 p-2 rounded-lg text-xs ${
                  resendMessage.type === "success"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {resendMessage.text}
              </div>
            )}
          </div>
        )}

        {/* Success Verification Banner */}
        {user?.is_verified && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <CheckCircle size={18} className="text-green-600" />
              <p className="text-sm text-green-800">
                Your email is verified. You have full access to all features.
              </p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Cover */}
          <div className="h-24 bg-linear-to-r from-blue-500 to-blue-600"></div>

          {/* Avatar Section */}
          <div className="relative px-6 pb-6">
            <div className="absolute -top-12 left-6">
              <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg">
                <div className="w-full h-full rounded-xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-14">
              {/* Role Badge */}
              <div className="mb-4">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                    user?.role === "admin"
                      ? "bg-purple-100 text-purple-700"
                      : user?.role === "host"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-green-100 text-green-700"
                  }`}
                >
                  <Shield size={12} />
                  {user?.role}
                </span>

                {/* Verification Badge */}
                {user?.is_verified && (
                  <span className="inline-flex ml-8 items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    <CheckCircle size={12} />
                    Verified
                  </span>
                )}
              </div>

              {/* Role-specific Dashboard Button */}
              {user?.role === "host" && (
                <button
                  onClick={() => navigate("/host/dashboard")}
                  className="mb-4 mt-5 w-full bg-orange-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition"
                >
                  Go to Host Dashboard →
                </button>
              )}

              {user?.role === "admin" && (
                <button
                  onClick={() => navigate("/admin/dashboard")}
                  className="mb-4 w-full bg-purple-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition"
                >
                  Go to Admin Dashboard →
                </button>
              )}

              {/* Personal Info Section */}
              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Personal Information
                  </h2>
                  {!editing && (
                    <button
                      onClick={() => setEditing(true)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit2 size={16} />
                    </button>
                  )}
                </div>

                {editing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="Add phone number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        placeholder="City, Country"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleUpdateProfile}
                        disabled={updating}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-50"
                      >
                        {updating ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        onClick={() => setEditing(false)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 py-2 border-b border-gray-100">
                      <User size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-600 flex-1">
                        Full Name
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {user?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 py-2 border-b border-gray-100">
                      <Mail size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-600 flex-1">
                        Email Address
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {user?.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 py-2 border-b border-gray-100">
                      <Phone size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-600 flex-1">
                        Phone Number
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {user?.phone || "Not added"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 py-2 border-b border-gray-100">
                      <MapPin size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-600 flex-1">
                        Location
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {user?.location || "Not added"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 py-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-600 flex-1">
                        Member Since
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(user?.createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Account Actions */}
              <div className="border-t border-gray-100 pt-4 mt-4 space-y-2">
                <button
                  onClick={() => navigate("/change-password")}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-3">
                    <Key size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-700">
                      Change Password
                    </span>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
              </div>

              {/* Logout */}
              <button
                onClick={logout}
                className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

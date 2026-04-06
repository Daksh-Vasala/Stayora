// ProfilePage.jsx - Personal Information Only
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
} from "lucide-react";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

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
      const response = await axios.put("/user/profile", formData);
      setUser(response.data.data);
      setEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) return <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mt-20" />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Personal Profile</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your personal information</p>
        </div>

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
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                  user?.role === "admin" ? "bg-purple-100 text-purple-700" :
                  user?.role === "host" ? "bg-orange-100 text-orange-700" :
                  "bg-green-100 text-green-700"
                }`}>
                  <Shield size={12} />
                  {user?.role}
                </span>
              </div>

              {/* Role-specific Dashboard Button */}
              {user?.role === "host" && (
                <button
                  onClick={() => navigate("/host/dashboard")}
                  className="mb-4 w-full bg-orange-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition"
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
                  <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                  {!editing && (
                    <button onClick={() => setEditing(true)} className="text-blue-600 hover:text-blue-700">
                      <Edit2 size={16} />
                    </button>
                  )}
                </div>

                {editing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={formData.name || ""}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phone || ""}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={formData.location || ""}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="City, Country"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button onClick={handleUpdateProfile} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
                        Save
                      </button>
                      <button onClick={() => setEditing(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 py-2 border-b border-gray-100">
                      <User size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-600 flex-1">Full Name</span>
                      <span className="text-sm font-medium text-gray-900">{user?.name}</span>
                    </div>
                    <div className="flex items-center gap-3 py-2 border-b border-gray-100">
                      <Mail size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-600 flex-1">Email Address</span>
                      <span className="text-sm font-medium text-gray-900">{user?.email}</span>
                    </div>
                    <div className="flex items-center gap-3 py-2 border-b border-gray-100">
                      <Phone size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-600 flex-1">Phone Number</span>
                      <span className="text-sm font-medium text-gray-900">{user?.phone || "Not added"}</span>
                    </div>
                    <div className="flex items-center gap-3 py-2 border-b border-gray-100">
                      <MapPin size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-600 flex-1">Location</span>
                      <span className="text-sm font-medium text-gray-900">{user?.location || "Not added"}</span>
                    </div>
                    <div className="flex items-center gap-3 py-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-600 flex-1">Member Since</span>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(user?.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Account Actions */}
              <div className="border-t border-gray-100 pt-4 mt-4 space-y-2">
                <button
                  onClick={() => navigate("/settings/password")}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-3">
                    <Key size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-700">Change Password</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
                <button
                  onClick={() => navigate("/settings/notifications")}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-3">
                    <Bell size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-700">Notification Settings</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
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
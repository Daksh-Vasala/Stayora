// AdminPropertyDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  MapPin,
  Star,
  Users,
  Bed,
  Bath,
  Home,
  Wifi,
  Car,
  Wind,
  Tv,
  Utensils,
  Shield,
  Thermometer,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
} from "lucide-react";

const PROPERTY_TYPES = {
  apartment: "Apartment",
  villa: "Villa",
  house: "House",
  studio: "Studio",
};

const STATUS_CONFIG = {
  active: {
    label: "Active",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
  },
  inactive: {
    label: "Inactive",
    color: "bg-gray-100 text-gray-600",
    icon: XCircle,
  },
};

const APPROVAL_CONFIG = {
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700",
    icon: Clock,
  },
  approved: {
    label: "Approved",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-100 text-red-700",
    icon: XCircle,
  },
};

const amenityIcons = {
  wifi: { icon: Wifi, label: "WiFi" },
  parking: { icon: Car, label: "Parking" },
  ac: { icon: Wind, label: "AC" },
  pool: { icon: Home, label: "Pool" },
  tv: { icon: Tv, label: "TV" },
  kitchen: { icon: Utensils, label: "Kitchen" },
  security: { icon: Shield, label: "24/7 Security" },
  heater: { icon: Thermometer, label: "Heater" },
};

export default function AdminPropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/property/${id}`);
      setProperty(response.data.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching property:", err);
      setError("Failed to load property details");
    } finally {
      setLoading(false);
    }
  };

  const updateProperty = async (updates) => {
    try {
      setUpdating(true);
      const response = await axios.patch(`/property/admin/${id}`, updates);
      setProperty(response.data.data);
      return true;
    } catch (err) {
      console.error("Error updating property:", err);
      alert("Failed to update property");
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const handleStatusToggle = async () => {
    try {
      const status = property.status === "active" ? "inactive" : "active";
      const res = await axios.patch(`/property/deactivate/${id}`, {status});
      fetchProperty();
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleApproval = async () => {
    try {
      const res = await axios.patch(`/property/${id}/approve`);
      fetchProperty();
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleReject = async () => {
    try {
      const res = await axios.patch(`/property/${id}/reject`);
      fetchProperty();
      toast.success(res?.data?.message);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    try {
      await axios.patch(`/property/delete/${id}`);
      fetchProperty();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete property");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600">{error || "Property not found"}</p>
          <button
            onClick={() => navigate("/admin/listings")}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
          >
            Back to Listings
          </button>
        </div>
      </div>
    );
  }

  const ApprovalIcon = APPROVAL_CONFIG[property.approvalStatus].icon;
  const StatusIcon = STATUS_CONFIG[property.status].icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/admin/listings")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {property.title}
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Property ID: {property._id}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {property.isDeleted ? (
                <p className="text-red-500 font-bold mr-4">Deleted</p>
              ) : (
                <button
                  onClick={handleDelete}
                  disabled={updating}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Property Images
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.images?.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
                  >
                    <img
                      src={img.url}
                      alt={`${property.title} - ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Description
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {property.description || "No description provided"}
              </p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Amenities
              </h2>
              <div className="flex flex-wrap gap-3">
                {property.amenities?.map((amenity) => {
                  const AmenityIcon = amenityIcons[amenity]?.icon || Home;
                  const label = amenityIcons[amenity]?.label || amenity;
                  return (
                    <div
                      key={amenity}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg"
                    >
                      <AmenityIcon size={16} className="text-gray-600" />
                      <span className="text-sm text-gray-700 capitalize">
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Location
              </h2>
              <div className="space-y-2">
                <p className="text-gray-600 flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400" />
                  {property.location?.address}
                </p>
                <p className="text-gray-600">
                  {property.location?.city}, {property.location?.country}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Approval Status Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Approval Status
              </h3>
              <div className="space-y-3">
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${APPROVAL_CONFIG[property.approvalStatus].color}`}
                >
                  <ApprovalIcon size={14} />
                  <span className="text-sm font-medium">
                    {APPROVAL_CONFIG[property.approvalStatus].label}
                  </span>
                </div>

                {property.approvalStatus === "pending" && (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={handleApproval}
                      disabled={updating}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={16} />
                      Approve
                    </button>
                    <button
                      onClick={handleReject}
                      disabled={updating}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <XCircle size={16} />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Status Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Listing Status
              </h3>
              <div className="space-y-3">
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${STATUS_CONFIG[property.status].color}`}
                >
                  <StatusIcon size={14} />
                  <span className="text-sm font-medium">
                    {STATUS_CONFIG[property.status].label}
                  </span>
                </div>

                <button
                  onClick={handleStatusToggle}
                  disabled={updating}
                  className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {property.status === "active"
                    ? "Deactivate Listing"
                    : "Activate Listing"}
                </button>
              </div>
            </div>

            {/* Details Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Property Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Type</span>
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {PROPERTY_TYPES[property.propertyType] ||
                      property.propertyType}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Price per night</span>
                  <span className="text-sm font-bold text-gray-900">
                    ₹{property.pricePerNight.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Users size={14} /> Max Guests
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {property.maxGuests || "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Bed size={14} /> Bedrooms
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {property.bedrooms || "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Bath size={14} /> Bathrooms
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {property.bathrooms || "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Bed size={14} /> Beds
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {property.beds || "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* Host Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Host Information
              </h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-900 font-medium">
                  {property.host?.name}
                </p>
                <p className="text-sm text-gray-500">{property.host?.email}</p>
                <p className="text-xs text-gray-400">
                  Host ID: {property.host?._id}
                </p>
              </div>
            </div>

            {/* Rating Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Rating & Reviews
              </h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star size={20} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-2xl font-bold text-gray-900">
                    {property.rating || "0"}
                  </span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-500">
                  {property.reviewCount || 0} reviews
                </span>
              </div>
            </div>

            {/* Timestamps */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Timestamps
              </h3>
              <div className="space-y-2 text-xs text-gray-500">
                <p>Created: {new Date(property.createdAt).toLocaleString()}</p>
                <p>
                  Last Updated: {new Date(property.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {updating && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-lg">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
            <span className="text-sm text-gray-700">Updating...</span>
          </div>
        </div>
      )}
    </div>
  );
}

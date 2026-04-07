// AdminListings.jsx
import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { Search, Filter, CheckCircle, XCircle, Clock, Trash2 } from "lucide-react";
import AdminPropertyCard from "../../components/property/AdminPropertyCard";
import { useNavigate } from "react-router-dom";

export default function AdminListings() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/admin/getProperties");
      setListings(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredListings = useMemo(() => {
    return listings.filter((l) => {
      // Search filter
      const matchesSearch =
        l.title.toLowerCase().includes(q.toLowerCase()) ||
        l.location.city.toLowerCase().includes(q.toLowerCase());
      
      // Status filter logic
      let matchesFilter = false;
      
      switch (filter) {
        case "all":
          matchesFilter = true;
          break;
        case "active":
          matchesFilter = l.status === "active" && l.approvalStatus === "approved" && !l.isDeleted;
          break;
        case "pending":
          matchesFilter = l.approvalStatus === "pending" && !l.isDeleted;
          break;
        case "approved":
          matchesFilter = l.approvalStatus === "approved" && !l.isDeleted;
          break;
        case "rejected":
          matchesFilter = l.approvalStatus === "rejected" && !l.isDeleted;
          break;
        case "deleted":
          matchesFilter = l.isDeleted === true;
          break;
        case "inactive":
          matchesFilter = l.status === "inactive" && !l.isDeleted;
          break;
        default:
          matchesFilter = l.propertyType === filter || l.status === filter;
      }
      
      return matchesSearch && matchesFilter;
    });
  }, [listings, q, filter]);

  const handleView = useCallback((id) => {
    navigate(`/admin/listings/${id}`);
  }, [navigate]);

  const handleDelete = useCallback(async (id) => {
    if (!confirm("Are you sure you want to delete this property?")) return;
    
    try {
      await axios.patch(`/property/delete/${id}`);
      fetchData();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete property");
    }
  }, []);

  const handleSearchChange = useCallback((e) => {
    setQ(e.target.value);
  }, []);

  const handleFilterChange = useCallback((newFilter) => {
    setFilter(newFilter);
  }, []);

  // Count statistics
  const stats = useMemo(() => {
    return {
      total: listings.length,
      active: listings.filter(l => l.status === "active" && l.approvalStatus === "approved" && !l.isDeleted).length,
      pending: listings.filter(l => l.approvalStatus === "pending" && !l.isDeleted).length,
      deleted: listings.filter(l => l.isDeleted === true).length,
      rejected: listings.filter(l => l.approvalStatus === "rejected" && !l.isDeleted).length,
    };
  }, [listings]);

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Listings</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {listings.length} total properties
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard 
          label="Total" 
          count={stats.total} 
          icon={Filter}
          color="gray"
          active={filter === "all"}
          onClick={() => handleFilterChange("all")}
        />
        <StatCard 
          label="Active" 
          count={stats.active} 
          icon={CheckCircle}
          color="green"
          active={filter === "active"}
          onClick={() => handleFilterChange("active")}
        />
        <StatCard 
          label="Pending" 
          count={stats.pending} 
          icon={Clock}
          color="yellow"
          active={filter === "pending"}
          onClick={() => handleFilterChange("pending")}
        />
        <StatCard 
          label="Rejected" 
          count={stats.rejected} 
          icon={XCircle}
          color="red"
          active={filter === "rejected"}
          onClick={() => handleFilterChange("rejected")}
        />
        <StatCard 
          label="Deleted" 
          count={stats.deleted} 
          icon={Trash2}
          color="gray"
          active={filter === "deleted"}
          onClick={() => handleFilterChange("deleted")}
        />
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5 flex-1">
          <Search size={14} className="text-gray-300 shrink-0" />
          <input
            value={q}
            onChange={handleSearchChange}
            placeholder="Search by title or city..."
            className="bg-transparent outline-none text-sm text-gray-800 w-full"
          />
        </div>
        
        {/* Property Type Filters */}
        <div className="flex gap-1.5 flex-wrap">
          {["villa", "apartment", "house", "studio"].map((type) => (
            <button
              key={type}
              onClick={() => handleFilterChange(type)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-colors
              ${
                filter === type
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredListings.map((l) => (
          <AdminPropertyCard
            key={l._id}
            property={l}
            onView={handleView}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {filteredListings.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 py-12 text-center text-sm text-gray-400">
          No listings found for "{filter}" filter.
        </div>
      )}
    </div>
  );
}

// Stat Card Component
const StatCard = ({ label, count, icon: Icon, color, active, onClick }) => {
  const colors = {
    gray: "bg-gray-50 text-gray-600 border-gray-200",
    green: "bg-green-50 text-green-600 border-green-200",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-200",
    red: "bg-red-50 text-red-600 border-red-200",
  };
  
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
        active 
          ? "ring-2 ring-blue-500 border-blue-500" 
          : colors[color]
      }`}
    >
      <div className="flex items-center gap-2">
        <Icon size={14} />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <span className="text-sm font-bold">{count}</span>
    </button>
  );
};
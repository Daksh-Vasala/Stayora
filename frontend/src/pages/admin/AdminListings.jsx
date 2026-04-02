// AdminListings.jsx
import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import AdminPropertyCard from "../../components/property/AdminPropertyCard";

export default function AdminListings() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/property/admin")
      .then((res) => {
        setListings(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredListings = useMemo(() => {
    return listings.filter((l) => {
      const matchesSearch =
        l.title.toLowerCase().includes(q.toLowerCase()) ||
        l.location.city.toLowerCase().includes(q.toLowerCase());
      const matchesFilter =
        filter === "all" || l.propertyType === filter || l.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [listings, q, filter]);

  const handleView = useCallback((id) => {
    console.log("View property:", id);
    // Navigate to property details
    // navigate(`/properties/${id}`);
  }, []);

  const handleDelete = useCallback(async (id) => {
    if (!confirm("Are you sure you want to delete this property?")) return;
    
    try {
      await axios.delete(`/property/admin/${id}`);
      setListings(prev => prev.filter(l => l._id !== id));
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5 flex-1">
          <Search size={14} className="text-gray-300 shrink-0" />
          <input
            value={q}
            onChange={handleSearchChange}
            placeholder="Search title or city..."
            className="bg-transparent outline-none text-sm text-gray-800 w-full"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {["all", "villa", "apartment", "house", "studio", "inactive"].map(
            (f) => (
              <button
                key={f}
                onClick={() => handleFilterChange(f)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-colors
                ${
                  filter === f
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {f}
              </button>
            )
          )}
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
          No listings found.
        </div>
      )}
    </div>
  );
}
import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Map,
  Grid,
  SlidersHorizontal,
  MapPin,
  Calendar,
  Users,
  Home,
  DollarSign,
} from "lucide-react";
import PropertyCard from "./PropertyCard";
import axios from "axios";

function PropertyPage() {
  const [properties, setProperties] = useState([]);
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get("/property");
        console.log(res);
        setProperties(res.data.data);
      } catch (error) {
        console.log(error);
      }
    }

    getData();
  }, [])

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    propertyType: "",
    priceRange: "",
    maxGuests: "",
    bedrooms: "",
  });
  const [viewMode, setViewMode] = useState("grid"); // grid | list
  const [isLoading, setIsLoading] = useState(true);

  // Mock properties data (replace with API call)

  // Simulate loading
  setTimeout(() => {
    setIsLoading(false);
  }, 1000);

  // Filter properties
  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      !filters.propertyType || property.propertyType === filters.propertyType;

    const matchesPrice =
      !filters.priceRange ||
      (filters.priceRange === "low" && property.pricePerNight < 150) ||
      (filters.priceRange === "medium" &&
        property.pricePerNight >= 150 &&
        property.pricePerNight < 250) ||
      (filters.priceRange === "high" && property.pricePerNight >= 250);

    return matchesSearch && matchesType && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          {/* <h1 className="text-2xl font-bold text-slate-900 mb-4">
            Find Your Perfect Stay
          </h1> */}

          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search by city, property name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <select
                value={filters.propertyType}
                onChange={(e) =>
                  setFilters({ ...filters, propertyType: e.target.value })
                }
                className="px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-blue-500 focus:outline-none"
              >
                <option value="">All Types</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="house">House</option>
                <option value="studio">Studio</option>
              </select>

              <select
                value={filters.priceRange}
                onChange={(e) =>
                  setFilters({ ...filters, priceRange: e.target.value })
                }
                className="px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-blue-500 focus:outline-none"
              >
                <option value="">Price Range</option>
                <option value="low">Under $150</option>
                <option value="medium">$150 - $250</option>
                <option value="high">Over $250</option>
              </select>

              <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors">
                <SlidersHorizontal size={18} className="text-slate-600" />
                <span className="hidden md:inline">More Filters</span>
              </button>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-slate-500">
              Showing {filteredProperties.length} properties
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg ${
                  viewMode === "grid"
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-400 hover:bg-slate-100"
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg ${
                  viewMode === "list"
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-400 hover:bg-slate-100"
                }`}
              >
                <Map size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 animate-pulse"
              >
                <div className="h-64 bg-slate-200 rounded-xl mb-4"></div>
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
                <div className="h-10 bg-slate-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-20">
            <Home className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No properties found
            </h3>
            <p className="text-slate-500">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "flex flex-col gap-4"
            }
          >
            {filteredProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PropertyPage;
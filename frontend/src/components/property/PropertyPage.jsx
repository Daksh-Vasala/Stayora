import { useEffect, useState, useMemo } from "react";
import { Search, Home, MapPin, Filter, X, SlidersHorizontal } from "lucide-react";
import axios from "axios";
import PropertyCard from "./PropertyCard";

function PropertyPage() {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    city: "",
    country: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const getProperties = async () => {
      try {
        const res = await axios.get("/property");
        setProperties(res.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    getProperties();
  }, []);

  // Get unique cities and countries for filter options
  const filterOptions = useMemo(() => {
    const cities = [...new Set(properties.map(p => p.location?.city).filter(Boolean))];
    const countries = [...new Set(properties.map(p => p.location?.country).filter(Boolean))];
    return { cities, countries };
  }, [properties]);

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const matchesSearch = !filters.search || 
        property.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
        property.location?.city?.toLowerCase().includes(filters.search.toLowerCase()) ||
        property.location?.country?.toLowerCase().includes(filters.search.toLowerCase());

      const matchesType = !filters.type || property.propertyType === filters.type;
      const matchesCity = !filters.city || property.location?.city === filters.city;
      const matchesCountry = !filters.country || property.location?.country === filters.country;

      return matchesSearch && matchesType && matchesCity && matchesCountry;
    });
  }, [properties, filters]);

  const clearFilters = () => {
    setFilters({ search: "", type: "", city: "", country: "" });
    setShowFilters(false);
  };

  const hasActiveFilters = filters.search || filters.type || filters.city || filters.country;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-white">
      {/* Search Section - NOT STICKY */}
      <div className="max-w-8xl mx-auto px-4 ">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 md:p-6">
          {/* Main Search Row */}
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, city, or country..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-800 placeholder:text-gray-400"
              />
            </div>

            <div className="flex gap-3">
              <div className="relative min-w-35">
                <Home size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="w-full pl-10 pr-8 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none cursor-pointer text-gray-700"
                >
                  <option value="">All Types</option>
                  <option value="apartment">🏢 Apartment</option>
                  <option value="villa">🏡 Villa</option>
                  <option value="house">🏠 House</option>
                  <option value="studio">📐 Studio</option>
                </select>
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-5 py-3.5 rounded-xl border transition-all flex items-center gap-2 font-medium ${
                  showFilters || hasActiveFilters
                    ? "bg-blue-50 border-blue-300 text-blue-600"
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <SlidersHorizontal size={18} />
                <span className="hidden sm:inline">Filters</span>
                {hasActiveFilters && (
                  <span className="ml-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                    {Object.values(filters).filter(Boolean).length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-700">{filteredProperties.length}</span> properties found
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
              >
                <X size={14} /> Clear all
              </button>
            )}
          </div>

          {/* Expandable Filters Panel */}
          {showFilters && (
            <div className="mt-5 pt-4 border-t border-gray-100 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin size={14} className="inline mr-1" /> City
                  </label>
                  <select
                    value={filters.city}
                    onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="">All Cities</option>
                    {filterOptions.cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🌍 Country
                  </label>
                  <select
                    value={filters.country}
                    onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="">All Countries</option>
                    {filterOptions.countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Properties Grid */}
      <div className="max-w-8xl mx-auto px-4 py-10">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
                <div className="h-52 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">No properties found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
            <button
              onClick={clearFilters}
              className="mt-6 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition shadow-sm"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
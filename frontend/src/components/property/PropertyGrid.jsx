import { useEffect, useState } from "react";
import { Search, Home } from "lucide-react";
import axios from "axios";
import PropertyCard from "./PropertyCard";

function PropertyPage() {
  const [properties, setProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = !propertyType || property.propertyType === propertyType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Search Section */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex gap-2">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search city or property"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Filter */}
            <select className="w-32 px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none">
              <option value="">All</option>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="house">House</option>
            </select>
          </div>

          <p className="text-sm text-slate-500 mt-3">
            {filteredProperties.length} properties found
          </p>
        </div>
      </div>

      {/* Properties */}
      <div className="max-w-8xl mx-auto px-4 md:px-6 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse"
              >
                <div className="h-56 bg-slate-200 rounded-lg mb-4"></div>
                <div className="h-5 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-20">
            <Home className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900">
              No properties found
            </h3>
            <p className="text-slate-500 mt-2">Try adjusting your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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

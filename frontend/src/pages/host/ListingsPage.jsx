import { useState, useEffect } from "react";
import { Plus, Users, BedDouble, Bath, Search } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ListingCard from "../../components/property/ListingCard";

function ListingsPage() {
  const [search, setSearch] = useState("");
  const [listings, setListings] = useState([]);
  const navigate = useNavigate();
  const getData = async () => {
    try {
      const res = await axios.get("/property/host");

      const normalized = res.data.data.map((item) => ({
        id: item._id,
        title: item.title,
        type: item.propertyType,
        location: `${item.location?.address}, ${item.location?.city}`,
        price: item.pricePerNight,
        rating: item.rating,
        bookings: item.reviewCount,
        status: item.status,
        guests: item.maxGuests,
        beds: item.beds,
        baths: item.bathrooms,
        img: item.images?.[0] || "",
      }));

      setListings(normalized);
      console.log(listings);
    } catch (error) {
      console.log(error);
    }
  };
  const handleSoftDelete = async (id) => {
    try {
      const isConfirm = window.confirm("Do you want to delete this?");
      if (isConfirm) {
        await axios.patch(`/property/deactivate/${id}`, { status: "inactive" });
        getData();
        navigate("/host/listings");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {

    getData();
  }, []);

  const filtered = listings.filter((l) =>
    l.title?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-5 p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Listings</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {listings.length} properties
          </p>
        </div>

        <a
          href="/host/new"
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl no-underline transition-colors shrink-0"
        >
          <Plus size={15} /> New Listing
        </a>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-blue-400 transition-colors shadow-sm">
        <Search size={15} className="text-gray-400 shrink-0" />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent outline-none text-sm text-gray-800 w-full placeholder:text-gray-400"
          placeholder="Search listings..."
        />
      </div>

      {/* Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((l) => (
          <ListingCard
            key={l._id || l.id}
            listing={l}
            handleSoftDelete={handleSoftDelete}
          />
        ))}
      </div>
    </div>
  );
}

export default ListingsPage;

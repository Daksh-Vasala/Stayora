const LISTINGS = [
  {
    id: 1,
    title: "Luxury Beach Villa",
    type: "villa",
    location: "Goa, India",
    price: 7500,
    rating: 4.8,
    bookings: 12,
    status: "active",
    guests: 6,
    beds: 3,
    baths: 2,
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80",
  },
  {
    id: 2,
    title: "Modern City Apartment",
    type: "apartment",
    location: "Mumbai, India",
    price: 4200,
    rating: 4.5,
    bookings: 9,
    status: "active",
    guests: 4,
    beds: 2,
    baths: 1,
    img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80",
  },
  {
    id: 3,
    title: "Cozy Hill Cottage",
    type: "house",
    location: "Manali, India",
    price: 3500,
    rating: 4.7,
    bookings: 7,
    status: "active",
    guests: 4,
    beds: 2,
    baths: 1,
    img: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=400&q=80",
  },
  {
    id: 4,
    title: "Luxury Penthouse",
    type: "apartment",
    location: "Bangalore, India",
    price: 9500,
    rating: 4.9,
    bookings: 10,
    status: "inactive",
    guests: 8,
    beds: 4,
    baths: 3,
    img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80",
  },
];

const BOOKINGS = [
  {
    id: "BK001",
    guest: "Priya Sharma",
    property: "Luxury Beach Villa",
    dates: "Dec 24–28",
    amount: "₹30,000",
    status: "confirmed",
  },
  {
    id: "BK002",
    guest: "Rohan Mehta",
    property: "Modern City Apartment",
    dates: "Dec 26–29",
    amount: "₹12,600",
    status: "pending",
  },
  {
    id: "BK003",
    guest: "Anjali Singh",
    property: "Cozy Hill Cottage",
    dates: "Jan 1–5",
    amount: "₹14,000",
    status: "confirmed",
  },
  {
    id: "BK004",
    guest: "Vikram Patel",
    property: "Luxury Penthouse",
    dates: "Jan 3–6",
    amount: "₹28,500",
    status: "cancelled",
  },
  {
    id: "BK005",
    guest: "Neha Gupta",
    property: "Luxury Beach Villa",
    dates: "Jan 8–12",
    amount: "₹37,500",
    status: "confirmed",
  },
];

function EarningsPage() {
  const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const vals = [42000, 61000, 53000, 78000, 91000, 124500];
  const max = Math.max(...vals);

  return (
    <div className="space-y-5 p-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Earnings</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Revenue overview for your properties
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {[
          {
            label: "This Month",
            value: "₹1,24,500",
            sub: "+12.4% vs last month",
          },
          {
            label: "This Year",
            value: "₹4,49,500",
            sub: "Across 6 properties",
          },
          { label: "Pending", value: "₹42,600", sub: "3 upcoming payouts" },
        ].map((c) => (
          <div
            key={c.label}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5"
          >
            <p className="text-xs text-gray-400 font-medium mb-1">{c.label}</p>
            <p className="text-xl font-bold text-gray-900">{c.value}</p>
            <p className="text-xs text-gray-400 mt-1">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-5">
          Monthly Revenue
        </h3>
        <div className="flex items-end gap-2 sm:gap-4 h-36">
          {vals.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <span className="text-[10px] text-gray-400 font-medium">
                ₹{v >= 1000 ? (v / 1000).toFixed(0) + "k" : v}
              </span>
              <div
                className="w-full bg-blue-600 rounded-t-lg transition-all hover:bg-blue-700"
                style={{ height: `${(v / max) * 100}%`, minHeight: 8 }}
              />
              <span className="text-[11px] text-gray-400">{months[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Per-listing earnings */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">
            Earnings by Property
          </h3>
        </div>
        {LISTINGS.map((l, i) => {
          const earned = [37500, 25200, 21000, 47500][i];
          const pct = Math.round((earned / 124500) * 100);
          return (
            <div
              key={l.id}
              className="flex items-center gap-4 px-5 py-4 border-b border-gray-50 last:border-0"
            >
              <img
                src={l.img}
                alt=""
                className="w-10 h-10 rounded-xl object-cover shrink-0"
                onError={(e) => (e.target.style.display = "none")}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {l.title}
                </p>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1.5">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-gray-900">
                  ₹{earned.toLocaleString()}
                </p>
                <p className="text-[11px] text-gray-400">{pct}% of total</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default EarningsPage;

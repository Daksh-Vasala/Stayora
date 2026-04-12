// controllers/hostController.js
const Booking = require("../models/bookingModel");
const Property = require("../models/propertyModel");
const Review = require("../models/reviewModel");

exports.getHostEarnings = async (req, res) => {
  try {
    const hostId = req.user.id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Get all COMPLETED bookings (actual earnings)
    // Status "completed" means stay is done
    const completedBookings = await Booking.find({
      host: hostId,
      status: "completed",
      paymentStatus: "paid", // Guest paid successfully
    }).populate("property", "title");

    // Get CONFIRMED bookings for pending payouts
    // Status "confirmed" means future stay, payment done, host hasn't been paid yet
    const pendingBookings = await Booking.find({
      host: hostId,
      status: "confirmed",
      paymentStatus: "paid",
      checkIn: { $gt: now }, // Future check-in
    });

    // Calculate totals
    const totalEarned = completedBookings.reduce(
      (sum, b) => sum + b.totalPrice,
      0,
    );
    const pendingPayout = pendingBookings.reduce(
      (sum, b) => sum + b.totalPrice,
      0,
    );
    const pendingCount = pendingBookings.length;

    // This month earnings
    const thisMonth = completedBookings
      .filter((b) => b.createdAt >= startOfMonth)
      .reduce((sum, b) => sum + b.totalPrice, 0);

    // Last month for growth
    const lastMonth = completedBookings
      .filter(
        (b) => b.createdAt >= startOfLastMonth && b.createdAt <= endOfLastMonth,
      )
      .reduce((sum, b) => sum + b.totalPrice, 0);

    const monthlyGrowth =
      lastMonth === 0
        ? 0
        : Math.round(((thisMonth - lastMonth) / lastMonth) * 100);

    // Monthly chart data (last 6 months)
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthlyData = [];

    for (let i = 5; i >= 0; i--) {
      const monthIndex = (now.getMonth() - i + 12) % 12;
      const year =
        now.getMonth() - i < 0 ? now.getFullYear() - 1 : now.getFullYear();
      const monthStart = new Date(year, monthIndex, 1);
      const monthEnd = new Date(year, monthIndex + 1, 0);

      const amount = completedBookings
        .filter((b) => b.createdAt >= monthStart && b.createdAt <= monthEnd)
        .reduce((sum, b) => sum + b.totalPrice, 0);

      monthlyData.push({
        month: months[monthIndex],
        amount,
      });
    }

    // Top 3 properties by earnings
    const propertyMap = new Map();
    completedBookings.forEach((booking) => {
      const propId = booking.property._id.toString();
      if (!propertyMap.has(propId)) {
        propertyMap.set(propId, {
          id: propId,
          title: booking.property.title,
          earned: 0,
          bookings: 0,
        });
      }
      const prop = propertyMap.get(propId);
      prop.earned += booking.totalPrice;
      prop.bookings += 1;
    });

    const topProperties = Array.from(propertyMap.values())
      .sort((a, b) => b.earned - a.earned)
      .slice(0, 3);

    res.json({
      totalEarned,
      pendingPayout,
      pendingCount,
      thisMonth,
      monthlyGrowth,
      monthlyData,
      maxAmount: Math.max(...monthlyData.map((m) => m.amount), 1),
      topProperties,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Optional: Get detailed earnings by property
exports.getPropertyEarnings = async (req, res) => {
  try {
    const hostId = req.user.id;

    const properties = await Property.find({ host: hostId });

    const earningsData = await Promise.all(
      properties.map(async (property) => {
        const bookings = await Booking.find({
          property: property._id,
          status: "completed",
          paymentStatus: "paid",
        });

        const totalEarned = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
        const bookingCount = bookings.length;

        return {
          id: property._id,
          title: property.title,
          image: property.img || property.images?.[0],
          totalEarned,
          bookingCount,
          status: property.status,
        };
      }),
    );

    res.json(earningsData.sort((a, b) => b.totalEarned - a.totalEarned));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// controllers/hostController.js
exports.getDashboardStats = async (req, res) => {
  try {
    const hostId = req.user.id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Get all properties
    const properties = await Property.find({ host: hostId });
    const activeListings = properties.filter(p => p.status === "active").length;
    
    // Get completed bookings (earnings)
    const completedBookings = await Booking.find({
      host: hostId,
      status: "completed",
      paymentStatus: "paid"
    });
    
    const totalEarnings = completedBookings.reduce((sum, b) => sum + b.totalPrice, 0);
    
    // This month vs last month earnings
    const thisMonthEarnings = completedBookings
      .filter(b => b.createdAt >= startOfMonth)
      .reduce((sum, b) => sum + b.totalPrice, 0);
    
    const lastMonthEarnings = completedBookings
      .filter(b => b.createdAt >= startOfLastMonth && b.createdAt <= endOfLastMonth)
      .reduce((sum, b) => sum + b.totalPrice, 0);
    
    const earningsChange = lastMonthEarnings === 0 ? 0 : 
      ((thisMonthEarnings - lastMonthEarnings) / lastMonthEarnings) * 100;
    
    // Total bookings count
    const totalBookings = await Booking.countDocuments({ host: hostId });
    
    // Bookings this month vs last month
    const thisMonthBookings = await Booking.countDocuments({
      host: hostId,
      createdAt: { $gte: startOfMonth }
    });
    
    const lastMonthBookings = await Booking.countDocuments({
      host: hostId,
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    });
    
    const bookingsChange = lastMonthBookings === 0 ? 0 :
      ((thisMonthBookings - lastMonthBookings) / lastMonthBookings) * 100;
    
    // Average rating from reviews
    const reviews = await Review.find({ host: hostId });
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length 
      : 0;
    
    res.json({
      totalEarnings,
      earningsChange: Math.round(earningsChange * 10) / 10,
      activeListings,
      listingsChange: 0, // Calculate if you have historical data
      totalBookings,
      bookingsChange: Math.round(bookingsChange * 10) / 10,
      averageRating,
      ratingChange: 0
    });
    
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
};

// Add to hostController.js
exports.getHostBookings = async (req, res) => {
  try {
    const hostId = req.user.id;
    const { limit = 10, status } = req.query;
    
    const query = { host: hostId };
    if (status) query.status = status;
    
    const bookings = await Booking.find(query)
      .populate("guest", "name email")
      .populate("property", "title location images")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    res.json({
      bookings,
      total: await Booking.countDocuments(query)
    });
    
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
};

// Add to hostController.js
exports.getTopProperties = async (req, res) => {
  try {
    const hostId = req.user.id;
    const { limit = 3 } = req.query;
    
    const properties = await Property.find({ host: hostId });
    
    // Get booking counts and ratings for each property
    const propertiesWithStats = await Promise.all(
      properties.map(async (property) => {
        const bookings = await Booking.find({
          property: property._id,
          status: "completed"
        });
        
        const totalBookings = bookings.length;
        const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
        
        // Get average rating from reviews
        const reviews = await Review.find({ property: property._id });
        const averageRating = reviews.length > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : 0;
        
        return {
          ...property.toObject(),
          totalBookings,
          totalRevenue,
          averageRating
        };
      })
    );
    
    // Sort by totalRevenue or totalBookings
    const topProperties = propertiesWithStats
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, parseInt(limit));
    
    res.json(topProperties);
    
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
};
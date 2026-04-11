const Booking = require("../models/bookingModel");
const Property = require("../models/propertyModel");

// controllers/hostController.js
exports.getHostEarnings = async (req, res) => {
  try {
    const hostId = req.user.id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    
    // Get all completed bookings once
    const bookings = await Booking.find({
      host: hostId,
      status: "completed",
      paymentStatus: "paid",
    }).populate("property", "title img");
    
    // 1. This month earnings
    const thisMonth = bookings
      .filter(b => b.createdAt >= startOfMonth)
      .reduce((sum, b) => sum + b.totalPrice, 0);
    
    // 2. Last month for trend calculation
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const lastMonth = bookings
      .filter(b => b.createdAt >= startOfLastMonth && b.createdAt <= endOfLastMonth)
      .reduce((sum, b) => sum + b.totalPrice, 0);
    
    const monthTrend = lastMonth === 0 ? 0 : Math.round(((thisMonth - lastMonth) / lastMonth) * 100);
    
    // 3. This year earnings
    const thisYear = bookings
      .filter(b => b.createdAt >= startOfYear)
      .reduce((sum, b) => sum + b.totalPrice, 0);
    
    // 4. Property count
    const propertyCount = await Property.countDocuments({ host: hostId });
    
    // 5. Pending payouts
    const pendingBookings = await Booking.find({
      host: hostId,
      status: "confirmed",
      paymentStatus: "paid",
      checkOut: { $gte: now },
    });
    
    const pendingAmount = pendingBookings.reduce((sum, b) => sum + b.totalPrice, 0);
    const pendingCount = pendingBookings.length;
    
    // 6. Monthly revenue for chart (last 6 months)
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyRevenue = [];
    
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (now.getMonth() - i + 12) % 12;
      const year = now.getMonth() - i < 0 ? now.getFullYear() - 1 : now.getFullYear();
      const monthStart = new Date(year, monthIndex, 1);
      const monthEnd = new Date(year, monthIndex + 1, 0);
      
      const revenue = bookings
        .filter(b => b.createdAt >= monthStart && b.createdAt <= monthEnd)
        .reduce((sum, b) => sum + b.totalPrice, 0);
      
      monthlyRevenue.push({
        month: months[monthIndex],
        revenue,
      });
    }
    
    const maxRevenue = Math.max(...monthlyRevenue.map(m => m.revenue), 1);
    
    // 7. Top properties (limit to 3)
    const propertyMap = new Map();
    bookings.forEach(booking => {
      const propId = booking.property._id.toString();
      if (!propertyMap.has(propId)) {
        propertyMap.set(propId, {
          id: propId,
          title: booking.property.title,
          image: booking.property.img || booking.property.images?.[0],
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
    
    // Send everything in ONE response
    res.json({
      thisMonth,
      monthTrend,
      thisYear,
      propertyCount,
      pendingAmount,
      pendingCount,
      monthlyRevenue,
      maxRevenue,
      topProperties,
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
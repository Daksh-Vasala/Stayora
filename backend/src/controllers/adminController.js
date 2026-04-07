// controllers/adminController.jssu
const User = require("../models/userModel");
const Property = require("../models/propertyModel");
const Booking = require("../models/bookingModel");

// 1. GET /api/admin/stats - Dashboard statistics
const getAdminStats = async (req, res) => {
  try {
    // Get total users (excluding admins for cleaner stats)
    const totalUsers = await User.countDocuments({ 
      role: { $in: ["guest", "host"] },
      isActive: true 
    });
    
    const totalHosts = await User.countDocuments({ 
      role: "host",
      isActive: true 
    });
    
    const totalGuests = await User.countDocuments({ 
      role: "guest",
      isActive: true 
    });
    
    // Get total properties
    const totalProperties = await Property.countDocuments({ 
      isDeleted: false 
    });
    
    const activeListings = await Property.countDocuments({ 
      status: "active",
      approvalStatus: "approved",
      isDeleted: false 
    });
    
    const pendingApprovals = await Property.countDocuments({ 
      approvalStatus: "pending",
      isDeleted: false 
    });
    
    // Get total bookings
    const totalBookings = await Booking.countDocuments();
    
    const confirmedBookings = await Booking.countDocuments({ 
      status: "confirmed",
      paymentStatus: "paid"
    });
    
    const pendingBookings = await Booking.countDocuments({ 
      status: "pending" 
    });
    
    const cancelledBookings = await Booking.countDocuments({ 
      status: "cancelled" 
    });
    
    // Get total revenue from paid bookings
    const revenueResult = await Booking.aggregate([
      {
        $match: {
          status: "confirmed",
          paymentStatus: "paid"
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" }
        }
      }
    ]);
    
    const totalRevenue = revenueResult[0]?.total || 0;
    
    // Get monthly revenue for chart (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyRevenue = await Booking.aggregate([
      {
        $match: {
          status: "confirmed",
          paymentStatus: "paid",
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          revenue: { $sum: "$totalPrice" }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          hosts: totalHosts,
          guests: totalGuests
        },
        properties: {
          total: totalProperties,
          active: activeListings,
          pending: pendingApprovals
        },
        bookings: {
          total: totalBookings,
          confirmed: confirmedBookings,
          pending: pendingBookings,
          cancelled: cancelledBookings
        },
        revenue: {
          total: totalRevenue,
          monthly: monthlyRevenue
        }
      }
    });
    
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics"
    });
  }
};

// 2. GET /api/admin/recent-bookings - Latest 5 bookings
const getRecentBookings = async (req, res) => {
  try {
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("guest", "name email")
      .populate("property", "title location city pricePerNight images");
    
    const formattedBookings = recentBookings.map(booking => ({
      _id: booking._id,
      user: booking.user,
      property: booking.property,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guestsCount: booking.guestsCount,
      totalPrice: booking.totalPrice,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      createdAt: booking.createdAt
    }));
    
    res.status(200).json({
      success: true,
      data: formattedBookings
    });
    
  } catch (error) {
    console.error("Error fetching recent bookings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recent bookings"
    });
  }
};

// 3. GET /api/admin/pending-properties - Properties pending approval
const getPendingProperties = async (req, res) => {
  try {
    const pendingProperties = await Property.find({
      approvalStatus: "pending",
      isDeleted: false
    })
      .sort({ createdAt: 1 })
      .populate("host", "name email phone")
      .select("-__v");
    
    const formattedProperties = pendingProperties.map(property => ({
      _id: property._id,
      title: property.title,
      description: property.description,
      propertyType: property.propertyType,
      pricePerNight: property.pricePerNight,
      location: property.location,
      images: property.images,
      host: property.host,
      createdAt: property.createdAt,
      status: property.status
    }));
    
    res.status(200).json({
      success: true,
      data: formattedProperties,
      count: formattedProperties.length
    });
    
  } catch (error) {
    console.error("Error fetching pending properties:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pending properties"
    });
  }
};

// Optional: GET /api/admin/recent-users - Latest users
const getRecentUsers = async (req, res) => {
  try {
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("-password -resetPasswordToken -verificationToken");
    
    res.status(200).json({
      success: true,
      data: recentUsers
    });
    
  } catch (error) {
    console.error("Error fetching recent users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recent users"
    });
  }
};

// Optional: GET /api/admin/recent-properties - Latest properties
const getRecentProperties = async (req, res) => {
  try {
    const recentProperties = await Property.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("host", "name email");
    
    res.status(200).json({
      success: true,
      data: recentProperties
    });
    
  } catch (error) {
    console.error("Error fetching recent properties:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recent properties"
    });
  }
};

module.exports = {
  getAdminStats,
  getRecentBookings,
  getPendingProperties,
  getRecentUsers,
  getRecentProperties
};
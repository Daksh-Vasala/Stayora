// controllers/adminController.jssu
const User = require("../models/userModel");
const Property = require("../models/propertyModel");
const Booking = require("../models/bookingModel");
const Dispute = require("../models/disputeModel");
const mongoose = require("mongoose")

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } });

    if (!users) {
      return res.status(400).json({ message: "No user found" });
    }

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

const getAllPropertiesForAdmin = async (req, res) => {
  try {
    const properties = await Property.find().populate("host", "name email");
    res.status(200).json({
      message: "Properties fetched",
      data: properties,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const approveProperty = async (req, res) => {
  try {
    const property = await Property.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!property) {
      return res.status(400).json({ message: "Property not found" });
    }

    property.approvalStatus = "approved";
    await property.save();
    res.status(200).json({
      message: "Property approved",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

const rejectProperty = async (req, res) => {
  try {
    const property = await Property.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!property) {
      return res.status(400).json({ message: "Property not found" });
    }

    property.approvalStatus = "rejected";
    property.status = "inactive";
    await property.save();
    res.status(200).json({
      message: "Property rejected",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const booking = await Booking.find().populate("property").populate("guest");

    if (!booking) {
      return res.status(404).json({ message: "Bookings not found" });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// UPDATE BOOKING
const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      },
    );

    res.json({
      success: true,
      data: updatedBooking,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

const toggleStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const newStatus = req.body.status;
    const currentStatus = booking.status;

    if (["cancelled", "completed"].includes(currentStatus)) {
      return res.status(400).json({
        message: "Booking already finalized",
      });
    }

    // 🎯 Handle transitions
    if (newStatus === "confirmed") {
      if (booking.paymentStatus !== "paid") {
        return res.status(400).json({
          message: "Cannot confirm unpaid booking",
        });
      }
      booking.status = "confirmed";
    }

    else if (newStatus === "cancelled") {
      booking.status = "cancelled";
      booking.cancelledAt = new Date();
    }

    else if (newStatus === "completed") {
      const now = new Date();
      if (now < booking.checkOut) {
        return res.status(400).json({
          message: "Cannot complete before checkout",
        });
      }
      booking.status = "completed";
      booking.completedAt = new Date();
    }

    else {
      return res.status(400).json({
        message: "Invalid status transition",
      });
    }

    await booking.save();

    res.json({
      success: true,
      message: "Booking status updated",
      booking,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};
// 1. GET /api/admin/stats - Dashboard statistics
const getAdminStats = async (req, res) => {
  try {
    // Get total users (excluding admins for cleaner stats)
    const totalUsers = await User.countDocuments({
      role: { $in: ["guest", "host"] },
      isActive: true,
    });

    const totalHosts = await User.countDocuments({
      role: "host",
      isActive: true,
    });

    const totalGuests = await User.countDocuments({
      role: "guest",
      isActive: true,
    });

    // Get total properties
    const totalProperties = await Property.countDocuments({
      isDeleted: false,
    });

    const activeListings = await Property.countDocuments({
      status: "active",
      approvalStatus: "approved",
      isDeleted: false,
    });

    const pendingApprovals = await Property.countDocuments({
      approvalStatus: "pending",
      isDeleted: false,
    });

    // Get total bookings
    const totalBookings = await Booking.countDocuments();

    const confirmedBookings = await Booking.countDocuments({
      status: "confirmed",
      paymentStatus: "paid",
    });

    const pendingBookings = await Booking.countDocuments({
      status: "pending",
    });

    const cancelledBookings = await Booking.countDocuments({
      status: "cancelled",
    });

    // Get total revenue from paid bookings
    const revenueResult = await Booking.aggregate([
      {
        $match: {
          status: "confirmed",
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
        },
      },
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
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$totalPrice" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          hosts: totalHosts,
          guests: totalGuests,
        },
        properties: {
          total: totalProperties,
          active: activeListings,
          pending: pendingApprovals,
        },
        bookings: {
          total: totalBookings,
          confirmed: confirmedBookings,
          pending: pendingBookings,
          cancelled: cancelledBookings,
        },
        revenue: {
          total: totalRevenue,
          monthly: monthlyRevenue,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
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

    const formattedBookings = recentBookings.map((booking) => ({
      _id: booking._id,
      user: booking.user,
      property: booking.property,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guestsCount: booking.guestsCount,
      totalPrice: booking.totalPrice,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      createdAt: booking.createdAt,
    }));

    res.status(200).json({
      success: true,
      data: formattedBookings,
    });
  } catch (error) {
    console.error("Error fetching recent bookings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recent bookings",
    });
  }
};

// 3. GET /api/admin/pending-properties - Properties pending approval
const getPendingProperties = async (req, res) => {
  try {
    const pendingProperties = await Property.find({
      approvalStatus: "pending",
      isDeleted: false,
    })
      .sort({ createdAt: 1 })
      .populate("host", "name email phone")
      .select("-__v");

    const formattedProperties = pendingProperties.map((property) => ({
      _id: property._id,
      title: property.title,
      description: property.description,
      propertyType: property.propertyType,
      pricePerNight: property.pricePerNight,
      location: property.location,
      images: property.images,
      host: property.host,
      createdAt: property.createdAt,
      status: property.status,
    }));

    res.status(200).json({
      success: true,
      data: formattedProperties,
      count: formattedProperties.length,
    });
  } catch (error) {
    console.error("Error fetching pending properties:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pending properties",
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
      data: recentUsers,
    });
  } catch (error) {
    console.error("Error fetching recent users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recent users",
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
      data: recentProperties,
    });
  } catch (error) {
    console.error("Error fetching recent properties:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recent properties",
    });
  }
};

// Get all disputes (Admin only)
const getAllDisputes = async (req, res) => {
  try {
    const { status } = req.query;

    // Build query
    let query = {};
    if (
      status &&
      ["open", "resolved", "rejected"].includes(status)
    ) {
      query.status = status;
    }

    const disputes = await Dispute.find(query)
      .populate({
        path: "booking",
        populate: [
          {
            path: "property",
            select: "title", // property name
          },
          {
            path: "host",
            select: "name email",
          },
        ],
      })
      .populate("raisedBy", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: disputes.length,
      disputes,
    });
  } catch (error) {
    console.error("Get all disputes error:", error);
    res.status(500).json({ message: "Failed to fetch disputes" });
  }
};

const updateDisputeStatus = async (req, res) => {
  try {
    const disputeId = req.params.id;
    let { status, resolution } = req.body;

    // ✅ Validate ID
    if (!mongoose.Types.ObjectId.isValid(disputeId)) {
      return res.status(400).json({
        message: "Invalid dispute ID",
      });
    }

    // ✅ Normalize status
    status = status?.toLowerCase();

    if (!["resolved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    // ✅ Validate resolution
    if (!resolution || resolution.trim() === "") {
      return res.status(400).json({
        message: "Resolution message is required",
      });
    }

    const dispute = await Dispute.findById(disputeId);

    if (!dispute) {
      return res.status(404).json({
        message: "Dispute not found",
      });
    }

    // ✅ Prevent re-processing
    if (dispute.status !== "open") {
      return res.status(400).json({
        message: "Dispute already handled",
      });
    }

    // ✅ Apply update
    dispute.status = status;
    dispute.resolution = resolution.trim();
    dispute.resolvedAt = new Date();

    await dispute.save();

    res.json({
      success: true,
      dispute,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// controllers/adminController.js
const getFinancials = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Get all completed bookings
    const completedBookings = await Booking.find({
      status: "completed",
      paymentStatus: "paid"
    }).populate("guest", "name").populate("property", "title");
    
    // Summary calculations
    const totalRevenue = completedBookings.reduce((s, b) => s + b.totalPrice, 0);
    const platformFees = totalRevenue * 0.15;
    const hostPayouts = totalRevenue * 0.85;
    
    // This month revenue
    const thisMonthRevenue = completedBookings
      .filter(b => b.createdAt >= startOfMonth)
      .reduce((s, b) => s + b.totalPrice, 0);
    
    // Pending payouts
    const pendingBookings = await Booking.find({
      status: "confirmed",
      paymentStatus: "paid",
      checkIn: { $gt: now }
    });
    const pendingAmount = pendingBookings.reduce((s, b) => s + (b.totalPrice * 0.85), 0);
    
    // Monthly chart data (last 6 months)
    const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyRevenue = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      const revenue = completedBookings
        .filter(b => b.createdAt >= monthStart && b.createdAt <= monthEnd)
        .reduce((s, b) => s + b.totalPrice, 0);
      monthlyRevenue.push(revenue);
    }
    
    // Recent transactions (last 10)
    const recentBookings = await Booking.find({
      status: "completed",
      paymentStatus: "paid"
    })
      .populate("guest", "name")
      .populate("property", "title")
      .sort({ createdAt: -1 })
      .limit(10);
    
    const transactions = recentBookings.map(b => ({
      id: b._id,
      guest: b.guest?.name || "Guest",
      property: b.property?.title || "Property",
      amount: b.totalPrice,
      date: new Date(b.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      status: "completed"
    }));
    
    res.json({
      summary: {
        totalRevenue,
        platformFees: Math.round(platformFees),
        hostPayouts: Math.round(hostPayouts),
        pendingAmount: Math.round(pendingAmount),
        monthlyGrowth: thisMonthRevenue ? 18 : 0
      },
      chart: {
        months,
        revenue: monthlyRevenue,
        maxRevenue: Math.max(...monthlyRevenue, 1)
      },
      transactions
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAdminStats,
  getRecentBookings,
  getPendingProperties,
  getRecentUsers,
  getRecentProperties,
  getAllUsers,
  getAllPropertiesForAdmin,
  approveProperty,
  rejectProperty,
  getAllBookings,
  updateBooking,
  toggleStatus,
  updateDisputeStatus,
  getAllDisputes,
  getFinancials
};

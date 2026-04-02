const Property = require("../models/propertyModel");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

const createProperty = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one image is required" });
    }

    // upload images
    const uploads = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file.buffer)),
    );

    const imageUrls = uploads.map((img) => ({
      url: img.secure_url,
      public_id: img.public_id,
    }));

    // parse location
    let location = {};
    try {
      location = JSON.parse(req.body.location);
    } catch (err) {
      return res.status(400).json({ message: "Invalid location format" });
    }

    const property = await Property.create({
      title: req.body.title,
      description: req.body.description,
      propertyType: req.body.propertyType,
      pricePerNight: req.body.pricePerNight,
      maxGuests: req.body.maxGuests,
      bedrooms: req.body.bedrooms,
      bathrooms: req.body.bathrooms,
      beds: req.body.beds,
      amenities: req.body.amenities,
      location,
      images: imageUrls,
      host: req.user.id,
    });

    res.status(201).json({
      message: "Property created successfully",
      data: property,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find({ status: "active" }).populate(
      "host",
      "name email",
    );
    res.status(200).json({
      message: "Properties fetched",
      data: properties,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllPropertiesForAdmin = async (req, res) => {
  try {
    const properties = await Property.find().populate(
      "host",
      "name email",
    );
    res.status(200).json({
      message: "Properties fetched",
      data: properties,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "host",
      "name email",
    );

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    res.status(200).json({
      message: "Property fetched",
      data: property,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateProperty = async (req, res) => {
  const { existingImages, deletedImages } = req.body;

  const parsedExisting = JSON.parse(existingImages || "[]");
  const parsedDeleted = JSON.parse(deletedImages || "[]");

  // 1. 🔥 Delete removed images from Cloudinary
  for (const public_id of parsedDeleted) {
    await uploadToCloudinary.uploader.destroy(public_id);
  }

  // 2. 🔥 Upload new images (multer files)
  const uploaded = [];
  if (req.files?.length) {
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path);
      uploaded.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }
  }

  // 3. 🔥 Final images array
  const finalImages = [...parsedExisting, ...uploaded];

  // 4. Update DB
  const updated = await Property.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      images: finalImages,
    },
    { new: true },
  );

  res.json({ success: true, data: updated });
};

const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }
    // Only admin allowed
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can delete" });
    }

    property.status = "deleted";
    await property.save();

    res.status(200).json({
      message: "Property marked as deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getPropertiesOfHost = async (req, res) => {
  try {
    const properties = await Property.find({
      host: req.user.id,
      status: { $ne: "deleted" },
    });

    res.status(200).json({
      message: "Properties fetched",
      data: properties,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const toggleStatus = async (req, res) => {
  try {
    const newStatus = req.body.status;
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (req.user.id !== property.host.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    property.status = newStatus || property.status;
    await property.save();

    res.status(200).json({
      message: "Property deactivated",
      data: property,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllProperties,
  createProperty,
  getPropertyById,
  deleteProperty,
  updateProperty,
  getPropertiesOfHost,
  toggleStatus,
  getAllPropertiesForAdmin
};

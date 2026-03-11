const Property = require("../models/propertyModel");

const getProperties = async (req, res) => {
  try {
    const properties = await Property.find();
    res.status(200).json({ message: "Data fetched", data: properties });
  } catch (error) {
    console.log(error);
    res.status(200).json({ message: "Internal server error", error });
  }
};

module.exports = { getProperties };

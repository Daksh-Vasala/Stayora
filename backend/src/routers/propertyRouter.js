const { getAllProperties, createProperty, getPropertyById, updateProperty, deleteProperty } = require("../controllers/propertyController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = require("express").Router();

router.post("/", createProperty);

router.get("/", authMiddleware, getAllProperties);

router.get("/:id", getPropertyById);

router.put("/:id", updateProperty);

router.delete("/:id", deleteProperty);


module.exports = router
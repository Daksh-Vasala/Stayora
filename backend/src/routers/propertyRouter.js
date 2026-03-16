const { getAllProperties, createProperty, getPropertyById, updateProperty, deleteProperty } = require("../controllers/propertyController");
const authMiddleware = require("../middlewares/authMiddleware");
const hostMiddleware = require("../middlewares/hostMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = require("express").Router();

router.post("/", upload.single("images"), createProperty);

router.get("/",  getAllProperties);

router.get("/:id", getPropertyById);

router.put("/:id", updateProperty);

router.delete("/:id", deleteProperty);

module.exports = router
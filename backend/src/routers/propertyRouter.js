const { getAllProperties, createProperty, getPropertyById, updateProperty, deleteProperty, getPropertiesOfHost, softDeleteProperty } = require("../controllers/propertyController");
const authMiddleware = require("../middlewares/authMiddleware");
const hostMiddleware = require("../middlewares/hostMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = require("express").Router();

router.get("/",  getAllProperties);

router.post("/", authMiddleware, hostMiddleware, upload.array("images"), createProperty);

router.get("/host", authMiddleware, hostMiddleware, getPropertiesOfHost);

router.get("/:id", authMiddleware, getPropertyById);

router.put("/:id", updateProperty);

router.patch("/deactivate/:id", authMiddleware, hostMiddleware, softDeleteProperty);

router.patch("/delete/:id", authMiddleware, deleteProperty);

module.exports = router
const {
  getAllProperties,
  createProperty,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getPropertiesOfHost,
  toggleStatus,
  getAllPropertiesForAdmin,
} = require("../controllers/propertyController");
const authMiddleware = require("../middlewares/authMiddleware");
const hostMiddleware = require("../middlewares/hostMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = require("express").Router();

router.get("/", getAllProperties);

router.post(
  "/",
  authMiddleware,
  hostMiddleware,
  upload.array("images"),
  createProperty,
);

router.get("/host", authMiddleware, hostMiddleware, getPropertiesOfHost);

router.get("/admin", authMiddleware, adminMiddleware, getAllPropertiesForAdmin);

router.get("/:id", getPropertyById);

router.put(
  "/:id",
  authMiddleware,
  hostMiddleware,
  upload.array("images"),
  updateProperty,
);

router.patch("/deactivate/:id", authMiddleware, hostMiddleware, toggleStatus);

router.patch("/delete/:id", authMiddleware, deleteProperty);


module.exports = router;

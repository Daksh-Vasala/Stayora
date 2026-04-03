const {
  getAllProperties,
  createProperty,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getPropertiesOfHost,
  toggleStatus,
  getAllPropertiesForAdmin,
  approveProperty,
  rejectProperty,
} = require("../controllers/propertyController");
const authMiddleware = require("../middlewares/authMiddleware");
const hostMiddleware = require("../middlewares/hostMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const allowedRoles = require("../middlewares/allowedRoles");
const upload = require("../middlewares/uploadMiddleware");

const router = require("express").Router();

router.get("/", getAllProperties);

router.post(
  "/",
  authMiddleware,
  allowedRoles("host"),
  upload.array("images"),
  createProperty,
);

router.get("/host", authMiddleware, allowedRoles("host"), getPropertiesOfHost);

router.get("/admin", authMiddleware, allowedRoles("admin"), getAllPropertiesForAdmin);

router.get("/:id", getPropertyById);

router.put(
  "/:id",
  authMiddleware,
  allowedRoles("host"),
  upload.array("images"),
  updateProperty,
);

router.patch("/deactivate/:id", authMiddleware, allowedRoles("host", "admin"), toggleStatus);

router.patch("/delete/:id", authMiddleware, allowedRoles("host", "admin"), deleteProperty);

router.patch("/:id/approve", authMiddleware, allowedRoles("admin"), approveProperty);

router.patch("/:id/reject", authMiddleware, allowedRoles("admin"), rejectProperty);

module.exports = router;

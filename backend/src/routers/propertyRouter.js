const {
  getAllProperties,
  createProperty,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getPropertiesOfHost,
  toggleStatus,
} = require("../controllers/propertyController");
const authMiddleware = require("../middlewares/authMiddleware");
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

module.exports = router;

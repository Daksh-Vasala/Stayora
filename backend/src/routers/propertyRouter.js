const { getProperties } = require("../controllers/propertyController");

const router = require("express").Router();

router.get("/", getProperties);

module.exports = router
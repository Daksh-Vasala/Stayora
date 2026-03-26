const express = require("express");
const router = express.Router();

const { getUserChats, createChat } = require("../controllers/chatController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware, getUserChats);

router.post("/", authMiddleware, createChat);

module.exports = router;
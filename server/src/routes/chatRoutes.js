const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

// Route to handle chat completions
router.post("/completions", chatController.handleChatCompletion);

// Route to get chats by title
router.get("/getChatsByTitle", chatController.getChatsByTitle);

module.exports = router;

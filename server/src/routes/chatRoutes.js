const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

// Route to handle chat completions
router.post("/completions", chatController.handleChatCompletion);

router.get("/getAllChats", chatController.getAllChats); // Route for getting all chats

// Route to get chats by title
router.post("/getChatsByChatId", chatController.getChatsByChatId);

//clear all the chats
router.delete("/deleteAllChats", chatController.deleteAllChats);

//delete chat by title
router.delete("/deleteChatsByChatId", chatController.deleteChatsByChatId);

//rename title
router.put("/renameTitle", chatController.renameChatTitle);

module.exports = router;

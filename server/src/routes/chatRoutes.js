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
router.delete(
  "/deleteChatsByChatId/:chat_id",
  chatController.deleteChatsByChatId
);

//rename title
router.put("/renameTitle", chatController.renameChatTitle);

//archived chats
router.get("/archived-chats", chatController.getArchivedChats);

//mark as archived
router.post("/archive-title", chatController.archiveTitle);

//unarchive chat by title
router.post("/unarchive-title", chatController.unarchiveTitle);

//fetch chats for sharing
router.get("/fetch-share-chat", chatController.fetchShareChatById);
module.exports = router;

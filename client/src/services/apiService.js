// Services/apiService.js

import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api"; // Your API base URL

// Function to fetch chats by title
export const fetchChatsByChatId = async (chat_id) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/getChatsByChatId`, {
      chat_id,
    });
    return response.data; // Assuming the response data is the chat array
  } catch (error) {
    console.error("Error fetching chats by title:", error);
    throw error;
  }
};

// Function to fetch all chat titles
export const fetchAllChatTitles = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getAllChats`);
    return response.data; // Assuming this returns an array of titles
  } catch (error) {
    console.error("Error fetching chat titles:", error);
    throw error;
  }
};

// Function to delete all chats
export const deleteAllChats = async () => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/deleteAllChats`);
    return response.data; // Optionally return the response data
  } catch (error) {
    console.error("Error deleting all chats:", error);
    throw error;
  }
};

//function to delete chat by title
export const deleteChatsByChatId = async (chat_id) => {
  try {
    console.log("chat_id", chat_id);
    await axios.delete(`${API_BASE_URL}/deleteChatsByChatId/${chat_id}`);
    return true; // Return true if the delete was successful
  } catch (error) {
    console.error("Error deleting chat:", error);
    throw error; // Rethrow the error for handling in the caller
  }
};

// Function to rename a chat title
export const renameChatTitle = async (chat_id, newTitle) => {
  const response = await axios.put(`${API_BASE_URL}/renameTitle`, {
    chat_id,
    newTitle,
  });
  return response.data;
};

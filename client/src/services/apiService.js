// Services/apiService.js

import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api"; // Your API base URL

// Function to fetch chats by title
export const fetchChatsByTitle = async (title) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/getChatsByTitle`, {
      title,
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

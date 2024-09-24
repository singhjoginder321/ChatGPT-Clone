const express = require("express");
const cors = require("cors");
const db = require("./config/db"); // Import the database configuration
const chatRoutes = require("./routes/chatRoutes"); // Import chat routes

const app = express();
const PORT = process.env.PORT || 8000; // Use environment variable or default to 8000

// Middleware
app.use(cors());
app.use(express.json());

// Connect to the database and start the server
const startServer = async () => {
  try {
    await db.connectDb(); // Connect to the database

    // Use chat routes
    app.use("/api", chatRoutes);

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

// Graceful shutdown
process.on("SIGINT", async () => {
  await db.closeClient(); // Close the database connection
  process.exit();
});

// Start the server
startServer();

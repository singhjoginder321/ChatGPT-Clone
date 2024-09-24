const { Client } = require("pg");

// Create a new client instance for PostgreSQL
const client = new Client({
  host: process.env.DB_HOST || "localhost", // Database host
  user: process.env.DB_USER || "postgres", // Database user
  password: process.env.DB_PASSWORD || "1234", // Database password
  database: process.env.DB_NAME || "chatgpt", // Database name
  port: process.env.DB_PORT || 5432, // Default PostgreSQL port
});

// Connect to the database
const connectDb = async () => {
  try {
    await client.connect();
    console.log("Connected to the database successfully.");
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
};

// Function to execute a query
const query = async (text, params) => {
  try {
    const res = await client.query(text, params);
    return res;
  } catch (error) {
    console.error("Query error:", error);
    throw error;
  }
};

// Function to close the client connection when the application is shutting down
const closeClient = async () => {
  try {
    await client.end();
    console.log("Database connection closed.");
  } catch (error) {
    console.error("Error closing the database connection:", error);
  }
};

// Export the functions for use in other modules
module.exports = {
  connectDb,
  query,
  closeClient,
};

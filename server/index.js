// server.js
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Route to handle chat completions
app.post("/api/completions", (req, res) => {
  // You can log the incoming request here if needed
  console.log(req.body); // For debugging purposes

  // Respond with "Hello World!"
  res.json({
    choices: [
      {
        message: {
          role: "assistant",
          content: "Hello World!",
        },
      },
    ],
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

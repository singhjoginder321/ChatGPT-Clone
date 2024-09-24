const db = require("../config/db");

// Handle chat completion request
// Handle chat completion request
exports.handleChatCompletion = async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required." });
  }

  try {
    // Save user message
    await db.query(
      "INSERT INTO chats (title, role, content, created_at) VALUES ($1, $2, $3, NOW())",
      [title, "user", content]
    );

    // Create assistant's response (you can customize this as needed)
    const assistantContent =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit."; // Your response logic here

    // Save assistant message
    await db.query(
      "INSERT INTO chats (title, role, content, created_at) VALUES ($1, $2, $3, NOW())",
      [title, "assistant", assistantContent]
    );

    // Respond with both messages
    res.status(201).json({
      choices: [
        {
          message: {
            role: "assistant",
            content: assistantContent,
          },
        },
      ],
    });
  } catch (error) {
    console.error("Error saving chat:", error);
    res.status(500).json({ error: "Failed to save chat." });
  }
};
// Get chats by title
exports.getChatsByTitle = async (req, res) => {
  const { title } = req.body; // Retrieve title from the request body

  if (!title) {
    return res.status(400).json({ error: "Title is required." });
  }

  try {
    const result = await db.query(
      "SELECT * FROM chats WHERE title = $1 ORDER BY created_at",
      [title]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No chats found for this title." });
    }

    res.json(result.rows); // Respond with the retrieved chats
  } catch (error) {
    console.error("Error retrieving chats:", error);
    res.status(500).json({ error: "Failed to retrieve chats." });
  }
};

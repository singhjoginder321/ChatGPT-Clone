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
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elit"; // Your response logic here

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

//Get all chats
exports.getAllChats = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM chats ORDER BY created_at ASC"
    ); // You might want to adjust the order based on your requirements

    // If no chats are found
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No chats found." });
    }

    res.json(result.rows); // Respond with the retrieved chats
  } catch (error) {
    console.error("Error retrieving chats:", error);
    res.status(500).json({ error: "Failed to retrieve chats." });
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

// Delete all chats
exports.deleteAllChats = async (req, res) => {
  try {
    const result = await db.query("DELETE FROM chats");

    // If no rows were affected
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "No chats to delete." });
    }

    res.status(204).send(); // Respond with no content
  } catch (error) {
    console.error("Error deleting chats:", error);
    res.status(500).json({ error: "Failed to delete chats." });
  }
};

// Delete chats by title
exports.deleteChatsByTitle = async (req, res) => {
  const { title } = req.body; // Get the title from the request body

  // Validate input
  if (!title) {
    return res.status(400).json({ error: "Title is required." });
  }

  try {
    const result = await db.query("DELETE FROM chats WHERE title = $1", [
      title,
    ]);

    // If no rows were affected
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "No chats found with this title." });
    }

    res.status(204).send(); // Respond with no content
  } catch (error) {
    console.error("Error deleting chats by title:", error);
    res.status(500).json({ error: "Failed to delete chats." });
  }
};

// Rename chats by title
exports.renameChatTitle = async (req, res) => {
  const { oldTitle, newTitle } = req.body; // Get old and new titles from the request body

  // Validate input
  if (!oldTitle || !newTitle) {
    return res
      .status(400)
      .json({ error: "Both old and new titles are required." });
  }

  try {
    const result = await db.query(
      "UPDATE chats SET title = $1 WHERE title = $2",
      [newTitle, oldTitle]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "No chats found with the old title." });
    }

    res.status(200).json({ message: "Title updated successfully." });
  } catch (error) {
    console.error("Error renaming chats:", error);
    res.status(500).json({ error: "Failed to rename chats." });
  }
};

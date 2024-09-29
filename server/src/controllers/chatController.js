const db = require("../config/db");
const { v4: uuidv4 } = require("uuid"); // For generating new UUIDs if needed

// Handle chat completion request
exports.handleChatCompletion = async (req, res) => {
  const { chat_id, title, content, role } = req.body;

  if (!chat_id || !title || !content || !role) {
    return res
      .status(400)
      .json({ error: "chat_id, title, content, and role are required." });
  }

  try {
    // Check if the title already exists for the given chat_id
    const existingTitle = await db.query(
      "SELECT * FROM titles WHERE chat_id = $1",
      [chat_id]
    );

    if (existingTitle.rows.length === 0) {
      await db.query("INSERT INTO titles (chat_id, title) VALUES ($1, $2)", [
        chat_id,
        title,
      ]);
    }

    // Save the user message
    await db.query(
      "INSERT INTO chats (title_id, role, content) VALUES ($1, $2, $3)",
      [chat_id, role, content]
    );

    // Create assistant's response (your logic here)
    const assistantContent =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip. "; // Example response

    // Save assistant message
    await db.query(
      "INSERT INTO chats (title_id, role, content) VALUES ($1, $2, $3)",
      [chat_id, "assistant", assistantContent]
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

// Get all chats
exports.getAllChats = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
          titles.chat_id AS chat_id,
          titles.title AS title 
      FROM 
          titles 
      ORDER BY 
          titles.created_at ASC
    `);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No titles found." });
    }

    // Map the results to include only chat_id and title
    const formattedTitles = result.rows.map((title) => ({
      chat_id: title.chat_id,
      title: title.title,
    }));

    res.json(formattedTitles);
  } catch (error) {
    console.error("Error retrieving titles:", error);
    res.status(500).json({ error: "Failed to retrieve titles." });
  }
};

// Get chats by title
exports.getChatsByChatId = async (req, res) => {
  const { chat_id } = req.body; // Expecting chat_id in the request body

  if (!chat_id) {
    return res.status(400).json({ error: "chat_id is required." });
  }

  try {
    // Fetch chats by chat_id
    const chatsResult = await db.query(
      `
          SELECT 
              chats.id, 
              titles.title AS title, 
              chats.role, 
              chats.content, 
              chats.created_at 
          FROM 
              chats 
          JOIN 
              titles 
          ON 
              chats.title_id = titles.chat_id 
          WHERE 
              titles.chat_id = $1 
          ORDER BY 
              chats.created_at ASC
          `,
      [chat_id]
    );

    // If no chats are found
    if (chatsResult.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No chats found for this chat_id." });
    }

    res.json(chatsResult.rows);
  } catch (error) {
    console.error("Error retrieving chats:", error);
    res.status(500).json({ error: "Failed to retrieve chats." });
  }
};

// Delete all chats
exports.deleteAllChats = async (req, res) => {
  try {
    await db.query("DELETE FROM titles");
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting chats:", error);
    res.status(500).json({ error: "Failed to delete chats." });
  }
};

// Delete chats by title
exports.deleteChatsByChatId = async (req, res) => {
  //const { chat_id } = req.body; // Expecting chat_id in the request body
  const { chat_id } = req.params;
  console.log("chat_id", chat_id);

  if (!chat_id) {
    return res.status(400).json({ error: "chat_id is required." });
  }

  try {
    // Check if the chat_id exists in the titles table
    const titleResult = await db.query(
      "SELECT title FROM titles WHERE chat_id = $1",
      [chat_id]
    );

    if (titleResult.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No chats found with this chat_id." });
    }

    // Delete chats associated with the given chat_id
    const result = await db.query("DELETE FROM titles WHERE chat_id = $1", [
      chat_id,
    ]);

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "No chats found for this chat_id." });
    }

    res.status(204).send(); // Respond with no content
  } catch (error) {
    console.error("Error deleting chats by chat_id:", error);
    res.status(500).json({ error: "Failed to delete chats." });
  }
};

// Rename chats by title
exports.renameChatTitle = async (req, res) => {
  const { chat_id, newTitle } = req.body; // Expecting chat_id and newTitle in the request body

  if (!chat_id || !newTitle) {
    return res
      .status(400)
      .json({ error: "Both chat_id and newTitle are required." });
  }

  try {
    // Check if the chat_id exists in the titles table
    const titleResult = await db.query(
      "SELECT title FROM titles WHERE chat_id = $1",
      [chat_id]
    );

    if (titleResult.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No title found with this chat_id." });
    }

    // Update the title associated with the given chat_id
    const result = await db.query(
      "UPDATE titles SET title = $1 WHERE chat_id = $2",
      [newTitle, chat_id]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "No title updated for the provided chat_id." });
    }

    res.status(200).json({ message: "Title updated successfully." });
  } catch (error) {
    console.error("Error renaming chat title:", error);
    res.status(500).json({ error: "Failed to rename chat title." });
  }
};

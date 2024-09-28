/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("chats").del();
  await knex("chats").insert([
    {
      title_id: "550e8400-e29b-41d4-a716-446655440000",
      role: "user",
      content: "Hello, this is a user message!",
      created_at: new Date(),
    },
    {
      title_id: "550e8400-e29b-41d4-a716-446655440000",
      role: "assistant",
      content: "Hello, this is an assistant response.",
      created_at: new Date(),
    },
  ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("titles").del();
  await knex("titles").insert([
    {
      chat_id: "550e8400-e29b-41d4-a716-446655440000",
      title: "Chat Title 1",
      created_at: new Date(),
    },
    {
      chat_id: "550e8400-e29b-41d4-a716-446655440001",
      title: "Chat Title 2",
      created_at: new Date(),
    },
  ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("chats", function (table) {
    table.increments("id").primary(); // Serial primary key
    table
      .uuid("title_id")
      .references("chat_id")
      .inTable("titles")
      .onDelete("CASCADE"); // Foreign key referencing titles
    table.text("role").notNullable(); // Role must be not null
    table.text("content").notNullable(); // Content must be not null
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("chats");
};

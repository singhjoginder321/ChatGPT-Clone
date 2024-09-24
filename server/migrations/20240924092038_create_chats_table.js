exports.up = function (knex) {
  return knex.schema.createTable("chats", (table) => {
    table.increments("id").primary();
    table.string("title").notNullable();
    table.string("role").notNullable();
    table.text("content").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("chats");
};

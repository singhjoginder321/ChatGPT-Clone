// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "pg",
    connection: {
      host: process.env.PG_HOST, // Localhost
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      port: process.env.PG_PORT, // Default PostgreSQL port
    },
    migrations: {
      directory: "./migrations", // Directory for migration files
      tableName: "knex_migrations", // Table to track migrations
    },
  },

  staging: {
    client: "pg",
    connection: {
      host: process.env.PG_HOST, // Localhost
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      port: process.env.PG_PORT, // Default PostgreSQL port
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "./migrations", // Directory for migration files
      tableName: "knex_migrations", // Table to track migrations
    },
  },

  production: {
    client: "pg",
    connection: {
      host: process.env.PG_HOST, // Localhost
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      port: process.env.PG_PORT, // Default PostgreSQL port
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "./migrations", // Directory for migration files
      tableName: "knex_migrations", // Table to track migrations
    },
  },
};

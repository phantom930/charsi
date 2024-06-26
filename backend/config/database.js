module.exports = ({ env }) => ({
  defaultConnection: "postgres",
  connections: {
    default: {
      connector: "bookshelf",
      settings: {
        client: "sqlite",
        filename: env("DATABASE_FILENAME", ".tmp/data.db"),
      },
      options: {
        useNullAsDefault: true,
      },
    },
    // firestore: {
    //   connector: "firestore",
    //   settings: {
    //     projectId: env("FIREBASE_PROJECT_ID", ""),
    //     keyFilename: `./config/${env("FIREBASE_SERVICE_ACCOUNT", "")}`,
    //   },
    //   options: {
    //     useEmulator: env('NODE_ENV') == 'development',
    //     allowNonNativeQueries: true,
    //   },
    // },
    postgres: {
      connector: "bookshelf",
      settings: {
        client: "postgres",
        host: env("DATABASE_HOST", "localhost"),
        port: env.int("DATABASE_PORT", 5432),
        database: env("DATABASE_NAME", "strapi"),
        username: env("DATABASE_USERNAME", "strapi"),
        password: env("DATABASE_PASSWORD", "strapi"),
        schema: env("DATABASE_SCHEMA", "public"), // Not Required
        ssl: false,
      },
      options: {
        debug: false,
      },
    },
  },
});

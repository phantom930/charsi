module.exports = ({ env }) => ({
  //
  graphql: {
    debug: true,
    endpoint: "/graphql",
    shadowCRUD: true,
    playgroundAlways: false,
    depthLimit: 10,
    amountLimit: 100,
    apolloServer: {
      tracing: false,
    },
  },
  email: {
    provider: "sendgrid",
    providerOptions: {
      apiKey: env("SENDGRID_API_KEY"),
    },
    settings: {
      defaultFrom: env("SENDGRID_SENDER_EMAIL"),
      defaultReplyTo: env("SENDGRID_REPLYTO_EMAIL"),
      testAddress: env("SENDGRID_SENDER_EMAIL"),
    },
  },
  upload: {
    provider: "firebase-storage",
    providerOptions: {
      serviceAccount: require(`./${env("FIREBASE_SERVICE_ACCOUNT", "")}`),
      bucketUrl: env("FIREBASE_STORAGE_BUCKET", "trading-waypoint.appspot.com"),
      useEmulator: env("NODE_ENV") == "development",
    },
  },
});

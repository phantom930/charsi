module.exports = {
  definition: ``,
  mutation: `
    sendChatNotification(recipientID: ID!, chatRoomID: String): Boolean
  `,
  resolver: {
    Mutation: {
      sendChatNotification: {
        description: "Send chat notification",
        policies: ["plugins::users-permissions.isAuthenticated"],
        resolver: "application::notification.notification.sendChatNotification",
      },
    },
  },
};

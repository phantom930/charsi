module.exports = {
  definition: `
    extend type UsersPermissionsMe {
      firstname: String
      lastname: String
      phone: String!
      avatar: UploadFile
      discordAccessToken: String
      stripeCustomerID: String
      balance: Float
      gameAccounts: JSON
      games: [Game]
      favoriteListings: [ListingReward]
      premium: Boolean
      premiumSubscriptionID: String
      description: String
      trades: Boolean
      notificationSettings: JSON
      created_at: DateTime
      updated_at: DateTime
    }

    extend input UsersPermissionsLoginInput {
      discordAccessToken: String
    }

    extend input UsersPermissionsRegisterInput {
      phone: String!
      discordAccessToken: String
      avatar: ID
      games: [ID]
    }
  `,
  mutation: `
    getCharsiBalance: Float
    updateMyNotificationSettings(setting: String, method: String, checked: Boolean!): Boolean
    updateMyFCMRegistrationToken(token: String!): String
  `,
  type: {},
  resolver: {
    Mutation: {
      getCharsiBalance: {
        description: "Get Charsi Balance",
        policies: ["plugins::users-permissions.isAuthenticated"],
        resolverOf: "plugins::users-permissions.user.update",
        resolver: async (_, options, { context }) => {
          const { user } = context.state;

          try {
            const me = await strapi
              .query("user", "users-permissions")
              .findOne({ id: user.id });
            const balance = await strapi.controllers.stripe.getCustomerBalance(
              me.stripeCustomerID
            );
            const updatedUser = await strapi
              .query("user", "users-permissions")
              .update(
                { id: user.id },
                {
                  balance: Number(balance / 100),
                }
              );

            return updatedUser.balance;
          } catch (error) {
            console.log(error);

            throw new Error(error);
          }
        },
      },
      updateMyNotificationSettings: {
        description: "Update my notification settings",
        policies: ["plugins::users-permissions.isAuthenticated"],
        resolverOf: "plugins::users-permissions.user.update",
        resolver: async (_, options, { context }) => {
          const { setting, method, checked } = options;
          const { user } = context.state;

          try {
            const me = await strapi
              .query("user", "users-permissions")
              .findOne({ id: user.id });
            const updatedNotificationSettings = {
              ...me.notificationSettings,
              [setting]: {
                ...me.notificationSettings[setting],
                [method]: checked,
              },
            };

            const updatedUser = await strapi
              .query("user", "users-permissions")
              .update(
                { id: user.id },
                {
                  notificationSettings: updatedNotificationSettings,
                }
              );

            return updatedUser.notificationSettings[setting][method];
          } catch (error) {
            console.log(error);

            throw new Error(error);
          }
        },
      },
      updateMyFCMRegistrationToken: {
        description: "Update my notification settings",
        policies: ["plugins::users-permissions.isAuthenticated"],
        resolverOf: "plugins::users-permissions.user.update",
        resolver: async (_, options, { context }) => {
          const { token } = options;
          const { user } = context.state;

          try {
            const me = await strapi
              .query("user", "users-permissions")
              .findOne({ id: user.id });

            if (me.fcmRegistrationToken === token) return token;
            await strapi.query("user", "users-permissions").update(
              { id: user.id },
              {
                fcmRegistrationToken: token,
              }
            );

            return token;
          } catch (error) {
            console.log(error);

            throw new Error(error);
          }
        },
      },
    },
  },
};

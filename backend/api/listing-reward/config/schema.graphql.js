module.exports = {
  definition: ``,
  query: `
    countListingRewards(start: Int, limit: Int, where: JSON): JSON
  `,
  mutation: `
    countVisitingListingReward(listingRewardID: ID!): Int!
  `,
  type: {},
  resolver: {
    Query: {
      countListingRewards: {
        description: "Count listing rewards",
        resolver:
          "application::listing-reward.listing-reward.countListingRewards",
      },
    },
    Mutation: {
      countVisitingListingReward: {
        description: "Count visiting listing reward",
        policies: ["plugins::users-permissions.isAuthenticated"],
        resolver:
          "application::listing-reward.listing-reward.countVisitingListingReward",
      },
    },
  },
};

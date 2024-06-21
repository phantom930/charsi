module.exports = {
  definition: `
    input NewBidInput {
      rewards: [ID]
      owner: ID
      status: ENUM_BID_STATUS
      decline_reason: ID
      listing_reward: ID
      created_by: ID
      updated_by: ID
    }

    input createNewBidInput {
      data: NewBidInput
    }
  `,
  query: ``,
  mutation: `
    createNewBid(input: createNewBidInput): createBidPayload
    updateBidStatus(bidID: ID, status: ENUM_BID_STATUS): Bid
  `,
  type: {},
  resolver: {
    Mutation: {
      createNewBid: {
        description: "Create new bid",
        policies: ["plugins::users-permissions.isAuthenticated"],
        resolver: "application::bid.bid.createNewBid",
      },
      updateBidStatus: {
        description: "Update bid status",
        policies: ["plugins::users-permissions.isAuthenticated"],
        resolver: "application::bid.bid.updateBidStatus",
      },
    },
  },
};
